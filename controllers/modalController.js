angular.module('WebApp').controller('ModalController', function($scope, $rootScope) {
    $scope.newDocument = { products: [] };

    $scope.openNewDocumentModal = function() {
        $scope.newDocument = { products: [] };
        $('#documentModal').modal('show');
    };

    $scope.closeModal = function() {
        $('#documentModal').modal('hide');
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
        product.quantity = Math.max(0, product.quantity); // No permitir números negativos
        product.unitPrice = Math.max(0, product.unitPrice); // No permitir números negativos
        product.total = product.quantity * product.unitPrice;
    };

    $scope.formatNumber = function() {
        if ($scope.newDocument.number) {
            // Limitar el número a 9 dígitos
            $scope.newDocument.number = $scope.newDocument.number.slice(0, 9);
        }
    };

    $scope.saveDocument = function() {
        $rootScope.isLoading = true;
        if ($scope.newDocument.id) {
            var index = $scope.docs.findIndex(doc => doc.id === $scope.newDocument.id);
            if (index !== -1) {
                $scope.docs[index] = angular.copy($scope.newDocument);
                showPushNotification('Success', 'Document saved successfully');
            }
        } else {
            $scope.newDocument.id = Date.now();
            $scope.docs.push(angular.copy($scope.newDocument));
            showPushNotification('Success', 'Document created successfully');
        }
        $scope.closeModal();
        $rootScope.isLoading = false;
    };

    $scope.deleteDocument = function(d) {
        $rootScope.isLoading = true;
        var index = $scope.docs.indexOf(d);
        if (index !== -1) {
            $scope.docs.splice(index, 1);
            showPushNotification('Success', 'Document deleted successfully');
        }
        $rootScope.isLoading = false;
    };
});
