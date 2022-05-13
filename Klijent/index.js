const express = require("express")
const fs = require("fs")
const app = express()
const path = require("path")
const axios = require("axios")
const { response } = require("express")
const port = 5000



app.use(express.urlencoded({ extended:false }))
app.use(express.json())

let procitajPogled = (naziv) => {
    return fs.readFileSync(path.join(__dirname+"/view/"+naziv+".html"),"utf-8")
}

app.get("/",(req,res) => {
    res.send(procitajPogled("index"))
});



// PRIKAZ SVIH OGLASA
app.get("/svioglasi",(req,res) => {

    axios.get('http://localhost:3000/svioglasi')
    .then(response => {
        let prikaz=""
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datum_isteka}</td>
            <td>${element.cena}</td>
            <td>${element.valuta}</td>
            <td>${element.tekst_oglasa}</td>
            <td>${element.oznaka}</td>
            <td>${element.e_posta}</td>
            <td><a href="/azuriraj/${element.id}">Azuriraj oglas</td>
            <td><a href="/obrisi/${element.id}">Obrisi oglas</td>
            </tr>`
        });

        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz))
    })
    .catch(error => {
        console.log(error);
    });

});


//BRISANJE OGLASA
app.get("/obrisi/:id",(req,res) => {
    axios.delete(`http://localhost:3000/obrisioglas/${req.params["id"]}`)
    res.redirect("/svioglasi")
});


//DODAVANJE OGLASA
app.get("/dodajoglas",(req,res) => {
    res.send(procitajPogled("addoglas"))
});

//SNIMI OGLAS
app.post("/snimioglas",(req,res) => {
    axios.post("http://localhost:3000/dodajoglas",{
        kategorija:req.body.kategorije,
        datum_isteka:req.body.datum_isteka,
        cena:req.body.cena,
        valuta:req.body.valuta,
        tekst_oglasa:req.body.tekst_oglasa,
        oznaka:req.body.oznaka,
        e_posta:req.body.e_posta
    })
    res.redirect("/svioglasi")
});


//FILTRIRANJE OGLASA
app.post("/filtrirajbykategorija",(req,res) => {

    axios.get(`http://localhost:3000/getoglasbykategorija/${req.body.kategorije}`)
    .then(response => {
        let prikaz=""
        response.data.forEach(element => {
            prikaz+=`<tr>
            <td>${element.id}</td>
            <td>${element.kategorija}</td>
            <td>${element.datum_isteka}</td>
            <td>${element.cena}</td>
            <td>${element.valuta}</td>
            <td>${element.tekst_oglasa}</td>
            <td>${element.oznaka}</td>
            <td>${element.e_posta}</td>
            <td><a href="/azuriraj/${element.id}">Azuriraj oglas</td>
            <td><a href="/obrisi/${element.id}">Obrisi oglas</td>
            </tr>`
        });

        res.send(procitajPogled("svioglasi").replace("#{data}",prikaz))
    })
    .catch(error => {
        console.log(error);
    });

});



//AZURIRANJE OGLASA
app.get("/azuriraj/:id",(req,res) => {
    axios.get(`http://localhost:3000/getoglasbyid/${req.params["id"]}`)
    .then(response => {

        // kategorije
        let prikaz=""
        let kat = ["Automobili","Stanovi","Alati","Poducavanje"]
        let izabrana = ""
        let index = 0

        for(i=0;i<=kat.length-1;i++)
        {
            if(kat[i]==response.data.kategorija)
            {
                 index = i
                 izabrana = kat[i]
                 kat.splice(index,1)
            }
        }
        kat.splice(0,0,izabrana)

       


        prikaz+=`
            <input type="number" id="id" name="id" value="${response.data.id}" style="opacity: 0;"><br><br>
            <label for="" style="font-size: 16px ;">Naziv kategorije</label>
            <select name="kategorije" id="kategorije">
                <option value="${kat[0]}" selected>${kat[0]}</option>
                <option value="${kat[1]}">${kat[1]}</option>
                <option value="${kat[2]}">${kat[2]}</option>
                <option value="${kat[3]}">${kat[3]}</option>
            </select><br><br>
            <label for="" style="font-size: 16px ;">Datum isteka</label><input type="date" id="datum_isteka" name="datum_isteka" value="${response.data.datum_isteka}"><br><br>
            <label for="" style="font-size: 16px ;">Cena</label><input type="number" id="cena" name="cena" min="0" value="${response.data.cena}">
            <select name="valuta" id="valuta">
            <option value="${response.data.valuta}" selected>${response.data.valuta}</option>
            </select>
            <br><br>
            <textarea name="tekst_oglasa" id="tekst_oglasa" cols="30" rows="10" minlength="10" maxlength="180" placeholder="Unesite tekst oglasa">${response.data.tekst_oglasa}</textarea><br><br>
            <label for="" style="font-size: 16px ;">Oznaka</label><input type="text" name="oznaka" id="oznaka" value="${response.data.oznaka}"><br><br>
            <label for="" style="font-size: 16px ;">E-mail</label><input type="email" name="e_posta" id="e_posta" value="${response.data.e_posta}"><br><br>
            <button type="submit">Azuriraj oglas</button>`;

        res.send(procitajPogled("azurirajoglas").replace("#{data}",prikaz))
    })
    .catch(error => {
        console.log(error);
    });
});


//SNIMI AZURIRANJE
app.post("/snimiazuriranje",(req,res) => {
    axios.put("http://localhost:3000/azurirajoglas",{
        id:req.body.id,
        kategorija:req.body.kategorije,
        datum_isteka:req.body.datum_isteka,
        cena:req.body.cena,
        valuta:req.body.valuta,
        tekst_oglasa:req.body.tekst_oglasa,
        oznaka:req.body.oznaka,
        e_posta:req.body.e_posta
    })
    res.redirect("/svioglasi")
});



app.listen(port, () => {console.log(`klijent na portu ${port}`);})


