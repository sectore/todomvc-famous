var EventHandler = require('famous/core/EventHandler')
eventHandler = new EventHandler(),

  Dispatcher = {
    on: function (type, callback) {
      return eventHandler.on(type, callback);
    },
    off: function (type, callback) {
      return eventHandler.removeListener(type, callback)
    },
    emit: function (type, data) {
      return eventHandler.emit(type, data);
    }
  };

module.exports = Dispatcher;