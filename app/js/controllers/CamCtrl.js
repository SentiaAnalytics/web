/**
 * login controller
 * @author Andreas
 * @date   2014-04-11
 */
var moment = require('moment');
/*jslint browser:true, nomen:true*/
module.exports = function($scope, $route, $routeParams, $location, Cam) {
  'use strict';
  $scope.date = moment.utc()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .millisecond(0)
    .toDate();

  $scope.store = "54318d4064acfb0b3139807e"; // because we only have one :)
  $scope.$root.showHeader = true;
  $scope.$root.page = 'cam';
  $scope.camera = null;
  $scope.people = {};
  console.log($routeParams);
  if (Cam.selectedCam) {
    $scope.camera = Cam.selectedCam;
  } else if ($routeParams.id) {
    Cam.read($routeParams.id)
      .then(function(cam) {
        $scope.camera = cam;
        updateOverlay();
          getPeople();
      });
  }

  $scope.$watch('date', function() {
    updateOverlay();
    getPeople();
  });
  $scope.activeTab = 0;
  $scope.selectTab = function(tab) {
    $scope.activeTab = tab;
  };
  function getPeople () {
    if (!$scope.camera || !$scope.camera.counter) {
      return;
    }
    Cam.getPeople({camera: $scope.camera._id, date: $scope.date})
    .then(function(data) {
      var people_in = [], people_out = [], bounce = [], i,total_bounce = 0, total_in = 0, total_out = 0;
      for (i = 0; i < 24; i += 1) {
        people_in.push(0);
        people_out.push(0);
        bounce.push(0);
      }

      data.forEach(function (e) {
        total_in  = total_in += Number(e.people_in);
        total_out  = total_out += Number(e.people_out);
        total_bounce  = total_bounce += Number(e.bounce);
        people_in[e.hour] = e.people_in;
        people_out[e.hour] = e.people_out; 
        bounce[e.hour] = e.bounce;
      });
      $scope.people = {
        total_in : total_in,
        total_out : total_out,
        total_bounce : total_bounce,
        people_in : {
          labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          datasets: [{
            label: "In",
            fillColor: "#DEEEA2",
            strokeColor: "#cde083",
            pointColor: "#cde083",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: people_in
          }]
        },
        people_out : {
          labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          datasets: [{
            label: "Out",
            
            fillColor: "#F7CB8F",
            strokeColor: "#f0ad4e",
            pointColor: "#f0ad4e",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: people_out
          }]
        },
        bounce : {
          labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
          datasets: [
          {
            label: "Bounce",
            fillColor: "#F86154",
            strokeColor: "#cd1606",
            pointColor: "#cd1606",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: bounce
          }]
        }
      };
    });
  }
  function updateOverlay() {
    if (!$scope.camera) {
      return;
    }
    var query = {
      camera: $scope.camera._id,
      date: $scope.date
    };

    $scope.map = undefined;
    Cam.getMap(query)
      .then(function(response) {
        $scope.map = response;
      });
  }
};
