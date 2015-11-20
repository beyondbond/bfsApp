/***********************************************************************
#- Version: 0.22
# add report type: rptType to distinquish regular report [report] from custom [rptCtm]
#- Last Modified: Ted, Tue Nov 17 11:58:56 EST 2015
************************************************************************/
var availTabs={cln: "Collateral", bnd: "Bond", rle: "Rule", asm: "Scenario", yc: "Yield Curve"};
var enabledTabs={cln:"Collateral",bnd:"Bond"};

function validKy(ky,ob,errmsg) {
	if(ky in ob) { 
		return(ob[ky]);
	} else {
		if(errmsg!=null) alert(errmsg);
		return("");
	}
}


function getIdValues(a) {
	var r=$("[id$="+a+"]").map(function(i,x) {
		var y=$("#"+x.id);
		var z=(x.tagName=="SELECT")?y.find("option:selected").val():y.val();
		if(z!=null) { u=x.id.replace(a,"")+"="+z; return u; }
	});
	return r;
}

function setRunOptFlag(a,b) {
	if(a==null)a="_opt";
	if(b==null)b=" ";
	var r=getIdValues(a);
	var ret="";
	$.each(r,function(i,u) {
		if(ret.length>0)ret+=b;
		ret+=u;
	});
	return ret;
}

function parent_disable() { 
	if(typeof(prfViewWin)!="undefined" && prfViewWin && !prfViewWin.closed) prfViewWin.focus(); 
	if(typeof(saveAsWin)!="undefined" && saveAsWin && !saveAsWin.closed) saveAsWin.focus();
} 

