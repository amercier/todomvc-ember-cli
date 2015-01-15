import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
import moduleForIntegration from '../helpers/module-for-integration';
import delay from '../helpers/delay';
import Fixtures from '../fixtures/todo';

var ms = 0, App;

moduleForIntegration('Integration - Remove a todo');


test('Application fixtures are initialized', function(assert) {
  assert.expect(4);
  var done = assert.async();

  visit('/')
    .then(delay(ms))
    .then(function(msg) {
      assert.equal(find('#main > ul > li').size(), Fixtures.length);
      assert.equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures[0].title);
      assert.equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures[1].title);
      assert.equal(find('#main > ul > li:nth-of-type(3) label').text(), Fixtures[2].title);
      done();
    });
});


test('Typing a todo name and pressing ENTER adds a new todo', function(assert) {
  assert.expect(3);
  var done = assert.async();


  var text = 'My new awesome todo';

  visit('/')
    .then(delay(ms))
    .then(function () {
      return click('#main > ul > li:nth-of-type(2) button.destroy');
    })
    .then(delay(ms))
    .then(function(msg) {
      assert.equal(find('#main > ul > li').size(), Fixtures.length - 1);
      assert.equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures[0].title);
      assert.equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures[2].title);
      done(); // see http://api.qunitjs.com/async/
    });
});
