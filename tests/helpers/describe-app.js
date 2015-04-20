import Ember from 'ember';
import {
  afterEach,
  beforeEach,
  describe
} from 'mocha';
import startApp from './start-app';


/**
 * Setups an app for integration testing
 */
export default function describeApp(name, tests) {
  return describe(name, function() {

    var container = {};

    beforeEach(function() {
      container.App = startApp();
    });

    afterEach(function() {
      Ember.run(function() {
        container.App.destroy();
      });
    });

    tests(container);
  });
}