function rvmMenuSetup(actN) {
	if(actN!='exit' && actN!='open' && actN!='exitS' && actN!='openS' 
		&& actN!='helpTopic' && actN!='helpTopicS'
		&& typeof(PageGrid.cln)=="undefined" 
		&& typeof(PageGrid.bnd)=="undefined") {
		alert("Please load a deal first");
		return(0);
	}
	switch(actN) {
		case 'run': 
		case 'rptPst': 
		case 'rptPstS':
			if(currRun=="pst") {
				DN_exportRpt("#rptPstLink","__report/"+currDealName+"_PST.pdf","report"); 
			} else {
				alert("No Pricing Sheet report available.\nPlease run \"Pricing Sheet\" under [Run] tab first!");
			} 
			break;
		case 'rptPyt': 
		case 'rptPytS':
			if(currRun=="pyt") {
				DN_exportRpt("#rptPytLink","__report/"+currDealName+"_PYT.pdf","report");
			} else {
				alert("No P/Y Table report available.\nPlease run \"P/Y Table\" under [Run] tab first!");
			} 
			break;
		case 'rptDbt': 
		case 'rptDbtS': 
			if(currRun=="pyt") {
				var dealName= PageTbl.adminInfo.dealName;
				DN_exportRpt("#rptDbtLink","__report/"+currDealName+"_DEC.pdf","report");
			} else {
				alert("No DEC Table report available.\nPlease run \"P/Y Table\" under [Run] tab first!");
			} 
			break;
		case 'rptCtm': 
		case 'rptCtmS': $.blockUI({message:$("#rptCtmBox"),css:{"left":"10%","top":"100px","width":"auto","height":"auto"}});
			break;
		case 'rptArc': 
		case 'rptArcS': 
			RUN_getRptList("PMA_getRptList",loginName,currDealName);
			$.blockUI({message:$("#rptArcBox"),css:{"top":"100px","width":"auto","height":"auto"}});
			break;
		case 'runPst': 
		case 'runPstS': 
			egflg_opt.value=4;
			Scenario_opt.value=xScn_optX.value;
			var a=setRunOptFlag("_opt"," ","");$("#prfName_optX").val(a);
			RUN_saveNrunDeal("PMA_saveNrunDeal");
			displayToggleTab(0,"#out_pytGrid","#out_pstGrid");
			break;
		case 'runPyt': 
		case 'runPytS': 
			egflg_opt.value=egflg_optX.value;
			Scenario_opt.value=vScn_optX.value;
			var a=setRunOptFlag("_opt"," ","");$("#prfName_optX").val(a);
			RUN_saveNrunDeal("PMA_saveNrunDeal"); 
			displayToggleTab(1,"#out_pytGrid","#out_pstGrid");
			break;
		case 'exportS': 
		case 'export': 
			break;
		case 'importS': 
		case 'import': 
			var xtmp=validKy(currName,enabledTabs,"Error: ["+availTabs[currName]+ "] is not a valid tab to perform! Click Collateral/Bond tab to continue.");
			if(upType!=null && xtmp.length>0) { upType.innerHTML=xtmp;} else {break;}
			$.blockUI({message:$("#importBox"),css:{"top":"100px","width":"auto","height":"300px"}});
			break;
		case 'openS': 
		case 'open': $.blockUI({message:$("#openBox"),css:{"top":"100px","width":"auto","height":"auto"}});
			break;
		case 'rptOpt': $.blockUI({message:$("#rptOptBox"),css:{"left":"10%","top":"100px","width":"auto","height":"auto"}});
			break;
		case 'gnrDeal': $("#dealID").val(currDealName);
			dealEditorWin=window.open("_editorPop.htm?grid=gnr&width=600px&height=400px",'Deal Editor',
			'resizable=yes,menubar=0,titlebar=1,status=0,width=650,height=540');
			break;
		case 'rleScript': $("#dealID").val(currDealName);
			dealEditorWin=window.open("_editorPop.htm?grid=rle&width=900px&height=500px",'Rule Editor',
			'resizable=yes,menubar=0,titlebar=1,status=0,width=950,height=640');
			break;
		case 'reloadS': 
		case 'reload': RUN_getDeal("",currDealName); break;
		case 'saveS': 
		case 'save': saveAsAction("dealList",""); break;
		case 'saveAsS': 
		case 'saveAs': OpenSaveAsWin("dealList"); break;
		case 'del': RUN_deleteDeal("PMA_deleteDeal"); break;
		case 'gph': load_gphBox(); 
			$.blockUI({title:"Collateral Distribution",message:$("#gphBox"),css:{"left":"10%","top":"100px","width":"auto","height":"auto"}});
			break;
//		case 'gph': showGph(1); break;
		case 'stt': showSec("stt");
			ra=_.range(100000,500001,25000);
			sttColumnChart("stt_c11","cln","Camt",ra,"column","Balance","%","$1,000");
			ra=_.range(1,10.01,1);
			sttColumnChart("stt_c12","cln","Ccpn",ra,"column","Net Coupon","%","$1,000");
			ra=_.range(1,10.01,1);
			sttPieChart("stt_c21","cln","Cage",ra,"pie","Loan Age","%","Age in Month");
			ra=_.range(50,90.01,5);
			sttPieChart("stt_c22","cln","Cltv",ra,"pie","Loan LTV","%","LTV (%)");
			break;
		case 'view': viewEdit(-1); break;
		case 'bndView': viewEdit(-1,"bnd"); break;
		case 'exitS': 
		case 'exit': window.location="/cmo/logoff.php"; break;
		case 'helpTopicS': 
		case 'helpTopic': helpWin=window.open('_helpTopic.htm','Glossary','resizable=yes,menubar=0,titlebar=1,status=0,width=500,height=600');
		break;
		default:alert("Under Construction"); 
		
	}
}

function rvmMenuAlt(id) {
	var actN,xtip;
	actN=id.replace("Link","");
	switch(actN) {
		case 'runS': 
		case 'runPyt': xtip="Run Price/Yield Table"; break;
		case 'runPst': xtip="Run Pricing Sheet r.w.t. specified scenario"; break;
		case 'rptPytS': xtip="Show Price/Yield Table"; break;
		case 'rptPstS': xtip="Show Pricing Sheet r.w.t. specified scenario"; break;
		case 'reloadS': xtip="Reload current Pool"; break;
		case 'exportS': xtip="Export current Pool"; break;
		case 'importS': xtip="Import Pool"; break;
		case 'openS': xtip="Open Pool"; break;
		case 'saveS': xtip="Save current Pool"; break;
		case 'saveAsS': xtip="SaveAs New Pool"; break;
		case 'delS': xtip="Delete current Pool"; break;
		case 'gphS': xtip="Draw Correspondent Graphics"; break;
		case 'viewS': xtip="Go To View Preference Editor"; break;
		case 'exitS': xtip="Log Off"; break;
		case 'printS': xtip="Print Report"; break;
		case 'helpContactS': xtip="Contact Us"; break;
		case 'helpTopicS': xtip="Help"; break;
	}
	$("#"+id).attr("title",xtip);
}

