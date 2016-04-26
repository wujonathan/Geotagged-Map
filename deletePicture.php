<?php
/*Deletes an event from the database after getting the post vairable of event id from the ajax request*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';
require 'csrf_detector.php';

$eventID=$mysqli->real_escape_string($_POST['pictureID']);

//inset code to delete all comments associated with pic
//make array of comment id's and itterate through with deleteComment.php

$stmt = $mysqli->prepare("DELETE FROM pictures WHERE id=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('i',$eventID);
$stmt->execute();
$stmt->close();

echo json_encode(array(	     	        
	"success" => true
	));				
exit;

?>