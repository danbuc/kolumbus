if (typeof console === "undefined") {
  console = {
    log: function() {},
    debug: function() {}
  };
}

var kolumbus = (function(kolumbus) {
  var $win = $(window),
      $doc = $(document),
      $body = $doc.find("body"),
      subscriptions = {},
      rpc;
  
  var __subscribe = function(events, cb, once) {
    $.each(events.replace(/(\s)\s*/g, "$1").split(" "), function(idx, e) {
      subscriptions[e] || (subscriptions[e] = []);
      subscriptions[e].push({ cb: cb, once: once });
    });
  };

  kolumbus.subscribe = function(e, cb) {
    __subscribe(e, cb, false);
  };

  kolumbus.subscribeOnce = function(e, cb) {
    __subscribe(e, cb, true);
  };
  
  kolumbus.publish = function(events) {
    var args = Array.prototype.slice.call(arguments, 1);
    $.each(events.replace(/(\s)\s*/g, "$1").split(" "), function(idx, e) {
      for( var idx in subscriptions[e]) {
        var obj = subscriptions[e][idx];
        obj.cb && obj.cb.apply(this, args);
        obj.once && subscriptions[e].splice(idx, 1);
      }
    });
  };
  
  kolumbus.widget = function(name, fn) {
    kolumbus[name] = fn($win, $doc);
  };
  
  var ajax = function(type, url, data, success, rpc) {
    var progress = setTimeout(function() { $body.addClass("progress") }, 500);
    
    $.ajax({
      type: type,
      url: url,
      data: data,
      success: function() {
        clearTimeout(progress);
        $body.removeClass("progress");
        success.apply(this, arguments);
      },
      error: function() {
        clearTimeout(progress);
        $body.removeClass("progress");
      }
    });
  };
  
  kolumbus.get = function(url, data, success) {
    if (typeof data === "function") {
      success = data;
      data = {};
    }
    ajax("GET", url, data, success, false);
  };
  
  kolumbus.post = function(url, data, success, sslurl) {
    if (sslurl) {
      console.log("make sslrequest")
      var sslready = function() { rpc.post(url, data, success); };
      rpc ? sslready() : (rpc = kolumbus.sslbridge.consumer(sslurl, function() { sslready(); }));
    } else {
      ajax("POST", url, data, success, false);
    }
  };
  
  kolumbus.start = function() {
    kolumbus.publish("kolumbus:ready", $doc);
  };
  
  $(window).on("load",function() {
    kolumbus.publish("kolumbus:load", $doc);
  });
  
  return kolumbus;
})(typeof kolumbus === "undefined" ? {} : kolumbus);

$(function() {
  kolumbus.start();
});
