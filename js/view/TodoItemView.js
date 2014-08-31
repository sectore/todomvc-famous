var View = require('famous/core/View'),
  Surface = require('famous/core/Surface'),
  ContainerSurface = require('famous/surfaces/ContainerSurface'),
  Modifier = require('famous/core/Modifier'),
  InputSurface = require('famous/surfaces/InputSurface'),
  CheckBoxSurface = require('../component/CheckBoxSurface'),
  AppDispatcher = require('../event/AppDispatcher'),
  AppEvents = require('../event/AppEvents'),
  Easing = require('famous/transitions/Easing'),
  Transitionable = require('famous/transitions/Transitionable'),
  Transform = require('famous/core/Transform'),
  TransitionableTransform = require('famous/transitions/TransitionableTransform'),
  RenderController = require('famous/views/RenderController'),
  Todo = require('../model/Todo'),

// private
// ------------------------------------------------------------
  addListeners = function () {

    this.todoCompleted = function (completed) {
      this.checkButton.setChecked(completed);
      updateLabel.call(this);
    }.bind(this);

    this.todo.on(Todo.COMPLETED, this.todoCompleted);

    this.todoUpdated = function (value) {
      updateLabel.call(this);
      this.editInput.setValue(value);
    }.bind(this);

    this.todo.on(Todo.UPDATED, this.todoUpdated);
  },

  removeListeners = function () {
    this.todo.off(Todo.COMPLETED, this.todoCompleted);
    this.todo.off(Todo.UPDATED, this.todoUpdated);
  },

  WIDTH = 550,
  HEIGHT = 65,
  HEIGHT_BORDER = 2,
  HEIGHT_INPUT = HEIGHT - HEIGHT_BORDER,
  WIDTH_REMOVE_BUTTON = 40,
  BUTTON_TRANSITION = {
    duration: 300,
    curve: Easing.outBack
  },
  VIEW_TRANSLATE_TRANSITION = {
    duration: 250,
    curve: Easing.outCirc
  },
  VIEW_OPACITY_TRANSITION = {
    duration: 250,
    curve: 'linear'
  },

  addContent = function () {

    this.viewTransitionableTransform = new TransitionableTransform();
    this.viewTransitionableTransform.setTranslate([-WIDTH, 0, 0]);
    this.viewTransitionable = new Transitionable(1);
    var viewModifier = new Modifier({
      size: [undefined, HEIGHT],
      transform: this.viewTransitionableTransform,
      opacity: function () {
        return this.viewTransitionable.get();
      }.bind(this)
    });

    var container = new ContainerSurface({
      size: [undefined, HEIGHT],
      properties: {
        overflow: 'hidden',
      }
    });

    // bg
    // ------------------------------------------------------------

    var bg = new Surface({
      classes: ['todo-bg'],
      size: [undefined, undefined],
      content: '',
    });

    var containerNode = container.add(viewModifier);
    containerNode.add(bg);

    // check button
    // ------------------------------------------------------------

    this.checkButton = new CheckBoxSurface({
      classes: ['toggle'],
      type: 'checkbox'
    });

    this.checkButton.setChecked(this.todo.completed);

    this.checkButton.on('click', function () {
      AppDispatcher.emit(AppEvents.TOGGLE_COMPLETED_TODO, this.todo.id);
    }.bind(this));

    var checkButtonModifier = new Modifier({
      size: [40, HEIGHT],
      align: [0, 0],
      origin: [0, 0]
    });

    var checkButtonScaleModifier = new Modifier({
      align: [.5, 0.5],
      origin: [.5, 0.5],
      transform: function () {
        var scale = this.checkButtonTransitionable.get();
        return Transform.scale(scale, scale, 1);
      }.bind(this)
    });

    this.checkButtonController = new RenderController({
      inTransition: true,
      outTransition: true
    });

    this.checkButtonTransitionable = new Transitionable(1);

    this.checkButton.on('mouseover', function (event) {
      this.checkButtonTransitionable.halt();
      this.checkButtonTransitionable.set(1.5, BUTTON_TRANSITION);
    }.bind(this));

    this.checkButton.on('mouseout', function (event) {
      this.checkButtonTransitionable.halt();
      this.checkButtonTransitionable.set(1, BUTTON_TRANSITION);
    }.bind(this));

    containerNode
      .add(checkButtonModifier)
      .add(checkButtonScaleModifier)
      .add(this.checkButtonController);

    // remove button
    // ------------------------------------------------------------
    this.removeButton = new Surface({
      classes: ['button-remove'],
      content: '✖'
    });

    var removeButtonModifier = new Modifier({
      size: [WIDTH_REMOVE_BUTTON, WIDTH_REMOVE_BUTTON],
      align: [1, 0.5],
      origin: [1, 0.5]
    });

    var removeButtonScaleModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: function () {
        var scale = this.removeButtonTransitionable.get();
        return Transform.scale(scale, scale, 1);
      }.bind(this)
    });

    this.removeButtonTransitionable = new Transitionable(1);

    this.removeButton.on('click', function (event) {
      event.stopPropagation();
      AppDispatcher.emit(AppEvents.REMOVE_TODO, this.todo.id);
    }.bind(this));

    this.removeButton.on('mouseover', function (event) {
      this.removeButtonTransitionable.halt();
      this.removeButtonTransitionable.set(1.5, BUTTON_TRANSITION);
    }.bind(this));

    this.removeButton.on('mouseout', function (event) {
      this.removeButtonTransitionable.halt();
      this.removeButtonTransitionable.set(1, BUTTON_TRANSITION);
    }.bind(this));

    this.removeButtonController = new RenderController({
      inTransition: true,
      outTransition: true
    });

    containerNode.add(removeButtonModifier)
      .add(removeButtonScaleModifier)
      .add(this.removeButtonController);

    showButtons.call(this);

    // label
    // ------------------------------------------------------------
    this.label = new Surface({
      classes: ['todo-label'],
    });

    this.label.on('dblclick', function (event) {
      showEdit.call(this);
    }.bind(this));

    updateLabel.call(this);

    // edit input
    // ------------------------------------------------------------

    var inputModifier = new Modifier({
      align: [1, 0.5],
      origin: [1, 0.5],
      size: [465, HEIGHT_INPUT],
      transform: Transform.translate(-WIDTH_REMOVE_BUTTON, 0, 0)
    });


    this.editInput = new InputSurface({
      classes: ['todo', 'todo-edit'],
      value: this.todo.label,
      properties: {
        autoFocus: true
      }
    });

    this.editInput.on('blur', function () {
      hideEdit.call(this);
    }.bind(this));

    this.editInput.on('keydown', function (event) {
      // key SPACE
      if (event.keyCode == 13) {
        var value = this.editInput.getValue();
        if (value && value.length) {
          AppDispatcher.emit(AppEvents.UPDATE_TODO, {
            id: this.todo.id,
            label: value
          });
          hideEdit.call(this);
        }
      }
      // key ESC
      else if (event.keyCode == 27) {
        this.editInput.setValue(this.todo.label);
        hideEdit.call(this);
      }
    }.bind(this));

    this.inputRenderController = new RenderController({
      inTransition: true,
      outTransition: false
    });

    containerNode.add(inputModifier).add(this.inputRenderController);
    hideEdit.call(this);

    this.add(container);

  },

  updateLabel = function () {
    this.label.setContent(this.todo.label);
    if (!!this.todo.completed) {
      this.label.addClass('completed');
    } else {
      this.label.removeClass('completed');
    }
  }

