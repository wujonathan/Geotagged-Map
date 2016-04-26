<?php
/*Deletes a picture and its associated comments from the database after getting the post vairables from the ajax request*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';
require 'csrf_detector.php';

$picture_id=$mysqli->real_escape_string($_POST['picture_id']);

//delete all comments associated with pic
$stmt = $mysqli->prepare("DELETE FROM comments WHERE picture_id=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('i',$picture_id);
$stmt->execute();
$stmt->close();

//delete the pic itself
$stmt = $mysqli->prepare("DELETE FROM pictures WHERE id=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('i',$picture_id);
$stmt->execute();
$stmt->close();

echo json_encode(array(	     	        
	"success" => true
	));				
exit;

?>