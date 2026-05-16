

const path = require('path');

const load = (file) => require(path.join(__dirname, 'data', file));

function getDatabase() {
  return {
    characters: load('characters.json'),
    films: load('films.json'),
    planets: load('planets.json'),
    species: load('species.json'),
    starships: load('starships.json'),
    vehicles: load('vehicles.json'),
    organizations: load('organizations.json'),
    events: load('events.json'),
    weapons: load('weapons.json'),
    quotes: load('quotes.json'),
  };
}

module.exports = getDatabase;
