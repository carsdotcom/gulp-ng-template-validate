'use strict';
var _ = require('lodash');

module.exports = [
    /**
     * `href="{{prop}}"` will be clickable with incorrect URL while Angular is compiling. Prefer `ng-href="{{prop}}"`.
     */
    {
        name: 'prefer-ng-href',
        rule: function (file, node) {
            if (node.type === 'tag' && node.name === 'a') {
                _.forEach(node.attribs, function (value, attrib) {
                    if (attrib === 'href') {
                        if (value.indexOf("{{") >= 0) {
                            reportError(this, file, node);
                        }
                    }
                }.bind(this));
            }
        },
        msg: 'Angular expression used within href attribute.'
    },
    /**
     * `src="{{prop}}"` can cause a request for an incorrect resource. Prefer `ng-src="{{prop}}"`.
     */
    {
        name: 'prefer-ng-src',
        rule: function (file, node) {
            if (node.type === 'tag' && node.name === 'img') {
                _.forEach(node.attribs, function (value, attrib) {
                    if (attrib === 'src') {
                        if (value.indexOf("{{") >= 0) {
                            reportError(this, file, node);
                        }
                    }
                }.bind(this));
            }

        },
        msg: 'Angular expression used within src attribute.'
    },
    /**
     * `style="background-image:{{prop}}"` can cause a request for an incorrect resource. Prefer `ng-style="'background-image':'{{prop}}'"`.
     */
    {
        name: 'prefer-ng-style',
        rule: function (file, node) {
            if (node.type === 'tag') {
                _.forEach(node.attribs, function (value, attrib) {
                    if (attrib === 'style') {
                        if (value.indexOf("{{") >= 0) {
                            reportError(this, file, node);
                        }
                    }
                }.bind(this));
            }
        },
        msg: 'Angular expression used within style attribute.'
    },
    /**
     * `<input ng-model="prop">` can cause shadowing of inherited properties and confusing UI behavior. Prefer `<input ng-model="prop.foo">`.
     */
    {
        name: 'ng-model-dot',
        rule: function (file, node) {
            if (node.type === 'tag') {
                _.forEach(node.attribs, function (value, attrib) {
                    if (attrib === 'ng-model') {
                        if (value.indexOf(".") === -1) {
                            reportError(this, file, node);
                        }
                    }
                }.bind(this));
            }
        },
        msg: 'No `.` in ng-model expression.'
    }
];

function reportError(rule, file, node) {
    throw file + ' - Warning:' + rule.msg + ' (' + rule.name + ')';
}
