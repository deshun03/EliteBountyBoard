const missionInput = document.querySelector(".mission-input");
const addMission = document.querySelector(".add-mission");
const taskList = document.querySelector(".task-list");
const rileySprite = document.querySelector("#riley-sprite-image");
const teleportSound = new Audio("./audio/dark-teleport-audio.mp3");
const rainAudio = new Audio ("./audio/rain.mp3");
const rainToggle = document.querySelector("#rain-toggle");
const musicNext = document.querySelector("#music-next");
const musicPlay = document.querySelector("#music-play");
const musicName = document.querySelector("#music-name")
const moneySound = new Audio("./audio/money-sound.mp3");

const songs = [
    "./audio/cyberpunk-music.mp3",
    "./audio/ghost-step.mp3",
    "./audio/boom-bap.mp3",
    "./audio/slice.mp3",
    "./audio/fade-away.mp3"
];

const songName = [
    "Deadly Force",
    "Ghost Step",
    "Boom Bap",
    "Slice",
    "Fade Away"
];

let currentSong = 0;

const musicAudio = new Audio(songs[currentSong]);
const musicLoop = document.querySelector("#music-loop");


musicLoop.addEventListener("click", function(){
    if(musicAudio.loop){
        musicAudio.loop = false;
        musicLoop.textContent = "Loop: Off";
    }
    else{
        musicAudio.loop = true;
        musicLoop.textContent = "Loop: On"
    }
})

musicNext.addEventListener("click", function(){
    currentSong++;
    if(currentSong>=songs.length){
        currentSong = 0;
    }
    musicAudio.src = songs[currentSong];
    musicAudio.play();

    musicName.textContent = "Now playing: " + songName[currentSong];
})

musicAudio.addEventListener("ended", function(){
    currentSong++;
    if(currentSong>=songs.length){
        currentSong = 0;
    }
    musicAudio.src = songs[currentSong];
    musicAudio.play();
});


rainToggle.addEventListener("click", function(){
    if (rainAudio.paused){
        rainAudio.play();
        rainToggle.textContent = "Rain Audio: On"
    }
    else {
        rainAudio.pause();
        rainToggle.textContent = "Rain Audio: Off"
    }
})

rainAudio.loop = true;
rainAudio.volume = 0.1;
musicAudio.loop = false;
musicAudio.volume = 0.3;

rainAudio.play();


musicPlay.addEventListener("click", function(){
    if(musicAudio.paused){
        musicAudio.play();
        musicPlay.textContent = "Pause";
    }
    else{
        musicAudio.pause();
        musicPlay.textContent = "Play";
    
    }
})


let animation = "idle";
let idleFrame = 1;
let teleportFrame = 1;
let teleportInterval;
let attackFrame = 1;
let attackInterval;
let teleportBack = 1;
let returning = false;
let targetTask;
let originalLeft;
let originalTop;

function playIdle(){
    if (animation !== "idle"){
        return;
    }

    idleFrame++;
    
    if (idleFrame > 5){
        idleFrame = 1;
    }

    rileySprite.src = "./images/idle/" + idleFrame + ".png";
}


function playTeleportDisappear(){
    rileySprite.src = "./images/teleport-to/" + teleportFrame + ".png";
    
    teleportFrame++;
    
    if (teleportFrame > 5){
        clearInterval(teleportInterval);
        teleportFrame = 1;
        rileySprite.style.left = targetTask.offsetLeft -100  + "px";
        rileySprite.style.top = targetTask.offsetTop - 120 + "px";
        animation = "teleport-reappear";
        teleportInterval = setInterval(playTeleportReappear, 150);
    }
}



function playTeleportReappear(){

    rileySprite.src = "./images/teleport-reappear/" + teleportFrame + ".png";

    teleportFrame++;

    if (teleportFrame > 5){
        clearInterval(teleportInterval);
        teleportFrame = 1;

        if (returning === true){
            animation = "idle";
            returning = false;
        }

        else {
            animation = "attack";
            playAttack();
            attackInterval = setInterval(playAttack, 100);
        }
    }
}


function playAttack(){

    rileySprite.src = "./images/attack/" + attackFrame + ".png";

    attackFrame++;

    if (attackFrame > 5){
        clearInterval(attackInterval);

    targetTask.classList.add("slash");

        setTimeout(function(){
        targetTask.remove();
        },500);

        animation = "teleport-back";
        attackFrame = 1;
        teleportInterval = setInterval(playTeleportBack, 150);
    }
}


function playTeleportBack(){

    rileySprite.src = "./images/teleport-back/" + teleportBack + ".png";

    teleportBack++;

    if (teleportBack > 5){
        clearInterval(teleportInterval);

        teleportBack = 1;
         rileySprite.style.left = originalLeft + "px";
        rileySprite.style.top = originalTop + "px";
        
        returning = true;
       
        animation = "teleport-reappear";
        teleportInterval = setInterval(playTeleportReappear, 90);
    }
}


addMission.addEventListener("click", function(){

    const mission = missionInput.value;

    const task = document.createElement("div");
    const missionText = document.createElement("span");
    const completeButton = document.createElement("button");

    if (mission === ""){
        return;
    }

    task.classList.add("task");

    missionText.textContent = mission;
    task.append(missionText);

    completeButton.textContent = "Pending";
    completeButton.addEventListener("mouseenter", function(){
        completeButton.textContent = "Complete";
    });
    
    completeButton.addEventListener("mouseleave", function(){
        completeButton.textContent = "Pending";
    })

    
    completeButton.addEventListener("click", function(){

        targetTask = task;
        originalLeft = rileySprite.offsetLeft;
        originalTop = rileySprite.offsetTop;
        missionText.textContent = "Mission Complete";
        missionText.classList.add("mission-complete");
        moneySound.play();

        teleportSound.play();

        animation = "teleport-disappear";
        teleportFrame = 1;

        teleportInterval = setInterval(playTeleportDisappear, 250);

    });


    task.append(completeButton);
    taskList.append(task);

    missionInput.value = "";
});
setInterval(playIdle, 400);
missionInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addMission.click();
    }

});
