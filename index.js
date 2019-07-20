const express = require('express');
const path = require('path');
const https = require('https');
const jsonParser = express.json();

const app = express();
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req,res) => {
    res.sendFile('index.html');
});


app.post('/sendForm', jsonParser,(req,res) => {
    if(!req.body) return res.sendStatus(400);
    res.setHeader('Content-Type', 'application/json');

    let data = '';
    https.get('https://jsonplaceholder.typicode.com/posts', (_res) => {
        _res.on('data', (chunk) => {
            data+=chunk;
        })
        _res.on('end', () => {
            console.log(data)
            res.send(data)
        })
    })
});


const port = 8000;
app.listen(port);
console.log('listening on port ' + port);