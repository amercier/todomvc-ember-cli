import Ember from 'ember';

export default function delay(ms) {
  return function () {
    return new Ember.RSVP.Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve();
      }, ms);
    });
  };
}
