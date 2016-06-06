'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('PublicCtrl', ['$scope', '$translate', '$state', 'uiGmapGoogleMapApi', 'uiGmapIsReady','MASCREF_CONF', function ($scope, $translate, $state, uiGmapGoogleMapApi, uiGmapIsReady, MASCREF_CONF) {
  
    // Init Google Maps
    $scope.markersPublic = []
    $scope.mapPublic = {
      center: {
        latitude: MASCREF_CONF.COORD.LAT,
        longitude: MASCREF_CONF.COORD.LONG
        //latitude: -27.68,
        //longitude: -48.49
      },
      zoom: MASCREF_CONF.COORD.ZOOM,
      options: { scrollwheel: false, panControl: false, streetViewControl: false }
    };
    $scope.mapPublicControl = {}

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      // console.log($scope.markersSurvey)
      // $('.angular-google-map-container').css('height', '300px');
    });

    uiGmapIsReady.promise(1).then(function (maps) {
      $scope.mapPublic.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
    });

  }]);