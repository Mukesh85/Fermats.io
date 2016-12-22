angular.module('animatedGrid.directives', [])

.directive('gridAnimationsBasis', function() {
	return {
		controller: ['$scope', '$rootScope', function($scope, $rootScope) {
        	$scope.animationFlag = false;

			var docElem = window.document.documentElement,
				transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
				transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
	    		support = { transitions: Modernizr.csstransitions };


	    	$scope.onEndTransition = function( el, callback ) {
					var onEndCallbackFn = function( ev ) {
						if( support.transitions ) {
							if( ev.target != this ) return;
							this.removeEventListener( transEndEventName, onEndCallbackFn );
						}
						if( callback && typeof callback === 'function' ) { callback.call(this); }
					};
					if( support.transitions ) {
						el.addEventListener( transEndEventName, onEndCallbackFn );
					}
					else {
						onEndCallbackFn();
					}
				};

			/**
			* gets the viewport width and height
			* based on http://responsejs.com/labs/dimensions/
			*/
			$scope.getViewport = function (axis){
				var client, inner;

				if( axis === 'x' ) {
					client = docElem['clientWidth'];
					inner = window['innerWidth'];
				}
				else if( axis === 'y' ) {
					client = docElem['clientHeight'];
					inner = window['innerHeight'];
				}

				return client < inner ? inner : client;
			}
			$scope.scrollX = function() { return window.pageXOffset || docElem.scrollLeft; }
			$scope.scrollY = function() { return window.pageYOffset || docElem.scrollTop; }

        	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
				if ($scope.animationFlag === false 
					&& toState.name === 'app.article') {
					event.preventDefault();
				}
			});

		}]
	}
})

.directive('gridItem', function ($timeout, $state, $rootScope, $ionicScrollDelegate) {
    return {
    	require: '^^gridAnimationsBasis',
        link: function (scope, elem, attrs) {
        	var gridViewContainer = document.getElementById('grid-template');
        	var item = document.getElementById('Start_chat');

        	item.addEventListener('click',function(ev){
        	console.log(scope.chatroomname);
			angular.forEach(elem, function(item, pos) {
					angular.element(item).addClass('grid__item--loading');
					$timeout(function(){
						angular.element(item).addClass('grid__item--animate');
							animateItem(item);
							scope.$parent.animationFlag = true;
							$timeout(function(){
								$state.go('app.chatroom',{chatRoomName:scope.chatroomname});
							}, 500);
					}, 1000);
				})
			})

			function animateItem(item) {
				var dummy = document.createElement('div');
				dummy.className = 'placeholder';

				dummy.style.WebkitTransform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gridViewContainer.offsetWidth + ',' + item.offsetHeight/scope.getViewport('y') + ',1)';
				dummy.style.transform = 'translate3d(' + (item.offsetLeft - 5) + 'px, ' + (item.offsetTop - 5) + 'px, 0px) scale3d(' + item.offsetWidth/gridViewContainer.offsetWidth + ',' + item.offsetHeight/scope.getViewport('y') + ',1)';

				angular.element(dummy).addClass('placeholder--trans-in');

				gridViewContainer.appendChild(dummy);
				
				setTimeout(function() {
					dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scope.scrollY() - 5) + 'px, 0px)';
					dummy.style.transform = 'translate3d(-5px, ' + (scope.scrollY() - 5) + 'px, 0px)';
					$ionicScrollDelegate.freezeAllScrolls(true);
				}, 25);
			}
        }
    }
})

.directive('backToGrid', function ($timeout, $rootScope, $ionicScrollDelegate) {
    return {
    	require: '^^gridAnimationsBasis',
        link: function (scope, elem, attrs) {
        	var gridViewContainer = document.getElementById('grid-template');

        	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
				if (toState.name === 'app.playlists' && fromState.name === 'app.article') {
				scope.animationFlag = false;
					hideContent();
				}
			});

			function hideContent() {
				var dummy = gridViewContainer.querySelector('.placeholder'),
		        	gridItem = elem[0].querySelector('a.grid__item--animate');
				
				$timeout(function() {

					dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridViewContainer.offsetWidth + ',' + gridItem.offsetHeight/scope.getViewport('y') + ',1)';
					dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridViewContainer.offsetWidth + ',' + gridItem.offsetHeight/scope.getViewport('y') + ',1)';


					scope.onEndTransition(dummy, function() {
						gridViewContainer.removeChild(dummy);

						angular.element(gridItem).removeClass('grid__item--loading');
						angular.element(gridItem).removeClass('grid__item--animate');
						
						$ionicScrollDelegate.freezeAllScrolls(false);
					});
					
				}, 250);
			}
        }
    }
})

.directive('articleLoad', function ($timeout, $rootScope) {
	return {
		link: function(scope, article) {

			$timeout(function(){
				article.addClass('content-show');
				article.find('article').addClass('content__item--show');
			}, 250);

		}
	}
})
