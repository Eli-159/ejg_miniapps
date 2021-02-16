// Declares a global colour preference variable.
let colourPreference;
// Waits for the DOM to load.
document.addEventListener('DOMContentLoaded', () => {
    // Loads the url into a variable.
    const url = window.location.href;
    // Tests if the current url has the '?#' at the end.
    if (url !== 'https://ejg-miniapps-svb26.ondigitalocean.app/snppt/main.html?#') {
        // If '?#' is not found at the end of the url, a link is created with the href '?#', added to the DOM, clicked, and removed.
        const link = document.createElement('a');
        link.href = '?#';
        document.getElementsByTagName('body')[0].appendChild(link);
        link.click();
        link.remove();
    }

    // Loads all of the required main page elements into variables.
    const inputData = document.getElementById('inputData');
    const submitBtn = document.getElementById('submit');
    const postSubmitControls = document.getElementById('postSubmitControls');
    const dataInputSection = document.getElementById('dataInputSection');
    const invalidDataError = document.getElementById('invalidDataError');
    const gradeSelector = document.getElementById('grade');
    const viewDataNewPage = document.getElementById('viewDataNewPage');
    
    // Loads all of the required powerpoint options page elements into variables.
    const pptCustomColours = document.getElementById('pptCustomColours');
    const pptPickColours = document.getElementById('pptPickColours');
    const pptBackColour = document.getElementById('pptBackColour');
    const pptTextColour = document.getElementById('pptTextColour');
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
    // Returns the text title of the powerpoint based on the string id passed in.
    const pptTitlesById = {
        default: () => {return gradeSelector.value + ' Student Notices'},
        yearStudentNotices: () => {return gradeSelector.value + ' Student Notices'},
        yearNotices: () => {return gradeSelector.value + ' Notices'},
        yearAssembly: () => {return gradeSelector.value + ' Assembly'},
        studentNotices: () => {return 'Student Notices'},
        customPptTitle: () => {return customPptTitleInput.value},
        blankSlide: () => {return null}
    };

    // Returns the selected powerpoint title element.
    const selectedPptTitle = () => {
        // Loops over all of the pptTitleOpts array.
        for (let i = 0; i < pptTitleOpts.length; i++) {
            // Tests if the current checkbox element is checked, and if so, returns it.
            if (pptTitleOpts[i].checked) {
                return pptTitleOpts[i];
            }
        }
        // If none are checked, the function returns null.
        return null;
    }

    // Sets some default starting attributes to elements.
    invalidDataError.style.display = 'none';
    postSubmitControls.style.display = 'none';
    submitBtn.disabled = true;
    pptPickColours.style.display = 'none';
    pptTitleDiv.style.display = 'none';
    pptTitleOpts[0].checked = true;
    
    // Declares a variable to hold an array of processed data.
    const processedData = [];

    // Disables or enables the submit button based on a validation test.
    const validateInputs = () => {
        console.log('Submit Button Disabled = ' + (gradeSelector.value == 'none' || !(inputData.value).includes('[{') || !(inputData.value).includes('}]')));
        submitBtn.disabled = (gradeSelector.value == 'none' || !(inputData.value).includes('[{') || !(inputData.value).includes('}]'));
    }

    // Ties the validateInputs function to an input event listener.
    dataInputSection.addEventListener('input', validateInputs);

    // Declares a function to set the value of the colour preference variable and the colour inputs.
    const setColourData = () => {
        // Loads the local storage colour preference into the colour preference variable.
        colourPreference = window.localStorage.getItem('colourPreference');
        // Tests that the colour preferene data was saved previously.
        if (colourPreference != null) {
            // Parses the colour preference variable into a json.
            colourPreference = JSON.parse(colourPreference);
        } else {
            // Sets the colour preference variable to the default colours.
            colourPreference = {
                backColour: '#2f3437',
                textColour: '#e6e6e6'
            }
            // Loads the default variable into local storage.
            window.localStorage.setItem('colourPreference', JSON.stringify(colourPreference));
        }
        // Sets the powerpoint colour inputs to the current colour preference variable.
        pptBackColour.value = colourPreference.backColour;
        pptTextColour.value = colourPreference.textColour;
    }

    // Verifies if the PowerPoint Settings are Valid.
    const verifyPptSettings = () => {
        // Declares a variable to hold the boolean value of whether the submit button should be disabled.
        let disabled = false;
        // Tests if there is a valid title if include title has been selected.
        if (selectedPptTitle() == null && includeTitlePage.checked) {
            disabled == true;
        }
        // Sets the submit button's disabled property to the disabled variable.
        createPowerPointBtn.disabled = disabled;
    }

    // Updates the saved colour data.
    const updateColourData = () => {
        colourPreference = {
            backColour: pptBackColour.value,
            textColour: pptTextColour.value
        }
        // Saves the new colour preference.
        window.localStorage.setItem('colourPreference', JSON.stringify(colourPreference));
        // Verifies the powerpoint settings.
        verifyPptSettings();
    }

    // Sets the colour data.
    setColourData();
    // Updates the colour data so that the current values will be saved.
    updateColourData();

    // Ties the updateColourData function to a change event listner on both colour inputs.
    pptBackColour.addEventListener('change', updateColourData);
    pptTextColour.addEventListener('change', updateColourData);

    // Adds a change event listener to the custom colours checkbox to hide and show the div containing the colour infomation.
    pptCustomColours.addEventListener('change', () => {
        if (pptCustomColours.checked == true) {
            pptPickColours.style.display = 'block';
        } else {
            pptPickColours.style.display = 'none';
        }
    });

    // Adds an event listner to the include title page checkbox to hide and show the div containing the title options and verify the powerpoint settings.
    includeTitlePage.addEventListener('change', () => {
        if (includeTitlePage.checked) {
            pptTitleDiv.style.display = 'block';
        } else {
            pptTitleDiv.style.display = 'none';
        }
        verifyPptSettings();
    });

    // Loops over all of the title options and adds change event listners to verify the powerpoint settings.
    for (let i = 0; i < pptTitleOpts.length; i++) {
        pptTitleOpts[i].addEventListener('change', () => verifyPptSettings);
    }

    // Adds a click event listner to the main submit button.
    submitBtn.addEventListener('click', () => {
        // Declares variables to hold the raw data and whether it is valid.
        let rawData;
        let ok = true;
        // Tries parsing the inputed data into a variable and logs an error if it doesn't work.
        try {
            rawData = JSON.parse(inputData.value);
        } catch {
            ok = false;
            console.error('Invalid Data Input - Couldn\'t Parse Object');
        }
        // Tests if the data was valid and successfully passed into an object.
        if (ok) {
            // Loops over all of the raw data.
            for (let i = 0; i < rawData.length; i++) {
                // Tests if all of the expected data is preasent.
                if (rawData[i]['teacher'] == undefined || rawData[i]['category'] == undefined || rawData[i]['subject'] == undefined || rawData[i]['message'] == undefined) {
                    // Sets ok to false and logs the error.
                    ok = false;
                    console.error('Invalid Data Input - Missing Data Points');
                }
            }
        }
        // Tests if the data is still marked as valid.
        if (ok) {
            // Disables the data input, grade selector and submit button.
            inputData.disabled = true;
            gradeSelector.disabled = true;
            submitBtn.disabled = true;
            // Removes the change event listener on the data input section to validate inputs.
            dataInputSection.removeEventListener('change', validateInputs);
            // Loads all of the elements with the class yearLevelSpan into a variable.
            const yearLevelSpans = document.getElementsByClassName('yearLevelSpan');
            // Loops over all of the found elements and sets their text content to the numerical grade selected (7-12).
            for (let i = 0; i < yearLevelSpans.length; i++) {
                yearLevelSpans[i].textContent = gradeSelector.value.split(' ')[1];
            }
            // Declares a variable with all of the categories that could be removed as irrelevant.
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
            // Removes the relevant categories from the irrelevant categories object.
            if (gradeSelector.value == 'Year 7' || gradeSelector.value == 'Year 8' || gradeSelector.value == 'Year 9') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Junior Schooling'), 1);
            } else if (gradeSelector.value == 'Year 10' || gradeSelector.value == 'Year 11' || gradeSelector.value == 'Year 12') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Senior Schooling'), 1);
            }
            irrelevantCategories.splice(irrelevantCategories.indexOf(gradeSelector.value), 1);
            // Loops over all of the raw data.
            for (let i = 0; i < rawData.length; i++) {
                // Declares a current data variable and loads the current itiration of rawData into it.
                let currentData = rawData[i];
                // Updates the teacher data point to exclude their username.
                currentData.teacher = currentData.teacher.split(' (')[0];
                // Updates the category data point to exclude its number.
                currentData.category = currentData.category.split('. ')[1];
                // Declares a variable to hold the relevance of the current itiration of data.
                let relevant = true;
                // Loops over the irrelevant categories and tests if the current category matches any of them, setting relevant to false if a match is found.
                for (let x = 0; x < irrelevantCategories.length; x++) {
                    if (currentData.category == irrelevantCategories[x]) {
                        relevant = false;
                        break;
                    }
                }
                // Tests and removes the notice if its subject includes a reference to DIAL.
                let lowerCaseSub = currentData.subject.toLowerCase();
                if (lowerCaseSub.includes('dial') || lowerCaseSub.includes('drop in and learn') || lowerCaseSub.includes('drop in & learn')) {
                    relevant = false;
                }
                // Adds a relevant property to the data, set to the relevant variable.
                currentData.relevant = relevant;
                // Adds a highlight property to the data, set to the current new property.
                currentData.highlight = currentData.new;
                // Pushes the current data to the processed data array.
                processedData.push(currentData);
            }
            // Shows the postSubmitControls.
            postSubmitControls.style.display = 'block';
        } else {
            // If the data was not 'ok', an error message is shown and an input event listner added to the inputData element to hide the error again.
            invalidDataError.style.display = 'block';
            inputData.addEventListener('input', () => invalidDataError.style.display = 'none');
        }
    });

    // Adds an event listener to the create powerpoint button (in the dialog box).
    createPowerPointBtn.addEventListener('click', () => {
        // Declares an object with the default colours.
        const colours = {back: '2f3437', text: 'e6e6e6'};
        // Updates the colours to the ones inputed if the custom colours checkbox is checked.
        if (pptCustomColours.checked) {
            colours.back = pptBackColour.value;
            colours.text = pptTextColour.value;
        }
        // Creates a powerpoint presentation and loads the default title into a variable.
        let pres = powerpointFunctions.createPresentation();
        let title = pptTitlesById.default();
        // Declares a variable to add a title page.
        const setPptTitlePage = () => {
            // Declares a variable for the slide.
            let slide;
            // Tests if the include title page checkbox is checked.
            if (includeTitlePage.checked) {
                // Gets the id of the selected powerpoint title.
                const titleId = selectedPptTitle().id;
                // Tests if the title page is meant to be a blank slide.
                if (titleId == 'blankSlide') {
                    // Adds a blank slide to the presentation.
                    slide = powerpointFunctions.createSlide(pres, false, colours);
                } else {
                    // If the slide is not meant to be blank, the title is fetched, a slide is created and a textbox with the title is added.
                    title = pptTitlesById[titleId]();
                    slide = powerpointFunctions.createSlide(pres, includeLogo.checked, colours);
                    powerpointFunctions.createTextBox(slide, title, false, 60, 1, '50%', 'center', true);
                }
            }
        };
        // Adds a title page.
        setPptTitlePage();
        // Loops over the processed data.
        for (let i = 0; i < processedData.length; i++) {
            // Tests if the current data is marked as relevant.
            if (processedData[i].relevant) {
                // Creates a slide.
                let slide = powerpointFunctions.createSlide(pres, includeLogo.checked, colours);
                // Adds a textbox with the subject.
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
                // Adds a textbox with the category and teacher.
                powerpointFunctions.createTextBox(slide, processedData[i]['category'] + '  -  ' + processedData[i]['teacher'], false, 18, 1, 1.6, 'center', false);
                // Adds a textbox with the message.
                powerpointFunctions.createTextBox(slide, processedData[i]['message'], false, 14, 1, ((processedData[i]['message'].length < 600) ? 2.7 : 3.5), 'center', false);
            }
        }
        // Adds another title page at the end.
        setPptTitlePage();
        // Downloads the file to the user's computer named with the title.pptx.
        pres.writeFile(title + '.pptx');
    });

    // Adds a click event listener to the view data button.
    viewDataNewPage.addEventListener('click', () => {
        // Adds the proccessed data to session storage and opens the page in a new tab.
        window.sessionStorage.setItem('noticesDataDisplay', JSON.stringify(processedData));
        window.open('./view-data.html', '_blank');
    });
});