let groups = []
let currentGroup = null

function newGroup() {
    let newElement = document.createElement('button')
    groups.push(new Group)
    newElement.textContent = groups[groups.length - 1].name
    newElement.setAttribute('onclick', `changeGroup(${groups.length - 1}); highlightGroupButton(this)`)
    newElement.classList.add('a-group')
    document.getElementById('addGroup').before(newElement)
    groups[groups.length - 1].setElement(newElement)
}

class Group {
    constructor(name, members) {
        this.name = name || `Group ${groups.length + 1}`;
        this.members = members || [];
    }

    addName(name) {
        this.members.push(name)
    }
    removeName(name) {
        const index = this.getNames().indexOf(name);
        if(index == -1) {return}
        this.members.splice(index, 1)
    }
    getNames() {
        let names = []
        this.members.forEach((name) => {
            names.push(name.name)
        });
        return names;
    }
    changeName(name) {
        this.name = name
    }
    setElement(element) {
        this.element = element
    }
}
class Name {
    constructor(name) {
        this.name = name
        this.enabled = true
    }
    setName(name) {
        this.name = name
    }
    setEnabled(boolean) {
        this.enabled = boolean
    }
}

function newName(event) {
    if(currentGroup == null) {return}
    if(event.key != 'Enter') {return}
    const input = document.getElementById('nameInput')
    if(input.value == '') {return}
    if (groups[currentGroup].getNames().includes(input.value)) {
        nameInput.value = ''
        return
    }

    addNameObject(input.value)
    groups[currentGroup].addName(new Name(input.value))
    nameInput.value = ''
    
}

function addNameObject(name) {
    let newNameObject = document.createElement('div')
    newNameObject.classList.add('nameObject')

    let newNameHeader = document.createElement('h2')
    newNameHeader.textContent = name

    let newNameButton = document.createElement('button')
    newNameButton.setAttribute('onclick', 'deleteName(this)')
    newNameButton.textContent = 'X'

    let newNameCheckBox = document.createElement('button')
    newNameCheckBox.setAttribute('onclick', 'checkToggle(this)')
    newNameCheckBox.textContent = '✔'
    newNameCheckBox.classList.add('checkEnabled')

    newNameObject.appendChild(newNameHeader)
    newNameObject.appendChild(newNameCheckBox)
    newNameObject.appendChild(newNameButton)

    document.getElementById('nameList').appendChild(newNameObject)
}

function deleteName(button) {
    groups[currentGroup].removeName(button.previousSibling.previousSibling.textContent)
    button.parentNode.remove()
}

function changeGroup(group) {
    currentGroup = group
    resetNameField()
    clearCenterStage()
    let names = groups[currentGroup].getNames()
    names.forEach(element => {
        addNameObject(element)
    });
}

function resetNameField() {
    let newNameElement = document.createElement('div')
    newNameElement.setAttribute('id', 'nameList')
    document.getElementById('nameList').remove()
    document.getElementById('afterNameField').after(newNameElement)
}

let currentGroupHighlight = null
function highlightGroupButton(button) {
    if(currentGroupHighlight != null) {
        currentGroupHighlight.classList.remove('a-grouphighlight')
    } else {
        document.getElementById('rightNamePanel').classList.remove('hidden')
        document.getElementById('groupNameChangeInput').classList.remove('hidden')
    }
    currentGroupHighlight = button
    button.classList.add('a-grouphighlight')
}

function changeGroupName(event) {
    if(event.key != 'Enter') {return}
    const input = document.getElementById('groupNameChangeInput')
    let newName = input.value
    if(input.value == '') {return}

    groups[currentGroup].changeName(newName)
    groups[currentGroup].element.textContent = newName
    input.value = ''
    input.blur()
}

function stickEvent() {
    clearCenterStage()
    let centerStage = document.getElementById('centerStage')
    let names = groups[currentGroup].getNames()
    let stickCount = names.length
    let colors = ['red', 'orange', 'yellow', 'lime', 'cyan', 'purple']
    let winner = randint(0, names.length - 1)
    let theElement = null
    shuffleArray(colors)

    for(let i=0; i < stickCount; i++){
        let element = document.createElement('div')
        if(i == winner) {
            theElement = element
        }
        element.textContent = names[i]
        element.classList.add('stick')
        element.style.backgroundColor = colors[i % colors.length]
        let translateString = `translate(${randint(-40,40)}vw, ${randint(10,80)}vh)`
        let rotationString = `rotate(${randint(-20, 20)}deg)`
        let secondRotation = `rotate(${randint(-20, 20)}deg)`
        element.style.transform = translateString + ' ' + rotationString
        centerStage.appendChild(element)
        setTimeout(() => {
            element.style.transform = translateString + ' ' + secondRotation
            element.style.opacity = '100%'
        }, 10)
        setTimeout(() => {
            element.style.transform = translateString + ' ' + secondRotation
            element.style.opacity = '50%'
        }, 490)
    }

    setTimeout(() => {
        theElement.style.transform = 'translate(4vw, 42vh) scale(1.5, 1.5)'
        theElement.style.zIndex = '1'
        theElement.style.opacity = '100%'
    }, 500)
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function clearCenterStage() {
    document.getElementById('centerStage').remove()
    let centerStage = document.createElement('div')
    centerStage.id = 'centerStage'
    centerStage.classList.add('centerStage')
    document.getElementById('rightNamePanel').before(centerStage)
}

function checkToggle(check) {
    const checkName = groups[currentGroup].members[groups[currentGroup].getNames().indexOf(check.previousSibling.textContent)]
    console.log(checkName)
    if(check.classList.contains('checkEnabled')) {
        check.classList.remove('checkEnabled')
        check.classList.add('checkDisabled')
        check.textContent = 'X'
        checkName.setEnabled(false)
    } else {
        check.classList.remove('checkDisabled')
        check.classList.add('checkEnabled')
        check.textContent = '✔'
        checkName.setEnabled(true)
    }
}

