angular.module('WebApp', ['ui.bootstrap'])
    .controller('DocumentController', function($scope, $uibModal) {
        $scope.docs = [];
        $scope.newDocument = { products: [] };
        $scope.animationEnabled = true;
        $scope.isLoading = false;

        $scope.openNewDocumentModal = function() {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'modalTemplate.html',
                controller: 'ModalController',
                resolve: {
                    newDocument: function() {
                        return angular.copy($scope.newDocument);
                    }
                }
            });

            modalInstance.result.then(function(updatedDocument) {
                $scope.isLoading = true;
                var index = $scope.docs.findIndex(doc => doc.number === updatedDocument.number);
                if (index !== -1) {
                    $scope.docs[index] = updatedDocument;
                } else {
                    $scope.docs.push(updatedDocument);
                }
                $scope.isLoading = false;
            });
        };

        $scope.editDocument = function(doc){
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'modalTemplate.html',
                controller: 'ModalController',
                resolve: {
                    newDocument: function() {
                        return angular.copy(doc);
                    }
                }
            });
                modalInstance.result.then(function(updatedDocument) {
                    $scope.isLoading = true;
                    var index = $scope.docs.findIndex(existingDoc => existingDoc.number === updatedDocument.number);
                    if(index !== -1){
                        $scope.docs[index] = updatedDocument;
                    }
                    $scope.isLoading = false;
                })
        };

        $scope.deleteDocument = function(doc){
            $scope.isLoading = true;
            var index = $scope.docs.indexOf(doc);
            if (index !== -1) {
                $scope.docs.splice(index, 1);
            }
            $scope.isLoading = false;
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
