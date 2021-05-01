import random from "random";

class ArrayOrdering {
    // constructor() {

    // }

    shuffleArray(a) {
        // const copiedArray = JSON.parse(JSON.stringify(arr));
        const arr = JSON.parse(JSON.stringify(a));

        const arrObj = [];

        arr.forEach((e) => {
            arrObj.push({
                value: e, 
                rPos: random.float()
            });
        });

        arrObj.sort((oa, ob) => {
            return oa.rPos - ob.rPos;
        })

        const finalArray = [];

        arrObj.forEach((o) => {
            finalArray.push(o.value);
        });

        // console.log("ArrayOrdering.shuffleArray()");
        // console.log(a);
        // console.log(finalArray);

        return finalArray;
    }
}

const arrayOrdering = new ArrayOrdering();

export default arrayOrdering;