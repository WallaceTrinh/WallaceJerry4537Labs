function searchDefinition() {
    const word = document.getElementById('searchWord').value;
    fetch(`https://wallace-jerry4537-labs-lab04.vercel.app/api/definitions/?word=${encodeURIComponent(word)}`, {
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

