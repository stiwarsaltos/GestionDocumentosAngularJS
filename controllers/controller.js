angular.module('WebApp', ['ui.bootstrap', 'toastr'])
    .config(function(toastrConfig){
        angular.extend(toastrConfig, {
            positionClass: 'toast-bottom-right',
            timeOut: 3000,
            progressBar: true,
            preventDuplicates: true
        });
    })
    .controller('DocumentController', function($scope, $uibModal, toastr) {
        $scope.docs = [];
        $scope.newDocument = { products: [] };
        $scope.animationEnabled = true;
        $scope.isLoading = false;

        function generateId() {
            return $scope.docs.length > 0 ? Math.max($scope.docs.map(doc => doc.id)) + 1 : 1;
        }

        $scope.openNewDocumentModal = function() {
            $scope.isLoading = true;
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
                if (!updatedDocument.id) {
                    updatedDocument.id = generateId();
                    $scope.docs.push(updatedDocument);
                    toastr.success('Document created successfully!');
                }
                $scope.isLoading = false;
            }, function(){
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
                    console.log('Updated document: ', updatedDocument);
                    $scope.isLoading = true;
                    var index = $scope.docs.findIndex(existingDoc => existingDoc.id === updatedDocument.id);
                    console.log('Index in Docs: ', index);
                    if(index !== -1){
                        $scope.docs[index] = updatedDocument;
                        toastr.success('Document updated successfully!');
                    }
                    $scope.isLoading = false;
                })
        };

        $scope.deleteDocument = function(doc){
            $scope.isLoading = true;
            var index = $scope.docs.findIndex(doc => doc.id === doc.id);
            if (index !== -1) {
                $scope.docs.splice(index, 1);
                toastr.success('Document deleted successfully!');
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
                row.push(doc.num);
                row.push(doc.client);
                row.push(doc.quantityProducts);
                row.push(doc.total);
                data.push(row);
            });

            var ws = XLSX.utils.aoa_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Documents");
            XLSX.writeFile(wb, "documents.xlsx");

            toastr.info('Excel file downloaded successfully!');
        };
    });

