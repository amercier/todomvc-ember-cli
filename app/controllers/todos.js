import Ember from 'ember';

export default Ember.ArrayController.extend({
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

  remaining: function() {
    return this.filterBy('isCompleted', false).get('length');
  }.property('@each.isCompleted'),

  inflection: function() {
    var remaining = this.get('remaining');
    return remaining === 1 ? 'todo' : 'todos';
  }.property('remaining'),

  hasCompleted: function() {
    return this.get('completed') > 0;
  }.property('completed'),

  completed: function() {
    return this.filterBy('isCompleted', true).get('length');
  }.property('@each.isCompleted'),

  allAreDone: Ember.computed('@each.isCompleted', {
    get: function() {
      return !!this.get('length') && this.everyProperty('isCompleted', true);
    },
    set: function(key, value) {
      this.setEach('isCompleted', value);
      this.invoke('save');
      return value;
    }
  })

});
