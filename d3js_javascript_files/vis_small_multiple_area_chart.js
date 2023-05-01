const margin = {top: 60, right: 40, bottom: 60, left: 40};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

  return svg.attr("width", 600 + margin.left + margin.right).attr("height", 600 + margin.top + margin.bottom);
}

function viz_prefix_sum_sentiments(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 600;
    let visWidth = 600;
    let data = data_['data_for_viz_prefix_sum_sentiments'];
    // console.log(data);

    const rows = 6;
    const cols = 2;
    let grid = d3.cross(d3.range(rows), d3.range(cols), (row, col) => ({ row, col }));
    
    // console.log(grid);
    
    let row = d3.scaleBand().domain(d3.range(rows)).range([0, visHeight]).paddingInner(0.2);
    let col = d3.scaleBand().domain(d3.range(cols)).range([0, visWidth]).paddingInner(0.2);
    
    industryToScaleAndArea = Object.fromEntries(
      data.map(d => {
        const max_sum = d3.max(d.prefix_sum_sentiments, d => d.prefix_sum);
        const max_sentence = d3.max(d.prefix_sum_sentiments, d => d.number);

        const y = d3.scaleLinear().domain([0, max_sum]).range([row.bandwidth(), 0]);
        const x = d3.scaleLinear().domain([0, max_sentence]).range([0, col.bandwidth()]);

        const area = d3.area()
          .x(d => x(d.number))
          .y1(d => y(d.prefix_sum))
          .y0(d => y(0));

        return [d.company, {y, area, x}];
      })
    )

  const cells = g.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
      .attr('class', 'cell')
      .attr('transform', d => `translate(${col(d.col)}, ${row(d.row)})`);
    
  cells.append('path')
      .attr('d', d => industryToScaleAndArea[d.company].area(d.prefix_sum_sentiments))
      .attr('fill', 'steelblue')
      .attr('stroke', 'blue')
      .attr('stroke-width', 1.2);
  
  cells.each(function(d) {
    const group = d3.select(this);      
    const y_axis = d3.axisLeft(industryToScaleAndArea[d.company].y).ticks(5);
    group.call(y_axis);
    const x_axis = d3.axisBottom(industryToScaleAndArea[d.company].x);
  });
    
  cells.append('text')
    .attr("x", 10)
    .attr("y", 15)
    .attr("text-anchor", "start")
    .attr('font-size', '10px')
    .attr('stroke', 'black')
    .attr('fill', 'black')
    .attr('stroke-width', 0.2)
    .text(d => d.company);
    
  g.append("text")
    .attr("x", 600 / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Prefix Sum of Sentiments (Y axis) across each Transcript corpus sentence (X axis)");
}