// Modernizr.addTest('positionfixed', function () {
// 
//     //quick check for iOS - not the best idea, but this is not testable.
//     if( (!!navigator.userAgent.match(/iPad/i) || !!navigator.userAgent.match(/iPhone/i) || !!navigator.userAgent.match(/iPod/i) ) ) {
//          navigator.userAgent.match(/OS (\d)/i);
//          return ( RegExp.$1 >= 5 );
//     }
// 
//     var test    = document.createElement('div'),
//         control = test.cloneNode(false),
//         fake = false,
//         root = document.body || (function () {
//             fake = true;
//             return document.documentElement.appendChild(document.createElement('body'));
//         }());
// 
//     var oldCssText = root.style.cssText;
//     root.style.cssText = 'padding:0;margin:0';
//     test.style.cssText = 'position:fixed;top:42px'; 
//     root.appendChild(test);
//     root.appendChild(control);
//     
//     var ret = test.offsetTop !== control.offsetTop;
// 
//     root.removeChild(test);
//     root.removeChild(control);
//     root.style.cssText = oldCssText;
//     
//     if (fake) {
//         document.documentElement.removeChild(root);
//     }
// 
//     return ret;
// });


// Modernizr.addTest('fullscreen',function(){
//      var limit = Modernizr._domPrefixes.length;
//      for(var i = 0; i < limit; ++i) {
//         if( document[[Modernizr._domPrefixes[i].toLowerCase(),'C',ancelFullScreen].join("")])
//             return true;
//      }
//      return !!document[['c',ancelFullScreen].join("")] || false;
// });

// //with FF9 support
// Modernizr.addTest('fullscreen',function(){
//      var ancelFullScreen = 'ancelFullScreen'; //make string minifiable
//      
//      if(document.mozCancelFullScreen && !document.mozFullScreenEnabled) return false;
//      
//      var limit = Modernizr._domPrefixes.length;
//      for(var i = 0; i < limit; ++i) {
//         if( document[[Modernizr._domPrefixes[i].toLowerCase(),'C',ancelFullScreen].join("")])
//             return true;
//      }
//      return !!document[['c',ancelFullScreen].join("")] || false;
// });


// developer.mozilla.org/en/CSS/pointer-events
// github.com/ausi/Feature-detection-technique-for-pointer-events
Modernizr.addTest('pointerevents', function(){
    var element = document.createElement('div'),
        documentElement = document.documentElement,
        getComputedStyle = window.getComputedStyle,
        supports;
    if(!('pointerEvents' in element.style)){
        return false;
    }
    element.style.pointerEvents = 'auto';
    element.style.pointerEvents = 'x';
    documentElement.appendChild(element);
    supports = getComputedStyle && 
        getComputedStyle(element, '').pointerEvents === 'auto';
    documentElement.removeChild(element);
    return !!supports;
});
