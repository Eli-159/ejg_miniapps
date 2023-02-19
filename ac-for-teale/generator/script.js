document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', () => {
        const dateGivenInput = document.getElementById('dateGiven').value.split('-');
        const dateCompletedInput = document.getElementById('dateCompleted').value.split('-');
        const numQsCorrectInput = document.getElementById('numQsCorrect').value;
        const totalQsInput = document.getElementById('totalQs').value;
        const numImgsInput = document.getElementById('numImgs').value;

        const ex1Input = document.getElementById('ex1').value;
        const qs1Input = document.getElementById('qs1').value;
        const link1Input = document.getElementById('link1').value;
        const ex2Input = document.getElementById('ex2').value;
        const qs2Input = document.getElementById('qs2').value;
        const link2Input = document.getElementById('link2').value;
        const ex3Input = document.getElementById('ex3').value;
        const qs3Input = document.getElementById('qs3').value;
        const link3Input = document.getElementById('link3').value;

        const secs = [];
        if (ex1Input) {
            secs.push({
                ex: ex1Input,
                qs: qs1Input,
                link: link1Input
            });
        }
        if (ex2Input) {
            secs.push({
                ex: ex2Input,
                qs: qs2Input,
                link: link2Input
            });
        }
        if (ex3Input) {
            secs.push({
                ex: ex3Input,
                qs: qs3Input,
                link: link3Input
            });
        }

        const outputObj = {
            dateGiven: `${dateGivenInput[2]}/${dateGivenInput[1]}/${dateGivenInput[0]}`,
            dateGivenNum: dateGivenInput.join(''),
            dateCompleted: `${dateCompletedInput[2]}/${dateCompletedInput[1]}/${dateCompletedInput[0]}`,
            acc: Math.floor(numQsCorrectInput/totalQsInput*100),
            numImgs: parseInt(numImgsInput),
            secs: secs
        };

        document.getElementById('outputJSON').textContent = JSON.stringify(outputObj);

        for (let i = 1; i <= outputObj.numImgs; i++) {
            const newLI = document.createElement('li');
            newLI.textContent = `${outputObj.dateGivenNum}_${i}`;
            document.getElementById('imageNameList').appendChild(newLI);
        }
    });
});