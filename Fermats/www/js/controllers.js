angular.module('animatedGrid.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {nickname:'Anonymous'};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    window.localStorage.setItem("nickname",$scope.nickname)
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  if(window.localStorage.getItem('nickname') === undefined){
    $scope.login();
  }
})

.controller('PlaylistsCtrl', ['$scope', 'ArticlesService',
  function($scope, ArticlesService) {
    $scope.getArticleList = function() {

      var promise = ArticlesService.get();
      promise.then(
          function(details){
            $scope.articles = details;
          },
          function(reason){
            alert('Failed: ' + reason);
          }
      );
    };

    $scope.getArticleList();
}])
.controller('ChatRoomCtrl', ['$scope', 'ArticlesService','$stateParams',
  function($scope, ArticlesService, $stateParams) {
    console.log($stateParams.chatRoomName)
    $scope.getArticleList = function() {

      var promise = ArticlesService.get();
      promise.then(
          function(details){
            $scope.articles = details;
          },
          function(reason){
            alert('Failed: ' + reason);
            $state.go(app.playlists)
          }
      );
    };

    $scope.getArticleList();
}]);
