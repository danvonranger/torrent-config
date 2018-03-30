const path = require('path');
const fs = require('fs');
const file = path.resolve(__dirname, 'tv-shows.json');

const loadSeriesData = () => {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

module.exports = {
    allSeries: () => {
        let series = [];
        const jsonData = loadSeriesData();
        jsonData.series.forEach(function (s) {
            series.push({ name: s.name, id: s.id });
        });
        return series;
    },
    updateSeries: (id, season, episode) => {
        const jsonData = loadSeriesData();
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                s.episodes.push({ season: season, episode: episode });
            }
        });
        fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
    },
    episodes: (id) => {
        const jsonData = loadSeriesData();
        let output = [];
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                output = s.episodes;
            }
        });
        return output;
    },
    complete: (id, season) => {
        const jsonData = loadSeriesData();
        const indexesToRemove = [];
        let counter = 0;
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                s.episodes.forEach(function (e) {
                    if (e.season === season) {
                        indexesToRemove.push(counter);
                    }
                    counter++;
                });
                for (var i = indexesToRemove.length - 1; i >= 0; i--) {
                    s.episodes.splice(indexesToRemove[i], 1);
                }
            }
            s.episodes.push({ season: season, episode: "*" });
        });
        fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
    },
    addShow: (name, id) => {
        const jsonData = loadSeriesData();
        jsonData.series.forEach(function (s) {
            if(s.id === id){
                console.log('show already exists: ', name);
                return;
            }            
        });

        jsonData.series.push({name: name, id: id, episodes: []});
        fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
    }
}