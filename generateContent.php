<?php
/*fetches user events to load the calendar. This includes personal events, shared calendar events to the user as well as invited events*/
header("Content-Type: application/json");

require 'database.php';
require 'user_agent_test.php';

$id=$_POST["picture_id"];
if(isset($_SESSION["user_id"])){
$curUser=$_SESSION["user_id"];
}
else{
	$curUser = -1;
}

$stmt = $mysqli->prepare("SELECT path, description, added, user_id FROM pictures WHERE id = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error						));
	exit;
}
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->bind_result($path, $description, $added, $user_id);
$stmt->close();

$comment_array=array();
$stmt = $mysqli->prepare("SELECT comment, added, user_id FROM comments WHERE picture_id = ?");
if(!$stmt){
	echo json_encode(array(
		"success" => false,
		"message" => $mysqli->error						));
	exit;
}
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->bind_result($comment, $added_com, $this_user_id);
while($stmt->fetch()){
	$status =  array("comment" => htmlspecialchars($comment), "added" =>htmlspecialchars($added_com), "this_user_id"=>htmlspecialchars($this_user_id));		
	array_push($comment_array, $status);
}
$stmt->close();

$content = '<div> '.$added;
echo($content);
if($curUser == $user_id){
	$content+= '<input id="deletePicture" type="button" name="removePic" value="Delete"/>';
}

$content2 = '<div class=description>'.$description.'</div>';
$content2 .= '<div class=comments';
for($i=0;$i<sizeof($comment_array);$i++){
	$content2 .='<div class=time>'.$comment_array[$i][added];
	if($_SESSION["user_id"] === $comment_array[$i][this_user_id]){
		$content2 += '<input id="deletePicture" type="button" name="removePic" value="Delete"/>';
	}
	$content2 .= '</div>';
	$content2 .='<div class=comment>'.$comment_array[$i][comment].'</div>';
}
$content2 .= '</div>';
$content2 .= '</div>';
$content2 .= '<div><textarea rows="4" cols="10" name="comment" id="comment" data-pictureId='.$id.' placeholder="Enter Comment Here..."></textarea></div>';

echo($content);
echo($content2);

$allcontent= array("first" => ($content), "second" => ($content2));

echo json_encode($allcontent);

?>