import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createTodo: function() {
      // Get the todo title set by the "New Todo" text field
      var title = this.get('newTitle');
      if (!title.trim()) { return; }

      // Create the new Todo Model
      var todo = this.store.createRecord('todo', {
        title: title,
        isCompleted: false
      });

      // Clear the "New Todo" text field
      this.set('newTitle', '');

      // Save the new model
      todo.save();
    },

    clearCompleted: function() {
      var completed = this.filterBy('isCompleted', true);
      completed.invoke('deleteRecord');
      completed.invoke('save');
    }
  },

  model: [],

  remaining: function() {
    return this.get('model').filterBy('isCompleted', false).get('length');
  }.property('model.@each.isCompleted'),

  inflection: function() {
    var remaining = this.get('remaining');
    return remaining === 1 ? 'todo' : 'todos';
  }.property('remaining'),

  hasCompleted: function() {
    return this.get('completed') > 0;
  }.property('completed'),

  completed: function() {
    return this.get('model').filterBy('isCompleted', true).get('length');
  }.property('model.@each.isCompleted'),

  allAreDone: Ember.computed('model.@each.isCompleted', {
    get: function() {
      return !!this.get('model.length') && this.get('model').everyProperty('isCompleted', true);
    },
    set: function(key, value) {
      this.get('model').setEach('isCompleted', value);
      this.get('model').invoke('save');
      return value;
    }
  })
});
