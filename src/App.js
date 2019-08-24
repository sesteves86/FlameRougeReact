import React, { Component } from 'react';
import GameEngine from './Components/GameEngine';
import Player from './Components/Player';
import Track from './Components/Track';
import Rider from './Components/Rider';
import './App.css';

class App extends Component {
    constructor (props){
        super(props);

        this.state = 
        {
            players: 
            [
                {
                    id: 0,
                    human: true
                },
                {
                    id: 1,
                    human: false
                },
                {
                    id: 2,
                    human: false
                },
                {
                    id: 3,
                    human: false
                }
            ],
            // player, initial position x, y, isSprinter?
            riders: [
                new Rider( 0 , 3, 0, true),
                new Rider( 0 , 0, 1, false),
                new Rider( 1 , 2, 0, true),
                new Rider( 1 , 1, 1, false),
                new Rider( 2 , 1, 0, true),
                new Rider( 2 , 2, 1, false),
                new Rider( 3 , 0, 0, true),
                new Rider( 3 , 3, 1, false)
            ],
            activePlayer: 0,
            activePrimaryRider: true,
            gameEngine: new GameEngine(),
            hasFinished: false,
            winner: "Player 5"
        };
    }

    makeDecision = (key, value) => {
        console.log("Starting state at makeDecision()");
        
        if (!this.state.activePlayer === 0){
            return;
        }

        let state2 = Object.assign({}, this.state);
        let stateUpdate = {};

        if (this.state.activePrimaryRider === true) {
            stateUpdate = this.state.gameEngine.setHumanDecision(true, value);
        } else {
            stateUpdate = this.state.gameEngine.setHumanDecision(false, value);
            stateUpdate = this.state.gameEngine.processRestOfTurn(stateUpdate, this.state.riders);

            state2.riders = stateUpdate.riders;
            console.log("Riders:")
            console.log(state2.riders);
            console.log(stateUpdate.riders);
        }

        state2.activePrimaryRider = stateUpdate.activePrimaryRider;
        state2.activePlayer = stateUpdate.activePlayer;

        var maxPosition = Math.max.apply(Math, state2.riders.map(function(o) { return o.positionX; }));
        var winningPlayer = state2.riders.filter( r => r.positionX === maxPosition)[0].player;

        if (maxPosition >= 20) {
            state2.hasFinished = true;
            state2.winner = winningPlayer;
        }

        this.setState(state2);

        console.log("Finished making decision");
    }

    render() {
        console.log("Rendering: \n Active player: " + this.state.activePlayer + ", isSprinter " + this.state.activePrimaryRider);

        const renderedPlayers = this.state.players.map( (p) => (
            <Player
                key = { p.id }
                player = { p } 
                rider1 = { this.state.riders.filter( r => r.player === p.id && r.isSprinter === true ) } 
                rider2 = { this.state.riders.filter( r => r.player === p.id && r.isSprinter === false ) }
                makeDecision = { this.makeDecision }
                activePlayer = { this.state.activePlayer }
                activePrimaryRider = { this.state.activePrimaryRider }
            />
        ), this);
        return (
            <div className="App">
                <h1>Flame Rouge</h1>
                
                <Track  riders={this.state.riders} />
                <div className = "playersContainer" >
                    { renderedPlayers }
                </div>

                <h2>
                    Player {this.state.winningPlayer} wins
                </h2>
                
            </div>
        );
    }
}

export default App;
