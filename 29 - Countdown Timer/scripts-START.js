let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');
const form = document.querySelector('[name = customForm]');

const timer = (seconds) => {
    //start with clearInterval to ensure no overlapping timers
    clearInterval(countdown);
    //this grabs current time from 1970 in milliseconds
    const now = Date.now();
    //we add to it the distance from the time now in milliseconds
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);

    countdown = setInterval(() => {
        //convert the amount of time from then to now into seconds
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        //if seconds hits 0, then end the countdown
        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        //display each time change
        displayTimeLeft(secondsLeft);
    }, 1000);
}

const displayTimeLeft = (seconds) => {
    //take the seconds variable passed in and convert to minutes
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}: ${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display;
    timerDisplay.textContent = display;
}

const displayEndTime = (timestamp) => {
    //timestamp is the time in milliseconds that our timer will end
    //variable below converts those milliseconds into an understandable date
    const end = new Date(timestamp);
    const hour = end.getHours();
    const minutes = end.getMinutes();
    endTime.textContent = `Be back at ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

const startTimer = (event) => {
    //when button is clicked, convert their string value to a number and pass that into the timer
    const seconds = parseInt(event.currentTarget.dataset.time);
    timer(seconds);
}

const userSetsTime = (event) => {
    event.preventDefault();
    //set variable to value user has set on input within form
    const mins = event.currentTarget.minutes.value;
    //ensure the minutes value is converted to seconds 
    timer(mins * 60);
    //reset the value of the input upon submission
    event.currentTarget.reset();
}

buttons.forEach(button => button.addEventListener('click', startTimer));
form.addEventListener('submit', userSetsTime);