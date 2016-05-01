/* jslint node: true */
'use strict'
var generators = require('../generators');

module.exports = {
    title: 'Generous tipper',
    description: `Jeb eats out at restaurants all the time but is horrible at math. He decides to 
write a function called bonus() that returns the amount that he should tip. || The function should 
accept a single parameter (the cost of the meal), and should return the tip Jeb should give his 
waiter. Jeb uses two rules to calculate tips:

  - First he always tips 20% on the original bill.
  - He then rounds up to the nearest dollar. For example, if the total with tip is $22.78, he'd round up to $23.00.`,
    starter: 'function tip(amount) {\n\n}',
    difficulty: 2,
    parameters: [generators.Float()],
    solver: function (bill) {
        return Math.ceil(bill * 1.2);
    },
};