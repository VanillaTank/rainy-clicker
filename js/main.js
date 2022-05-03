window.onload = () => {

    const music = new Music();
    const bubbles = new Bubbles();
    const rain = new Rain();

    let prevSongID = null;
    let wasBubbleStarted = false;

    const audioTrack = document.querySelector('.audio-track');
    const volume = document.querySelector('.volume');
    const swapBtn = document.querySelector('.swap');


    if (!isSettingsInLocalStorage()) {
        showGreetingMsg();
        setDefaultSettings();
        music.setVolume(0.5);
        music.setSwapMode(false);
        rain.startRain(true);
    } else {
        const settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        changeStyle(settings.theme);
        music.setVolume(settings.audio.volume);
        music.setSwapMode(settings.audio.isSwapModeOn);
        music.setRepeatMode(settings.audio.isRepeatModeOn);
        bubbles.startBubbles(settings.bubbleSpeed);
        wasBubbleStarted = true;
        rain.startRain(settings.isRainAnimation);
    }

    const settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));

    audioTrack.addEventListener('click', (event) => { music.changePoint(event.offsetX, audioTrack.offsetWidth) });

    volume.addEventListener('input', () => { music.setVolume(volume.value / 100) });
    swapBtn.addEventListener('click', () => music.onSwapModeHandler());

    document.querySelector('#settingsBtn').addEventListener('click', showSettings);

    document.querySelector('#toggle-music-btn').addEventListener('click', toggleMusic);
    document.querySelector('.loop').addEventListener('click', () => music.onRepeatModeHandler())
    document.querySelector('.back').addEventListener('click', () => music.goToPrevSong());
    document.querySelector('.next').addEventListener('click', () => music.goToNextSong());

    document.querySelector('#toggle-game-btn').addEventListener('click', () => {

        if (document.querySelector('#toggle-game-btn').classList.contains('active')) {
            bubbles.stopBubbles();
            document.querySelector('#toggle-game-btn').classList.remove('active');
            wasBubbleStarted = false;
        }
        else {
            bubbles.startBubbles(settings.bubbleSpeed);
            document.querySelector('#toggle-game-btn').classList.add('active');
            wasBubbleStarted = true;
        }
    })

    const id = music.getRandomID();
    music.setSelectedAudioPath(id);


    window.onblur = () => {
        bubbles.stopBubbles();
        window.onfocus = () => {
            if (wasBubbleStarted) {
                bubbles.startBubbles(settings.bubbleSpeed)
            }
        };
    };


    // window.addEventListener('focusout', () => {
    //     bubbles.stopBubbles();
    //     window.addEventListener('focus', () => {
    //         if (wasBubbleStarted) {
    //             bubbles.startBubbles(settings.bubbleSpeed);
    //         }
    //     })
    // });

    window.addEventListener('resize', () => { bubbles.updateBoundaries() });

    console.log(`Icon by https://www.deviantart.com/thesnakeedit`)


    // -----------------------------------------------------------------------------------

    function isSettingsInLocalStorage() {
        if (!localStorage.getItem('rainy-clicker-settings')) {
            return false;
        }
        return true;
    }

    function showGreetingMsg() {
        const div = document.createElement('div');
        div.classList.add('greeting', 'forest');
        div.innerHTML = `
    <div class='greeting-body'>
       <p>
         Ты устал и надо расслабиться. <br>
         Слушай lofi-музыку, шум дождя и неспешно кликай мышкой (скорость можно настроить в SETTINGS).
       </p>
       <br>
       <p>
         KEEP CALM И ЛОПАЙ ПУЗЫРИКИ
        </p>
       <button class='btn greetingBtn' id="greetingBtn" type='button'>
         OK
       </button>
    </div>
    `;

        document.body.append(div);

        document.querySelector('#greetingBtn').addEventListener('click', () => {
            div.remove();
            bubbles.startBubbles(settings.bubbleSpeed);
            wasBubbleStarted = true;
        })
    }

    function showSettings() {
        const settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        const div = document.createElement('div');
        div.classList.add('settings');
        div.innerHTML = `
    <div class='settings-body'>
     <div class='settings-body-scroll-wrap'>
     <button class='closeBtn closeSettingsBtn' id="closeSettingsBtn" type='button'>
     <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
         <rect y="21.2132" width="30" height="3" transform="rotate(-45 0 21.2132)"/>
         <rect x="21.2131" y="23.3345" width="30" height="3" transform="rotate(-135 21.2131 23.3345)"/>
     </svg>
    </button>

    <div class="settings-section">
         <div class="settings-section-title">Выбор фона</div>
         <div class="settings-bgc">
           <button class="theme-thumb" id="forest" type="button"></button>
           <button class="theme-thumb" id="window" type="button"></button>
           <button class="theme-thumb" id="leaves" type="button"></button>
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Скорость</div>
         <div class="settings-game-speed">
           <input class="speed_slider" type="range" min="0" max="7" step="1" value="${settings.bubbleSpeed}">
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Анимация дождя</div>
         <div class="settings-rain-animation">
         ${rain.getHTMLBtns()}
         </div>
    </div>

    <div class="settings-section">
        <div class="settings-section-title">Playlist</div>
          ${music.getPlaylist()}
        </div>
       </div>
    </div>`;

        document.querySelector('.theme').append(div);

        document.querySelector('#closeSettingsBtn').addEventListener('click', () => {
            div.remove();
        })

        document.addEventListener('keyup', (event) => {
            if (event.key === "Esc" || event.key === "Escape") {
                div.remove();
            }
        })

        settingsHandlers();
    }

    function settingsHandlers() {

        document.querySelector(`#${settings.theme}`).classList.add('active');

        const themeBtns = [...document.querySelectorAll('.theme-thumb')];
        themeBtns.forEach(btn => {
            btn.addEventListener('click', (evt) => {
                themeBtns.forEach(btn => btn.classList.remove('active'));
                document.querySelector(`#${evt.target.id}`).classList.add('active');
                setSettings("theme", evt.target.id, settings);
                changeStyle(evt.target.id);
            })
        });

        const speedSlider = document.querySelector('.speed_slider');
        speedSlider.addEventListener('input', () => {
            bubbles.changeSpeed(speedSlider.value)
        });

        document.querySelector('#rainOnBtn').addEventListener('click', () => {
            document.querySelector('#rainOnBtn').classList.add('active');
            document.querySelector('#rainOffBtn').classList.remove('active');
            rain.startRain(true)
        });
        document.querySelector('#rainOffBtn').addEventListener('click', () => {
            document.querySelector('#rainOnBtn').classList.remove('active');
            document.querySelector('#rainOffBtn').classList.add('active');
            rain.stopRain();
        })


        const musicPlayBtns = [...document.querySelectorAll('.songs-item-start-btn')];
        musicPlayBtns.forEach((el) => {
            el.addEventListener('click', (event) => {
                const currentSongLi = event.target.closest('li');
                const id = currentSongLi.id;
                music.setSelectedAudioPath(id);
                music.toggleStateSong();

                if (prevSongID !== null && prevSongID !== id) {
                    document.querySelector(`#${prevSongID}`).classList.remove('active');
                }

                currentSongLi.classList.toggle('active');

                if (currentSongLi.classList.contains('active')) {
                    document.querySelector('#toggle-music-btn').classList.add('active');
                } else {
                    document.querySelector('#toggle-music-btn').classList.remove('active');
                }

                prevSongID = id;
            })
        })
    }

    function changeStyle(newTheme) {
        document.querySelector('.theme').classList.remove('forest', 'window', 'leaves');
        document.querySelector('.theme').classList.add(newTheme);
    }

    function setSettings(param, value, settings) {
        settings[param] = value;
        localStorage.setItem('rainy-clicker-settings', JSON.stringify(settings));
    }

    function setDefaultSettings() {
        const settings = {
            theme: "leaves",
            bubbleSpeed: 3,
            isRainAnimation: true,
            audio: {
                volume: 0.5,
                isRepeatModeOn: false,
                isSwapModeOn: false
            }
        };

        localStorage.setItem('rainy-clicker-settings', JSON.stringify(settings))
    }

    function toggleMusic() {
        if (document.querySelector('#toggle-music-btn').classList.contains('active')) {
            document.querySelector('#toggle-music-btn').classList.remove('active');
            music.toggleStateSong();
            return;
        }

        document.querySelector('#toggle-music-btn').classList.add('active');
        music.toggleStateSong();
    }
}