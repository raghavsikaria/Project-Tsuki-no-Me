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



const margin = {top: 40, right: 40, bottom: 140, left: 80};

function add_svg(wrapper) 
{
  var svg = d3.select(wrapper).select("svg");

  if (svg.empty())
    svg = d3.select(wrapper).append("svg");
  else
    svg.selectAll("*").remove();

  return svg.attr("width", 400 + margin.left + margin.right).attr("height", 400 + margin.top + margin.bottom);
}

function viz_number_of_words(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 400;
    let visWidth = 400;
    let company_names = data_['company_names'];
    let maximum_number_words = data_['maximum_number_words'];
    let word_types = data_['word_types'];
    let grouped_data = data_['grouped_data'];
    
  g.append("text")
    .attr("x", 400 / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of words in Earnings Call Transcripts");

  const group = d3.scaleBand().domain(company_names).range([0, visWidth]).padding(0.2);
  const y = d3.scaleLinear().domain([0, maximum_number_words]).nice().range([visHeight, 0]);
  const x = d3.scaleBand().domain(word_types).range([0, group.bandwidth()]).padding(0.2);
  const color = d3.scaleOrdinal().domain(word_types).range(d3.schemeTableau10);
    
  svg.append('g')
    .attr('transform', `translate(${100},${100})`)
    .append(() => Legend(color, {width: 100, height: 50, title: "Legend"}));
  
  const xAxis = d3.axisBottom(group);
  const yAxis = d3.axisLeft(y);    
  
  g.append('g')
      .attr('transform', `translate(0,${visHeight})`)
      .call(xAxis)
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(65)")
        .style("text-anchor", "start");
  
  g.append('g')
    .call(yAxis)
    .append("text")
    .attr("fill", "black")
    .attr("dominant-baseline", "middle")
    .attr('transform', 'translate(-45,' + 400/2 + ') rotate(270)')
    .attr("text-anchor", "middle")
    .style('font-size', 12)
    .text("# of Words");
  
  const groups = g.append('g')
    .selectAll('g')
    .data(grouped_data)
    .join('g')
      .attr('transform', d => `translate(${group(d.company)},0)`);

  groups.selectAll('rect')
    .data(d => d.words)
    .join('rect')
      .attr('fill', d => color(d.word))
      .attr('y', d => y(d.count))
      .attr('height', d => visHeight - y(d.count))
      .attr('x', d => x(d.word))
      .attr('width', x.bandwidth());
    
    


//   g.append("text")
//     .attr("x", 400 / 2)
//     .attr("y", -30)
//     .attr("text-anchor", "middle")
//     .attr("dominant-baseline", "hanging")
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "16px")
//     .text("Number of sentences in Earnings Call Transcripts");
    

//     let max_sentence_number = d3.max(data, d => d.number_of_sentences);
//     let sentence_scale = d3.scaleLinear().domain([0, max_sentence_number]).range([visHeight, 0]);
//     let companies = data.map(d => d.company);
//     let company_scale_band = d3.scaleBand().domain(companies).range([0, visWidth]).padding(0.2);
//     let company_scale = d3.scalePoint().domain(companies).range([0, visWidth]).padding(0.2);
//     let xAxis = d3.axisBottom(company_scale);
//     let yAxis = d3.axisLeft(sentence_scale).tickFormat(d3.format('~s'));
    
    
//   g.selectAll('rect')
//     .data(data)
//     .join('rect')
//       .attr('x', d => company_scale_band(d.company))
//       .attr('width', d => company_scale_band.bandwidth())
//       .attr('y', d => sentence_scale(d.number_of_sentences))
//       .attr('height', d => visHeight - sentence_scale(d.number_of_sentences))
//       .attr('fill', 'steelblue');
    
//   g.append('g').call(yAxis);
    
//   g.append('g')
//     .call(yAxis)
//     .append("text")
//     .attr("fill", "black")
//     .attr("dominant-baseline", "middle")
//     .attr('transform', 'translate(-45,' + 400/2 + ') rotate(270)')
//     .attr("text-anchor", "middle")
//     .style('font-size', 12)
//     .text("# of Sentences");
    
//     g.append('g')
//         .attr('transform', `translate(0, ${visHeight})`)
//         .call(d3.axisBottom(company_scale_band))
//       .selectAll("text")
//         .attr("y", 0)
//         .attr("x", 9)
//         .attr("dy", ".35em")
//         .attr("transform", "rotate(65)")
//         .style("text-anchor", "start")
//         .append('text')
//           .attr('fill', 'black')
//           .attr('font-family', 'sans-serif')
//           .attr('x', visWidth / 2)
//           .attr('y', 40)
//           .style('font-size', 12)
//           .text("Companies");

//   g.append("text")
//     .attr("x", 270)
//     .attr("y", 380)
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "12px")
//     .text("ROC AUC Score: " + roc_auc_score);
}