/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';
import { describe } from 'mocha';
import Ember from 'ember';
import mockModel from '../../helpers/mock-model';
import FIXTURES from '../../fixtures/todo';


describeModule(
  'controller:todo',
  'TodoController',
  {
    needs: ['model:todo']
  },
  function() {


    describe('controller', function() {

      it('exists', function() {
        var controller = this.subject();
        expect(controller).to.be.ok;
      });
    });


    describe('editTodo()', function() {

      it("sets 'isEditing' to true", function() {
        var controller = this.subject();
        Ember.run(function() {
          controller.send('editTodo');
          expect(controller.get('isEditing')).to.be.true;
        });
      });
    });


    describe('acceptChanges()', function() {

      describe('with a title', function() {

        it("updates model's title", function() {
          var controller = this.subject();
          controller.set('model', mockModel(FIXTURES[0]));

          Ember.run(function() {
            controller.send('editTodo');
            expect(controller.get('isEditing')).to.be.true;

            controller.set('model.title', FIXTURES[1].title);
            controller.send('acceptChanges');
            expect(controller.get('isEditing')).to.be.false;
            expect(controller.get('model.deleted')).to.be.false;
            expect(controller.get('model.saved')).to.be.true;
            expect(controller.get('model.title')).to.equal(FIXTURES[1].title);
          });
        });
      });

      describe('with an empty title', function() {

        it("deletes the todo", function() {
          var controller = this.subject();
          controller.set('model', mockModel(FIXTURES[0]));

          Ember.run(function() {
            controller.send('editTodo');
            expect(controller.get('isEditing')).to.be.true;

            controller.set('model.title', '');
            controller.send('acceptChanges');
            expect(controller.get('isEditing')).to.be.false;
            expect(controller.get('model.saved')).to.be.true;
            expect(controller.get('model.deleted')).to.be.true;
            expect(controller.get('model.title')).to.equal('');
          });
        });
      });
    });


    describe('removeTodo()', function() {

      it("deletes the todo", function() {
        var controller = this.subject();
        controller.set('model', mockModel(FIXTURES[0]));

        Ember.run(function() {
          controller.send('removeTodo');
          expect(controller.get('model.deleted')).to.be.true;
          expect(controller.get('model.saved')).to.be.true;
        });
      });
    });

  }
);
