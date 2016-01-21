var app = angular.module('libraryApp', ['ngRoute', 'ngResource']);

//Routes

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider)  {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/books/index.html', 
      controller: "BooksIndexCtrl"
    })
    .when('/books/:id', {
    	templateUrl: 'templates/books/show.html', 
    	controller: "BooksShowCtrl"
    })
    .otherwise({
    	redirectTo: '/'
    });

    $locationProvider
    	.html5Mode({
    		enabled: true, 
    		requireBase: false
    	}); 
}]);

//Factory
app.factory("Book", ["$resource", function($resource){
	return $resource("https://super-crud.herokuapp.com/books/:id", { id: "@_id" }, 
	{
		query: {
			isArray: true, 
			transformResponse: function(data) { return angular.fromJson(data).books; }
		}, 
		update: { method: "PUT" }
		}); 
}]); 

//Controllers

app.controller('BooksIndexCtrl', ['$scope', function ($scope) {
  $scope.allBooks = allBooks; 
}]);

	// 1. Finding book in allbooks array that matches book id (using filter)
  // 2. Saving the listed book to scope.book, and then displaying it on the page.  
app.controller('BooksShowCtrl', ['$scope', '$routeParams', '$location', '$filter', function ($scope, $routeParams, $location, $filter) {
  var bookId = $routeParams.id; 
  var listedBook = $filter('filter')(allBooks, { _id: bookId }, true); 
  if (listedBook.length > 0){
  	$scope.book = listedBook[0]; 
  } else {
  	$location.path('/'); 
  }
  
  $scope.deleteBook = function(){
  	Book.delete({ id: bookId }); 
  	$location.path('/'); 
  }; 

  $scope.updateBook = function(){
  	Book.update({ id: bookId}, $scope.bookToUpdate, 
  		function(data) {
  		$location.path('/'); 
  }); 
}; 
}]);