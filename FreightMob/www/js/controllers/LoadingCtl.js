appControllers.controller('LoadingCtl',
        ['$state', '$timeout',
        function ($state, $timeout) {
            $timeout(function () {
                $state.go('login', { 'CheckUpdate': 'N' }, { reload: true });
            }, 2500);
        }]);