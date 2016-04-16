/* jslint browser: true */
window.addEventListener('load', function () {
    var statusIcon = document.getElementById('solution-button-icon');
    var statusMessage = document.getElementById('solution-button-status');
    
    function beacon(attempt, hash) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/attempt');
        xhr.send(JSON.stringify({
            attempt: attempt,
            hash: hash,
        }));
    }

    // Load ACE code editor on the #code element
    var editor = ace.edit('code');
    editor.setTheme('ace/theme/xcode');
    editor.getSession().setMode('ace/mode/javascript');

    var testButton = document.getElementById('solution-button');
    testButton.addEventListener('click', function () {
        var worker = new Worker('http://localhost:3000/solutions/js/' + ctx.challenge + '.js');

        worker.addEventListener('message', function (event) {
            // Remove all current class labels.
            statusIcon.className = '';

            // Finished
            if (event.data.failures === 0 && event.data.progress === 1) {
                statusIcon.textContent = '&#10003;';
                statusIcon.classList.add('status-success');
                statusMessage.textContent = 'Success! Run again';
                // In progress
            } else if (event.data.failures === 0) {
                statusIcon.textContent = '?';
                statusIcon.classList.add('status-in-progress');
                statusMessage.textContent = `In progress (${event.data.progress * 100}%)`;
                // Failed
            } else {
                statusIcon.textContent = 'X';
                statusIcon.classList.add('status-failed');
                statusMessage.textContent = 'Failed! Run again';
            }

            // Send a beacon
            if (event.data.hash) {
                console.log('received token: ' + event.data.hash);
                beacon(ctx.attempt, event.data.hash);
            } else {
                console.error('No solution hash produced');
            }
        });

        worker.postMessage({
            seed: ctx.seed,
            code: editor.getValue(),
        });

    });
});