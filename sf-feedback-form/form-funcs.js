const getFormDataAsObject = formId => {
    // This function returns the object of form data from within the form with the id given.
    // Tests if the form id is null, nothing in returned.
    if (formId == null) return;
    // Gets the form by id.
    const form = document.getElementById(formId);
    // Collects all of the input elements from within the form.
    const inputs = [
        ...form.getElementsByTagName('input'),
        ...form.getElementsByTagName('select'),
        ...form.getElementsByTagName('textarea')
    ];
    // Declares the final form data object.
    const formData = {};
    // Loops over all of the inputs.
    for (input in inputs) {
        // Selects the current input.
        const currentInput = inputs[input];
        // Continues if the input element is a button or is disabled.
        if ((currentInput.tagName == 'INPUT' && (currentInput.type == 'button' || currentInput.type == 'submit')) || currentInput.disabled == true) {
            continue;
        }
        // If the input is a checkbox, its 'checked' value is added to the formData object under the current input's 'name' value and continues.
        if (currentInput.tagName == 'INPUT' && currentInput.type == 'checkbox') {
            formData[currentInput.name] = currentInput.checked;
            continue;
        }
        // If the input is a radio button and it is checked, its value is added to the formData object under its name.
        if (currentInput.tagName == 'INPUT' && currentInput.type == 'radio') {
            if (currentInput.checked) {
                formData[currentInput.name] = currentInput.value;
            }
            continue;
        }
        // If the loop has reached this point, the current input's 'value' value is added to the formData object under the input's name 'value'.
        formData[currentInput.name] = currentInput.value;
    }
    // Adds Google Form Data.
    formData.fvv = 1;
    formData.draftResponse = [null,null,"-138503052410075074"];
    formData.pageHistory = 0;
    formData.fbzx = -138503052410075074
    // Returns the formData object created.
    return formData;
};

const postFormData = (url, formId, successResponse, serverErrorRes, validate) => {
    // Tests if the values to be submited are valid. If not, the appropriate fail response is executed by the function.
    if (validateSubmit() || validate === false) {
        // If the inputs are valid, the data is posted in a fetch.
        fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getFormDataAsObject(formId))
        }).then(res => {
            // The text is extracted from the promise response.
            // This is done within the previous '.then' so that the rest of the function still has access to the whole response.
            res.text()
            .then(returnedHtml => {
                // Once the response html has been loaded, the main element is found.
                const main = document.getElementsByTagName('main')[0];
                if (res.status != 500) {
                    // If the resoponse status is not 500, the 'main' element is hidden.
                    main.classList.add('hide');
                    // After 250ms, the html returned replaces that of the page and is shown again.
                    // The pause is in place so the CSS can fade the 'main' element.
                    setTimeout(() => {
                        main.innerHTML = '';
                        main.insertAdjacentHTML('afterbegin', returnedHtml);
                        main.classList.remove('hide');
                        if (res.status == 401 || res.status == 403) {
                            // If the status is 401 or 403, the 'startRedirect' function is called, defined in 'redirect.js'.
                            startRedirect();
                        } else if (res.status == 200 && typeof successResponse == 'function') {
                            // If the status is 200 and the successResponse variable is a function, the successResponse function is executed.
                            successResponse();
                        }
                    }, 250);
                } else {
                    // If the status is 500, it tests if the serverErrorRes variable is a function.
                    if (typeof serverErrorRes == 'function') {
                        // If the serverErrorRes variable is a function, it is executed.
                        serverErrorRes();
                    } else {
                        // If no serverErrorRes function was inputed, the returned html is added to the top of the page, unhidden, and scrolled into view as a default response.
                        main.insertAdjacentHTML('afterbegin', returnedHtml);
                        document.getElementById('errorMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
                        document.getElementById('errorMessage').classList.remove('hide');
                    }
                }
            });
        });
    }
};