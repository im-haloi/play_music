console.log("Hello Haloi!")

let songIndex = 6;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let timestamps = Array.from(document.getElementsByClassName('timestamp'));
let volumeControl = document.getElementById('volumeControl');
let songs = [
    {songName: "Meri Khamoshi Hai", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Namami Shamishan", filePath: "songs/2.mp3", coverPath: "covers/2.png"},
    {songName: "Azad", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "The Kapi Dance", filePath: "songs/4.mp3", coverPath: "covers/4.png"},
    {songName: "Shri Krishna Flute", filePath: "songs/5.mp3", coverPath: "covers/5.jpg"},
    {songName: "Shir Krishna Govinda Hare Murari", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Cold Heart - Dua Lipa", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
]

let banner = document.getElementById('banner'); 
banner.src = songs[songIndex].coverPath;

audioElement.src = songs[songIndex].filePath;
masterSongName.innerText = songs[songIndex].songName;
//banner.src = songs[songIndex].coverPath;
const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Function to get the duration of each song
const fetchSongDuration = (song, callback) => {
    const tempAudio = new Audio(song.filePath);
    tempAudio.addEventListener('loadedmetadata', () => {
        callback(tempAudio.duration);
    });
};

volumeControl.addEventListener('input', () => {
    audioElement.volume = volumeControl.value / 100;
});

// Update each song item with the cover, name, and duration
songItems.forEach((element, i) => { 
    element.getElementsByTagName("img")[0].src = songs[i].coverPath; 
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;

    // Fetch and format the duration dynamically
    fetchSongDuration(songs[i], (duration) => {
        const formattedDuration = formatTime(duration);
        element.getElementsByClassName("timestamp")[0].innerText = formattedDuration;
    });
});

const updateSongItemPlayButton = (index, isPlaying) => {
    const songItemPlayButton = document.getElementById(index);
    if (isPlaying) {
        songItemPlayButton.classList.remove('fa-play-circle');
        songItemPlayButton.classList.add('fa-pause-circle');
    } else {
        songItemPlayButton.classList.remove('fa-pause-circle');
        songItemPlayButton.classList.add('fa-play-circle');
    }
};

const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    })
}

// Handle play/pause click
masterPlay.addEventListener('click', ()=>{
    if(audioElement.paused || audioElement.currentTime<=0){
        banner.src = songs[songIndex].coverPath;
        updateSongItemPlayButton(songIndex, true);
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    }
    else{
        updateSongItemPlayButton(songIndex, false);
        makeAllPlays();
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
})

audioElement.addEventListener('timeupdate', () => {
    const progress = audioElement.currentTime;
    myProgressBar.max = audioElement.duration;
    myProgressBar.value = progress;

    const tl = audioElement.duration - progress;
    const timeLeftElement = document.querySelector('.time_left'); // Assuming there's only one element with this class
    if (timeLeftElement) {
        timeLeftElement.innerText = formatTime(tl);
    }

    if (progress === audioElement.duration) {
        document.getElementById('next').click(); // Simulate next button click
    }
});


myProgressBar.addEventListener('change', ()=>{
    audioElement.currentTime = myProgressBar.value;
})


Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
    element.addEventListener('click', (e) => {
        const clickedIndex = parseInt(e.target.id);

        if (songIndex !== clickedIndex) {
            // Update the song index to the new clicked song
            songIndex = clickedIndex;

            // Update the audio source to the selected song
            audioElement.src = songs[songIndex].filePath;
            banner.src = songs[songIndex].coverPath;
            // Play the new song and update the duration
            audioElement.play().then(() => {
                const duration = formatTime(audioElement.duration);
                // Find the corresponding timestamp element
                const timestampElement = element.parentElement.querySelector('.timestamp');
                if (timestampElement) {
                    timestampElement.innerText = duration;
                }
            });

            // Update the rest of the UI as needed
            makeAllPlays();
            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            masterSongName.innerText = songs[songIndex].songName;
            gif.style.opacity = 1;
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
        } else if (audioElement.paused) {
            audioElement.play();
            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            masterPlay.classList.remove('fa-play-circle');
            masterPlay.classList.add('fa-pause-circle');
            gif.style.opacity = 1;
        } else {
            audioElement.pause();
            e.target.classList.remove('fa-pause-circle');
            e.target.classList.add('fa-play-circle');
            masterPlay.classList.remove('fa-pause-circle');
            masterPlay.classList.add('fa-play-circle');
            gif.style.opacity = 0;
        }
    });
});



document.getElementById('next').addEventListener('click', ()=>{
    let prev = songIndex;
    if(songIndex>=6){
        songIndex = 0
    }
    else{
        songIndex += 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    banner.src = songs[songIndex].coverPath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    updateSongItemPlayButton(prev, false);
    updateSongItemPlayButton(songIndex, true);
})

document.getElementById('previous').addEventListener('click', ()=>{
    let prev = songIndex;
    if(songIndex<=0){
        songIndex = 6
    }
    else{
        songIndex -= 1;
    }
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    banner.src = songs[songIndex].coverPath;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    updateSongItemPlayButton(prev, false);
    updateSongItemPlayButton(songIndex, true);
})
