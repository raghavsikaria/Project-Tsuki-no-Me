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

function viz_number_of_sentences(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 400;
    let visWidth = 400;
    let data = data_['viz_data'];
    console.log(data);

  g.append("text")
    .attr("x", 400 / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of sentences in Earnings Call Transcripts");
    

    let max_sentence_number = d3.max(data, d => d.number_of_sentences);
    let sentence_scale = d3.scaleLinear().domain([0, max_sentence_number]).range([visHeight, 0]);
    let companies = data.map(d => d.company);
    let company_scale_band = d3.scaleBand().domain(companies).range([0, visWidth]).padding(0.2);
    let company_scale = d3.scalePoint().domain(companies).range([0, visWidth]).padding(0.2);
    let xAxis = d3.axisBottom(company_scale);
    let yAxis = d3.axisLeft(sentence_scale).tickFormat(d3.format('~s'));
    
    
  g.selectAll('rect')
    .data(data)
    .join('rect')
      .attr('x', d => company_scale_band(d.company))
      .attr('width', d => company_scale_band.bandwidth())
      .attr('y', d => sentence_scale(d.number_of_sentences))
      .attr('height', d => visHeight - sentence_scale(d.number_of_sentences))
      .attr('fill', 'steelblue');
    
  g.append('g').call(yAxis);
    
  g.append('g')
    .call(yAxis)
    .append("text")
    .attr("fill", "black")
    .attr("dominant-baseline", "middle")
    .attr('transform', 'translate(-45,' + 400/2 + ') rotate(270)')
    .attr("text-anchor", "middle")
    .style('font-size', 12)
    .text("# of Sentences");
    
    g.append('g')
        .attr('transform', `translate(0, ${visHeight})`)
        .call(d3.axisBottom(company_scale_band))
      .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(65)")
        .style("text-anchor", "start")
        .append('text')
          .attr('fill', 'black')
          .attr('font-family', 'sans-serif')
          .attr('x', visWidth / 2)
          .attr('y', 40)
          .style('font-size', 12)
          .text("Companies");

//   g.append("text")
//     .attr("x", 270)
//     .attr("y", 380)
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "12px")
//     .text("ROC AUC Score: " + roc_auc_score);
}

function viz_number_of_characters(wrapper, data_)
{
  let svg = add_svg(wrapper);
  const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    let visHeight = 400;
    let visWidth = 400;
    let data = data_['viz_data'];
    console.log(data);

  g.append("text")
    .attr("x", 400 / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .text("Number of characters in Earnings Call Transcripts");
    

    let max_characters = d3.max(data, d => d.number_of_characters);
    let character_scale = d3.scaleLinear().domain([0, max_characters]).range([visHeight, 0]);
    let companies = data.map(d => d.company);
    let company_scale_band = d3.scaleBand().domain(companies).range([0, visWidth]).padding(0.2);
    let company_scale = d3.scalePoint().domain(companies).range([0, visWidth]).padding(0.2);
    let xAxis = d3.axisBottom(company_scale);
    let yAxis = d3.axisLeft(character_scale).tickFormat(d3.format('~s'));
    
    
  g.selectAll('rect')
    .data(data)
    .join('rect')
      .attr('x', d => company_scale_band(d.company))
      .attr('width', d => company_scale_band.bandwidth())
      .attr('y', d => character_scale(d.number_of_characters))
      .attr('height', d => visHeight - character_scale(d.number_of_characters))
      .attr('fill', 'steelblue');
    
  g.append('g').call(yAxis);
    
  g.append('g')
    .call(yAxis)
    .append("text")
    .attr("fill", "black")
    .attr("dominant-baseline", "middle")
    .attr('transform', 'translate(-45,' + 400/2 + ') rotate(270)')
    .attr("text-anchor", "middle")
    .style('font-size', 12)
    .text("# of Characters");
    
g.append('g')
    .attr('transform', `translate(0, ${visHeight})`)
    .call(d3.axisBottom(company_scale_band))
  .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(65)")
    .style("text-anchor", "start")
    .append('text')
      .attr('fill', 'black')
      .attr('font-family', 'sans-serif')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .style('font-size', 12)
      .text("Companies");

//   g.append("text")
//     .attr("x", 270)
//     .attr("y", 380)
//     .attr("font-family", "sans-serif")
//     .attr("font-size", "12px")
//     .text("ROC AUC Score: " + roc_auc_score);
}