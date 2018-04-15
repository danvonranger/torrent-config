const path = require('path');
const fs = require('fs');
const file = path.resolve(__dirname, 'series.json');
const BreakException = {};

const loadSeriesData = () => {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

const persistData = (jsonData) => {
    fs.writeFileSync(file, JSON.stringify(jsonData, null, 2));
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
        try {
            jsonData.series.forEach(function (s) {
                if (s.id === id) {
                    s.episodes.forEach(function (e) {
                        if (e.season === season) {
                            if (e.episode === "*" || e.episode === episode) {
                                canAdd = false;
                                throw BreakException;
                            }
                        }
                    });
                    if (canAdd) {
                        s.episodes.push({ season: season, episode: episode });
                    }
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        if (canAdd) {            
            persistData(jsonData);
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
        try {
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
                    s.episodes.push({ season: season, episode: "*" });
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        if (success) {            
            persistData(jsonData);
        }
        return found;
    },

    addShow: (name, id) => {
        let newShow = {};
        const jsonData = loadSeriesData();
        let success = true;
        try {
            jsonData.series.forEach(function (s) {
                if (s.id === id) {
                    success = false;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (success) {
            newShow = { name: name, id: id, enabled: "true", episodes: [] };
            jsonData.series.push(newShow);            
            persistData(jsonData);
        }
        return newShow;
    },

    enableShow: (id, enabled) => {
        const jsonData = loadSeriesData();
        let success = false;
        try {
            jsonData.series.forEach(function (s) {
                if (s.id === id) {
                    success = true;
                    s.enabled = enabled;
                    throw BreakException;
                }
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }

        if (success) {
            persistData(jsonData);
        }
        return success;
    }
}