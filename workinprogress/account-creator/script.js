var completion = {
    usernameInput: false,
    emailInput: false,
    passwordInput: false
}

document.getElementById("signinbutton").classList.add('disabled');

function verifyInput(crit1, crit2, crit3, input) {
    if (!input) {
        return '-1';
    }

    const errors = [];
    if (!crit1.test(input)) {
        errors.push('1');
    }
    if (!crit2.test(input)) {
        errors.push('2');
    }
    if (!crit3.test(input)) {
        errors.push('3');
    }

    return errors.length === 0 ? '0' : errors.join('');
}

function updateField(field, message, success = true, blank = false) {
    console.log(`Updating field ${field.id} with message: ${message}, success: ${success}, blank: ${blank}`);
    field.textContent = success ? (blank ? `${message}` : `\u2714 ${message}`) : `\u2717 ${message}`;
    field.style.color = success ? 'black' : 'darkred';
    field.style.fontWeight = success ? 'normal' : 'bold';
}


function verifyCriteria(param) {
    const input = document.getElementById(param.inputId);
    const returnCode = verifyInput(param.crits[0], param.crits[1], param.crits[2], input.value);

    const fields = [
        { id: `${param.fieldId}1`, message: `${param.messages[0]}`},
        { id: `${param.fieldId}2`, message: `${param.messages[1]}`},
        { id: `${param.fieldId}3`, message: `${param.messages[2]}`}
    ];

    completion[`${param.inputId}`] = returnCode === '0' ? true: false;
    input.style.borderColor = returnCode === '0' ? 'lime' : 'red';
    
    let button = document.getElementById("signinbutton")
    let condition = (completion.usernameInput & completion.passwordInput & completion.emailInput)
    condition ? button.classList.add('enabled') : button.classList.remove('enabled');

    if (returnCode === '-1') {
        input.style.borderColor = "";
        fields.forEach((field, index) => {
            updateField(document.getElementById(field.id), `${index + 1}. ${field.message}`, true, true);
        });
        return;
    }

    fields.forEach(field => {
        const isError = returnCode.includes(field.id[field.id.length - 1]);
        updateField(document.getElementById(field.id), `${field.message}`, !isError);
    });
}

function verifyUsername() {
    const usernameCriteria = {
        fieldId: "userField",
        messages: [
            "Between 3-20 Characters In Length",
            "Only Contains Valid Characters",
            "Not Taken by Another User"
        ],
        crits: [
            /^.{3,20}$/,
            /^[A-Za-z0-9\-\._]+$/,
            /^(?!xman10110$).*/
        ],
        inputId: "usernameInput"
    };
    usernameCriteria.inputId
    verifyCriteria(usernameCriteria);
}

function verifyEmail() {
    const emailCriteria = {
        fieldId: "emailField",
        messages: [
            "Correct E-Mail Format",
            "Only Contains Valid Characters",
            "Not Linked to a Current Account"
        ],
        crits: [
            /^\S+@\S+\.\S+$/,
            /^[A-Za-z0-9@.]+$/,
            /^(?!xanderkerr09@gmail\.com$).*$/
        ],
        inputId: "emailInput"
    };
    
    verifyCriteria(emailCriteria);
}

function verifyPassword() {
    const passwordCriteria = {
        fieldId: "passwordField",
        messages: [
            "Between 8-64 Characters In Length",
            "Contains Uppercase and Lowercase Letters",
            "Contains At Least 1 Number and 1 Symbol"
        ],
        crits: [
            /^.{8,64}$/,
            /^(?=.*[a-z])(?=.*[A-Z]).+$/,
            /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/
        ],
        inputId: "passwordInput"
    };
    
    verifyCriteria(passwordCriteria);
}
