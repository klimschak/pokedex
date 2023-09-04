let currentPokemon;
let currentAbility;

let abilityUrl;
let currentEvolution;
let chainEvolution0;
let chainEvolutionImg0;
let chainEvolution1;
let chainEvolutionImg1;
let chainEvolution2;
let chainEvolutionImg2;
let pokeName = "bulbasaur";
let pokeUrl;
let pokeData;
let pokeList;
let currentPokeCard;

fetchAllPokemonNames().then(names => {
  console.log("Alle Pokemons:", names); // Hier hast du das Array mit den Namen der Pokémon
});
//loadPokemonList()

// Start Variable für das Laden weitere Pokemon
let x = 1;
let y = 20;

let typeColors = [
  { type: "normal", color: "#C6C6A7" },
  { type: "fire", color: "#FFAB60" },
  { type: "water", color: "#9DB7F5" },
  { type: "grass", color: "#A7DB8D" },
  { type: "electric", color: "#FFD86F" },
  { type: "ice", color: "#BCE2E8" },
  { type: "fighting", color: "#D56723" },
  { type: "poison", color: "#B084AC" },
  { type: "ground", color: "#EBD69D" },
  { type: "flying", color: "#C6B7F5" },
  { type: "psychic", color: "#FA92B2" },
  { type: "bug", color: "#C6D16E" },
  { type: "rock", color: "#D1C17D" },
  { type: "ghost", color: "#A292BC" },
  { type: "dragon", color: "#A27DFA" },
  { type: "dark", color: "#8D8D68" },
  { type: "steel", color: "#D1D1E0" },
  { type: "fairy", color: "#F4BDC9" }
];
// Diese Funktion nimmt einen Typ als Parameter und gibt den zugehörigen Farbcode zurück
function getColorCode(type) {
  // Durch Array-Durchlauf suchen wir nach einem Objekt, dessen Typ übereinstimmt
  let typeObject = typeColors.find(function (item) {
    return item.type === type;
  });

  // Wenn das Objekt gefunden wurde, geben wir den Farbcode zurück
  if (typeObject) {
    return typeObject.color;
  } else {
    return null; // Falls der Typ nicht gefunden wurde, geben wir null zurück
  }
}

// Wir rufen die Funktion getColorCode auf, um den Farbcode für den Typ "fire" zu erhalten
let fireColorCode = getColorCode("fire");

// Überprüfen, ob der Typ in der Liste gefunden wurde
if (fireColorCode !== null) {
  // Wenn der Farbcode gefunden wurde, geben wir ihn im Konsolenprotokoll aus
  console.log("The color code for type fire is " + fireColorCode);
} else {
  // Wenn der Typ nicht in der Liste gefunden wurde, geben wir eine Nachricht aus
  console.log("Type not found in the color list.");
}

async function init() {
  getPokeList()
    await loadApiInfo(pokeName);

  await renderCardHero()
  
  
}

// Funktion um Pokemonnamen zuzuordnen, um die richtigen Apis und die Pokedetails zu laden
function setPokeName(newPokemon) {
  pokeName = newPokemon;
  currentPokeCard = newPokemon;
  console.log()
  init()
}


function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // Verwende 'auto' für sofortiges Scrollen
  });
}

async function loadPokemonList() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon-species/');
  pokeData = await response.json();

}

async function loadApiInfo(pokemon) {
  let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
  let pokeResponse = await fetch(pokeUrl);
  currentPokemon = await pokeResponse.json();
}

async function loadApiInfoParam(apiName) {
  let pokeUrl = `https://pokeapi.co/api/v2/pokemon/${apiName}`;
  let pokeResponse = await fetch(pokeUrl);
  let apiData = await pokeResponse.json();
  return apiData
}

