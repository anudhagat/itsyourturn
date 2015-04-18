var app = angular.module('leaderboard', ['firebase']);

// app.constant('FIREBASE_URI', 'PUT_YOUR_FIREBASE_HERE');
app.constant('FIREBASE_URI', 'https://glaring-heat-3992.firebaseio.com/');

app.controller('MainCtrl', function (ContestantsService) {
    var main = this;
    main.newContestant = {lane: '', name: '', horse: '', score: '', balance: 100,isWinner: 'false'};
    main.currentContestant = null;
    main.contestants = ContestantsService.getContestants();

    main.addContestant = function () {
        ContestantsService.addContestant(angular.copy(main.newContestant));
        main.newContestant = {lane: '', name: '', horse: '', score: '', balance: 100,isWinner: 'false'};
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
    this.contestants = $firebaseArray(ref);

    service.getContestants = function () {
        return this.contestants;
    };

    service.addContestant = function (contestant) {
        this.contestants.$add(contestant);
    };

    service.updateContestant = function (contestant) {
        this.contestants.$save(contestant);
    };

    service.removeContestant = function (contestant) {
        this.contestants.$remove(contestant);
    };
});

// New controller for horses

app.controller('HorseCtrl', ["HorsesService","ContestantsService",function (HorsesService, ContestantsService) {
    var main = this;
    main.newHorse = {lane: '', name: '', rating: '', distance: '0', position: ''};
    main.currentHorse = null;
    main.horses = HorsesService.getHorses();

    main.addHorse = function () {
        HorsesService.addHorse(angular.copy(main.newHorse));
        main.newHorse = {lane: '', name: '', rating: '', distance: '0', position: ''};
    }; 

    main.updateHorse = function (Horse) {
        HorsesService.updateHorse(Horse);
    };

    main.removeHorse = function (Horse) {
        HorsesService.removeHorse(Horse);
    };

    var incrementDistance = function (horse) {
        horse.distance = parseInt(horse.distance, 10) + Math.floor((Math.random() * 10) + 1);;
    };


    main.startRace = function (num) {
        var distances = [];
        var winner;
        HorsesService.rank = 1;

        for (var j = 0; j < HorsesService.horses.length;j++){
            HorsesService.horses[j].distance = 0;
            HorsesService.horses[j].position = 0;
        }

        for(var i =0; i< num; i++){
            for (var j = 0; j < HorsesService.horses.length;j++){
                incrementDistance(HorsesService.horses[j]);
                if(HorsesService.horses[j].distance >= num && HorsesService.horses[j].position == 0){
                    if (HorsesService.rank ==1) {
                        winner = HorsesService.horses[j].name;
                    }
                    HorsesService.horses[j].position = HorsesService.rank;
                    HorsesService.rank++;
                }
            }
        }
        console.log(winner);
        for (var j = 0; j < ContestantsService.contestants.length;j++){
            if (ContestantsService.contestants[j].horse === winner) {
                ContestantsService.contestants[j].isWinner = true;
                ContestantsService.contestants[j].balance = parseInt(ContestantsService.contestants[j].balance) + parseInt(ContestantsService.contestants[j].score);
            } else {
                ContestantsService.contestants[j].isWinner = false;
                ContestantsService.contestants[j].balance = parseInt(ContestantsService.contestants[j].balance) - parseInt(ContestantsService.contestants[j].score);
            }
        }
    };
}]);


// Horse service
    
app.service('HorsesService', function ($firebaseArray, FIREBASE_URI) {
    var service = this;
    var ref = new Firebase(FIREBASE_URI + "/horses");
    this.horses = $firebaseArray(ref);
    this.rank=1;

    service.getHorses = function () {
        return this.horses;
    };

    service.addHorse = function (horse) {
        this.horses.$add(horse);
    };

    service.updateHorse = function (horse) {
        this.horses.$save(horse);
    };

    service.removeHorse = function (horse) {
        this.horses.$remove(horse);
    };

});



