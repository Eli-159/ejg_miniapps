document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const codeInput = document.getElementById('codeInput');
    const adminControls = document.getElementById('adminControls');
    const jsonDataInput = document.getElementById('jsonDataInput');
    const localCodeSource = document.getElementById('localCodeSource');
    const remoteCodeSource = document.getElementById('remoteCodeSource');
    const writtenClue = document.getElementById('writtenClue');
    const sourceSpan = document.getElementById('sourceSpan');
    const mainElements = document.getElementsByClassName('main');
    let localCodeSourcePref = window.localStorage.getItem('localCodeSourcePref');
    let adminLoggedIn = false;
    let onlineJsonData = {};

    const setSource = () => {
        if (localCodeSourcePref) {
            sourceSpan.textContent = 'Local Storage';
        } else {
            sourceSpan.textContent = 'Online Default';
        }
    };
    const stringToBool = (string) => {
        switch(string.toLowerCase().trim()){
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(string);
        }
    }

    fetch('https://ejg-miniapps-svb26.ondigitalocean.app/clue-for-code/clue-data.json')
    .then(res => res.text())
    .then(json => {onlineJsonData = json;});

    adminControls.style.display = 'none';
    if (localCodeSourcePref == undefined) {
        localCodeSourcePref == false;
    }
    localCodeSourcePref = stringToBool(localCodeSourcePref);
    localCodeSource.checked = localCodeSourcePref;
    remoteCodeSource.checked = !localCodeSourcePref;

    setSource();

    submitBtn.addEventListener('click', () => {
        if (adminLoggedIn) {
            adminLoggedIn = false;
            window.localStorage.setItem('clueData', jsonDataInput.value);
            localCodeSourcePref = localCodeSource.checked;
            window.localStorage.setItem('localCodeSourcePref', localCodeSourcePref);
            adminControls.style.display = 'none';
            codeInput.style.display = 'block';
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('Admin Logged Out.'));
        } else {
            let clueData;
            if (localCodeSourcePref) {
                console.log(window.localStorage.getItem('clueData'));
                clueData = window.localStorage.getItem('clueData');
            } else {
                clueData = onlineJsonData;
            }
            if (clueData == undefined) {
                clueData = {};
            } else {
                console.log(clueData);
                clueData = JSON.parse(clueData);
            }
            if (clueData[codeInput.value] != undefined) {
                const codeData = clueData[codeInput.value];
                for (let i = 0; i < mainElements.length; i++) {
                    mainElements[i].style.display = 'none';
                }
                writtenClue.textContent = codeData;
                setTimeout(() => {
                    writtenClue.textContent = '';
                    for (let i = 0; i < mainElements.length; i++) {
                    mainElements[i].style.display = 'block';
                }
                }, 15000);
                window.speechSynthesis.speak(new SpeechSynthesisUtterance(codeData));
            } else {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance('That code does not exist.'));
            }
            codeInput.value = '';
        }
        setSource();
    });

    document.addEventListener('keydown', keyData => {
        if (keyData.altKey == true && keyData.shiftKey == false && keyData.ctrlKey == true && keyData.keyCode == 53) {
            if (codeInput.value == 896553 || codeInput.value == '896553') {
                adminLoggedIn = true;
                codeInput.value = '';
                codeInput.style.display = 'none';
                jsonDataInput.value = window.localStorage.getItem('clueData');
                adminControls.style.display = 'block';
                window.speechSynthesis.speak(new SpeechSynthesisUtterance('Welcome, Admin!'));
            } else {
                window.speechSynthesis.speak(new SpeechSynthesisUtterance('Admin Login Failed.'));
            }
        }
    });
});