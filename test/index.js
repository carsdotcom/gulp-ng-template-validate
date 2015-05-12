var validate = require('../src/index');
var should = require('should');
var File = require('vinyl');
var es = require('event-stream');

describe('gulp-ng-template-validate', function() {
    it('should work in buffer mode', function () {
        var stream = validate();
        var fakeFile = new File({
            contents: new Buffer('<a ng-href="{{foo}}">foo anchor</a>')
        });

        (function () {
            stream.write(fakeFile);
        }).should.not.throw();
    });

    it('should throw an error in streaming mode', function (done) {
        var stream = validate();
        var fakeFile = new File({
            contents: new Buffer('<a ng-href="{{foo}}">foo anchor</a>')
        });

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
