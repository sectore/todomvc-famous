describe('Storage -> ', function () {

  var Storage = require('./Storage');
  var Todo = require('../model/Todo');

  describe('getting data ', function () {

    it('should return an empty list', function () {
      var stub = sinon.stub(window.localStorage, 'getItem').returns('[]');
      var todos = Storage.get();
      expect(todos).to.be.ok;
      expect(todos.length).to.equal(0);
      stub.restore();
    })

    it('should return a todo list', function () {
      var mockData = [
        {"id": "cbc9da3d-9bd7-4ea5-89de-548a70a0fe65", "label": "adsf", "completed": false},
        {"id": "461f1497-b9d0-4874-a9be-5544c21ab957", "label": "asdfadsf", "completed": true}
      ];
      var mockDataJSON = JSON.stringify(mockData);
      var stub = sinon.stub(window.localStorage, 'getItem').returns(mockDataJSON);
      var todos = Storage.get();
      expect(todos.length).to.equal(2);
      stub.restore();
    })

  })

  describe('setting data ', function () {

    it('should a list of deserialized todos', function () {
      var optionsA = {"id": "cbc9da3d-9bd7-4ea5-89de-548a70a0fe65", "label": "adsf", "completed": false};
      var optionsA = {"id": "cbc9da3d-9bd7-4ea5-89de-548a70a0fe65", "label": "adsf", "completed": false};
      var todoA = new Todo(optionsA);
      var optionsB = {"id": "461f1497-b9d0-4874-a9be-5544c21ab957", "label": "asdfadsf", "completed": true};
      var todoB = new Todo(optionsB);
      var todos = [todoA, todoB];
      var expected = JSON.stringify([optionsA, optionsB]);

      var spy = sinon.spy(window.localStorage, 'setItem');
      Storage.set(todos);
      expect(spy.calledWithExactly(Storage.KEY, expected)).to.be.true;
      spy.restore();
    })

  })

});
