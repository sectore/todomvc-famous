describe('Todos -> ', function () {

  var Todos = require('./Todos');
  var Todo = require('./Todo');

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

    it('adding a todo should calling a registered event listener', function () {
      Todos.add(new Todo());
      expect(spy.called).to.be.true;
    })

    it('adding a todo should emit an event with a kind', function () {
      Todos.add(todo);
      var event = spy.getCall(0).args[0];
      expect(event.kind).to.be.equal(Todos.TODO_ADDED);
    })

    it('adding a todo should emit an event with the new added todo', function () {
      Todos.add(todo);
      var event = spy.getCall(0).args[0];
      expect(event.items[0]).to.deep.equal(todo);
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

    })

  })

});
