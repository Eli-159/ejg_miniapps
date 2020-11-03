let colourPreference;
document.addEventListener('DOMContentLoaded', () => {
    const url = window.location.href;
    if (url !== 'https://ejg-miniapps-svb26.ondigitalocean.app/snppt/main.html?#') {
        const link = document.createElement('a');
        link.href = '?#';
        link.id = 'redirectHashLink';
        document.getElementsByTagName('body')[0].appendChild(link);
        link.click();
        link.remove();
    }

    const inputData = document.getElementById('inputData');
    const submitBtn = document.getElementById('submit');
    const postSubmitControls = document.getElementById('postSubmitControls');
    const dataInputSection = document.getElementById('dataInputSection');
    const invalidDataError = document.getElementById('invalidDataError');
    const gradeSelector = document.getElementById('grade');
    const viewDataNewPage = document.getElementById('viewDataNewPage');
    
    const pptCustomColours = document.getElementById('pptCustomColours');
    const pptPickColours = document.getElementById('pptPickColours');
    const pptBackColour = document.getElementById('pptBackColour');
    const pptTextColour = document.getElementById('pptTextColour');
    const backColourPrev = document.getElementById('backColourPrev');
    const textColourPrev = document.getElementById('textColourPrev');
    const includeLogo = document.getElementById('includeLogo');
    const includeTitlePage = document.getElementById('includeTitlePage');
    const createPowerPointBtn = document.getElementById('createPowerPoint');
    const pptTitleDiv = document.getElementById('pptTitle');
    const pptTitleOpts = [
        document.getElementById('yearStudentNotices'),
        document.getElementById('yearNotices'),
        document.getElementById('yearAssembly'),
        document.getElementById('studentNotices'),
        document.getElementById('customPptTitle'),
        document.getElementById('blankSlide')
    ];
    const customPptTitleInput = document.getElementById('customPptTitleInput');
    const pptTitlesById = {
        default: () => {return gradeSelector.value + ' Student Notices'},
        yearStudentNotices: () => {return gradeSelector.value + ' Student Notices'},
        yearNotices: () => {return gradeSelector.value + ' Notices'},
        yearAssembly: () => {return gradeSelector.value + ' Assembly'},
        studentNotices: () => {return 'Student Notices'},
        customPptTitle: () => {return customPptTitleInput.value},
        blankSlide: () => {return null}
    };

    const selectedPptTitle = () => {
        let found = false;
        for (let i = 0; i < pptTitleOpts.length; i++) {
            if (pptTitleOpts[i].checked) {
                found = true;
                return pptTitleOpts[i];
            }
        }
        if (!found) {
            return null;
        }
    }

    invalidDataError.style.display = 'none';
    postSubmitControls.style.display = 'none';
    submitBtn.disabled = true;
    pptPickColours.style.display = 'none';
    pptTitleDiv.style.display = 'none';
    pptTitleOpts[0].checked = true;
    

    const processedData = [];

    const validateInputs = () => {
        if (gradeSelector.value == 'none' || inputData.value === '' || inputData.value[0] != '[') {
            submitBtn.disabled = true;
        } else {
            submitBtn.disabled = false;
        }
    }

    dataInputSection.addEventListener('change', validateInputs);

    const setColourData = () => {
        colourPreference = window.localStorage.getItem('colourPreference');
        if (colourPreference != null) {
            colourPreference = JSON.parse(colourPreference);
        } else {
            colourPreference = {
                backColour: '#000066',
                textColour: '#666666'
            }
            window.localStorage.setItem('colourPreference', JSON.stringify(colourPreference));
        }
        pptBackColour.value = colourPreference.backColour;
        pptTextColour.value = colourPreference.textColour;
    }
    const verifyPptSettings = () => {
        if (pptCustomColours.checked == true) {
            let disabled = false;
            if (/^#[0-9A-F]{6}$/i.test(pptBackColour.value)) {
                pptBackColour.style['border-color'] = '#000066';
            } else {
                disabled = true;
                pptBackColour.style['border-color'] = '#ff0000';
            }
            if (/^#[0-9A-F]{6}$/i.test(pptTextColour.value)) {
                pptTextColour.style['border-color'] = '#000066';
            } else {
                disabled = true;
                pptTextColour.style['border-color'] = '#ff0000';
            }
            if (selectedPptTitle() == null && includeTitlePage.checked) {
                disabled == true;
            }
        }
    }
    const updateColourData = () => {
        colourPreference = {
            backColour: pptBackColour.value,
            textColour: pptTextColour.value
        }
        backColourPrev.style['background-color'] = colourPreference.backColour;
        textColourPrev.style['background-color'] = colourPreference.textColour;
        backColourPrev.style['background-color'] = colourPreference.backColour;
        textColourPrev.style['background-color'] = colourPreference.textColour;
        if (/^#[0-9A-F]{6}$/i.test(colourPreference.backColour) && /^#[0-9A-F]{6}$/i.test(colourPreference.textColour)) {
            window.localStorage.setItem('colourPreference', JSON.stringify(colourPreference));
        }
        verifyPptSettings();
    }
    setColourData();
    updateColourData();

    pptBackColour.addEventListener('change', updateColourData);
    pptTextColour.addEventListener('change', updateColourData);

    pptCustomColours.addEventListener('change', () => {
        if (pptCustomColours.checked == true) {
            pptPickColours.style.display = 'block';
        } else {
            pptPickColours.style.display = 'none';
        }
    });

    includeTitlePage.addEventListener('change', () => {
        if (includeTitlePage.checked) {
            pptTitleDiv.style.display = 'block';
        } else {
            pptTitleDiv.style.display = 'none';
        }
        verifyPptSettings();
    });

    for (let i = 0; i < pptTitleOpts.length; i++) {
        pptTitleOpts[i].addEventListener('change', () => verifyPptSettings);
    }

    submitBtn.addEventListener('click', () => {
        let rawData;
        let ok = true;
        try {
            rawData = JSON.parse(inputData.value);
        } catch {
            ok = false;
            console.error('Invalid Data Input - Couldn\'t Parse Object');
        }
        if (ok) {
            for (let i = 0; i < rawData.length; i++) {
                if (rawData[i]['teacher'] == undefined || rawData[i]['category'] == undefined || rawData[i]['subject'] == undefined || rawData[i]['message'] == undefined) {
                    ok = false;
                    console.error('Invalid Data Input - Missing Data Points');
                }
            }
        }
        if (ok) {
            inputData.disabled = true;
            gradeSelector.disabled = true;
            submitBtn.disabled = true;
            dataInputSection.removeEventListener('change', validateInputs);
            const yearLevelSpans = document.getElementsByClassName('yearLevelSpan');
            for (let i = 0; i < yearLevelSpans.length; i++) {
                yearLevelSpans[i].textContent = gradeSelector.value.split(' ')[1];
            }
            const irrelevantCategories = [
                'Year 7',
                'Year 8',
                'Year 9',
                'Year 10',
                'Year 11',
                'Year 12',
                'Junior Schooling',
                'Senior Schooling'
            ];

            if (gradeSelector.value == 'Year 7' || gradeSelector.value == 'Year 8' || gradeSelector.value == 'Year 9') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Junior Schooling'), 1);
            } else if (gradeSelector.value == 'Year 10' || gradeSelector.value == 'Year 11' || gradeSelector.value == 'Year 12') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Senior Schooling'), 1);
            }
            irrelevantCategories.splice(irrelevantCategories.indexOf(gradeSelector.value), 1);



            for (let i = 0; i < rawData.length; i++) {
                let currentData = rawData[i];
                currentData['teacher'] = currentData['teacher'].split(' (')[0];
                currentData['category'] = currentData['category'].split('. ')[1];
                let relevant = true;
                for (let i = 0; i < irrelevantCategories.length; i++) {
                    if (currentData['category'] == irrelevantCategories[i]) {
                        relevant = false;
                        break;
                    }
                }
                if (relevant) {
                    processedData.push(currentData);
                }
            }
            postSubmitControls.style.display = 'block';
        } else {
            invalidDataError.style.display = 'block';
            dataInputSection.addEventListener('change', () => invalidDataError.style.display = 'none');
        }
    });

    createPowerPointBtn.addEventListener('click', () => {
        let colours = {back: '000066', text: 'e6e6e6'};
        if (pptCustomColours.checked) {
            colours.back = pptBackColour.value;
            colours.text = pptTextColour.value;
        }
        let pres = powerpointFunctions.createPresentation();
        let title = pptTitlesById.default();
        if (includeTitlePage.checked) {
            const titleId = selectedPptTitle().id;
            if (titleId == 'blankSlide') {
                let slide = powerpointFunctions.createSlide(pres, false, colours);
            } else {
                title = pptTitlesById[titleId]();
                let slide = powerpointFunctions.createSlide(pres, includeLogo.checked, colours);
                powerpointFunctions.createTextBox(slide, title, false, 60, 1, '50%', 'center', true);
            }
        }
        for (let i = 0; i < processedData.length; i++) {
            let slide = powerpointFunctions.createSlide(pres, includeLogo.checked, colours);
            powerpointFunctions.createTextBox(slide, processedData[i]['subject'], {
                x: '2%',
                y: 0.1,
                align: 'center',
                bold: true,
                h: 1.3,
                w: '96%',
                fontSize: ((processedData[i]['subject'].length <= 50) ? 40 : ((processedData[i]['subject'].length <= 75) ? 35 : (processedData[i]['subject'].length <= 100) ? 25 : 18)),
                isTextBox: true,
                valign: 'middle'
            });
            powerpointFunctions.createTextBox(slide, processedData[i]['category'] + '  -  ' + processedData[i]['teacher'], false, 18, 1, 1.6, 'center', false);
            powerpointFunctions.createTextBox(slide, processedData[i]['message'], false, 14, 1, ((processedData[i]['message'].length < 600) ? 2.7 : 3.5), 'center', false);
        }
        pres.writeFile(title + '.pptx');
    });

    viewDataNewPage.addEventListener('click', () => {
        window.sessionStorage.setItem('noticesDataDisplay', JSON.stringify(processedData));
        window.open('/snppt/view-data.html', '_blank');
    });
});