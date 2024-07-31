angular.module('WebApp')
    .controller('ModalController', function($scope, $uibModalInstance, newDocument) {
        $scope.newDocument = newDocument || {products: []};

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveDocument = function() {
            $scope.newDocument.quantityProducts = $scope.newDocument.products.length;
            $scope.newDocument.total = $scope.newDocument.products.reduce((sum, product)=> sum + (product.total || 0), 0);
            $uibModalInstance.close($scope.newDocument);
        };

        $scope.addProduct = function() {
            $scope.newDocument.products.push({
                id: '',
                name: '',
                quantity: 0,
                unitPrice: 0,
                total: 0
            });
        };

        $scope.updateTotal = function(product) {
            product.quantity = Math.max(0, product.quantity);
            product.unitPrice = Math.max(0, product.unitPrice);
            product.total = product.quantity * product.unitPrice;
        };

        $scope.removeProduct = function(product) {
            const index = $scope.newDocument.products.indexOf(product);
            if (index > -1) {
                $scope.newDocument.products.splice(index, 1);
            }
        };
    });
