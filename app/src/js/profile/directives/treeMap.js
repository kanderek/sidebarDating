angular.module('TreeMapDirective', [])
  .directive('treeMap', function(){
    return {
      restrict: 'EA',
      scope: {
        data: '='
      },
      template: "",
      link: function(scope, element, attrs){
        // console.log('in directeve link...');
        // console.log(scope.data);
        // console.log(element);
        // console.log(attrs);

        scope.$watch('data', function(data){
          scope.data = data;
          element.html('');
        if(scope.data){
          var w = 460, h = 200;
          var BORDER = 1;

          var tooltip = d3.select('body'/*element[0]*/).append("div")
            .style("position", "absolute")
            .style("z-index", "10000000000")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("padding", "5px");

          var canvas = d3.select(element[0]).append("div")
              .style("width", w + "px")
              .style("height", h + "px")
              .style("position", "relative");

            var treemap = d3.layout.treemap()
                .size([w,h])
                .nodes(scope.data);

            // console.log(treemap);

            var cells = canvas.selectAll(".cell")
                .data(treemap)
                .enter()
                .append("div")
                .attr("class", "cell")
                .style("width", function(d) {return  d.dx - 2*BORDER + "px";})
                .style("height", function(d) { return d.dy - 2*BORDER+ "px";})
                .style("top", function(d){ return d.y + "px";})
                .style("left", function(d){ return d.x  - BORDER + "px";})
                .style("background-color", function(d){ return d.parent ? d.parent.color : d.color;})
                .style("position", "absolute")
                .style("border", "2px solid white")
                .style("color", "white")
                // .on("mouseover", function(d){ console.log(d.parent.name)})
                .on("mouseover", function(d){
                  // console.log("moused over cell...");
                  var tooltipText = "";
                  if(d.parent){
                    tooltipText = d.parent.name  + ', ' + d.name;
                  }
                  return tooltip.style("visibility", "visible").text(tooltipText);
                })
                .on("mousemove", function(){
                  // console.log(d3.event.pageX + ", " + d3.event.pageY);
                  return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
                })
                .on("mouseout", function(){
                  // console.log("moused out from cell...");
                  return tooltip.style("visibility", "hidden");
                });

                cells.append("p")
                .text(function(d){return (d.parent && d.area < w*h/20) ? null : d.name;})
                .attr("class", "label-text")
                .style("margin", "5px 0px 0px 5px")
                .style("font-family", "sans-serif");
              }

      });

      },
      controller: function($scope){
        // console.log('in treemap directive controller');
        // console.log($scope.data);

        $scope.$watch('data', function(data) {
          // console.log('watching in directive...');
          // console.log(data);
          $scope.data = data;
        });
      }
    };
  });