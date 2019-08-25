import React, { Component } from 'react';
import './../Styles/Winner.css';

class WinnerScreen extends Component {

    render() {
        const mainText = "Player " + (this.props.winningPlayer + 1) + " wins";

        const compVisibility = "winner " + (this.props.hasFinished ? "" : "hidden") + " winner-" + this.props.winningPlayer;

        return (
            <div className={compVisibility}>
                { mainText }
            </div>
        );
    }
}

export default WinnerScreen;
