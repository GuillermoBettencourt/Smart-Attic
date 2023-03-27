const margin = { top: 20, right: 150, bottom: 40, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const temperature = "Temperature", humidity = "Humidity";
const tempMin = 10, tempMax = 30;
const humMin = 30, humMax = 60;
const minutes = 30;
const refreshSecs = 10;
const jsonFile = "../static/data.json";


function init() {
  createLineGraph("#vi1");
  window.setInterval(function() {
    console.log("updating...")
    updateLineGraph("#vi1")
  }, refreshSecs * 1000)
}

function createLineGraph(id) {
  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  const formatDate = d3.timeFormat("%H:%M:%S");

  const svg = d3
    .select(id)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("id", "gLineGraph")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
  
  const legend = svg
  .append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 75}, ${0})`);

  const labels = [
      {color: '#7ab8eb', label: humidity},
      {color: '#cf6c30', label: temperature}
  ];
  
  legend.selectAll('rect')
    .data(labels)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', function(d, i) { return i * 20; })
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', function(d) { return d.color; })
    .attr("stroke", "#999")
    .attr("stroke-width", 1);
  
  legend.selectAll('text')
    .data(labels)
    .enter()
    .append('text')
    .attr('x', 15)
    .attr('y', function(d, i) { return i * 20 + 9; })
    .text(function(d) { return d.label; })
    .attr("font-size", "12px")
    .attr("font-family", "sans-serif");
  

  d3.json(jsonFile).then(function (data) {
    let lastXMinutes = new Date()
    lastXMinutes.setMinutes(lastXMinutes.getMinutes() - minutes)

    // only use data from last X minutes
    data = data.filter(function (elem) {
      return lastXMinutes <= parseDate(elem.date);
    });

    // group the data
    const sumstat = d3.group(data, d => d.metric);

    // Add X axis
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("id", "gXAxis")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(formatDate));
    
    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("id", "gYAxis")
      .call(d3.axisLeft(y));

    // Color palette
    const color = d3.scaleOrdinal()
      .range(['#cf6c30','#7ab8eb','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
        

    // Draw the lines
    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
          .attr("class", "pathValue")
          .attr("fill", "none")
          .attr("stroke", function(d){ return color(d[0]) })
          .attr("stroke-width", 1.5)
          .attr("d", function(d){
            return d3.line()
              .x(function(d) { return x(parseDate(d.date)); })
              .y(function(d) { return y(d.value); })
              (d[1])
          })
    
    
    svg
    .selectAll("circle.circleValues") 
    .data(data, (d) => d.metric) 
    .join("circle")
      .attr("class", "circleValues itemValue")
      .attr("cx", (d) => x(parseDate(d.date)))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .style("fill", (d) => circleColor(d))
      .on("mouseover", (event, d) => handleMouseOver(d))
      .on("mouseleave", (event, d) => handleMouseLeave())
      .append("title")
      .text((d) => {
        let symbol;
        switch (d.metric) {
          case temperature:
            symbol = "°C"
            break
          case humidity:
            symbol= "%"
            break
        }
        return `Date: ${d.date}\n${d.metric}: ${d.value} ${symbol}`;
      });
  });
}

function updateLineGraph(id) {
  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  const formatDate = d3.timeFormat("%H:%M:%S");

  d3.json(jsonFile).then(function (data) {
    let lastXMinutes = new Date()
    lastXMinutes.setMinutes(lastXMinutes.getMinutes() - minutes)

    // only use data from last X minutes
    data = data.filter(function (elem) {
      return lastXMinutes <= parseDate(elem.date);
    });

    // group the data
    const sumstat = d3.group(data, d => d.metric);

    // Select the svg element
    const svg = d3.select("#gLineGraph");

    // Update X axis
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
      .range([ 0, width ]);
    svg.select("#gXAxis")
      .call(d3.axisBottom(x).ticks(5).tickFormat(formatDate));

    // Update Y axis
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0 ]);
    svg.select("#gYAxis")
      .call(d3.axisLeft(y));

    // Color palette
    const color = d3.scaleOrdinal()
      .range(['#cf6c30','#7ab8eb','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

  // Update the lines
  svg.selectAll(".pathValue")
    .data(sumstat)
    .join("path")
    .attr("class", "pathValue")
    .attr("fill", "none")
    .attr("stroke", function(d){ return color(d[0]); })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
        return d3.line()
            .x(function(d) { return x(parseDate(d.date)); })
            .y(function(d) { return y(d.value); })
            (d[1]);
    })
    .transition()
    .duration(1000)
    .attr("d", function(d){
        return d3.line()
            .x(function(d) { return x(parseDate(d.date)); })
            .y(function(d) { return y(d.value); })
            (d[1]);
    });

    // Draw the circles
    svg
      .selectAll("circle.circleValues")
      .data(data, (d) => d.metric)
      .join(
        (enter) => {
          circles = enter
            .append("circle")
            .attr("class", "circleValues itemValue")
            .attr("cx", (d) => x(parseDate(d.date)))
            .attr("cy", (d) => y(d.value))
            .attr("r", 4)
            .style("fill", (d) => circleColor(d))
            .on("mouseover", (event, d) => handleMouseOver(d))
            .on("mouseleave", (event, d) => handleMouseLeave())
          circles
            .transition()
            .duration(1000)
          circles
            .append("title")
            .text((d) => {
              let symbol;
              switch (d.metric) {
                case temperature:
                  symbol = "°C"
                  break
                case humidity:
                  symbol= "%"
                  break
              }
              return `Date: ${d.date}\n${d.metric}: ${d.value} ${symbol}`;
            });
        },
        (update) => {
          update
            .transition()
            .duration(1000)
            .attr("cx", (d) => x(parseDate(d.date)))
            .attr("cy", (d) => y(d.value))
            .attr("r", 4)
        },
        (exit) => { 
          exit.remove(); 
        }
      )
  });
}

function circleColor(d) {
  let metricMin, metricMax;

  switch (d.metric) {
    case temperature:
      metricMin = tempMin;
      metricMax = tempMax;
      break
    case humidity:
      metricMin = humMin;
      metricMax = humMax;
      break
  }
  
  return d.value < metricMin || d.value > metricMax ? "red" : "steelblue";
}

function handleMouseOver(item) {
  d3.selectAll(".itemValue")
    .filter(function (d, i) {
      return d.date == item.date && d.metric == item.metric;
    })
    .attr("r", 10)
}

function handleMouseLeave() {
  d3.selectAll(".itemValue").attr("r", 4);
}
