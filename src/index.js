'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var _ = require('lodash');
var htmlparser = require('htmlparser');
var rules = require('./rules');
var PLUGIN_NAME = 'gulp-ng-template-validate';

function createParser (fileName, file) {
    var lineNum = 1;

    function parseDom (error, dom) {
        _.forEach(dom, validateNodeAndChildren);
    }

    function validateNodeAndChildren (node) {
        validateNode(node);
        _.forEach(node.children, function (child) {
            validateNodeAndChildren(child);
        });
    }

    function validateNode (node) {
        if (node.type === 'text') {
            lineNum += (node.raw.split('\n').length - 1);
        }

        if (node.type === 'tag') {
            _.forEach(rules, function (theRule) {
                try {
                    theRule.rule(fileName, lineNum, node);
                } catch (e) {
                    file.eslint.messages.push({
                        ruleId: e.ruleName,
                        severity: e.severity,
                        message: e.msg,
                        line: lineNum,
                        column: 0,
                        nodeType: node.type,
                        source: ''
                    });
                }
            });
            lineNum += (node.raw.split('\n').length - 1);
        }
    }

    return parseDom;
}

function ngTemplateValidate() {
    function transform(file, enc, cb) {
        var handler, parser;
        file.eslint = {
            filePath: file.path,
            messages: [],
            error: null
        };

        if (file.isNull()) {
            cb(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported at this time.'));
            return cb();
        }

        if (file.isBuffer()) {
            handler = new htmlparser.DefaultHandler(createParser(file.path, file));
            parser = new htmlparser.Parser(handler);
            parser.parseComplete(file.contents.toString('utf8'));

        }

        cb(null, file);
    }

    return through.obj(transform);
}

module.exports = ngTemplateValidate;
