
// Need to create a insertPresetRows() function
// Client SQL stuff here
// Client SQL stuff here
// Client SQL stuff here

function insertPresetRows(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://wallace-jerry4537-lab05-sql.vercel.app/', true);
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

    let defaultInsert = '("Sara Brown", "1901-01-01"), ("John Smith", "1941-01-01"), ("Jack Ma", "1961-01-30"), ("Elon Musk", "1999-01-01")'

    console.log(defaultInsert);
    let query = `INSERT INTO patients (name, dateOfBirth) VALUES ${defaultInsert}`

    console.log(JSON.stringify(query));
    xhr.send(JSON.stringify(defaultInsert));
}



// Need to create a submitQuery() function
// Client SQL stuff here
// Client SQL stuff here
// Client SQL stuff here

function submitQuery(){
    var xhr = new XMLHttpRequest();
    var query = document.getElementById('query-input').value;

    query = query.trim();
    console.log(query);

    //Determines if select or insert is applied
    if (query.toLowerCase().startsWith('select')) {
        console.log("select is applied")
        xhr.open("GET", 'https://wallace-jerry4537-lab05-sql.vercel.app/', true)
    }else if(query.toLowerCase().startsWith('insert')) {
        console.log("insert is selected");
        xhr.open("POST", 'https://wallace-jerry4537-lab05-sql.vercel.app/', true)

    } else{
        console.log("We only accept insert and select queries");
    }
    xhr.send(JSON.stringify(query));

    // xhr.open('POST', 'https://wallace-jerry4537-lab05-sql.vercel.app/', true);
    // xhr.setRequestHeader('Content-Type', 'application/json');

    // xhr.onload = function() {
    //     if (xhr.status >= 200 && xhr.status < 400) {
    //         var data = JSON.parse(xhr.responseText);
    //         document.getElementById('message').innerText = `Entry number: ${data.totalEntries}\nWord: ${word}\nDefinition: ${definition}`;
    //     } else {
    //         console.error('Request failed');
    //     }
    // };

    // xhr.onerror = function() {
    //     console.error('Request error');
    // };


    // xhr.send(JSON.stringify(defaultInsert));
}






// Event listeners for the buttons
// document.getElementById('pre-set-row').addEventListener('click', insertPresetRows);
// document.getElementById('submit-query').addEventListener('click', submitQuery);
