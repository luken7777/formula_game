
//The canvas and its drawing surface
var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");

//Variable to hold image square
var image;

//Number of gameObjects rows and columns
var ROWS = car.length;
var COLUMNS = car[0].length;
var assetsToLoad = [];
var assetsLoaded = 0;

//Game states
var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;

//To detect if gamer won, as default set to false
var win = false;

//Default gameState
var gameState = LOADING;

//Default gameSpeed which will be increased once level is completed
var gameSpeed = 100;

var game;
var next_level;

//Game objects 
var EMPTY = 0;
var SQUARE = 1;

//Arrow key codes
var RIGHT = 39;
var LEFT = 37;

//All sprites in the game
var car_sprites = [];
var bar_sprites = [];

//Next block set to false until we assign all new parameters
var next_bar = false;

//Default of car maximum and minimum value columns 
var max_x = 0;
var min_x = 0;
var dist_to_travel = 5;

//Car position right and left wheel
var car_left_wheel = 5;
var car_right_wheel = 10;

//Total score and level score, level score reset after every level and total_score doesn't
var total_score = 0;
var level_score = 0;

function start() {
    //Get access to start, save and show button once the game started and hide them
    var start_button = document.getElementById("start_button");
    start_button.style.visibility = "hidden";

    var show_form = document.getElementById("show_form");
    show_form.style.visibility = "hidden";

    var save_form = document.getElementById("save_form");
    save_form.style.visibility = "hidden";

    //Load the  image
    image = new Image();
    image.addEventListener("load", loadHandler, false);
    image.src = "graphic/assets.png";
    assetsToLoad.push(image);

    //Add listener to look for pressed keys
    window.addEventListener("keydown", keydownHandler, false);
    //Add mouse listener
    window.addEventListener("click", clickHandler, false);
    //Update sprites
    update();
}

//Move car based on clicked mouse position
function clickHandler(event) {
    //Variable that stores center of screen
    var center = screen.width / 2;
    //Clicked to the left side of the screen
    if (event.clientX < center) {
        for (var index = 0; index < car_sprites.length; index++) {
            car_sprites[index].x -= dist_to_travel;
            car_right_wheel -= 5;
            car_left_wheel -= 5;
        }
        //Clicked to the right side of the screen
    } else {
        for (var index = 0; index < car_sprites.length; index++) {
            car_sprites[index].x += dist_to_travel;
            car_right_wheel += 5;
            car_left_wheel += 5;
        }
    }
}

//Move car based on pressed key
function keydownHandler(event) {
    switch (event.keyCode) {
        case RIGHT:
            //Prevent from going through the wall
            if (car_right_wheel < COLUMNS - 1) {
                for (var index = 0; index < car_sprites.length; index++) {
                    car_sprites[index].x += dist_to_travel;
                    car_right_wheel += 5;
                    car_left_wheel += 5;
                }
            }

            break;
        case LEFT:
            if (car_left_wheel > 0) {
                for (var index = 0; index < car_sprites.length; index++) {
                    car_sprites[index].x -= dist_to_travel;
                    car_right_wheel -= 5;
                    car_left_wheel -= 5;
                }
            }
            break;
    }
}

function loadHandler() {
    //Loading all the assets
    assetsLoaded++;
    if (assetsLoaded === assetsToLoad.length) {
        //Remove the load handlers
        image.removeEventListener("load", loadHandler, false);
        //Build map
        gameState = BUILD_MAP;
    }
}

function update() {
    //Start the animation loop
    game = setTimeout(update, gameSpeed);

    //Update points
    var points = document.getElementById("points");
    points.innerHTML = "POINTS: " + total_score;

    //Change what the game is doing based on the game state
    switch (gameState)
    {
        case LOADING:
            console.log("loading...");
            break;
        case BUILD_MAP:
            //Build map based on the gameObjects array
            buildMap();
            gameState = PLAYING;
            //Render the game
            render();
            break;
        case PLAYING:
            playGame();
            //Render the game
            render();
            break;
        case OVER:
            endGame();
            break;
    }

}

