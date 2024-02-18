function addDefinition() {
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;
    fetch('https://wallace-jerry4537-labs-lab04.vercel.app/api/definitions/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, definition }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;
    })
    .catch(error => console.error('Error:', error));
}

