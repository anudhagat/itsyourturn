var app = angular.module('leaderboard', ['firebase']);

// app.constant('FIREBASE_URI', 'PUT_YOUR_FIREBASE_HERE');
app.constant('FIREBASE_URI', 'https://glaring-heat-3992.firebaseio.com/');

app.controller('MainCtrl', function (ContestantsService) {
    var main = this;
    main.newContestant = {lane: '', name: '', horse: '', score: ''};
    main.currentContestant = null;
    main.contestants = ContestantsService.getContestants();

    main.addContestant = function () {
        ContestantsService.addContestant(angular.copy(main.newContestant));
        main.newContestant = {lane: '', name: '', horse: '', score: ''};
    }; 

    main.updateContestant = function (contestant) {
        ContestantsService.updateContestant(contestant);
    };

    main.removeContestant = function (contestant) {
        ContestantsService.removeContestant(contestant);
    };

    main.incrementScore = function () {
        main.currentContestant.score = parseInt(main.currentContestant.score, 10) + 1;
        main.updateContestant(main.currentContestant);
    };

    main.decrementScore = function () {
        main.currentContestant.score = parseInt(main.currentContestant.score, 10) - 1;
        main.updateContestant(main.currentContestant);
    };
});

app.service('ContestantsService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI + "/contestants");
    var contestants = $firebaseArray(ref);

    service.getContestants = function () {
        return contestants;
    };

    service.addContestant = function (contestant) {
        contestants.$add(contestant);
    };

    service.updateContestant = function (contestant) {
        contestants.$save(contestant);
    };

    service.removeContestant = function (contestant) {
        contestants.$remove(contestant);
    };
});

// New controller for horses

app.controller('HorseCtrl', function (HorsesService) {
    var main = this;
    main.newHorse = {lane: '', name: '', rating: '', position: ''};
    main.currentHorse = null;
    main.horses = HorsesService.getHorses();

    main.addHorse = function () {
        HorsesService.addHorse(angular.copy(main.newHorse));
        main.newHorse = {lane: '', name: '', rating: '', position: ''};
    }; 

    main.updateHorse = function (Horse) {
        HorsesService.updateHorse(Horse);
    };

    main.removeHorse = function (Horse) {
        HorsesService.removeHorse(Horse);
    };

    main.incrementPosition = function () {
        main.currentHorse.position = parseInt(main.currentHorse.position, 10) + 1;
        main.updateHorse(main.currentHorse);
    };

    main.decrementPosition = function () {
        main.currentHorse.position = parseInt(main.currentHorse.position, 10) - 1;
        main.updateHorse(main.currentHorse);
    };
});


// Horse service

app.service('HorsesService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI + "/horses");
    var horses = $firebaseArray(ref);

    service.getHorses = function () {
        return horses;
    };

    service.addHorse = function (horse) {
        horses.$add(horse);
    };

    service.updateHorse = function (horse) {
        horses.$save(horse);
    };

    service.removeHorse = function (horse) {
        horses.$remove(horse);
    };
});