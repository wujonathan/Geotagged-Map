<?php
/*Adds an event to the database after getting the post variables from the ajax request. Adds events to other group users if they exist*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';

$comment=$_POST['comment'];
$picture_id=$_POST['picture_id'];
$user_id=$_POST['user_id'];

		//Inserts into database
$stmt = $mysqli->prepare("INSERT INTO comments (comment, picture_id, user_id) VALUES (?, ?, ?)");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('sii',$comment, $picture_id, $user_id);
$stmt->execute();
$stmt->close();

echo json_encode(array(	     	        
	"success" => true
	));				
exit;

?>