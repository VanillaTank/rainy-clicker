class Bubbles {

    field = document.querySelector('.game-field');

    fieldWidth = this.field.getBoundingClientRect().width;
    fieldHeight = this.field.getBoundingClientRect().height;
    fieldMinX = Math.round(this.field.getBoundingClientRect().x);
    fieldMinY = Math.round(this.field.getBoundingClientRect().y);
    speedVars = [
        { bubbleCreation: 3600, animationTime: 2.1 },
        { bubbleCreation: 3400, animationTime: 1.9 },
        { bubbleCreation: 3000, animationTime: 1.7 },
        { bubbleCreation: 2500, animationTime: 1.5 },
        { bubbleCreation: 2000, animationTime: 1.3 },
        { bubbleCreation: 1500, animationTime: 1.1 },
        { bubbleCreation: 1000, animationTime: 1 },
        { bubbleCreation: 800, animationTime: 0.9 },
    ]

    bubbleSpeed = null;  // то, что должно придти из настроек
    intervalSpeed = null;  // скорость отрисовки новых целей
    animationTime = null;   // скорость анимации

    startBubbleInterval = null;

    px = 'px'



    setCurentSpeed() {
        this.intervalSpeed = this.speedVars[this.bubbleSpeed].bubbleCreation;
        this.animationTime = this.speedVars[this.bubbleSpeed].animationTime;
    }

    startBubbles(bubbleSpeed) {
        this.bubbleSpeed = bubbleSpeed;
        this.setCurentSpeed();
        document.querySelector('#toggle-game-btn').classList.add('active');
        this.drawBubble();
        this.startBubbleInterval = setInterval(() => { this.drawBubble() }, this.intervalSpeed);
    }

    drawBubble() {
        const target = document.createElement('div');
        target.classList.add('target', 'notClicked');
        const styledTarget = target.style;

        const diametr = Math.floor(25 + Math.random() * (50 + 1 - 25));
        styledTarget.width = styledTarget.height = diametr + this.px;
        styledTarget.animationDuration = this.animationTime + 's';

        const randomX = Math.floor((0 + diametr) + Math.random() * ((this.fieldWidth + 1 - diametr) - diametr));
        const randomY = Math.floor((0 + diametr) + Math.random() * ((this.fieldHeight + 1 - diametr) - diametr));

        styledTarget.left = randomX + this.px;
        styledTarget.top = randomY + this.px;

        this.field.appendChild(target);

        target.addEventListener('click', (event) => {
            this.onClick(target, event.clientX - this.fieldMinX, event.clientY - this.fieldMinY)
        })
        target.addEventListener('animationend', () => { target.remove() });
    }

    updateBoundaries() {
        this.fieldWidth = this.field.getBoundingClientRect().width;
        this.fieldHeight = this.field.getBoundingClientRect().height;
        this.fieldMinX = Math.round(this.field.getBoundingClientRect().x);
        this.fieldMinY = Math.round(this.field.getBoundingClientRect().y);
    }

    stopBubbles() {
        clearInterval(this.startBubbleInterval);
        if (document.querySelector('.target')) {
            document.querySelector('.target').remove();
        }
        if (document.querySelector('.pulse')) {
            document.querySelector('.pulse').remove();
        };
    }

    onClick(target, clientX, clientY) {
        if (target.classList.contains('target') && target.classList.contains('notClicked')) {
            target.classList.remove('notClicked');
            target.remove();
            this.onTargetClickAnimation(clientX, clientY);
        }
    }

    onTargetClickAnimation(clientX, clientY) {
        const div = document.createElement('div');
        div.classList.add('pulse');

        const styledDiv = div.style;

        const randomDiametr = Math.floor(50 + Math.random() * (120 + 1 - 50));

        styledDiv.width = styledDiv.height = randomDiametr + this.px;
        styledDiv.left = clientX - (randomDiametr / 2) + this.px;
        styledDiv.top = clientY - (randomDiametr / 2) + this.px;

        this.field.appendChild(div);

        div.addEventListener('animationend', this.removeRainyCircle);
    }

    removeRainyCircle() {
        this.remove()
    }

    changeSpeed(value) {
        this.bubbleSpeed = value;

        this.stopBubbles();
        this.startBubbles(this.bubbleSpeed);

        let settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        settings.bubbleSpeed = this.bubbleSpeed;
        localStorage.setItem('rainy-clicker-settings', JSON.stringify(settings));

    }
}