//Building the map
function buildMap() {
    //Searching the array to find objects
    for (var row = 0; row < ROWS; row++) {
        for (var column = 0; column < COLUMNS; column++) {
            //Assign to new variable to simplify a bit
            var currentTile = car[row][column];
            switch (currentTile) {
                case SQUARE:
                {
                    //Create copy of the object and set new values
                    var block = Object.create(block_obj);
                    block.x = column;
                    block.y = row;
                    //Push new created sprite into the sprites array
                    car_sprites.push(block);
                }
            }
        }
    }
    //Create bars on random position
    createBars();
}

//Let's the game begin
function playGame() {
    moveBars();
    //Earn points by hitting bars with the side of your car
    earnPoints();
    //Check if car crashed
    isCrashed();
}

//Draw all the objects on stage
function render() {

    //Clear the stage before start rendering
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

    //If sprites are not empty start to draw objects on the map/stage
    if (car_sprites.length !== 0) {
        for (var index = 0; index < car_sprites.length; index++) {
            //Assign array element to variable to simplify
            var car_sprite = car_sprites[index];
            //Draw sprites on the map/stage
            drawingSurface.drawImage
                    (
                            image,
                            car_sprite.sourceX, car_sprite.sourceY,
                            car_sprite.blockSize, car_sprite.blockSize,
                            car_sprite.x * car_sprite.blockSize, car_sprite.y * car_sprite.blockSize,
                            car_sprite.blockSize, car_sprite.blockSize
                            );
        }
    }

    if (bar_sprites.length !== 0) {
        for (var bar = 0; bar < bar_sprites.length; bar++) {

            var bar_sprite = bar_sprites[bar];
            drawingSurface.drawImage
                    (
                            image,
                            bar_sprite.sourceX, bar_sprite.sourceY,
                            bar_sprite.sourceWidth, bar_sprite.sourceHeight,
                            bar_sprite.x * bar_sprite.blockSize, bar_sprite.y * bar_sprite.blockSize,
                            bar_sprite.width, bar_sprite.height
                            );
        }
    }
}

function createBars() {
    var next_bar = false;

    //First and second bar position, as default we set 0
    var left_bar_pos = 0;
    var right_bar_pos = 0;

    //Possible left and right bar positions
    var left_bar_arr = [0, 5];
    var right_bar_arr = [5, 10];
    while (left_bar_pos === right_bar_pos) {
        left_bar_pos = left_bar_arr[Math.floor(Math.random() * left_bar_arr.length)];
        right_bar_pos = right_bar_arr[Math.floor(Math.random() * right_bar_arr.length)];
    }

    //Loop two times for two newly created bars
    for (var index = 0; index < 2; index++) {
        //Create new bar object and set new values
        var bar = Object.create(bar_obj);
        if (!next_bar) {
            bar.x = left_bar_pos;
            next_bar = true;
        } else {
            bar.x = right_bar_pos;
        }
        bar.y = 0;
        //Push every newly created bar at the begining of the array
        bar_sprites.unshift(bar);
        //Restore the default value to block_sprites
    }
}

//Bars movement to the bottom of the stage
function moveBars() {
    //Second bar
    var second_bar = 1;

    for (var bar = 0; bar < bar_sprites.length; bar++) {
        bar_sprite = bar_sprites[bar];
        //Move every block of bar
        bar_sprite.y += 1;

        //Every second
        if (bar === second_bar) {
            if (bar_sprite.y === 10) {
                createBars();
            }
        }

        //If last element of the last bar reach bottom of the stage 
        //then remove last two bars ("they're in the same "x" position) from the bar_sprites array
        if (bar_sprite.y === ROWS) {
            bar_sprites.splice(bar, 2);
            //If last two scored bars are removed then change scored variable to false for new upcoming bars
        }
    }
}

