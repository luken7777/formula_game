<html>
    <head>
        <title>Formula game</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="css/styles.css"/>
    </head>
    <body>

        <div class="game_title">
            <img src="graphic/formula.png">
            <img src="graphic/formula_title.png">
        </div>

        <!-- Main stage -->
        <div class="stage">
            <!-- Game stats -->
            <div class="game_stats">
                <div id="points">POINTS: 0</div>
            </div>
            <!-- Start and try again button(try game once again) -->
            <button id="start_button" type="button" onclick="start()">Start</button>
            <button id="again_button" type="button" onclick="tryAgain()">Try again !</button>
            <!-- Save form to save your score into database -->
            <form id="save_form" method="POST" action="php/saveToDatabase.php">
                <input id="player_name"  type="text" disabled="disabled" name="player_name" placeholder="Your name ..." required>
                <input id="save_button" type="submit" disabled="disabled" name="save_button" value="Save score">
            </form>
            <!-- Show form to see players scores -->
            <form id="show_form" method="POST" action="php/selectFromDatabase.php">
                <input id="show_button" type="submit" name="show_button" value="Show scores">
            </form>
            <!-- Canvas stage for the game -->
            <canvas width="330" height="616" style="border: 2px solid black; background-color: white"></canvas>
        </div>

        <!-- Calling object.js -->
        <script src="js/objects.js"></script>
        <script src="js/game.js"></script>
    </body>
</html>
