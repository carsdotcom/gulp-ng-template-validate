'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var _ = require('lodash');
var htmlparser = require('htmlparser');
var rules = require('./rules');
var PLUGIN_NAME = 'gulp-ng-template-validate';

function ngTemplateValidate() {
    var currentFile;

    function parseHandler (error, dom) {
        _.forEach(dom, validate);
    }

    function validate (node) {
        checkRules(node);

        _.forEach(node.children, function (child) {
            validate(child);
        });
    }

    function checkRules (dom) {
        if (dom.type === 'tag') {
            _.forEach(rules, function (theRule) {
                try {
                    theRule.rule(currentFile, dom);
                } catch (e) {
                    console.log(e);
                }
            });
        }
    }

    function transform(file, enc, cb) {
        var handler, parser;

        if (file.isNull()) {
            cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported at this time.'));
            return cb();
        }

        if (file.isBuffer()) {
            handler = new htmlparser.DefaultHandler(parseHandler);
            parser = new htmlparser.Parser(handler);

            currentFile = file.path;
            parser.parseComplete(file.contents.toString('utf8'));
        }

        cb(null, file);
    }

    return through.obj(transform);
}

module.exports = ngTemplateValidate;
