
// Specify the width and height of our graph
// as variables so we can use them later.
// Remember, hardcoding sucks! :)
var width = 1500;
var height = 600;

// Here we tell D3 to select the graph that we defined above.
// Then, we add an <svg></svg> tag inside the graph.
// On the <svg> element, we set the width and height.
// Then, we save the reference to this element in the "svg" variable,
// so we can use it later.
// 
// So our code now looks like this in the browser:
// <svg width="700" height="600">



d3.csv('candy.csv', function(data){
    var candies = [];
    // Choose which catgories to sum up (currently all starting with Q6)
    for (var prop in data[0]) {
        if (prop.startsWith("Q6")) {
            candies.push(prop);
        }
    }
    

    var svg = d3.select("#graph")
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    

    function update() {
        var male = d3.select("#male").property("checked");
        var female = d3.select("#female").property("checked");
        var other = d3.select("#othergender").property("checked");
        var minage = parseInt(d3.select("#minage").property("value")) || 0;
        var maxage = parseInt(d3.select("#maxage").property("value")) || 80;

        if (minage > maxage) {
            alert("Please choose a valid age range!");
            return;
        }
        filtered = data.filter(function(d){
            if (d.Q3_AGE >= minage && d.Q3_AGE <= maxage) {
                if (male && d.Q2_GENDER === "Male") {
                    return true;
                }
                if (female && d.Q2_GENDER === "Female") {
                    return true;
                }
                if (other && d.Q2_GENDER !== "Male" && d.Q2_GENDER !== "Female") {
                    return true;
                }
            }
            return false;
        });

        d3.selectAll("svg > *").remove();

        var candySums = candies.map(candy => d3.nest()
        .key(d => d[candy])
        .sortKeys(d3.ascending)
        .rollup(v => v.length)
        .entries(filtered));
        var xScale = d3.scale.linear()
            .domain([0, candySums.length])
            .range([100, width-100]);
        var yScale = d3.scale.linear()
            .domain([0, data.length * 1.2])
            .range([height- 10, 10]);
        
        svg.selectAll(".rect1")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr("fill", "black")
            .attr("x", function (d, i) { return xScale(i) - 5; })
            .attr("y", function (d) { return yScale(d[0].values) - 10; })
            .attr("width", 10)
            .attr("height", function (d) { return height - yScale(d[0].values) - 10; });
            
        svg.selectAll(".rect2")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "red")
            .attr("fill", "red")
            .attr("x", function (d, i) { return xScale(i) - 5; })
            .attr("y", function (d) { return yScale(d[2].values + d[0].values) - 10; })
            .attr("width", 10)
            .attr("height", function (d) { return height - yScale(d[2].values) - 10; });
    
        svg.selectAll(".circle3")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "green")
            .attr("fill", "green")
            .attr("x", function (d, i) { return xScale(i) - 5; })
            .attr("y", function (d) { return yScale(d[1].values + d[0].values + d[2].values) - 10; })
            .attr("width", 10)
            .attr("height", function (d) { return height - yScale(d[1].values) - 10; });

        var xAxis = d3.svg.axis().scale(xScale);
        var yAxis = d3.svg.axis().scale(yScale);
        yAxis.orient("left");


        svg.append("g") // create a group node
        .attr("transform", "translate(0," + (height - 20) + ")")
        .call(xAxis);
    
        // add the Y Axis
        svg.append("g") // create a group node
        .attr("transform", "translate(50, 0)")
        .call(yAxis);
    }

    update();
    d3.selectAll("input").on("change", update);

});