angular.module('WebApp')
    .controller('DocumentController', function($scope, $uibModal, toastr, $http) {
        $scope.docs = [];
        $scope.newDocument = { products: [] };
        $scope.animationEnabled = true;
        $scope.isLoading = false;

        function fetchDocuments(){
            $scope.isLoading = true;
            $http.get('http://127.0.0.1:8000/api/documents').then(function(response) {
                $scope.docs = response.data;
                $scope.isLoading = false;
            }, function(){
                toastr.error('Failed to load documents.');
                $scope.isLoading = false;
            });
        }

        fetchDocuments();

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
                $scope.isLoading = true;
                if (!updatedDocument._id) {
                    var existingDoc = $scope.docs.find(doc => doc.num === updatedDocument.num);
                    if (existingDoc) {
                        toastr.error('Document number already exists!');
                        $scope.isLoading = false;
                        return;
                    }

                    $http.post('http://127.0.0.1:8000/api/documents', updatedDocument).then(function(response) {
                        $scope.docs.push(response.data);
                        toastr.success('Document created successfully!');
                        $scope.isLoading = false;
                    }, function() {
                        toastr.error('Failed to create document.');
                        $scope.isLoading = false;
                    });
                } else {
                    $http.put('http://127.0.0.1:8000/api/documents/' + updatedDocument._id, updatedDocument).then(function(response) {
                        var index = $scope.docs.findIndex(existingDoc => existingDoc._id === updatedDocument._id);
                        if (index !== -1) {
                            $scope.docs[index] = response.data;
                            toastr.success('Document updated successfully!');
                        }
                        $scope.isLoading = false;
                    }, function() {
                        toastr.error('Failed to update document.');
                        $scope.isLoading = false;
                    });
                }
            }, function() {
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
                $http.put('http://127.0.0.1:8000/api/documents/' + updatedDocument._id, updatedDocument).then(function(response) {
                    var index = $scope.docs.findIndex(existingDoc => existingDoc._id === updatedDocument._id);
                    if (index !== -1) {
                        $scope.docs[index] = response.data;
                        toastr.success('Document updated successfully!');
                    }
                    $scope.isLoading = false;
                }, function() {
                    toastr.error('Failed to update document.');
                    $scope.isLoading = false;
                });
            });
        };

        $scope.deleteDocument = function(doc) {
            $scope.isLoading = true;
            $http.delete('http://127.0.0.1:8000/api/documents/' + doc._id).then(function() {
                var index = $scope.docs.findIndex(existingDoc => existingDoc._id === doc._id);
                if (index !== -1) {
                    $scope.docs.splice(index, 1);
                    toastr.success('Document deleted successfully!');
                }
                $scope.isLoading = false;
            }, function() {
                toastr.error('Failed to delete document.');
                $scope.isLoading = false;
            });
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
