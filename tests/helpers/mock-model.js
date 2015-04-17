import Ember from 'ember';

export default function mockModel(item) {
  return Ember.ObjectProxy.create(Ember.merge(item, {
    saved: false,
    save: function() {
      this.set('saved', true);
    },
    deleted: false,
    deleteRecord: function() {
      this.set('deleted', true);
    }
  }));
}
