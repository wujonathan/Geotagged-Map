<?php
/*Deletes the image from the server using variables from the ajax doesn't need to check file because the flow*/
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';
$filename=$_POST['path'];
$full_path = sprintf("/home/wu.jonathan/public_html/CP/cp_pictures/%s", $filename);
$cmd = "rm ".$full_path;
shell_exec ($cmd);
echo json_encode(array(                
  "success" => true
  ));   
exit;
?>