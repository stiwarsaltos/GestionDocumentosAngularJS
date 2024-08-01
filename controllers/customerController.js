angular.module('WebApp')
    .controller('CustomerController', function($scope, $uibModal, toastr, $http) {
        $scope.customers = [];
        $scope.newCustomer = {};
        $scope.animationEnabled = true;
        $scope.isLoading = false;

        function fetchCustomers(){
            $scope.isLoading = true;
            $http.get('http://127.0.0.1:8000/api/customers').then(function(response) {
                $scope.customers = response.data;
                $scope.isLoading = false;
            }, function(){
                toastr.error('Failed to load customers.');
                $scope.isLoading = false;
            });
        }

        fetchCustomers();

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
                    var existingCustom = $scope.customers.find(customer => customer.identify === updatedCustomer.identify);
                    if (existingCustom) {
                        toastr.error('Customer id already exists!');
                        $scope.isLoading = false;
                        return;
                    }
                    $http.post('http://127.0.0.1:8000/api/customers', updatedCustomer).then(function(response) {
                        $scope.customers.push(response.data);
                        toastr.success('Customer created successfully!');
                        $scope.isLoading = false;
                    });
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
                $http.put('http://127.0.0.1:8000/api/customers' + updatedCustomer._id, updatedCustomer).then(function(response) {
                    var index = $scope.customers.findIndex(existingCustom => existingCustom._id === updatedCustomer._id);
                    if (index !== -1) {
                        $scope.customers[index] = response.data;
                        toastr.success('Customer updated successfully!');
                    }
                    $scope.isLoading = false;
                }, function() {
                    toastr.error('Failed to update customer.');
                    $scope.isLoading = false;
                });
            });
        };

        $scope.deleteCustomer = function(customer) {
            $scope.isLoading = true;
            $http.delete('http://127.0.0.1:8000/api/customers/' + customer._id).then(function() {
                var index = $scope.customers.findIndex(existingCustom => existingCustom._id === customer._id);
                if (index !== -1) {
                    $scope.customers.splice(index, 1);
                    toastr.success('Customer deleted successfully!');
                }
                $scope.isLoading = false;
            }, function() {
                toastr.error('Failed to delete customer.');
                $scope.isLoading = false;
            });
        };

        $scope.exportToExcel = function() {
            var data = [];
            var headers = ["Identity", "Name", "Phone", "Email"];
            data.push(headers);

            $scope.customers.forEach(function(customer) {
                var row = [];
                row.push(customer.identify);
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
