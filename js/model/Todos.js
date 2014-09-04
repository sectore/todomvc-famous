var AppDispatcher = require('./../event/AppDispatcher'),
  AppEvents = require('./../event/AppEvents'),
  Todo = require('./Todo'),
  Storage = require('../util/Storage'),
  EventHandler = require('famous/core/EventHandler'),
  outputEventHandler = new EventHandler(),
  todos = Storage.get(),
  filterState,


  Todos = {
    init: function () {
      AppDispatcher.on(AppEvents.ADD_TODO, this.add.bind(this));
      AppDispatcher.on(AppEvents.UPDATE_TODO, this.update.bind(this));
      AppDispatcher.on(AppEvents.REMOVE_TODO, this.remove.bind(this));
      AppDispatcher.on(AppEvents.REMOVE_ALL_COMPLETED_TODOS, this.removeAllCompleted.bind(this));
      AppDispatcher.on(AppEvents.TOGGLE_COMPLETED_TODO, this.toggleCompleted.bind(this));
      AppDispatcher.on(AppEvents.TOGGLE_ALL_COMPLETED_TODOS, this.toggleAllCompleted.bind(this));
      AppDispatcher.on(AppEvents.FILTER_TODOS, this.setFilterState.bind(this));
    },

    on: function (type, callback) {
      return outputEventHandler.on(type, callback);
    },
    off: function (type, callback) {
      return outputEventHandler.removeListener(type, callback);
    },
    emit: function (type, data) {
      return outputEventHandler.emit(type, data);
    },

    TODO_ADDED: 'todos:todo-added',
    add: function (todo) {
      todos.push(todo);
      this.store();
      this.emit(this.UPDATED, {
        kind: this.TODO_ADDED,
        items: [todo]
      });
    },

    TODO_UPDATED: 'todos:todo-updated',
    update: function (data) {
      todos.forEach(function (todo, index) {
        if (todo.id === data.id) {
          var updated = todo.update(data.label);
          if (updated) {
            this.store();
            this.emit(this.UPDATED, {
              kind: this.TODO_UPDATED,
              items: [todo]
            });
          }

        }
      }.bind(this));
    },

    TODO_REMOVED: 'todo:todo-removed',
    remove: function (id, silent) {
      var i = 0, max = todos.length, todo;
      for (i; i < max; i++) {
        todo = todos[i];
        if (todo.id === id) {
          todos.splice(i, 1);
          this.store();
          if (!silent) {
            this.emit(this.UPDATED, {
              kind: this.TODO_REMOVED,
              items: [todo]
            });
          }
          break;
        }
      }
    },

    removeAllCompleted: function () {
      var todosCompleted = this.getCompleted();
      todosCompleted.forEach(function (todo) {
        this.remove(todo.id, true);
      }.bind(this));
      this.store();
      this.emit(this.UPDATED, {
        kind: this.TODO_REMOVED,
        items: todosCompleted
      });
    },

    store: function(){
      Storage.set(todos);
    },

    toggleCompleted: function (id) {
      var i = 0, max = todos.length, todo;
      for (i; i < max; i++) {
        todo = todos[i];
        if (todo.id === id) {
          todo.toggleComplete();
          this.store();
          this.emit(this.UPDATED, {
            kind: this.COMPLETE_TOGGLED,
            items: [todo]
          });
          break;
        }
      }
    },

    COMPLETE_TOGGLED: 'todos:complete-toggled',
    toggleAllCompleted: function () {
      var completed = !this.allCompleted();
      todos.forEach(function (todo) {
        todo.setCompleted(completed);
      });
      this.store();
      this.emit(this.UPDATED, {
        kind: this.COMPLETE_TOGGLED,
        items: todos
      });
    },

    hasCompleted: function () {
      var result = true;
      for (var todoId in todos) {
        if (!todos[todoId].completed) {
          result = false;
        }
      }
      return result;
    },

    FILTER_NONE: 'todos:filter-none',
    FILTER_ALL: 'todos:filter-all',
    FILTER_ACTIVE: 'todos:filter-active',
    FILTER_COMPLETED: 'todos:filter-completed',

    UPDATED: 'todos:updated',
    setFilterState: function (state) {
      if(this.getFilterState() !== state){
        this.filterState = state;
        this.emit(this.UPDATED, {items: this.getTodos()});
        return true;
      } else {
        return false
      }
    },

    getFilterState: function () {
      var state = filterState || this.FILTER_NONE;
      return this.filterState;
    },

    getTodos: function () {
      var todos;

      switch (this.filterState) {
        case this.FILTER_ALL:
          todos = this.getAll();
          break;
        case this.FILTER_COMPLETED:
          todos = this.getCompleted();
          break;
        case this.FILTER_ACTIVE:
          todos = this.getActive();
          break;
        default:
          todos = this.getAll();
          break;
      }
      return todos;
    },

    getAll: function () {
      return todos;
    },

    getActive: function () {
      return todos.filter(function (todo) {
        return !todo.completed;
      });
    },

    getCompleted: function () {
      return todos.filter(function (todo) {
        return !!todo.completed;
      });
    },

    hasCompleted: function () {
      return this.getNumberOfCompleted() > 0;
    },

    getNumberOfAll: function () {
      return this.getAll().length;
    },

    getNumberOfCompleted: function () {
      return this.getCompleted().length;
    },

    getNumberOfActive: function () {
      return this.getActive().length;
    },

    allCompleted: function () {
      return this.getNumberOfCompleted() === this.getNumberOfAll();
    },

    hasTodos: function () {
      return this.getAll() && this.getNumberOfAll() > 0
    },

    /**
     * Helper method to clear todo list
     */
    emptyTodos: function () {
      // empty todos
      todos = [];
      this.store();
    }

  };

Todos.init();

module.exports = Todos;
