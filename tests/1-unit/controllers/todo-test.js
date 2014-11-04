import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
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
  // Specify the other units that are required for this test.
  needs: ['model:todo']
});

// Replace this with your real tests.
test('it exists', function() {
  var controller = this.subject();
  ok(controller);
});

test('editTodo', function() {
  var controller = this.subject();
  Ember.run(function() {
    controller.send('editTodo');
    equal(controller.get('isEditing'), true);
  });
});

test('acceptChanges with a title', function() {
  expect(4);
  var controller = this.subject();
  Ember.run(function() {
    var model = mockModel(FIXTURES[0]);
    controller.set('model', model);

    controller.send('editTodo');
    equal(controller.get('isEditing'), true);
    model.set('title', FIXTURES[1].title);
    controller.send('acceptChanges');
    equal(controller.get('isEditing'), false);

    equal(model.get('deleted'), false);
    equal(model.get('saved'), true);
  });
});

test('acceptChanges with an empty title', function() {
  expect(4);
  var controller = this.subject();
  Ember.run(function() {
    var model = mockModel(FIXTURES[0]);
    controller.set('model', model);

    controller.send('editTodo');
    equal(controller.get('isEditing'), true);
    model.set('title', '');
    controller.send('acceptChanges');
    equal(controller.get('isEditing'), false);

    equal(model.get('deleted'), true);
    equal(model.get('saved'), true);
  });
});
