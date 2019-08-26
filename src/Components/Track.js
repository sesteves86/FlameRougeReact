import React, { Component } from 'react';
import './../Styles/Track.css';

class Player extends Component {

  initialisePositions(trackLength, trackHills){
    let trackRender = [];
    let trackLane = [];
    
    for (let lane = 0; lane < 3; lane++) {
      trackLane = [];

      for (let segment = 0; segment < trackLength; segment++) { 
        if (lane<2) {
          trackLane.push(
            {
              className: "track-segment track-segment-" + lane + "-" + segment + " " + 
                              (trackHills.up.filter(t => t >=  segment - 5 && t < segment ).length > 0 ? 
                              "track-up" : "") +
                              (trackHills.down.filter(t => t >=  segment - 5 && t < segment ).length > 0 ? 
                              "track-down" : ""),
              rider: ""
            }
          );
        } else {
          trackLane.push(
            {
              className: "track-segment track-segment-counter",
              rider: ""
            }
          );
        }
      }

      trackRender.push(trackLane);
    }

    return trackRender;
  }

  assignPositions(trackHills){
    const trackLength = 70;
    let track = this.initialisePositions(trackLength, trackHills);
    let lane = 0;

    //assign new position
    this.props.riders.map( (rider, index) => (
      assignNewPosition(rider, index, trackLength)
    ));

    function assignNewPosition(rider, index, trackLength) {
      if (rider.positionX < trackLength){ // still racing
        if (track[0][rider.positionX].className.search("player") === -1 ) { // if there's no other rider in the above track
          lane = 0 ;
        } else {
          lane = 1 ;
        }
        track[lane][rider.positionX].className += " track-segment-player-" + rider.player;
        track[lane][rider.positionX].rider = rider.isSprinter ? "S" : "R";
      }

      // To move out
      // Number the spaces
      for (var i = 0; i<70; i++) {
        track[2][i].rider = ((i+1)%5 === 0 ? (i+1) : "");
      }
    };

    return track;
  }

  render() {
    let trackRender = this.assignPositions(this.props.trackHills);
    var trackContainerClassName = "track " + (this.props.helpMenu ? "hidden" : "");

    return (
      <div className={trackContainerClassName}>
        { trackRender.map( (lane, i) => (
          <div className="track-lane" key={i}>
            { lane.map( (segment, i2) => (
              <div className={segment.className} key={i2}>
                {segment.rider}
              </div>
            )) }
          </div>
        )) }
          
      </div>
    );
  }
}

export default Player;
