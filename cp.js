document.addEventListener("DOMContentLoaded", homeload);

var usrname;
var usrId;
var token;
var markers = [];
var content = [];
var centerLat;
var centerLng;
var map;
var infowindow;
var tag;

//This functoon loads the map when the website is first loaded
function homeload(){
	//Centers at WashU
	centerLat=38.64806723893503;
	centerLng=-90.30880584275044;
	tag = "all";
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(centerLat, centerLng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var pdata;
	$.ajax({type:'POST', url: 'fetchInfo.php', data: pdata, dataType: 'json', success: function(response) {

		infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < response.length; i++) {  
			//Creates each of the contents for each marker
			var path = 'cp_pictures/'+response[i].path.substring(14);

			content[i] = '<div> ' + response[i].added;
			content[i] +='<div class=content><img border="0" align="Left" src="'+path+'"></div>';
			content[i] += '<div class=description>'+response[i].desc+'</div>';
			content[i] += '</div>';
			content[i] += '<div class=comments>';
			var j;
			for(j=0;j<response[i].comments.length;j++){
				content[i] +='<div class=comment>'+response[i].comments[j].comment+'</div>';
				content[i] +=' <div class=time>'+response[i].comments[j].added + '</div>';
			}
			content[i] += '</div>';

			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].lat, response[i].lng),
				map: map
			});
			markers[i] = marker;
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					map.panTo(marker.position);
					infowindow.setContent(content[i]);
					infowindow.open(map, marker);
				};
			})(marker, i));
		}
	}});
//Updates the center for future loading
google.maps.event.addListener(map, "center_changed", function() {
	centerLat=map.getCenter().lat();
	centerLng=map.getCenter().lng();
});
}

//This function relaods the map
function load(){
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(centerLat, centerLng),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var pdata;
	$.ajax({type:'POST', url: 'fetchInfo.php', data: pdata, dataType: 'json', success: function(response) {

		var infowindow = new google.maps.InfoWindow();

		var marker, i;
		//Loads all the markers
		if(tag==="all"){
			for (i = 0; i < response.length; i++) {  
			//Creates each of the contents for each marker
			var path = 'cp_pictures/'+response[i].path.substring(14);

			content[i] = '<form ><div> ' + response[i].added;

			if(usrId == response[i].user_id){
				content[i]+= '<input data-picPath="'+response[i].path.substring(14)+'" data-picId="'+response[i].picture_id+'" onclick="return deletePicture(this);" class="delete" type="button" value="Delete Picture"/>';
			}
			content[i] +='<div class=content><img border="0" align="Left" src="'+path+'"></div>';
			content[i] += '<div class=description>'+response[i].desc+'</div>';
			content[i] += '</div>';
			content[i] += '<div class=comments>';
			var j;
			for(j=0;j<response[i].comments.length;j++){
				content[i] +='<div class=comment>'+response[i].comments[j].comment+'</div>';
				content[i] +=' <div class=time>'+response[i].comments[j].added;
				if(usrId == response[i].comments[j].user_id){
					content[i] += '<input data-comId="'+response[i].comments[j].comment_id+'" onclick="return deleteComment(this);" class="delete" type="button" value="Delete Comment"/>';
				}
				content[i] += '</div>';
			}
			content[i] += '</div>';
			content[i] += '<div class=addCom>';
			content[i] += '<textarea rows="4" cols="10" name="comment" id="comment" placeholder="Enter Comment Here..."></textarea><br>';
			content[i] += '<input data-iVal="'+i+'" data-picId="'+response[i].picture_id+'" onclick="return addCommentForm(this);" class="submitComment" type="button" value="Add Comment"/>';
			content[i] += '</div></form>';

			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].lat, response[i].lng),
				map: map
			});
			markers[i] = marker;
			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					map.panTo(marker.position);
					infowindow.setContent(content[i]);
					infowindow.open(map, marker);
				};
			})(marker, i));
		}

	}
	else{
		//Only loads markers associated with the selected tag
		for (i = 0; i < response.length; i++) {  
			//Creates each of the contents for each marker
			if(tag===response[i].tag){
				var path = 'cp_pictures/'+response[i].path.substring(14);

				content[i] = '<form ><div> ' + response[i].added;

				if(usrId == response[i].user_id){
					content[i]+= '<input data-picPath="'+response[i].path.substring(14)+'" data-picId="'+response[i].picture_id+'" onclick="return deletePicture(this);" class="delete" type="button" value="Delete Picture"/>';
				}
				content[i] +='<div class=content><img border="0" align="Left" src="'+path+'"></div>';
				content[i] += '<div class=description>'+response[i].desc+'</div>';
				content[i] += '</div>';
				content[i] += '<div class=comments>';
				var j;
				for(j=0;j<response[i].comments.length;j++){
					content[i] +='<div class=comment>'+response[i].comments[j].comment+'</div>';
					content[i] +=' <div class=time>'+response[i].comments[j].added;
					if(usrId == response[i].comments[j].user_id){
						content[i] += '<input data-comId="'+response[i].comments[j].comment_id+'" onclick="return deleteComment(this);" class="delete" type="button" value="Delete Comment"/>';
					}
					content[i] += '</div>';
				}
				content[i] += '</div>';
				content[i] += '<div class=addCom>';
				content[i] += '<textarea rows="4" cols="10" name="comment" id="comment" placeholder="Enter Comment Here..."></textarea><br>';
				content[i] += '<input data-iVal="'+i+'" data-picId="'+response[i].picture_id+'" onclick="return addCommentForm(this);" class="submitComment" type="button" value="Add Comment"/>';
				content[i] += '</div></form>';

				marker = new google.maps.Marker({
					position: new google.maps.LatLng(response[i].lat, response[i].lng),
					map: map
				});
				markers[i] = marker;
				google.maps.event.addListener(marker, 'click', (function(marker, i) {
					return function() {
						map.panTo(marker.position);
						infowindow.setContent(content[i]);
						infowindow.open(map, marker);
					};
				})(marker, i));
			}
		}
	}
}});
//Gets the lat and lng for submitting a picture
google.maps.event.addListener(map, 'click', function(event) {
	$("#lat").val(event.latLng.lat());
	$("#lng").val(event.latLng.lng());
});
//Updates the center for future loading
google.maps.event.addListener(map, "center_changed", function() {
	centerLat=map.getCenter().lat();
	centerLng=map.getCenter().lng();
});
}

