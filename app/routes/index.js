const configRoutes = require('./config-routes');

module.exports = function(app, db) {
    configRoutes(app, db);
}