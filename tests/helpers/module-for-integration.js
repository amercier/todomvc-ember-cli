import Ember from 'ember';
import startApp from './start-app';

/**
 * Setups an app for integration testing
 */

var container = {};

var config = {
  setup: function() {
    container.App = startApp();
  },
  teardown: function() {
    Ember.run(container.App, 'destroy');
  }
};

function moduleForIntegation (name) {
  return module(name, config);
}

export { container, config, moduleForIntegation };
