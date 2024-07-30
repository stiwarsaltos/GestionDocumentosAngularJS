angular.module('WebApp', []).controller('DocumentController', function($scope) {
    $scope.docs = [];
    $scope.newDocument = { products: [] };

    $scope.openNewDocumentModal = function() {
        $scope.newDocument = { products: [] };
        $('#documentModal').modal('show');
    };

    $scope.updateTotal = function(product) {
        product.total = product.quantity * product.unitPrice;
    };

    $scope.getTotal = function(products) {
        return products.reduce((sum, product) => sum + (product.quantity * product.unitPrice), 0);
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

    $scope.saveDocument = function() {
        var index = $scope.docs.findIndex(doc => doc.number === $scope.newDocument.number);
        if (index !== -1) {
            $scope.docs[index] = {
                date: $scope.newDocument.date,
                number: $scope.newDocument.number,
                client: $scope.newDocument.client,
                quantityProducts: $scope.newDocument.products.length,
                total: $scope.getTotal($scope.newDocument.products),
                products: angular.copy($scope.newDocument.products)
            };
        } else {
            $scope.docs.push({
                date: $scope.newDocument.date,
                number: $scope.newDocument.number,
                client: $scope.newDocument.client,
                quantityProducts: $scope.newDocument.products.length,
                total: $scope.getTotal($scope.newDocument.products),
                products: angular.copy($scope.newDocument.products)
            });
        }
        $('#documentModal').modal('hide');
    };

    $scope.deleteDocument = function(doc) {
        var index = $scope.docs.indexOf(doc);
        if (index !== -1) {
            $scope.docs.splice(index, 1);
        }
    };

    $scope.editDocument = function(doc) {
        $scope.newDocument = angular.copy(doc);
        $('#documentModal').modal('show');
    };

    $scope.removeProduct = function(product) {
        const index = $scope.newDocument.products.indexOf(product);
        if (index > -1) {
            $scope.newDocument.products.splice(index, 1);
        }
    };

    $scope.formatNumber = function() {
        if ($scope.newDocument.number) {
            // Limitar el número a 9 dígitos
            $scope.newDocument.number = $scope.newDocument.number.slice(0, 9);
        }
    };

    $scope.exportToExcel = function() {
        var data = [];
        var headers = ["Date", "Number", "Client", "Products", "Total"];
        data.push(headers);

        $scope.docs.forEach(function(doc) {
            var row = [];
            row.push(doc.date);
            row.push(doc.number);
            row.push(doc.client);
            row.push(doc.quantityProducts);
            row.push(doc.total);
            data.push(row);
        });

        var ws = XLSX.utils.aoa_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Documents");
        XLSX.writeFile(wb, "documents.xlsx");
    };
});
