import {
  describeModel,
  it
} from 'ember-mocha';

describeModel(
  'todo',
  'Todo',
  {
    // Specify the other units that are required for this test.
      needs: []
  },
  function() {
    // Replace this with your real tests.
    it('exists', function() {
      var model = this.subject();
      console.log(model);
      // var store = this.store();
      expect(model).to.be.ok;
    });
  }
);
