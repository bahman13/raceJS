const MAX_ENEMY = 2;
const HEIGHT_ELEM = 100; //что бы избежать "налипания" создать переменную с фиксированным размером и использовать вместо цифр в расчетах

const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');

const car = document.createElement('div'); //создать машину с 0, без верстки

//===========звук==============
const audio = document.createElement('embed');
audio.src = 'music.mp3';
audio.style.cssText = `position: absolute; top: -1000px;`;

car.classList.add('car'); //добавить class в елементу

//во избежание налипания полос
//сначала получить высоту екрана, поделить на 100 и округлить результат
const countSection = Math.floor(document.documentElement.clientHeight / HEIGHT_ELEM);
gameArea.style.height = countSection * HEIGHT_ELEM;

//console.log(start);
//console.dir(start);
/*
start.onclick = function() {
    start.classList.add('hide'); //добавление елемента в css(при клике добавит ковый класс со значением  display: none;)
};
*/

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = { //для остановки игры
    start: false,
    score: 0,
    speed: 3,
    traffic: 3,
};


function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}
//console.log(heightElement(200)); узнать сколько елементов влезет при высоте елемента 200px


function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = ''; //сброс что бы начать новую игру

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++) { //цикл для движения линий
        const line = document.createElement('div'); //создание блока для линий
        line.classList.add('line'); //добавление клссса к линиям(для работы со стилями)
        line.style.top = (i * HEIGHT_ELEM) + 'px'; //позиция линий
        line.y = i * HEIGHT_ELEM; //задать вертикальную ось линиям, для "передвижения линий"
        gameArea.appendChild(line); //внесение их в верстку дочерним елементом
    }


    //=====автомобили противника
    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url(./image/enemy${randomEnemy}.png) center / cover no-repeat`;
        gameArea.appendChild(enemy);
        //console.dir(enemy); вывести обьект со всеми его свойствами
    }

    setting.score = 0; //внести параметр колличества игр, в playGame остальное
    setting.start = true;
    gameArea.appendChild(car); //добавить созданный елемент на страницу после начала игры 
    document.body.append(audio);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2; //позиция автомобиля после перезапуска игры
    car.style.top = 'auto';
    car.style.bottom = '10px'; //позиция автомобиля после перезапуска игры
    setting.x = car.offsetLeft; //значение left из css, x - координата по горизонтали
    setting.y = car.offsetTop; //по вертикали
    requestAnimationFrame(playGame); //метод анимации, будет запускать playGame
};


//==========АНИМАЦИЯ==============
function playGame() {

    if (setting.start) {
        setting.score += setting.speed; //результат времени езды
        score.innerHTML = 'SCORE<br> ' + setting.score; //вывод сообщения времени
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) { //если нажата влево -
            setting.x -= setting.speed; // то будет двигать влево по горизонтали
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) { //ограничение - размер поля-ширина машины
            setting.x += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0) { //setting.y(x) > 0 для ограничения машины в поле дороги
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px'; //внести изменения координат в css + 'px', для отображения правильного
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame); //повтор для перезапуска функции(рекурсия)
    }
};
//==========АНИМАЦИЯ==============


//==========УПРАВЛЕНИЕ==============
function startRun(event) { //при нажатии начнется движениеБ сработает событие keydown
    event.preventDefault(); //что бы не скролить страницу при нажатии клавиши вниз
    // console.log(event.key);
    keys[event.key] = true; //обратится к свойствам обьекта через массив(так как строка), можно обращаться и keys.random
};

function stopRun(event) { //если отпустить - прекратится сработает событие keyup
    event.preventDefault(); //что бы не скролить страницу при нажатии клавиши вниз
    keys[event.key] = false;
};
//==========УПРАВЛЕНИЕ==============


//==========ДВИЖЕНИЕ ЛИНИЙ==========
function moveRoad() {
    let lines = document.querySelectorAll('.line'); //получить все линии с заданым классом
    lines.forEach(function(line, /*i*/ ) {
        //console.log(line);
        //console.log(i);
        line.y += setting.speed; //прибавление скорости(3 пикселя)
        line.style.top = line.y + 'px'; //изменение стиля

        if (line.y > gameArea.offsetHeight) { //если линия "уехала" из области, то
            line.y = -HEIGHT_ELEM; //что бы линии появлялись выше области видимости
        }

    })
}
//==========ДВИЖЕНИЕ ЛИНИЙ==========


//======ВРАГИ=====
function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item) {
        //========СТОЛКНОВЕНИЯ=======
        let carRect = car.getBoundingClientRect(); //определить позицию елемента(left\right\bottom\top\ и размеры относительно поля игры(верх/низ/лево/право) для сравнения с позицией противника)
        //console.log('carRect: ', carRect);
        let enemyRect = item.getBoundingClientRect(); //для верхнего столкновения - top машины сравнивать с bottom противника

        //===сравнение позиций для СТОЛКНОВЕНИЙ======
        //строки  carRect.left <= enemyRect.right... отвечают за настройки ширини машин
        if (carRect.top <= enemyRect.bottom && //при совпадении низа противника и верха машины - надпись ДТП
            carRect.right + 3 >= enemyRect.left && //аналогично и для боковых
            carRect.left + 3 <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            audio.remove();
            console.warn('ДТП');
            start.classList.remove('hide'); //для показа сообщения новой игры
            start.style.top = score.offsetHeight; //определения места "новая игра" под надписью результата
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth / 2)) + 'px';
        }

    });
}
//======ВРАГИ=====