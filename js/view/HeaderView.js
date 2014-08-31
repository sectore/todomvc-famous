var View = require('famous/core/View'),
  RenderNode = require('famous/core/RenderNode'),
  Surface = require('famous/core/Surface'),
  Transform = require('famous/core/Transform'),
  Modifier = require('famous/core/Modifier'),
  AppDispatcher = require('../event/AppDispatcher'),
  AppEvents = require('../event/AppEvents'),
  Transitionable = require('famous/transitions/Transitionable'),
  Easing = require('famous/transitions/Easing'),
  InputSurface = require('famous/surfaces/InputSurface'),
  Todos = require('../model/Todos'),
  CheckBoxSurface = require('../component/CheckBoxSurface'),
  RenderController = require('famous/views/RenderController'),

// private
// ------------------------------------------------------------

  initListeners = function () {

    var todosUpdated = function () {
      updateToggleButton.call(this);
    }.bind(this);

    Todos.on(Todos.UPDATED, todosUpdated);
  },

  addContent = function () {
    var modifier = new Modifier({
        size: [undefined, 200]
      }),
      rootNode = this.add(modifier),
      headline = createHeadline.call(this),
      todoNew = createTodoNew.call(this);
    rootNode.add(headline);
    rootNode.add(todoNew);
  },

  createHeadline = function () {
    var node = new RenderNode(),
      headline = new Surface({
        size: [undefined, undefined],
        content: '<h1 class="headline">todos</h1>'
      }),
      border = new Surface({
        classes: ['headline-border']
      }),
      borderModifier = new Modifier({
        size: [undefined, 15],
        transform: Transform.translate(0, 120, 0)
      });

    node.add(headline);
    node.add(borderModifier).add(border);

    return node;
  },

  createTodoNew = function () {
    var node = new RenderNode();
    var HEIGHT = 65;
    var modifier = new Modifier({
      transform: Transform.translate(0, 135, 0)
    });
    var bg = new Surface({
      size: [undefined, HEIGHT],
      content: '',
      classes: ['todo-bg']
    });
    var input = new InputSurface({
      size: [undefined, HEIGHT],
      classes: ['todo', 'todo-new'],
      placeholder: 'What needs to be done?'
    });

    input.on('keydown', function (event) {
      if (event.keyCode == 13) {
        var value = this.getValue();
        if (value && value.length) {
          AppDispatcher.emit(AppEvents.ADD_TODO, value);
          this.setValue('');
        }
      }
    });

    input.on('blur', function (event) {
      this.setValue('');
    });

    var WIDTH_BUTTON_TOGGLE = 40;
    var toggleButtonTranslateModifier = new Modifier({
      // switching height + width values
      // for using Rotate Modifier later on
      size: [HEIGHT, WIDTH_BUTTON_TOGGLE],
      align: [0, 0],
      origin: [0, 0],
      transform: Transform.translate(WIDTH_BUTTON_TOGGLE, 0, 0)
    });
    var toggleButtonRotateModifier = new Modifier({
      origin: [0.5, 0.5],
      transform: Transform.rotateZ(Math.PI / 2)
    });
    this.toggleButtonTransitionable = new Transitionable(1);

    var toggleButtonScaleModifier = new Modifier({
      align: [0.5, 0.5],
      origin: [0.5, 0.5],
      transform: function () {
        var scale = this.toggleButtonTransitionable.get();
        return Transform.scale(scale, scale, 1);
      }.bind(this)
    });

    this.toggleButtonRenderController = new RenderController({
      inTransition: true,
      outTransition: true
    });


    this.toggleButton = new CheckBoxSurface({
      classes: ['toggle-all'],
      type: 'checkbox'
    });
    this.toggleButton.on('click', function () {
      if (!!Todos.hasTodos()) {
        AppDispatcher.emit(AppEvents.TOGGLE_ALL_COMPLETED_TODOS);
      }
    });

    var BUTTON_TRANSITION = {
      duration: 300,
      curve: Easing.outBack
    };

    this.toggleButton.on('mouseover', function (event) {
      this.toggleButtonTransitionable.halt();
      this.toggleButtonTransitionable.set(1.5, BUTTON_TRANSITION);
    }.bind(this));

    this.toggleButton.on('mouseout', function (event) {
      this.toggleButtonTransitionable.halt();
      this.toggleButtonTransitionable.set(1, BUTTON_TRANSITION);
    }.bind(this));
    var childNode = node.add(modifier);

    childNode.add(bg);
    childNode.add(input);
    childNode
      .add(toggleButtonTranslateModifier)
      .add(toggleButtonRotateModifier)
      .add(toggleButtonScaleModifier)
      .add(this.toggleButtonRenderController)
//      .add(this.toggleButton);

    updateToggleButton.call(this);

    return node;
  },

  updateToggleButton = function () {
    var checked = Todos.allCompleted() && Todos.hasTodos();
    this.toggleButton.setChecked(checked);
    if (!!Todos.hasTodos()) {
      showToggleButton.call(this);
    } else {
      hideToggleButton.call(this);
    }
  },

  showToggleButton = function () {
    this.toggleButtonRenderController.show(this.toggleButton);
  },

  hideToggleButton = function () {
    this.toggleButtonRenderController.hide(this.toggleButton);
  };

// constructor
// ------------------------------------------------------------

function HeaderView() {
  View.apply(this, arguments);
  addContent.call(this);
  initListeners.call(this);
}

// public
// ------------------------------------------------------------

HeaderView.prototype = Object.create(View.prototype);
HeaderView.prototype.constructor = HeaderView;

HeaderView.DEFAULT_OPTIONS = {};

module.exports = HeaderView;
