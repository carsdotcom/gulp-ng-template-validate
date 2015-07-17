'use strict';
var _ = require('lodash');

/**
 * Rules Configuration
 * @prop {string} name - name of the rule
 * @prop {string} attrib - HTML attribute to apply the rule to
 * @prop {array} disallow - array of strings to not allow in the attribute value
 * @prop {array} require - array of strings to require in the attribute value
 * @prop {string} msg - error message
 *
 */
var rules = [
    /**
     * `href="{{prop}}"` will be clickable with incorrect URL while Angular is compiling. Prefer `ng-href="{{prop}}"`.
     */
    {
        name: 'prefer-ng-href',
        attrib: 'href',
        disallow: ['{{'],
        require: [],
        msg: 'Angular expression used within href attribute.'
    },
    /**
     * `src="{{prop}}"` can cause a request for an incorrect resource. Prefer `ng-src="{{prop}}"`.
     */
    {
        name: 'prefer-ng-src',
        attrib: 'src',
        disallow: ['{{'],
        require: [],
        msg: 'Angular expression used within src attribute.'
    },
    /**
     * `style="background-image:{{prop}}"` can cause a request for an incorrect resource. Prefer `ng-style="'background-image':'{{prop}}'"`.
     */
    {
        name: 'prefer-ng-style',
        attrib: 'style',
        disallow: ['{{'],
        require: [],
        msg: 'Angular expression used within style attribute.'
    },
    /**
     * `<input ng-model="prop">` can cause shadowing of inherited properties and confusing UI behavior. Prefer `<input ng-model="prop.foo">`.
     */
    {
        name: 'ng-model-dot',
        attrib: 'ng-model',
        disallow: [],
        require: ['.'],
        msg: 'No `.` in ng-model expression.'
    }
];

function generateRule(options) {
    return function(file, lineNum, node) {
        _.forEach(node.attribs, function (value, attrib) {
            if (attrib === options.attrib) {
                _.forEach(options.disallow, function (key) {
                    var tagLineNum = 0,
                        offendingAttribNum,
                        offendingCharNum;

                    if (value.indexOf(key) >= 0) {
                        if (node.raw.indexOf('\n') > 0) {
                            offendingAttribNum = node.raw.indexOf(attrib);
                            offendingCharNum = offendingAttribNum + node.raw.substring(offendingAttribNum).indexOf(key) + 1;
                            tagLineNum = (node.raw.substring(0, offendingCharNum).split('\n').length - 1);
                        }

                        throw {
                            file: file,
                            tagLineNum: tagLineNum,
                            msg: options.msg,
                            ruleName: options.name
                        };
                    }
                });

                _.forEach(options.require, function (key) {
                    var tagLineNum = 0,
                        offendingCharNum;

                    if (value.indexOf(key) === -1) {
                        if (node.raw.indexOf('\n') > 0) {
                            offendingCharNum = node.raw.indexOf(attrib);
                            tagLineNum = (node.raw.substring(0, offendingCharNum).split('\n').length - 1);
                        }

                        throw {
                            file: file,
                            tagLineNum: tagLineNum,
                            msg: options.msg,
                            ruleName: options.name
                        };
                    }
                });
            }
        });
    };
}

module.exports = _.map(rules, function (rule) {
    return {
        name: rule.name,
        rule: generateRule(rule)
    };
});
