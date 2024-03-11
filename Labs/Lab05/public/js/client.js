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

    // let patients = [
    //     { name: "Sara Brown", dateOfBirth: "1901-01-01" },
    //     { name: "John Smith", dateOfBirth: "1941-01-01" },
    //     { name: "Jack Ma", dateOfBirth: "1961-01-30" },
    //     { name: "Elon Musk", dateOfBirth: "1999-01-01" }
    //     // '("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01")'
    // ];

    // xhr.send(JSON.stringify(patients));

    let defaultInsert = '("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01");'

    console.log(defaultInsert);
    let query = `INSERT INTO patients (name, dateOfBirth) VALUES ${defaultInsert}`

    console.log(JSON.stringify(query));
    xhr.send(JSON.stringify(defaultInsert));
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
        xhr.send(JSON.stringify({ query: query }));
    } else {
        xhr.send();
    }
}

// Event listeners for the buttons
document.addEventListener('DOMContentLoaded', (event) => {
document.getElementById('pre-set-row').addEventListener('click', insertPresetRows);
document.getElementById('submit-query').addEventListener('click', submitQuery);
});




// Old client.js code

// function insertPresetRows(){
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', 'https://wallace-jerry4537-lab05-sql.vercel.app/', true);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.onload = function() {
//         if (xhr.status >= 200 && xhr.status < 400) {
//             var data = JSON.parse(xhr.responseText);
//             document.getElementById('message').innerText = `Entry number: ${data.totalEntries}\nWord: ${word}\nDefinition: ${definition}`;
//         } else {
//             console.error('Request failed');
//         }
//     };

//     xhr.onerror = function() {
//         console.error('Request error');
//     };

//     let defaultInsert = '("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01")'

//     console.log(defaultInsert);
//     let query = `INSERT INTO patients (name, dateOfBirth) VALUES ${defaultInsert}`

//     console.log(JSON.stringify(query));
//     xhr.send(JSON.stringify(defaultInsert));
// }

// function submitQuery(){
//     var xhr = new XMLHttpRequest();
//     var query = document.getElementById('query-input').value;

//     query = query.trim();
//     console.log(query);

//     //Determines if select or insert is applied
//     if (query.toLowerCase().startsWith('select')) {
//         console.log("select is applied")
//         xhr.open("GET", 'https://wallace-jerry4537-lab05-sql.vercel.app/', true)
//     }else if(query.toLowerCase().startsWith('insert')) {
//         console.log("insert is selected");
//         xhr.open("POST", 'https://wallace-jerry4537-lab05-sql.vercel.app/', true)

//     } else{
//         console.log("We only accept insert and select queries");
//     }
    
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify(query));

//     // xhr.open('POST', 'https://wallace-jerry4537-lab05-sql.vercel.app/', true);

//     xhr.onload = function() {
//         if (xhr.status >= 200 && xhr.status < 400) {
//             var data = JSON.parse(xhr.responseText);
//             document.getElementById('results').innerText = `${data}`;
//         } else {
//             console.error('Request failed');
//         }
//     };

//     xhr.onerror = function() {
//         console.error('Request error');
//     };


//     // xhr.send(JSON.stringify(defaultInsert));
// }


// // Event listeners for the buttons
// // document.getElementById('pre-set-row').addEventListener('click', insertPresetRows);
// // document.getElementById('submit-query').addEventListener('click', submitQuery);