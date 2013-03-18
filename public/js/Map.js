
var map;
var theLats;
var theLongs;
var dataType;

var clientSites, inspectionPoints, testSources, testSourceData;
var testSourcesLatestData;
var markers = new Array(); 
var imgStr;

function initialize() {
    var mapOptions = {
        zoom: 7,
        //the level of zoom when it loads, the lower the number the more zoomed out you are
        center: new google.maps.LatLng(53.422628, -7.756348),
        //set the center at the start
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: true
        //these are all the controls, I wanted basic layout so turned most off
    };
	
	
	$.getJSON("/JsonRequest/findGetClientSites", function (data) {
		clientSites = data;
		
    theLats = new Array();
	theLongs = new Array();
	//just 2 arrays with latatudes and longatudes for places

	for (var i = 0; i < clientSites.length; i++)
	{
		if (clientSites[i].clientSiteLocationLongtitude == null)
			clientSites[i].clientSiteLocationLongtitude = 0;
		if (clientSites[i].clientSiteLocationLatitude == null)
			clientSites[i].clientSiteLocationLatitude = 0;

		//theLats.push(clientSites[i].clientSiteLocationLatitude);
		//theLongs.push(clientSites[i].clientSiteLocationLongtitude);
	}
	/*for (var i = 0; i < theLats.length; i++)
	{
		alert(theLats[i] + " asasdasd " + theLongs[i]);
	}*/
	
	var theImgs=new Array("/assets/Red.png", "Orange.png", "/assets/Green.png" );
	//just 3 different custom images these are just place holders do not use, they look rotten!

	//make 3 markers with the positions and images set in the arrays
	

	
	//get the map
  	map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);  	

	//changing the colors and looks of the map, fairly self explanator
	var styles = [
	  {
	    "featureType": "landscape",
	    "stylers": [
	      { "color": "#049cde" }
	    ]
	  },{
	    "featureType": "road.highway",
	    "stylers": [
	      { "hue": "#0099ff" }
	    ]
	  },{
	    "featureType": "water",
	    "stylers": [
	      { "hue": "#00ff4d" },
	      { "color": "#040404" }
	    ]
	  },{
	    "featureType": "road.arterial",
	    "stylers": [
	      { "hue": "#00fff7" }
	    ]
	  }
	];


	//add the styles
	map.setOptions({styles: styles});

	doMarkers("clientSite", null);

	//add the event listeners to the DOM
	//google.maps.event.addDomListener(window, 'load', initialize);
	
});	
}


	//function for what to do when it loads
	function loadScript() {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCkSmiEYiKFMGhOAaCyQfi_ZZKwcsRMufc&sensor=true&callback=initialize";
		//key in this is my API key, get another one because I have loads of things linked to it and a limit that if it 
		//goes over I have to pay money, use it for testing if you like but change before production
		document.body.appendChild(script);
	}

	//when the page loads fire the loadScript
	window.onload = loadScript;

	function doStuff()
	{
		$( "#historicgraph" ).css("opacity", 1);
	 $( "#livegraph" ).css("opacity", 1);
	  $( "#status" ).css("opacity", 1);
	  
	 $("#map").animate({"height": "350px"}, "slow").animate({"width": "500px"}, "slow").css("position", "relative"),
	  $("#mapContainer").animate({"width": "500px"}, "slow").animate({"height": "320px"}, "slow"),function(){
	  	//vip, this is extremely important and took a while to find out, this reinitializes the map when resized
  		google.maps.event.trigger(map, 'resize');
		
	 }
	}

	function doMarkers(type, id)
	{
		switch(type)
		{
			case "clientSite":
				clearMarkerListeners();
				markers = new Array();
				
				for(var i = 0; i < clientSites.length; i++)
				{
					imgStr = "/assets/Green.png";
					markers[i] = new google.maps.Marker({
						clientSiteID: clientSites[i].id,
						title: clientSites[i].clientSiteName + ", " + clientSites[i].clientSiteAddress,
						position: new google.maps.LatLng(clientSites[i].clientSiteLocationLatitude,clientSites[i].clientSiteLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,//just threw in a drop animation because it looks cool
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, /* size is determined at runtime */
							null, /* origin is 0,0 */
							null, /* anchor is bottom center of the scaled image */
							new google.maps.Size(32, 32)//resolution of the image
					   )
					});
				}

				//add the markers to the map
			  	for(var i = 0; i < markers.length; i++)
  				{
					
  					markers[i].setMap(map);
					google.maps.event.addListener(markers[i], 'click', function() {
						var sRes; // search result
						for (var i = 0; i < clientSites.length; i++)
						{
							if (clientSites[i].id == this.clientSiteID) break;
						}
						
						
						doMarkers("inspectionPoint", clientSites[i].id);
						map.setZoom(16);
						map.setCenter(this.getPosition());
						
						});
				}
				break;

			// -------------------------------------------------------------------------------------------------

			case "inspectionPoint":
				clearMarkerListeners();
				markers = new Array();

				$.getJSON("/JsonRequest/findGetInspectionPoints", function (data) {
				inspectionPoints = data;

				for(var i = 0; i< inspectionPoints.length; i++)
				{
					if (inspectionPoints[i].clientSite_id == id)
					{
						imgStr = "/assets/Green.png";
						markers.push(new google.maps.Marker({
						inspectionPointID: inspectionPoints[i].id,
						title: inspectionPoints[i].inspectionPointDescription,
						position: new google.maps.LatLng(inspectionPoints[i].inspectionPointLocationLatitude,inspectionPoints[i].inspectionPointLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,//just threw in a drop animation because it looks cool
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, /* size is determined at runtime */
							null, /* origin is 0,0 */
							null, /* anchor is bottom center of the scaled image */
							new google.maps.Size(32, 32)//resolution of the image
						   )
						}));
					}
				}

				//add the markers to the map
				for(var i = 0; i < markers.length; i++)
				{
					markers[i].setMap(map);
					google.maps.event.addListener(markers[i], 'click', function() {
					
						var sRes; // search result
						for (var i = 0; i < inspectionPoints.length; i++) 
						{
							if (inspectionPoints[i].id == this.inspectionPointID)
								break;
						}
						
						 
						doMarkers("testSource", inspectionPoints[i].id);						
						map.setZoom(17);
						map.setCenter(this.getPosition());
						doStuff()
						
						Historic(i);
						Live(i);
						});
					
				}
				});
				break;
				
			
			// -------------------------------------------------------------------------------------------------
			
			case "testSource":
				clearMarkerListeners();
				markers = new Array();

				$.getJSON("/JsonRequest/findGetTestSources", function (data) {
				testSourcesLatestData = data;

				for(var i = 0; i< testSourcesLatestData.length; i++)
				{
					if (testSourcesLatestData[i].inspectionPoint_id == id)
					{
						if (parseInt(testSourcesLatestData[i].reading) > parseInt(testSourcesLatestData[i].testSourceUpperLimit) || parseInt(testSourcesLatestData[i].reading) < parseInt(testSourcesLatestData[i].testSourceLowerLimit))
							imgStr = "/assets/Red.png";
						else
							imgStr = "/assets/Green.png";
						markers.push(new google.maps.Marker({
						testSourceID: testSourcesLatestData[i].testSource_id,
						testSourceLocationDescription: testSourcesLatestData[i].testSourceLocationDescription,
						reading: testSourcesLatestData[i].reading,
						lowerLimit: testSourcesLatestData[i].testSourceLowerLimit,
						upperLimit: testSourcesLatestData[i].testSourceUpperLimit,
						position: new google.maps.LatLng(testSourcesLatestData[i].testSourceLocationLatitude,testSourcesLatestData[i].testSourceLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,//just threw in a drop animation because it looks cool
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, /* size is determined at runtime */
							null, /* origin is 0,0 */
							null, /* anchor is bottom center of the scaled image */
							new google.maps.Size(32, 32)//resolution of the image
						   )
						}));
					}
				}

				//add the markers to the map
			  	for(var i = 0; i < markers.length; i++)
  				{
  					markers[i].setMap(map);
					google.maps.event.addListener(markers[i], 'click', function() {
						
						alert(this.testSourceLocationDescription + " - Reading: " + this.reading + 
								"\nLower limit: " + this.lowerLimit + 
								"\nUpper limit: " + this.upperLimit);
						});
				}
				});
				break;

			default:
				alert("error");
		}
	}

	function clearMarkerListeners()
	{				
		if (markers.length > 0)
			{
				for(var i = 0; i < markers.length; i++)
  				{
					google.maps.event.clearListeners(markers[i], 'click');
					markers[i].setMap(null);
				}
			}
	}

	function placeholder()
	{
		for(var i = 0; i< clientSites.length; i++)
		{
			alert(clientSites[i].reading + " " + clientSites[i].testSourceUpperLimit);
			alert("W");
			if (clientSites[i].reading > clientSites[i].testSourceUpperLimit || clientSites[i].reading < testSourceLowerLimit)
				imgStr = "/assets/Red.png";
			else
				imgStr = "/assets/Green.png";
			markers[i] = new google.maps.Marker({
			position: new google.maps.LatLng(clientSites[i].clientSiteLocationLatitude,clientSites[i].clientSiteLocationLongtitude),//the position of where it is on map
			animation: google.maps.Animation.DROP,//just threw in a drop animation because it looks cool
			icon: new google.maps.MarkerImage( 
				theImgs[0],//the image url string
				null, /* size is determined at runtime */
				null, /* origin is 0,0 */
				null, /* anchor is bottom center of the scaled image */
				new google.maps.Size(32, 32)//resolution of the image
			   )
			});
			//alert(clientSites[i].clientSiteLocationLongtitude + " and " + clientSites[i].clientSiteLocationLatitude);
		}
	};