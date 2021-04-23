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

module.exports = async (req, res) => {
	let departureAirport: string = req.query.departureAirport;
	let arrivalAirport: string = req.query.arrivalAirport;
	let airline: string = req.query.airline;
	let date: string = req.query.date;
	let hour: string = req.query.hour;
	res.setHeader('Content-type', 'application/json')
	let error = null;
	// Checking parameters
	if (departureAirport == undefined || arrivalAirport == undefined || date == undefined || hour == undefined) {
		error = { error:"Invalid parameters" }
	}
	// Getting a full list of airports (and ICAO-IATA codes)
	let airportsRequest = await rp('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json')
	let airportsList = await airportsRequest.json()
	// Validating departureAirport
	if (airportsList[departureAirport.toUpperCase()] == undefined){
		for (var airport in airportsList) {
			if (airportsList[airport].iata == departureAirport.toUpperCase()){
				departureAirport = departureAirport.toUpperCase()
				error = null
				break;
			} else {
				error = { error: "Invalid parameters" }
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
				error = null
				break;
			}else{
				error = { error: "Invalid parameters" }
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

	const url = `https://www.flightstats.com/v2/flight-tracker/route/${departureAirport}/${arrivalAirport}/${airlineURL}?year=${year}&month=${month}&date=${day}&hour=${hour}`
	let result;
	rp(url)
		.then((html) => {
			return html.text()
		})
		.then((html) => {
			let root = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div > div.table__TableContainer-s1x7nv9w-5.jfmExz > div.table__Table-s1x7nv9w-6.iiiADv', html)[0].children;
			root.shift()
			var flights = [];
			root.forEach(element => {
				var flightAirline = element.attribs.href.split('/')[3];
				var flightCode = element.attribs.href.split('/')[4].split('?')[0];
				var departure = element.children[0].children[0].children[1].children[0].children[0].data;
				var arrival = element.children[0].children[0].children[2].children[0].children[0].data;
				var flightAirlineName = airlines.findWhere({ iata: flightAirline }).get('name');
				var obj = {
					airline: flightAirline,
					airlineName: flightAirlineName,
					flight: flightCode,
					departure: departure,
					arrival: arrival
				}
				flights.push(obj)
			});
			result = flights
		})
		.finally(() => {
			if (error == null) {
				res.json(result)
			} else {
				res.json(error)
			}
		})
}