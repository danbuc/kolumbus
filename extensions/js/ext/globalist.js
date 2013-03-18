(function( window ) {

  var origWindow = function(w){
                      var copy = {};
                      for (var attr in w) {
                          copy[attr] = w[attr];
                      }
                      return copy;
                    }(window);
  var whitelist  = { "Globalist" : true };

  var Globalist  = {
    search : function(){
      this.stack = [];

      for (var attr in window) {
        if (!origWindow.hasOwnProperty(attr) && !whitelist.hasOwnProperty(attr)){
          this.stack.push(attr)
        }
      }
    },

    log : function(){
      console.warn("Found %i new Global%s: %s", this.stack.length, (this.stack.length == 1 ? "": "s"), this.stack.join(", ") );
    },

    report : function(){
      Globalist.search();
      Globalist.log();
    }
  };

  window.addEventListener("load", Globalist.report, false);

  return Globalist;

})(this);