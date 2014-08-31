define(function (require, exports, module) {
  // load non-js resources (css, index.html)
  require('./resources');

  var Engine = require('famous/core/Engine'),
    Modifier = require('famous/core/Modifier'),
    TodoApp = require('./view/TodoApp'),
    element = document.getElementById('app'),
    mainContext = Engine.createContext(element),
    app = new TodoApp();

  mainContext.add(app);

});