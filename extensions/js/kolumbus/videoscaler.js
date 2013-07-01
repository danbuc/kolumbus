
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
