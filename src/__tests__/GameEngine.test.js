import Rider from '../Components/Rider';
import GameEngine from '../Components/GameEngine';

describe("Game engine with just 1 human player", () => {
    var ge;
    beforeEach(()=>{
        const players = [
            {
                id: 0,
                isHuman: true
            }
        ];
        const riders = [
            new Rider( 0, 0, 0, 0, "Sprinter"),
            new Rider( 1, 0, 1, 0, "Rouller"),
            new Rider( 2, 0, 2, 0, "Test", [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5])
        ]
        const track = {
            up: [15, 40],
            down: [10, 45]
        };
        ge = new GameEngine(players, riders, track);
    });

    it("should run without errors", () => {
        ge.setHumanDecision(0, 3);
        ge.setHumanDecision(1, 3);
        ge.setHumanDecision(2, 5);
        ge.processAllDecision();

        const ridersState = ge.getNewRidersState();

        expect(ridersState[0].positionX).toBe(3);
    });

    it("should move riders to right space", () => {
        ge.setHumanDecision(0, 3);
        ge.processCpuDecisionsUntilNextHumanPlayer(0);
        ge.setHumanDecision(1, 4);
        ge.processCpuDecisionsUntilNextHumanPlayer(1);
        ge.setHumanDecision(2, 5);
        ge.processCpuDecisionsUntilNextHumanPlayer(2);
        ge.processAllDecision();

        //expect riders to be in a given position
        const ridersState = ge.getNewRidersState();

        expect(ridersState[0].positionX).toBe(5);
        expect(ridersState[1].positionX).toBe(6);
        expect(ridersState[2].positionX).toBe(7);
    });
});

describe("Game engine with just 1 CPU player", () => {
    var ge;
    beforeEach(()=>{
        const players = [
            {
                id: 0,
                isHuman: false
            }
        ];
        const riders = [
            new Rider( 0, 0, 0, 0, "Test", [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]),
            new Rider( 1, 0, 0, 1, "Test", [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4])
        ]
        const track = {
            up: [20],
            down: [15]
        };
        ge = new GameEngine(players, riders, track);
    });

    it("should run without errors", () => {
        // console.log("should run without errors");
        ge.processCpuDecisionsUntilNextHumanPlayer(-1);
        // console.log(ge.decisions);
        ge.processAllDecision();

        let ridersState = ge.getNewRidersState();

        // console.log(ridersState);

        expect(ridersState[0].positionX).toBe(5);
        expect(ridersState[1].positionX).toBe(4);

        ge.processCpuDecisionsUntilNextHumanPlayer(-1);
        ge.processAllDecision();

        ridersState = ge.getNewRidersState();

        expect(ridersState[0].positionX).toBe(10);
        expect(ridersState[1].positionX).toBe(9);
    });
});