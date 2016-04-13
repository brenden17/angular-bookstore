'use stricts'

app.constant("dataUrl", "http://localhost:5000/bookstore/api/v1.0/books");
app.controller('bookCtrl', bookCtrl);

function bookCtrl($filter, $http, bookListActiveClass, bookListPageCount, dataUrl, cart) {
    var vm  = this;

    vm.data = {};
    vm.selectedPage = 1;
    vm.pageSize = bookListPageCount;
   
    var seletedCategory = null;

    vm.init = init;
    vm.selectCategory = selectCategory;
    vm.categoryFilterFn = categoryFilterFn;
    vm.getCategoryClass = getCategoryClass;
    vm.selectPage = selectPage;
    vm.getPageClass = getPageClass;
    vm.addBookToCart = addBookToCart;
    init();

    function init() {
        $http.get(dataUrl)
            .success(function(data) {
                vm.data.books = data['books'];
            })
            .error(function(error) {
                vm.data.error = error;
            })
    }

    function selectCategory(category) {
        vm.seletedCategory = category;
        vm.selectedPage = 1;
    };

    function categoryFilterFn(book) {
        return vm.seletedCategory == null || book.category == vm.seletedCategory;   
    }

    function getCategoryClass(category) {
        return vm.seletedCategory == category ? bookListActiveClass : "";
    }

    function selectPage(newPage) {
        vm.selectedPage = newPage;
    }

    function getPageClass(page) {
        return vm.selectedPage == page ? bookListActiveClass : "";
    }

    function addBookToCart(book) {
        cart.addBook(book.id, book.title, book.price);
    }

}

app.controller('cartSummaryCtrl', cartSummaryCtrl);
function cartSummaryCtrl($http, $routeParams, dataUrl) {
    var vm = this;
    
}

app.controller('cartSummaryCtrl', cartSummaryCtrl);
function cartSummaryCtrl(cart) {
    var vm  = this;
    vm.cartData = cart.getBooks();

    vm.total = total;
    vm.remove = remove;

    function total() {
        var total = 0;
        for (var i = 0; i<vm.cartData.length; i++) {
            total += (vm.cartData[i].price * vm.cartData[i].count);
        }
        return total;
    }

    function remove(id) {
        cart.removeBook(id);
    }

}

app.controller('bookDetailCtrl', bookDetailCtrl);
function bookDetailCtrl($http, $routeParams, $location, cart, dataUrl) {
    var vm = this;
    vm.data = {};
    vm.data.showContent = true;
    vm.init = init;
    vm.addBookToCart = addBookToCart;
    vm.goCheckout = goCheckout;
    vm.contentShowHide = contentShowHide;

    init();

    function init() {
        $http.get(dataUrl + '/' + $routeParams.bookId)
            .success(function(data) {
                vm.data.book = data['book'];
            })
            .error(function(error) {
                vm.data.error = error;
            })
    }

    function addBookToCart() {
        cart.addBook(vm.data.book.id, vm.data.book.title, vm.data.book.price);
    }

    function goCheckout() {
        vm.addBookToCart();
        $location.path('/checkout');
    }

    function contentShowHide() {
        vm.data.showContent = vm.data.showContent ? false : true;
    }
}

app.constant("authUrl", "http://localhost:5000/auth");
app.controller('authController', function($scope, $http, $location, authUrl) {
    $scope.authenticate = function (user, pass) {
        $http.post(authUrl, 
                    {username:user, password:pass},
                    {withCredentials: true}
                ).success(function (data) {
                    $location.path("/main");
                }).error(function (error) {
                    $scope.authenticationError = error;
                });

    }

});