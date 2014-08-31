var View = require('famous/core/View'),
  Modifier = require('famous/core/Modifier'),
  Transform = require('famous/core/Transform'),
  SequentialLayout = require('famous/views/SequentialLayout'),
  ViewSequence = require('famous/core/ViewSequence'),
  Utility = require('famous/utilities/Utility'),
  HeaderView = require('./HeaderView'),
  TodoListView = require('./TodoListView'),
  TodoListFooterView = require('./TodoListFooterView'),
  FooterView = require('./FooterView'),
  RenderNode = require('famous/core/RenderNode'),
  Todos = require('../model/Todos'),
  RenderController = require('famous/views/RenderController'),


// private
// ------------------------------------------------------------
  initListeners = function () {

    var todosUpdated = function () {
      updateTodoListFooter.call(this);
    }.bind(this);

    Todos.on(Todos.UPDATED, todosUpdated);
  },

  addContent = function () {

    var WIDTH = 550;
    var appModifier = new Modifier({
        size: [WIDTH, undefined],
        origin: [0.5, 0]
      });
    var node = this.add(appModifier);

    var layout = new SequentialLayout({
        direction: Utility.Direction.Y
      });

    var views = new ViewSequence();
    var headerView = new HeaderView();
    var todoList = new TodoListView();

    var todoListFooterNode = new RenderNode();
    this.todoListFooterView = new TodoListFooterView();
    var todoListFooterModifier = new Modifier({
        transform: Transform.behind
      });

    this.todoListFooterRenderController = new RenderController({
      inTransition: true,
      outTransition: true
    });

    var footerView = new FooterView();

    layout.sequenceFrom(views);

    views.push(headerView);
    views.push(todoList);
    views.push(todoListFooterNode
      .add(todoListFooterModifier)
      .add(this.todoListFooterRenderController));
    views.push(footerView);

    updateTodoListFooter.call(this);
    node.add(layout);

  },

  updateTodoListFooter = function(){
    if (!!Todos.hasTodos()) {
      showTodoListFooter.call(this);
    } else {
      hideTodoListFooter.call(this);
    }
  },

  showTodoListFooter = function () {
    this.todoListFooterRenderController.show(this.todoListFooterView);
  },

  hideTodoListFooter = function () {
    this.todoListFooterRenderController.hide(this.todoListFooterView);
  };

// constructor
// ------------------------------------------------------------

function TodoApp() {
  View.apply(this, arguments);
  addContent.call(this);
  initListeners.call(this);
}

// public
// ------------------------------------------------------------

TodoApp.prototype = Object.create(View.prototype);
TodoApp.prototype.constructor = TodoApp;

TodoApp.DEFAULT_OPTIONS = {};

module.exports = TodoApp;