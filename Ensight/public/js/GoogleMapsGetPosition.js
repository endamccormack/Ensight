var map;
var marker;
var latID;
var longID;
function initialize() {
  var myLatlng;
  if(    document.getElementById(latID).value != '' && document.getElementById(longID).value != '')
  {
      myLatlng = new google.maps.LatLng(document.getElementById(latID).value,document.getElementById(longID).value);
  }
  else
  {
      myLatlng = new google.maps.LatLng(53.422628,-7.756348);
  }
  var mapOptions = {
    zoom: 6,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  if (marker != null) {marker.setMap(null);}
      
      marker = new google.maps.Marker({
      position: new google.maps.LatLng(document.getElementById(latID).value,document.getElementById(longID).value),
      map: map,
      animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(map, 'click', function(event) {
    placeMarker(event.latLng);
  });
}

function placeMarker(location) {
      
      if (marker != null) {marker.setMap(null);}
      
      marker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.DROP
  });

  map.setCenter(location);
  
  document.getElementById(latID).value = (location.toString().slice(1,(location.toString().length - 1))).split(",")[0];
  document.getElementById(longID).value = (location.toString().slice(1,(location.toString().length - 1))).split(",")[1];
}


function loadScript(theLatitudeID, theLongtitudeID) {
    latID = theLatitudeID
    longID = theLongtitudeID
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAFaMgyNCb_5sdcjmh5AbhG2B-eaCjsN5Y&sensor=true&callback=initialize";
    //key in this is my API key, get another one because I have loads of things linked to it and a limit that if it 
    //goes over I have to pay money, use it for testing if you like but change before production
    document.body.appendChild(script);
  }

 // window.onload = loadScript;