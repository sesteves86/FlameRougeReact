import React, { Component } from 'react';
import WinnerMessage from './WinnerMessage';
import './../Styles/Winner.css';

class WinnerScreen extends Component {

    render() {
        const mainText = "Player " + (this.props.winningPlayer + 1) + " wins";

        var listWinners = this.props.riders.filter( r => r.positionX > 70);
        
        const compVisibility = "winner winner-" + this.props.winningPlayer;

        return (
            <div className={compVisibility}>
                { listWinners.map( (r, i) => {
                    return (<WinnerMessage
                        rider = {r}
                    />)
                })}
                <p>{ mainText }</p>
                <button onClick={() => {
                    this.props.setActiveScreen(this.props.menu.startingMenu);
                }}>Back to Main Menu</button>
            </div>
        );
    }
}

export default WinnerScreen;
