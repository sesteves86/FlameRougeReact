import Rider from './Rider';

class GameEngine {
    constructor(players, riders, track){
        this.players = this.arrayDeepCopy(players);
        this.riders = _deepCopyRiders();
        // this.riders = _deepCopyObject(riders);
        this.track = this.arrayDeepCopy(track)

        this.decisions = [];
        console.log("initialize decisions");
    }

    arrayDeepCopy = arr => {
        if(arr)
            return JSON.parse(JSON.stringify(arr));
    }

    setHumanDecision(riderId, value) {
        this.decisions[riderId] = value;
        console.log("update human decisions");
    }

    areMoreHumanPlayersThisRound(currentRiderId) {
        const self = this;

        return this.riders.some(r => r.id > currentRiderId && self.players[r.player].isHuman);
    }

    getNextHumanRiderId(currentRiderId) {
        const self = this;

        return this.riders.filter(r => r.id > currentRiderId && self.players[r.player].isHuman)[0].id;
    }

    processCpuDecisionsUntilNextHumanPlayer(currentRiderId) {
        let nextHumanId;

        if (this.areMoreHumanPlayersThisRound(currentRiderId)){
            nextHumanId = this.getNextHumanRiderId(currentRiderId);
        } else {
            nextHumanId = this.riders.length;
        }
        
        // foreach next CPU
        for (let id = currentRiderId + 1; id < nextHumanId; id++) {
            const cpuDecision = this._getAIDecision(currentRiderId);

            this.decisions[id] = cpuDecision;
            console.log("set CPU decision");
        }
    }

    processAllDecision() {
        this._processDecisions();
    }

    getNewRidersState() {
        return this.riders;
    }

    // processRestOfTurn(stateUpdate, riders, trackHills) {
    //     this._getAIDecisions(riders);
        
    //     var ridersDeepCopy =_deepCopyRiders(riders);
    //     stateUpdate.riders = this._processDecisions(ridersDeepCopy, trackHills);
    //     stateUpdate = this._processTurn(stateUpdate);
    //     this._resetDecisions();

    //     return stateUpdate;
    // }

    _getTopCards(currentRiderId, nCards=4) {
        var cards = this.riders.filter(r => 
            r.id === currentRiderId
        )[0].cards;

        return cards.slice(0, nCards);
    }

    /* Private functions*/

    _getAIDecision(currentRiderId) {
        //Need to have access to players data to make AI decisions? At the moment only chooses a card at random
        var cards = this._getTopCards(currentRiderId);
        var cardChosenIndex = Math.floor(Math.random() * cards.length);

        return cards[cardChosenIndex];
    }

    _getRider(riders, player, isSprinter) {
        var rider = riders.filter( r => 
            r.player === player && 
            r.isSprinter === (isSprinter===0 ? true : false)
        )[0];

        return rider;
    }

    // _getDecision(player, isSprinter) {
    //     const decision = this.decisions.filter( d => 
    //         d.player === player &&
    //         d.isSprinter === (isSprinter===0 ? true : false))[0];

    //     return decision;
    // }

