const margin = {top: 60, right: 40, bottom: 60, left: 40};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

    var diameter = 600;
    return svg.attr("width", diameter).attr("height", diameter + 20).attr("class", "bubble");
}

function viz_top_10_words(wrapper, data_)
{
  let svg = add_svg(wrapper);
    let data = data_['data_for_viz_top_10_words'];
    let mode = data_['mode'];
    let title = "";
    if (mode === "freq")
    {
        title = "Occurences of top 10 words from all transcripts by frequency";
    }
    else
    {
        title = "Occurences of top 10 words from all transcripts by TF-IDF Score";
    }

    function custom_text_color(p)
    {
      if (p < 6){return "black";}
      else{return "white"}
    }
  
    const dataset_1 = {"children": data};

    var diameter = 600;
    var bubble = d3.pack(dataset_1).size([diameter, diameter]).padding(1.5);

    svg.append("text")
    .attr("x", diameter / 2)
    .attr("y", diameter-50)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "Arial")
    .attr("font-size", "15px")
    .text(title);

    const color = d3.scaleSequential().domain([-5, d3.max(data, d => d.number_of_transcripts)]).interpolator(d3.interpolateOranges)
    
    var nodes = d3.hierarchy(dataset_1).sum(d => d.number_of_transcripts);
    var node = svg.selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(d => !d.children)
      .append("g")
      .attr("class", "node")
      .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

    node.append("circle")
      .attr("r", d => d.r)
      .style("fill", (d,i) => color(data[i]["number_of_transcripts"]))
      .style("stroke", (d,i) => "#e60049")
      .style("stroke-width", (d,i) => 2.4);

    node.append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .text(d => d.data.word)
      .attr("font-family", "sans-serif")
      .attr("font-size", d => d.r/4)
      .attr("fill", d => custom_text_color(d.data.number_of_transcripts));
  
    node.append("text")
      .attr("dy", "1.3em")
      .style("text-anchor", "middle")
      .text(d => d.data.number_of_transcripts + " transcripts")
      .attr("font-family",  "Gill Sans", "Gill Sans MT")
      .attr("font-size", d => d.r/6)
      .attr("fill", d => custom_text_color(d.data.number_of_transcripts));
}