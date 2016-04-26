<?php
/*Adds an event to the database after getting the post variables from the ajax request. Adds events to other group users if they exist*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';

$path=$mysqli->real_escape_string($_POST['path']);
$lat=$mysqli->real_escape_string($_POST['lat']);
$lng=$mysqli->real_escape_string($_POST['lng']);
$user_id=$_SESSION['user_id'];
$description=$mysqli->real_escape_string($_POST['description']);

		//Inserts into database
$stmt = $mysqli->prepare("INSERT INTO pictures (path, latitude, longitude, user_id, description) VALUES (?, ?, ?, ?, ?)");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('sddis',$path, $lat, $lng, $user_id, $description);
$stmt->execute();
$stmt->close();

echo json_encode(array(	     	        
	"success" => true
	));				
exit;

?>