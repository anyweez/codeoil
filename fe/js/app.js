/* jslint browser: true */
window.addEventListener('load', function () {
    function beacon(attempt, hash) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/attempt');
        xhr.send(JSON.stringify({
            attempt: attempt,
            hash: hash,
        }));
        xhr.send();
    }

    // Load ACE code editor on the #code element
    var editor = ace.edit('code');
    editor.setTheme('ace/theme/xcode');
    editor.getSession().setMode('ace/mode/javascript');

    var testButton = document.getElementById('test');
    testButton.addEventListener('click', function () {
        var worker = new Worker('http://localhost:3000/solutions/js/' + ctx.challenge + '.js');
        var status = document.getElementById('status');

        worker.addEventListener('message', function (event) {
            // Remove all current class labels.
            status.className = '';
            // Finished
            if (event.data.failures === 0 && event.data.progress > 0.99) {
                status.textContent = 'success';
                status.classList.add('status-success');
                // In progress
            } else if (event.data.failures === 0) {
                status.textContent = 'in progress';
                status.classList.add('status-in-progress');
                // Failed
            } else {
                status.textContent = 'failed';
                status.classList.add('status-failed');
            }

            // Send a beacon
            if (event.data.hash) {
                console.log('received token: ' + event.data.hash);
                beacon(ctx.attempt, event.data.hash);
            }
        });

        worker.postMessage({
            seed: ctx.seed,
            code: editor.getValue(),
        });

    });
});