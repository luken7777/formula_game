
<?php
require_once './connect.php';

if (isset($_POST['save_button'])) {
    //Prepare and bind
    $stmt = $conn->prepare("INSERT INTO scores (player, points) VALUES (?, ?)");
    $stmt->bind_param("ss", $player, $points);

    //Set parameters and execute
    $player = $_POST['player_name'];
    $points = $_COOKIE["result"];
    $stmt->execute();
    ?> <h2>Score saved !</h2> <?php
}
//Close statements and connection 
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<head>
    <title>Save score</title>
    <link rel="stylesheet" href="../css/styles2.css"/>
</head>
<body>
    <form id="goBack_form" method="POST" action="../start.php">
        <input id="goBack_button" type="submit" name="goBack" value="Go back">
    </form>
    <!-- Show players stats -->
    <form id="show_form" method="POST" action="selectFromDatabase.php">
        <input id="show_button" type="submit" name="show_button" value="Show scores">
    </form>
</body>
