import React, { useEffect, useState } from 'react';
import './../Styles/Track2.css';
import PropTypes from 'prop-types';
import {useSprings, animated } from "react-spring";

const Track2 = (({trackHills, riders}) => {
    const terrain = {
        flat: 0,
        up: 1, 
        down: 2, 
    };
    const playerColours = [
        "#88f",
        "#8f8",
        "#f88",
        "#ff8",
    ];

    const [trackRender, setTrackRender] = useState(
    [{
        id: 0, 
        terrain: terrain.flat, 
        distanceLeft: 70
    }]);

    const springs = useSprings(riders.length, riders.map( r => {
        
        return {
            top: (40 + riders[r.id].lane * 35) + "px",
            left: (riders[r.id].positionX * 27 + 1) + "px",
            "background-color": playerColours[r.player]
        }
    }));

    useEffect(() => {
        setTrackRender(buildTrack(trackHills));
    }, [trackHills, riders]);

    const buildTrack = trackHills => {
        const trackLength = 70;
        let tempTrack = [];
        
        for (let segment = 0; segment < trackLength; segment++) {
            tempTrack.push({
                id: segment,
                terrain: terrain.flat,
                distanceLeft: trackLength - segment
            });
        }

        const upHills = [];
        const downHills = [];

        trackHills.up.forEach(u => {
            upHills.push(u, u+1, u+2, u+3, u+4);
        });
        trackHills.down.forEach(d => {
            downHills.push(d, d+1, d+2, d+3, d+4);
        });

        upHills.forEach(u => {
            tempTrack[u].terrain = terrain.up;
        });
        downHills.forEach(d => {
            tempTrack[d].terrain = terrain.down;
        });

        return tempTrack;
    };

    const getRidersInitial = i => {
        return riders[i].name.substr(0,1).toUpperCase();
    }

    return (
        <div className="track2">
            { trackRender && trackRender.map( (segment, i) => {
                const className = `track2-segment track2-segment--${segment.terrain}`;

                return (
                    <div className={className} key={i}>
                        <div className="track2-lane"></div>
                        <div className="track2-lane"></div>
                        <div className="track2-lane"></div>
                        <div className="track2-lane track2-lane--counter">{ segment.distanceLeft%5===0 ? segment.distanceLeft : ""}</div>
                    </div>
                );
            }) }
            {springs.map((props, i) => (
                <animated.div className={"track2-rider"} style={props}>
                    {getRidersInitial(i)}
                </animated.div>
                
            ))}
        </div>
    );
});

Track2.propTypes = {
    trackHills: PropTypes.shape(PropTypes.any),
    riders: PropTypes.arrayOf(PropTypes.any)
}

export default Track2;
