class Game {
  constructor(gameField) {
    this.gameField = gameField;
    this._gameFieldWidth = this.gameField.getBoundingClientRect().width;
    this._gameFieldHeight = this.gameField.getBoundingClientRect().height;
  }

  #px = 'px'

  count = 0

  drawTarget() {

    const target = document.createElement('div');
    target.classList.add('target');
    const styledTarget = target.style;

    const randomX = Math.floor(50 + Math.random() * (this._gameFieldWidth + 1 - 50));
    const randomY = Math.floor(50 + Math.random() * (this._gameFieldHeight + 1 - 50));
    styledTarget.left = randomX + this.#px;
    styledTarget.top = randomY + this.#px;

    this.gameField.appendChild(target);

    target.addEventListener('animationend', () => {target.remove()})
  }

  onClick(target, clientX, clientY) {
    if (target.classList.contains('target')) {
      target.classList.remove('target');
      this.onTargetClickAnimation(clientX, clientY);
      this.changeCount()
    }
  }

  onTargetClickAnimation(clientX, clientY) {
    const rect = this.gameField.getBoundingClientRect();
    const div = document.createElement('div');
    div.classList.add('pulse');

    const styledDiv = div.style;

    const randomDiametr = Math.floor(50 + Math.random() * (120 + 1 - 50));

    styledDiv.width = styledDiv.height = randomDiametr + this.#px;
    styledDiv.left = clientX - rect.left - (randomDiametr / 2) + this.#px;
    styledDiv.top = clientY - rect.top - (randomDiametr / 2) + this.#px;

    this.gameField.appendChild(div);

    div.addEventListener('animationend', this.#removeRainyCircle);
  }

  changeCount() {
    this.count++;
    document.querySelector('#score').textContent = this.count
  }

  #removeRainyCircle() {
    this.remove()
  }

}