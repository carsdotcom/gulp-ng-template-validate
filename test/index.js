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
                var fakeFile = new File({
                    contents: new Buffer('<a ng-href="{{foo}}">foo anchor</a>')
                });

                (function () {
                    stream.write(fakeFile);
                }).should.not.throw();
            });

            it('should log an error for invalid html', function () {
                var fakeFile = new File({
                    path: 'fakeFile.html',
                    contents: new Buffer('<a href="{{foo}}">foo anchor</a>')
                });

                stream.write(fakeFile);

                console.log.getCall(0).args[0].should.eql('fakeFile.html - Warning: Angular expression used within href attribute. (prefer-ng-href)');
            });

            it('should log an error for invalid html nested within valid html', function () {
                var fakeFile = new File({
                    path: 'fakeFile.html',
                    contents: new Buffer('<ul><li>foo></li><li><a href="{{foo}}">foo anchor</a></li></ul>')
                });

                stream.write(fakeFile);

                console.log.getCall(0).args[0].should.eql('fakeFile.html - Warning: Angular expression used within href attribute. (prefer-ng-href)');
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
