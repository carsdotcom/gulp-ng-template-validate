var validate = require('../src/index');
var File = require('vinyl');
var es = require('event-stream');
var sinon = require('sinon');
require('should');

describe('gulp-ng-template-validate', function() {
    var stream;

    context('index', function () {
        beforeEach(function () {
            stream = validate();
        });

        context('in buffer mode', function () {
            beforeEach(function () {
                sinon.spy(console, 'log');
            });

            afterEach(function () {
                console.log.restore();
            });

            it('should not throw an error', function () {
                var fakeFile,
                    fakeFileContents;

                fakeFileContents = '<a ng-href="{{foo}}">foo anchor</a>';

                fakeFile = new File({
                    contents: new Buffer(fakeFileContents)
                });

                (function () {
                    stream.write(fakeFile);
                }).should.not.throw();
            });

            context('html with errors', function () {
                var testCases = [
                    {
                        fileName: 'fileWithErrorOnLine1.html',
                        html: [
                            '<a href="{{foo}}">',
                                'foo anchor',
                            '</a>'
                        ],
                        logMsgs: [ 'fileWithErrorOnLine1.html, line 1 - Warning: Angular expression used within href attribute. (prefer-ng-href)' ]
                    },
                    {
                        fileName: 'fileWithErrorOnLine6.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    'foo',
                                '</li>',
                                '<li>',
                                    '<a href="{{foo}}">',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [ 'fileWithErrorOnLine6.html, line 6 - Warning: Angular expression used within href attribute. (prefer-ng-href)' ]
                    },
                    {
                        fileName: 'fileWithErrorOnLine7.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    'foo',
                                '</li>',
                                '<li>',
                                    '<a',
                                       'href="{{foo}}">',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [ 'fileWithErrorOnLine7.html, line 7 - Warning: Angular expression used within href attribute. (prefer-ng-href)' ]
                    },
                    {
                        fileName: 'fileWithErrorOnLine8.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    'foo',
                                '</li>',
                                '<li>',
                                    '<a',
                                        'id="foo"',
                                        'href="{{foo}}">',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [ 'fileWithErrorOnLine8.html, line 8 - Warning: Angular expression used within href attribute. (prefer-ng-href)' ]
                    },
                    {
                        fileName: 'fileWithErrorOnLine6ThenLineBreak.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    'foo',
                                '</li>',
                                '<li>',
                                    '<a href="{{foo}}"',
                                        '>',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [ 'fileWithErrorOnLine6ThenLineBreak.html, line 6 - Warning: Angular expression used within href attribute. (prefer-ng-href)' ]
                    },
                    {
                        fileName: 'fileWithLineBreaksInTagWithoutErrors.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    '<img',
                                        'ng-src="{{bar}}" />',
                                '</li>',
                                '<li>',
                                    '<a',
                                       'href="{{foo}}">',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [
                            'fileWithLineBreaksInTagWithoutErrors.html, line 8 - Warning: Angular expression used within href attribute. (prefer-ng-href)'

                        ]
                    },
                    {
                        fileName: 'fileWithMultipleErrors.html',
                        html: [
                            '<ul>',
                                '<li>',
                                    '<img src="{{bar}}" />',
                                '</li>',
                                '<li>',
                                    '<a',
                                       'href="{{foo}}">',
                                        'foo anchor',
                                    '</a>',
                                '</li>',
                            '</ul>'
                        ],
                        logMsgs: [
                            'fileWithMultipleErrors.html, line 3 - Warning: Angular expression used within src attribute. (prefer-ng-src)',
                            'fileWithMultipleErrors.html, line 7 - Warning: Angular expression used within href attribute. (prefer-ng-href)'

                        ]
                    },
                    {
                        fileName: 'fileWithMultipleAngularExpressions.html',
                        html: [
                            '<a',
                                'id="{{id}}"',
                                'href="{{foo}}">',
                                    'foo anchor',
                            '</a>'
                        ],
                        logMsgs: [
                            'fileWithMultipleAngularExpressions.html, line 3 - Warning: Angular expression used within href attribute. (prefer-ng-href)'

                        ]
                    },
                    {
                        fileName: 'fileWithMultipleAngularExpressionsAndAMissingRequiredProperty.html',
                        html: [
                            '<input',
                                'type="text"',
                                'id="{{id}}"',
                                'ng-model="{{foo}}">',
                            '</input>'
                        ],
                        logMsgs: [
                            'fileWithMultipleAngularExpressionsAndAMissingRequiredProperty.html, line 4 - Warning: No `.` in ng-model expression. (ng-model-dot)'

                        ]
                    }
                ];

                it('should log errors', function () {
                    var currentLogMsg = 0;

                    testCases.forEach(function (testCase) {
                        var fakeFile,
                            fakeFileContents;

                        fakeFileContents = testCase.html.join('\n');

                        fakeFile = new File({
                            path: testCase.fileName,
                            contents: new Buffer(fakeFileContents)
                        });

                        stream.write(fakeFile);

                        testCase.logMsgs.forEach(function (msg) {
                            console.log.getCall(currentLogMsg++).args[0].should.eql(msg);
                        });
                    });
                });
            });
        });

        context('in streaming mode', function () {
            it('should throw an error', function (done) {
                var fakeFile = new File({
                    contents: es.readArray(['<a ', 'ng-href="{{foo}}">foo anchor</a>'])
                });

                stream.on('error', function (err) {
                    err.message.should.eql('Streams not supported at this time.');
                    done();
                });

                stream.write(fakeFile);
            });
        });
    });
});
