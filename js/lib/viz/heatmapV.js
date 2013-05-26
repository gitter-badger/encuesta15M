var outliers = outliers || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };
outliers.viz.heatmapV = function(options)
{
    var self = {};
    // Pillo los parametros como global vars
    // Pongo lo que me venga por opciones en el self
    for (key in options){
        self[key] = options[key];
    }
    self.increment = self.increment || 1;
    self.parentSelect = "#" + self.parentId;
    // Global de playing
    self.playing = false;
    self.key="encuestas"

    self.init = function (){
      var encuestasPorId = d3.map();
      self.projection = d3.geo.mercator()
        .scale(self.scale)
        .translate(self.translate);
      self.path = d3.geo.path()
        .projection(self.projection);
      self.tooltip =  d3.select(self.parentSelect).append("div")
        .attr("id","tooltip")
        .attr("class", "tooltip")
        .style("opacity", 0);
      function mousemove() {
        self.tooltip
        .style("left", (d3.event.pageX +20) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
      }
      self.svg = d3.select(self.parentSelect).append("svg")
        .attr("width", self.width)
        .attr("height", self.height)
        .on("mousemove", mousemove);
      self.colorEncuestas = d3.scale.sqrt()
          .domain([0,1100])
          .range(self.colorRange);
      self.colorPpt = d3.scale.sqrt()
          .domain([0,0.05])
          .range(self.colorRange);
    }
    self.prerender = function(data,valueData){
      self.values = valueData;
       self.svg.selectAll(".provincias")
           .data(data.features)
           .enter().append("path")
            .attr("class", "provincias")
            .attr("id", function(d) { return "p"+d.properties.ID_2; })
            .on("mouseout",function(d){self.tooltip.style("opacity",0.0);})
            .attr("d", self.path);
    }
    self.render = function(key){
      self.key = key;
      $.each(self.values, function(i, d){
        if(self.key == 'encuestas' ) {
          d3.selectAll("#p"+d.id)
            .style("fill",self.colorEncuestas(parseInt(d[self.key])))
            .on("mouseover", function(d2){
                self.tooltip.style("opacity",1.0)
                  .html("<span class='big'>"+d[self.key]+" encuestas completadas</span>");})
        } else {
          d3.selectAll("#p"+d.id)
            .style("fill",self.colorPpt(parseFloat(d[self.key])))
            .on("mouseover", function(d2){
                self.tooltip.style("opacity",1.0)
                  .html("<span class='big'>"+d[self.key]+"‰ de los habitantes han completado la encuesta");})
        }
      });
    }
    self.init();
    return self;
}

