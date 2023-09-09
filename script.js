let abilityUrl;
let chainEvolution0;
let chainEvolution1;
let chainEvolution2;
let chainEvolutionImg0;
let chainEvolutionImg1;
let chainEvolutionImg2;
let currentAbility;
let currentPokeCard;
let currentPokemon;
let isLoading = false; //Variable um das nachladen der Pokemons zu kontrollieren
let pokeData;
let pokeList;
let pokemonNamesArray = [];//Array in der die Namen aller Pokemons gespeichert werden
let pokeName = "bulbasaur";
let pokeUrl;
let x = 1; // Start Variable für das Laden weitere Pokemon
let y = 30; // Start Variable für das Laden weitere Pokemon
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

async function fetchAllPokemonNames() { // erstelle Ein Array mit allen pokemons
  const url = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1010";
  const response = await fetch(url);
  const data = await response.json();

  const pokemonNames = data.results.map(pokemon => pokemon.name);
  return pokemonNames;
}

//Befüllen des Arrays
fetchAllPokemonNames().then(names => {
  pokemonNamesArray = names; // Weise die Namen dem Array zu
  console.log("Alle Pokemons:", pokemonNamesArray);
  filterNames()
});

//Pokemonliste filtern für die Suche
function filterNames() {
  let search = document.getElementById('search-input').value;
  search = search.toLowerCase();
  console.log('filterNames:', search);
  let list = document.getElementById(`pokelist`);
  list.innerHTML = ``;
  for (let i = 0; i < pokemonNamesArray.length; i++) {
    const name = pokemonNamesArray[i];
    ifSearchIsValid(name, list, search);
    ifSearchisEmpty(search);
    ifSearchHasOneLetter(search, list);
  }
  ifSearchHasNoResults(search, list);
}

function ifSearchIsValid(name, list, search) {
  if (search.length >= 2 && name.toLowerCase().includes(search)) {
    list.innerHTML +=/*html*/ `<li onclick="setPokeName('${name}'), pokeDetails()">${name}<img src="./img/arrow_back.svg"></li>`
    document.getElementById(`search-result-container`).classList.remove("d-none");
    document.getElementById(`close-search`).classList.remove("d-none");
    document.getElementById(`input-notice`).classList.add("d-none");
  }
}

function ifSearchisEmpty(search) {
  if (search.length === 0) {
    document.getElementById(`search-result-container`).classList.add("d-none");
    document.getElementById(`close-search`).classList.add("d-none");
    document.getElementById(`input-notice`).classList.add("d-none");
  }
}

function ifSearchHasOneLetter(search, list) {
  if (search.length === 1) {
    list.innerHTML =/*html*/ `<h2>Enter at least two letters.</h2>`
    document.getElementById(`search-result-container`).classList.remove("d-none");
    document.getElementById(`close-search`).classList.remove("d-none");
    document.getElementById(`input-notice`).classList.add("d-none");
  }
}

function ifSearchHasNoResults(search, list) {
  if (search.length >= 2 && list.childElementCount === 0) {
    list.innerHTML =/*html*/ `<h2>Unfortunately, no results.<br /> Please check and modify your search.</h2>`
    document.getElementById(`search-result-container`).classList.remove("d-none");
    document.getElementById(`close-search`).classList.remove("d-none");
    document.getElementById(`input-notice`).classList.add("d-none");
  }
}

function closeSearch() {
  document.getElementById("search-input").value = "";
  document.getElementById(`search-result-container`).classList.add("d-none");
  document.getElementById(`close-search`).classList.add("d-none");
  document.getElementById(`input-notice`).classList.add("d-none");
}

