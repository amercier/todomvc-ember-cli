
import Ember from 'ember';
import { moduleForIntegation, container } from '../helpers/module-for-integration';
import delay from '../helpers/delay';

moduleForIntegation('Integration - Add a new todo');

var ms = 500;

asyncTest('Typing a todo name and pressing ENTER adds a new todo', function() {
  expect(2);

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
      equal(find('#main > ul > li').size(), 4);
      equal(find('#main > ul > li:nth-of-type(4) label').text(), text);
      start(); // see http://api.qunitjs.com/QUnit.asyncTest/
    });
});
