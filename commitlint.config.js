module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "body-leading-blank": [2, "always"],
        "header-max-length": [2, "always", 50]
    }
};
// https://commitlint.js.org/#/concepts-commit-conventions
// https://www.conventionalcommits.org/en/v1.0.0-beta.2/
// https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines
/**
 * 
 * 
 * 
 *  feat - Newfeature
    fix -  Bug fix
    docs - changes related to documentation 
    style - code formatting related changes(Do not affect the meaning of the code)
    refactor - Refactoring the existing code(No addtional fix or feature)
    perf - code change that improves performance
    test - test cases related 
    build - Changes that affect the build system or external dependencies (ex:- webpack)
    ci - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
    chore - Other changes that don't modify src or test files
    revert - Reverts a previous commit


 * scope :- [
    'build',
    'ci',
    'chore',
    'docs',
    'feat',
    'fix',
    'perf',
    'refactor',
    'revert',
    'style',
    'test'
];

Correct Messages

fix: some message
fix(build): some message

--------------------------------------------
fix: some message

BREAKING CHANGE: It will be significant
--------------------------------------------

Max length is 100
 */