function earnPoints() {
    var car_bumper = car_sprites[0];
    var last_bar = bar_sprites[bar_sprites.length - 1];

    for (var index = 0; index < car_sprites.length; index++) {
        var car_sprite = car_sprites[index];
        for (var bar = 0; bar < bar_sprites.length; bar++) {
            var bar_sprite = bar_sprites[bar];

            //Remove bars by hitting them with side of the car
            if (car_sprite.y < bar_sprite.y) {
                if (car_sprite.x === bar_sprite.x + bar_obj.width || car_sprite.x === bar_sprite.x) {
                    bar_sprites.splice(bar, 1);
                }
            }
        }
    }

    if (car_bumper.y === last_bar.y) {
        //To prevent scoring more than 10 when bars are below car bumper
        level_score += 10;
        total_score += 10;
        //If level score is equal to 50 go to next level
        if (level_score === 100) {
            //Change the gameState, reset level_score and change gameSpeed
            gameState = OVER;
            win = true;

        }
    }
}

function isCrashed() {
    var car_bumper = car_sprites[0];
    var bar_blocks = 5;

    for (var index = bar_sprites.length - 1; index >= 0; index--) {
        var bar_sprite = bar_sprites[index];

        if (car_bumper.y === bar_sprite.y) {
            if (car_bumper.x > bar_sprite.x && car_bumper.x < bar_sprite.x + bar_blocks) {
                //Subtract 10 from level score and total score to stop score increasing 
                //when hitting bar from the front
                level_score -= 10;
                total_score -= 10;
                gameState = OVER;
                win = false;
            }
        }
    }
}

function endGame() {
    //Stop game 
    clearTimeout(game);

    //Clear the stage before start rendering
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

    //Reset car and bar arrays
    car_sprites = [];
    bar_sprites = [];

    //Reset car position right and left wheel
    car_left_wheel = 5;
    car_right_wheel = 10;

    //Reset level_score
    level_score = 0;

    if (win) {
        //Display the next stage text over the canvas
        drawingSurface.font = "40px Arial";
        drawingSurface.fillText("Next stage", 60, 296);

        //Change gameSpeed, gameSpeed 50 is the fastest our car can face
        if (gameSpeed <= 500 && gameSpeed > 100) {
            gameSpeed -= 100;
        } else if (gameSpeed <= 100 && gameSpeed > 50) {
            gameSpeed -= 10;
        }

        //Change gameState to builing map as we start another level
        gameState = BUILD_MAP;

        //Set when the game starts after completed level
        next_level = setTimeout(update, 2000);

    } else {
        car_sprites = [];
        bar_sprites = [];

        //Display "Game over !" and "try again" button
        drawingSurface.font = "40px Arial";
        drawingSurface.fillText("Game Over !", 60, 296);

        //Gain access to again_button, save_form, show_form and make them visible
        var again_button = document.getElementById("again_button");
        again_button.style.visibility = "visible";

        var save_form = document.getElementById("save_form");
        save_form.style.visibility = "visible";
        //Enable save input and save button
        document.getElementById("player_name").disabled = false;
        document.getElementById("save_button").disabled = false;

        var show_form = document.getElementById("show_form");
        show_form.style.visibility = "visible";
        //Create cookie to send total_score to php in order to save it into database
        createCookie("result", total_score, "10");
        //window.location = "php/saveToDatabase.php";
    }
}

//Try game again
function tryAgain() {
    //Clear the stage before start rendering
    drawingSurface.clearRect(0, 0, canvas.width, canvas.height);

    //Gain access to again_button and save_form and make them hidden
    var again_button = document.getElementById("again_button");
    again_button.style.visibility = "hidden";

    var save_form = document.getElementById("save_form");
    save_form.style.visibility = "hidden";

    var show_form = document.getElementById("show_form");
    show_form.style.visibility = "hidden";

    //Reset total score to 0
    score = 0;
    //Change the game speed
    gameSpeed = 100;
    //Change game state to building map
    gameState = BUILD_MAP;
    //Update the game
    update();
}

//Create cookie
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }

    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
}
