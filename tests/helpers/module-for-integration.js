import Ember from 'ember';
import startApp from './start-app';

/**
 * Setups an app for integration testing
 */
export default function moduleForIntegration (name) {
  var container = {};

  module(name, {
    setup: function setup() {
      container.App = startApp();
    },
    teardown: function teardown() {
      Ember.run(container.App, 'destroy');
    }
  });

  return container;
}
