var rules = require('../src/rules');
var _ = require('lodash');
require('should');

describe('gulp-ng-template-validate', function() {
    context('rules', function () {
        context('prefer-ng-href', function () {
            var rule = _.findWhere(rules, { name: 'prefer-ng-href' });

            it('should report an error when href value contains `{{`', function () {
                (function () {
                    rule.rule('foo.js', 1, {
                        raw: 'a href="{{prop}}"',
                        type: 'tag',
                        name: 'a',
                        attribs: {
                            'href': '{{prop}}'
                        }
                    });
                }).should.throw();
            });
        });

        context('prefer-ng-src', function () {
            var rule = _.findWhere(rules, { name: 'prefer-ng-src' });

            it('should report an error when src value contains `{{`', function () {
                (function () {
                    rule.rule('foo.js', 1, {
                        raw: 'img src="{{prop}}"',
                        type: 'tag',
                        name: 'img',
                        attribs: {
                            'src': '{{prop}}'
                        }
                    });
                }).should.throw();
            });
        });

        context('prefer-ng-style', function () {
            var rule = _.findWhere(rules, { name: 'prefer-ng-style' });

            it('should report an error when style value contains `{{`', function () {
                (function () {
                    rule.rule('foo.js', 1, {
                        raw: 'div style="background-image: {{prop}}"',
                        type: 'tag',
                        name: 'div',
                        attribs: {
                            'style': 'background-image: {{prop}}'
                        }
                    });
                }).should.throw();
            });
        });

        context('ng-model-dot', function () {
            var rule = _.findWhere(rules, { name: 'ng-model-dot' });

            it('should report an error when ng-model does not contain a `.`', function () {
                (function () {
                    rule.rule('foo.js', 1, {
                        raw: 'input type="text" ng-model="prop"',
                        type: 'tag',
                        name: 'input',
                        attribs: {
                            'type': 'text',
                            'ng-model': 'prop'
                        }
                    });
                }).should.throw();
            });
        });
    });
});
