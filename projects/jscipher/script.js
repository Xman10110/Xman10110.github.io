function decipherText() {
    var validCipher = /^(?=.*[2-9])[a-z0-9]+$/;
    var input = document.getElementById("decipherInput").value;

    // Tests to ensure the value is a valid cipher
    if(!validCipher.test(input)){
        output("This isn't a valid cipher!")
        return
    }
    // Find the key for the cipher
    var key = parseInt(input.match(/[1-9]/));
    // Remove the beginning garbage, number garbage, and any ending garbage
    var rawCipher = (input.match(/^[^1-9]*(\d.*)$/))[1];
    rawCipher = rawCipher.replace(/[1-9]/g, '')

    let removeKeys = ''
    for (let i = 0; i < rawCipher.length; i++) {
        if ((i + 1) % key == 0) {
            removeKeys += rawCipher[i];
        }
    }
    rawCipher = removeKeys
    // Replace numbers with actual numbers
    const patterns = {
        '0zero0': 'X',
        '0one0': '1',
        '0two0': '2',
        '0three0': '3',
        '0four0': '4',
        '0five0': '5',
        '0six0': '6',
        '0seven0': '7',
        '0eight0': '8',
        '0nine0': '9'
    };
    const spacePattern = {
        '0': ' ',
        'X': '0'
    };
    const regex = new RegExp(Object.keys(patterns).join('|'), 'g');
    const spaceregex = new RegExp(Object.keys(spacePattern).join('|'), 'g');
    rawCipher =  rawCipher.replace(regex, matched => patterns[matched]);
    rawCipher =  rawCipher.replace(spaceregex, matched => spacePattern[matched]);
    output(rawCipher)
}

function output(outputText) {
    document.getElementById("output").textContent = outputText; // outputs the output variable
}

function cipherText() {
    var input = document.getElementById("cipherInput").value;
    var key = document.getElementById("key").value;
    // Make the text to cipher a lowercase alphanumeric string
    input = input.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
    const replace = {
        ' zero': ' 0 ',
        ' one ': ' 1 ',
        ' two ': ' 2 ',
        ' three ': ' 3 ',
        ' four ': ' 4 ',
        ' five ': ' 5 ',
        ' six ': ' 6 ',
        ' seven ': ' 7 ',
        ' eight ': ' 8 ',
        ' nine ': ' 9 '
    };
    const replaceRegex = new RegExp(Object.keys(replace).join('|'), 'g');
    input =  input.replace(replaceRegex, matched => replace[matched]);
    document.getElementById("cipherInput").value = input
    if(input.length < 1){
        output("You must enter a value to cipher!")
        return
    }
    // convert the text to our cipher format (numbers and spaces)
    const numbers = {
        '1': '0one0',
        '2': '0two0',
        '3': '0three0',
        '4': '0four0',
        '5': '0five0',
        '6': '0six0',
        '7': '0seven0',
        '8': '0eight0',
        '9': '0nine0',
        '0': '0zero0'
    };
    const numberRegex = new RegExp(Object.keys(numbers).join('|'), 'g');
    input =  input.replace(numberRegex, matched => numbers[matched]);
    input = input.replace(/\s/g, '0') // whitespace with 0's
    const addLetters = 'abcdefghijklmnopqrstuvwxyz0'
    const addNumbers = '123456789'
    // add beginning junk and the key
    var final = ''

    let junkLoop = rand(3,5)
    while (junkLoop != 0){
        junkLoop -= 1
        final += addLetters[rand(0,26)]
    }
    final += key
    // actually cipher the text
    
    let cipherLoop = 0
    while (cipherLoop != input.length){
        let keyLoop = key - 1
        while (keyLoop != 0){
            if (rand(1,4) == 1){
                final += addNumbers[rand(0,8)]
            }
            else{
                keyLoop -= 1
                final += addLetters[rand(0,26)]
            }

        }
        final += input[cipherLoop]
        cipherLoop += 1
    }
    output(final)

    
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); // floors a float number between min and max
}

function copyText() {
    const copyButton = document.getElementById("copyButton");
    let text = document.getElementById("output").textContent;

    if (copyButton.innerText === "Copy!") {
        copyButton.innerHTML = '<i class="fas fa-copy"></i>Copied!';
        
        navigator.clipboard.writeText(text)
            .then(() => {
            })
            .catch((error) => {
                console.error('Copy failed: ' + error);
            });

        setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>Copy!';
        }, 2000);
    }
}
