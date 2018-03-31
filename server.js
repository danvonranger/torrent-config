const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8001;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
require('./app/routes')(app, {});

app.listen(port, () => {
    console.log(`torrent-config listening on port ${port}`);
});