const rp = require('node-fetch');
const $ = require('cheerio');
const airlines = require('airline-codes');

module.exports = async (req, res) => {
   let airlineCode = req.query.airlineCode;
   let flightCode = req.query.flightCode;
   // Validating parameters
   if (airlineCode == undefined || flightCode == undefined) {
      var error = {error:"Invalid parameters"}
      res.setHeader('Content-type', 'application/json')
      res.json(error)
   }
   // Validating airlineCode
   if (airlineCode.length > 2) {
      airlineCode = airlines.findWhere({ icao: airlineCode }).get('iata')
   }
   const url = `https://www.flightstats.com/v2/flight-tracker/${airlineCode}/${flightCode}`;
   rp(url)
      .then((html) => {
         return html.text()
      })
      .then((html) => {
         if ('THIS FLIGHT COULD NOT BE LOCATED IN OUR SYSTEM'.indexOf(html) == -1) {
            // Flight not found
            res.setHeader('Content-type', 'application/json')
            res.json({ error: "Flight not found" })
         } else{
           // Flight
           let flight = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > h1', html).text().replace(' Flight Tracker', '').split(') ')[1]
           let status = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__Header-s1rrbl5o-1 > div.ticket__StatusContainer-s1rrbl5o-17 > div.text-helper__TextHelper-s8bko4a-0', html).html().toLowerCase()
           let delay = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__Header-s1rrbl5o-1 > div.ticket__StatusContainer-s1rrbl5o-17 > div.text-helper__TextHelper-s8bko4a-0', html)['1'].children[0].data.toLowerCase()
           let airline = airlines.findWhere({iata:airlineCode}).get('name')
           // Departure
           let departureCode = $('div.ticket__RouteWithPlaneVisibilityWrapper-s1rrbl5o-18.jUFavd > div > div:nth-child(1) > div > div.route-with-plane__AirportCodeLabel-s154xj1h-2.gfzIST.text-helper__TextHelper-s8bko4a-0.fDkXNq > a', html).text()
           let departureAirport = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[2].children[0].data
           let departureCity = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data
           let departureDate = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data.replace(/-/g, '/',)
           let departureHourScheduled = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data + $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0 > span', html)[0].children[0].data
           let departureHourActual = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data + $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0 > span', html)[0].children[0].data
           let departureHourLabel = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(1) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[0].children[0].data.toLowerCase()
           // Arrival
           let arrivalCode = $('div.ticket__RouteWithPlaneVisibilityWrapper-s1rrbl5o-18.jUFavd > div > div:nth-child(3) > div > div.route-with-plane__AirportCodeLabel-s154xj1h-2.gfzIST.text-helper__TextHelper-s8bko4a-0.fDkXNq > a', html).text()
           let arrivalAirport = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[2].children[0].data
           let arrivalCity = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data
           let arrivalDate = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data.replace(/-/g, '/',)
           let arrivalHourScheduled = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data + $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(1) > div.text-helper__TextHelper-s8bko4a-0 > span', html)[0].children[0].data
           let arrivalHourActual = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[1].children[0].data + $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0 > span', html)[0].children[0].data
           let arrivalHourLabel = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(3) > div > div:nth-child(2) > div > div.desktop-ticket-with-button__TicketWithButtons-s1620ulo-0.hOLni > div.ticket__TicketContainer-s1rrbl5o-0 > div.ticket__TicketContent-s1rrbl5o-6 > div:nth-child(2) > div.ticket__TimeGroupContainer-s1rrbl5o-11 > div:nth-child(2) > div.text-helper__TextHelper-s8bko4a-0', html)[0].children[0].data.toLowerCase()
           // Real time data
           let altitude = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(1) > div.flight-mini-tracker__GraphWrapper-s25va3-1 > div > div.alt-and-phase__Wrapper-jihjun-0 > div.alt-and-phase__Altitude-jihjun-1 > span.alt-and-phase__ContentBox-jihjun-3', html).text().replace(' ft', '')
           let altitudeStatus = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(1) > div.flight-mini-tracker__GraphWrapper-s25va3-1 > div > div.alt-and-phase__Wrapper-jihjun-0 > div.alt-and-phase__Phase-jihjun-2 > span', html).text().toLowerCase()
           let speed = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(1) > div.flight-mini-tracker__Charts-s25va3-2 > div:nth-child(2) > div > div.speed__Heading-s15dwb59-0 > span', html).text().replace(' kts', '')
           // Flight timr
           let totalTime = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(1) > h5', html).text()
           let elapsedTime = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(2) > h5', html).text()
           let remainingTime = $('#__next > div.desktop__LayoutWrapper-s43d6t8-0.eOYkkH > section > div:nth-child(4) > div > div:nth-child(2) > div > div > div.tracker__MiniTrackerRow-s1ixqjdu-1.eoLzOB.row__Row-s18xg2xa-0 > div > div:nth-child(2) > div:nth-child(1) > div > div > div > div:nth-child(3) > h5', html).text()
  
           let data = {
              flight: flight,
              status: status,
              delay: delay,
              airline : airline,
              departure: {
                 departureCode: departureCode,
                 departureAirport: departureAirport,
                 departureCity: departureCity,
                 departureDate: departureDate,
                 departureHourScheduled: departureHourScheduled,
                 departureHourActual: departureHourActual,
                 departureHourLabel: departureHourLabel
              },
              arrival: {
                 arrivalCode: arrivalCode,
                 arrivalAirport: arrivalAirport,
                 arrivalCity: arrivalCity,
                 arrivalDate: arrivalDate,
                 arrivalHourScheduled: arrivalHourScheduled,
                 arrivalHourActual: arrivalHourActual,
                 arrivalHourLabel: arrivalHourLabel
              },
              realTime: {
                 altitude: Number(altitude), // In foots
                 altitudeStatus: altitudeStatus,
                 speed: Number(speed) //In knots
              },
              flightTime: {
                 totalTime: totalTime,
                 elapsedTime: elapsedTime,
                 remainingTime: remainingTime
              }
           }
           res.setHeader('Content-type', 'application/json')
           res.json(data)
         } 
      })
      .catch((err) => {
         res.setHeader('Content-type', 'application/json')
         res.json({ error: 'An error occurred' })
      })
}