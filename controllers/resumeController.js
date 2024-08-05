angular.module("WebApp")
    .filter('dateFormat', function () {
        return function (input, format) {
            if(!input) return '';
            var date = new Date(input);
            var options = {year:'numeric', month:'2-digit', day:'2-digit'};

            return date.toLocaleDateString(undefined, options);
        }
    })
    .controller("ResumeController",function($scope, toastr, $http, $timeout){
        $scope.chartInstance = null;

        $scope.filterByDate = function() {
            let params = {};
            if ($scope.filter.startDate) {
                params.startDate = $scope.filter.startDate;
            }
            if ($scope.filter.endDate) {
                params.endDate = $scope.filter.endDate;
            }

            $http.get('http://127.0.0.1:8000/api/documentsf', { params: params })
                .then(function(response) {
                    $scope.filteredDocs = response.data;
                    $timeout($scope.updateChart);
                }, function() {
                    toastr.error('Failed to load documents.');
                });
        };

        $scope.exportToExcel = function() {
            var data = [];
            var headers = ["Date", "Number", "Client", "Products", "Total"];
            data.push(headers);

            $scope.filteredDocs.forEach(docItem => {
                data.push([
                    docItem.date,
                    docItem.num,
                    docItem.client.name,
                    docItem.quantityProducts,
                    docItem.total
                ]);
            });

            var ws = XLSX.utils.aoa_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Documents");
            XLSX.writeFile(wb, "documents.xlsx");

            toastr.info('Excel file downloaded successfully!');
        };

        $scope.updateChart = function (){
            if (!$scope.filteredDocs || $scope.filteredDocs.length === 0) return;

            let clientExpenses = {};
            $scope.filteredDocs.forEach(doc => {
                let clientName = doc.client.name;
                if(!clientExpenses[clientName]) {
                    clientExpenses[clientName] = 0;
                }
                clientExpenses[clientName] += doc.total;
            });

            let labels = Object.keys(clientExpenses);
            let data = Object.values(clientExpenses);

            var ctx = document.getElementById('customerExpensesChart').getContext("2d");
            if($scope.chartInstance){
                $scope.chartInstance.destroy();
            }

            $scope.chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Total Expenses by Customer',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 0.2)',
                        borderWidth: 1,
                    }]
                },options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Total Expenses'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Customer'
                            }
                        }
                    }
                }
            });
        };
    });