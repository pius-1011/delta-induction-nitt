function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}



class Tile {
}
Tile.colors = ['#08FDC2', ' #3EA073', '#FFC300', '#FF5733', '#AFFD08','#E7B8C6', '#FFFFFF'];




class Grids {
    constructor(m) {
        this.m = m;
        this.row = m - 1;
        this.col = m - 1;
        this.steps = 0;
        this.start_time = Date.now();
        this.running = true;
        this.difficulty = 50;
        this.score = 0;

        // initialize two 2d matrices 
        let board = new Array(m); //board
        for (let i = 0; i < m; i++) {
            board[i] = new Array(m);
        }

        let target = new Array(m - 2);  //target
        for (let i = 0; i < m - 2; i++) {
            target[i] = new Array(m - 2);
        }

        // random values of color indices (from 0 to 5)
        let temparray = new Array();
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < (m * m - 1) / 6; j++) {
                temparray.push(i)
                // let temp_tile = new Tile(board_div, i);
                // temparray.push(temp_tile);
            }
        }
        shuffle(temparray);


        // filling up the board with random colors
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                board[i][j] = temparray[i * m + j];
            }
        }

        // copying the target from the board's central values
        let n = m - 2;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                target[i][j] = board[i + 1][j + 1];
            }
        }



        this.board = board;
        this.target = target;



        // randomisisng the start
        let random_row = getRandomInt(0, m - 1);
        let random_col = getRandomInt(0, m - 1);
        this.swap(m - 1, m - 1, random_row, random_col);
        this.row = random_row;
        this.col = random_col;
        let moves_history = []
        for (let i = 0; i < this.difficulty; i++) {
            let toss = Math.random();
            if (toss < .25) {
                this.move_down();
                moves_history.push(40)
            }
            else if (.25 <= toss < .50) {
                this.move_left();
                moves_history.push(37)
            }
            else if (.50 <= toss < .75) {
                this.move_up();
                moves_history.push(38)
            }
            else {
                this.move_right();
                moves_history.push(39)

            }
        }
        this.moves = moves_history;


    }



    swap(row1, col1, row2, col2) {
        let temp = this.board[row1][col1];
        this.board[row1][col1] = this.board[row2][col2];
        this.board[row2][col2] = temp;

    }

    move_left() {
        if (this.col != 0) {
            this.swap(this.row, this.col, this.row, this.col - 1);
            this.col = this.col - 1;

        }
    }
    move_right() {
        if (this.col != this.m - 1) {
            this.swap(this.row, this.col, this.row, this.col + 1);
            this.col = this.col + 1;

        }
    }
    move_up() {
        if (this.row != 0) {
            this.swap(this.row, this.col, this.row - 1, this.col);
            this.row = this.row - 1;

        }


    }
    move_down() {
        if (this.row != this.m - 1) {

            this.swap(this.row, this.col, this.row + 1, this.col);
            this.row = this.row + 1;

        }
    }





}




class View {
    constructor(body) {
        let target_div = document.getElementById('target')
        let board_div = document.getElementById('board')
        this.target = target_div;
        this.board = board_div;
        let t = document.getElementById('time');
        this.timer = setInterval(() => {
            t.innerText = Math.floor((Date.now() - game.start_time) / 1000)
        }, 1000);

    }

    update(game) {
        // update everything
        this.update_target(game);
        this.update_board(game);
        this.update_cursor(game);
        this.update_steps(game);


    }

    update_steps(game) {
        let s = document.getElementById('steps');
        s.innerText = game.steps;
    }
    update_board(game) {
        let m = game.m;
        let board = game.board;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                this.board.children[m * i + j].style.backgroundColor = Tile.colors[board[i][j]]
            }
        }
    }

    update_target(game) {
        let n = game.m - 2;
        let target = game.target;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                this.target.children[n * i + j].style.backgroundColor = Tile.colors[target[i][j]]
            }
        }
    }

    update_cursor(game) {
        let m = game.m;
        let row = game.row;
        let col = game.col;
        this.board.children[row * m + col].style.backgroundColor = Tile.colors[6]
    }
    check_for_winner(game) {
        let m = game.m;
        let win = true;
        for (let i = 0; i < m - 2; i++) {
            for (let j = 0; j < m - 2; j++) {
                if (game.target[i][j] != game.board[i + 1][j + 1])
                    win = false;
            }
        }

        if (win == true) {
            game.running = false;
            let s = new sound('win.wav');
            s.play();
            game.steps
            let t = Math.floor((Date.now() - game.start_time) / 1000)
            game.score += Math.exp(-t * .01);
            if (game.steps > game.difficulty) {
                game.score -= (game.steps - difficulty) / 20
            }
            game.score = Math.max(game.score, 0);
            if (game.score < 1) {
                let scorediv = document.getElementById('score');
                scorediv.innerText = 'Final Score: ' + game.score.toFixed(4);
            }
            clearInterval(this.timer);
        }

    }

}


function keyPush(game, view, evt) {
    if (game.running) { game.steps += 1; }
    switch (evt.keyCode) {
        case 37:
            game.move_left()
            break;
        case 38:
            game.move_up()
            break;
        case 39:
            game.move_right()
            break;
        case 40:
            game.move_down()
            break;
    }
    view.update(game);
    view.check_for_winner(game);
}


window.onload = function () {
    game = new Grids(5);
    view = new View(document.body);
    document.addEventListener('keydown', (evt) => keyPush(game, view, evt));
    view.update(game);

}
