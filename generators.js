/* jslint node: true */
'use strict'
var seedrandom = require('seedrandom');
var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function Generator() {
    this.rng = null;
    this.properties = {};

    return this;
}

Generator.prototype.seed = function (seed) {
    this.rng = seedrandom(seed);
};

Generator.prototype.set = function (prop, val) {
    this.properties[prop] = val;
};

Generator.prototype.random = function () {
    return this.rng();
};

/**
 * Each generator accepts certain parameters and returns a function that
 * generates the specified value, keeping the specified parameters in mind.
 * Generators are likely to be invoked many times and should account for that.
 */
module.exports = {
    Integer: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('min', props.min || 0);
        gen.set('max', props.max || 1000);
        gen.next = function () {
            return Math.round(this.random() * this.properties.max);
        };

        return gen;
    },
    String: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('min', 0);
        gen.set('max', 1000);
        gen.set('distr', props.prob);

        let available = {};
        let totalProb = 0.0;
        let explicitLetters = [];
        // Copy over all known letters.
        for (let letter in props.prob) {
            available[letter] = props.prob[letter];
            totalProb += props.prob[letter];
            
            explicitLetters.push(letter);
        }
        
        for (let letter of letters) {
            // When we find a letter that hasn't been added yet, add it with a share of
            // the remaining probability.
            if (explicitLetters.indexOf(letter) === -1) {
                available[letter] = (1.0 - totalProb) / (letters.length - explicitLetters.length);            
            }
        }
        
        gen.next = function () {
            var length = Math.round(this.random() * 30);
            var chars = [];
           
            for (let i = 0; i < length; i++) {
                // Select a random probability
                let prob = this.random(); 

                // Iterate through all available letters until we exceed the cumultative probability
                // from above.
                for (let ltr = 0; ltr < letters.length; ltr++) {
                    let current = letters[ltr];
                    prob -= available[current];
                    
                    if (prob <= 0) {
                        chars.push(current);
                        break;
                    }              
                }
            }

            return chars.join('');
        };

        return gen;
    },
    NumArray: function (props) {
        props = props || {};

        var gen = new Generator();
        gen.set('distr', props.prob);
        gen.next = function () {
            var length = this.random();
            var nums = [];

            for (var i = 0; i < length; i++) {
                nums.push(this.random());
            }

            return nums;
        };

        return gen;
    },
    Object: function (props) {
        props = props || {};
        var gen = new Generator();
        
        var orig = gen.seed.bind(gen);
        gen.seed = function (seed) {
            orig(seed);
            
            var i = 2;
            for (var p in props) {
                props[p].seed((seed * i) % 100000);
                i++;
            }
        };
        
        gen.next = function () {
            var obj = {};          
            
            for (var p in props) {
                obj[p] = props[p].next();            
            }
            
            return obj
        };
        
        return gen;
    }
};