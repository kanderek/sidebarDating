/*******************************************************************************************************
Socket IO Wrapper Service  */

appServices.factory('Socket', function ($rootScope) {
  var socket = io.connect(SERVER);

  function on(eventName, callback) {
    socket.on(eventName, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  }

  function emit(eventName, data, callback) {
    socket.emit(eventName, data, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    });
  }

  return {
    on: on,
    emit: emit
  };
});