
const configData = require('../config/series/index');
const downloader = require('../config/series/downloader');

module.exports = function(app, db) {
    app.get('/api/series', (req, res) => {
        console.log('GET /api/series');
        // returns details on all currnt tv shows, names and ids
        const includeDisabled = req.query.includeDisabled || false;
        const series = configData.allSeries(includeDisabled);
        res.json(series);
    });

    app.get('/api/seasons/:id', (req, res) => {
        console.log('GET /api/seasons/', req.params.id);
        // returns details on stored episodes for the give series id
        const seasons = configData.episodes(req.params.id);
        res.json(seasons);
    });

    app.post('/api/update', (req, res) => {
        // updates an existing series with the new episode details
        const id = req.body.id;
        const episode = req.body.episode;
        const season = req.body.season;
        console.log(`POST /api/update - id: ${id} episode: ${episode} season: ${season}`);
        const outcome = configData.updateSeries(id, String(season), String(episode));
        res.sendStatus(outcome ? 200 : 400);
    });

    app.post('/api/complete', (req, res) => {    
        // for the given series id and season, all episodes are combined into an asterisks    
        const id = req.body.id;
        const season = req.body.season;
        console.log(`POST /api/complete - id: ${id} season: ${season}`);
        const outcome = configData.complete(id, season);
        res.sendStatus(outcome ? 200 : 400);
    });

    app.post('/api/add', (req, res) => {
        // adds a new show with zero episodes
        const name = req.body.name;
        console.log('POST /api/add - name: ', name);
        let id = name.toLowerCase();
        id = id.replace(/\s/g, '');
        const item = configData.addShow(name, id);
        res.json(item);
    });

    app.post('/api/enable', (req, res) => {
        // swich enable flag on a series to true or false
        const enabled = req.body.enabled;
        const id = req.body.id;
        console.log(`POST /api/enable - id: ${id} enable: ${enabled}`);
        const success = configData.enableShow(id, enabled);
        res.sendStatus(success ? 200 : 400);
    });

    app.post('/api/download', (req, res) => {
        console.log(`POST /api/download - season: ${req.body.season} episode: ${req.body.episode}`);
        const magnetDecoded = Buffer.from(String(req.body.magnet), 'base64').toString('ascii');
        const success = downloader.trigger(magnetDecoded);
        res.sendStatus(success ? 200 : 400);
    });
}