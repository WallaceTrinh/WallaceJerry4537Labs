// Function for the preset rows
function insertPresetRows(){
    var xhr = new XMLHttpRequest();
    // xhr.open('POST', 'https://wallace-jerry4537-lab05-sql.vercel.app/', true);
    xhr.open('POST', 'http://165.232.148.200:3000/api/insert', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var resultsElement = document.getElementById('results');
            if (xhr.status >= 200 && xhr.status < 400) {
                var response = JSON.parse(xhr.responseText);
                console.log('Insert response:', response);
                resultsElement.textContent = 'Insert Successful: ' + JSON.stringify(response, null, 2);
            } else {
                console.error('Insert failed:', xhr.responseText);
                resultsElement.textContent = 'Insert Failed: ' + xhr.responseText;
            }
        }
    };

    let defaultInsert = `('Sara Brown', '1901-01-01'), ('John Smith', '1941-01-01'), ('Jack Ma', '1961-01-30'), ('Elon Musk', '1999-01-01');`

    console.log(defaultInsert);
    let query = `INSERT INTO patients (name, dateOfBirth) VALUES ${defaultInsert}`

    console.log(JSON.stringify(query));
    xhr.send(JSON.stringify(query));
}

// Function for the Submit Query
function submitQuery(){
    var query = document.getElementById('query-input').value.trim();
    var xhr = new XMLHttpRequest();
    var method = query.toLowerCase().startsWith('select') ? 'GET' : 'POST';
    console.log(method);
    var endpoint = method === 'GET' ? 'http://165.232.148.200:3000/api/query?query=' + encodeURIComponent(query) : 'http://165.232.148.200:3000/api/insert';
    console.log(endpoint);
    xhr.open(method, endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          var resultsElement = document.getElementById('results');
          if (xhr.status >= 200 && xhr.status < 400) {
            var response = JSON.parse(xhr.responseText);
            resultsElement.textContent = 'Query Successful: ' + JSON.stringify(response, null, 2);
          } else {
            resultsElement.textContent = 'Query Failed: ' + xhr.responseText;
          }
        }
      };
      

    if (method === 'POST') {
        xhr.send(JSON.stringify(query));
    } else {
        xhr.send();
    }
}

// Event listeners for the buttons
document.addEventListener('DOMContentLoaded', (event) => {
document.getElementById('pre-set-row').addEventListener('click', insertPresetRows);
document.getElementById('submit-query').addEventListener('click', submitQuery);
});
