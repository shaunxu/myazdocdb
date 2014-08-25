'use strict';

var app = angular.module('myazdocdb', [
    'ui.router',
    'ui.bootstrap',
    'angular-growl'
]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/connect');

    $stateProvider.state('connect', {
        url: '/',
        templateUrl: '/views/connect.html',
        controller: 'ConnectCtrl' });

    $stateProvider.state('databases', {
        url: '/databases',
        templateUrl: '/views/database/index.html',
        controller: 'DatabaseCtrl' });
}]);
