import Ember from 'ember';
import describeApp from '../helpers/describe-app';
import { it } from 'mocha';
import delay from '../helpers/delay';
import FIXTURES from '../fixtures/todo';

describeApp('Integration - Add a new todo', function() {

  var ms = 0;


  it('displays existing todos', function() {
    return visit('/')
      .then(delay(ms))
      .then(function(msg) {
        expect(find('#main > ul > li').length).to.equal(FIXTURES.length);
        expect(find('#main > ul > li:nth-of-type(1) label').text()).to.equal(FIXTURES[0].title);
        expect(find('#main > ul > li:nth-of-type(2) label').text()).to.equal(FIXTURES[1].title);
        expect(find('#main > ul > li:nth-of-type(3) label').text()).to.equal(FIXTURES[2].title);
      });
  });


  it('adds a new todo when users type a name and presses ENTER', function() {

    var text = 'My new awesome todo';

    return visit('/')
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
        expect(find('#main > ul > li').length).to.equal(4);
        expect(find('#main > ul > li:nth-of-type(4) label').text()).to.equal(text);
      });
  });

});
