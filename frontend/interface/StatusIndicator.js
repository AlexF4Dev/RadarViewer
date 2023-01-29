const display = document.querySelector('.ready-indicator-timer');

var currentInterval;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    return setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "Updating In " + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }
    }, 1000);
}

ipcRenderer.on('etu', (_, time) => {
    console.log(time)
    clearInterval(currentInterval);
    currentInterval = startTimer(time, display);
})