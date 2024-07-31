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
            });
        $urlRouterProvider.otherwise('/documents');
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
                    var existingDoc = $scope.docs.find(doc => doc.num === updatedDocument.num);
                    if (existingDoc) {
                        toastr.error('Document number already exists!');
                        $scope.isLoading = false;
                        return;
                    }

                    updatedDocument.id = generateId();
                    $scope.docs.push(updatedDocument);
                    toastr.success('Document created successfully!');
                } else {
                    var index = $scope.docs.findIndex(existingDoc => existingDoc.id === updatedDocument.id);
                    if (index !== -1) {
                        $scope.docs[index] = updatedDocument;
                        toastr.success('Document updated successfully!');
                    }
                }
                $scope.isLoading = false;
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
                var index = $scope.docs.findIndex(existingDoc => existingDoc.id === updatedDocument.id);
                if (index !== -1) {
                    $scope.docs[index] = updatedDocument;
                    toastr.success('Document updated successfully!');
                }
                $scope.isLoading = false;
            });
        };

        $scope.deleteDocument = function(doc){
            $scope.isLoading = true;
            var index = $scope.docs.findIndex(existingDoc => existingDoc.id === doc.id);
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
