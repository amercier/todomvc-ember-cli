/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';
import { describe } from 'mocha';


describeModule('route:todos', 'TodosRoute', {}, function() {


  describe('route', function() {

    it('exists', function() {
      var route = this.subject();
      expect(route).to.be.ok;
    });
  });

});
