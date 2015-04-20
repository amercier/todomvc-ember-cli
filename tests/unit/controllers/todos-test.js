/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';
import { describe } from 'mocha';
import mockModels from '../../helpers/mock-models';
import FIXTURES from '../../fixtures/todo';


describeModule('controller:todos', 'TodosController', {}, function() {


  describe('controller', function() {

    it('exists', function() {
      var controller = this.subject();
      expect(controller).to.be.ok;
    });
  });


  describe('remaining()', function() {

    it('updates when a todo is set completed', function() {
      var controller = this.subject();
      controller.addObjects(mockModels(FIXTURES));

      expect(controller.get('remaining')).to.equal(1);

      controller.findBy('id', '3').set('isCompleted', true);
      expect(controller.get('remaining')).to.equal(0);
    });
  });


  describe('completed()', function() {

    it('updates when a todo is set completed', function() {
      var controller = this.subject();
      controller.addObjects(mockModels(FIXTURES));

      expect(controller.get('completed')).to.equal(2);

      controller.findBy('id', '3').set('isCompleted', true);
      expect(controller.get('completed')).to.equal(3);
    });
  });


  describe('allAreDone()', function() {

    it('updates when a todo is set completed', function() {
      var controller = this.subject();
      controller.addObjects(mockModels(FIXTURES));

      expect(controller.get('allAreDone')).to.be.nok;

      controller.findBy('id', '3').set('isCompleted', true);
      expect(controller.get('allAreDone')).to.be.ok;
    });
  });

});
