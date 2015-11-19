<?php

/* FOR DEBUGGING ONLY
<form action="" method="post" enctype="multipart/form-data">
Attach Files:
<p>
Directory: <input SIZE=47 type="text" name="dirUpload" TITLE="./ for html & rrtree_files/ for rrtree_files" >
<br>
<input type="hidden" name="MAX_FILE_SIZE" value="20000000" />
<input type="submit" value="upload" >
<br><br>
File  1: <input SIZE=50 type="file" name="fps[]" ><br>
File  2: <input SIZE=50 type="file" name="fps[]" ><br>
File  3: <input SIZE=50 type="file" name="fps[]" ><br>
File  4: <input SIZE=50 type="file" name="fps[]" ><br>
File  5: <input SIZE=50 type="file" name="fps[]" ><br>
File  6: <input SIZE=50 type="file" name="fps[]" ><br>
File  7: <input SIZE=50 type="file" name="fps[]" ><br>
File  8: <input SIZE=50 type="file" name="fps[]" ><br>
</p>
</form>
***************************************************/

// fpDnUp.php: cln File Upload/Download Protocol
// Usage of
// fpDnUp.php?loginName=flo&dealName=ghcmrms766553&actFlag=download
// Or
// fpDnUp.php?loginName=flo&dealName=ghcmrms766553&actFlag=upload
// INPUTS
$loginName="ted";
$dealStatus=0;
$dealName="ghcmrms766553";
$tabName="cln";
$dealType=5;
$type="tsv";
$actFlag="download";
$DEBUG=0;


// MAIN PROGRAM
set_time_limit(0);
if($_GET) {
	if(isset($_GET['dealStatus'])) $dealStatus=$_GET['dealStatus'];
	if(isset($_GET['actFlag'])) $actFlag=$_GET['actFlag'];
	if(isset($_GET['dealType'])) $dealType=$_GET['dealType'];
	if(isset($_GET['loginName'])) $loginName=$_GET['loginName'];
	if(isset($_GET['dealName'])) $dealName=$_GET['dealName'];
	if(isset($_GET['type'])) $type=$_GET['type'];
	if(isset($_GET['tabName'])) $tabName=$_GET['tabName'];
	if(isset($_GET['DEBUG'])) $DEBUG=$_GET['DEBUG'];
	$appDir = dealType2Txt($dealType);
	$vfcName =findGetVal('vfcName',"/apps/fafa/vfc/$appDir");
	$outDir  =findGetVal('outDir',$dealName);
	$fileName=findGetVal('fileName',"$dealName.$tabName");
	$dirName =findGetVal('dirName',"$vfcName/$loginName/$outDir");
	$fullName =findGetVal('fullName',"$dirName/$fileName");
}

$x=`hostname`;
$logName="/apps/fafa/cronJob/log/".$x."_sh_pma.log.".$loginName;
$tm_stamp=@date(DATE_RFC2822,@time());
file_put_contents($logName, "\n\n[INPUT]:\t{$tm_stamp}\n", FILE_APPEND | LOCK_EX);
file_put_contents($logName, $actFlag." ".$dealStatus, FILE_APPEND | LOCK_EX);
if($actFlag == "download") {
	if(!$DEBUG)
		fpsDownload($fullName,$type);
	else
		echo "filename, type: [",$fullName,"], [",$type,"]";
} else {
	file_put_contents($logName, "RUNNING ".$actFlag." ".$fullName, FILE_APPEND | LOCK_EX);
	if($dealStatus==1) createNewDeal($appDir,$loginName,$dealName);
	fpsUpload($fullName);
}

function createNewDeal($appDir,$loginName,$dealName) {
	$shellCmd="/apps/fafa/bin/sh_newDeal login=$loginName appDir=$appDir dealName=$dealName dealFrom=_NEW";
        $flist=`$shellCmd 2>&1`;
}

function fpsDownload($fullName,$type="csv") {
	if(!strcmp($type,"rptCtm")){
		$fileName=basename($fullName);
	} elseif(!strcmp($type,"report")){
		$fileName=basename($fullName);
		chk_pst2pdf($fileName,$fullName);
	} else {
		$fileName=basename($fullName).'.'.$type;
	}
	$vtype=array('gif'=>'image','png'=>'image','jpg'=>'image','jpeg'=>'image','pdf'=>'application',
		'mpeg'=>'audio','mp3'=>'audio','html'=>'text','plain'=>'text',
		'csv'=>'application','xls'=>'application'); 
	$type = strtolower($type);
	$ctype=($vtype[$type])?$vtype[$type]:"octet-stream";
	$ct="Content-Type: ".$type."/".$ctype;

	$cmd="cat $fullName";
	header($ct);
	header('Content-Disposition: attachment; filename="' . $fileName . '"');
	//header("Content-Transfer-Encoding: binary");
	//header('Expires: 0');
	//header('Pragma: no-cache');
	echo filterThroughCmd($cmd);
}

