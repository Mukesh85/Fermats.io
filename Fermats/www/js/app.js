// Ionic Animated Grid App

angular.module('animatedGrid', ['ionic', 'ui.router', 'animatedGrid.controllers', 'animatedGrid.directives', 'animatedGrid.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })

  .state('app.playlists', {
    url: '/playlists',
    cache:false,
    views: {
      'menuContent': {
        templateUrl: 'templates/grid.html',
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.chatroom', {
    url: '/chatroom/:chatRoomName',
    views: {
      'menuContent': {
        templateUrl: 'templates/chatroom.html',
        controller:'ChatRoomCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');

  $ionicConfigProvider.views.transition('none');
});
