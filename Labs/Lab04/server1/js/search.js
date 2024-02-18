function searchDefinition() {
    const word = document.getElementById('searchWord').value;

    fetch(`http://localhost:8888/api/definitions/?word=${encodeURIComponent(word)}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerText = data.error;
        } else {
            document.getElementById('result').innerText = `Definition: ${data.definition}`;
        }
    })
    .catch(error => console.error('Error:', error));
}

