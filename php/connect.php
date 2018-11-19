
<?php

//Credentials in order to connect to database
$servername = "localhost";
$username = "root";
$password = "somepass";
$dbName = "formula";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbName);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
