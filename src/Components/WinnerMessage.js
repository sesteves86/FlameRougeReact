import React, { Component } from 'react';
import './../Styles/Winner.css';

class WinnerMessage extends Component {

    render() {
        return (
            <p>Player {this.props.rider.player + 1}'s {this.props.rider.isSprinter ? "Sprinter" : "Rouler" } final position: {this.props.rider.positionX - 70}</p>
        );
    }
}

export default WinnerMessage;
