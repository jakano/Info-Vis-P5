
// Specify the width and height of our graph
// as variables so we can use them later.
// Remember, hardcoding sucks! :)

var margin = {top: 50, right: 100, bottom: 250, left: 50};

var width = 1500 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

var spacing = 10;

// Here we tell D3 to select the graph that we defined above.
// Then, we add an <svg></svg> tag inside the graph.
// On the <svg> element, we set the width and height.
// Then, we save the reference to this element in the "svg" variable,
// so we can use it later.
// 
// So our code now looks like this in the browser:
// <svg width="700" height="600">



d3.csv('candy.csv', function(data){
    var allCandies = [];
    // Choose which catgories to sum up (currently all starting with Q6)
    for (var prop in data[0]) {
        if (prop.startsWith("Q6")) {
            allCandies.push(prop);
        }
    }
    

    var svg = d3.select("#graph")
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    function update() {
        var male = d3.select("#male").property("checked");
        var female = d3.select("#female").property("checked");
        var other = d3.select("#othergender").property("checked");
        var minage = parseInt(d3.select("#minage").property("value")) || 0;
        var maxage = parseInt(d3.select("#maxage").property("value")) || 80;
        var numCandies = parseInt(d3.select("#numcandies").property("value")) || 48;

        var candies = allCandies.slice(0, numCandies);

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

        d3.selectAll("svg g > *").remove();

        var candySums = candies.map(candy => d3.nest()
        .key(d => d[candy])
        .sortKeys(d3.ascending)
        .rollup(v => v.length)
        .entries(filtered));
        var xScale = d3.scale.linear()
            .domain([0, candySums.length])
            .range([50, width]);
        var yScale = d3.scale.linear()
            .domain([0, data.length * 1.2])
            .range([height, 0]);
        
         var barWidth = width / (candies.length + spacing);

        svg.selectAll(".rect1")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "black")
            .attr("fill", "black")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[0].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[0].values); })
            .attr("data-legend", "Despair");
            
        svg.selectAll(".rect2")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "red")
            .attr("fill", "red")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[2].values + d[0].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[2].values); })
            .attr("data-legend", "Meh");
    
        svg.selectAll(".rect3")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "green")
            .attr("fill", "green")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[1].values + d[0].values + d[2].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[1].values); })
            .attr("data-legend", "Joy");

        var xAxis = d3.svg.axis().scale(xScale)
            .ticks(candies.length)
            .tickFormat((d,i) => i < candies.length ? candies[i].substr(3).replace(/_/g, " ").replace("y s ", "y's ") : "");
        var yAxis = d3.svg.axis().scale(yScale);
        yAxis.orient("left");


        svg.append("g") // create a group node
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(70)")
        .style("text-anchor", "start");
    
        // add the Y Axis
        svg.append("g") // create a group node
        .attr("transform", "translate("+(50 - barWidth/2)+",0)")
        .call(yAxis);

        var legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate("+(width - 100)+",30)")
        .style("font-size","30px")
        .call(d3.legend);

    }

    update();
    d3.selectAll("input").on("change", update);

});