    _processDecisions() {
        console.log("Processing decisions");
        let ridersPosition = [];

        this.riders.forEach(rider => {
            rider.useCard(this.decisions[rider.id]);
        });

        // Get riders Position
        var sortedRiders = this.riders.sort( function(r1, r2) {
            var p1 = r1.getPosition() + r1.getLane()*0.2;
            var p2 = r2.getPosition() + r2.getLane()*0.2;

            return p2-p1;
        });

        // for each rider, move the expected number of squares, if there's space available
        sortedRiders.forEach( function(rider) {
            let decision = this.decisions[rider.id]; //being called too early? At the moment only has 2 decisions, from human player

            // Add up/downhill logic
            var isDownHill = false;
            var isUpHill = false;

            this.track.down.forEach(d => {
                if (rider.positionX >= d && rider.positionX < d + 5) {
                    isDownHill = true;
                }
            });
            this.track.up.forEach(d => {
                if (rider.positionX >= d && rider.positionX < d + 5) {
                    isUpHill = true;
                }
            });

            if (isDownHill && decision < 5) {
                decision = 5;
            }

            if (isUpHill && decision > 5) {
                decision = 5;
            }

            // if has space on target space, then move it there
            for (let d = decision; d>=0; d--) {
                let targetPosition = rider.positionX + d;
                const nRidersOnTargetPosition = ridersPosition.filter(rp => rp.positionX === targetPosition).length;
                
                if (nRidersOnTargetPosition < 2) { // then rider fills the spot
                    ridersPosition.push({
                        id: rider.id,
                        positionX: targetPosition
                    });
                    break;
                } else if(d===0){
                    ridersPosition.push({
                        id: rider.id,
                        positionX: targetPosition
                    });
                    break;
                }
            }
        }, this);

        // drag riders 
        console.log("To Continue cleaning from here");

        var sortedTrackPositions = ridersPosition.sort(
            function(t1, t2) {
                var p1 = t1.positionX;
                var p2 = t2.positionX;
    
                return p1-p2; // Ascending order
            }
        );
        
        // foreach sorted track position
        for (let i = 0; i < 7; i++) {
            var pos = sortedTrackPositions[i].positionX;
            var nextPos = sortedTrackPositions[i+1].positionX;
            var testPos;

            if (nextPos === pos + 2) { // drag happens
                var lPos = pos;

                // move up current rider
                var riderIndex = this.riders.findIndex( r => 
                    r.id ===  sortedTrackPositions[i].id
                );

                this.riders[riderIndex].positionX = pos + 1;

                sortedTrackPositions[i].positionX = pos + 1;


                for (let j = i-1; j >= 0; j--) {
                    if(j<0){
                        return;
                    }
                    testPos = sortedTrackPositions[j].positionX;
                    if (testPos > lPos - 2) { //within drag range
                        lPos = testPos;
                        // Move riders
                        var riderIndex2 = this.riders.findIndex( r => 
                            r.id === sortedTrackPositions[j].id
                        )
                        
                        this.riders[riderIndex2].positionX = lPos + 1;

                        // update track position
                        sortedTrackPositions[j].positionX = lPos + 1;
                    } else {
                        j = -1;
                    }
                }
                
            }
        }

        // fatigue riders
        // this.riders.forEach(r => {
        //     if(sortedTrackPositions)
        // });

        sortedTrackPositions.forEach( function(rider, index) {
            if (sortedTrackPositions.filter(t =>
                t.positionX === rider.positionX + 1
            ).length <= 0 ) { //in front of the pack
                this.riders[rider.id].getTired();
            }
        }, this);

        return this.riders;
    }

    _resetDecisions() {
        this.decisions = [];
        console.log("reset decisions");
    }
}

function _deepCopyRiders() {
    debugger;
    var clonedRiders = [
        new Rider( 0, 0 , 3, 0, "Sprinter"),
        new Rider( 1, 0, 0, 1, "Rouller"),
        // new Rider( 8, 0, 4, 0, "Test", [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]),
        new Rider( 2, 1 , 2, 0, "Sprinter"),
        new Rider( 3, 1 , 1, 1, "Rouller"),
        new Rider( 4, 2 , 1, 0, "Sprinter"),
        new Rider( 5, 2 , 2, 1, "Rouller"),
        new Rider( 6, 3 , 0, 0, "Sprinter"),
        new Rider( 7, 3 , 3, 1, "Rouller")
    ];

    // clonedRiders.forEach(function(clonedRider) {
    //     var originalRider = riders.filter( r => 
    //         r.isSprinter === clonedRider.isSprinter &&
    //         r.player === clonedRider.player);

    //     var deepCopy = _deepCopyObject(originalRider[0]);

    //     clonedRider.cards = deepCopy.cards;
    //     clonedRider.cardsDiscarded = deepCopy.cardsDiscarded;
    //     clonedRider.nextMove = deepCopy.nextMove;
    //     clonedRider.positionX = deepCopy.positionX;
    // }, this);

    return clonedRiders;
}

function _deepCopyObject(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = _deepCopyObject(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _deepCopyObject(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

export default GameEngine;