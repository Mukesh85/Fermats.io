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
    window.localStorage.setItem("nickname",$scope.loginData.nickname)
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  if(window.localStorage.getItem('nickname') == undefined){
    $scope.loginData.nickname = 'Anonymous';
  }
  else{
    $scope.loginData.nickname = window.localStorage.getItem('nickname');
    console.log(window.localStorage.getItem('nickname'))
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
.controller('ChatRoomCtrl', ['$scope', 'ArticlesService','$stateParams','$state',
  function($scope, ArticlesService, $stateParams,$state) {

    var scroll = document.getElementById('scrollmsgs');

    console.log($stateParams.chatRoomName)
    $scope.message_list_object = {};
    $scope.message_list = [];
    var database = firebase.database();
    $scope.name = window.localStorage.getItem('nickname');
    console.log(name);
    $scope.sendMessage = function(){

            if($scope.message != "" && $scope.message != null && $scope.message != undefined){
              database.ref('/chatrooms/' + $stateParams.chatRoomName+'/chats/').push({
          'username': $scope.name,
          'message': $scope.message,
          'timestamp' : new Date().getTime()
        });


        $scope.message = "";
      }
      
    }



    function update_messages(){

      $scope.message_list.push($scope.message_list_object)
    }

    

    $scope.getArticleList = function() {

      database.ref('/chatrooms/' + $stateParams.chatRoomName+'/chats/').on('value',function(snapshot) {
        temp = snapshot.val();
        $scope.message_list = [];
        for(i in temp){
          $scope.message_list.push(temp[i]);
        }
        console.log($scope.message_list);
        $scope.$apply();

        scroll.scrollTop = scroll.scrollHeight;

      });

     
    }

    

    $scope.getArticleList();
}]);
