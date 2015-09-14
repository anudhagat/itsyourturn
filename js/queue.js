var app = angular.module('queue', ['firebase']);

// app.constant('FIREBASE_URI', 'PUT_YOUR_FIREBASE_HERE');
app.constant('FIREBASE_URI', 'https://itsyourturn.firebaseio.com/');

app.controller('MainCtrl', function (CustomersService) {
    var main = this;
    main.newCustomer = {name: '', numParty: ''};
    main.currentCustomer = null;
    main.customers = CustomersService.getCustomers();

    main.addCustomer = function () {
        CustomersService.addCustomer(angular.copy(main.newCustomer));
        main.newCustomer = {name: '', numParty: ''};
    };

    main.updateCustomer = function (customer) {
        CustomersService.updateCustomer(customer);
    };

    main.removeCustomer = function (customer) {
        CustomersService.removeCustomer(customer);
    };
});

app.service('CustomersService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI + "/customers");
    this.customers = $firebaseArray(ref);

    service.getCustomers = function () {
        return this.customers;
    };

    service.addCustomer = function (customer) {
        this.customers.$add(customer);
    };

    service.updateCustomer = function (customer) {
        this.customers.$save(customer);
    };

    service.removeCustomer = function (customer) {
        this.customers.$remove(customer);
    };
});