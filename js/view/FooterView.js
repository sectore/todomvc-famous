var View = require('famous/core/View'),
  Surface = require('famous/core/Surface'),
  Transform = require('famous/core/Transform'),
  Modifier = require('famous/core/Modifier'),

// private
// ------------------------------------------------------------
  addContent = function () {
    var modifier = new Modifier({
        transform: Transform.translate(0, 50, 0)
      }),
      content = new Surface({
        size: [undefined, undefined],
        content: '<p>Double-click to edit a todo.</p>'
          + '<p>Unofficial part of <a href="http://todomvc.com">TodoMVC</a> built with <a href="http://famo.us">famo.us</a>.</br>'
          + 'Source at <a href="https://github.com/sectore/todomvc-famous">GitHub</a>. '
          + 'Created by <a href="http://websector.de">Jens Krause</a>.</p>',
        classes: ['footer-info']
      });
    this.add(modifier).add(content);

  };

// constructor
// ------------------------------------------------------------

function FooterView() {
  View.apply(this, arguments);
  addContent.call(this);
}

// public
// ------------------------------------------------------------

FooterView.prototype = Object.create(View.prototype);
FooterView.prototype.constructor = FooterView;

FooterView.DEFAULT_OPTIONS = {};

module.exports = FooterView;