var InputSurface = require('famous/surfaces/InputSurface');

// constructor
// ------------------------------------------------------------

function CheckBoxSurface(options) {
  this.superDeploy = InputSurface.prototype.deploy;
  InputSurface.apply(this, arguments);
  this.checked = options.checked || false;
}


// public
// ------------------------------------------------------------

CheckBoxSurface.prototype = Object.create(InputSurface.prototype);
CheckBoxSurface.prototype.constructor = CheckBoxSurface;

CheckBoxSurface.prototype.setChecked = function (value) {
  if (this.checked !== value) {
    this.checked = value;
    this._contentDirty = true;
  }
  return this;
};

CheckBoxSurface.prototype.deploy = function deploy(target) {
  this.superDeploy(target);
  target.checked = this.checked;
};

module.exports = CheckBoxSurface;
