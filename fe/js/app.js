/* jslint browser: true */
window.addEventListener('load', function () {
    // Load ACE code editor on the #code element
    var editor = ace.edit('code');
    editor.setTheme('ace/theme/xcode');
    editor.getSession().setMode('ace/mode/javascript');

    var testButton = document.getElementById('test');
    testButton.addEventListener('click', function () {
        var worker = new Worker('http://localhost:3000/solutions/js/' + challenge_id + '.js');
        var status = document.getElementById('status');

        worker.addEventListener('message', function (event) {
            console.log('progress: ' + event.data.progress);
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
        });

        worker.postMessage({
            seed: 1234,
            code: editor.getValue(),
        });

    });
});