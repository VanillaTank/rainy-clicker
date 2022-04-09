window.onload = () => {
    const gameField = document.querySelector('#game');
    const game = new Game(gameField);
    const music = new Music();
    const startPauseBtn = document.querySelector('#btn-play-pause');
    const openSettingsBtn = document.querySelector('#btn-open-settings');

    openSettingsBtn.addEventListener('click', onClickOpenSettingsBtn)

    game.setCount('#score')
    let bubbleInterval = setInterval(() => { game.drawTarget() }, 1400)
    

    startPauseBtn.addEventListener('click', () => {
        if (bubbleInterval) {
            clearInterval(bubbleInterval)
            bubbleInterval = undefined
        } else {
            game.drawTarget();
            bubbleInterval = setInterval(() => { game.drawTarget() }, 1400)
        }

    });


    gameField.addEventListener('click', (event) => {
        game.onClick(event.target, event.clientX, event.clientY)
    })

    // ---------------------------------------------------------------------------
    
    function onClickOpenSettingsBtn() {
        const div = document.createElement('div');
        div.classList.add('settings-popup');
        div.innerHTML = `
        <button class="resetBtn close-setting-pop-up">X</button>
        <div>
           <input id="addSongInput" class="addSongInput"  type="file" accept="audio/*" />
        </div>
        <ul class="songs-list">
          ${music.showSongList()}
        </ul>
        `
        document.body.append(div);
    }
}