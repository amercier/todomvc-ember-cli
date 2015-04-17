import Ember from 'ember';
import {
  moduleFor,
  test
} from 'ember-qunit';
import FIXTURES from '../../fixtures/todo';
import mockModels from '../../helpers/mock-models';


moduleFor('controller:todos', 'TodosController', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

// Replace this with your real tests.
test('it exists', function() {
  var controller = this.subject();
  ok(controller);
});


test('remaining', function () {
  expect(2);
  var controller = this.subject();
  var models = mockModels(FIXTURES);
  controller.addObjects(models);
  equal(controller.get('remaining'), 1);
  controller.findBy('id', '3').set('isCompleted', true);
  equal(controller.get('remaining'), 0);
});


test('completed', function () {
  expect(2);
  var controller = this.subject();
  var models = mockModels(FIXTURES);
  controller.addObjects(models);
  equal(controller.get('completed'), 2);
  controller.findBy('id', '3').set('isCompleted', true);
  equal(controller.get('completed'), 3);
});

test('allAreDone', function() {
  expect(2);
  var controller = this.subject();
  var models = mockModels(FIXTURES);
  controller.addObjects(models);
  equal(controller.get('allAreDone'), false);
  controller.findBy('id', '3').set('isCompleted', true);
  equal(controller.get('allAreDone'), true);
});
