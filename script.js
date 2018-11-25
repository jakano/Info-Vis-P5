var graph = document.getElementById('graph');

// Specify the width and height of our graph
// as variables so we can use them later.
// Remember, hardcoding sucks! :)
var width = 700;
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
var svg = d3.select(graph)
    .append('svg')
    .attr('width', width)
    .attr('height', height);