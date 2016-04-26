<?php
header("Content-Type: application/json");
require 'database.php';
require 'user_agent_test.php';

$filename = basename($_FILES['uploadedfile']['name']);
if( !preg_match('/^[\w_\.\-]+$/', $filename) ){
	echo ("Invalid filename");
	exit;
}
$full_path = sprintf("/home/wu.jonathan/public_html/CP/cp_pictures/%s", $filename);
if( move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $full_path) ){
	echo json_encode(array(	     	        
	"success" => true
	));				
exit;
}else{
	echo json_encode(array(	     	        
	"success" => false
	));				
exit;
}
?>