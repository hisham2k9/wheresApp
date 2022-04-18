
$(document).ready(function () {

    /*
    data = {
        datasets: [{
            data: [10, 20, 30]
        }],
    
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    };

    options = {};

    var ctx = $("#slapie");

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
    */

   var ctx1 = document.getElementById("slaChart");
   var slaChart = new Chart(ctx1, {
     type: 'doughnut',
     data: {
       labels: ['Completed', 'Remaining'],
       datasets: [{
         label: '% of Calls',
         data: [76, 24],
         backgroundColor: [
           'rgba(255, 99, 132, 0.5)',
           'rgba(54, 162, 235, 0.2)',
           'rgba(255, 206, 86, 0.2)',
           'rgba(75, 192, 192, 0.2)'
         ],
         borderColor: [
           'rgba(255,99,132,1)',
           'rgba(54, 162, 235, 1)',
           'rgba(255, 206, 86, 1)',
           'rgba(75, 192, 192, 1)'
         ],
         borderWidth: 1
       }]
     },
     options: {
       responsive: false,
     }
   });

   var ctx2 = document.getElementById("agentTxfrChart");
   var agentTxfrChart = new Chart(ctx2, {
     type: 'doughnut',
     data: {
       labels: ['Completed', 'Remaining'],
       datasets: [{
         label: '% of Calls',
         data: [82, 18],
         backgroundColor: [
           'rgba(255, 99, 132, 0.5)',
           'rgba(54, 162, 235, 0.2)',
           'rgba(255, 206, 86, 0.2)',
           'rgba(75, 192, 192, 0.2)'
         ],
         borderColor: [
           'rgba(255,99,132,1)',
           'rgba(54, 162, 235, 1)',
           'rgba(255, 206, 86, 1)',
           'rgba(75, 192, 192, 1)'
         ],
         borderWidth: 1
       }]
     },
     options: {
       responsive: false,
     }
   });

});