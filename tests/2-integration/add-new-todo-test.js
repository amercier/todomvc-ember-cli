import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
import moduleForIntegration from '../helpers/module-for-integration';
import delay from '../helpers/delay';
import Fixtures from '../fixtures/todo';

var ms = 0;

moduleForIntegration('Integration - Add a new todo');


test('Application fixtures are initialized', function(assert) {
  assert.expect(4);
  var done = assert.async(); // see http://api.qunitjs.com/async/

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
  assert.expect(2);
  var done = assert.async();

  var text = 'My new awesome todo';

  visit('/')
    .then(delay(ms))
    .then(function () {
      return fillIn('#new-todo', text);
    })
    .then(delay(ms))
    .then(function () {
      return keyEvent('#new-todo', 'keyup', 13);
    })
    .then(delay(ms))
    .then(function(msg) {
      assert.equal(find('#main > ul > li').size(), 4);
      assert.equal(find('#main > ul > li:nth-of-type(4) label').text(), text);
      done();
    });
});