function DN_exportRpt(elmTag,fpName,rptType) {
	urlName= "/scripts/fpDnUp.php?actFlag=download"
		+'&dealType=' + dealType
		+'&dealName=' + currDealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&type=' + rptType
		+'&fileName=' + fpName;
	$(elmTag).attr("href",urlName);
}

function PMA_exportPool () {
	var fData = new FormData($('input[name^="fps"]'));		 
	var tabName=currName;
	jQuery.each($('input[name^="fps"]')[0].files, function(i, file) {
		fData.append(i, file);
	});
	if (currName!="bnd" && currName!="cln") {
		alert("Download only available for Collateral or Bond");
		return false;
	}
	
	urlName= "/scripts/fpDnUp.php?actFlag=download"
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&tabName=' + tabName
		+'&callback=?';
	$("[id=exportLink]").attr("href",urlName);
}

function PMA_importPool () {
	var fData = new FormData($('input[name^="fps"]'));		 
	var tabName=currName;
	jQuery.each($('input[name^="fps"]')[0].files, function(i, file) {
		fData.append(i, file);
	});
	if (currName!="bnd" && currName!="cln") {
		alert("Upload only available for Collateral or Bond");
		return false;
	}
	urlName= "/scripts/fpDnUp.php?actFlag=upload"
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&tabName=' + tabName
		+'&callback=?';
	var opts = {
		type: 'POST',
		data: fData,
		url: urlName,
		cache: false,
		contentType: false,
		processData: false,
		success: function(data){
		//	alert(data);
			RUN_getDeal("",currDealName);
		}
//		contentType: 'multipart/form-data', // NOT USE FOR MULTIPART
	};
	if(fData.fake) { // Make sure no text encoding stuff is done by xhr
		opts.xhr = function() { var xhr = jQuery.ajaxSettings.xhr(); xhr.send = xhr.sendAsBinary; return xhr; }
		opts.contentType = "multipart/form-data; boundary="+fData.boundary;
		opts.data = fData.toString();
	}
	$.ajax(opts);
}

// get Bond Cashflow
function getBondCfs() {
	var fileName=currDealName+"_"+trancheNum_cfs.value+"_"+scnNum_cfs.value+".cfs";
	var p=prfName+" Scenario="+scnNum_cfs.value+" xlnId=0";
	RUN_getCfs("PMA_getCfs",{value:fileName},"cfs",p);
}

// Decide type of [bnd/cln] to "GET" & "DISPLAY" Bond/Loan Cashflow 
function getBondLoanCfs() {
	var xa=$('#rtNum_cfs:checked').val(); 
	if(xa==1) {
		getBondCfs();
	} else {
		getLoanCfs();
	} 
	attrToggleTab(xa,'#trancheNum_cfs','#loanNum_cfs');
}

// Decide toggle xa:[1/0] to "ATTR" onID/offID 
//e.g., attrToggleTab($('#rtNum_cfs:checked').val(),'#trancheNum_cfs','#loanNum_cfs')
function attrToggleTab(xa,onID,offID) {
	var xs=[true,false];
	var xb = (xa==1)?0:1;
	$(onID).attr("disabled",xs[xa]);
	if(offID != "undefined")
		$(offID).attr("disabled",xs[xb]);
}

// Decide toggle xa:[1/0] to "DISPLAY" onID/offID 
//e.g., displayToggleTab($('#cfsFlg_cht:checked').val(),'#cfsChart','#cfsGrid')
function displayToggleTab(xa,onID,offID) {
	var xs=["none","block"];
	var xb = (xa==1)?0:1;
	$(onID).css("display",xs[xa]);
	if(offID != "undefined")
		$(offID).css("display",xs[xb]);
}