async function getPokeList() {
  let pokeUrl = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=1010`;
  let pokeResponse = await fetch(pokeUrl);
  pokeList = await pokeResponse.json();
  logList = pokeList.results[0];
  console.log("Listeintrag:", logList);

}



////////// CARD-HERO ////////////////
async function renderCardHero() {
  pokeName = await currentPokemon.name;
  currentPokeCard = await currentPokemon;
  
  let pokeID = currentPokemon.id;
  //Darstellung der ID je nach Größe der Zahl
  if (pokeID < 10) {
          pokeID = "#000" + pokeID

  }
  if (pokeID < 100) {
          pokeID = "#00" + pokeID

  }
  if (pokeID < 1000) {
          pokeID = "#0" + pokeID

  }
  if (pokeID >= 1000) {
          pokeID = "#" + pokeID

  }

  
  let pokeImgLarge = await currentPokemon.sprites.other['official-artwork'].front_default;
  document.getElementById("card-hero").innerHTML = /*html*/`
    <img src="${pokeImgLarge}" alt="" id="card-hero-image">
    
    <div id="right-card-hero">
    <button id="abort"onclick="closeOverlay()"><img src="/img/abort.svg" alt="" ></button>
      <p id="hero-id">${pokeID}</p>
      <h2 id="poke-name">${currentPokeCard.name}</h2>
      <div id="type-button-container"></div>

    </div>
  `
  for (let j = 0; j < currentPokeCard.types.length; j++) {
          let pokeType = await currentPokeCard.types[j].type.name;
          document.getElementById(`type-button-container`).innerHTML += /*html*/`
          <button class="type-button ${pokeType}"><img class="type-button-icon" src="/img/${pokeType}.svg" alt=""><span>${pokeType}</span></button>
        
      `;
      
   }
   let color01 = await currentPokeCard.types[0].type.name;
      let color02;

              if (currentPokemon.types[1]) {
                      color02 = await currentPokeCard.types[1].type.name;
              }
              else {
                      color02 = 0
              }

              let bgcolor01
              let bgcolor02

              if (color02 == 0) {
                      bgcolor01 = getColorCode(color01);
                      document.getElementById(`card-hero`).style.background = bgcolor01;
              }
              else {
                      bgcolor01 = getColorCode(color01);
                      bgcolor02 = getColorCode(color02);

                      document.getElementById(`card-hero`).style.background = `linear-gradient(45deg, ${bgcolor01} 0%, ${bgcolor02})`;
              }
              await renderAbout()
}


////////// ABOUT-Section ////////////////
async function renderAbout() {
  document.getElementById(`about`).classList.add("active");
  document.getElementById(`stats`).classList.remove("active");
  document.getElementById(`abilities`).classList.remove("active");

  
  let pokeWeight = await currentPokeCard.weight;
  let pokeHeight = await currentPokeCard.height;
  let pokeBaseExp = await currentPokeCard.base_experience;

  
 

  
  document.getElementById("card-content").innerHTML = /*html*/`
    
    <h3>Overview</h3>
    <div class="overview">
      <div class="row-about"><div class="left-row-about">Weight:</div><div class="right-row-about">${pokeWeight}</div></div>
      <div class="row-about"><div class="left-row-about">height:</div><div class="right-row-about">${pokeHeight}</div></div>
      <div class="row-about"><div class="left-row-about">BaseEXP:</div><div class="right-row-about">${pokeBaseExp}</div></div>
    </div>
  `
 await loadApiEvolution();
  await getEvolutions();
  document.getElementById("card-content").innerHTML +=
    /*html*/`
    <h3>Evolutions</h3>
    <div id="evolutions">
        <div class="row-evolution" onclick="setPokeName('${chainEvolution0}')"><div class="left-row-evolution"><img class="evo-image" src="${chainEvolutionImg0}"></div><div class="right-row-evolution">${chainEvolution0}</div><div class="evolink"><img src="/img/arrow_back.svg" alt=""></div></div>
        <div class="row-evolution" onclick="setPokeName('${chainEvolution1}')"><div class="left-row-evolution" onclick="setPokeName('${chainEvolution1}')"><img class="evo-image" src="${chainEvolutionImg1}"></div><div class="right-row-evolution">${chainEvolution1}</div><div class="evolink"><img src="/img/arrow_back.svg" alt=""></div></div>
        
    </div>`

  if (chainEvolution2 != 0) {
    document.getElementById("evolutions").innerHTML += /*html*/`
      <div class="row-evolution" onclick="setPokeName('${chainEvolution2}')"><div class="left-row-evolution" onclick="setPokeName('${chainEvolution2}')"><img class="evo-image" src="${chainEvolutionImg2}"></div><div class="right-row-evolution">${chainEvolution2}</div><div class="evolink"><img src="/img/arrow_back.svg" alt=""></div></div>
      `
  }
  else {
    document.getElementById("evolutions").innerHTML += /*html*/`
      
      `
  }
}


async function loadApiEvolution() {
  let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokeName}`;
  const speciesResponse = await fetch(speciesUrl);
  currentSpecies = await speciesResponse.json();

  let evolutionUrl = currentSpecies.evolution_chain.url;
  const evolutionResponse = await fetch(evolutionUrl);
  currentEvolution = await evolutionResponse.json();

  if (currentEvolution.chain.species.name) {
    chainEvolution0 = currentEvolution.chain.species.name;
    chainEvolutionImg0 = await loadApiInfoParam(chainEvolution0);
    chainEvolutionImg0 = chainEvolutionImg0.sprites.other['official-artwork'].front_default;
  }

  if (currentEvolution.chain.evolves_to[0]) {
    chainEvolution1 = currentEvolution.chain.evolves_to[0].species.name;
    chainEvolutionImg1 = await loadApiInfoParam(chainEvolution1);
    chainEvolutionImg1 = chainEvolutionImg1.sprites.other['official-artwork'].front_default;
  }

  if (currentEvolution.chain.evolves_to[0] && currentEvolution.chain.evolves_to[0].evolves_to[0] && currentEvolution.chain.evolves_to[0].evolves_to[0].species) {
    chainEvolution2 = currentEvolution.chain.evolves_to[0].evolves_to[0].species.name;
    chainEvolutionImg2 = await loadApiInfoParam(chainEvolution2);
    chainEvolutionImg2 = chainEvolutionImg2.sprites.other['official-artwork'].front_default;
  }
  else {
    chainEvolution2 = 0;
  }
}


