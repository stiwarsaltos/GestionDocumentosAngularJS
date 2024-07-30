angular.module('WebApp', []).controller('DocumentController', function($scope) {
    $scope.documents = [];
    $scope.newDocument = { products: [] };

    $scope.openNewDocumentModal = function() {
        $scope.newDocument = { products: [] };
        $('#documentModal').modal('show');
    };

    $scope.updateTotal = function(product) {
        product.total = product.cantidad * product.precioUnitario;
    };

    $scope.getTotal = function(products) {
        return products.reduce((sum, product) => sum + (product.cantidad * product.precioUnitario), 0);
    };

    $scope.addProduct = function() {
        $scope.newDocument.products.push({
            id: '',
            nombre: '',
            cantidad: 0,
            precioUnitario: 0,
            total: 0
        });
    };

    $scope.saveDocument = function() {
        if ($scope.documents.find(doc => doc.numero === $scope.newDocument.numero)) {
            alert('El número de documento ya existe');
            return;
        }
        $scope.documents.push({
            fecha: $scope.newDocument.fecha,
            numero: $scope.newDocument.numero,
            cliente: $scope.newDocument.cliente,
            cantidadProductos: $scope.newDocument.products.length,
            total: $scope.getTotal($scope.newDocument.products),
            products: angular.copy($scope.newDocument.products)
        });
        $('#documentModal').modal('hide');
    };

    $scope.removeProduct = function(product) {
        const index = $scope.newDocument.products.indexOf(product);
        if (index > -1) {
            $scope.newDocument.products.splice(index, 1);
        }
    };

    $scope.editDocument = function(doc) {
        $scope.newDocument = angular.copy(doc);
        $('#documentModal').modal('show');
    };

    $scope.deleteDocument = function(doc) {
        const index = $scope.documents.indexOf(doc);
        if (index > -1) {
            $scope.documents.splice(index, 1);
        }
    };

    $scope.exportToExcel = function() {
        const wb = XLSX.utils.book_new();
        const ws_data = [
            ["FECHA", "NÚMERO", "CLIENTE", "CANTIDAD DE PRODUCTO", "TOTAL"]
        ];
        $scope.documents.forEach(doc => {
            ws_data.push([doc.fecha, doc.numero, doc.cliente, doc.cantidadProductos, doc.total]);
        });
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, "Documents");
        XLSX.writeFile(wb, "Documents.xlsx");
    };
});
