document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const doddler = document.createElement('div');
    const platforms = [];
    let jumpPoint = 150;
    let doddlerBottomSpace = jumpPoint;
    let doddlerLeftSpace = 0;
    let isJumping = false;
    let isGameOver = false;
    let setDownTimerId = 0;
    let setUpTimerId = 0;
    let setLeftTimerId = 0;
    let setRightTimerId = 0;
    let score = 0;

    function createDoddler() {
        doddler.classList.add('doddleJump');
        doddler.style.bottom = doddlerBottomSpace + 'px';
        doddler.style.left = doddlerLeftSpace + 'px';
        grid.appendChild(doddler);
    }

    class Platform {
        constructor(bottom) {
            this.bottom = bottom;
            this.left = Math.random() * 340;
            this.visual = document.createElement('div');
            const visual = this.visual;
            visual.classList.add('platforms');
            visual.style.left = this.left + 'px';
            visual.style.bottom = this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    function createPlatforms() {
        for (let i = 0; i < 5; i++) {
            let platformGap = 600 / 5;
            let platDistance = 100 + platformGap * i;
            let plat = new Platform(platDistance);
            platforms.push(plat);
        }
        doddlerBottomSpace = platforms[0].bottom + 40; 
        doddlerLeftSpace = platforms[0].left;
    }

    function movingPlatforms() {
        platforms.forEach(plat => {
            plat.bottom -= 0.5;
            if (platforms[0].bottom < 10) {
                platforms[0].visual.classList.remove('platforms');
                platforms.shift();
                platforms.push(new Platform(600));
                score += 1;
            } else {
                const visual = plat.visual;
                visual.style.bottom = plat.bottom + 'px';
            }
        });
    }

    function fall() {
        if (!isJumping) {
            clearInterval(setUpTimerId);
            setDownTimerId = setInterval(function () {
                doddlerBottomSpace -= 2;
                if (doddlerBottomSpace < 5) {
                    isGameOver = true;
                    gameOver();
                } else {
                    doddler.style.bottom = doddlerBottomSpace + 'px';
                }
            }, 20);
        }
    }

    function jumpActivate() {
        platforms.forEach(plat => {
            if (doddlerLeftSpace + 60 >= plat.left &&
                doddlerLeftSpace <= plat.left + 60 &&
                doddlerBottomSpace >= plat.bottom &&
                doddlerBottomSpace <= plat.bottom + 15 &&
                !isJumping
            ) {
                if (isJumping === false) {
                    jumpPoint = plat.bottom + 20;
                    isJumping = true;
                    jump();
                }
            }
        });
    }

    function jump() {
        clearInterval(setDownTimerId);
        setUpTimerId = setInterval(function () {
            doddlerBottomSpace += 2;
            if (doddlerBottomSpace > jumpPoint + 200 || doddlerBottomSpace > 550) {
                isJumping = false;
                fall();
            } else {
                doddler.style.bottom = doddlerBottomSpace + 'px';
            }
        }, 20);
    }

    function moveLeft() {
        clearInterval(setLeftTimerId);
        clearInterval(setRightTimerId);
        setLeftTimerId = setInterval(function () {
            if (doddlerLeftSpace > 5) {
                doddlerLeftSpace -= 2;
                doddler.style.left = doddlerLeftSpace + 'px';
            }
        }, 20);
    }

    function moveRight() {
        clearInterval(setRightTimerId);
        clearInterval(setLeftTimerId);
        setRightTimerId = setInterval(function () {
            if (doddlerLeftSpace < 340) {
                doddlerLeftSpace += 2;
                doddler.style.left = doddlerLeftSpace + 'px';
            }
        }, 20);
    }

    function moveUp(){
        clearInterval(setLeftTimerId)
        clearInterval(setRightTimerId)
    }

    function control(e) {
        if (e.key === 'ArrowLeft') {
            moveLeft();
        } else if (e.key === 'ArrowRight') {
            moveRight();
        } else if (e.key === 'ArrowUp') {
            moveUp()
        }
    }

    function gameOver() {
        clearInterval(setDownTimerId);
        clearInterval(setUpTimerId);
        clearInterval(setLeftTimerId);
        clearInterval(setRightTimerId);
        platforms.length = 0;  
        while (grid.firstChild) {
            grid.firstChild.remove();
        }
        grid.innerHTML = 'Your Score is ' + score;
    }

    function start() {
        if (!isGameOver) {
            createPlatforms();
            createDoddler();
            fall(); 
            setInterval(movingPlatforms, 20);
            setInterval(jumpActivate, 20);
            document.addEventListener('keydown', control);
        } else gameOver();
    }

    start();

});
