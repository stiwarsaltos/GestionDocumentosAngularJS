angular.module('WebApp')
    .controller('ModalCustomer', function($scope, $uibModalInstance, newCustomer, toastr) {
        $scope.newCustomer = newCustomer;

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveCustomer = function() {
            const hasEmptyCustomer = !$scope.newCustomer.identify || !$scope.newCustomer.name || !$scope.newCustomer.phone || !$scope.newCustomer.email;
            if (hasEmptyCustomer) {
                toastr.error('Customer cannot have empty fields!');
                return;
            }
            $uibModalInstance.close($scope.newCustomer);
        };
    });
