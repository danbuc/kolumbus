kolumbus.widget("contentsizer", function($win, $doc) {

  var getStyle = function(elm,prop){ return parseInt( (window.getComputedStyle ? window.getComputedStyle(elm) : elm.currentStyle)[prop]); },
      body     = document.body,
      styleDoc = (document.getElementById("js_sizer_styles").sheet || document.styleSheets["js_sizer_styles"]),
      selector = ".stage",
      selector2 = ".stage + .page",
      resized  = 0,
      event    = "onorientationchange" in window ? "orientationchange" : "resize",
      winheight, rulesStr, rulesStr2;

  $win.on(event, function(e) {
    //double check needed due to different values when viewport scaled/unscaled
    winheight    = Math.max(document.documentElement.clientHeight, window.innerHeight, $win.height(), 300);
    
    rulesStr = ["min-height: ", winheight , "px !important;\n"].join("");
    rulesStr2 = ["margin-top: ", winheight , "px !important;\n"].join("");
    
    if (styleDoc.insertRule) {
      if(styleDoc.cssRules.length){
        styleDoc.deleteRule(0) && styleDoc.deleteRule(1);
      }
      styleDoc.insertRule([selector, "{", rulesStr, "}"].join(""), 0);
      styleDoc.insertRule([selector2, "{", rulesStr2, "}"].join(""), 0);
    } else {
      styleDoc.cssRules && styleDoc.cssRules.length && styleDoc.removeRule();
      styleDoc.addRule(selector, rulesStr) && styleDoc.addRule(selector2, rulesStr2);
    }
    !resized && $(body).addClass("resized") && (resized = true);
  }).trigger(event);
});
