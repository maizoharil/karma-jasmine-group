var fs = require('fs');
var path = require('path');

var createPattern = function(path) {
    return {
        pattern: path, included: true, served: true, watched: false
    };
};

var groupFramework = function(files, groupsConfig) {
    var template = 'var groupsConfig = [];';
    if (typeof groupsConfig === 'string') {
        groupsConfig = (groupsConfig === '') ? [] : groupsConfig.split(',');
    }
    if (groupsConfig && groupsConfig.length > 0) {
        template = "var groupsConfig = ['";
        template += groupsConfig.join("','");
        template += "'];";
    }
    var modulePath = path.resolve(require.resolve('jasmine-group'));
    var configFilegPath = modulePath.replace('jasmine-group.js', 'group-config.js');
    var executionFilegPath = modulePath.replace('jasmine-group.js', 'execute-tests.js');
    fs.writeFile(configFilegPath, template, function (err) {
        if (err) {
            console.warn('[Error] Failed to override group-config.js: ', err);
        }
    });
    files.unshift(createPattern(modulePath));
    files.unshift(createPattern(configFilegPath));
    files.push(createPattern(executionFilegPath));
};

groupFramework.$inject = ['config.files', 'config.groupsConfig'];

module.exports = {
    'framework:karma-jasmine-group': ['factory', groupFramework]
};
