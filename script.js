let currentPokemon;
let currentAbility;
let currentCharacteristic;
let abilityUrl;
let currentEvolution;

let chainEvolution0;
let chainEvolution0Img;
let chainEvolution1;
let chainEvolution1Img;
let chainEvolution2;
let chainEvolution2Img;
let pokeName = "charizard";
let pokeUrl;

let pokeData;

async function init() {
  await loadApiInfo(pokeName);
  await loadApiCharacteristics();
  await loadApiEvolution()
  renderAbout()
  renderPokemonInfo()
  renderCardHero()
  renderStats ()
  loadPokemonList()



}

async function loadPokemonList() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/');
  pokeData = await response.json();

}

async function loadApiInfo(pokeName) {
  
  let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
  let pokeResponse = await fetch(pokeUrl);
  currentPokemon = await pokeResponse.json();

}

async function loadApiInfoParam(apiName) {
  let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${apiName}`;
  let pokeResponse = await fetch(pokeUrl);
  let apiData = await pokeResponse.json();
  return apiData
}







async function loadApiCharacteristics() {
  let characteristicUrl = "https://pokeapi.co/api/v2/characteristic/1";
  const characteristicResponse = await fetch(characteristicUrl);
  currentCharacteristic = await characteristicResponse.json();
}

async function loadApiEvolution() {
  let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokeName}`;
  const speciesResponse = await fetch(speciesUrl);
  currentSpecies = await speciesResponse.json();

  let evolutionUrl = currentSpecies.evolution_chain.url;
  const evolutionResponse = await fetch(evolutionUrl);
  currentEvolution = await evolutionResponse.json();

  chainEvolution0 = currentEvolution.chain.species.name;
  chainEvolution0Img = await loadApiInfoParam(chainEvolution0);
  chainEvolution0Img = chainEvolution0Img.sprites.other.dream_world.front_default;

  chainEvolution1 = currentEvolution.chain.evolves_to[0].species.name;
  chainEvolution1Img = await loadApiInfoParam(chainEvolution1);
  chainEvolution1Img = chainEvolution1Img.sprites.other.dream_world.front_default;

  chainEvolution2 = currentEvolution.chain.evolves_to[0].evolves_to[0].species.name;
  //Url der Evolution für spätere verlinkung
  //chainEvolutionLink2 = currentEvolution.chain.evolves_to[0].evolves_to[0].species.url;
  chainEvolution2Img = await loadApiInfoParam(chainEvolution2);
  chainEvolution2Img = chainEvolution2Img.sprites.other.dream_world.front_default;




}




function renderPokemonInfo() {
  // Allgemeine Informationen
  pokeName = currentPokemon.name;

  let pokeImgDefault = currentPokemon.sprites.front_default;
  let pokeImgShiny = currentPokemon.sprites.front_shiny;
  let pokeImgLarge = currentPokemon.sprites.other.dream_world.front_default;
  //let pokeEvolution = currentEvolution.chain.evolves_to[0].species.name  ;


  let characteristicDescription = getCharacteristicDescription();
  



  // Fähigkeiten






  document.getElementById("info-list").innerHTML += `<div><img src="${pokeImgDefault}"></img></div>`;
  document.getElementById("info-list").innerHTML += `<div><img src="${pokeImgShiny}"></img></div>`;

  document.getElementById("info-list").innerHTML += `<div><div>Description:</div> <div>${characteristicDescription}</div></div>`;
  

  


  displayAbilities();

}





function getEvolutions() {

  for (let i = 0; i < currentEvolution.chain.evolves_to.length; i++) {
    let pokeEvolution = currentEvolution.chain.evolves_to[i].species.name;
    return pokeEvolution;
  }


}

function getCharacteristicDescription() {
  for (let i = 0; i < currentCharacteristic.descriptions.length; i++) {
    if (currentCharacteristic.descriptions[i].language.name === "en") {
      let currentCharacteristicEN =
        currentCharacteristic.descriptions[i].description;
      return currentCharacteristicEN;
      break; // Beende die Schleife, sobald die englische Übersetzung gefunden wurde
    }
  }
}

////////// CARD-HERO ////////////////