//This function adds a comment when the form is submitted
function addCommentForm(el){
	var formdata = $(el);
	var siblings = formdata.siblings();
	var comments= $(siblings[0]).val();
	var picture_id = $(el).attr('data-picId');
	var user_id = usrId;
	var i=$(el).attr('data-iVal');
	if (comments === "") {
		return;
	}
	var pdata = {
		comment : comments,
		picture_id : picture_id,
		user_id : user_id
	};
	$.ajax({
		type: 'POST', url: 'addComment.php', data: pdata, dataType: 'json', success: function (response) {
			load();
			setTimeout(function(){
				infowindow = new google.maps.InfoWindow();
				infowindow.setContent(content[i]);
				infowindow.open(map, markers[i]);
			},1000);
		}
	});
	return false;
}

//This function deletes a picture from both the database and the server
function deletePicture(el){
	var picture_id = $(el).attr("data-picId");
	var path = $(el).attr("data-picPath");
	var pdata = {
		picture_id : picture_id,
		token : token
	};
	$.ajax({type:'POST', url: 'deletePicture.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			var sdata = {
				path : path
			};
			$.ajax({url: 'deletePic.php', dataType: 'json', data: sdata, type: 'post', success: function(response){
				if(response.success){
					load();
				}
			}
		});
		}
	}
});
	return false;

}

//This function deletes a comment from the database
function deleteComment(el){
	var comment_id = $(el).attr("data-comId");
	var pdata = {
		comment_id : comment_id,
		token : token
	};
	$.ajax({type:'POST', url: 'deleteComment.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			load();
		}
	}
});
	return false;

}

//Helper function used for dealing with the logins
function toggleState(item){
	if($(item).attr("data-tog") == "0") {
		$(item).attr("data-tog","1");
	} 
	else {
		$(item).attr("data-tog", "0");
	}
}

//Displays a random image as well as its content
$("#viewRandom").click( function(){
	if(tag!="all"){
		tag="all"
		load();
	}
	if(markers.length>0){
		if(infowindow){
			infowindow.close();
		}
		var i = Math.floor((Math.random() * markers.length));
		infowindow = new google.maps.InfoWindow();
		map.panTo(markers[i].position);
		infowindow.setContent(content[i]);
		infowindow.open(map, markers[i]);
	}
});

//Displays the login form
$("#login").click( function(){
	var neighbor = $("#createUser");
	if ($(neighbor).attr("data-tog") == "1"){
		$(".userCreateDetails").hide();
		toggleState(neighbor);
	}
	if ($(this).attr("data-tog") == "0"){
		$(".userLoginDetails").show();
	}
	else{
		$(".userLoginDetails").hide();
	}
	toggleState(this);
});

