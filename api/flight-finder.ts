const rp = require('node-fetch');
const $ = require('cheerio');
const airlines = require('airline-codes');

function formatDate(date: string): Object{
	var year: string = date.split('-')[0];
	var month: string = date.split('-')[1];
	var day: string = date.split('-')[2];
	var result = {day:day, month:month, year:year}
	return result
}

function checkAirline(airline: string): string {
	if (airline != undefined) {
		if (airline.length > 2) {
			airline = airlines.findWhere({ icao: airline }).get('iata')
			return airline
		} else {
			return airline
		}
	} else {
		return ''
	}
}

function quit() {
	setTimeout((function() {
		return process.exit(1);
	}), 100);
}

module.exports = async (req, res) => {
	let departureAirport: string = req.query.departureAirport;
	let arrivalAirport: string = req.query.arrivalAirport;
	let airline: string = req.query.airline;
	let date: string = req.query.date;
	let hour: string = req.query.hour;
	res.setHeader('Content-type', 'application/json')
	// Checking parameters
	if (departureAirport == undefined || arrivalAirport == undefined || date == undefined || hour == undefined){
		var error = { error:"Invalid parameters" }
		res.json(error)
		quit()
	}
	// Getting a full list of airports (and ICAO-IATA codes)
	let airportsRequest = await rp('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
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
				quit()
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
				error = { error: "Invalid parameters" }
				res.json(error)
				quit()
			}
		}
	} else{
		arrivalAirport = airportsList[arrivalAirport.toUpperCase()].iata
	}
	// Format the date (MUST BE IN ISO8601 FORMAT)
	let day: string = formatDate(date)['day'];
	let month: string = formatDate(date)['month'];
	let year: string = formatDate(date)['year'];

	let airlineURL = checkAirline(airline)

	const url = `https://www.flightstats.com/v2/flight-tracker/route/${departureAirport}/${arrivalAirport}/${airline}?year=${year}&month=${month}&date=${day}&hour=${hour}`
	rp(url)
		.then((html) => {
			return html.text()
		})
		.then((html) => {
			
	})

	res.json(arrivalAirport)
}