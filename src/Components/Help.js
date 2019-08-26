import React, { Component } from 'react';
import './../Styles/Help.css';

class Player extends Component {

    onClick = () => {
        console.log(this.props);
        this.props.toggleHelp();
    }

    render() {
        var openClassName = "help-toggle-button " +  (this.props.helpMenu ? "hidden" : "");
        var containerClassName = "help-menu-container " + (this.props.helpMenu ? "" : "hidden");

        return (
            <div>
                <div 
                    className = {openClassName}
                    onClick = { () => this.onClick()}
                    >
                    Rules
                </div>
                <div className={containerClassName}>
                    <div className="help-close"
                        onClick = { () => this.onClick()}
                        >X</div>
                    <p>Each player controls 2 ciclists: a Sprinter and a Roller.</p>
                    <p>On each turn, each player chooses a card randomly, for each rider, chosen from a pre-set deck.</p>
                    <p>A Sprinter deck has 3x2, 3x3, 3x4, 3x5 and 3x9</p>
                    <p>A Roller deck has 3x3, 3x4, 3x5, 3x6 and 3x7</p>
                    <p>Players move the ammount of spaces equal to the chosen option, or as close as possible</p>
                    <p>Riders that end up 2 spaces away from the next rider, are slipstream to just 1 space away</p>
                    <p>Riders that end up in the front of a pack (without on the space ahead of them) get fatigued and get an extra "2" card on their deck</p>
                    <p>The first player to cross the finish line wins. In case of a tie, the one who goes further wins</p>
                    <p>When climbing up a hill (red bordered spaces), there's no slipstream and the max speed is 5</p>
                    <p>When going down a hill (blue bordered spaces), the min speed is 5</p>
                    <p><b>To come:</b></p>
                    <p>No slipstream on uphills</p>
                </div>
            </div>
        );
    }
}

export default Player;
