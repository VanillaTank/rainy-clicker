class Rain {

    isRainAnimation = null;

    startRain(isAllow) {

        if (isAllow) { this.isRainAnimation = true }
        else { this.isRainAnimation = false }


        if (this.isRainAnimation) {
            let body = document.querySelector('.theme');
            let quantity = document.body.getBoundingClientRect().width / 3;  //количество капель
            let index = 0;

            while (index < quantity) {
                let drop = document.createElement('index');
                let size = Math.random() * 4;
                let positionX = Math.floor(Math.random() * body.clientWidth);
                let delay = Math.random() * 20;
                let duration = Math.random() * 5;

                drop.style.width = 0.3 + size + 'px';
                drop.style.left = positionX + 'px';
                drop.style.animationDelay = delay + 's';
                drop.style.animationDuration = 5 + duration + 's';

                body.appendChild(drop)
                index++;
            }
        }
    }

    stopRain() {
        this.isRainAnimation = false;
        [...document.querySelectorAll('index')].forEach(item => item.remove());
    }

    changeRainSettings() {
        this.isRainAnimation = !this.isRainAnimation;

        let settings = JSON.parse(localStorage.getItem('rainy-clicker-settings'));
        settings.isRainAnimation = value;
        localStorage.setItem('rainy-clicker-settings', JSON.stringify(settings));
    }

    getHTMLBtns() {
        if (this.isRainAnimation) {
            return `<button class="btn active" id="rainOnBtn" type="button">ВКЛ.</button>
                    <button class="btn" id="rainOffBtn" type="button">ВЫКЛ.</button>`
        } else {
            return `<button class="btn" id="rainOnBtn" type="button">ВКЛ.</button>
                    <button class="btn active" id="rainOffBtn" type="button">ВЫКЛ.</button>`
        }
    }

}