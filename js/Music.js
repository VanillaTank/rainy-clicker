class Music {

    playlist = [
        { title: '5-am_by_danyvin', id: 'song1', path: '../sounds/5-am_by_danyvin.mp3' },
        { title: 'barradeen-the-girl-i-havent-met', id: 'song2', path: '../sounds/barradeen-the-girl-i-havent-met.mp3' },
        { title: 'coffee-time_by_pure', id: 'song3', path: '../sounds/coffee-time_by_pure.mp3' },
        { title: 'ghostrifter-back-home', id: 'song4', path: '../sounds/ghostrifter-back-home.mp3' },
        { title: 'ghostrifter-subtle-break', id: 'song5', path: '../sounds/ghostrifter-subtle-break.mp3' },
        { title: 'le-gang-pain-away', id: 'song6', path: '../sounds/le-gang-pain-away.mp3' },
        { title: 'small-planets_by_finval', id: 'song7', path: '../sounds/small-planets_by_finval.mp3' },
        { title: 'stellar-sky_by_ahoami', id: 'song8', path: '../sounds/stellar-sky_by_ahoami.mp3' },
        { title: 'unreal-rest_by_roman-pchela', id: 'song9', path: '../sounds/unreal-rest_by_roman-pchela.mp3' },

        // {title: 'ffgdf', id: '9405943', path: '../sounds/'},
    ]

    // playlist = [
    //     { title: '0', id: 'song0', path: '../sounds/5-am_by_danyvin.mp3' },
    //     { title: '1', id: 'song1', path: '../sounds/barradeen-the-girl-i-havent-met.mp3' },
    //     { title: '2', id: 'song2', path: '../sounds/coffee-time_by_pure.mp3' },
    //     { title: '3', id: 'song3', path: '../sounds/ghostrifter-back-home.mp3' },
    //     { title: '4', id: 'song4', path: '../sounds/ghostrifter-subtle-break.mp3' },
    //     { title: '5', id: 'song5', path: '../sounds/le-gang-pain-away.mp3' },
    //     { title: '6', id: 'song6', path: '../sounds/small-planets_by_finval.mp3' },
    //     { title: '7', id: 'song7', path: '../sounds/stellar-sky_by_ahoami.mp3' },
    //     { title: '8', id: 'song8', path: '../sounds/unreal-rest_by_roman-pchela.mp3' },
    // ]

    autoPlayTimeout = null;
    currentAudioHTMLElement = document.querySelector('#selectedSong');
    audioТameHTMLElement = document.querySelector('.audio-name');

    currentTrackIndex = null;
    isSwapModeOn = null;
    currentAudio = null;

    getPlaylist = () => {
        let result = '<ul  class="songs-menu">';

        this.playlist.map((el) => {
            let active = '';

            if (document.querySelector('#selectedSong').getAttribute('src') === el.path
                &&
                !document.querySelector('#selectedSong').paused
            ) {
                active = 'active';
            }

            result += ` <li class="songs-item ${active}" id="${el.id}">
        <button class="songs-item-start-btn resetBtn">
        <svg class="play-icon" width="20" height="22" viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.231225 2.44528C0.231225 0.911663 1.8971 -0.0441679 3.23353 0.722638L18.3459 9.39366C19.6854 10.1623 19.6893 12.0842 18.3529 12.851L3.24055 21.522C1.90411 22.2889 0.231224 21.3245 0.231224 19.7873L0.231225 2.44528Z"/>
        </svg>        
        <svg class="pause-icon" width="14" height="21" viewBox="0 0 14 21" xmlns="http://www.w3.org/2000/svg">
            <rect width="4" height="21" rx="2" />
            <rect x="10" width="4" height="21" rx="2"/>
        </svg>        
        </button>
        ${el.title}
      </li>`
        })

        result += '</ul>';

        return result;
    }

    setSelectedAudioPath(id) {
        const selectedSong = this.playlist.filter(el => el.id === id);
        this.currentAudio = selectedSong;
        const path = selectedSong[0].path;

        if (path === this.currentAudioHTMLElement.getAttribute('src')) { return }

        this.currentAudioHTMLElement.setAttribute("src", path);

        this.updateAudioName()
    }

    switchTrackByIndex(index) {
        this.currentAudioHTMLElement.setAttribute("src", this.playlist[index].path);
        this.currentAudioHTMLElement.currentTime = 0;
        this.currentAudio = this.playlist[index];
        this.toggleStateSong();
        this.updateAudioName()
    }

    toggleStateSong() {
        if (this.currentAudioHTMLElement.paused) {
            this.currentAudioHTMLElement.play();

            console.log(`this.isSwapModeOn: ${this.isSwapModeOn}`);

            this.autoPlayTimeout = setInterval(() => {

                let audioTime = Math.round(this.currentAudioHTMLElement.currentTime);

                let audioLength = Math.round(this.currentAudioHTMLElement.duration);

                document.querySelector(".time").style.width = (audioTime * 100) / audioLength + '%';

                if (audioTime === audioLength && this.isSwapModeOn) {
                    let nextTrackID = this.getRandomID();
                    console.log(`nextTrackID: ${nextTrackID}`);
                    this.setSelectedAudioPath(nextTrackID);
                    this.toggleStateSong();
                    clearInterval(this.autoPlayTimeout);
                }

                if (audioTime === audioLength && this.currentTrackIndex < this.playlist.length - 1 && !this.isSwapModeOn) {
                    this.currentTrackIndex = this.currentTrackIndex + 1;
                    console.log(`this.currentTrackIndex: ${this.currentTrackIndex}`);
                    this.switchTrackByIndex(this.currentTrackIndex);
                    clearInterval(this.autoPlayTimeout);
                }
                else if (audioTime === audioLength && this.currentTrackIndex >= this.playlist.length - 1 && !this.isSwapModeOn) {
                    this.currentTrackIndex = 0;
                    console.log(`this.currentTrackIndex: ${this.currentTrackIndex}`);
                    this.switchTrackByIndex(this.currentTrackIndex);
                    clearInterval(this.autoPlayTimeout);
                }
            }, 60)
        } else {
            this.currentAudioHTMLElement.pause();
            clearInterval(this.autoPlayTimeout);
        }
    }

    getRandomID() {
        let index = Math.floor(Math.random() * this.playlist.length);
        return this.playlist[index].id;
    }

    setVolume(volume) {
        document.querySelector('#selectedSong').volume = volume;
        this.changeSettings('volume', volume);
    }

    changePoint(selectedTime, fullWidth) {
        let selectedProcent = Math.round(selectedTime / fullWidth * 100);
        let targetTime = document.querySelector('#selectedSong').duration * selectedProcent / 100;
        document.querySelector('#selectedSong').currentTime = targetTime;
        document.querySelector(".time").style.width = selectedProcent + '%';
    }

    onSwapModeHandler() {
        this.isSwapModeOn = !this.isSwapModeOn;
        this.changeSettings('isSwapModeOn', this.isSwapModeOn);
    }

    changeSettings(param, value) {
        let settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        settings.audio[param] = value;
        localStorage.setItem('rainy-clicker-settings', JSON.stringify(settings));
    }

    setSwapMode(bool) {
        this.isSwapModeOn = bool;
        this.changeSettings('isSwapModeOn', this.isSwapModeOn);
    }

    updateAudioName() {
        this.audioТameHTMLElement.textContent = this.currentAudio[0].title;
    }
}