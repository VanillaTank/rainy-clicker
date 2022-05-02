class Bubbles {

    field = document.querySelector('.game-field');

    fieldWidth = this.field.getBoundingClientRect().width;
    fieldHeight = this.field.getBoundingClientRect().height;
    fieldMinX = Math.round(this.field.getBoundingClientRect().x);
    fieldMinY = Math.round(this.field.getBoundingClientRect().y);

    intervalSpeed = 2500;

    startBubbleInterval = null;

    px = 'px'

    startBubbles() {
        document.querySelector('#toggle-game-btn').classList.add('active');
        this.drawBubble();
        this.startBubbleInterval = setInterval(() => { this.drawBubble() }, this.intervalSpeed);
    }

    drawBubble() {
        const target = document.createElement('div');
        target.classList.add('target', 'notClicked');
        const styledTarget = target.style;

        const diametr = Math.floor(25 + Math.random() * (50 + 1 - 25));
        styledTarget.width = styledTarget.height = diametr + this.px

        const randomX = Math.floor((this.fieldMinX + diametr / 2) + Math.random() * ((this.fieldWidth + 1 - diametr / 2) - this.fieldMinX));
        const randomY = Math.floor((this.fieldMinY + diametr / 2) + Math.random() * ((this.fieldHeight + 1 - diametr / 2) - this.fieldMinY));
        styledTarget.left = randomX + this.px;
        styledTarget.top = randomY + this.px;

        this.field.appendChild(target);

        target.addEventListener('click', (event) => {
            this.onClick(target, event.clientX, event.clientY)
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

    changeSpeed (value) {
        // от 1 до 8
        console.log(value);

    }
}