function getEvolutions() {
  for (let i = 0; i < currentEvolution.chain.evolves_to.length; i++) {
    let pokeEvolution = currentEvolution.chain.evolves_to[i].species.name;
    return pokeEvolution;
  }
}




////////// Stats-Section ////////////////
function renderStats() {
  //Aktualisieren der Tab / Ausgewählte Element auf Active setzen
  document.getElementById(`about`).classList.remove("active");
  document.getElementById(`stats`).classList.add("active");
  document.getElementById(`abilities`).classList.remove("active");

  document.getElementById("card-content").innerHTML = /*html*/`
    <h3>Statistics</h3>
    <div id="poke-stat-container"></div>
    `
  // Gehe durch jede Statistik in der Schleife
  for (let i = 0; i < currentPokemon.stats.length; i++) {
    const statName = currentPokemon.stats[i].stat.name; // Statistikname
    const baseStat = currentPokemon.stats[i].base_stat; // Basiswert der Statistik

    

    document.getElementById("poke-stat-container").innerHTML += /*html*/`
    <div class="poke-stat">
      <div class="statname">${statName}:</div> 
      <div class="statvalue" >${baseStat}</div>
      <div id="statbar-container"><div class="statbar" id="statbar-${i}"></div></div>
    </div>`;
     document.getElementById(`statbar-${i}`).style.width = `${baseStat*1.5}px`;
  }
}


