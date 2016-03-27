/* jslint evil: true, node: true, esnext: true */
var solution = require('/* @echo SOLUTION_PATH */');

onmessage = function (event) {
    /**
     * Running `eval` in a separate function so that it doesn't get 
     * unauthorized access to any local variables. Still fairly insecure
     * it seems...
     */
    function loadFunc(raw) {
        raw = 'var func = ' + raw;
        eval(raw);

        // func is built from eval'ing the above code.
        return func;
    }

    var config = {
        iterations: event.data.iterations || 1000,
    };

    // Eval the user's code and create a function that we can use to evaluate.
    var userFunc = loadFunc(event.data.code);
    // Import the parameter list.
    var parameters = solution.parameters;

    var failures = 0;
    var lastNotification = 0.0;
    for (var i = 0; i < config.iterations; i++) {
        // Generate a new set of params using the specified parameter generators.
        var params = parameters.map(function (gen) {
            return gen();
        });

        // TODO: compare outputs more thoroughly
        if (userFunc.apply(null, params) !== solution.solver.apply(null, params)) {
            failures++;
        }

        if ((i / config.iterations) - lastNotification > 0.01) {
            postMessage({
                failures: failures,
                progress: (i + 1) / config.iterations,
            });
            lastNotification = i / config.iterations;
        }

        // If any test cases fail, stop running.
        if (failures > 0) return;
    }
};