// Decide type of "DISPLAY" Table/Chart Cashflow 
function displayChartTable(chk,onID,offID) {
	var xa=$('#cfsFlg_cht:checked').val();
	displayToggleTab(xa,"#cfsChart","#cfsGrid");
	attrToggleTab(xa,"#colNum_cht");
}


// e.g. gnrOb=gnr_data2obj(PageTbl.gnr_OBJ.jsonData)
function gnr_data2obj(o) {
	var y='var jdata={';o.map(function(x,i){y+=x.replace(';',',').replace('=',':');});
	eval(y.replace(/,$/,'}'));
	return jdata;
}

// e.g. grid2jsonData_text($('#rleGrid')[0]) {
function grid2jsonData_text(v) {
//	$('textarea[id$=Grid]').map(function(k,v) {
	var idname=v.id.replace(/Grid$/,'');
	var htmx = v.value.replace(/\n$/,'').split(/\n/);
	PageTbl[idname+"_OBJ"].jsonData=htmx;
	PageTbl[idname+"_OBJ"].nobs=htmx.length;
//	});
}

function jsonData2grid_text(v) {
	var tmpname=v.id.replace(/Grid$/,'Tmp');
	var u = document.getElementById(tmpname);
	v.value = u.value;
}

// e.g. ele2jsonData_text('#rleGrid')
function ele2jsonData_text(eleName) {
	var v=$(eleName)[0];
	var idname=v.id.replace(/Grid$/,'');
	var htmx = v.value.replace(/\n$/,'').split(/\n/);
	PageTbl[idname+"_OBJ"].jsonData=htmx;
	PageTbl[idname+"_OBJ"].nobs=htmx.length;
}


function load_gphBox() {
	var vlst=PageGrid.cln.getColumns();
	var vx=_.pluck(vlst,"name").slice(1);
	loadSelectBox("clnName_cht",vx,0)
}

function gph_clnChart() {
	var vlst=PageGrid.cln.getColumns();
	var tmpY=clnName_cht.value;
	var selY=$.map(vlst,function(x,i) {if(x.name==tmpY)return x.field;})
	var vy=_.pluck(PageGrid.cln.getData().slice(1),selY);
	var vx=_.pluck(PageGrid.cln.getData(),"Cnu");
	var tickGap=Math.round(vx.length/10);
	var xpts={xAxis:{tickInterval:tickGap}};
	drawHiChart("clnChart"," Distribution of "+tmpY,"column",tmpY,vy,'',"Loan ID",vx,xpts);
	$("#clnChart").css("display","block");
//	showSec("cln");
}

function getUrlVars() {
	var vars = {};
	var urlapp = window.location.href.replace('#','');
	var parts = 
		urlapp.replace(/[?&]+([^=&]+)=([^&]*)/gi,
		function(m,key,value) {
			vars[key] = value;
		});
	return vars;
}

