'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app.factories', [])
.factory('TransectFact', function(){
  return { 
    line_graph_data: [{
      x: [0],
      y: [0],
      error_y: {
        type: 'data',
        array: [0],
        visible: true
      },
      type: 'bar'
    }],
    belt_graph_data: [],
    line_graph_data_pie: [{
      values: [0],
      labels: [0],
      type: 'pie'
    }]
  };
});