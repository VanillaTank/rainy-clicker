class Music {

    playList = [
        {name: 'first test song', id: 'sdf34', path: '../music/test.mp3'}
    ];

    addSongToPlayList(song) {
        //TODO дописать создание songInfo
        const songInfo = { name: '', id: this.#randomId(), path: '' }
        playList.push(songInfo)
    }

    deleteSongFromPlayList(songId) {
        const index = songId.indexOf(el => el.id === songId)
        this.playList.splice(index, 1)
    }

    showSongList() {
        let HTML_String = '';
        for(let song of this.playList) {
            HTML_String += `<li class="song-item" data-song-id="${song.id}">
              <button class="resetBtn play-pause-btn">PP</button>
              <button class="resetBtn delete-song-btn">X</button>
              ${song.name}
            </li>`
        }
        return HTML_String;
    }

    playSong(id) {
        const path = playList.filter(el => el.id === id);
        let audio = document.querySelector('audio')
        if(audio) {
            audio.setAttribute('scr', path);
            audio.play()
            return
        }
        audio = document.createElement('audio');
        audio.audio.setAttribute('scr', path);
        document.append(audio);
        audio.play()
    }


    pauseSong(song) {
        song.pause()
    }

    #randomId() {
       const string = 'abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'
       let result = '';
       for(let i = 0; i < 6; i++) {
           const randomIndex = Math.floor(Math.random() * string.length)
           result += string[randomIndex];
       }
       return result;
    }
}