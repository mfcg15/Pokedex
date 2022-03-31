const pokedexCover = document.querySelector("#pokedex-cover");
const nombrePokemon = document.getElementById("txt_pokemon");
const screenTipo = document.getElementById("screenTipo");
const ImagenPokemon = document.getElementById("ImagenPokemon");
const screenWeight = document.getElementById("screenWeight");
const screenHeight = document.getElementById("screenHeight");
const arrowNext = document.getElementById("arrow-next");
const arrowBack = document.getElementById("arrow-back");
const arrowUp = document.getElementById("arrow-up");
const arrowDown = document.getElementById("arrow-down");
const btnEscuchar = document.getElementById("btnEscuchar");
const led = document.getElementById("led");

const colores = [" ","#b8ba92","#ce4d5c","#b9a5f7", "#b168ae", "#e2ce87", "#c4b557","#b8c54e","#8f7bad","#c5c6db","#f69a58", "#85a6f4","#7ece56",
"#f7da5f","#f5739d", "#b1dce3","#895df2","#8e786d","#f2adc0"];
const luz = ["rgb(35 142 184)","#0293f1"]

let cover = 0, idPokemon = 0, contador = 0, contadorLuz = 0,contadorTiempo = 0;
let listaEvoluciones = [], listaTipos = [];
let mytimer ;

let pokedexCoverFunc = () => 
{   
    if (cover % 2 == 0) 
    {
        pokedexCover.classList.remove('is-pokedex-open')
        screenTipo.innerHTML = "";
        screenWeight.innerHTML = "";
        screenHeight.innerHTML = "";
        ImagenPokemon.innerHTML  = "";
        ImagenPokemon.classList.remove("creen-show-pokemon-fondo");
        nombrePokemon.value = "";
        arrowUp.style.display = 'none';
        arrowDown.style.display = 'none';
        idPokemon = 0;
        contador = 0;
    }
    else
    {
        pokedexCover.classList.add('is-pokedex-open');
    }

    cover++
}

nombrePokemon.addEventListener("keydown",(e) =>
{
    if(e.key=="Enter")
    {
        if(nombrePokemon.value=="")
        {
            hablar("Debe ingresar el nombre del pokemon a buscar")
        }
        else
        {
            obtenerPokemon(nombrePokemon.value.toLowerCase());
        }
    }
});


async function obtenerPokemon(pokemon)
{
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(response.status == 404)
    {
        hablar(`Ingrese un nombre valido`)
    }
    else
    {
        let responseJson = await response.json()
        nombrePokemon.value = responseJson.name
        obtenerEvoluciones(pokemon)
        obtenerImagen(pokemon)
        peso = parseFloat(responseJson.weight/10)
        altura = parseFloat(responseJson.height/10)
        screenWeight.innerHTML = `<p class="letraColor">Peso: ${peso} kg</p>`
        screenHeight.innerHTML = `<p class="letraColor">Altura: ${altura} m</p>`
    
        screenTipo.innerHTML = `<div class = "conten_letra_tipo">
                                    <p class = "letra_tipo">Tipo</p>
                                </div>`
    
        if(responseJson.types.length>1)
        {
            obtenerTipos(responseJson.types[0].type.name,responseJson.types[1].type.name)
        }
        else
        {
            obtenerTipo(responseJson.types[0].type.name)
        }
    
        idPokemon = responseJson.id
    }
}

async function obtenerTipo(tipo)
{
    let response = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
    let responseJson = await response.json()
    let idC = responseJson.id
    let listaType = []
    listaType.push(responseJson.names[5].name)
    screenTipo.innerHTML += `<div class="campo_un_tipo">
                                <div>
                                    <p class="letter_tipo" style="background-color: ${colores[idC]};">${responseJson.names[5].name}</p>
                                </div>
                            </div>`;
    retornoTipos(listaType)
}

async function obtenerTipos(tipo1,tipo2)
{
    let response = await fetch(`https://pokeapi.co/api/v2/type/${tipo1}`);
    let responseJson = await response.json()
    let idColor = responseJson.id
    let type1 = responseJson.names[5].name
    let listaType = []
    listaType.push(type1)

    let response1 = await fetch(`https://pokeapi.co/api/v2/type/${tipo2}`);
    let responseJson1 = await response1.json()
    let idColo = responseJson1.id
    let type2 = responseJson1.names[5].name
    listaType.push(type2)
    screenTipo.innerHTML += `<div class= "conte_varios_tipos">
                                <div class="campo_varios_tipos">
                                    <div>
                                        <p  class="letter_tipo" style="background-color: ${colores[idColor]};">${type1}</p>
                                    </div>
                                </div>
                                <div class="campo_varios_tipos">
                                    <div>
                                        <p class="letter_tipo" style="background-color: ${colores[idColo]};">${type2}</p>
                                    </div>
                                </div>
                            </div>`;
    retornoTipos(listaType)
}

