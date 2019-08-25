import React, { Component } from 'react';
import GameEngine from './Components/GameEngine';
import Help from './Components/Help';
import Player from './Components/Player';
import Rider from './Components/Rider';
import Track from './Components/Track';
import WinnerScreen from './Components/WinnerScreen';
import './App.css';

class App extends Component {
    constructor (props){
        super(props);

        this.state = 
        {
            activePlayer: 0,
            activePrimaryRider: true,
            gameEngine: new GameEngine(),
            hasFinished: false,
            helpMenu: false,
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
            trackHills: {
                up: [15, 40],
                down: [10, 45]
            },
            winner: 5
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
        }

        state2.activePrimaryRider = stateUpdate.activePrimaryRider;
        state2.activePlayer = stateUpdate.activePlayer;

        var maxPosition = Math.max.apply(Math, state2.riders.map(function(o) { return o.positionX; }));
        var winningPlayer = state2.riders.filter( r => r.positionX === maxPosition)[0].player;

        if (maxPosition >= 70) {
            state2.hasFinished = true;
            state2.winner = winningPlayer;
        }

        this.setState(state2);

        console.log("Finished making decision");
    }

    toggleHelp = () => {
        this.state.helpMenu = !this.state.helpMenu;
        this.setState(this.state);
    }

    render() {
        const renderedPlayers = this.state.players.map( (p) => (
            <Player
                key = { p.id }
                player = { p } 
                rider1 = { this.state.riders.filter( r => r.player === p.id && r.isSprinter === true ) } 
                rider2 = { this.state.riders.filter( r => r.player === p.id && r.isSprinter === false ) }
                makeDecision = { this.makeDecision }
                activePlayer = { this.state.activePlayer }
                activePrimaryRider = { this.state.activePrimaryRider }
                hasFinished = { this.state.hasFinished}
            />
        ), this);
        
        return (
            <div className="App">
                <h1>Flame Rouge</h1>

                <Help
                    helpMenu = {this.state.helpMenu}
                    toggleHelp = {this.toggleHelp}
                />
                
                <Track 
                    riders = {this.state.riders}
                    trackHills = {this.state.trackHills}
                />
                <div className = "playersContainer" >
                    { renderedPlayers }
                </div>

                <WinnerScreen
                    hasFinished = {this.state.hasFinished}
                    winningPlayer = {this.state.winner}
                />
            </div>
        );
    }
}

export default App;
