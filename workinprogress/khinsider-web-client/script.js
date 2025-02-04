const importButton = document.getElementById("htmlFilePickerButton");
const htmlFilePicker = document.getElementById("htmlFilePicker");
const buttonHeader = document.getElementById("buttonHeader");
const audioPlayer = document.getElementById("audioPlayer");
const songTable = document.getElementById('songTable');
const songContainer = document.getElementById('songContainer');
const albumArtImage = document.getElementById('albumArt');

let currentSong;
let currentAlbum;

importButton.addEventListener('click', () => {
    htmlFilePicker.click();
})

audioPlayer.addEventListener('ended', () => {
    currentAlbum.songList[currentSong.songIndex].playSongButton.click();
})

htmlFilePicker.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
        const htmlString = readerEvent.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html')

        importAlbum(convertDOMtoAlbum(doc));
    }

    reader.readAsText(file);
})

class Song {
    constructor(cdNumber, trackNumber, songTitle, downloadURL, songDuration, songIndex) {
        this.cdNumber = cdNumber;
        this.trackNumber = trackNumber;
        this.songTitle = songTitle;
        this.downloadURL = downloadURL;
        this.songDuration = songDuration;
        this.playSongButton = null;
        this.songIndex = songIndex;
    }
}

class Album {
    constructor(name, albumArt, songList)
    {
        this.name = name;
        this.albumArt = albumArt;
        this.songList = songList;
    }
}

function convertDOMtoAlbum(khinsider)
{
    const beginningURL = "https://eta.vgmtreasurechest.com/soundtracks/";

    const clickableRows = khinsider.getElementsByClassName('clickable-row')
    const songArray = [];
    let freakyString = khinsider.querySelectorAll('script')[5].textContent
    freakyString = freakyString.substring(freakyString.indexOf("audioplayerAction") + 17, freakyString.indexOf("canPlayType"));
    const songIDs = freakyString.match(/(?<=\|)[a-z]{10}(?=\|)/g).reverse();
    let songIndex = 0;
    for(let i = 0; i < clickableRows.length; i++)
    {
        const currentRow = clickableRows[i]
        if(currentRow.hasAttribute("align")) continue;
        const songTitle = currentRow.children[0].textContent;

        let downloadURL = currentRow.children[0].getAttribute('href');
        for(let j = 0; j < 3; j++)
        {
            downloadURL = downloadURL.substring(downloadURL.indexOf('/') + 1);
        }
        downloadURL = downloadURL.substring(0, downloadURL.lastIndexOf('.'));
        downloadURL = beginningURL + downloadURL.substring(0, downloadURL.indexOf("/")) + "/" + songIDs[songArray.length] + downloadURL.substring(downloadURL.indexOf("/")) + ".flac";
        downloadURL = decodeURIComponent(downloadURL);

        let trackNumber = 0;
        let cdNumber = 0;
        let songDuration = currentRow.nextElementSibling.textContent;
        if(currentRow.previousElementSibling.style.paddingRight === "8px")
        {
            trackNumber = currentRow.previousElementSibling.textContent.slice(0, -1);
            if(!currentRow.previousElementSibling.previousElementSibling.hasAttribute("title"))
            {
                cdNumber = currentRow.previousElementSibling.previousElementSibling.textContent;
            }
        }
        songIndex++;
        songArray.push(new Song(cdNumber, trackNumber, songTitle, downloadURL, songDuration, songIndex));
    }

    const albumName = khinsider.querySelector('h2').textContent;
    const albumArt = khinsider.querySelector('img').getAttribute('src').replace("/thumbs/", "/");

    currentAlbum = new Album(albumName, albumArt, songArray)
    return currentAlbum
}

function importAlbum(newAlbum)
{
    albumArtImage.src = newAlbum.albumArt;
    albumArtImage.style.display = "block";
    newAlbum.songList.forEach(song => {
        playSong(song);
    });

    buttonHeader.textContent = "Current Album: " + newAlbum.name;
    importButton.style.display = "none";
    audioPlayer.style.display = "inline";
    songTable.style.display = "";
}

function playSong(song)
{
    let newSongButton = document.createElement("button");
    newSongButton.classList.add("songButton")
    newSongButton.textContent = song.songTitle;
    newSongButton.addEventListener('click', () => {
            document.querySelector(".playingSong")?.classList.remove("playingSong")
            audioPlayer.src = song.downloadURL;
            currentSong = song
            newSongButton.classList.add("playingSong");
            
    })

    let newRow = document.createElement('tr');
    let cdVal = document.createElement('td'); cdVal.textContent = song.cdNumber; newRow.appendChild(cdVal)
    let trackVal = document.createElement('td'); trackVal.textContent = song.trackNumber; newRow.appendChild(trackVal)
    let nameVal = document.createElement('td'); nameVal.appendChild(newSongButton); newRow.appendChild(nameVal);
    let durationVal = document.createElement('td'); durationVal.textContent = song.songDuration; newRow.appendChild(durationVal)
    song.playSongButton = newSongButton
    songTable.appendChild(newRow)
}