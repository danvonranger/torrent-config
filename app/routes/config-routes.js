
const configData = require('../config/series/index');

module.exports = function(app, db) {
    app.get('/api/series', (req, res) => {
        // returns details on all currnt tv shows, names and ids
        const includeDisabled = req.query.includeDisabled || false;
        const series = configData.allSeries(includeDisabled);
        console.log('passing back series', series);
        res.json(series);
    });

    app.get('/api/episodes/:id', (req, res) => {
        // returns details on stored episodes for the give series id
        const episodes = configData.episodes(req.params.id);
        res.json(episodes);
    });

    app.post('/api/update', (req, res) => {
        // updates an existing series with the new episode details
        const id = req.body.id;
        const episode = req.body.episode;
        const season = req.body.season;
        const outcome = configData.updateSeries(id, season, episode);
        res.sendStatus(outcome ? 200 : 400);
    });

    app.post('/api/complete', (req, res) => {    
        // for the given series id and season, all episodes are combined into an asterisks    
        const id = req.body.id;
        const season = req.body.season;
        const outcome = configData.complete(id, season);
        res.sendStatus(outcome ? 200 : 400);
    });

    app.post('/api/add', (req, res) => {
        // adds a new show with zero episodes
        console.log('ADD HAS BEEN CALLED');
        console.log('BODY',req.body);
        const name = req.body.name;
        console.log('NAME', name);
        let id = name.toLowerCase();
        id = id.replace(/\s/g, '');
        const success = configData.addShow(name, id);
        res.sendStatus(success ? 200 : 400);
    });

    app.post('/api/enable', (req, res) => {
        // swich enable flag on a series to true or false
        const enabled = req.body.enabled;
        const id = req.body.id;
        const success = configData.enableShow(id, enabled);
        res.sendStatus(success ? 200 : 400);
    });
}