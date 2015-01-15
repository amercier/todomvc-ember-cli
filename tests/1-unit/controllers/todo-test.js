import Ember from 'ember';
import {
  moduleFor
} from 'ember-qunit';
import QUnit from 'qunit';
import FIXTURES from '../../fixtures/todo';


function mockModel(data) {
  return Ember.ObjectProxy.create(Ember.merge(data, {
    saved: false,
    save: function() {
      this.set('saved', true);
    },
    deleted: false,
    deleteRecord: function() {
      this.set('deleted', true);
    }
  }));
}


moduleFor('controller:todo', 'TodoController', {
  // Specify the other units that are required for this QUnit.test.
  needs: ['model:todo']
});

// Replace this with your real QUnit.tests.
QUnit.test('it exists', function(assert) {
  assert.expect(1);
  var controller = this.subject();
  assert.ok(controller);
});

QUnit.test('editTodo', function(assert) {
  var controller = this.subject();
  Ember.run(function() {
    controller.send('editTodo');
    assert.equal(controller.get('isEditing'), true);
  });
});

QUnit.test('acceptChanges with a title', function(assert) {
  assert.expect(4);
  var controller = this.subject();
  Ember.run(function() {
    var model = mockModel(FIXTURES[0]);
    controller.set('model', model);

    controller.send('editTodo');
    assert.equal(controller.get('isEditing'), true);
    model.set('title', FIXTURES[1].title);
    controller.send('acceptChanges');
    assert.equal(controller.get('isEditing'), false);

    assert.equal(model.get('deleted'), false);
    assert.equal(model.get('saved'), true);
  });
});

QUnit.test('acceptChanges with an empty title', function(assert) {
  assert.expect(4);
  var controller = this.subject();
  Ember.run(function() {
    var model = mockModel(FIXTURES[0]);
    controller.set('model', model);

    controller.send('editTodo');
    assert.equal(controller.get('isEditing'), true);
    model.set('title', '');
    controller.send('acceptChanges');
    assert.equal(controller.get('isEditing'), false);

    assert.equal(model.get('deleted'), true);
    assert.equal(model.get('saved'), true);
  });
});


QUnit.test('removeTodo', function(assert) {
  assert.expect(2);
  var controller = this.subject();
  Ember.run(function() {
    var model = mockModel(FIXTURES[0]);
    controller.set('model', model);

    controller.send('removeTodo');

    assert.equal(model.get('deleted'), true);
    assert.equal(model.get('saved'), true);
  });
});

