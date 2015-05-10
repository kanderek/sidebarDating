var sidebarBackHandler = function ($rootScope, $location) {

    var history = ['/testing/home'];

    $rootScope.$on('$routeChangeSuccess', function() {
        var newRoute = $location.url();

        if (newRoute !== '/testing/survey' &&
            newRoute !== '/testing/login' &&
            newRoute !== '/testing/signup' &&
            newRoute !== '/testing/signup/3' &&
            newRoute !== history[history.length-1]) {
            history.push(newRoute);
        }
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/testing/home";

        // if (prevUrl !== '/testing/login' && prevUrl.indexOf('/testing/signup/') !== -1) {
            $location.url(prevUrl);
        // }
    };

};