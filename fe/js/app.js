/* jslint browser: true */
window.addEventListener('load', function () {
    console.log('hello');

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
                status.textContent = 'Success';
                status.classList.add('status-success');
                // In progress
            } else if (event.data.failures === 0) {
                status.textContent = 'In progress';
                status.classList.add('status-in-progress');
                // Failed
            } else {
                status.textContent = 'Failed';
                status.classList.add('status-failed');
            }
        });

        worker.postMessage({
            iterations: 10,
            seed: 1234,
            code: document.getElementById('code').textContent,
        });

    });
});