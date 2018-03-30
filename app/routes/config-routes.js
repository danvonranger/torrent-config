
const configData = require('../../config/shows/config');

module.exports = function(app, db) {
    app.get('/series', (req, res) => {
        const series = configData.allSeries();
        res.send(series);
    });

    app.get('/episodes/:id', (req, res) => {
        const episodes = configData.episodes(req.params.id);
        res.send(episodes);
    });

    app.post('/update', (req, res) => {
        const id = req.body.id;
        const episode = req.body.episode;
        const season = req.body.season;
        configData.updateSeries(id, season, episode);
        res.send('OK');
    });

    app.post('/complete', (req, res) => {        
        const id = req.body.id;
        const season = req.body.season;
        configData.complete(id, season);
        res.send('OK');
    });

    app.post('/add', (req, res) => {
        const name = req.body.name;
        let id = name.toLowerCase();
        id = id.replace(/\s/g, '');
        configData.addShow(name, id);
        res.send('OK');
    });
}