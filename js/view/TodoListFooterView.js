var View = require('famous/core/View'),
  RenderNode = require('famous/core/RenderNode'),
  Surface = require('famous/core/Surface'),
  Transform = require('famous/core/Transform'),
  Modifier = require('famous/core/Modifier'),
  Utility = require('famous/utilities/Utility'),
  ViewSequence = require('famous/core/ViewSequence'),
  SequentialLayout = require('famous/views/SequentialLayout'),
  Transitionable = require('famous/transitions/Transitionable'),
  Easing = require('famous/transitions/Easing'),
  Todos = require('../model/Todos'),
  AppDispatcher = require('../event/AppDispatcher'),
  AppEvents = require('../event/AppEvents'),
  RenderController = require('famous/views/RenderController'),

// private
// ------------------------------------------------------------

  initListeners = function () {
    Todos.on(Todos.UPDATED, todosUpdated.bind(this));
  },

  todosUpdated = function(event){
    if(event.kind){
      switch (event.kind){
        case Todos.TODO_REMOVED:
        case Todos.TODO_ADDED:
        case Todos.COMPLETE_TOGGLED:
          updateButtonCompleted.call(this);
          updateItemsLeftContent.call(this);
          break;

        default:
      }
    }  else {
      updateFilterButtonList.call(this);
    }
  },

  HEIGHT_BG = 50,
  HEIGHT_CONTENT = 30,

  addContent = function () {

    var modifier = new Modifier({
      size: [undefined, HEIGHT_CONTENT]
    });
    var bg = new Surface({
      classes: ['todo-list-footer-bg']
    });
    var bgModifier = new Modifier({
      size: [undefined, HEIGHT_BG],
      transform: Transform.behind,
      transform: Transform.translate(0, -HEIGHT_BG, 0)
    });
    var node = this.add(modifier);

    var buttonCompletedModifier = new Modifier({
      size: [150, HEIGHT_CONTENT],
      transform: Transform.translate(0, 5, 0),
      origin: [1, 0],
      align: [1, 0]
    });

    this.buttonCompletedTransitionable = new Transitionable(1);

    var buttonCompletedScaleModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: function () {
        var scale = this.buttonCompletedTransitionable.get();
        return Transform.scale(scale, scale, 1);
      }.bind(this)
    });

    this.buttonCompleted = new Surface({
      size: [true, true],
      classes: ['clear-completed'],
      properties: {
      }
    });

    this.buttonCompletedRenderController = new RenderController({
      inTransition: true,
      outTransition: true
    });

    this.buttonCompleted.on('click', function () {
      clearCompletedTodos.call(this);
    }.bind(this));

    var BUTTON_TRANSITION = {
      duration: 300,
      curve: Easing.outBack
    };

    this.buttonCompleted.on('mouseover', function (event) {
      this.buttonCompletedTransitionable.halt();
      this.buttonCompletedTransitionable.set(1.1, BUTTON_TRANSITION);
    }.bind(this));

    this.buttonCompleted.on('mouseout', function (event) {
      this.buttonCompletedTransitionable.halt();
      this.buttonCompletedTransitionable.set(1, BUTTON_TRANSITION);
    }.bind(this));

    this.itemsLeft = new Surface({
      size: [true, true],
      classes: ['todo-count']
    });

    updateItemsLeftContent.call(this);

    var itemsLeftModifier = new Modifier({
      transform: Transform.translate(15, 10, 0)
    });

    node.add(bgModifier).add(bg);
    node.add(itemsLeftModifier).add(this.itemsLeft);
    node.add(buttonCompletedModifier)
      .add(buttonCompletedScaleModifier)
      .add(this.buttonCompletedRenderController);
    node.add(createFilterButtonList.call(this));
  },

  updateItemsLeftContent = function () {
    this.itemsLeft.setContent(
        '<strong>'
        + Todos.getNumberOfActive()
        + '</strong>'
        + ' items left'
    );
  },

  createFilterButtonList = function () {
    var node = new RenderNode();
    var layout = new SequentialLayout({
      direction: Utility.Direction.X
    });
    var modifier = new Modifier({
      transform: Transform.translate(0, 5, 0),
      origin: [0.5, 0],
      align: [0.5, 0]
    });
    this.filterAllButton = createFilterButton.call(this, 'All', 25);
    this.filterAllButton.on('click', function (event) {
      AppDispatcher.emit(AppEvents.FILTER_TODOS, Todos.FILTER_ALL);
    });
    this.filterActiveButton = createFilterButton.call(this, 'Active', 50);
    this.filterActiveButton.on('click', function (event) {
      AppDispatcher.emit(AppEvents.FILTER_TODOS, Todos.FILTER_ACTIVE);
    });
    this.filterCompletedButton = createFilterButton.call(this, 'Completed', 60);
    this.filterCompletedButton.on('click', function (event) {
      AppDispatcher.emit(AppEvents.FILTER_TODOS, Todos.FILTER_COMPLETED);
    });

    var buttonList = new ViewSequence();
    layout.sequenceFrom(buttonList);
    buttonList.push(this.filterAllButton);
    buttonList.push(this.filterActiveButton);
    buttonList.push(this.filterCompletedButton);

    node.add(modifier).add(layout);
    return node;
  },

  createFilterButton = function (label, width) {
    var button = new Surface({
      size: [width, HEIGHT_CONTENT],
      classes: ['button-filter'],
      content: label,
      properties: {
        lineHeight: HEIGHT_CONTENT + 'px'
      }
    });
    return button;
  },

  updateFilterButtonList = function(){
    this.filterAllButton.removeClass('active');
    this.filterActiveButton.removeClass('active');
    this.filterCompletedButton.removeClass('active');
    
    switch(Todos.getFilterState()){
      case Todos.FILTER_ALL:
        this.filterAllButton.addClass('active');
        break;
      case Todos.FILTER_ACTIVE:
        this.filterActiveButton.addClass('active');
        break;
      case Todos.FILTER_COMPLETED:
        this.filterCompletedButton.addClass('active');
        break;
      default:

    }
  },

  updateButtonCompleted = function () {
    updateButtonCompletedContent.call(this);
    if(Todos.hasCompleted()){
      showButtonCompleted.call(this);
    } else {
      hideButtonCompleted.call(this);
    }
  },

  updateButtonCompletedContent = function () {
    this.buttonCompleted.setContent(
        'Clear completed (' + Todos.getNumberOfCompleted() + ')'
    );
  },

  showButtonCompleted = function(){
    this.buttonCompletedRenderController.show(this.buttonCompleted);
  },

  hideButtonCompleted = function(){
    this.buttonCompletedRenderController.hide(this.buttonCompleted);
  },

  clearCompletedTodos = function (event) {
    AppDispatcher.emit(AppEvents.REMOVE_ALL_COMPLETED_TODOS);
  };

// constructor
// ------------------------------------------------------------

function TodoListFooterView() {
  View.apply(this, arguments);

  initListeners.call(this);
  addContent.call(this);
}

// public
// ------------------------------------------------------------

TodoListFooterView.prototype = Object.create(View.prototype);
TodoListFooterView.prototype.constructor = TodoListFooterView;

TodoListFooterView.DEFAULT_OPTIONS = {};

module.exports = TodoListFooterView;