var Todo = require('../model/Todo'),
  Storage = {
  /**
   * Key of localStorage to store todo list
   * @const
   */
  KEY: 'todomvc-famous',

  /**
   * Returns list of todos stored by localStorage
   * @returns {array} List of todos
   */
  get: function () {
    var store = localStorage.getItem(this.KEY);
    var jsonTodos = store && JSON.parse(store);
    var todos = [];
    if(jsonTodos){
      var todo;
      jsonTodos.forEach(function (jsonTodo, index) {
        todo = Todo.fromJSON(jsonTodo);
        todos.push(todo);
      })
    }
    return todos;
  },

  /**
   * Stores todos into localStorage
   * @param todos {array} List of todos
   */
  set: function (todos) {
    var dataList = [];
    var data;
    todos.forEach(function (todo, index) {
      data = todo.toJSON();
      dataList.push(data)
    })
    localStorage.setItem(this.KEY, JSON.stringify(dataList));
  }

};

module.exports = Storage;
