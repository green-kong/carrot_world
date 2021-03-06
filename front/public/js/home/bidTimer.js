const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 150;
const ALERT_THRESHOLD = 60;

const COLOR_CODES = {
  info: {
    color: 'green',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};

let TIME_LIMIT = 60;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

let $remainTimeDonut;
let $remainTime;

function onTimesUp() {
  clearInterval(timerInterval);
}

export default function startTimer(time) {
  TIME_LIMIT = time || 60;
  timePassed = 0;
  timeLeft = TIME_LIMIT;

  $remainTimeDonut = document.getElementById('bid-timer-path-remaining');
  $remainTime = document.getElementById('bid-timer-label');

  timerInterval = setInterval(() => {
    timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    $remainTime.innerHTML = formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);

  return timerInterval;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    $remainTimeDonut.classList.remove(warning.color);
    $remainTimeDonut.classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    $remainTimeDonut.classList.remove(info.color);
    $remainTimeDonut.classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const duration = 300;
  const rawTimeFraction = timeLeft / duration;
  return rawTimeFraction - (1 - rawTimeFraction) / duration;
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  $remainTimeDonut.setAttribute('stroke-dasharray', circleDasharray);
}
