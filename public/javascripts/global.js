//DOM Ready ====================================================
$(document).ready(function(){
	// Calls geolocation function
	// if (navigator.geolocation){
	// 	navigator.geolocation.getCurrentPosition(getGeolocation,showGeoError);
	// 	$('#debug').append('Got location');
	// }
	// else {
	// 	$('#debug').html('Geolocation is not supported by this browser.');
	// }

	// fires google analytics
	_gaq.push(['_setAccount', 'UA-57697023-1']);
	_gaq.push(['_trackPageview']);


	//update user button click
	$('#inputBusNumber').keyup(function(event){
		if(event.keyCode == 13){
			$('#btnSubmit').click();
		}
	});
	$('#btnSubmit').on('click', getBusInfo);
});

//Google Maps Stuff ============================================
//creating map object
function drawMap(){
	//initialize map
	var mapOptions ={
		center: new google.maps.LatLng(41.8760545,-87.6744772),
		zoom: 12
	};

	//create the map opbject
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);
}

	google.maps.event.addDomListener(window, 'load', drawMap);


//Geolocation ====================================================
// Position getting function using HTML5 Geolocation
function getGeolocation(position){
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}

// Error function for position-getting
function showGeoError(error){
	switch(error.code) {
		case error.PERMISSION_DENIED:
			$('#debug').html('User denied the request for Geolocation.');
			break;
		case error.POSITION_UNAVAILABLE:
			$('#debug').html('Location information is unavailable.');
			break;
		case error.TIMEOUT:
			$('#debug').html('The request to get user location timed out.');
			break;
		case error.UNKNOWN_ERROR:
			$('#debug').html('An unknown error occurred.');
			break;
	}
}


//CTA Bus Stuff ===================================================
function getBusInfo(){
	//check if bus number field is blank
	var busId = $('#inputBusNumber').val();

	if (busId === ''){
		alert('Please enter a bus number');
	}

	//hit cta API to get bus info
	else{
		_gaq.push(['_trackEvent', 'Bus Search', 'Search', busId]);

		$.ajax({
			url:'/businfo/'+busId,
		}).done(function(response){

			//if the "vehicle" element is found
			if(typeof response['bustime-response'].vehicle != 'undefined'){
				$('#debug').html(
					'Bus Number: '+response['bustime-response'].vehicle[0].vid+
					'</br>Route '+response['bustime-response'].vehicle[0].rt+
					' to '+response['bustime-response'].vehicle[0].des);
				var myLatlng = new google.maps.LatLng(response['bustime-response'].vehicle[0].lat,response['bustime-response'].vehicle[0].lon);
				
				//sets and draws the bus marker
				var marker = new google.maps.Marker({
					position: myLatlng,
					map: map,
					title:'Bus Number: '+response['bustime-response'].vehicle[0].vid
				});

				//sets info window for bus marker
				var contentString = 'Bus Number: '+response['bustime-response'].vehicle[0].vid+
					'</br>Route '+response['bustime-response'].vehicle[0].rt+
					' to '+response['bustime-response'].vehicle[0].des;
				var infoWindow = new google.maps.InfoWindow({
					content: contentString
				});

				google.maps.event.addListener(marker, 'click', function() {
					infoWindow.open(map,marker);
				});

				//zooms in and moves to the location of the marker
				map.panTo(myLatlng);
				map.setZoom(15);
				infoWindow.open(map,marker);

			}
			//otherwise error
			else{
				$('#debug').html('<br>ERROR <br>'+response['bustime-response'].error[0].msg);
			}
		});


	}
}

//Google Analytics Setup =======================================
var _gaq = _gaq || [];


(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();