async function init() {
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

////////// CARD-HERO ////////////////
async function renderCardHero() {
  pokeName = await currentPokemon.name;
  currentPokeCard = await currentPokemon;
  let pokeID = currentPokemon.id;
  pokeID = renderPokeID(pokeID);
  renderPokeHero(pokeID);
  createBGColor();
  renderTypeButtons();
  await renderAbout()
}

function renderPokeID(ID) {
  //Darstellung der ID je nach Größe der Zahl
  if (ID < 10) {
    ID = "#000" + ID
  }
  if (ID < 100) {
    ID = "#00" + ID
  }
  if (ID < 1000) {
    ID = "#0" + ID
  }
  if (ID >= 1000) {
    ID = "#" + ID
  }
  return ID;
}

async function renderPokeHero(pokeID) {
  let pokeImgLarge = await currentPokemon.sprites.other['official-artwork'].front_default;
  document.getElementById("card-hero").innerHTML = renderHtmlPokeHero(pokeID, pokeImgLarge);
}

async function createBGColor() {
  let type01 = await currentPokeCard.types[0].type.name;
  let type02;
  if (currentPokeCard.types[1]) {
    type02 = await currentPokeCard.types[1].type.name;
    type01 = getColorCode(type01);
    type02 = getColorCode(type02);
    document.getElementById(`card-hero`).style.background = `linear-gradient(45deg, ${type01} 0%, ${type02})`;
  }
  else {
    type01 = getColorCode(type01);
    document.getElementById(`card-hero`).style.background = bgcolor01;
  }

}

// Passende Farbe zum Type zurückgeben
function getColorCode(type) {

  let typeObject = typeColors.find(function (item) {
    return item.type === type;
  }); //Durchsuchen des arrays TypeColors

  if (typeObject) {
    return typeObject.color; // Wenn das Objekt gefunden wurde, geben wir den Farbcode zurück
  } else {
    return null; // Falls der Typ nicht gefunden wurde, geben wir null zurück
  }
}

async function renderTypeButtons() {
  for (let j = 0; j < currentPokeCard.types.length; j++) {
    let pokeType = await currentPokeCard.types[j].type.name;
    document.getElementById(`type-button-container`).innerHTML += /*html*/`
          <button class="type-button ${pokeType}"><img class="type-button-icon" src="./img/${pokeType}.svg" alt=""><span>${pokeType}</span></button>
      `;
  }
}

// Tab Navigation mit selektiertem Element ausgeben
function setTabNavigationTo(tab) {
  document.getElementById(`about`).classList.remove("active");
  document.getElementById(`stats`).classList.remove("active");
  document.getElementById(`abilities`).classList.remove("active");
  document.getElementById(tab).classList.add("active");
}

////////// ABOUT-Section ////////////////
async function renderAbout() {
  setTabNavigationTo('about');
  loadAboutOverview()
  await loadApiEvolution(pokeName);
}


async function loadAboutOverview() {
  let pokeWeight = await currentPokeCard.weight;
  let pokeHeight = await currentPokeCard.height;
  let pokeBaseExp = await currentPokeCard.base_experience;
  document.getElementById("card-content").innerHTML = renderHtmlOverview(pokeWeight, pokeHeight, pokeBaseExp); 
}

async function loadApiEvolution() {
  let currentSpecies = await getFromApiSpecies(pokeName);
  let currentEvolution = await getFromApiEvolution(currentSpecies);
  document.getElementById("card-content").innerHTML += /*html*/`<h3>Evolutions</h3><div id="evolutions">`;
  let evolution = document.getElementById("evolutions");
  await ifAvailableLoadEvolution0(evolution, currentEvolution);
  await ifAvailableLoadEvolution1(evolution, currentEvolution);
  await ifAvailableLoadEvolution2(evolution, currentEvolution);
}

async function getFromApiSpecies(param) {
  let speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${param}`;
  const speciesResponse = await fetch(speciesUrl);
  let currentSpecies = await speciesResponse.json();
  return currentSpecies;
}

async function getFromApiEvolution(currentSpecies) {
  let evolutionUrl = currentSpecies.evolution_chain.url;
  const evolutionResponse = await fetch(evolutionUrl);
  currentEvolution = await evolutionResponse.json();
  return currentEvolution;
}

async function ifAvailableLoadEvolution0(evolution, currentEvolution) {
  if (currentEvolution.chain.species.name) {
    chainEvolution0 = currentEvolution.chain.species.name;
    chainEvolutionImg0 = await loadApiInfoParam(chainEvolution0);
    chainEvolutionImg0 = chainEvolutionImg0.sprites.other['official-artwork'].front_default;
    evolution.innerHTML = /*html*/`
      <div class="row-evolution" onclick="setPokeName('${chainEvolution0}')"><div class="left-row-evolution" onclick="setPokeName('${chainEvolution0}')"><img class="evo-image" src="${chainEvolutionImg0}"></div><div class="right-row-evolution">${chainEvolution0}</div><div class="evolink"><img src="./img/arrow_back.svg" alt=""></div></div>`
  }
}

async function ifAvailableLoadEvolution1(evolution, currentEvolution) {
  if (currentEvolution.chain.evolves_to[0]) {
    chainEvolution1 = currentEvolution.chain.evolves_to[0].species.name;
    chainEvolutionImg1 = await loadApiInfoParam(chainEvolution1);
    chainEvolutionImg1 = chainEvolutionImg1.sprites.other['official-artwork'].front_default;
    evolution.innerHTML += /*html*/`
      <div class="row-evolution" onclick="setPokeName('${chainEvolution1}')"><div class="left-row-evolution" onclick="setPokeName('${chainEvolution1}')"><img class="evo-image" src="${chainEvolutionImg1}"></div><div class="right-row-evolution">${chainEvolution1}</div><div class="evolink"><img src="./img/arrow_back.svg" alt=""></div></div>`
  }
}

async function ifAvailableLoadEvolution2(evolution, currentEvolution) {
  if (currentEvolution.chain.evolves_to[0].evolves_to[0].species) {
    chainEvolution2 = currentEvolution.chain.evolves_to[0].evolves_to[0].species.name;
    chainEvolutionImg2 = await loadApiInfoParam(chainEvolution2);
    chainEvolutionImg2 = chainEvolutionImg2.sprites.other['official-artwork'].front_default;
    evolution.innerHTML += /*html*/`
      <div class="row-evolution" onclick="setPokeName('${chainEvolution2}')"><div class="left-row-evolution" onclick="setPokeName('${chainEvolution2}')"><img class="evo-image" src="${chainEvolutionImg2}"></div><div class="right-row-evolution">${chainEvolution2}</div><div class="evolink"><img src="./img/arrow_back.svg" alt=""></div></div>`
  }
}

////////// Stats-Section ////////////////
function renderStats() {
  setTabNavigationTo('stats');
  renderStatTitle()
  loadStatBars()
}

function renderStatTitle() {
  document.getElementById("card-content").innerHTML = /*html*/`
    <h3>Statistics</h3>
    <div id="poke-stat-container"></div>
    `
}

// Gehe durch jede Statistik in der Schleife
function loadStatBars() {
  for (let i = 0; i < currentPokemon.stats.length; i++) {
    const statName = currentPokemon.stats[i].stat.name; // Statistikname
    const baseStat = currentPokemon.stats[i].base_stat; // Basiswert der Statistik
    document.getElementById("poke-stat-container").innerHTML += loadHtmlStatBars(statName, baseStat, i);
    document.getElementById(`statbar-${i}`).style.width = `${baseStat * 1.5}px`;
  }
}

////////// Abilities-Section ////////////////
async function renderAbilities() {
  setTabNavigationTo('abilities');
  renderAbilitiesTitle();
  loadAbilities();
}

function renderAbilitiesTitle() {
  document.getElementById("card-content").innerHTML = /*html*/`
  <h3>Abilities</h3>
  <div id="abilities-container"></div>
  `
}

async function loadAbilities() {
  for (let i = 0; i < currentPokemon.abilities.length; i++) {
    let pokeAbility = currentPokemon.abilities[i].ability.name;
    let pokeAbilityEffect = await loadAbility(pokeAbility);
    document.getElementById("abilities-container").innerHTML += /*html*/`
      <div class="poke-ability">
      <h4>${pokeAbility}</h4>
      <p>${pokeAbilityEffect}</p>`;
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
    }
  }
}

//Laden der Startansicht mit der Übersicht der Pokemons
async function loadPokemonOverview(start, end) {
  for (let i = start; i <= end; i++) {
    await loadApiInfo(i);
    let pokeID = currentPokemon.id;
    pokeID = renderPokeID(pokeID);
    renderPokemonOverviewCard(pokeID, i);
    createOverviewBGColor(i);
    loadOverviewTypes(pokeID)
  }
  isLoading = false; //Wenn die Pokemons geladen wurden, wird der Status auf false gesetzt. Es können nun weitere Pokemons geladen werden.
}

function renderPokemonOverviewCard(pokeID, i) {
  let pokeImgLarge = currentPokemon.sprites.other['official-artwork'].front_default;
  document.getElementById("overview").innerHTML += renderHtmlPokemonOverviewCard(pokeID, i, pokeImgLarge);
}

async function createOverviewBGColor(i) {
  let color01 = await currentPokemon.types[0].type.name;
  let color02;
  if (currentPokemon.types[1]) {
    color02 = await currentPokemon.types[1].type.name;
    color01 = getColorCode(color01);
    color02 = getColorCode(color02);
    document.getElementById(`overview-pokemon-card-${i}`).style.background = `linear-gradient(45deg, ${color01} 0%, ${color02})`;
  }
  else {
    color01 = getColorCode(color01);
    document.getElementById(`overview-pokemon-card-${i}`).style.background = color01;
  }
}

function loadOverviewTypes(pokeID) {
  for (let j = 0; j < currentPokemon.types.length; j++) {
    let pokeType = currentPokemon.types[j].type.name;
    document.getElementById(`overview-type-button-container-${pokeID}`).innerHTML += /*html*/`
      <img class="overview-icon-type" src="./img/${pokeType}.svg" alt="">`;
  }
}

//Overlay mir Pokemondetails
function pokeDetails() {
  document.getElementById("overlay-container").innerHTML = renderHtmlpokeDetails();
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    closeOverlay();
  }
});

//Overlay mit Pokemondetails schließen
function closeOverlay() {
  document.getElementById("overlay-container").innerHTML = /*html*/`
  `
}

// Parameter für Start und Endpunkt der For-Schleife um weitere Pokemonszuladen
function loadPokemons() {
  let start = x;
  let end = y;
  loadPokemonOverview(start, end);
}

//Wenn die Funktion ausgelöst wird der Start und Endpunkt der Schleife zum nachladen der Pokemons erhöht
function loadMorePokemons() {
  if (isLoading) return; // Wenn aktuell geladen wird, dann wird die Funktion abgebrochen
  isLoading = true; // Wenn isLoading = false ist. Ist das nachladen erlaubt. der Status wird daher auf true gesetzt.
  x = x + 30;
  y = y + 30;
  loadPokemons()
}

window.addEventListener("scroll", function () {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition / pageHeight) * 100;
    //Hier wird geprüft, ob das Seitenende erreicht wurde und ob nicht gerade Pokemons nachgeladen werden
    if (scrollPercentage >= 99 && !isLoading) {
      loadMorePokemons();
    }
  }
);

function loadHtmlStatBars(statName, baseStat, i){
  return /*html*/`
  <div class="poke-stat">
    <div class="statname">${statName}:</div> 
    <div class="statvalue" >${baseStat}</div>
    <div class="statbar-container"><div class="statbar" id="statbar-${i}"></div></div>
  </div>`;
}

function renderHtmlpokeDetails(){
  return /*html*/`
  <div id="overlay">
     <div id="pokemoncard">
      <div id="card-hero"></div>
      <div class="tab-navigation">
            <button class="tab-button" id="about" data-tab="about" onclick="renderAbout()">About</button>
            <button class="tab-button" id="stats" data-tab="stats" onclick="renderStats()">Stats</button>
            <button class="tab-button" id="abilities" data-tab="abilities" onclick="renderAbilities()">Abilities</button>
      </div>
      <div id="card-content"></div>
  </div>`;
  }
  
  function renderHtmlPokemonOverviewCard(pokeID, i, pokeImgLarge){
    return /*html*/`
    <div class="overview-poke-card" id="overview-pokemon-card-${i}" onclick="setPokeName(${i}), pokeDetails()">
      <img src="${pokeImgLarge}" alt="" class="card-image">
      <div class="overview-card-info">
        <p class="pokemon-id">${pokeID}</p>
        <h2 class="pokemon-name">${currentPokemon.name}</h2>
        <div class="overview-type-buttons" id="overview-type-button-container-${pokeID}"></div>
      </div>
    </div>`;
  }

function renderHtmlPokeHero(pokeID, pokeImgLarge){
  return /*html*/`
  <img src="${pokeImgLarge}" alt="" id="card-hero-image">
  <div id="right-card-hero">
  <button id="abort"onclick="closeOverlay()"><img src="./img/abort.svg" alt="" ></button>
    <p id="hero-id">${pokeID}</p>
    <h2 id="poke-name">${currentPokeCard.name}</h2>
    <div id="type-button-container"></div>
  </div>`
}

function renderHtmlOverview(pokeWeight, pokeHeight, pokeBaseExp) {
  return /*html*/` <h3>Overview</h3>
   <div class="overview">
     <div class="row-about"><div class="left-row-about">Weight:</div><div class="right-row-about">${pokeWeight}</div></div>
     <div class="row-about"><div class="left-row-about">height:</div><div class="right-row-about">${pokeHeight}</div></div>
     <div class="row-about"><div class="left-row-about">BaseEXP:</div><div class="right-row-about">${pokeBaseExp}</div></div>
   </div>`
 }