////////// CARD-HERO ////////////////
function renderCardHero() {
        pokeName = currentPokemon.name;
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



        let pokeImgLarge = currentPokemon.sprites.other['official-artwork'].front_default;
        document.getElementById("card-hero").innerHTML = /*html*/`
          <img src="${pokeImgLarge}" alt="" id="card-hero-image">
          <div id="right-card-hero">
            <p id="hero-id">${pokeID}</p>
            <h2 id="poke-name">${pokeName}</h2>
            <div id="type-button-container"></div>
      
          </div>
        `
        for (let j = 0; j < currentPokemon.types.length; j++) {
                let pokeType = currentPokemon.types[j].type.name;
                document.getElementById(`overview-type-button-container-${pokeID}`).innerHTML += /*html*/`
                <img class="overview-icon-type" src="/img/${pokeType}.svg" alt="">
            `;
         }
}


//Laden der Startansicht mit der Übersicht der Pokemons
async function loadPokemonOverview(start, end) {
        getPokeList()
        for (let i = start; i <= end; i++) {
                await loadApiInfo(i);
                await loadApiCharacteristics();
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
