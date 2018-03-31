const path = require('path');
const fs = require('fs');
const file = path.resolve(__dirname, 'series.json');

const loadSeriesData = () => {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

module.exports = {
    allSeries: (includeDisabled) => {
        let series = [];
        const jsonData = loadSeriesData();
        jsonData.series.forEach(function (s) {
            if (includeDisabled === "true" || s.enabled === "true") {
                series.push({ name: s.name, id: s.id, enabled: s.enabled });
            }
        });
        return series;
    },
    updateSeries: (id, season, episode) => {
        const jsonData = loadSeriesData();
        let canAdd = true;
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                s.episodes.forEach(function(e){
                    if(e.season === season){
                        if(e.episode === "*" || e.episode === episode){
                            canAdd = false;
                        }
                    }
                });
                if(canAdd){
                    s.episodes.push({ season: season, episode: episode });
                }
            }
        });
        if (canAdd) {
            fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
        }
        return canAdd;
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
        let success = false;
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                success = true;
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
        if (success) {
            fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
        }
        return found;
    },
    addShow: (name, id) => {
        const jsonData = loadSeriesData();
        let success = true;
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                console.log('show already exists: ', name);
                success = false;
            }
        });

        if (success) {
            jsonData.series.push({ name: name, id: id, enabled: "true", episodes: [] });
            fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
        }
        return success;
    },
    enableShow: (id, enabled) => {
        const jsonData = loadSeriesData();
        let success = false;
        jsonData.series.forEach(function (s) {
            if (s.id === id) {
                success = true;
                s.enabled = enabled;
            }
        });

        if (success) {
            fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
        }
        return success;
    }
}