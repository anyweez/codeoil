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

    it('generates arrays of numbers of various lengths', function () {
        var gen = generators.NumArray();
        gen.seed(Date.now());

        for (var i = 0; i < test_iterations; i++) {
            var arr = gen.next();
            expect(arr).to.be.an('array');
        }
    });
});