
// Specify the width and height of our graph
// as variables so we can use them later.
// Remember, hardcoding sucks! :)

var margin = {top: 50, right: 100, bottom: 250, left: 150};

var width = 1200 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

var spacing = .8;

var despair = 0;
var joy = 1;
var meh = 2;

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
    for (var i = 0; i < allCandies.length; i++) {
        $("#candySelect").append('<option value="'+allCandies[i]+'">'+cleanCandyName(allCandies[i])+'</option>');
    }
    $("#candySelect").multipleSelect({
        filter: true,
        isOpen: true,
        keepOpen: true,
        styler: v => 'font-size:26px',
        width: '500px',
        maxHeight: '600'
    });

    $("#candySelect").multipleSelect("checkAll");
    $(".ms-search input").attr("placeholder", "Search for a candy");

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
        var candies = $("#candySelect").multipleSelect('getSelects');

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
        
        var yScale = d3.scale.linear()
            .domain([0, filtered.length * 1.2])
            .range([height, 0]);
        
        var barWidth = Math.min((width / (candies.length)) * spacing, 100);
        var xScale = d3.scale.linear()
            .domain([0, candySums.length])
            .range([barWidth/2, width + barWidth/2]);
         // Define the var for the tooltip
         var tooltip = d3.select("body").append("div")	
         .attr("class", "tooltip")				
         .style("opacity", 0);

        var highlight_color = "#ffaa0c";

        svg.selectAll(".rect1")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "red")
            .attr("fill", "red")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[0].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[0].values); })
            .attr("data-legend", "Despair")
            .attr("class", "candyBar")
            .on("mouseover", function(d, i) {
                d3.select(this)
                    .attr("fill", highlight_color);
                tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltip.html(tootltipMessage(despair, d, i))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
            })
            .on("mouseout", function(d) {
                d3.select(this)
		   		    .transition()
                    .duration(250)
                    .attr("fill", "red");
                tooltip.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
                
            });
            
        svg.selectAll(".rect2")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "#ffee0c")
            .attr("fill", "#ffee0c")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[2].values + d[0].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[2].values); })
            .attr("data-legend", "Meh")
            .attr("class", "candyBar")
            .on("mouseover", function(d, i) {
                d3.select(this)
                    .attr("fill", highlight_color);
                tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltip	.html(tootltipMessage(meh, d, i))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
            })
            .on("mouseout", function(d) {
                d3.select(this)
		   		    .transition()
                    .duration(250)
                    .attr("fill", "#ffee0c");
                tooltip.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
                
            });
    
        svg.selectAll(".rect3")
            .data(candySums)
            .enter()
            .append("rect")
            .attr("stroke", "#006600")
            .attr("fill", "#006600")
            .attr("x", function (d, i) { return xScale(i) - barWidth/2; })
            .attr("y", function (d) { return yScale(d[1].values + d[0].values + d[2].values); })
            .attr("width", barWidth)
            .attr("height", function (d) { return height - yScale(d[1].values); })
            .attr("data-legend", "Joy")
            .attr("class", "candyBar")
            .on("mouseover", function(d, i) {
                d3.select(this)
                    .attr("fill", highlight_color);
                tooltip.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                tooltip	.html(tootltipMessage(joy, d, i))	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
            })
            .on("mouseout", function(d) {
                d3.select(this)
		   		    .transition()
                    .duration(250)
                    .attr("fill", "#006600");
                tooltip.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
                
            });

        var xAxis = d3.svg.axis().scale(xScale)
            .ticks(candies.length)
            .tickFormat((d,i) => i < candies.length ? cleanCandyName(candies[i]) : "");
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
        .call(yAxis);

        var legend = svg.append("g")
        .attr("class","legend")
        .attr("transform","translate("+(width - 100)+",30)")
        .style("font-size","20px")
        .call(d3.legend);
        
        var axis_font_size = "24";
        var title_font_size = "32";

        var xAxisTitle = svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width/2) + "," + 800 + ")")
            .attr("font-size", axis_font_size)
            .text("Candy");

        var yAxisttitle = svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(-50," +(height/2)+")rotate(-90)")
            .attr("font-size", axis_font_size)
            .text("Number Of Reviewers");

        var title = svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width/2) + "," + 15 +")")
            .attr("font-size", title_font_size)
            .text("Candy Survey Opinions");
        
        var legendtitle = svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width- 65) + "," + -10 +")")
            .attr("font-size", axis_font_size)
            .text("Legend");

       

       function tootltipMessage(type, data, i) {
            var joy_text = type == joy ? "<span class=highlighted>Joy: " + data[joy].values + "</span>" : "Joy: " + data[joy].values;
            var meh_text = type == meh ? "<span class=highlighted>Meh: " + data[meh].values + "</span>" : "Meh: " + data[meh].values;
            var despair_text = type == despair ? "<span class=highlighted>Despair: " + data[despair].values + "</span>" : "Despair: " + data[despair].values;
            var total = data[joy].values + data[meh].values + data[despair].values;
            var tooltip_title = "<span class=tooltip-header>" + cleanCandyName(candies[i]) + " Ratings" + "</span>" ;
            var tooltip_total = "Total Ratings: " + total;
            return tooltip_title + "<br/>" + joy_text.toString() + "<br/>" + meh_text.toString() + "<br/>" + despair_text.toString() + "<br/>" + tooltip_total;
       } 

    }

    update();
    d3.selectAll("input").on("change", update);

});

function cleanCandyName(candy) {
    return candy.substr(3).replace(/_/g, " ").replace("y s ", "y's ");
}