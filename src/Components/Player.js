import React, { Component } from 'react';
import './../Styles/Player.css';

class Player extends Component {

    onClick = (key, value) => {
        this.props.makeDecision(key, value);
    }

    render() {
        var rider1 = this.props.rider1[0];
        var rider2 = this.props.rider2[0];

        rider1.shuffle();
        rider2.shuffle();
        var options1 = rider1.getTop4Cards();
        var options2 = rider2.getTop4Cards();

        const { id, human } = this.props.player;

        const playerTitle = 
            human ? 
                "Human " +  id :
                "CPU " +  id ;

        const playerClass = "player player" + this.props.player.id + (this.props.hasFinished ? " hidden" : "");

        return (
            <div className={playerClass}>
                { playerTitle }
                <div>
                    <h3>Sprinter</h3>
                    { human === true && this.props.activePlayer === this.props.player.id && this.props.activePrimaryRider &&
                        
                        <div className="player-option">
                            {options1.map( (option, index) => (
                                <button
                                    type = "button"
                                    key = {index}
                                    value = {option}
                                    onClick = { () => this.onClick(index, option)}
                                    >{option}</button>
                            ))}
                        </div>
                    }
                </div>
                <div>
                    <h3>Roller</h3>
                    { human === true && this.props.activePlayer === this.props.player.id && !this.props.activePrimaryRider &&
                        <div className="player-option">
                            {options2.map( (option, index) => (
                                <button
                                    type = "button"
                                    key = {index}
                                    value = {option}
                                    onClick = { () => this.onClick(index, option)}
                                    >{option}</button>
                            ))}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Player;