document.addEventListener("DOMContentLoaded", homeload);

var usrname;
var usrId;

function load(){
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(38.64806723893503, -90.30880584275044),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var pdata;
	$.ajax({type:'POST', url: 'fetchInfo.php', data: pdata, dataType: 'json', success: function(response) {

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		var content = new Array();

		for (i = 0; i < response.length; i++) {  

			var pdata={
				picture_id : response[i].picture_id
			};

			var path = 'cp_pictures/'+response[i].path.substring(14);

			content[i] = '<div> '+ response[i].added;

			if(usrId == response[i].user_id){
				content[i]+= '<input id="deletePicture" data-picId="'+response[i].picture_id+'" type="button" name="removePic" value="Delete"/>';
			};
			content[i] +='<div class=content><img border="0" align="Left" src="'+path+'"></div>';
			content[i] += '<div class=description>'+response[i].desc+'</div>';
			content[i] += '<div class=comments';
			var j;
			for(j=0;j<response[i].comments.length;j++){
				content[j] +='<div class=time>'+response[j].comments.added;
				if(usrId === response[j].comments.this_user_id){
					content[i] += '<input id="deleteComment" data-comId="'+response[i].comments.comment_id+'" type="button" name="removePic" value="Delete"/>';
				}
				content[i] += '</div>';
				content[i] +='<div class=comment>'+response[i].comments.comment+'</div>';
			}
			content[i] += '</div>';
			content[i] += '</div>';
			content[i] += '<div class=addCom>';
			content[i] += '<textarea rows="4" cols="10" name="comment" class="comment" data-picId='+response[i].picture_id+' placeholder="Enter Comment Here..."></textarea><br>';
			content[i] += '<input class="submitComment" type="button" value="Add Comment"/>';
			content[i] += '</div>';

			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].lat, response[i].lng),
				map: map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					map.panTo(marker.position);
					infowindow.setContent(content[i]);
					infowindow.open(map, marker);
				}
			})(marker, i));
		}
	}});
google.maps.event.addListener(map, 'click', function(event) {
	$("#lat").val(event.latLng.lat());
	$("#lng").val(event.latLng.lng());
});
}

function homeload(){

	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: new google.maps.LatLng(38.64806723893503, -90.30880584275044),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	var pdata;
	$.ajax({type:'POST', url: 'fetchInfo.php', data: pdata, dataType: 'json', success: function(response) {

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		var content = new Array();

		for (i = 0; i < response.length; i++) {  

			var pdata={
				picture_id : response[i].picture_id
			};

			var path = 'cp_pictures/'+response[i].path.substring(14);

			content[i] = '<div> '+ response[i].added;

			content[i] +='<div class=content><img border="0" align="Left" src="'+path+'"></div>';
			content[i] += '<div class=description>'+response[i].desc+'</div>';
			content[i] += '<div class=comments';
			var j;
			for(j=0;j<response[i].comments.length;j++){
				content[j] +='<div class=time>'+response[j].comments.added;
				
				content[i] += '</div>';
				content[i] +='<div class=comment>'+response[i].comments.comment+'</div>';
			}
			content[i] += '</div>';
			content[i] += '</div>';

			marker = new google.maps.Marker({
				position: new google.maps.LatLng(response[i].lat, response[i].lng),
				map: map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					map.panTo(marker.position);
					infowindow.setContent(content[i]);
					infowindow.open(map, marker);
				}
			})(marker, i));
		}
	}});
}



function toggleState(item){
	if($(item).attr("data-tog") == "0") {
		$(item).attr("data-tog","1");
	} 
	else {
		$(item).attr("data-tog", "0");
	}
}

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

$("#submitNewPicture").click( function(){
	var path = $("#uploadedfile").val();
	var lat = $("#lat").val();
	var lng = $("#lng").val();
	var desc = $("#desc").val();
	if (desc === "" || path==="" || lat==="" || lng===""){
		return;
	}
	var pdata = {
		lat : lat,
		lng : lng,
		path : path,
		description : desc
	};
	$.ajax({type:'POST', url: 'addPicture.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 

			var file_data = $('#uploadedfile').prop('files')[0];   
			var form_data = new FormData();                  
			form_data.append('uploadedfile', file_data);                           
			$.ajax({url: 'uploadPic.php', dataType: 'json', cache: false, contentType: false, processData: false, data: form_data, type: 'post', success: function(response){
				if(response.success){
					$("#uploadedfile").val("");
					$("#lat").val("");
					$("#lng").val("");
					$("#desc").val("");
					load();
				}
			}
		});
		}
	}
});
});

$(".submitComment").click( function(){
	var comment = $("#comment").val();
	var picture_id = $(this).attr('data-picId');
	var user_id = usrId;
	if (comment === ""){
		return;
	}
	var pdata = {
		comment : comment,
		picture_id : picture_id,
		user_id : user_id
	};
	$.ajax({type:'POST', url: 'addComment.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			$("#uploadfile_input").val("");
			$("#lat").val("");
			$("#lng").val("");
			$("#desc").val("");
			load();
		}
	}
});
});

$(".deletePicture").click( function(){
	var picture_id = $(this).attr("data-picId");
	var pdata = {
		picture_id : picture_id
	};
	$.ajax({type:'POST', url: 'deletePicture.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			load();
		}
	}
});
});

$(".deleteComment").click( function(){
	var comment_id = $(this).attr("data-comId");
	var pdata = {
		comment_id : comment_id
	};
	$.ajax({type:'POST', url: 'deleteComment.php', data: pdata, dataType: 'json', success: function(response) {
		if(response.success){ 
			load();
		}
	}
});
});