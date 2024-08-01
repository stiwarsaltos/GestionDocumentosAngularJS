angular.module('WebApp')
    .controller('CustomerController', function($scope, $uibModal, toastr) {
        $scope.customers = [];
        $scope.newCustomer = {};
        $scope.animationEnabled = true;
        $scope.isLoading = false;

        function generateId() {
            return $scope.customers.length > 0 ? Math.max($scope.customers.map(customer => customer.id)) + 1 : 1;
        }

        $scope.openNewCustomerModal = function() {
            $scope.isLoading = true;
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'modalCustomer.html',
                controller: 'ModalCustomer',
                resolve: {
                    newCustomer: function() {
                        return angular.copy($scope.newCustomer);
                    }
                }
            });

            modalInstance.result.then(function(updatedCustomer) {
                if (!updatedCustomer.id) {
                    var existingCustom = $scope.customers.find(customer => customer.ident === updatedCustomer.ident);
                    if (existingCustom) {
                        toastr.error('Customer id already exists!');
                        $scope.isLoading = false;
                        return;
                    }
                    updatedCustomer.id = generateId();
                    $scope.customers.push(updatedCustomer);
                    toastr.success('Customer created successfully!');
                }
            }, function() {
                $scope.isLoading = false;
            });
        };

        $scope.editCustomer = function(customer) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationEnabled,
                templateUrl: 'modalCustomer.html',
                controller: 'ModalCustomer',
                resolve: {
                    newCustomer: function() {
                        return angular.copy(customer);
                    }
                }
            });

            modalInstance.result.then(function(updatedCustomer) {
                $scope.isLoading = true;
                var index = $scope.customers.findIndex(custom => custom.id === updatedCustomer.id);
                if (index !== -1) {
                    $scope.customers[index] = updatedCustomer;
                    toastr.success('Customer updated successfully!');
                }
                $scope.isLoading = false;
            });
        };

        $scope.deleteCustomer = function(customer) {
            $scope.isLoading = true;
            var index = $scope.customers.findIndex(existingDoc => existingDoc.id === customer.id);
            if (index !== -1) {
                $scope.customers.splice(index, 1);
                toastr.success('Customer deleted successfully!');
            }
            $scope.isLoading = false;
        };

        $scope.exportToExcel = function() {
            var data = [];
            var headers = ["Identity", "Name", "Phone", "Email"];
            data.push(headers);

            $scope.customers.forEach(function(customer) {
                var row = [];
                row.push(customer.ident);
                row.push(customer.name);
                row.push(customer.phone);
                row.push(customer.email);
                data.push(row);
            });

            var ws = XLSX.utils.aoa_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Customers");
            XLSX.writeFile(wb, "customers.xlsx");

            toastr.info('Excel file downloaded successfully!');
        };
    });
