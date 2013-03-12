<?php
    $username="GroupEnsightDev"; 
	$password="th!rdY3ar";   
	$host="GroupEnsightDev.db.9216758.hostedresource.com";
	$link=mysql_connect($host,$username,$password)or die("Unable to connect to MySQL");
 
    mysql_select_db("GroupEnsightDev", $link) or die( "Unable to select database" . mysql_error());

    $res = mysql_query("SELECT * FROM TestSourceSampleData")or die ("Unable to run query");
	$data = array();
 
    while ($row = mysql_fetch_assoc($res))
    {  
	 $data[] = array("reading" => $row['reading']);
    } 
	echo json_encode($data);	 
    mysql_close($link);
?>