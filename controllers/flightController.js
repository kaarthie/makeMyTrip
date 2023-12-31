const moment = require('moment'); // for dates generation
const { flightLogos, flightNames, airportsData } = require('../airports/flightDetails.js');
const airports = JSON.parse(airportsData);
const Flight = require('../models/flightModel.js');
const City = require('../models/cityModel.js');
const AirTicket = require('../models/airTicketModel.js')
const PassengerDetails = require('../models/passengerDetailsModel.js')

module.exports.searchFlights = async (req, res) => {
  const { from, to, adultNos, childrenNos, fareType } = req.body;

  if (!from || !from.city || !from.date || !to || !to.city || !fareType) {
    return res.status(400).json({ error: 'Missing required fields. Please provide valid values for "from.city", "from.date", "to.city", and "fareType".' });
  }

  const inputDate = new Date(from.date);
  if (isNaN(inputDate)) {
    res.status(400).json({ message: 'Invalid date format' });
    return;
  }
  if (inputDate.getDate() < new Date().getDate()) {
    res.status(400).json({ message: 'Date is in the past' });
    return;
  }
  let flights = await Flight.find({
    'departure.city': from.city,
    'arrival.city': to.city,
    'departure.date': from.date
  });
  if (flights.length != 0) {
    res.status(200).json(flights);
  }
  else {
    let newFlights = [];
    const givenDateStr = from.date;
    // Parse the given date string to a Date object
    const givenDate = new Date(givenDateStr);

    // Get the current timestamp (milliseconds since January 1, 1970, 00:00:00 UTC)
    const currentTimestamp = Date.now();

    // Create an array to store the timestamps
    const timestamps = [];

    // Generate five timestamps for the same day in the future
    for (let i = 1; i <= 5; i++) {
      const futureTimestamp = givenDate.getTime() + i * 60 * 60 * 1000; // Add i hours
      timestamps.push(new Date(futureTimestamp));
    }

    const distance = await getAirDistance(from.city, to.city);
    const duration = calculateDuration(distance);
    const depAirport = findAirportNameByCity(from.city);
    const arrAirport = findAirportNameByCity(to.city);
    const price = calculatePrice(fareType, distance);
    let ct = 1;
    for (i = 0; i < 5; i++) {
      let newFlight = {
        airline: {
          name: flightNames[i],
          logo: flightLogos[i]
        },
        departure: {
          city: from.city,
          date : from.date,
          time: timestampToHoursMinutesString(timestamps[i]),
          cityCode: from.cityCode,
          airport: depAirport
        },
        arrival: {
          city: to.city,
          time: addDurationToTimestamp(timestamps[i], duration),
          cityCode: to.cityCode,
          airport: arrAirport
        },
        duration: {
          hours: duration.hours,
          minutes: duration.minutes
        },
        price: {
          basePrice: Math.floor(price),
          tax: Math.floor(price / 10),
          total: Math.floor(Math.floor(price + price / 10) * ct)
        }
      };
      const stopsArray = ["Non Stop", "1 stop", "2 stops"];
      function getRandomStop() {
        const randomIndex = Math.floor(Math.random() * stopsArray.length);
        return stopsArray[randomIndex];
      }
      newFlight.stop = getRandomStop();
      let f = new Flight(newFlight);
      newFlight.id = f._id;
      await Flight.create(newFlight);
      newFlights.push(newFlight);
      ct += 0.5;
    }
    res.status(200).json(newFlights);
  }
}

module.exports.airTicket = async (req , res) => {
  try {
    let ticket = new AirTicket(req.body);
    const savedTicket = await ticket.save();
    res.status(201).json({ message: 'Ticket details stored successfully', paymentId: savedTicket.paymentId});
  } catch (error) {
    console.log(error)
  }
}

module.exports.summary = async (req , res) => {
  try {
    const summary = await AirTicket.findOne({paymentId: req.body.paymentId});
    res.status(200).json({summary})
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Internal server error"})
  }
}

module.exports.allFlights = async (req, res) => {
  const flights = await Flight.find({});
  res.send(flights);
}

