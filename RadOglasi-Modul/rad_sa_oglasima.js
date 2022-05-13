const fs = require('fs')
const PATH = "oglasi.json"

// CITANJE PODATAKA

let citajIzFajla=()=>{
    let oglasi = fs.readFileSync(PATH, (err,data) => {
        if (err) throw err
            return data
    });
    return JSON.parse(oglasi)
}

exports.sviOglasi=()=>
{
    return citajIzFajla()
}


// SNIMANJE PODATAKA
let snimiOglase=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data))
}

// DODAVANJE PODATAKA
exports.dodajOglas = (noviOglas) =>{
    let id = 1
    let oglasi = this.sviOglasi()
    if(oglasi.length > 0)
            id = oglasi[oglasi.length-1].id+1
    noviOglas.id = id
    oglasi.push(noviOglas)
    snimiOglase(oglasi)
}
 
// FILTRIRANJE PODATAKA

exports.getOglasById = (id) => {
    return this.sviOglasi().find(oglas => oglas.id == id)
}

exports.getOglasByKategorija = (kategorija) => {
    return this.sviOglasi().filter(oglas => oglas.kategorija == kategorija)
}


// BRISANJE PODATAKA
exports.obrisiOglas = (id) => {
    snimiOglase(this.sviOglasi().filter(oglas => oglas.id != id))
}


// AZURIRANJE PODATKA
exports.azurirajOglas = (azuriranOglas) => {
    let index = 0
    let oglasi = this.sviOglasi()
    let noviId = parseInt(azuriranOglas.id)
    azuriranOglas.id = noviId

    for(i = 0; i <= oglasi.length-1; i++)
    {
        if(oglasi[i].id == noviId) index = i
    }

    oglasi.splice(index,1,azuriranOglas)
    snimiOglase(oglasi)
}


