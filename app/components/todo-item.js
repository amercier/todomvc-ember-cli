import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    editTodo: function() {
      this.set('isEditing', true);
    },
    acceptChanges: function() {
      this.set('isEditing', false);

      if (Ember.isEmpty(this.get('model.title'))) {
        this.send('removeTodo');
      } else {
        this.get('model').save();
      }
    },
    removeTodo: function() {
      var todo = this.get('model');
      todo.deleteRecord();
      todo.save();
    }
  },

  model: null,

  isEditing: false,

  isCompleted: Ember.computed('model.isCompleted', {
    get: function() {
      return this.get('model').get('isCompleted');
    },
    set: function(key, value) {
      var model = this.get('model');
      model.set('isCompleted', value);
      model.save();
      return value;
    }
  })
});
