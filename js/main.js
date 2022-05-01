window.onload = () => {

    const music = new Music();
    let prevSongID = null;

    const audioTrack = document.querySelector('.audio-track');
    const volume = document.querySelector('.volume');
    const swapBtn = document.querySelector('.swap');


    if (!isSettingsInLocalStorage()) {
        showGreetingMsg();
        setDefaultSettings();
        music.setVolume(0.5);
        music.setSwapMode(false);
    } else {
        const settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        changeStyle(settings.theme);
        music.setVolume(settings.audio.volume);
        music.setSwapMode(settings.audio.isSwapModeOn);
    }

    audioTrack.addEventListener('click', (event) => { music.changePoint(event.offsetX, audioTrack.offsetWidth) });
    audioTrack.addEventListener('drag', (event) => { 
        console.log(123);
        music.changePoint(event.offsetX, audioTrack.offsetWidth) });

    volume.addEventListener('input', () => { music.setVolume(volume.value / 100) });
    swapBtn.addEventListener('click', () => music.onSwapModeHandler());

    document.querySelector('#settingsBtn').addEventListener('click', showSettings);

    document.querySelector('#toggle-music-btn').addEventListener('click', toggleMusic);

    const id = music.getRandomID();
    music.setSelectedAudioPath(id);


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
        })
    }

    function showSettings() {

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
           <input class="speed_slider" type="range" min="1" max="8" step="1" value="4">
         </div>
    </div>

    <div class="settings-section">
         <div class="settings-section-title">Анимация дождя</div>
         <div class="settings-rain-animation">
             <button class="btn" id="rainOnBtn" type="button">ВКЛ.</button>
             <button class="btn" id="rainOffBtn" type="button">ВЫКЛ.</button>
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

        settingsHandlers();
    }

    function settingsHandlers() {
        const settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));

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

        const musicPlayBtns = [...document.querySelectorAll('.songs-item-start-btn')];
        musicPlayBtns.forEach((el) => {
            el.addEventListener('click', (event) => {
                const id = event.target.closest('li').id;
                music.setSelectedAudioPath(id);
                music.toggleStateSong();

                if (prevSongID !== null && id !== prevSongID) {
                    document.querySelector(`#${prevSongID}`).classList.remove('active');
                }

                event.target.closest('li').classList.toggle('active');
                document.querySelector('#toggle-music-btn').classList.toggle('active');
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
            speed: 0,  //TODO
            rainAnimation: false,
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