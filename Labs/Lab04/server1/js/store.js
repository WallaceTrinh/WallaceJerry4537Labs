function addDefinition() {
    var xhr = new XMLHttpRequest();
    var word = document.getElementById('word').value;
    var definition = document.getElementById('definition').value;
    xhr.open('POST', 'https://wallace-jerry4537-labs-lab04.vercel.app/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('message').innerText = data.message;
        } else {
            console.error('Request failed');
        }
    };

    xhr.onerror = function() {
        console.error('Request error');
    };

    var payload = {
        word: word,
        definition: definition
    };

    xhr.send(JSON.stringify(payload));
}

