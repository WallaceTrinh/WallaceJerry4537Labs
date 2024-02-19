function searchDefinition() {
    var xhr = new XMLHttpRequest();
    var word = document.getElementById('searchWord').value;
    xhr.open('GET', `https://wallace-jerry4537-labs-lab04.vercel.app/api/definitions/?word=${encodeURIComponent(word)}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            if (data.error) {
                document.getElementById('result').innerText = data.error;
            } else {
                document.getElementById('result').innerText = `Definition: ${data.definition}`;
            }
        } else {
            document.getElementById('result').innerText = 'Error: ' + data.error;
        }
    };

    xhr.onerror = function() {
        document.getElementById('result').innerText = 'Network error';
    };

    xhr.send();
}

