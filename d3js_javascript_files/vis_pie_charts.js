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


const margin = {top: 10, right: 10, bottom: 10, left: 10};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

  return svg.attr("width", 900 + margin.left + margin.right).attr("height", 320 + margin.top + margin.bottom);
}

function viz_sentiment_counts(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 320;
    let visWidth = 900;
    
    let temp = d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv");
    console.log(temp);

  g.append('text')
      .attr('x', visWidth / 2)
      .attr('y', -margin.top + 50)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '20px')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'hanging')
      .text('Relative Amount of Sentiments');
    
    let data = data_["data_for_viz_sentiment_counts"];
    let company_name = data_["company_name"];
    
    const color = d3.scaleOrdinal().domain(["Positive", "Negative", "Neutral"]).range(["#90EE90", "#e15759", "#E5E4E2"]);
  svg.append('g')
    .attr('transform', `translate(${100},${-margin.top + 70})`)
    .append(() => Legend(color, {width: 140, height: 50, title: "Sentiments"}));
  
  const x = d3.scalePoint().domain(company_name).range([0, visWidth]).padding(0.5);
  const outerRadius = x.step() / 2.1;
  const xAxis = d3.axisBottom(x);

  g.append('g')
    .attr('transform', `translate(0,${(visHeight / 2) + outerRadius + 5})`)
    .call(xAxis)
    .call(g => g.select('.domain').remove())
    .selectAll("text")
        .attr("y", 3)
        .attr("x", 7)
        .attr("dy", ".35em")
        .attr("transform", "rotate(65)")
        .style("text-anchor", "start");

  const pie = d3.pie().value(d => d.count);
  const arc = d3.arc().innerRadius(0).outerRadius(outerRadius);

  const pieGroups = g.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
      .attr('transform', d => `translate(${x(d.company)},${visHeight / 2})`);

  pieGroups.selectAll('path')
    .data(d => pie(d.sentiment_count))
    .join('path')
      .attr('d', d => arc(d))
      .attr('fill', d => color(d.data.sentiment))
      .attr('stroke', "black")
      .attr('stroke-width', 0.2);
}