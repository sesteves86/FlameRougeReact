import './../Styles/Track.css';

class Rider {
    constructor(player, positionX, lane, isSprinter){
        this.player = player;
        this.positionX = positionX;
        this.lane = lane;
        this.isSprinter = isSprinter;
        this.cards = [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 8];
        this.cardsDiscarded  = [];
        this.nextMove = 0;
    }

    shuffle(){
        var newPosition, tempHolder;
        for (var i = this.cards.length - 1; i > 0; i--) {
            newPosition = Math.floor(Math.random() * (i + 1));
            tempHolder = this.cards[i];
            this.cards[i] = this.cards[newPosition];
            this.cards[newPosition] = tempHolder;
        }
    }

    getTopCard(){
        return this.cards.slice(0,1);
    }

    getTop5Cards(){
        return this.cards.slice(0,5);
    }

    useCard(x){
        this.nextMove = this.cards[x];
        this.cards.splice(x,1);
        // console.log("card used for player " + this.player);
    }

    getLane(){
        return this.lane;
    }
    getPosition(){
        return this.positionX;
    }
    getPlayer(){
        return this.player;
    }
    getPrimary(){
        return this.isSprinter;
    }

    setLane(lane){
        this.lane = lane;
    }
    setPosition(position){
        this.positionX = position;
    }
  
}

export default Rider;