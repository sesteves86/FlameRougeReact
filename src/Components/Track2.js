import React, { useEffect, useState } from 'react';
import './../Styles/Track2.css';
import PropTypes from 'prop-types';

const Track2 = (({trackHills, riders}) => {
    const terrain = {
        up: 1, 
        down: 2, 
        flat: 3,
    };

    const [trackRender, setTrackRender] = useState(
    [{
        id: 0, 
        terrain: terrain.flat, 
        distanceLeft: 70
    }]);

    useEffect(() => {
        setTrackRender(buildTrack(trackHills));
    }, [trackHills, riders]);

    const buildTrack = trackHills => {
        const trackLength = 70;

        let tempTrack = [];

        for (let segment = 0; segment < trackLength; segment++) {
            const terrainType = terrain.flat;

            tempTrack.push({
                id: segment,
                terrain: terrainType,
                distanceLeft: trackLength - segment
            });
        }

        return tempTrack;
    };

    return (
        <div className="track2">
            { trackRender && trackRender.map( (segment, i) => (
                <div className="track2-segment" key={i}>
                    <div className="track2-lane"></div>
                    <div className="track2-lane"></div>
                    <div className="track2-lane track2-lane--counter">{ segment.distanceLeft%5===0 ? segment.distanceLeft : ""}</div>
                </div>
            )) }
            { riders.map((rider, index) => (
                <div className={"track2-rider track2-rider-player-"+rider.player} style={{top: "0", left: "0"}}></div>
            ))}
        </div>
    );
});

Track2.propTypes = {
    trackHills: PropTypes.shape(PropTypes.any),
    riders: PropTypes.arrayOf(PropTypes.any)
}

export default Track2;
