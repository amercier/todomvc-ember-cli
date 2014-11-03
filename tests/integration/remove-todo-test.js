import Ember from 'ember';
import moduleForIntegation from '../helpers/module-for-integration';
import delay from '../helpers/delay';
import Fixtures from '../fixtures/todo';

moduleForIntegation('Integration - Remove a todo');

var ms = 0;

asyncTest('Application fixtures are initialized', function() {
  expect(4);
  visit('/')
    .then(delay(ms))
    .then(function(msg) {
      equal(find('#main > ul > li').size(), Fixtures.length);
      equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures[0].title);
      equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures[1].title);
      equal(find('#main > ul > li:nth-of-type(3) label').text(), Fixtures[2].title);
      start(); // see http://api.qunitjs.com/QUnit.asyncTest/
    });
});


asyncTest('Typing a todo name and pressing ENTER adds a new todo', function() {
  expect(2);

  var text = 'My new awesome todo';

  visit('/')
    .then(delay(ms))
    .then(function () {
      return click('#main > ul > li:nth-of-type(2) button.destroy');
    })
    .then(delay(ms))
    .then(function(msg) {
      equal(find('#main > ul > li').size(), Fixtures.length - 1);
      equal(find('#main > ul > li:nth-of-type(1) label').text(), Fixtures[0].title);
      equal(find('#main > ul > li:nth-of-type(2) label').text(), Fixtures[2].title);
      start();
    });
});
