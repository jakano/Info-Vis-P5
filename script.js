
// Specify the width and height of our graph
// as variables so we can use them later.
// Remember, hardcoding sucks! :)
var width = 1000;
var height = 600;

// Here we tell D3 to select the graph that we defined above.
// Then, we add an <svg></svg> tag inside the graph.
// On the <svg> element, we set the width and height.
// Then, we save the reference to this element in the "svg" variable,
// so we can use it later.
// 
// So our code now looks like this in the browser:
// <svg width="700" height="600">
// </svg>


d3.csv('candy.csv', function(data){
    var candies = [];
    // Choose which catgories to sum up (currently all starting with Q6)
    for (var prop in data[0]) {
        if (prop.startsWith("Q6")) {
            candies.push(prop);
        }
    }
    var candySums = candies.map(candy => d3.nest()
        .key(d => d[candy])
        .rollup(v => v.length)
        .entries(data));
    var xScale = d3.scale.linear()
        .domain([0, candySums.length])
        .range([100, width+100]);
    var yScale = d3.scale.linear()
        .domain([d3.min(candySums, series => d3.min(series, d => d.values)),
                d3.max(candySums, series => d3.max(series, d => d.values))])
        .range([height, 0])



    var svg = d3.select("#graph")
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.selectAll(".circle1")
        .data(candySums)
        .enter()
        .append("circle")
        .attr("stroke", "black")
        .attr("fill", "black")
        .attr("cx", function (d, i) { return xScale(i); })
        .attr("cy", function (d) { return yScale(d[0].values); })
        .attr("r", 5);
    svg.selectAll(".circle2")
        .data(candySums)
        .enter()
        .append("circle")
        .attr("stroke", "red")
        .attr("fill", "red")
        .attr("cx", function (d, i) { return xScale(i); })
        .attr("cy", function (d) { return d[1].values; })
        .attr("r", 5);
    svg.selectAll(".circle3")
        .data(candySums)
        .enter()
        .append("circle")
        .attr("stroke", "green")
        .attr("fill", "green")
        .attr("cx", function (d, i) { return xScale(i); })
        .attr("cy", function (d) { return yScale(d[2].values); })
        .attr("r", 5);

    var xAxis = d3.svg.axis().scale(xScale);
    var yAxis = d3.svg.axis().scale(yScale);


    // TODO: Add axes    
    svg.append("g") // create a group node
    .attr("transform", "translate(0," + (width - 30) + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width - 16)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("...");
  
    // add the Y Axis
    svg.append("g") // create a group node
    .attr("transform", "translate(50, 0)")
    .call(yAxis2)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("...");
});