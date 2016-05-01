/* jslint node: true */
'use strict'
var generators = require('../generators');

module.exports = {
    title: 'Cherokee hare',
    description: `There\'s a rare species of rabbit called the Cherokee Hare that can 
reproduce at variable rates and never seem to die. We need an engineer to write a 
function to describe it\'s future population size. || Wildlife experts expect to use 
the function like:\n
        
        cherokeeHare({
            startingPopulation: 150,
            birthRate: 10,
            numberOfWeeks: 5,
        });
        
The above function implied that the population starts at 150 and increases at 10% per week. It'll 
return the total population after five weeks. Write the cherokeeHare function.`,
    starter: 'function cherokeeHare(hareStats) {\n\n}',
    difficulty: 2,
    parameters: [generators.Object({
        startingPopulation: generators.Integer({ min: 20, max: 500 }),
        birthRate: generators.Integer({ min: 0, max: 100 }),
        numberOfWeeks: generators.Integer({ min: 2, max: 20 }),
    })],
    solver: function (hareStats) {
        let start = hareStats.startingPopulation;
        
        for (let i = 0; i < hareStats.numberOfWeeks; i++) {
            start += start * (hareStats.birthRate / 100);
        }
        
        return start;
    },
};