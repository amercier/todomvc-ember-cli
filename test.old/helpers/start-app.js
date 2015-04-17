import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

// TODO: import all fixtures
import TodoFixtures from '../fixtures/todo';
import Todo from '../../models/todo';

export default function startApp(attrs) {
  var App;

  var attributes = Ember.merge({}, config.APP);
  attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

  Router.reopen({
    location: 'none'
  });

  Ember.run(function() {
    App = Application.create(attributes);
    App.setupForTesting();
    App.injectTestHelpers();

    Todo.reopenClass({
      FIXTURES: $.extend(true, [], TodoFixtures) // extend, otherwise the TodoFixtures gets mutated
    });
  });

  // Disabled due to https://github.com/emberjs/ember.js/issues/10310
  // App.reset(); // this shouldn't be needed, i want to be able to "start an app at a specific URL"

  return App;
}
