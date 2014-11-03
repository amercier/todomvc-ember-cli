
import Ember from 'ember';
import { moduleForIntegation, container } from '../helpers/module-for-integration';

moduleForIntegation('Integration - Add a new todo');

test('Typing a todo name and pressing ENTER adds a new todo', function() {
  expect(2);
  Ember.run(function () {
    var text = 'My new awesome todo';

    visit('/');
    fillIn('#new-todo', text);
    keyEvent('#new-todo', 'keyup', 13);
    andThen(function() {
      equal(find('#main > ul > li').size(), 4);
      equal(find('#main > ul > li:nth-of-type(4) label').text(), text);
    });
  });
});
