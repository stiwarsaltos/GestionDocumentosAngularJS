angular.module('WebApp', ['ui.bootstrap', 'toastr', 'ui.router'])
    .config(function(toastrConfig){
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
            progressBar: true,
            preventDuplicates: false
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('documents', {
                url: '/documents',
                templateUrl: 'views/documents.html',
                controller: 'DocumentController',
            })
            .state('customers',{
                url: '/customers',
                templateUrl: 'views/customer.html',
                controller: 'CustomerController',
            })
            .state('resume',{
                url: '/resume',
                templateUrl: 'views/resume.html',
                controller: 'ResumeController',
            });
        $urlRouterProvider.otherwise('/documents');
    });