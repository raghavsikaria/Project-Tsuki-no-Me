//#####################################################
// ATTENTION THIS IS 
// CODE SOURCED FROM ORIGINAL D3 LIBRARY
// FOR LEGEND IN THE SVG ONLY
// Copyright 2021, Observable Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/color-legend
//#####################################################
function Legend(color, {
  title,
  tickSize = 6,
  width = 320, 
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("class", "title")
        .text(title));

  return svg.node();
}

//#####################################################
// CODE SOURCED FROM ORIGINAL D3 LIBRARY
// FOR LEGEND IN THE SVG ONLY
// STOP
//#####################################################



const margin = {top: 40, right: 40, bottom: 40, left: 40};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

  return svg.attr("width", 600 + margin.left + margin.right).attr("height", 600 + margin.top + margin.bottom);
}

function viz_lda_topics(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    // let visHeight = 400;
    // let visWidth = 400;

    let height = 600;
    let width = 600;

    let data = data_["data"];
    let topics = data_["topics"];
    let words = data_["words"];
    let max_value = data_["max_value"];

  const cellSize = (width - margin.left - margin.right) / topics.length;
  const visWidth = topics.length * cellSize;
  const visHeight = words.length * cellSize;

    
  const y = d3.scalePoint()
      .domain(words)
      .range([0, visHeight])
      .padding(0.2);
  
  const x = d3.scalePoint()
      .domain(topics)
      .range([0, visWidth])
      .padding(0.5);
    
  const maxRadius = Math.min(y.step(), x.step()) / 2 - 2;
  const radius = d3.scaleSqrt()
      .domain([0, max_value])
      .range([0, maxRadius]);
    

  const xAxis = d3.axisBottom(x);
  
  g.append("g")
      .attr("transform", `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.select(".domain").remove())
    .append("text")
      .attr("x", visWidth / 2)
      .attr("y", 40)
      .attr("fill", "black")
      .attr("text-anchor", "middle")
    .style('font-size', 12)
      .text("Topics generated by LDA");
  
  const yAxis = d3.axisLeft(y);
  
  g.append("g")
      // .call(yAxis)
      .call(g => g.select(".domain").remove())
    .append("text")
      .attr("x", -margin.left)
      .attr("y", visHeight / 2)
      .attr("fill", "black")
      .attr("dominant-baseline", "middle")
      .attr('transform', 'translate(-270,' + 600/2 + ') rotate(270)')
      .attr("text-anchor", "start")
    .style('font-size', 12)
      .text("Words & Significance scores");
  
  const cols = g.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.topic))
      .attr("cy", d => y(d.word))
      .attr("r", d => radius(d.significance_score))
      .attr("fill", "#ADD8E6");
    
    g.append("g").selectAll("circle")
       .data(data)
       .enter()
       .append("text")
       .text(d => d.value)
       .attr("x", d => x(d.topic))
       .attr("y", d => y(d.word))
       .attr("fill", "white")
       .attr("stroke", "black")
       .attr("stroke-width", 1.2)
       .attr("dominant-baseline", "middle")
       .attr("text-anchor", "middle");
    
    
  const legend = g.append("g")
      .attr("transform", `translate(${visWidth + margin.right}, 0)`)
    .selectAll("g")
    .data([0.001, 0.03, 0.05])
    .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 2.2 * maxRadius})`);
  
  legend.append("circle")
    .attr("r", d => radius(d))
    .attr("fill", "#ADD8E6");

  legend.append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 12)
    .attr("dominant-baseline", "middle")
    .attr("x", maxRadius + 5)
    .text(d => d);
}