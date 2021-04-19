const fetch = require('node-fetch');
const $ = require('cheerio');

module.exports = async (req, res) =>{
	let departureAirport = req.query.departureAirport;
	let arrivalAirport = req.query.arrivalAirport;
	let airline = req.query.airline;
	let date = req.query.date;
	let hour = req.query.hour;
	res.setHeader('Content-type', 'application/json')
	// Checking parameters
	if (departureAirport == undefined || arrivalAirport == undefined || airline == undefined || date == undefined || hour == undefined){
		error = { error:"Invalid parameters" }
		res.json(error)
		setTimeout((function() {
			return process.exit(1);
		}), 100);
	}
	// Getting a full list of airports (and ICAO-IATA codes)
	let airportsRequest = await fetch('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
	let airportsList = await airportsRequest.json()
	// Validating departureAirport
	if (airportsList[departureAirport.toUpperCase()] == undefined){
		for (var airport in airportsList){
			if (airportsList[airport].iata == departureAirport.toUpperCase()){
				departureAirport = departureAirport.toUpperCase()
				break;
			}else{
				error = { error:"Invalid parameters" }
				res.json(error)
				setTimeout((function() {
					return process.exit(1);
				}), 100);
			}
		}
	} else{
		departureAirport = airportsList[departureAirport.toUpperCase()].iata
	}
	// Validating arrivalAirport
	if (airportsList[arrivalAirport.toUpperCase()] == undefined){
		for (var airport in airportsList){
			if (airportsList[airport].iata == arrivalAirport.toUpperCase()){
				arrivalAirport = arrivalAirport.toUpperCase()
				break;
			}else{
				error = { error:"Invalid parameters" }
				//res.json(error)
				setTimeout((function() {
					return process.exit(1);
				}), 100);
			}
		}
	} else{
		arrivalAirport = airportsList[arrivalAirport.toUpperCase()].iata
	}
	// Format the date
	

	res.json(arrivalAirport)
}