async function obtenerImagen(pokemon)
{
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${pokemon}`);
    let responseJson = await response.json()
    ImagenPokemon.innerHTML  = `<img src="${responseJson.sprites.front_default}" alt="Imagen de${pokemon}" class= "Imagen-Pokemon">`;
    ImagenPokemon.classList.add("creen-show-pokemon-fondo");
}

async function obtenerEvoluciones(pokemon)
{
    let response = await fetch(` https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
    let responseJson = await response.json()
    let urlevoluciones = responseJson.evolution_chain.url
    let consultaEvoluacion = await fetch(` ${urlevoluciones}`);
    let evolucionJson = await consultaEvoluacion.json()
    let evolution = evolucionJson.chain
    let listaEvoluacione  = []
    if(evolution.evolves_to.length>0)
    {
        arrowUp.style.display = 'block';
        arrowDown.style.display = 'block';
        listaEvoluacione.push(evolution.species.name)
        evolution.evolves_to.forEach(element => {
            listaEvoluacione.push(element.species.name)
            if(element.evolves_to.length>0)
            {
                let x = element.evolves_to
                x.forEach(i =>{
                    listaEvoluacione.push(i.species.name)
                });
            }
        });

        retorno(listaEvoluacione)
    }
    else
    {
        arrowUp.style.display = 'none';
        arrowDown.style.display = 'none';
    }
}

function retorno(lista)
{
    listaEvoluciones = [];

    for(let i = 0; i < lista.length;i++)
    {
        listaEvoluciones.push(lista[i])
    }
}

function retornoTipos(lista)
{
    listaTipos = [];

    for(let i = 0; i < lista.length;i++)
    {
        listaTipos.push(lista[i])
    }

    incioSpeak()
}

function incioSpeak()
{
    if(listaTipos.length==1)
    {
        if(contador==0)
        {
            hablar(`${nombrePokemon.value} es un pokemon de tipo ${listaTipos[0]}`);
        }
        else
        {
            hablar(`${nombrePokemon.value} es la evolucion de ${listaEvoluciones[contador-1]}, es un pokemon de tipo ${listaTipos[0]}`)
        }
    }
    else
    {
        if(contador==0)
        {
            hablar(`${nombrePokemon.value} es un pokemon de tipo ${listaTipos[0]} y ${listaTipos[1]}`);
        }
        else
        {
            hablar(`${nombrePokemon.value} es la evolucion de ${listaEvoluciones[contador-1]}, es un pokemon de tipo ${listaTipos[0]} y ${listaTipos[1]}`)
        }
    }
}

const mostrar = () =>
{
    contadorLuz++;
    contadorTiempo++;
    if(contadorLuz>1) contadorLuz = 0;
    led.style.backgroundColor = `${luz[contadorLuz]}`;
    if(contadorTiempo==25)
    {
        clearInterval(mytimer)
        contadorTiempo=0;
    }
}

function hablar (texto)
{
    mytimer = setInterval(mostrar,150)
    let msg = new SpeechSynthesisUtterance();
    msg.text = texto;
    msg.lang = 'es-MX'
    window.speechSynthesis.speak(msg)
}

let siguienteEvolucion = () => 
{
    let maxAumentar = listaEvoluciones.length
    contador = listaEvoluciones.indexOf(nombrePokemon.value)

    contador++;

    if(contador==maxAumentar)
    {
        contador=0;
    }

    obtenerPokemon(listaEvoluciones[contador])
    
}

let anteriorEvolucion = () => 
{
    let maxAumentar = listaEvoluciones.length
    contador = listaEvoluciones.indexOf(nombrePokemon.value)

    if(contador==0)
    {
        contador = maxAumentar-1;
    }
    else
    {
        contador--;
    }

    obtenerPokemon(listaEvoluciones[contador])
}

let avanzar = () => 
{
    if(idPokemon==898)
    {
        idPokemon=0;
    }

    if(listaEvoluciones.length==0)
    {
        idPokemon++;
    }
    else
    {
        let aumnetar = listaEvoluciones.length-1
        idPokemon++;
        idPokemon = idPokemon+aumnetar
    }
    obtenerPokemon(idPokemon)
}

let retroceder = () => 
{
    if(idPokemon==0)
    {
        idPokemon=899;
    }

    if(listaEvoluciones.length==0)
    {
        idPokemon--;
    }
    else
    {
        let disminuir = listaEvoluciones.length-1
        idPokemon--;
        idPokemon = idPokemon-disminuir
    }
    
    obtenerPokemon(idPokemon)
}

let rec = new webkitSpeechRecognition();
rec.lang = 'es-ES';
rec.continous = true;
rec.interimResults = false;

rec.onresult = (event) =>
{
    const results = event.results;
    const frase = results[results.length-1][0].transcript;
    nombrePokemon.value += frase;
    let buscar = nombrePokemon.value;
    if(buscar.indexOf("Busca")>-1 || buscar.indexOf("busca")>-1)
    {
        let splits = buscar.split(' ')
        let poke = splits[1].toLowerCase()
        obtenerPokemon(poke)
    }
}


btnEscuchar.addEventListener('click',() =>{rec.start();});
pokedexCover.addEventListener("click", pokedexCoverFunc)
arrowNext.addEventListener("click", avanzar)
arrowBack.addEventListener("click", retroceder)
arrowUp.addEventListener("click", siguienteEvolucion)
arrowDown.addEventListener("click", anteriorEvolucion)
