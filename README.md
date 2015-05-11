# gulp-ng-template-validate
Gulp plugin for validating AngularJS templates for best practices and common issues.

## Rules

### prefer-ng-href
This rule specifies that Angular expressions should not be used within `href` attributes and `ng-href` should be used instead. For more information on this see the documentation for ngHref: https://docs.angularjs.org/api/ng/directive/ngHref.

### prefer-ng-src
This rule specifies that Angular expressions should not be used within `src` attributes and `ng-src` should be used instead. For more information on this see the documentation for ngSrc: https://docs.angularjs.org/api/ng/directive/ngSrc.

### prefer-ng-style
This rule specifies that Angular expressions should not be used within `style` attributes and `ng-stlye` should be used instead. For more information on this see the documentation for ngSrc: https://docs.angularjs.org/api/ng/directive/ngStyle.

### ng-model-dot
This rule specifies that `ng-model` attributes should always have a `.` as a part of the value. For more information, see this video: http://www.youtube.com/watch?v=ZhfUv0spHCY&feature=youtu.be&t=32m51s and the documentation on how inheritance works with Angular scopes: https://github.com/angular/angular.js/wiki/Understanding-Scopes.
