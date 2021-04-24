var initialSprinterDeck =  [2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 9, 9, 9];
var initialRoullerDeck =  [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7];

class Rider {
    constructor(id, player, positionX, lane, name, customDeck){
        this.id = id;
        this.player = player;
        this.positionX = positionX;
        this.lane = lane;
        this.name = name;
        this.cards = this.setupInitialCards(name, customDeck);
        this.cardsDiscarded  = [];
        this.nextMove = 0;
    }

    setupInitialCards(name, customDeck) {
        if (customDeck) {
            return JSON.parse(JSON.stringify(customDeck));
        }
        if (name === "Sprinter"){
            return initialSprinterDeck;
        }
        if (!customDeck && name === "Rouller") {
            return initialRoullerDeck;
        }

        return [];
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

    getTired() {
        this.cards.push(2);
        // console.log("Player " + this.player + ", " + this.isSprinter + ", got fatigued.");
        // console.log(this.cards);
    }

    reset() {
        if(this.customDeck){
            this.cards = initialSprinterDeck;
        } else {
            this.cards = initialRoullerDeck;
        }

    }

    getTopCard(){
        return this.cards.slice(0,1);
    }

    getTop4Cards(){
        return this.cards.slice(0,4);
    }

    useCard(x){
        var index = this.cards.indexOf(x);

        if (index === -1) {
            console.error("Tried to use invalid card");
            // debugger;
        } else {
            this.cards.splice(index,1); 
        }
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