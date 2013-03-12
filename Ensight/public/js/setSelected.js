
	function setSelected(theSelectTagID, theWantedSelectedNumberID)
	{
		$('#' + theSelectTagID).children().each( function()
		{
			if(this.value == $('#' + theWantedSelectedNumberID).val()){
				$(this).attr("selected","selected");
			}
		});
	}