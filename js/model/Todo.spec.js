describe('Todo', function () {

  var Todo = require('./Todo');

  it('should assign a label', function () {
    var label = 'my label';
    var todo = new Todo({label: label});
    expect(todo.label).to.equal(label);
  })


  it('should have an empty label by default', function () {
    var todo = new Todo();
    expect(todo.label).to.be.equal('');
  })

  it('should have an id by default', function () {
    var todo = new Todo();
    expect(todo.id).to.not.be.undefined;
  })

  it('should be uncompleted by default', function () {
    var todo = new Todo();
    expect(todo.completed).to.be.false;
  })

  it('should toggle value of completed', function () {
    var todo = new Todo();
    todo.toggleComplete()
    expect(todo.completed).to.be.true;
    todo.toggleComplete()
    expect(todo.completed).to.be.false;
  })

  it('should emit an event setting new value of completed', function () {
    var todo = new Todo();
    var spy = sinon.spy();
    todo.on(Todo.COMPLETED, spy);
    todo.setCompleted(true);
    expect(spy.calledWith(true)).to.be.true;
  })

  it('should emit an event setting new value of label', function () {
    var todo = new Todo({label:'a-label'});
    var spy = sinon.spy();
    todo.on(Todo.UPDATED, spy);
    var anotherLabel = "another-label";
    todo.update(anotherLabel);
    expect(spy.calledWith(anotherLabel)).to.be.true;
  })

  it('should deserialize a todo', function () {
    var options = {
      id: 'any-id',
      label:'my-label',
      completed: true
    }
    var todo = new Todo(options);
    var json = todo.toJSON();
    expect(json).to.deep.equal(options);
  })

  it('should serialize a todo', function () {
    var json = {
      id: 'any-id',
      label:'my-label',
      completed: true
    }
    var todo = Todo.fromJSON(json);
    expect(todo.id).to.equal(json.id);
    expect(todo.label).to.equal(json.label);
    expect(todo.completed).to.equal(json.completed);
  })

});
