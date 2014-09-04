describe('Todos -> ', function () {

  var Todos = require('./Todos');
  var Todo = require('./Todo');
  var Storage = require('../util/storage');

  beforeEach(function () {

  });

  afterEach(function () {
    Todos.emptyTodos()
  });

  describe('default values -> ', function () {

    it('should have an empty todo list', function () {
      expect(Todos.getAll().length).to.equal(0);
    })

  })

  describe('adding a todo', function () {

    var todo;
    var spy;

    beforeEach(function () {
      todo = new Todo();
      spy = sinon.spy();
      Todos.on(Todos.UPDATED, spy);
    });

    afterEach(function () {
      Todos.off(Todos.UPDATED, spy);
    });

    it('should add a todo to list of todos', function () {
      Todos.add(todo);
      expect(Todos.getAll().length).to.equal(1);
    })

    it('a new added todo should be the first one within todo list', function () {
      Todos.add(todo);
      var firstTodo = Todos.getAll()[0];
      expect(firstTodo).to.deep.equal(todo);
    })

    it('should calling a registered event listener', function () {
      Todos.add(new Todo());
      expect(spy.called).to.be.true;
    })

    it('should emit an event with a kind', function () {
      Todos.add(todo);
      var event = spy.getCall(0).args[0];
      expect(event.kind).to.be.equal(Todos.TODO_ADDED);
    })

    it('should emit an event with the new added todo', function () {
      Todos.add(todo);
      var event = spy.getCall(0).args[0];
      expect(event.items[0]).to.deep.equal(todo);
    })

    it('should store all todos', function () {
      var spy = sinon.spy(Storage, 'set');
      Todos.add(todo);
      var todos = Todos.getAll();
      expect(spy.calledWithExactly(todos)).to.be.true;
      spy.restore();
    })

  })


  describe('removing a todo -> ', function () {

    var spy;
    var todo;

    beforeEach(function () {
      spy = sinon.spy()
      todo = new Todo()
      // add few todos
      Todos.add(new Todo());
      Todos.add(todo);
      Todos.add(new Todo());
      // add event listener
      Todos.on(Todos.UPDATED, spy);
    });

    afterEach(function () {
      Todos.off(Todos.UPDATED, spy);
    });

    it('should calling a registered event listener', function () {
      Todos.remove(todo.id);
      expect(spy.called).to.be.true;
    })

    it('should emit an event with a kind of TODO_REMOVED', function () {
      Todos.remove(todo.id);
      var event = spy.getCall(0).args[0];
      expect(event.kind).to.be.equal(Todos.TODO_REMOVED);
    })

    it('should emit an event with the removed todo', function () {
      Todos.remove(todo.id);
      var event = spy.getCall(0).args[0];
      expect(event.items[0]).to.deep.equal(todo);
    })

    it('should store updated todo list', function () {
      var spy = sinon.spy(Storage, 'set');
      Todos.remove(todo.id);
      var todos = Todos.getAll();
      expect(spy.calledWithExactly(todos)).to.be.true;
      spy.restore();
    })

  });

  describe('completed todos ->', function () {

    var spy;

    var todoA;
    var todoB;

    beforeEach(function () {
      spy = sinon.spy()
      // add few todos
      Todos.add(new Todo());
      todoA = new Todo();
      todoA.setCompleted(true);
      Todos.add(todoA);
      Todos.add(new Todo());
      todoB = new Todo();
      todoB.setCompleted(true);
      Todos.add(todoB);
      // adding listener
      Todos.on(Todos.UPDATED, spy);
    });

    afterEach(function () {
      Todos.off(Todos.UPDATED, spy);
    });

    describe('toggling handling of a single todo  ->', function () {

      it('should be change the completed value', function () {
        Todos.toggleCompleted(todoA.id);
        expect(todoA.completed).to.be.false;
        Todos.toggleCompleted(todoA.id);
        expect(todoA.completed).to.be.true;
      })

      it('toggle a single todo should calling a registered event listener', function () {
        Todos.toggleCompleted(todoA.id);
        expect(spy.called).to.be.true;
      })

      it('should emit an event with a kind of COMPLETE_TOGGLED', function () {
        Todos.toggleCompleted(todoA.id);
        var event = spy.getCall(0).args[0];
        expect(event.kind).to.be.equal(Todos.COMPLETE_TOGGLED);
      })

      it('should emit an event with all removed todos', function () {
        Todos.toggleCompleted(todoA.id);
        var event = spy.getCall(0).args[0];
        expect(event.items[0]).to.deep.equal(todoA);
      })

      it('should store updated todo list', function () {
        var spy = sinon.spy(Storage, 'set');
        Todos.toggleCompleted(todoA.id);
        var todos = Todos.getAll();
        expect(spy.calledWithExactly(todos)).to.be.true;
        spy.restore();
      })
    })

    describe('toggling handling of completed todos ->', function () {

      it('should have completed todos', function () {
        expect(Todos.hasCompleted()).to.be.true;
      })

      it('should have completed todos in todo list', function () {
        var completedList = Todos.getCompleted();
        expect(completedList.length).to.equal(2);
      })

      it('should toggle all todos ', function () {
        Todos.toggleAllCompleted();
        // full list
        var completedList = Todos.getCompleted();
        expect(completedList.length).to.equal(4);
        // empty list
        Todos.toggleAllCompleted();
        completedList = Todos.getCompleted();
        expect(completedList.length).to.equal(0);
      });


      it('should calling a registered event listener', function () {
        Todos.toggleAllCompleted();
        expect(spy.called).to.be.true;
      })

      it('should emit an event with a kind of COMPLETE_TOGGLED', function () {
        Todos.toggleAllCompleted();
        var event = spy.getCall(0).args[0];
        expect(event.kind).to.be.equal(Todos.COMPLETE_TOGGLED);
      })

      it('should emit an event with all completed todos', function () {
        Todos.toggleAllCompleted();
        var event = spy.getCall(0).args[0];
        expect(event.items.length).to.equal(Todos.getCompleted().length);
      })

      it('should store updated todo list', function () {
        var spy = sinon.spy(Storage, 'set');
        Todos.toggleAllCompleted();
        var todos = Todos.getAll();
        expect(spy.calledWithExactly(todos)).to.be.true;
        spy.restore();
      })
    })

    describe('remove handling of completed todos', function () {

      it('should remove completed todos', function () {
        Todos.removeAllCompleted();
        expect(Todos.getAll().length).to.equal(2);
      })

      it('should calling a registered event listener', function () {
        Todos.removeAllCompleted();
        expect(spy.called).to.be.true;
      })

      it('should emit an event with a kind of TODO_REMOVED only once', function () {
        Todos.removeAllCompleted();
        expect(spy.calledOnce).to.be.true;
        var event = spy.getCall(0).args[0];
        expect(event.kind).to.be.equal(Todos.TODO_REMOVED);
      })

      it('should emit an event with all removed todos', function () {
        Todos.removeAllCompleted();
        var event = spy.getCall(0).args[0];
        expect(event.items.length).to.equal(2);
      })

      it('should store updated todo list', function () {
        var spy = sinon.spy(Storage, 'set');
        Todos.removeAllCompleted();
        var todos = Todos.getAll();
        expect(spy.calledWithExactly(todos)).to.be.true;
        spy.restore();
      })

    })

    it('should not have completed todos only', function () {
      var result = Todos.allCompleted();
      expect(result).to.be.false;
    })

  })

  describe('updating a todo', function () {

    var spy;
    var todo;
    var data;

    beforeEach(function () {
      spy = sinon.spy()

      todo = new Todo();
      data = {
        id: todo.id,
        label: 'new label'
      }
      Todos.add(todo);
      // adding listener
      Todos.on(Todos.UPDATED, spy);
    });

    afterEach(function () {
      Todos.off(Todos.UPDATED, spy);
    });


    it('should calling a registered event listener', function () {
      Todos.update(data);
      expect(spy.called).to.be.true;
    })

    it('should emit an event with a kind of TODO_UPDATED', function () {
      Todos.update(data);
      var event = spy.getCall(0).args[0];
      expect(event.kind).to.be.equal(Todos.TODO_UPDATED);
    })

    it('should emit an event with updated todo', function () {
      Todos.update(data);
      var event = spy.getCall(0).args[0];
      expect(event.items[0]).to.deep.equal(todo);
    })

    it('should store updated todo list', function () {
      var spy = sinon.spy(Storage, 'set');
      Todos.update(data);
      var todos = Todos.getAll();
      expect(spy.calledWithExactly(todos)).to.be.true;
      spy.restore();
    })
  })

  describe('handling of filtering states -> ', function () {

    var spy;

    beforeEach(function () {
      spy = sinon.spy()
      // adding listener
      Todos.on(Todos.UPDATED, spy);
    });

    afterEach(function () {
      Todos.off(Todos.UPDATED, spy);
      Todos.setFilterState(Todos.FILTER_NONE);
    });


    it('setting new filter state should calling a registered event listener', function () {
      Todos.setFilterState(Todos.FILTER_COMPLETED);
      expect(spy.called).to.be.true;
    })

    it('should emit an event with filtered todos', function () {
      var todo = new Todo();
      todo.setCompleted(true);
      Todos.add(new Todo());
      Todos.add(todo);
      spy.reset();
      Todos.setFilterState(Todos.FILTER_COMPLETED);
      var event = spy.getCall(0).args[0];
      expect(event.items.length).to.equal(1);
      expect(event.items[0]).to.deep.equal(todo);
    })

    it('should return a list of active todos', function () {
      var todo = new Todo();
      todo.setCompleted(true);
      Todos.add(todo);
      Todos.add(new Todo());
      Todos.add(new Todo());
      Todos.setFilterState(Todos.FILTER_ACTIVE);
      expect(Todos.getTodos().length).to.equal(2);
    })

    it('should return a list of completed todos', function () {
      var todo = new Todo();
      todo.setCompleted(true);
      Todos.add(todo);
      Todos.add(new Todo());
      Todos.add(new Todo());
      Todos.setFilterState(Todos.FILTER_COMPLETED);
      expect(Todos.getTodos().length).to.equal(1);
    })

    it('getting filtered todos should return a list of all todos', function () {
      Todos.add(new Todo());
      Todos.add(new Todo());
      Todos.add(new Todo());
      Todos.setFilterState(Todos.FILTER_ALL);
      expect(Todos.getTodos().length).to.equal(3);
    })
  })

  describe('getting todos depending on its status ->', function () {
    beforeEach(function () {
      // adding 1 complete + 2 active todos
      Todos.add(new Todo());
      todoA = new Todo();
      todoA.setCompleted(true);
      Todos.add(todoA);
      Todos.add(new Todo());
    });

    afterEach(function () {

    });

    it('it should return a list of active todos', function () {
      var result = Todos.getActive();
      expect(result).to.be.a('array');
      expect(result.length).to.be.ok;
    })

    it('it should return the number of active todos', function () {
      var result = Todos.getNumberOfActive();
      expect(result).to.equal(2);
    })

    it('it should return a list of completed todos', function () {
      var result = Todos.getCompleted();
      expect(result).to.be.a('array');
      expect(result.length).to.be.ok;
    })

    it('it should return the number of completed todos', function () {
      var result = Todos.getNumberOfCompleted();
      expect(result).to.equal(1);
    })

    it('it should return a list of all todos', function () {
      var result = Todos.getAll();
      expect(result).to.be.a('array');
      expect(result.length).to.be.ok;
    })


    it('it should return the number of all todos', function () {
      var result = Todos.getNumberOfAll();
      expect(result).to.equal(3);
    })

  })

  it('but it should have todos ', function () {
    var result = Todos.hasTodos();
    expect(result).to.be.false;
  })
});
