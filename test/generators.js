var expect = require('chai').expect;
var generators = require('../generators');

var test_iterations = 10000;

describe('generators work as expected', function () {
    it('generates integers', function () {
        var gen = generators.Integer();
        gen.seed(Date.now());

        for (var i = 0; i < test_iterations; i++) {
            var num = gen.next();
            expect(num).to.be.a('number');
            expect(Math.round(num)).to.be.equal(num);
        }
    });

    it('generates strings of various lengths', function () {
        var gen = generators.String();
        gen.seed(Date.now());

        for (var i = 0; i < test_iterations; i++) {
            var str = gen.next();
            expect(str).to.be.a('string');
        }
    });
    
    it('generates strings based on probability distributions', function () {
        // Test with two characters that sum to 100%
        var gen = generators.String({
            prob: {
                x: 0.5,
                y: 0.5,
            },
        });
        
        gen.seed(Date.now());
        
        for (var i = 0; i < test_iterations; i++) {
            var str = gen.next();
            expect(str).to.be.a('string');
            expect(str.replace(/[xy]+/g, '')).to.have.length(0);
        }
        
        // Test with two characters that sum to 100%
        gen = generators.String({
            prob: {
                a: 0.4,
                b: 0.4,
                c: 0.2,
            },
        });
        
        gen.seed(Date.now());
        
        for (var i = 0; i < test_iterations; i++) {
            var str = gen.next();
            expect(str).to.be.a('string');
            expect(str.replace(/[abc]+/g, '')).to.have.length(0);
        }
    });

    it('generates arrays of numbers of various lengths', function () {
        var gen = generators.NumArray();
        gen.seed(Date.now());

        for (var i = 0; i < test_iterations; i++) {
            var arr = gen.next();
            expect(arr).to.be.an('array');
        }
    });
    
    it('generates objects that contain other generators as properties', function () {
        var gen = generators.Object({
            first: generators.Integer(),
            second: generators.Integer(),
        });
        
        gen.seed(Date.now());

        for (var i = 0; i < test_iterations; i++) {
            var arr = gen.next();
            expect(arr).to.be.an('object');
            expect(arr).to.have.property('first');
            expect(arr).to.have.property('second');
            expect(arr.first).to.be.a('number');
            expect(arr.second).to.be.a('number');
        }
    });
});