<?php
/*Fetches all of the information needed to generate all the markers and the content of those markers. Echos an array with picture information and comment arrays as entries*/
header("Content-Type: application/json");

require 'database.php';
require 'user_agent_test.php';

//fetches the picture info
$pictures_array=array();
$stmt = $mysqli->prepare("SELECT latitude, longitude, id, path, description, added, user_id, tag FROM pictures");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error						));
	exit;
}
$stmt->execute();
$stmt->bind_result($latitude, $longitude, $picture_id, $path, $description, $added, $user_id, $tag);
while($stmt->fetch()){
	$status =  array("picture_id" => htmlspecialchars($picture_id), "lat" => htmlspecialchars($latitude), "lng" =>htmlspecialchars($longitude), "path" => htmlspecialchars($path),"desc" => htmlspecialchars($description),"added" => htmlspecialchars($added),"user_id" => htmlspecialchars($user_id), "tag" => htmlspecialchars($tag), "comments" => '');		
	array_push($pictures_array, $status);
}
$stmt->close();

for($i=0;$i<sizeof($pictures_array);$i++){

	//fetches the comments associated with each picture
	$comment_array=array();
	$stmt2 = $mysqli->prepare("SELECT id, comment, added, user_id FROM comments WHERE picture_id = ?");
	if(!$stmt2){
		echo json_encode(array(
			"success" => false,
			"message" => $mysqli->error						));
		exit;
	}
	$stmt2->bind_param('i', $pictures_array[$i]["picture_id"]);
	$stmt2->execute();
	$stmt2->bind_result($comment_id, $comment, $addedComment, $this_user_id);
	while($stmt2->fetch()){
		$status2 =  array("comment_id" => htmlspecialchars($comment_id), "comment" => htmlspecialchars($comment), "added" =>htmlspecialchars($added), "user_id"=>htmlspecialchars($this_user_id));		
		array_push($comment_array, $status2);
	}
	$stmt2->close();
	$pictures_array[$i]["comments"]=$comment_array;
}
echo json_encode($pictures_array);

?>