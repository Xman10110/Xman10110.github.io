let secretKey = ''
let time = ''


function updateVariables() {
    secretKey = document.getElementById('secretKeyBox').value
    time = document.getElementById('timePicker').value
}

function newPassword(request) {
    let button1 = document.getElementById('button1')
    let button2 = document.getElementById('button2')
    button1.disabled = true
    button2.disabled = true
    updateVariables()
    let statusElement = document.getElementById('buttonKeyMessage')
    let defaultStatusMessage = statusElement.textContent
    statusElement.textContent = 'Awaiting Response...'
    statusElement.style.color = 'yellow'
    let delayString = calculateDelay() ? `&delay=${calculateDelay()}` : ''
    console.log(delayString)
    fetch(`http://xman.ddns.us:3000?secret=${secretKey}&request=${request}${delayString}/`).then(response => {
        switch(response.status) {
            case 403:
                let element = document.getElementById('secretKeyMessage')
                let oldText = element.textContent
                element.textContent = 'The secret key entered is incorrect!'
                element.style.color = 'red'
                statusElement.textContent = defaultStatusMessage
                statusElement.style.color = ''
                setTimeout(() => {
                    element.textContent = oldText
                    element.style.color = ''
                    button1.disabled = false
                    button2.disabled = false
                }, 3000)
                return
            case 200:
                statusElement.textContent = calculateDelay() ? 'Action successfully scheduled!' : 'Password successfully changed!'
                statusElement.style.color = 'green'
                setTimeout(() => {
                    statusElement.textContent = defaultStatusMessage
                    statusElement.style.color = ''
                    button1.disabled = false
                    button2.disabled = false
                }, 3000)
                return response.text()
            }
    }).then(data => {
        if(data) {
            updatePassword(data)
        }
    })
}

let currentPassword = ''
function updatePassword(newPassword) {
    if(calculateDelay()) {
        return
    }
    document.getElementById('copyButton').disabled = false
    let passwordElement = document.getElementById('passwordDisplay')
    passwordElement.textContent = 'Password: ' + newPassword
    currentPassword = newPassword
}

function copyButton() {
    navigator.clipboard.writeText(currentPassword)
    let element = document.getElementById('copyButton')
    element.textContent = 'Copied!'
    setTimeout(() => {
        element.textContent = 'Copy!'
    }, 3000)
}

function calculateDelay() {
    // Get the user-selected time from the input
    var selectedTime = document.getElementById("timePicker").value;
    if(!selectedTime) {
        return
    }

    // Create a Date object for the current date and time
    var currentDate = new Date();

    // Parse the selected time string and set the date part to the current date
    var selectedTimeDate = new Date(currentDate.toDateString() + " " + selectedTime);

    // Calculate the delay in milliseconds
    var delay = selectedTimeDate - currentDate;

    if(delay < 0) {
        delay += 24 * 60 * 60 * 1000
    }

    return delay
}

function resetButton() {
    document.getElementById("timePicker").value = ""
}