todomvc-ember-cli
=================

[![Build Status](http://img.shields.io/travis/amercier/todomvc-ember-cli/master.svg?style=flat-square)](https://travis-ci.org/amercier/todomvc-ember-cli)
[![Dependency Status](http://img.shields.io/gemnasium/amercier/todomvc-ember-cli.svg?style=flat-square)](https://gemnasium.com/amercier/todomvc-ember-cli)
[![Code Climate](https://img.shields.io/codeclimate/github/amercier/todomvc-ember-cli.svg?style=flat-square)](https://codeclimate.com/github/amercier/todomvc-ember-cli)

[TodoMVC](http://todomvc.com/) application, written in [Ember.js](http://emberjs.com/)
using [Ember CLI](http://www.ember-cli.com/).

The application includes:

✓ Ember [v1.12](http://emberjs.com/blog/2015/05/13/ember-1-12-released.html)  
✓ HTMLBars [templates](https://github.com/amercier/todomvc-ember-cli/tree/master/app/templates) with new bound attribute syntax  
✗ (not implemented yet) Ember components  
✓ Unit and end-to-end tests using [QUnit](http://qunitjs.com/) and [Testem](https://github.com/airportyh/testem). Also available with [Mocha](http://mochajs.org/): checkout [mocha branch](https://github.com/amercier/todomvc-ember-cli/tree/mocha)  
✓ Continuous Integration setup with [Travis CI](https://travis-ci.org/)  
✗ (not implemented yet) Code coverage analysis with [Istanbul](http://gotwarlost.github.io/istanbul/)  


Live demos
----------

[App](http://amercier.github.io/todomvc-ember-cli/) ([development mode](http://amercier.github.io/todomvc-ember-cli/dev/))  
[Tests](http://amercier.github.io/todomvc-ember-cli/dev/tests/)  


Installation
------------

### Prerequisites

You will need the following things properly installed on your computer:
- [Git](http://git-scm.com/)
- [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

### Installation

- `git clone <repository-url>` this repository
- change into the new directory
- `npm install`

### Running / Development

- `npm run start`
- Visit your app at http://localhost:4200.

### Running Tests

- `npm test`
- `npm run test-server`

### Building

- `npm run build` (production)
- `npm run build-dev` (development)

### Further Reading / Useful Links

- ember: http://emberjs.com/
- ember-cli: http://www.ember-cli.com/
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