module.exports.searchCity = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      const results = await City.find({});
      res.json({ cities: results.slice(0, 10) });
      return;
    }

    const regex = new RegExp(`^${query}`, 'i'); // Case-insensitive regex for starts with

    const results = await City.find({ city: regex });

    res.json({ cities: results }); // Wrap the results in an object with a key 'airports'
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.searchCity2 = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    let results = await City.find({});
    results = results.filter((obj) => {
      let city = obj.city.toLowerCase();
      if (city.includes(query.toLowerCase())) return true;
      return false;
    })
    res.json({ cities: results }); // Wrap the results in an object with a key 'airports'
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.storePassengerDetails = async (req, res) => {
  try {
    const { adult, children, infant , flightId} = req.body;

    const passengerDetails = new PassengerDetails({
      flightId,
      adult,
      children,
      infant,
    });

    const savedPassengerDetails = await passengerDetails.save();
    res.status(201).json({ message: 'Passenger details stored successfully', bookingId : savedPassengerDetails._id});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports.getPassengerDetails = async (req, res) => {
  try {
    const passengers = await PassengerDetails.findOne({_id : req.body.bookingId});
    res.status(200).json({ passengers })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
//   Functions for calculation of duration 
function calculatePrice(fareType, distance) {
  let price = 10;
  fareType = fareType.toLowerCase();
  switch (fareType) {
    case "economy": {
      price = price * distance;
      break;
    }
    case "premium economy": {
      price = (price + 5) * distance;
      break;
    }
    case "business": {
      price = (price + 10) * distance;
      break;
    }
    case "first class": {
      price = (price + 15) * distance;
      break;
    }
    default: {
      console.log("Invalid fareType");
    }
  }
  return price;
}

function addDurationToTimestamp(timestampString, duration) {
  // Parse the input timestamp string
  const timestamp = moment(timestampString);

  // Add the duration
  timestamp.add(duration.hours, 'hours');
  timestamp.add(duration.minutes, 'minutes');

  // Get hours and minutes
  const hours = timestamp.format('HH');
  const minutes = timestamp.format('mm');

  // Format and return the resulting time as a string
  const formattedTime = `${hours}:${minutes}`;
  return formattedTime;
}

// Function to convert degrees to radians
function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Function to calculate the Haversine distance between two points
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers

  return distance;
}

// Function to get the coordinates of a place using the OpenCage Geocoding API
async function getCoordinates(place) {
  const apiKey = '3f475b78342a49d29ced1df2b7efb978';
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(place)}&key=${apiKey}`);
  const data = await response.json();

  if (data.results.length > 0) {
    const coordinates = data.results[0].geometry;
    return { lat: coordinates.lat, lon: coordinates.lng };
  } else {
    throw new Error('Could not find coordinates for the specified place.');
  }
}

// Function to find the air distance between two places using their names
async function getAirDistance(place1, place2) {
  try {
    const place1Coords = await getCoordinates(place1);
    const place2Coords = await getCoordinates(place2);

    const distance = haversineDistance(
      place1Coords.lat, place1Coords.lon,
      place2Coords.lat, place2Coords.lon
    );

    return distance;
  } catch (error) {
    console.error(error.message);
  }
}

function calculateDuration(distance) {
  // Calculate time in hours
  const hours = distance / 500;

  // Calculate remaining distance after full hours
  const remainingDistance = distance % 500;

  // Calculate minutes based on remaining distance (since speed is constant)
  const minutes = (remainingDistance / 500) * 60;

  return { hours: Math.floor(hours), minutes: Math.round(minutes) };
}

function findAirportNameByCity(cityName) {
  const lowerCaseCity = cityName.toLowerCase();
  const airport = airports.find(airport => airport.city.toLowerCase() == lowerCaseCity);
  return airport ? airport.name : null;
}

function timestampToHoursMinutesString(timestamp) {
  // Ensure that the input is a valid Date object
  if (!(timestamp instanceof Date)) {
    throw new Error('Invalid timestamp. Must be a Date object.');
  }

  // Get hours and minutes
  const hours = String(timestamp.getHours()).padStart(2, '0');
  const minutes = String(timestamp.getMinutes()).padStart(2, '0');

  // Concatenate hours and minutes with ':' and return the formatted string
  return `${hours}:${minutes}`;
}