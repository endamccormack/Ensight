var map;
var marker;
var latID;
var longID;
function initialize() {
  var myLatlng;
  if(document.getElementById(latID).value != '' && document.getElementById(longID).value != '')
  {
      myLatlng = new google.maps.LatLng(document.getElementById(latID).value,document.getElementById(longID).value);
      var mapOptions = {
        zoom: 15 ,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      
  }
  else
  {
      myLatlng = new google.maps.LatLng(53.422628,-7.756348);
      var mapOptions = {
        zoom: 6 ,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
   if(document.getElementById(latID).value != '' && document.getElementById(longID).value != '')
  {
  marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP
    });
  }
  map.setCenter(location);
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