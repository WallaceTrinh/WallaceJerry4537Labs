function defaultInsert(){
    var xhr = new XMLHttpRequest();
    var word = document.getElementById('word').value;
    var definition = document.getElementById('definition').value;
    xhr.open('POST', 'https://wallace-jerry4537-labs-lab04.vercel.app/api/definitions/', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 400) {
            var data = JSON.parse(xhr.responseText);
            document.getElementById('message').innerText = `Entry number: ${data.totalEntries}\nWord: ${word}\nDefinition: ${definition}`;
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