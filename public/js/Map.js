var map;
var dataType;

var clientSites, inspectionPoints; // Store the results of database queries
var testSourcesLatestData; // Ditto, but a join
var markers = new Array(); // Holds the markers that appear on the map
var infoWindows = new Array(); // Holds the InfoWindows that appear for each marker
var imgStr; // Filename of marker
var centerLocation; // To hold center for recentering map

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
	}
	var theImgs=new Array("Red.png", "Orange.png", "Green.png" );

	
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
		// Create a reinitialise button
		/*var reInit = document.createElement("button");
		reInit.innerHTML="Reinitialise";
		reInit.onclick=window.location.reload();//refresh page
		document.body.appendChild(reInit);*/
	}

	//when the page loads fire the loadScript
	window.onload = loadScript;

	function doStuff()
	{
		$( "#historicgraph" ).css("opacity", 1);
	 $( "#livegraph" ).css("opacity", 1);
	  $( "#status" ).css("opacity", 1);
	  
	 $("#map").animate({"height": "350px"}, "slow").animate({"width": "500px"}, "slow").css("position", "relative"),
	  $("#mapContainer").animate({"width": "500px"}, "slow").animate({"height": "320px"}, "slow",function(){
	  	// This reinitializes the map when resized
  		setTimeout(function(){google.maps.event.trigger(map, 'resize')}, 1000);
		
	 });
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
						id: markers.length, // needed to inform the corresponding InfoWindow to appear
						clientSiteID: clientSites[i].id,
						infoWindow: null,
						title: clientSites[i].clientSiteName + ", " + clientSites[i].clientSiteAddress,
						position: new google.maps.LatLng(clientSites[i].clientSiteLocationLatitude,clientSites[i].clientSiteLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP, // marker animation
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, /* size is determined at runtime */
							null, /* origin is 0,0 */
							null, /* anchor is bottom center of the scaled image */
							new google.maps.Size(50, 50)//resolution of the image
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
		            doInfoWindows(i);
				}
				break;

			// -------------------------------------------------------------------------------------------------

			case "inspectionPoint":
				clearMarkerListeners();			
				$.getJSON("/JsonRequest/findGetInspectionPoints", function (data) {
				inspectionPoints = data;

				for(var i = 0; i< inspectionPoints.length; i++)
				{
					if (inspectionPoints[i].clientSite_id == id)
					{
						imgStr = "/assets/Green.png";
						markers.push(new google.maps.Marker({
						id: markers.length, // needed to inform the corresponding InfoWindow to appear
						inspectionPointID: inspectionPoints[i].id,
						title: inspectionPoints[i].inspectionPointDescription,
						position: new google.maps.LatLng(inspectionPoints[i].inspectionPointLocationLatitude,inspectionPoints[i].inspectionPointLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, /* size is determined at runtime */
							null, /* origin is 0,0 */
							null, /* anchor is bottom center of the scaled image */
							new google.maps.Size(50, 50)//resolution of the image
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
						doStuff();
						map.setCenter(this.getPosition());
						Historic(i);
						Live(i);
						//google.maps.event.trigger(map, 'resize');
						setTimeout(function(){google.maps.event.trigger(map, 'resize')}, 1000);
						centerLocation = this.getPosition();
						setTimeout(function(){map.setCenter(centerLocation);}, 1000);
						});
		            doInfoWindows(i);
				}
				});
				break;
			
			// -------------------------------------------------------------------------------------------------
			
			case "testSource":
				clearMarkerListeners();
				showProgress();
				
				$.getJSON("/JsonRequest/findGetTestSources", function (data) {
				testSourcesLatestData = data;

				for(var i = 0; i< testSourcesLatestData.length; i++)
				{
					if (testSourcesLatestData[i].inspectionPoint_id == id)
					{
						imgStr = "/assets/Green.png";
						markers.push(new google.maps.Marker({
						id: markers.length, // needed to inform the corresponding InfoWindow to appear
						testSourceID: testSourcesLatestData[i].testSource_id,
						title: testSourcesLatestData[i].testSourceLocationDescription + "\nLower limit: " + 
								testSourcesLatestData[i].testSourceLowerLimit + "\nUpper limit: " + testSourcesLatestData[i].testSourceUpperLimit,
						testSourceLocationDescription: testSourcesLatestData[i].testSourceLocationDescription,
						reading: testSourcesLatestData[i].reading,
						lowerLimit: testSourcesLatestData[i].testSourceLowerLimit,
						upperLimit: testSourcesLatestData[i].testSourceUpperLimit,
						position: new google.maps.LatLng(testSourcesLatestData[i].testSourceLocationLatitude,testSourcesLatestData[i].testSourceLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, 
							null, 
							null, 
							new google.maps.Size(50, 50)//resolution of the image
						   )
						}));
					}
				}

				//add the markers to the map
			  	for(var i = 0; i < markers.length; i++)
  				{
  					markers[i].setMap(map);
					google.maps.event.addListener(markers[i], 'click', function() {
						});
					doInfoWindows(i);
				}
				});
				addColoredMarkers(id);
				break;

			default:
				alert("error");
		}
	}

    function doInfoWindows(i)
    {
        infoWindows.push(new google.maps.InfoWindow({ content: markers[i].title }));
        markers[i].infoWindow = infoWindows[i];

        google.maps.event.addListener(markers[i], 'mouseover', function () {
            //infoWindows[this.id].open(map, this);
        });
        google.maps.event.addListener(markers[i], 'mouseout', function () {
            //this.infoWindow.close();
        });
    }

	function clearMarkerListeners()
	{				
		if (markers.length > 0)
			{
				for(var i = 0; i < markers.length; i++)
  				{
					google.maps.event.clearListeners(markers[i], 'click');
					markers[i].setMap(null);
				infoWindows[i].close(); // remove the corresponding InfoWindow
			}
			markers = new Array();
			infoWindows = new Array();
		}
	}

	function placeholderFunction() // This does nothing
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
			animation: google.maps.Animation.DROP,
			icon: new google.maps.MarkerImage( 
				theImgs[0],//the image url string
				null, /* size is determined at runtime */
				null, /* origin is 0,0 */
				null, /* anchor is bottom center of the scaled image */
				new google.maps.Size(50, 50)//resolution of the image
			   )
			});
			//alert(clientSites[i].clientSiteLocationLongtitude + " and " + clientSites[i].clientSiteLocationLatitude);
		}
	}

	function addColoredMarkers(ip_id)
	{
		$.getJSON("/JsonRequest/findGetTestSourceid?inspectionPoint_id=" + ip_id, function (data) {

	/*[{"dateTimeReceived":"2013-03-18T18:24:42Z","dateTimeTaken":"2013-03-18T18:24:15Z","inspectionPoint_id":1,
	"parameterType":"Temperature","reading":"5.5","testSourceLocationDescription":"Enda's test source - Sligo",
	"testSourceLocationLatitude":"54.278105","testSourceLocationLongtitude":"-8.496348","testSourceLowerLimit":
	"4.0","testSourceUpperLimit":"25.0","testSource_id":1}]*/

	//JsonRequest/findGetMapColorIndicator?dateTimeTaken='2013-03-18%2018:24:15'&testSourceId=1
	var markers = new Array();

		for(var j = 0;  j < data.length; j++)
		{
			$.getJSON("/JsonRequest/findGetMapColorIndicator?dateTimeTaken='" + data[j].dateTimeTaken + "'&testSourceId=" + data[j].id , function (colorIndData) {
				//alert(colorIndData[0].testSource_id);
				if (parseInt(colorIndData[0].reading) > parseInt(colorIndData[0].testSourceUpperLimit) || parseInt(colorIndData[0].reading) < parseInt(colorIndData[0].testSourceLowerLimit))
					imgStr = "Red.png";
				else
					imgStr = "Green.png";
				markers.push(new google.maps.Marker({
						id: markers.length, // needed to inform the corresponding InfoWindow to appear
						testSourceID: colorIndData[0].testSource_id,
						title: colorIndData[0].testSourceLocationDescription + "\nLower limit: " + 
								colorIndData[0].testSourceLowerLimit + "\nUpper limit: " + colorIndData[0].testSourceUpperLimit,
						testSourceLocationDescription: colorIndData[0].testSourceLocationDescription,
						reading: colorIndData[0].reading,
						lowerLimit: colorIndData[0].testSourceLowerLimit,
						upperLimit: colorIndData[0].testSourceUpperLimit,
						position: new google.maps.LatLng(colorIndData[0].testSourceLocationLatitude,colorIndData[0].testSourceLocationLongtitude),//the position of where it is on map
						animation: google.maps.Animation.DROP,
						icon: new google.maps.MarkerImage( 
							imgStr,//the image url string
							null, 	
							null, 
							null, 
							new google.maps.Size(50, 50)//resolution of the image
						   )
						}));
			});
		}
		//add the markers to the map
	  	for(var i = 0; i < markers.length; i++)
			{
				markers[i].setMap(map);
			google.maps.event.addListener(markers[i], 'click', function() {
				});
			doInfoWindows(i);
		}
	});
	}