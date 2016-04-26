<?php
/*Deletes an event from the database after getting the post vairable of event id from the ajax request*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';
require 'csrf_detector.php';

$comment_id=$mysqli->real_escape_string($_POST['commet_id']);

$stmt = $mysqli->prepare("DELETE FROM comments WHERE id=?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error
		));
	exit;
}
$stmt->bind_param('i',$comment_id);
$stmt->execute();
$stmt->close();

echo json_encode(array(	     	        
	"success" => true
	));				
exit;

?>