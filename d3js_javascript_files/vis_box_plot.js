//#####################################################
// ATTENTION
// MUCH OF BOX PLOT CODE IS SOURCED FROM 
// https://d3-graph-gallery.com/graph/boxplot_show_individual_points.html
// LINK to original publishing ^
//#####################################################

const margin = {top: 40, right: 40, bottom: 40, left: 40};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

  return svg.attr("width", 700 + margin.left + margin.right).attr("height", 400 + margin.top + margin.bottom);
}

function viz_parts_of_transcript_boxplot(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 400;
    let visWidth = 700;
    let data = data_['data_for_parts_of_transcript_boxplot'];
    let sumstat = data_['data_for_parts_of_transcript_boxplot_specifics'];
    
    g.append("text")
        .attr("x", visWidth / 2)
        .attr("y", -30)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "hanging")
        .attr("font-family", "sans-serif")
        .attr("font-size", "15px")
        .text("Box Plot of parts of transcripts over avg sentiment scores");

    var x = d3.scaleBand()
        .range([ 0, visWidth ])
        .domain(['1st 5 sentences', '1st quarter of transcript', '2nd quarter of transcript', '3rd quarter of transcript', '4th quarter of transcript', 'Last 5 sentences'])
        .paddingInner(1)
        .paddingOuter(.5);
    
    g.append("g")
        .attr("transform", "translate(0," + visHeight + ")")
        .call(d3.axisBottom(x));

    var y = d3.scaleLinear().domain([-0.3,1.1]).range([visHeight, 0]);
    
    g.append("g").call(d3.axisLeft(y));

    g
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", d => x(d.key))
      .attr("x2", d => x(d.key))
      .attr("y1", d => y(d.value.min))
      .attr("y2", d => y(d.value.max))
      .attr("stroke", "black")
      .style("width", 40);

    var boxWidth = 50;
    g
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", d => x(d.key)-boxWidth/2)
        .attr("y", d => y(d.value.q3))
        .attr("height", d => y(d.value.q1)-y(d.value.q3))
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#E15759");

    g
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", d => x(d.key)-boxWidth/2)
      .attr("x2", d => x(d.key)+boxWidth/2)
      .attr("y1", d => y(d.value.median))
      .attr("y2", d => y(d.value.median))
      .attr("stroke", "black")
      .style("width", 80);

    // Add individual points with jitter
    var jitterWidth = 25;
    g
      .selectAll("indPoints")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", d => x(d.part_of_transcript) - jitterWidth/2 + Math.random()*jitterWidth )
        .attr("cy", d => y(d.s_value))
        .attr("r", 3)
        .style("fill", "#E5E4E2")
        .attr("stroke", "black")
        .attr("stroke-width", 0.5);


}