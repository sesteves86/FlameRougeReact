import Rider from './Rider';

class GameEngine {
    constructor(players, riders, track){
        this.players = this.arrayDeepCopy(players);
        this.riders = this.arrayDeepCopy(riders);
        this.track = this.arrayDeepCopy(track)

        this.decisions = [];
    }

    arrayDeepCopy = arr => {
        if(arr)
            return JSON.parse(JSON.stringify(arr));
    }

    setHumanDecision(riderId, value) {
        this.decisions[riderId] = value;
    }

    areMoreHumanPlayersThisRound(currentRiderId) {
        const self = this;

        return this.riders.some(r => r.id > currentRiderId && self.players[r.player].isHuman);
    }

    getNextHumanRiderId(currentRiderId) {
        const self = this;

        debugger;
        return this.riders.filter(r => r.id > currentRiderId && self.players[r.player].isHuman)[0].id;
    }

    processCpuDecisionsUntilNextHumanPlayer(currentRiderId) {
        let nextHumanId;

        if (this.areMoreHumanPlayersThisRound(currentRiderId)){
            nextHumanId = this.getNextHumanRiderId(currentRiderId);
        } else {
            nextHumanId = this.riders.len;
        }
        
        // foreach next CPU
        for (let id = currentRiderId + 1; id < nextHumanId; id++) {
            const cpuDecision = this._getAIDecision(currentRiderId);

            this.decisions[currentRiderId] = cpuDecision;
        }
    }

    processAllDecision() {
        this._processDecisions();
    }

    // processRestOfTurn(stateUpdate, riders, trackHills) {
    //     this._getAIDecisions(riders);
        
    //     var ridersDeepCopy =_deepCopyRiders(riders);
    //     stateUpdate.riders = this._processDecisions(ridersDeepCopy, trackHills);
    //     stateUpdate = this._processTurn(stateUpdate);
    //     this._resetDecisions();

    //     return stateUpdate;
    // }

    _getTopCards(riders, player, isSprinter, nCards=4) {
        var cards = riders.filter(r => 
            r.player === player 
            && r.isSprinter === isSprinter
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

    _getDecision(player, isSprinter) {
        const decision = this.decisions.filter( d => 
            d.player === player &&
            d.isSprinter === (isSprinter===0 ? true : false))[0];

        return decision;
    }

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

        // for each rider, move the expected number of squares, if possible
        sortedRiders.forEach( function(rider) {
            let decision = this.decisions[rider.id];

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
                const nRidersOnTargetPosition = ridersPosition.filter(rp => rp.position === targetPosition).length;
                
                if (nRidersOnTargetPosition < 2) { // then rider fills the spot
                    ridersPosition.push({
                        id: rider.id,
                        position: targetPosition
                    });
                    break;
                } else if(d===0){
                    ridersPosition.push({
                        id: rider.id,
                        position: targetPosition
                    });
                    break;
                }
            }
        });

            // Process Slipstream
        //     var finishLoop = false;

        //     var hasSlipstream = () => {
        //         return ridersPosition.filter( rp =>
        //             rp.position === ridersPosition
        //             ).length < 2;
        //     };

        //     do { 
        //         if (hasSlipstream()) { // If there's a free space, move to target position
        //             rider.setPosition(targetPosition);
        //             var tIndex = trackPosition.findIndex( t =>
        //                 t.isSprinter === (rider.isSprinter ? 0 : 1)  && 
        //                 t.player === rider.player
        //                 );
        //             trackPosition[tIndex].position = targetPosition;
        //             finishLoop = true;
        //         } else { // can't move there
        //             targetPosition--;
        //             if(targetPosition <=0){
        //                 finishLoop = true;
        //             }
        //         }
        //     } while (!finishLoop)
        // }, this);

        // drag riders 
        console.log("To Continue cleaning from here");

        var sortedTrackPositions = ridersPosition.sort(
            function(t1, t2) {
                var p1 = t1.position;
                var p2 = t2.position;
    
                return p1-p2; // Ascending order
            }
        );
        
        // foreach sorted track position
        for (let i = 0; i < 7; i++) {
            var pos = sortedTrackPositions[i].position;
            var nextPos = sortedTrackPositions[i+1].position;
            var testPos;

            if (nextPos === pos + 2) { // drag happens
                var lPos = pos;

                // move up current rider
                var riderIndex = this.riders.findIndex( r => 
                    r.player === sortedTrackPositions[i].player 
                    && r.isSprinter === (sortedTrackPositions[i].isSprinter === 0 ? false : true)
                )

                this.riders[riderIndex].positionX = pos + 1;

                sortedTrackPositions[i].position = pos + 1;


                for (let j = i-1; j >= 0; j--) {
                    if(j<0){
                        return;
                    }
                    testPos = sortedTrackPositions[j].position;
                    if (testPos > lPos - 2) { //within drag range
                        lPos = testPos;
                        // Move riders
                        var riderIndex2 = this.riders.findIndex( r => 
                            r.player === sortedTrackPositions[j].player 
                            && r.isSprinter === (sortedTrackPositions[j].isSprinter === 0 ? false : true)
                        )
                        
                        this.riders[riderIndex2].positionX = lPos + 1;

                        // update track position
                        sortedTrackPositions[j].position = lPos + 1;
                    } else {
                        j = -1;
                    }
                }
                
            }
        }

        // fatigue riders
        sortedTrackPositions.forEach( function(trackPosition, index) {
            if (sortedTrackPositions.filter(t =>
                t.position === trackPosition.position + 1
            ).length <= 0 ) { //in front of the pack
                var riderIndex = this.riders.findIndex( r => 
                    r.player === sortedTrackPositions[index].player 
                    && r.isSprinter === (sortedTrackPositions[index].isSprinter === 0 ? false : true)
                )
                
                this.riders[riderIndex].getTired();
            }
        }, this);

        return this.riders;
    }

    _resetDecisions() {
        this.decisions = [];
    }
}

function _deepCopyRiders(riders) {
    var clonedRiders = [
        new Rider( 0 , 3, 0, true),
        new Rider( 0 , 0, 1, false),
        new Rider( 1 , 2, 0, true),
        new Rider( 1 , 1, 1, false),
        new Rider( 2 , 1, 0, true),
        new Rider( 2 , 2, 1, false),
        new Rider( 3 , 0, 0, true),
        new Rider( 3 , 3, 1, false)
    ];

    clonedRiders.forEach(function(clonedRider) {
        var originalRider = riders.filter( r => 
            r.isSprinter === clonedRider.isSprinter &&
            r.player === clonedRider.player);

        var deepCopy = _deepCopyObject(originalRider[0]);

        clonedRider.cards = deepCopy.cards;
        clonedRider.cardsDiscarded = deepCopy.cardsDiscarded;
        clonedRider.nextMove = deepCopy.nextMove;
        clonedRider.positionX = deepCopy.positionX;
    }, this);

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