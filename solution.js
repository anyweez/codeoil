/* jslint evil: true, node: true */
var solution = require('/* @echo SOLUTION_PATH */');

onmessage = function (event) {
    /**
     * Running `eval` in a separate function so that it doesn't get 
     * unauthorized access to any local variables. Still fairly insecure
     * it seems...
     */
    function loadFunc(raw) {
        raw = 'var func = ' + raw;
        console.log(raw);
        eval(raw);

        // func is built from eval'ing the above code.
        return func;
    }

    var config = {
        iterations: event.data.iterations || 100,
    };

    // Eval the user's code and create a function that we can use to evaluate.
    var userFunc = loadFunc(event.data.code);
    // Import the parameter list.
    var parameters = solution.parameters;

    var failures = 0;
    for (var i = 0; i < config.iterations; i++) {
        // TODO: compare outputs more thoroughly
        if (userFunc(i) !== solution.solver(i)) {
            failures++;
        }

        postMessage({
            failures: failures,
            progress: (i + 1) / config.iterations,
        });

        // If any test cases fail, stop running.
        if (failures > 0) return;
    }
};