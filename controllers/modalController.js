angular.module('WebApp')
    .controller('ModalController', function($scope, $uibModalInstance, newDocument, toastr) {
        $scope.newDocument = newDocument || { products: [] };

        function formatNum(num) {
            return String(num).padStart(9, '0');
        }

        $scope.formatNumOnBlur = function () {
            if ($scope.newDocument.num) {
                $scope.newDocument.num = formatNum($scope.newDocument.num);
            }
        };

        $scope.getTotalQuantity = function() {
            return $scope.newDocument.products.reduce(function(sum, product) {
                return sum + (product.quantity || 0);
            }, 0);
        };

        $scope.getTotalAmount = function() {
            return $scope.newDocument.products.reduce(function(sum, product) {
                return sum + (product.total || 0);
            }, 0);
        };

        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveDocument = function() {
            // Validar productos
            const hasEmptyProduct = $scope.newDocument.products.some(function(product) {
                return !product.id || !product.name || !product.quantity || !product.unitPrice;
            });
            if (hasEmptyProduct) {
                toastr.error('Products cannot have empty fields!');
                return;
            }

            // Validar ID único
            const ids = $scope.newDocument.products.map(function(product) {
                return product.id;
            });
            const hasDuplicateId = ids.length !== new Set(ids).size;
            if (hasDuplicateId) {
                toastr.error('Product IDs must be unique!');
                return;
            }

            $scope.newDocument.quantityProducts = $scope.newDocument.products.length;
            $scope.newDocument.total = $scope.getTotalAmount();

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
                toastr.warning('Product removed!');
            }
        };
    });
