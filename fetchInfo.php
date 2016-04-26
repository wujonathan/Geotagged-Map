<?php
/*fetches user events to load the calendar. This includes personal events, shared calendar events to the user as well as invited events*/
header("Content-Type: application/json");

require 'database.php';
require 'user_agent_test.php';


$pictures_array=array();
$stmt = $mysqli->prepare("SELECT latitude, longitude, id, path, description, added, user_id FROM pictures");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error						));
	exit;
}
$stmt->execute();
$stmt->bind_result($latitude, $longitude, $picture_id, $path, $description, $added, $user_id);
while($stmt->fetch()){
	$status =  array("picture_id" => htmlspecialchars($picture_id), "lat" => htmlspecialchars($latitude), "lng" =>htmlspecialchars($longitude), "path" => htmlspecialchars($path),"desc" => htmlspecialchars($description),"added" => htmlspecialchars($added),"user_id" => htmlspecialchars($user_id), "comments" => '');		
	array_push($pictures_array, $status);
}
$stmt->close();

for($i=0;$i<sizeof($pictures_array);$i++){
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
	//echo json_encode($comment_array);
	$pictures_array[$i]["comments"]=$comment_array;
}

echo json_encode($pictures_array);

?>