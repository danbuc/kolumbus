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
;kolumbus.widget("contentsizer", function($win, $doc) {

  var getStyle = function(elm,prop){ return parseInt( (window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle)[prop]); },
      body     = document.body,
      styleDoc = (document.getElementById("js_sizer_styles").sheet || document.styleSheets["js_sizer_styles"]),
      selector = ".page",
      selector2 = ".stage + .page",
      resized  = 0,
      event    = "onorientationchange" in window ? "orientationchange" : "resize",
      winheight, rulesStr, rulesStr2;

  $win.on(event, function(e) {
    //double check needed due to different values when viewport scaled/unscaled
    winheight    = Math.max(document.documentElement.clientHeight, window.innerHeight, $win.height(), 300);
    
    rulesStr = ["height: ", winheight , "px !important;\n"].join("");
    rulesStr2 = ["margin-top: ", winheight , "px !important;\n"].join("");
    
    if (styleDoc.insertRule) {
      if(styleDoc.cssRules.length){
        styleDoc.deleteRule(1);
        styleDoc.deleteRule(0);
      }
      styleDoc.insertRule([selector, "{", rulesStr, "}"].join(""), 0);
      styleDoc.insertRule([selector2, "{", rulesStr2, "}"].join(""), 1);
    } else {
      styleDoc.cssRules && styleDoc.cssRules.length && styleDoc.removeRule();
      styleDoc.addRule(selector, rulesStr);
      styleDoc.addRule(selector2, rulesStr2);
    }
    !resized && $(body).addClass("resized") && (resized = true);
  }).trigger(event);
});
;
//background-size:cover for videos

kolumbus.widget("videoscaler", function($win, $doc) {
  var getNode        = function(elm){ return document.getElementById(elm) },
      selector       = ".js_scale",
      resized = 0;

  Videoscaler = function($vid) {
    var visualratio    = 1280/720,
        jsScaleStyles  = "js_scale_styles",
        resize         = "resize",
        round          = function(i){ return (parseInt( i*10000, 10 ) / 10000); },
        styleDoc       = (getNode(jsScaleStyles).sheet || document.styleSheets[jsScaleStyles]),
        $slot          = $vid.parent(),
        slotwidth, slotheight, slotratio, rulesStr, width, height;

    var resizer = function(e) {
      slotwidth = $slot.width();
      slotheight = $slot.height();
      slotratio = slotwidth / slotheight;

      if (slotratio < visualratio) {
        width = slotheight * visualratio;
        height = width / visualratio;
      } else {
        height = slotwidth / visualratio;
        width = height * visualratio;
      }

      rulesStr = ["width:", round(width), "px !important;",
                  "height:", round(height), "px !important;",
                  "margin: 0 0 0 ", round( (width - slotwidth) / -2), "px;\n"].join("");

      if (styleDoc.insertRule) {
        styleDoc.cssRules.length && styleDoc.deleteRule(0);
        styleDoc.insertRule(selector + "{" + rulesStr + "}", 0);
      } else {
        styleDoc.cssRules && styleDoc.cssRules.length && styleDoc.removeRule();
        styleDoc.addRule(selector, rulesStr);
      }
    };

    $win.bind(resize, resizer).trigger(resize);
  };

kolumbus.subscribe("kolumbus:ready", function($node) {
  $node.find(selector).each(function() {
    new Videoscaler($(this));
  });
  !resized && kolumbus.publish("imagescaler:scaled") && (resized = 1);
});


});
