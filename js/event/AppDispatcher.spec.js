describe('AppDispatcher -> ', function () {

  var AppDispatcher = require('./AppDispatcher');

  describe(' ', function () {

    var spy;
    var type = 'any-type';

    beforeEach(function () {
      spy = sinon.spy();
      AppDispatcher.on(type, spy);
    });

    afterEach(function () {
      AppDispatcher.off(type, spy);
    });

    it('should add an event listener', function () {
      AppDispatcher.emit(type);
      expect(spy.called).to.be.true;
    })

    it('should remove an event listener', function () {
      AppDispatcher.off(type, spy);
      AppDispatcher.emit(type);
      expect(spy.called).to.be.false;
    })

    it('should send data to an event listener', function () {
      var data = {key: 'value'};
      AppDispatcher.emit(type, data);
      var eventData = spy.getCall(0).args[0];
      expect(eventData).to.deep.equal(data);
    })
  })


});
