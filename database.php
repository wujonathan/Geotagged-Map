<?php
//This php script is required whenever we need to access the database
$mysqli = new mysqli('localhost', 'cp', 'cp', 'cp'); 
if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>