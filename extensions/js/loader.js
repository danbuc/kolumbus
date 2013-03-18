(function() {
  
  var ajax = function(uri, callback){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', uri, false);
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4) {
          callback(xmlHttp.responseText);
      }
    };
    xmlHttp.send(null);
  };

  var loader = function(theJson) {

    ajax(theJson, function(data){
      var scripts = [];
      data = eval(data);
      for (var i = 0, l = data.length; i < l; ++i) {
        scripts.push(['<script src="', baseURL, data[i], '"><\/script>'].join(""));
      }
      document.write(scripts.join(""));
    });

  };

  loader(baseURL + JSONfile);

})()