//====================================
// SETUP ALL THE LISTENERS
function setupListeners() {
	$("[id=exportLink]").click(function(){PMA_exportPool();$.unblockUI();});
	$("[id=importPoolBtn]").click(function(){
		PMA_importPool();
		$.unblockUI();
	});
	$("#clnName_cht").change(function(){
		gph_clnChart();
	//	$.unblockUI();
	});

	$("[id=rptCtm_okL]"     ).click(function(e){
		var xnm=$("#rptCtmName").val();
		DN_exportRpt("#rptCtm_okL",xnm,"rptCtm"); 
	//	$("#rptCtm_okL").attr("href","#");
		$.unblockUI();
	});

	$("[id=grid_okBtn]"     ).click(function(e){
	//	alert("updating "+e.currentTarget.id);
		var v=(document.getElementById(e.currentTarget.value));
		if(v!=null) grid2jsonData_text(v);
		$.unblockUI();
	});

	$("[id=grid_cancelBtn]"     ).click(function(e){
	//	alert("canceling "+e.currentTarget.id);
		var v=(document.getElementById(e.currentTarget.value));
		jsonData2grid_text(v);
		$.unblockUI();
	});
	$("[id$=cancelBtn]").click(function(){ $.unblockUI(); });
	$("[id^=rvmMenu] a[id$=Link]")
	 .click(function(e){rvmMenuSetup(e.currentTarget.id.replace("Link",""));})
	 .mouseover(function(e){rvmMenuAlt(e.currentTarget.id);});
	$('ul#secTabs li a').click(function(e){
		var tabX=e.currentTarget.id.replace("Btn","");
		showSec(tabX);
		if(tabX=="stt") 
			rvmMenuSetup(tabX);
	});
	$('#dealList').change(function(){RUN_getDeal("",this.value);$.unblockUI();});
	$('#rptList').change(function(){
		var rptName=this.value;
		var urlName= "/scripts/fpDnUp.php?actFlag=download"
		+'&dealType=' + dealType
		+'&dealName=' + currDealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&type=' + 'rptCtm'
		+'&fileName=' +'__report/'+ rptName;
		console.log("Getting "+rptName+" report from ",urlName);
		window.location=urlName;
		$.unblockUI();});

	// For [Report]: cfsDisplayMenu binding
	// Toggle btw Cashflow Table/Graph[0:1] to DISPLAY Cashflow
	$('#cfsFlg_cfs').click(function(e){ 
		if($('#cfsFlg_cfs:checked')!="undefined" && $('#cfsFlg_cfs:checked').length>0) {
			$('[id$=Num_cfs],[id=cfsFlg_cht],[id=colNum_cht]').attr("disabled",false);
			getBondLoanCfs(); displayChartTable();
		} else {
			$('[id$=Num_cfs],[id=cfsFlg_cht],[id=colNum_cht]').attr("disabled",true);
		}
	});


	// Toggle selection btw Bond/Loan:[1:0] or Bond_Tranche or LoanNum change 
	// to GET & DISPLAY Cashflow
	$("[id$=Num_cfs]").change(function(e){ 
		getBondLoanCfs(); displayChartTable();
	});

	// Toggle "DISPLAY" Table/Chart Cashflow 
	$("[id$=cfsFlg_cht]").change(function(e){ 
		displayChartTable();
	});

	// Re-draw chart according to selected [series]
	$("select[id$=Num_cht]").change(function(e){
		drawCfsChart();
	});

	// For [Yield Curve] binding
	// To bind draw Yield Curve graph
	$('#xtsyFlg_cht,[name=xtsyFlg_yc]').click(function(e){
		if(document.getElementById("xtsyFlg_cht").checked==true) {
			var selY=$("[name=xtsyFlg_yc]:checked").val();
			var vy=_.pluck(PageGrid.xtsy_dat.getData(),selY);
			var vx=_.pluck(PageGrid.xtsy_dat.getData(),"TSY_MO");
			drawHiChart("xtsy_datChart","Yield Curve","column","Swap",vy,"%","Month",vx);
			$('#xtsy_datChart').css("display","block");
		} else {
			$('#xtsy_datChart').css("display","none");
		}
	});
	$("#tranche_cfs").change(function(e){ getPytable();chgPytCol(); });
	$("[id$=Grid]").css("clear","both");
	$("[id$=_datGrid],[id$=_datChart]").css({"clear":"none","margin":"10px","float":"left"});
	$("[id^=asm][id$=List]").css("width","132px");
	$('#asmChtBtn').click(function(e){
			var selY=asmList.value;
			var vy=_.pluck(PageGrid.asm.getData(),selY);
			drawHiChart("asmChart",selY+" Vector","column",selY,vy);
			$('[id=asmChart],[id=asmGrid]').css({"display":"block","clear":"none","float":"left"});
	});
}

//====================================
// RUN JS FUNCTIONS 
function runJSfn() {
	getQueryString();
//	loginName="ted";
	loginStatus=1;
	RUN_getDealList("PMA_getDealList",loginName,isCtr);
	RUN_getAsmList("PMA_getAsmList",loginName,isCtr);
	RUN_getPrf("PMA_getPrf",loginName,"__LAST","cln");
	RUN_getPrf("PMA_getPrf",loginName,"__LAST","bnd");
	RUN_getPrf("PMA_getPrf",loginName,"__LAST","pst");
	$("[id$=Sec]").each(function(j,sec) { sec.style.display="none";});
	$("[id$=Chart]").each(function(j,sec) { sec.style.display="none";});
	$("[id^=stt_]").css({"width":"380px","margin":"5px"});
}

function runApp() {
	setupListeners();
	runJSfn();
}