//Displays the create user form
$("#createUser").click( function(){
	var neighbor = $("#login");
	if ($(neighbor).attr("data-tog") == "1"){
		$(".userLoginDetails").hide();
		toggleState(neighbor);
	}
	if ($(this).attr("data-tog") == "0"){
		$(".userCreateDetails").show();
	}
	else{
		$(".userCreateDetails").hide();
	}
	toggleState(this);
});

//Submits the login form and reloads the page
$("#submitLogin").click( function(){
	usrname = $("#username").val();
	var usrpass = $("#password").val();
	var pdata = {
		username : usrname,
		password : usrpass
	};
	if (usrname === "" || usrpass === ""){
		$("#loginUserMsg").empty();
		$("#loginUserMsg").append('<div class="failText">Invalid Username or Password</div>');
		return;
	}
	$.ajax({type:'POST', url: 'login.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			token=response.token;
			$("#loggedUser").attr("data-tog","1");
			$(".userLoginDetails").hide();
			$(".logins").hide();
			$(".logouts").show();
			$(".addPicture").show();
			$("#loginUserMsg").empty();
			$("#userlogin")[0].reset();
			$("#loggedUser").append('<div>Hello '+usrname+'!</div>');
			usrId=response.usrId;
			toggleState($("#login"));
			load();
		}
		else{
			$("#loginUserMsg").empty();
			$("#loginUserMsg").append('<div class="failText">'+response.message+'</div>');
		}
	}
});
});

//Submits the create user form and resets the forms
$("#submitCreateUser").click( function(){
	var newusrname = $("#newUsername").val();
	var newusrpass = $("#newPassword").val();
	if (newusrname === "" || newusrpass === ""){
		$("#userCreateMsg").empty();
		$("#userCreateMsg").append('<div class="failText">Invalid Username or Password</div>');
		return;
	}
	var pdata = {
		newUsername : newusrname,
		newPassword : newusrpass
	};
	$.ajax({type:'POST', url: 'createUser.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			$("#userCreateMsg").empty();
			$("#userCreateMsg").append('<div class="successText">Success!!</div>');
			setTimeout(function() {
				$(".userCreateDetails").fadeOut(300);
				$("#userCreateMsg").empty();
				$("#userCreate")[0].reset();
			},1000);
			toggleState($("#createUser"));
		}
		else{
			$("#userCreateMsg").empty();
			$("#userCreateMsg").append('<div class="failText">'+response.message+'</div>');
		}
	}
});
});

//Reset elements and load the default
$("#logout").click( function(){
	$.ajax({type:'POST', url: 'logout.php', dataType: 'json', success: function(response) {
		if(response.success){
			$(".logouts").hide();
			$(".logins").show();
			$(".addPicture").hide();
			$("#loggedUser").empty();
			$("#loggedUser").attr("data-tog","0");
			homeload();
		}}
	});
});

//Submits a new picture to both the database and the server; resets the related fields
$("#submitNewPicture").click( function(){
	var path = $("#uploadedfile").val();
	var lat = $("#lat").val();
	var lng = $("#lng").val();
	var desc = $("#desc").val();
	var tag;
	var tags=document.getElementsByName("tags");
	for(var i=0; i<tags.length;i++){
		if(tags[i].checked){
			tag=tags[i].value;
			break;
		}
	}
	if (desc === "" || path==="" || lat==="" || lng===""){
		return;
	}
	var pdata = {
		lat : lat,
		lng : lng,
		path : path,
		description : desc,
		tag : tag
	};
	var file_data = $('#uploadedfile').prop('files')[0];   
	var form_data = new FormData();                  
	form_data.append('uploadedfile', file_data); 
	$.ajax({url: 'uploadPic.php', dataType: 'json', cache: false, contentType: false, processData: false, data: form_data, type: 'post', success: function(response){
		if(response.success){
			$("#newPicture")[0].reset();
			$.ajax({type:'POST', url: 'addPicture.php', data: pdata, dataType: 'json', success: function(response) {
				if(response.success){ 
					load();
				}
			}
		});
		}
	}
});
});

//Displays the funny pictures
$("#tagFunny").click( function(){
	tag="funny";
	load();
});

//Displays the animal pictures
$("#tagAnimal").click( function(){
	tag="animal";
	load();
});

//Displays the pretty pictures
$("#tagPretty").click( function(){
	tag="pretty";
	load();
});

//Displays all the pictures
$("#tagDisable").click( function(){
	tag="all";
	load();
});


