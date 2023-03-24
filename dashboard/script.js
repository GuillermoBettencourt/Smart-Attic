const margin = { top: 20, right: 30, bottom: 40, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


function init() {
  createLineGraph("#vi1");
}

function createLineGraph(id) {
  const parseDate = d3.timeParse("%d %b %H:%M");
  const formatDate = d3.timeFormat("%H:%M");

  // console.log(parseDate("12 Jun 22:39"));

  const svg = d3
    .select(id)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("id", "gLineGraph")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)

  d3.json("data.json").then(function (data) {
    // group the data: I want to draw one line per group
    const sumstat = d3.group(data, d => d.metric); // nest function allows to group the calculation per level of a factor

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return parseDate(d.date); }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(formatDate));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // color palette
    const color = d3.scaleOrdinal()
      .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
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
    .style("fill", "steelblue")
    .on("mouseover", (event, d) => handleMouseOver(d))
    .on("mouseleave", (event, d) => handleMouseLeave())
    .append("title")
    .text((d) => {
      let symbol;
      switch (d.metric) {
        case "Temperature":
          symbol = "°C"
          break
        case "Humidity":
          symbol= "%"
          break
      }
      return `Date: ${d.date}\n${d.metric}: ${d.value} ${symbol}`;
    });
  });
}

function handleMouseOver(item) {
  d3.selectAll(".itemValue")
    .filter(function (d, i) {
      return d.date == item.date && d.metric == item.metric;
    })
    .attr("r", 10)
}

function handleMouseLeave() {
  d3.selectAll(".itemValue").style("fill", "steelblue").attr("r", 4);
}
