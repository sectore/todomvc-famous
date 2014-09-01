describe('Todo', function () {

  var Todo = require('./Todo');

  it('should assign a label', function () {
    var label = 'my label';
    var todo = new Todo(label);
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
    var todo = new Todo('a-label');
    var spy = sinon.spy();
    todo.on(Todo.UPDATED, spy);
    var anotherLabel = "another-label";
    todo.update(anotherLabel);
    expect(spy.calledWith(anotherLabel)).to.be.true;
  })

});
