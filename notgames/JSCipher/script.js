function cipherText() {
    var validCipher = /^(?=.*[2-9])[a-z0-9]+$/;
    var input = document.getElementById("cipherInput").value;

    // Tests to ensure the value is a valid cipher
    if(!validCipher.test(input)){
        output("This isn't a valid cipher!")
        return
    }
    // Find the key for the cipher
    var key = parseInt(input.match(/\d/))
    // Remove the beginning garbage, number garbage, and any ending garbage
    var rawCipher = input.replace(/^[^\d]*(\d+)/, '')
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
        '0zero0': '0',
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
        '0': ' '
    };
    const regex = new RegExp(Object.keys(patterns).join('|'), 'g');
    const spaceregex = new RegExp(Object.keys(spacePattern).join('|'), 'g');
    rawCipher =  rawCipher.replace(regex, matched => patterns[matched]);
    rawCipher =  rawCipher.replace(spaceregex, matched => spacePattern[matched]);
    output(rawCipher)
}

function output(outputText) {
    document.getElementById("cipherOutput").textContent = outputText; // outputs the output variable
}
