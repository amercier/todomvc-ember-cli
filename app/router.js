import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('todos', { path: '/' }, function() {
    // additional child routes will go here later
  });
  this.route('todos/active');
});

export default Router;
