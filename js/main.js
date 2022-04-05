window.onload = () => {
    const gameField = document.querySelector('#game');
    const game = new Game(gameField);
    const startPauseBtn = document.querySelector('#btn-play-pause');

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
}