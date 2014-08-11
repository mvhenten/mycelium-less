'use strict';

var Parser = require('less').Parser,
    async = require('async'),
    fs = require('fs'),
    Path = require('path'),
    _ = require('lodash');

function compile(item, done) {
    item.target = item.target.replace(/[.]less$/, '.css');

    fs.readFile(item.source, function(err, src) {
        var parser = new Parser({
            paths: [Path.dirname(item.source)],
            filename: Path.basename(item.source)
        });

        parser.parse(src.toString(), function(err, tree) {
            if (err) throw err;
            item.content = tree.toCSS();

            done();
        });
    });
}

module.exports = function(config, done) {
    var lessSources = _(config.sources).where(function(source) {
        return source.type === 'file' && Path.extname(source.source) === '.less';
    }).valueOf();

    async.each(lessSources, compile, done);
};