function filterThroughCmd($cmd) {
	return `$cmd`;
}

function fpsUpload($fullName) {
	if(isset($_FILES)) 
		print_r($_FILES[0]);
	else
		echo '$_FILES Not Exist';
	$fileTmpName = $_FILES[0]["tmp_name"];
	$fileName = $_FILES[0]["name"];
	$fileSize = $_FILES[0]["size"];
	if(!$fileSize) {
		echo "Unable to load ",${fileName}, "!<BR>";
	} else {
		$fp=fopen($fileTmpName,"r");
		$content = fread($fp, $fileSize);
		fclose($fp);
		 move_uploaded_file($fileTmpName, $fullName);
		// FOR DEBUGGING ONLY
		echo file_exists($fileTmpName),$content;
		$out=sprintf("%s From %s To %s\n","move_uploaded_file", $fileTmpName, ${fullName});
		echo $out;
	}
}


function fpsUploadNEW($fullName) {
	if($_FILES)
		print_r($_FILES);
	else
		echo '$_FILES Not Exist';
	foreach ( $_FILES as $fkey ) {
		file_put_contents($logName, $fkey["tmp_name"], FILE_APPEND | LOCK_EX);
		$fileTmpName = $fkey["tmp_name"];
		$fileType = $fkey["type"];
		$fileName = $fkey["name"];
		$fileSize = $fkey["size"];
		if(!$fileSize) {
			echo "Unable to load ",${fileName}, "!<BR>";
		} else {
			$fp=fopen($fileTmpName,"r");
			$content = fread($fp, $fileSize);
			fclose($fp);
			move_uploaded_file($fileTmpName, $fullName);
			$logStr=sprintf("%s From %s To %s\n","move_uploaded_file", $fileTmpName, ${fullName});
			file_put_contents($logName, $logStr, FILE_APPEND | LOCK_EX);
			echo $content;
			echo $logStr;
		}
	}
}

function findGetVal($xkey,$xval) {
	if(empty($_GET)) return NULL;
	if(isset($_GET[$xkey])) {
		return $_GET[$xkey];
	} elseif ($xval) {
		return $xval;
	}
	return NULL;
}

function dealType2Txt($dealType) {
        switch($dealType) {
                case 1: return "rmbs";
                case 5: return "rvm";
                case 3: return "cmbs";
                case 6: return "mf";
        }
        return "pma";
}
		
/*---- RUN ------------
 /apps/fafa/bin/pst2pdf
 /apps/fafa/vfc/mf/ted/SFCMT2015-1/__output/ap4.prn 
 "SFCMT2015-1 Pricing Sheet"
 /apps/fafa/vfc/mf/ted/SFCMT2015-1/__report/SFCMT2015-1_PST.pdf 
------------------------------------*/
function chk_pst2pdf($fileName,$fullName) {
	$xcmd='';
	if(strlen($fileName)>8 && !strcmp(substr($fileName,-8),"_PST.pdf")) {
		$dname=str_replace("_PST.pdf","",$fileName);
		echo $dname;
		$ptn = array("__report",$fileName);
		$rpl = array("__output",'ap4.prn');
 		$finame=str_replace($ptn,$rpl,$fullName);
		$htitle=$dname .' Pricing Sheet';
	} elseif (strlen($fileName)>8 && !strcmp(substr($fileName,-8),"_PYT.pdf")) {
		$dname=str_replace("_PYT.pdf","",$fileName);
		$ptn = array("__report",$fileName);
		$rpl = array("__output",'ap6.prn');
 		$finame=str_replace($ptn,$rpl,$fullName);
		$htitle=$dname .' Price/Yield Table';
	} elseif (strlen($fileName)>8 && !strcmp(substr($fileName,-8),"_DEC.pdf")) {
		$dname=str_replace("_DEC.pdf","",$fileName);
		$ptn = array("__report",'_DEC.pdf');
		$rpl = array("__output",'.dbt');
 		$finame=str_replace($ptn,$rpl,$fullName);
		$htitle=$dname .' DEC Table';
	} else {
		// DO NOTHING
	}

	$xcmd = '/apps/fafa/bin/pst2pdf '. $finame .' "'. $htitle .'" '. $fullName;
	// echo "SHELLCMD:[ ",$xcmd," ]\n";
	// exit(1);
	if( file_exists($finame) ) {
		$fout=`$xcmd 2>&1`;
	}

}

?>
