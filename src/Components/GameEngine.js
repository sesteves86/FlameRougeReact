// import Rider from './Rider';
import random from "random";
import arrayOrdering from "../Utilities/ArrayOrdering";

class GameEngine {
    constructor(players, riders, track){
        this.players = this.arrayDeepCopy(players);
        // this.riders = riders//_deepCopyRiders();
        this.riders = _deepCopyObject(riders);
        this.track = this.arrayDeepCopy(track)

        this.decisions = [];
        this.ridersPosition = [];
        console.log("initialize decisions");
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
        const nextHumanRiderId = this.riders.filter(r => 
            r.id > currentRiderId && self.players[r.player].isHuman
        )[0].id;

        return nextHumanRiderId;
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
            const cpuDecision = this._getAIDecision(id);

            this.decisions[id] = cpuDecision;
        }
    }

    getNewRidersState() {
        return _deepCopyObject(this.riders);
    }

    _getTopCards(currentRiderId, nCards=4) {
        var cards = this.riders.filter(r => 
            r.id === currentRiderId
        )[0].cards;

        const deepCopyDeck = JSON.parse(JSON.stringify(cards));
        const shuffledDeck = arrayOrdering.shuffleArray(deepCopyDeck); //deepCopyDeck.sort(() => 0.5 - random.float());
        const topNCards = shuffledDeck.slice(0,nCards);

        return topNCards;
    }

    /* Private functions*/

    _getAIDecision(currentRiderId) {
        //Need to have access to players data to make AI decisions? At the moment only chooses a card at random
        var cards = this._getTopCards(currentRiderId);
        var cardChosenIndex = random.int(0, cards.length-1);

        return cards[cardChosenIndex];
    }

    _getRider(riders, player, isSprinter) {
        var rider = riders.filter( r => 
            r.player === player && 
            r.isSprinter === (isSprinter===0 ? true : false)
        )[0];

        return rider;
    }

    processAllDecision() {
        this.ridersPosition = [];

        this.riders.forEach(rider => {
            
            const selectedCard = this.decisions[rider.id];
            var index = rider.cards.indexOf(selectedCard);

            if (index === -1) {
                console.error("Rider " + rider.Id + "Tried to use invalid card");
                console.log("Card Selected: " + selectedCard);
            } else {
                rider.cards.splice(index,1); 
            }
        });

        // Get riders Position
        var sortedRiders = _deepCopyObject(this.riders);
        sortedRiders = sortedRiders.sort( function(r1, r2) {
            var p1 = r1.positionX - r1.lane*0.2;
            var p2 = r2.positionX - r2.lane*0.2;

            return p2-p1;
        });

        // for each rider, move the expected number of squares, if there's space available
        sortedRiders.forEach( function(rider) {
            const currentPositionX = rider.positionX;
            let decision = this.decisions[rider.id]; //being called too early? At the moment only has 2 decisions, from human player

            // Add up/downhill logic
            var startsOnDownHill = false;

            this.track.down.forEach(d => {
                if (currentPositionX >= d && currentPositionX < d + 5) {
                    startsOnDownHill = true;
                }
            });

            if (startsOnDownHill && decision < 5) {
                decision = 5;
            }

            //uphill
            this.track.up.forEach(u => {
                const passesThroughUpHill = currentPositionX + decision >= u && currentPositionX < u + 5;
                if (passesThroughUpHill) { 
                    const distToUpHill = currentPositionX - u;

                    decision = distToUpHill > 5 ? distToUpHill-1 : Math.min(decision, 5);
                }
            });

            // if has space on target space, then move it there
            for (let d = decision; d>=0; d--) {
                let targetPosition = rider.positionX + d;

                const nRidersOnTargetPosition = this.ridersPosition.filter(rp => rp.positionX === targetPosition).length;
                
                if (nRidersOnTargetPosition < 2) { // then rider fills the spot
                    this.ridersPosition.push({
                        id: rider.id,
                        positionX: targetPosition,
                        lane: nRidersOnTargetPosition
                    });
                    break;
                } else if(d===0){
                    this.ridersPosition.push({
                        id: rider.id,
                        positionX: targetPosition,
                        lane: rider.lane
                    });
                    break;
                } // else was blocked
            }
        }, this);

        var sortedTrackPositions = _deepCopyObject(this.ridersPosition);

        sortedTrackPositions = sortedTrackPositions.sort(
            function(t1, t2) {
                var p1 = t1.positionX;
                var p2 = t2.positionX;
    
                return p1-p2; // Ascending order
            }
        );
        
        sortedTrackPositions.forEach( function(rider, index) {
            // Update riders position
            this.riders[rider.id].positionX = rider.positionX;
            this.riders[rider.id].lane = rider.lane;
        }, this);

        return this.riders;
    }

    processDrag() {
        var sortedTrackPositions = _deepCopyObject(this.ridersPosition);

        sortedTrackPositions = sortedTrackPositions.sort(
            function(t1, t2) {
                var p1 = t1.positionX;
                var p2 = t2.positionX;
    
                return p1-p2; // Ascending order
            }
        );
        
        // foreach sorted track position
        for (let i = 0; i < this.ridersPosition.length-1; i++) {
            var pos = sortedTrackPositions[i].positionX;
            var nextPos = sortedTrackPositions[i+1].positionX;
            var testPos;

            const isUpHill = this.track.up.some(u => {
                return pos + 2 >= u  && pos <= u + 4;
            });

            const hasDrag = nextPos === pos + 2 && !isUpHill;

            if (hasDrag) {
                var lPos = pos;

                // move up current rider
                var riderIndex = this.riders.findIndex( r => 
                    r.id ===  sortedTrackPositions[i].id
                );

                this.riders[riderIndex].positionX = pos + 1;
                sortedTrackPositions[i].positionX = pos + 1;

                for (let j = i-1; j >= 0; j--) {
                    if (j<0) {
                        return;
                    }
                    testPos = sortedTrackPositions[j].positionX;

                    const isUpHill = this.track.up.some(u => {
                        return lPos + 2 >= u  && lPos <= u + 4;
                    });

                    if (testPos > lPos - 2 && !isUpHill) { //within drag range AND not in uphill
                        lPos = testPos;
                        sortedTrackPositions[j].positionX = lPos + 1;
                    } else {
                        j = -1;
                    }
                }
            }
        }

        sortedTrackPositions.forEach( function(rider, index) {
            // Update riders position
            this.riders[rider.id].positionX = rider.positionX;
            this.riders[rider.id].lane = rider.lane;

            // Fatigue if in front
            if (sortedTrackPositions.filter(t =>
                t.positionX === rider.positionX + 1
            ).length <= 0 ) { //in front of the pack
                this.riders[rider.id].cards.push(2);
            }
        }, this);
    }

    _resetDecisions() {
        this.decisions = [];
    }
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