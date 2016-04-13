"use strict";

var app = angular.module('bookstoreapp', ['ngRoute']);

app.constant("bookListActiveClass", "btn-primary");
app.constant("bookListPageCount", 4);

app.config(function($routeProvider) {
    $routeProvider.when('/books', {
                        templateUrl: 'views/bookList.html',
                        controller: 'bookCtrl',
                        controllerAs: 'vm'
                    })
                    .when('/book/:bookId', {
                        templateUrl: 'views/bookDetail.html',
                        controller: 'bookDetailCtrl',
                        controllerAs: 'vm'
                    })
    				.when('/checkout', {
                        templateUrl: 'views/checkoutSummary.html',
                        controller: 'cartSummaryCtrl',
                        controllerAs: 'vm'
                    })
                    .when('/complete', {
                        templateUrl: 'views/thankyou.html',
                        controller: 'cartSummaryController'
                    })
                    .when('/placeorder', {
                        templateUrl: 'views/placeOrder.html',
                        controller: 'placeOrderCtrl',
                        controllerAs: 'vm'
                    })
                    .otherwise({redirectTo:'/books'});
});