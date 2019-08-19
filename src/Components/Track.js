import React, { Component } from 'react';
import './../Styles/Track.css';

class Player extends Component {

  initialisePositions(){
    let trackRender = [];
    let trackLane = [];

    for (let lane = 0; lane < 2; lane++) {
      trackLane = [];

      for (let segment = 0; segment < 50; segment++) {
        trackLane.push(
          {
            className: "track-segment track-segment-" + lane + "-" + segment,
            rider: ""
          }
        );
      }

      trackRender.push(trackLane);
    }

    return trackRender;
  }

  assignPositions(){
    let track = this.initialisePositions();
    let lane = 0;

    //assign new position
    this.props.riders.map( (rider, index) => (
      assignNewPosition(rider, index)
    ));

    function assignNewPosition(rider, index) {
      if (track[0][rider.positionX].className.length === 31) {
        lane = 0 ;
      } else {
        lane = 1 ;
      }
      track[lane][rider.positionX].className += " track-segment-player-" + rider.player;
        track[lane][rider.positionX].rider = rider.isPrimary ? "A" : "B";
    };

    return track;
  }

  render() {
    let trackRender = this.assignPositions();

    return (
      <div className="track">
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
