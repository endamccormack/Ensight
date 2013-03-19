
$(document).ready(function($) {
  // Code using $ as usual goes here.
	$.getJSON("/JsonRequest/findGetTestSourceid", function (data) {

	/*[{"dateTimeReceived":"2013-03-18T18:24:42Z","dateTimeTaken":"2013-03-18T18:24:15Z","inspectionPoint_id":1,
	"parameterType":"Temperature","reading":"5.5","testSourceLocationDescription":"Enda's test source - Sligo",
	"testSourceLocationLatitude":"54.278105","testSourceLocationLongtitude":"-8.496348","testSourceLowerLimit":
	"4.0","testSourceUpperLimit":"25.0","testSource_id":1}]*/

	//JsonRequest/findGetMapColorIndicator?dateTimeTaken='2013-03-18%2018:24:15'&testSourceId=1
	alert(data);
		for(var i = 0;  i < data.length; i++)
		{
			$.getJSON("/JsonRequest/findGetMapColorIndicator?dateTimeTaken='" + data[i].dateTimeTaken + "'&testSourceId=" + data[i].id , function (colorIndData) {
				//alert(colorIndData[i].testSource_id);
				
			});
		}
	});
});
