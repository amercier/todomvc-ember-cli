import Ember from 'ember';
import DS from 'ember-data';

var adapter = Ember.testing ? DS.FixtureAdapter : DS.LSAdapter.extend({
  namespace: 'todos-ember-es6'
});

export default adapter;
