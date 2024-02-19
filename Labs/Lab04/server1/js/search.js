// Function to search for the definition of the word that was stored.
function searchDefinition() {
    var xhr = new XMLHttpRequest();
    var word = document.getElementById('searchWord').value;
    xhr.open('GET', `https://wallace-jerry4537-labs-lab04.vercel.app/api/definitions/?word=${encodeURIComponent(word)}`, true);

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            var data = JSON.parse(xhr.responseText);
            if (data.error) {
                // Display a custom message if a word is not found
                document.getElementById('result').innerText = `Word definition does not exist! ${data.error}`;
            } else {
                document.getElementById('result').innerText = `Definition: ${data.definition}`;
            }
        } else {
            // Display a custom error message to the user
            document.getElementById('result').innerText = `An error occurred: ${xhr.statusText}`;
            console.error('Request failed');
        }
    };

    xhr.onerror = function() {
        document.getElementById('result').innerText = 'Network error, please try again.';
        console.error('Request error');
    };

    xhr.send();
}

