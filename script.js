  let timerInterval;
        let startTime = 0;
        let elapsedTime = 0;
        let isRunning = false;
        let laps = [];
        let lapElements = []; // Array to keep track of lap DOM elements

        const timeDisplay = document.getElementById('time-display');
        const startStopBtn = document.getElementById('start-stop');
        const pauseBtn = document.getElementById('pause');
        const resetBtn = document.getElementById('reset');
        const lapBtn = document.getElementById('lap');
        const lapList = document.getElementById('lap-list');
        const clearLapsBtn = document.getElementById('clear-laps');

        function formatTime(milliseconds) {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const ms = milliseconds % 1000;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(Math.floor(ms / 10)).padStart(2, '0')}`;
        }

        function updateDisplay() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;
            timeDisplay.textContent = formatTime(elapsedTime);
        }

        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateDisplay, 10);
                startStopBtn.innerHTML = '<i class="fas fa-stop"></i>';
                pauseBtn.disabled = false;
                resetBtn.disabled = true;
                lapBtn.disabled = false;
            } else {
                stopTimer();
            }
        }

        function stopTimer() {
            isRunning = false;
            clearInterval(timerInterval);
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            pauseBtn.disabled = true;
            resetBtn.disabled = false;
            lapBtn.disabled = true;
        }

        function pauseTimer() {
            if (isRunning) {
                isRunning = false;
                clearInterval(timerInterval);
                startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
                pauseBtn.disabled = true;
                resetBtn.disabled = false;
            }
        }

        function resetTimer() {
            elapsedTime = 0;
            laps = [];
            lapElements = [];
            timeDisplay.textContent = '00:00:00.000';
            lapList.innerHTML = '';
            clearLapsBtn.style.display = 'none';
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            pauseBtn.disabled = true;
            resetBtn.disabled = true;
            lapBtn.disabled = true;
        }

        function recordLap() {
            if (isRunning) {
                laps.push(elapsedTime);
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `<span>Lap ${laps.length}</span><span>${formatTime(elapsedTime)}</span><i class="fas fa-times cross" data-index="${laps.length - 1}"></i>`;
                lapList.appendChild(lapItem);
                lapElements.push(lapItem);
                clearLapsBtn.style.display = 'inline-block';
                // Add event listener for cross
                lapItem.querySelector('.cross').addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    removeLap(index);
                });
            }
        }

        function removeLap(index) {
            // Remove from DOM
            lapElements[index].remove();
            // Remove from arrays
            laps.splice(index, 1);
            lapElements.splice(index, 1);
            // Update indices and DOM
            lapElements.forEach((el, idx) => {
                el.querySelector('.cross').setAttribute('data-index', idx);
                el.querySelector('span:first-child').textContent = `Lap ${idx + 1}`;
            });
            if (laps.length === 0) {
                clearLapsBtn.style.display = 'none';
            }
        }

        function clearAllLaps() {
            laps = [];
            lapElements = [];
            lapList.innerHTML = '';
            clearLapsBtn.style.display = 'none';
        }

        startStopBtn.addEventListener('click', startTimer);
        pauseBtn.addEventListener('click', pauseTimer);
        resetBtn.addEventListener('click', resetTimer);
        lapBtn.addEventListener('click', recordLap);
        clearLapsBtn.addEventListener('click', clearAllLaps);
