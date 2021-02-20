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
    const editDataBtn = document.getElementById('editDataBtn');
    const viewDataNewPage = document.getElementById('viewDataNewPage');
    const clearDataBtn = document.getElementById('clearSavedData');
    const pleaseNote = document.getElementById('pleaseNote');
    const footerImg = document.getElementsByClassName('footer-img')[0];
    
    // Loads all of the edit data elements into variables.
    const editDataSection = document.getElementById('editDataSection');
    const editDataTable = document.getElementById('editDataTable');
    const main = document.getElementsByTagName('main')[0];
    const editDataSaveBtn = document.getElementById('saveEditedData');

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
        default: () => {return processedData.yearLevel + ' Student Notices'},
        yearStudentNotices: () => {return processedData.yearLevel + ' Student Notices'},
        yearNotices: () => {return processedData.yearLevel + ' Notices'},
        yearAssembly: () => {return processedData.yearLevel + ' Assembly'},
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

    // Changes the section of home.html shown on screen.
    const changeShownSection = (show, cb, fade = true) => {
        // Declares a sub-function, so that the response can be changed based on the fade attribute.
        const changeDisplayProperties = () => {
            // Sets the display of the three primary sections to none.
            dataInputSection.style.display = 'none';
            postSubmitControls.style.display = 'none';
            editDataSection.style.display = 'none';
            // Sets the display of the element passed in through show to block.
            show.style.display = 'block';
            // Calls the callback if it is a function.
            if (typeof cb == 'function') {
                cb();
            }
        }
        // Tests what the fade condition is set to and responds appropriately.
        if (fade === false) {
            // Calls the changeDisplayProperties function to change what is shown on screen.
            changeDisplayProperties();
        } else {
            // Hides the main element.
            main.classList.add('hide');
            // Waits for half a second, so that the css can fade it off.
            setTimeout(() => {
                // Calls the changeDisplayProperties function to change what will be shown on screen.
                changeDisplayProperties();
                // Removes the hide class on the main element, meaning the new section is faded on.
                main.classList.remove('hide');
            }, 500);
        }
    }

    // Sets some default starting attributes to elements.
    changeShownSection(dataInputSection, null, false);
    invalidDataError.style.display = 'none';
    submitBtn.disabled = true;
    pptPickColours.style.display = 'none';
    pptTitleDiv.style.display = 'none';
    pptTitleOpts[0].checked = true;
    
    // Declares an object that holds functions to load and save it to and from local storage, and hold that data for quick access.
    const processedData = {
        load: () => {
            processedData.data = JSON.parse(window.localStorage.getItem('processedNoticesData'));
            processedData.yearLevel = window.localStorage.getItem('yearLevel');
            processedData.validDate = window.localStorage.getItem('noticesDataValidDate');
        },
        save: () => {
            window.localStorage.setItem('processedNoticesData', JSON.stringify(processedData.data));
            window.localStorage.setItem('yearLevel', processedData.yearLevel);
            window.localStorage.setItem('noticesDataValidDate', processedData.validDate);
        },
        reset: () => {
            processedData.data = [];
            processedData.yearLevel = null;
            processedData.validDate = null;
            window.localStorage.removeItem('processedNoticesData');
            window.localStorage.removeItem('yearLevel');
            window.localStorage.removeItem('noticesDataValidDate');
        },
        data: [],
        yearLevel: null,
        validDate: null
    };

    // Disables or enables the submit button based on a validation test.
    const validateInputs = () => {
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
            // Adds the disabled class to the data input section.
            dataInputSection.classList.add('disabled');
            // Saves the year level to processedData.
            processedData.yearLevel = gradeSelector.value;
            // Removes the change event listener on the data input section to validate inputs.
            dataInputSection.removeEventListener('change', validateInputs);
            // Loads all of the elements with the class yearLevelSpan into a variable.
            const yearLevelSpans = document.getElementsByClassName('yearLevelSpan');
            // Loops over all of the found elements and sets their text content to the numerical grade selected (7-12).
            for (let i = 0; i < yearLevelSpans.length; i++) {
                yearLevelSpans[i].textContent = processedData.yearLevel.split(' ')[1];
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
            if (processedData.yearLevel == 'Year 7' || processedData.yearLevel == 'Year 8' || processedData.yearLevel == 'Year 9') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Junior Schooling'), 1);
            } else if (processedData.yearLevel == 'Year 10' || processedData.yearLevel == 'Year 11' || processedData.yearLevel == 'Year 12') {
                irrelevantCategories.splice(irrelevantCategories.indexOf('Senior Schooling'), 1);
            }
            irrelevantCategories.splice(irrelevantCategories.indexOf(processedData.yearLevel), 1);
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
                processedData.data.push(currentData);
            }
            // Adds a valid date to processed data and then saves the processed data varaible to local storage.
            processedData.validDate = getStringDate();
            processedData.save();
            // Shows the postSubmitControls.
            changeShownSection(postSubmitControls);
        } else {
            // If the data was not 'ok', an error message is shown and an input event listner added to the inputData element to hide the error again.
            invalidDataError.style.display = 'block';
            inputData.addEventListener('input', () => invalidDataError.style.display = 'none');
        }
    });

    // Adds an event listener to the create powerpoint button (in the dialog box).
    createPowerPointBtn.addEventListener('click', () => {
        // Updates the processed data in the variable.
        processedData.load();
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
        for (let i = 0; i < processedData.data.length; i++) {
            // Tests if the current data is marked as relevant.
            if (processedData.data[i].relevant) {
                // Creates a slide.
                let slide = powerpointFunctions.createSlide(pres, includeLogo.checked, colours);
                // Adds a textbox with the subject.
                powerpointFunctions.createTextBox(slide, processedData.data[i]['subject'], {
                    x: '2%',
                    y: 0.1,
                    align: 'center',
                    bold: true,
                    h: 1.3,
                    w: '96%',
                    fontSize: ((processedData.data[i]['subject'].length <= 50) ? 40 : ((processedData.data[i]['subject'].length <= 75) ? 35 : (processedData.data[i]['subject'].length <= 100) ? 25 : 18)),
                    isTextBox: true,
                    valign: 'middle'
                });
                // Adds a textbox with the category and teacher.
                powerpointFunctions.createTextBox(slide, processedData.data[i]['category'] + '  -  ' + processedData.data[i]['teacher'], false, 18, 1, 1.6, 'center', false);
                // Adds a textbox with the message.
                powerpointFunctions.createTextBox(slide, processedData.data[i]['message'], false, 14, 1, ((processedData.data[i]['message'].length < 600) ? 2.7 : 3.5), 'center', false);
            }
        }
        // Adds another title page at the end.
        setPptTitlePage();
        // Downloads the file to the user's computer named with the title.pptx.
        pres.writeFile(title + '.pptx');
    });

    // Adds a click event listener to the edit data button.
    editDataBtn.addEventListener('click', () => {
        // Updates the data in processed data.
        processedData.load();
        // Loops over the processed notices data.
        for (let i = 0; i < processedData.data.length; i++) {
            // Creates a table row.
            const tr = document.createElement('tr');
            // Creates a table cell, adds a checkbox and appends it to the table row. Checkbox indicative of the relevent field of the data.
            const tdDisplay = document.createElement('td');
            const displayInput = document.createElement('input');
            displayInput.type = 'checkbox';
            displayInput.checked = processedData.data[i].relevant
            displayInput.classList.add('editDataDisplayCheckbox');
            tdDisplay.appendChild(displayInput);
            tr.appendChild(tdDisplay);
            // Creates a table cell, adds some text and appends it to the table row. Text indicative of the category field of the data.
            const tdCategory = document.createElement('td');
            const categoryText = document.createTextNode(processedData.data[i].category);
            tdCategory.appendChild(categoryText);
            tr.appendChild(tdCategory);
            // Creates a table cell, adds a textarea and appends it to the table row. Textarea indicative of the subject field of the data.
            const tdSubject = document.createElement('td');
            const subjectInput = document.createElement('textarea');
            subjectInput.cols = '30';
            subjectInput.rows = '3';
            subjectInput.value = processedData.data[i].subject;
            subjectInput.classList.add('editDataSubjectTextarea');
            tdSubject.appendChild(subjectInput);
            tr.appendChild(tdSubject);
            // Creates a table cell, adds a textarea and appends it to the table row. Textarea indicative of the message field of the data.
            const tdMessage = document.createElement('td');
            const messageInput = document.createElement('textarea');
            messageInput.value = processedData.data[i].message;
            messageInput.cols = '40';
            messageInput.rows = '5';
            messageInput.classList.add('editDataMessageTextarea');
            tdMessage.appendChild(messageInput);
            tr.appendChild(tdMessage);
            // Creates a table cell, adds some text and appends it to the table row. Text indicative of the teacher field of the data.
            const tdTeacher = document.createElement('td');
            const teacherText = document.createTextNode(processedData.data[i].teacher);
            tdTeacher.appendChild(teacherText);
            tr.appendChild(tdTeacher);
            // Creates a table cell, adds a checkbox and appends it to the table row. Checkbox indicative of the highlight field of the data.
            const tdHighlight = document.createElement('td');
            const highlightInput = document.createElement('input');
            highlightInput.type = 'checkbox';
            highlightInput.checked = processedData.data[i].highlight;
            highlightInput.classList.add('editDataHighlightCheckbox');
            tdHighlight.appendChild(highlightInput);
            tr.appendChild(tdHighlight);
            // Appends the table row to the table.
            editDataTable.appendChild(tr);
        }
        // Fades to the edit data section.
        changeShownSection(editDataSection);
    });

    // Adds a click event listener to the submit button on the edit data page.
    editDataSaveBtn.addEventListener('click', () => {
        // Fades to the post submit controls section and sets a callback to save the data.
        changeShownSection(postSubmitControls, () => {
            // Loads all of the table rows (trs) from the edit data table into a variable.
            const trs = editDataTable.getElementsByTagName('tr');
            // Tests that the number of table rows is one more than the length of the processedData.data array.
            if (trs.length-1 == processedData.data.length) {
                // Loops over all of the table rows, until there is only one left.
                for (let i = 0; trs.length > 1; i++) {
                    // Updates the relevant, subject, message and highlight fields in processedData to match the data entered into the inputs.
                    processedData.data[i].relevant = trs[1].getElementsByClassName('editDataDisplayCheckbox')[0].checked;
                    processedData.data[i].subject = trs[1].getElementsByClassName('editDataSubjectTextarea')[0].value;
                    processedData.data[i].message = trs[1].getElementsByClassName('editDataMessageTextarea')[0].value;
                    processedData.data[i].highlight = trs[1].getElementsByClassName('editDataHighlightCheckbox')[0].checked;
                    // Removes the table row.
                    trs[1].remove();
                }
            }
            // Saves the new processed data to local storage.
            processedData.save();
        }, 500);
    });

    // Adds a click event listener to the view data button.
    viewDataNewPage.addEventListener('click', () => {
        // Opens the page in a new tab.
        window.open('./view-data.html', '_blank');
    });

    // Adds a click event listener to the clear data button.
    clearDataBtn.addEventListener('click', () => {
        // Resets the processed data variable and the related data stored in local storage.
        processedData.reset();
        // Reloads the page.
        window.history.go();
    });

    // The saved data is loaded.
    processedData.load();
    if (processedData.data != null && processedData.yearLevel != null && processedData.validDate == getStringDate()) {
        // Sets the input data field's value to the processed data saved and the grade selector to the saved one.
        inputData.value = JSON.stringify(processedData.data);
        gradeSelector.value = processedData.yearLevel;
        // Disables the data input, grade selector and submit button.
        inputData.disabled = true;
        gradeSelector.disabled = true;
        submitBtn.disabled = true;
        // Adds the disabled class to the data input section.
        dataInputSection.classList.add('disabled');
        // Removes the change event listener on the data input section to validate inputs.
        dataInputSection.removeEventListener('change', validateInputs);
        // Loads all of the elements with the class yearLevelSpan into a variable.
        const yearLevelSpans = document.getElementsByClassName('yearLevelSpan');
        // Loops over all of the found elements and sets their text content to the numerical grade selected (7-12).
        for (let i = 0; i < yearLevelSpans.length; i++) {
            yearLevelSpans[i].textContent = processedData.yearLevel.split(' ')[1];
        }
        // Shows the postSubmitControls.
        changeShownSection(postSubmitControls, null, false);
    } else {
        processedData.reset();
    }
});