function Validator(options) {

    let selectorRules = {};

    function validate(inputElement, rule) {
        let errorMessage;
        let errorElement = inputElement.parentElement.querySelector(options.errorSelector)

        let rules = selectorRules[rule.selector];
        //Go through each rule and check
        //Break if there is error message
        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if(errorMessage) break
        }
        //Create and push rules into selectorRules object
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = ''
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errorMessage
    }

    let formElement = document.querySelector(options.form)
    if (formElement) {
        // Prevent browser deafault when submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            let isFormValid = true;

            //loop through each rule and validate
            options.rules.forEach(function (rule) {
                let inputElement = formElement.querySelector(rule.selector);
                
                let isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            })
            if (isFormValid) {
                console.log('no Error')
            } else {
                console.log('error')
            }

        }
        options.rules.forEach(function (rule) {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            
            let inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                // blur out of input box
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }
                // When user start typing in input box
                inputElement.oninput = function () {
                    let errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }
}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : `This value is not valid`
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : `Entered value is not an email`
        }
    }
}
Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Please enter minimum ${min} characters`
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmedValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmedValue() ? undefined : message || `Incorrect value`
        }
    }
}


