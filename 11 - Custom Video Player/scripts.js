//grab each of our DOM elements that we want to make interactive and store them into variables
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

//this function will be run when user clicks anywhere on the video screen and either play or pause the video, depending on its current state
togglePlay = () => {
    if (video.paused) {
        video.play()
    }
    else {
        video.pause();
    }
}

//if the video is playing, then update the element with class toggle's html to the paused button and vice versa
updateButton = () => {
    const icon = event.currentTarget.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

//this function handles the button's skip interactivity. If the button is clicked then add to the video's current time the value of the button's skip dataset, either forward or backward a few seconds
skip = (event) => {
    video.currentTime += parseFloat(event.currentTarget.dataset.skip);
}

//this function behaves similarly to skip function, taking the video's volume or playback rate property and setting it the html input slider's value that the user changes. Linked to the event listener to listen to this.
handleRangeUpdate = (event) => {
    video[event.currentTarget.name] = event.currentTarget.value;
}

//this function will change the display of the progress bar depending on the video's progress. The percent variable is the video's current progress percentage and we then update the progressBar's styling to reflect that percentage as a percentage of the progress bar's whole
handleProgress = () => {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

//scrub works similarly to handleProgress, except sort of in reverse. It takes the place where user clicked on the progress div as a decimal fraction of the div's entire width and multiplies that by video's total duration giving us a percentage value of what point the video should be on at that progress indicator. It then updates the video's time to that click percentage
scrub = (event) => {
    const scrubTime = (event.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}

//this function handles the manual scrolling through the progress bar to dynamically change the video's position. The mousedown variable must be true, this happens when the user has mousedown on the progressBar (done with event listener) and then runs the scrub function to update the video's position
progressManualScroll  = (event) => {
    mousedown && scrub(event);
}

let mousedown = false;
//event listeners here
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
progress.addEventListener('click', scrub);
//these three are all necessary to run the smooth scrolling through the progress bar to update the video's position. Mousemove will change the video's position so long as their mouse is down, which is an event listener itself that updates the variable needed for progressManualScroll to fire
progress.addEventListener('mousemove', progressManualScroll);
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);