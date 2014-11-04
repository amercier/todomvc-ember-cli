import Ember from 'ember';
import {
  moduleForModel,
  test
} from 'ember-qunit';
import FIXTURES from '../../fixtures/todo';

moduleForModel('todo', 'Todo', {
  // Specify the other units that are required for this test.
  needs: [],
  tearDown: function() {
    this.store.unloadAll();
  }
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('it has a title property', function() {
  var model = this.subject(FIXTURES[0]);
  equal(typeof model.get('title'), 'string');
  Ember.run(function() {
    model.set('title', 'new title');
    equal(model.get('title'), 'new title');
  });
});

test('it has a isCompleted property', function() {
  var model = this.subject(FIXTURES[1]);
  Ember.run(function() {
    equal(typeof model.get('isCompleted'), 'boolean');
    model.set('isCompleted', true);
    equal(model.get('isCompleted'), true);
    model.set('isCompleted', false);
    equal(model.get('isCompleted'), false);
  });
});
