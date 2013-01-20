/*
 jquery.apachetree.js

 Returns the content of an Apache Directory Index 

 Usage :

 $.getApacheTree('http://your.browseable.directory/').done(
   function(data){
     // Do something with data
   }
 );

 Author : Henri Bourcereau
 http://github.com/mmai/apachetree

 The code in the indexList function which do the parsing of an apache index page is borrowed from Theo.cc
 http://theo.cc/blog/2012/11/javascript-list-directory-contents-with-apache-indexes/. 
*/

(function($) {
    $.getApacheTree =  function(url){
      return new ApacheTree(url).get();
    };

    ApacheTree = function(url){
      this.url = url;
    };

    ApacheTree.prototype.get = function(){
      return this.getTree(this, [], this.url);
    };

    ApacheTree.prototype.getTree = function (self, root, path) {
      var deferred = $.Deferred();

      self.indexList(path).done(function (files) {
          var promises = [];
          for (var i=0,len = files.length;i<len;i++){
            var file = files[i];
            var treeNode = {
              file: file,
              href: path + file
            };
            if (file.charAt(file.length-1 ) == '/'){
              treeNode.nodes = [];
              promises.push(self.getTree(self, treeNode.nodes, path+file));
            }
            root.push(treeNode);
          }
          $.when.apply($, promises).done(function(){
              deferred.resolve(root);
            });
        });
      return deferred.promise();
    };

    ApacheTree.prototype.indexList = function (path) {
      var deferred = $.Deferred();
      $.ajax(path).done(
        function(html) {
          /* Sanity check: is this an Apache directory index?  */
          html = $('<html>').html(html);
          if($('title', html)[0].innerHTML.substr(0, 8) !== "Index of"){
            throw "Bad Apache directory index: " + path;
          }

          /* Get all the hrefs after the "Parent Directory"
           * link: these are the contents of the directory.
           */
          var passedParentLink = false;
          var files = $('a', html).filter( function(i, a) {
              if (passedParentLink) return true;
              if (a.innerHTML.trim() === "Parent Directory") passedParentLink = true;
              return false;
            });

          var tidied = $(files).map(function(i, a) {
              if (a.href.substr(-1) === '/') return a.href.split('/').slice(-2,-1) + '/';
              return a.href.split('/').pop();
            });

          deferred.resolve(tidied);
        })
      .fail(
        function(jqXHR, error, errorThrown) {
          throw "ApacheTree $.axax error :" + errorThrown;
        }
      );
      return deferred.promise();
    };
  })(jQuery);