showButtons = function () {
  this.removeButtonController.show(this.removeButton);
  this.checkButtonController.show(this.checkButton);
},

  hideButtons = function () {
    this.removeButtonController.hide();
    this.checkButtonController.hide();
  },

  showEdit = function () {
    hideButtons.call(this);
    this.inputRenderController.show(this.editInput,
      function () {
        // focus input
        this.editInput.focus();
      }.bind(this)
    );
  },

  hideEdit = function () {
    showButtons.call(this);
    this.inputRenderController.show(this.label);
  };

// constructor
// ------------------------------------------------------------

function TodoItemView(todo) {
  View.apply(this, arguments);

  this.todo = todo;
  addContent.call(this);

  addListeners.call(this);
  this.show();
}

// public
// ------------------------------------------------------------

TodoItemView.prototype = Object.create(View.prototype);
TodoItemView.prototype.constructor = TodoItemView;

TodoItemView.DEFAULT_OPTIONS = {};

TodoItemView.prototype.dispose = function () {
  removeListeners.call(this);
  this.todo = undefined;
};

TodoItemView.prototype.getTodoId = function () {
  if (this.todo && this.todo.id) {
    return this.todo.id;
  } else {
    return undefined;
  }
};

TodoItemView.prototype.hide = function (callback) {
  this.viewTransitionableTransform.setTranslate([WIDTH, 0, 0], VIEW_TRANSLATE_TRANSITION,
    function () {
      callback.call(null, this.todo);
    }.bind(this));

  this.viewTransitionable.set(0, VIEW_OPACITY_TRANSITION);
};

TodoItemView.prototype.show = function () {
  this.viewTransitionableTransform.setTranslate([0, 0, 0], VIEW_TRANSLATE_TRANSITION);
  this.viewTransitionable.set(1, VIEW_OPACITY_TRANSITION);
};

module.exports = TodoItemView;