function renderCardHero() {
  pokeName = currentPokemon.name;
  let pokeID = currentPokemon.id;
  let pokeImgLarge = currentPokemon.sprites.other.dream_world.front_default;
  document.getElementById("card-hero").innerHTML = /*html*/`
    <img src="${pokeImgLarge}" alt="" id="card-hero-image">
    <div id="right-card-hero">
                  <p id="hero-id">#00${pokeID}</p>
                  <h2 id="poke-name">${pokeName}</h2>
                  <div id="type-button-container"></div>

    </div>
  `
  for (let i = 0; i < currentPokemon.types.length; i++) {
    let pokeType = currentPokemon.types[i].type.name;
    document.getElementById("type-button-container").innerHTML += /*html*/`
    <button class="type-button button-${pokeType}"><img class="icon-type" src="/img/${pokeType}-icon.svg" alt=""><span>${pokeType}</span></button>
  `
  }

}

////////// ABOUT-Section ////////////////
function renderAbout () {
  let pokeWeight = currentPokemon.weight;
  let pokeHeight = currentPokemon.height;
  let pokeBaseExp = currentPokemon.base_experience;
  document.getElementById("card-content").innerHTML = /*html*/`
    <h3>Overview</h3>
    <div class="overview">
      <div class="row-about"><div class="left-row-about">Weight:</div><div class="right-row-about">${pokeWeight}</div></div>
      <div class="row-about"><div class="left-row-about">height:</div><div class="right-row-about">${pokeHeight}</div></div>
      <div class="row-about"><div class="left-row-about">BaseEXP:</div><div class="right-row-about">${pokeBaseExp}</div></div>

      

    </div>
  `

getEvolutions();
document.getElementById("card-content").innerHTML += /*html*/`
  <h3>Evolutions</h3>
  <div id="evolutions">
      <div class="row-evolution"><div class="left-row-evolution"><img class="evo-image" src="${chainEvolution0Img}"></div><div class="right-row-evolution">${chainEvolution0}</div></div>
      <div class="row-evolution"><div class="left-row-evolution"><img class="evo-image" src="${chainEvolution1Img}"></div><div class="right-row-evolution">${chainEvolution1}</div></div>
      <div class="row-evolution"><div class="left-row-evolution"><img class="evo-image" src="${chainEvolution2Img}"></div><div class="right-row-evolution">${chainEvolution2}</div></div>


  </div>
`

}

function renderStats () {
  document.getElementById("card-content").innerHTML = /*html*/`
    <h3>Statistics</h3>
    <div id="poke-stat-container"></div>
    `
  // Gehe durch jede Statistik in der Schleife
  for (let i = 0; i < currentPokemon.stats.length; i++) {
    const statName = currentPokemon.stats[i].stat.name; // Statistikname
    const baseStat = currentPokemon.stats[i].base_stat; // Basiswert der Statistik

    document.getElementById("poke-stat-container").innerHTML += `<div id="poke-stat"><div>${statName}</div> <div>${baseStat}</div></div>`;
  }

}


async function displayAbilities() {
  for (let i = 0; i < currentPokemon.abilities.length; i++) {
    let pokeAbility = currentPokemon.abilities[i].ability.name;
    let pokeAbilityEffect = await loadAbility(pokeAbility);

    

    document.getElementById("info-list").innerHTML += `<div><div>Ability:</div> <div>${pokeAbility}</div></div>`;
    document.getElementById("info-list").innerHTML += `<div><div>Ability:</div> <div>${pokeAbilityEffect}</div></div>`;
  }
}


async function loadAbility(id) {
  abilityUrl = `https://pokeapi.co/api/v2/ability/${id}`;
  const abilityResponse = await fetch(abilityUrl);
  currentAbility = await abilityResponse.json();
  for (let i = 0; i < currentAbility.effect_entries.length; i++) {
    if (currentAbility.effect_entries[i].language.name === "en") {
      let currentAbilityEN = currentAbility.effect_entries[i].effect;
      return currentAbilityEN;
      break; // Beende die Schleife, sobald die englische Übersetzung gefunden wurde
    }
  }
}