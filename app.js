var express = require("express");
var cors = require('cors')
var app = express();
var soap = require('soap');
var xml2js = require('xml2js');

var xmlParser = new xml2js.Parser({explicitArray: false, trim: true});
const apiUrl = "http://www.banxico.org.mx/DgieWSWeb/DgieWS?WSDL";
const puerto = 18080;

app.use(cors());

app.get("/v1/getTipoDeCambio", function (req, res) {
    soap.createClient(apiUrl, function(err, client) {
        if(err) { return res.status(500).json(err); }

        getTipoDeCambio(client, res);
    });
});

app.listen(puerto, function () {
    console.log(`App de tipo de cambio esta corriendo en el puerto ${puerto}`);
});

function getTipoDeCambio(client, res) {
    client.tiposDeCambioBanxico (null, function(err, response) {
        if(err) { return res.status(500).json(err); }

        parseBanxicoResponse(response, res);
    });
}

function parseBanxicoResponse(response, res) {
    xmlParser.parseString(response.result.$value, (err, result) => {
        if(err) { return res.status(500).json(err); }

        tipoDeCambio = result.CompactData['bm:DataSet']['bm:Series'][5]['bm:Obs']['$'].OBS_VALUE;
        return res.json ({ tipoDeCambio });
    });
}