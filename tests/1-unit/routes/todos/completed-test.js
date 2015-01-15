import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:todos/completed', 'TodosCompletedRoute', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
