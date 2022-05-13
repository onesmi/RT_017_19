const { response } = require('express')
var express = require('express')
var oglasiServis = require('radoglasi-modul')
var app = express()
const port = 3000

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get('/',(req,res) => {
    res.send("SERVER RADI")
});

app.get('/svioglasi',(req,res) => {
    res.send(oglasiServis.sviOglasi())
});

app.post('/dodajoglas',(req,res) => {
    res.send(oglasiServis.dodajOglas(req.body))
});

app.delete('/obrisioglas/:id',(req,res) => {
    oglasiServis.obrisiOglas(req.params["id"])
    res.end("OK")
});

app.get('/getoglasbyid/:id',(req,res) => {
    res.send(oglasiServis.getOglasById(req.params["id"]))
});

app.get('/getoglasbykategorija/:kategorija',(req,res) => {
    res.send(oglasiServis.getOglasByKategorija(req.params["kategorija"]))
});

app.put('/azurirajoglas',(req,res) => {
    oglasiServis.azurirajOglas(req.body)
    res.send("OK")
});

app.listen(port, ()=> {console.log(`Startovan server na portu ${port}`);})