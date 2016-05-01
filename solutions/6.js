/* jslint node: true */
'use strict'
var generators = require('../generators');

module.exports = {
    title: 'Restaurants and houses',
    description: `Everyone loves living near restaurants. Write a function that accepts 
a single string as an input and returns the number of 'desirable' houses, where 'desirable' 
is defined as being within two blocks of a restaurant. ||

The string will include 'h' for houses and 'r' for restaurants, and each building is a city block.`,
    starter: 'function desirable(street) {\n\n}',
    difficulty: 2,
    parameters: [generators.String({
        prob: {
            r: 0.5,
            h: 0.5,
        },
    })],
    solver: function (street) {
        // TODO: implement solution fofr restaurants and houses
        return 0;
    },
};