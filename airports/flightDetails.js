const fs = require('fs');
const path = require('path');
const flightNames = ["Air India" , "Air Asia" , "Vistara" , "Indigo" , "Akasa Air"];
const flightLogos = ["https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/AI.png?v=17",
                      "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/SG.png?v=17",
                      "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/UK.png?v=17",
                      "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/6E.png?v=17",                      
                      "https://imgak.mmtcdn.com/flights/assets/media/dt/common/icons/QP.png?v=17"
                      ];
const airportsData = fs.readFileSync(path.join(__dirname , 'airports.json'), 'utf-8');
module.exports = {flightLogos , flightNames , airportsData};