////////// Abilities-Section ////////////////
async function renderAbilities() {
  //Aktualisieren der Tab / Ausgewählte Element auf Active setzen
  document.getElementById(`about`).classList.remove("active");
  document.getElementById(`stats`).classList.remove("active");
  document.getElementById(`abilities`).classList.add("active");

  document.getElementById("card-content").innerHTML = /*html*/`
  <h3>Abilities</h3>
  <div id="abilities-container"></div>
  `
  for (let i = 0; i < currentPokemon.abilities.length; i++) {
    let pokeAbility = currentPokemon.abilities[i].ability.name;
    let pokeAbilityEffect = await loadAbility(pokeAbility);
    document.getElementById("abilities-container").innerHTML += /*html*/`
      <div class="poke-ability">
      <h4>${pokeAbility}</h4>
      <p>${pokeAbilityEffect}</p>
    `
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


// Parameter für Start und Endpunkt der For-Schleife um weitere Pokemonszuladen
function loadPokemons() {
  let start = x;
  let end = y;
  loadPokemonOverview(start, end);
}


//Wenn die Funktion ausgelöst wird der Start und Endpunkt der Schleife zum nachladen der Pokemons erhöht
function loadMorePokemons() {
  x = x + 20;
  y = y + 20;
  loadPokemons()
}


//Laden der Startansicht mit der Übersicht der Pokemons
async function loadPokemonOverview(start, end) {
  getPokeList()
  for (let i = start; i <= end; i++) {
    await loadApiInfo(i);

    await loadApiEvolution();
    let pokeID = currentPokemon.id;

    //Darstellung der ID je nach Größe der Zahl
    if (pokeID < 10) {
      pokeID = "#000" + pokeID

    }
    if (pokeID < 100) {
      pokeID = "#00" + pokeID

    }
    if (pokeID < 1000) {
      pokeID = "#0" + pokeID

    }
    if (pokeID >= 1000) {
      pokeID = "#" + pokeID

    }

    //Die Übersichtskarte eine Pokemons in der Startansicht
    let pokeImgLarge = currentPokemon.sprites.other['official-artwork'].front_default;

    document.getElementById("overview").innerHTML += /*html*/`
      <div class="overview-poke-card" id="overview-pokemon-card-${i}" onclick="setPokeName(${i}), pokeDetails()">
        <img src="${pokeImgLarge}" alt="" class="card-image">
        <div class="overview-card-info">
          <p class="pokemon-id">${pokeID}</p>
          <h2 class="pokemon-name">${currentPokemon.name}</h2>
          <div class="overview-type-buttons" id="overview-type-button-container-${pokeID}"></div>
        </div>
      </div>
    `;

    for (let j = 0; j < currentPokemon.types.length; j++) {
      let pokeType = currentPokemon.types[j].type.name;
      document.getElementById(`overview-type-button-container-${pokeID}`).innerHTML += /*html*/`
        <img class="overview-icon-type" src="/img/${pokeType}.svg" alt="">
      `;

      let color01 = currentPokemon.types[0].type.name;
      let color02;

      if (currentPokemon.types[1]) {
        color02 = currentPokemon.types[1].type.name;
      }
      else {
        color02 = 0
      }

      let bgcolor01
      let bgcolor02

      if (color02 == 0) {
        bgcolor01 = getColorCode(color01);
        document.getElementById(`overview-pokemon-card-${i}`).style.background = bgcolor01;
      }
      else {
        bgcolor01 = getColorCode(color01);
        bgcolor02 = getColorCode(color02);

        document.getElementById(`overview-pokemon-card-${i}`).style.background = `linear-gradient(45deg, ${bgcolor01} 0%, ${bgcolor02})`;
      }
    }
  }
}


// erstelle Array mit allen pokemons
async function fetchAllPokemonNames() {
  const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1010";
  const response = await fetch(url);
  const data = await response.json();

  const pokemonNames = data.results.map(pokemon => pokemon.name);
  return pokemonNames;
}


//Overlay mir Pokemondetails
async function pokeDetails() {
  document.getElementById("overlay-container").innerHTML = /*html*/`
  <div id="overlay">
     <div id="pokemoncard">
      <div id="card-hero"></div>
      <div class="tab-navigation">
            <button class="tab-button" id="about" data-tab="about" onclick="renderAbout()">About</button>
            <button class="tab-button" id="stats" data-tab="stats" onclick="renderStats()">Stats</button>
            <button class="tab-button" id="abilities" data-tab="abilities" onclick="renderAbilities()">Abilities</button>
      </div>
      <div id="card-content"></div>
  </div>
  `
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeOverlay();
    }
  });
}

//Overlay mit Pokemondetails schließen
function closeOverlay() {
  document.getElementById("overlay-container").innerHTML = /*html*/`
  `

}


