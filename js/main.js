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

    processHideControls()

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

    window.addEventListener('resize', () => {
        bubbles.updateBoundaries();
        rain.startRain(settings.isRainAnimation);
        processHideControls();
    });

    console.log(`Icon by https://www.deviantart.com/thesnakeedit`);
    console.log('Cursor by Ivan Abirawa - Flaticon');


    // -----------------------------------------------------------------------------------


    function processHideControls() {
        const hideShowBtn = document.querySelector('.toggle-music-controller-btn');
        if (hideShowBtn && !hideShowBtn.classList.contains('listener-added')) {
            hideShowBtn.addEventListener('click', () => {
                hideShowBtn.classList.toggle('showed');
                document.querySelector('.header').classList.toggle('showed');
                hideShowBtn.classList.add('listener-added');
                bubbles.updateBoundaries();
            })
        }
    }

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
         <div class="settings-section-title">Background</div>
         <div class="settings-bgc">
           <button class="theme-thumb" id="forest" type="button"></button>
           <button class="theme-thumb" id="window" type="button"></button>
           <button class="theme-thumb" id="leaves" type="button"></button>
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Colors</div>
         <div class="settings-game-colors">
     
                <div class="settings__colors-wrap">
                    Bubbles <button class="settings__color-btn" id="selectBubbleColorBtn"></button>
                </div>
       
       
                <div  class="settings__colors-wrap">
                    Bubble burst <button class="settings__color-btn" id="selectBubbleBurstColorBtn"></button>
                </div>
         
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Speed</div>
         <div class="settings-game-speed">
           <input class="speed_slider" type="range" min="0" max="7" step="1" value="${settings.bubbleSpeed}">
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Rain animation</div>
         <div class="settings-rain-animation">
         ${rain.getHTMLBtns()}
         </div>
    </div>

    <div class="settings-section music">
        <div class="settings-section-title">Volume</div>
        <input class="volume" type="range" min="0" max="100" step="1" value="${settings.audio.volume}">
    </div>

    <div class="settings-section volume">
       <div class="settings-section-title">Music</div>
       <div class="settings-section-volume">
          <button class="btn swap ${settings.audio.isSwapModeOn ? 'active' : ''}">mix</button>
          <button class="btn loop ${settings.audio.isRepeatModeOn ? 'active' : ''}">loop</button>
       </div>
    </div>


    <div class="settings-section">
        <div class="settings-section-title">Playlist</div>
          ${music.getPlaylist()}
        </div>
       </div>
    </div>`;

        document.querySelector('.theme').append(div);

        document.querySelector('#selectBubbleColorBtn').style.backgroundColor = bubbles.bubbleBgc;
        document.querySelector('#selectBubbleBurstColorBtn').style.backgroundColor = bubbles.bubbleBurstBgc;

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
            rain.startRain(true);
        });
        document.querySelector('#rainOffBtn').addEventListener('click', () => {
            document.querySelector('#rainOnBtn').classList.remove('active');
            document.querySelector('#rainOffBtn').classList.add('active');
            rain.stopRain();
        })

        document.querySelector('.settings-body .volume')
            .addEventListener('input', () => { music.setVolume(document.querySelector('.settings-body .volume').value / 100) });

        document.querySelector('.settings-body .swap')
            .addEventListener('click', () => music.onSwapModeHandler());

        document.querySelector('.settings-body .loop')
            .addEventListener('click', () => music.onRepeatModeHandler())


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

        document.querySelector('#selectBubbleColorBtn').addEventListener('click', (evt) => {
            if (document.querySelector('#selectBubbleColorBtn').classList.contains('active')) {
                document.querySelector('#select-color-canvas').remove();
                document.querySelector('#selectBubbleColorBtn').classList.remove('active');
                return;
            }
            document.querySelector('#selectBubbleBurstColorBtn').classList.remove('active');
            document.querySelector('#selectBubbleColorBtn').classList.add('active');
            createCanvas(evt);
        });

        document.querySelector('#selectBubbleBurstColorBtn').addEventListener('click', (evt) => {
            if (document.querySelector('#selectBubbleBurstColorBtn').classList.contains('active')) {
                document.querySelector('#select-color-canvas').remove();
                document.querySelector('#selectBubbleBurstColorBtn').classList.remove('active');
                return;
            }
            document.querySelector('#selectBubbleColorBtn').classList.remove('active');
            document.querySelector('#selectBubbleBurstColorBtn').classList.add('active');
            createCanvas(evt);
        })
    }

    function createCanvas(evt) {
        if (document.querySelector('#select-color-canvas')) {
            document.querySelector('#select-color-canvas').remove();
        }
        let div = document.createElement('div');
        div.innerHTML = '<canvas id="select-color-canvas"></canvas>';
        const target = evt.target;
        target.after(div);
        const canvas = document.querySelector('#select-color-canvas');
        const w = 234;  // размеры картинки палитры
        const h = 199;  // размеры картинки палитры
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = './img/palitra.png';
        image.onload = function () {
            ctx.drawImage(image, 0, 0, image.width, image.height);
        }
        canvas.onclick = (e) => handleCanvasColor(e, target, ctx);
    }

    function handleCanvasColor(e, target, ctx) {
        const x = e.offsetX;
        const y = e.offsetY;
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
        target.style.backgroundColor = pixelColor;
        if (target.id === 'selectBubbleColorBtn') {
            bubbles.changeBubbleColor(pixelColor);
        } else if (target.id === 'selectBubbleBurstColorBtn') {
            bubbles.changeBubbleBurstColor(pixelColor);
        }

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
            theme: "forest",
            bubbleSpeed: 3,
            isRainAnimation: true,
            audio: {
                volume: 0.5,
                isRepeatModeOn: false,
                isSwapModeOn: false
            },
            bubbleColor: '#66CCFF',
            bubbleBurstColor: '#336699',

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