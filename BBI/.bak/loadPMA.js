/********************************************************************* 
#- Version: 1.9
#- Last Modified: Ted, Thu Aug 28 17:11:56 EDT 2015
ActionFlg List:
PMA_loginChk
PMA_shellCmd
PMA_getDealList
PMA_deleteDeal
PMA_saveAsDeal
PMA_saveDeal
PMA_runDeal
PMA_getOutputList
PMA_saveNrunDeal
PMA_getDbDeal
PMA_getDeal
PMA_getCfs
PMA_getAsmList
PMA_deleteAsm
PMA_getAsm
PMA_saveAsm
PMA_getPrfList
PMA_deletePrf
PMA_getPrf
PMA_savePrf
PMA_getXTSY
PMA_getXINDEX
PMA_saveFile
**********************************************************************/
// Actions from child prf window              
//window.opener.prfBas[prfN]=prfClone(prfData);
//window.opener.prfViewAction(appName,prfN,actName);

// GLOBAL VARIABLES
var initAsmX=0;
var loginName='';
var loginStatus=0;
var isCtr=0;
var urlPath='/scripts/processPMA.1.5.php';
var prfName=' Fprinter=1 Scenario=1,2,3,4,5 egflg=6 incr=0.25 nrow=9 RUN_FLAG=1';
var dealType=5;
var dealTypeName=['','rmbs','','','','rvm','mf'];
var asmDcmUpdByType=asmDcmUpdByTypeRVM;
// OR for case dealType!=5
// asmDcmUpdByType=asmDcmUpdByTypeMBS; 
var currDealName='';
var currName="cln";
var gphBtnFlg = 0;
var PageTbl;
var PageGrid={};
var PagePrf={};
var prfBas=[]; // List of column preference for slickGrid such as cln, bnd, pts
var prfCur=[];
var prfHdr=[]; // List of Column header (field name) such as cln, bnd
var grid;
var asmFpList=[];
var asmDspList={ppy:"Prepay",drw:"Draw",idx:"Index"};
var asmType={
	ppy:{base:"CPR",TypeList:["PSA","CPR","SMM"]},
	dft:{base:"CDR",TypeList:["SDA","CDR","MDR"]},
	idx:{base:"LIBOR_1MO",TypeList:["LIBOR_1MO","LIBOR_3MO","LIBOR_6MO"]}
	};
var asmProdList={};$.each(asmType,function(k,v){asmProdList[k]=v.base;});
//i.e., asmProdList={ppy:"CDR",dft:"CDR",idx:"LIBOR_1MO"};

var autoEditFlg=true;
var options = {
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	autoEdit: autoEditFlg
};
var pyt1st_PRICE={"name":"Price","width":122,"id":"PRICE","field":"PRICE","cssClass":"cell-title","precision":3,"datatype":0,"show":1,"colid":0};
var pyt1st_YIELD={"name":"Yield","width":122,"id":"YIELD","field":"YIELD","cssClass":"cell-title","precision":4,"datatype":0,"show":1,"colid":0};
var pyt1st_DM={"name":"DiscMargin","width":122,"id":"DM","field":"DM","cssClass":"cell-title","precision":0,"datatype":0,"show":1,"colid":0};
var pytCol= 
[{"name":"Price","width":122,"id":"PRICE","field":"PRICE","cssClass":"cell-title","precision":3,"datatype":0,"show":1,"colid":0},
{"name":"1","width":122,"id":"SCN_1","field":"SCN_1","precision":3,"datatype":1,"show":1,"colid":1,"formatter":roundingFormatter},
{"name":"2","width":122,"id":"SCN_2","field":"SCN_2","precision":3,"datatype":1,"show":1,"colid":2,"formatter":roundingFormatter},
{"name":"Base","width":122,"id":"SCN_3","field":"SCN_3","precision":3,"datatype":1,"show":1,"colid":3,"formatter":roundingFormatter},
{"name":"4","width":122,"id":"SCN_4","field":"SCN_4","precision":3,"datatype":1,"show":1,"colid":4,"formatter":roundingFormatter},
{"name":"5","width":122,"id":"SCN_5","field":"SCN_5","precision":3,"datatype":1,"show":1,"colid":5,"formatter":roundingFormatter}];
var cfsCol= 
[{"name":"Date","resizable":true,"sortable":false,"minWidth":50,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":70,"id":"S_DATE","field":"S_DATE","toolTip":"Date","cssClass":"cell-title","precision":0,"datatype":1,"show":1,"colid":1,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"NetCashFlow","resizable":true,"sortable":false,"minWidth":80,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":80,"id":"S_PI","field":"S_PI","toolTip":"NetCashFlow","precision":2,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"NetInterest","resizable":true,"sortable":false,"minWidth":80,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":80,"id":"S_IO","field":"S_IO","toolTip":"NetInterest","precision":2,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"Principal","resizable":true,"sortable":false,"minWidth":80,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":80,"id":"S_PO","field":"S_PO","toolTip":"Principal","precision":2,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"LoanBalance","resizable":true,"sortable":false,"minWidth":80,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":80,"id":"S_RB","field":"S_RB","toolTip":"LoanBalance","precision":2,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter}];
var xtsy_datCol= 
[{"name":"Month","resizable":true,"sortable":false,"minWidth":70,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":40,"id":"TSY_MO","field":"TSY_MO","toolTip":"Month to Maturity","cssClass":"cell-title","precision":0,"datatype":1,"show":1,"colid":1,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"Treasury","resizable":true,"sortable":false,"minWidth":70,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":66,"id":"TSY_RATE","field":"TSY_RATE","toolTip":"Treasury Rate (%)","precision":4,"datatype":1,"show":1,"colid":3,"colnew":0,"previousWidth":60,"formatter":roundingFormatter},
{"name":"Swap","resizable":true,"sortable":false,"minWidth":70,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":66,"id":"SWP_RATE","field":"SWP_RATE","toolTip":"Swap Rate (%)","precision":4,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter}];
var xindex_datCol= 
[{"name":"Index Name","resizable":true,"sortable":false,"minWidth":140,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":96,"id":"INDEX_DSCR","field":"INDEX_DSCR","toolTip":"Index Name","precision":0,"datatype":1,"show":1,"colid":3,"colnew":0,"previousWidth":60},
{"name":"Index","resizable":true,"sortable":false,"minWidth":70,"rerenderOnResize":false,"headerCssClass":null,"defaultSortAsc":true,"width":66,"id":"INDEX_RATE","field":"INDEX_RATE","toolTip":"Index Rate (%)","precision":4,"datatype":1,"show":1,"colid":4,"colnew":0,"previousWidth":60,"formatter":roundingFormatter}];

function asmDspSetup(dealType) {
	if(dealType!=5) {
		asmDspList={ppy:"Prepay",dft:"Default",idx:"Index"};
		asmProdList={ppy:"CPR",dft:"CDR",idx:"LIBOR_1MO"};
		asmDcmUpdByType=asmDcmUpdByTypeMBS;
	}
}

function setGridOption() {
	var x=PageGrid.cln.getOptions();
	autoEditFlg=(autoEditFlg==false)?true:false;
	x.autoEdit=autoEditFlg;
	PageGrid.cln.setOptions(x);
}

function OpenSaveAsWin(selist) {
	if(document.getElementById(selist).value.length<1) {
		alert("No selection"); return(-1); 
	}
	saveAsWin=window.open('_saveAsPop.htm?appName='+selist,'SaveAs','resizable=yes,menubar=0,titlebar=1,status=0,width=300,height=200');
}

//PMA_saveAsDeal
function RUN_saveAsDeal(actionFlg,appN,selN) { 
	if(PageTbl==null) { alert("No deal selected"); return(-1); }
	orgN=$("#"+appN).find('option:selected').val().trim();
	if(selN.length<1) { selN=orgN; }
	dealName=selN.trim();
	dealFrom=orgN.trim();
	PageTbl.adminInfo.dealName=dealName;
	myObj=PageTbl;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&dealFrom=' + dealFrom
		+'&callback=?';
	tmpStr=JSON.stringify(myObj);
	if(dealName!=dealFrom) {
		dataStr=tmpStr.replace(new RegExp(dealFrom,"gm"),dealName);
	} else {
		dataStr=tmpStr;
	}
$.ajax({
	type: 'POST',
	url: urlName,
	data: dataStr,
	processData: false,
	dataType: "json",
	statusCode: { 401: function() { alert("page not found"); } },
	success:function(ret) {
		loadSelectBox(appN,ret);
		$("#"+appN).val(selN).attr('selected',true);
		if(dealName!=dealFrom) {
			RUN_getDeal("",dealName);
		}
	},
	error:function() {
		alert("error to run");
	}
});
}

//PMA_saveAsm
function RUN_saveAsm(actionFlg,appN,selN) {
	asmTypeName=$("#asmTypeList").find('option:selected').val();
	orgN=PageGrid.asm.getColumns()[1].field;
	if(selN.length<1) selN=orgN;
	if(selN.length<1) { alert("Empty Name"); return(-1); }
	if(selN.substr(0,1)=='_') { alert("Unable to save Reserved "+selN); return(-2); } 
	fpName=selN.trim() + '.vec.'+ asmTypeName;

	asmData=PageGrid.asm.getData();
	myObj={};
	myObj.jsonData=_.pluck(asmData,orgN);
	myObj.jsonHeader=selN;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&extName=' + '.vec.*' 
		+'&fileName=' + fpName
		+'&callback=?';
	appName=appN.substring(0,3);
$.ajax({
	type: 'POST',
	url: urlName,
	data: JSON.stringify(myObj),
	processData: false,
	dataType: "json",
	statusCode: { 401: function() { alert("page not found"); } },
	success:function(ret) {
		tp=asmTypeName;
		asmFpList[tp]=$.map(ret,function(d,k) {if(d.substr(-3)==tp)return d.split(":")[0].trim();});
		loadSelectBox("asmList",asmFpList[tp]);
		$("#"+appN).val(selN).attr('selected',true);
		if(orgN!=selN) {
			RUN_getAsm("PMA_getAsm");
		}
		asm2ScnXupd(tp);
	},
	error:function() {
		alert("error to run");
	}
});
}

//PMA_saveNrunDeal
function RUN_saveNrunDeal(actionFlg) {
	if(PageTbl==null) { alert("No deal selected"); return(-1); }
	var myObj=PageTbl;
	$.map(pytCol, function(d,k){d.precision=$("#precision_opt").val();});
	if($("#prfName_optX").val().length>1) 
		prfName= $("#prfName_optX").val();
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&prfName=' + prfName
		+'&callback=?';
	$.ajax({
		type: 'POST',
		url: urlName,
		data: JSON.stringify(myObj),
		processData: false,
		dataType: "json",
		statusCode: { 401: function() { alert("page not found"); } },
		success:function(ret) { 
			getOutputList(ret);
			showSec('out');
		},
		error:function() {alert("error to run");}
	});
}

function getOutputList(ret) {
	if(ret==null) return 0;
	if(egflg_opt.value==4) {
		getPstable();
	} else {
		asgRptList(ret);
		getPytable();
		writeAssmptGrid();
	}
}

function chgPytCol() {
//	if(cfsFlg_cfs.checked==false) return(0);
	if(typeof xcfsAll == "undefined") return(0);
	var xTranche=tranche_cfs.value;
	if(dealType==5) {
		switch(xTranche) {
			case 'COL': var xNew=xcfsAll.slice(0,8); break;
			case 'HMBS': var xNew=$.map(xcfsAll,function(x,i) {if([0,1,8,9,10,11].indexOf(i)>=0)return x});break;
			case 'UNCER': var xNew=$.map(xcfsAll,function(x,i) {if([0,1,12,13].indexOf(i)>=0)return x});break;
		}
	} else {
		xNew=xcfsAll;
	}

	PageGrid.cfs.setColumns(xNew);
	adjGridCanvasWidth("cfs","#cfsGrid");
	drawCfsChart();
}

function writeAssmptGrid()
{
//	var x1=$.map(PageTbl.dcm_ppy_OBJ.jsonData[0],function(x1,i) {console.log(x1+i);});
//	var x2=$.map(PageTbl.dcm_drw_OBJ.jsonData[0],function(x2,i) {console.log(x2+i);});
//	var x3=$.map(PageTbl.dcm_idx_OBJ.jsonData[0],function(x3,i) {console.log(x3+i);});
	var y1="";$.map(PageTbl.dcm_ppy_OBJ.jsonData[0],function(x1,i) {if(i.match("ScnX")!=null) y1+="<td>"+x1+"</td>";});
	var y3="";$.map(PageTbl.dcm_idx_OBJ.jsonData[0],function(x3,i) {if(i.match("ScnX")!=null) y3+="<td>"+x3+"</td>";});
	if(dealType==5) {
	var y2="";$.map(PageTbl.dcm_drw_OBJ.jsonData[0],function(x2,i) {if(i.match("ScnX")!=null) y2+="<td>"+x2+"</td>";});
	var z="<table CELLPADDING=0 CELLSPACING=0 ><tr><th>Scenario</th><th>1</th><th>2</th><th>Base</th><th>4</th><th>5</th></tr><tr><td>"+asmDspList.ppy+":</td>"+y1+"</tr><tr><td>"+asmDspList.drw+":</td>"+y2+"</tr><tr><td>"+asmDspList.idx+":</td>"+y3+"</tr></table>";
	// Assign HMBS for reverse mortgage HECM
	loadSelectBox("tranche_cfs",["COL","HMBS","UNCER"],0);
	if(typeof trancheNum_cfs != "undefined")
	  loadSelectBox("trancheNum_cfs",["COL","HMBS","UNCER"],0);
	} else {
	var y2="";$.map(PageTbl.dcm_dft_OBJ.jsonData[0],function(x2,i) {if(i.match("ScnX")!=null) y2+="<td>"+x2+"</td>";});
	var z="<table CELLPADDING=0 CELLSPACING=0 ><tr><th>Scenario</th><th>1</th><th>2</th><th>Base</th><th>4</th><th>5</th></tr><tr><td>"+asmDspList.ppy+":</td>"+y1+"</tr><tr><td>"+asmDspList.dft+":</td>"+y2+"</tr><tr><td>"+asmDspList.idx+":</td>"+y3+"</tr></table>";
	}
	$("#asmptGrid").html(z);
	$("#asmptGrid").css({"display":"block","margin":"20px 0 15px 0"});
	$("#asmptGrid td").css({"width":"110px","font":"12pt Arial","border":"1px solid lightgrey","text-align":"right","padding":"4px 5px"});
	$("#asmptGrid td:first-child,th:first-child").css("text-align","left");
	$("#asmptGrid tr:odd").css("background","#fefefe")
	$("#asmptGrid tr:eq(0)").css("background","#efefef")
	$("#asmptGrid td").map(function(i,x) {z=x.innerHTML;x.innerHTML=z.replace("CPR CPR","CPR");});
	$("#asmptGrid td").map(function(i,x) {z=x.innerHTML;x.innerHTML=z.replace("LIBOR_1MO LIBOR_1MO","LIBOR_1MO");});
}

// Get Price/Yield Table {Deal}_{Tranche}.pyt
function getPytable() { 
	var fileName=currDealName+"_"+tranche_cfs.value+".pyt";
	RUN_getCfs("PMA_getCfs",{value:fileName},"pyt");
}

// Get Pricing Sheet Table {Deal}_{Scenario}.pst
function getPstable() { 
	var fileName=currDealName+"_"+Scenario_opt.value+".pst";
	RUN_getCfs("PMA_getCfs",{value:fileName},"pst");
}

function data2Grid(prfN) {
	prfN=prfN || "pst";
	PageGrid[prfN].setColumns(PageGrid[prfN].getColumns())
/*
	var currPrf=PageGrid[pageGridName].getColumns();
	var addPrf=prfBas[prfType];
	var chkLst=_.pluck(addPrf,"field");
	$.map(currPrf,function(x,i){
		j=chkLst.indexOf(x.field);
		if(j>=0){
			$.extend(true,x,addPrf[j]);
			x["width"]=parseInt(addPrf["width"]);
		}
	});
*/
}

function drawCfsChart() {
        var selY=colNum_cht.value;
        var vy=_.pluck(PageGrid.cfs.getData(),selY);
        drawHiChart("cfsChart","Cashflow: "+selY,"column",selY,vy);
}

function getLoanCfs() {
	var fileName=currDealName+"_Loan"+loanNum_cfs.value+"_"+scnNum_cfs.value+".cfs";
	var p=prfName+" Scenario="+scnNum_cfs.value+" xlnId="+loanNum_cfs.value;
	RUN_getCfs("PMA_getCfs",{value:fileName},"cfs",p);
}

function asgRptList(ret) {
	document.getElementById("outGrid").innerHTML="";

	idName="cfsBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".cfs")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);

	idName="hmbsBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".cfs")>=0 && value.search("HMBS")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);

	idName="hecmBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".cfs")>=0 && value.search("COL")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);


	idName="whlBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".cfs")>=0 && value.search("Loan")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);

	idName="pytBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".pyt")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);

	idName="othBtn";
	rvec=ret.filter(function(value,index){x=(value.search(".cfs")<0 || value.search(".pyt")>=0)?true:false;return x;})
	loadSelectBox(idName,rvec);

}

function hideShow(name) {
	xobj=document.getElementById(name)
	flg=(xobj.style.display=="none")?0:1;
	flg=(flg==0)?1:0;
	xobj.style.display=(xobj.style.display=="none")?"block":"none";
	rtn=name+":"+xobj.style.display;
}

function loadYC() {
	RUN_updDataTable("PMA_getXTSY","xtsy_dat","xtsy.dat");
	RUN_updDataTable("PMA_getXINDEX","xindex_dat","xindex.dat");
}

//PMA_savePrf
function RUN_savePrf(actionFlg,loginName,fpn,prfN) {
	if(actionFlg==null||actionFlg=="") actionFlg="PMA_savePrf";
	if(prfN==null || prfN=="") prfN=currName;
	if(fpn==null || fpn=="") fpn="__LAST";
	var fpName=fpn+".prf."+prfN;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fpName
		+'&extName=' + '.prf.'+prfN 
		+'&callback=?';
	var x=new Object({"jsonData":prfData} );
	var dataStr=JSON.stringify(x);
	$.ajax({url:urlName,type:"POST",dataType:"json",
		data:dataStr,
		success:function(ret){
		var prfFpList=$.map(ret,function(d,k) {return d.split(":")[0].trim();});
		loadSelectBox("prfList",prfFpList);
		$("#"+"prfList").val("__LAST").attr('selected',true);
	}});
}

function RUN_deletePrf(actionFlg,loginName,fpn,prfN) {
	if(actionFlg==null) actionFlg="PMA_deletePrf";
	RUN_getPrfList(actionFlg,loginName,fpn,prfN);
}

//PMA_getPrfList
function RUN_getPrfList(actionFlg,loginName,fpn,prfN) {
	if(fpn==null || fpn=="") fpn="__LAST";
	if(prfN==null || prfN=="") prfN=currName;
	var fpName=fpn+".prf."+prfN;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fpName
		+'&extName=' + '.prf.'+prfN 
		+'&callback=?';
	$.getJSON(urlName,function(ret) {
		var prfFpList=$.map(ret,function(d,k) {return d.split(":")[0].trim();});
		loadSelectBox("prfList",prfFpList);
		$("#"+"prfList").val("").attr('selected',true);
//	  aIdxList=$("#prfList option").map(function(k,d) {if(d.value=="last")return k;}); // return index list
//	  aNameList=$("#prfList").find('option:selected').val();
//	  saveViewName currViewName
	});
}

function RUN_getPrf(actionFlg,loginName,fpn,prfN,asyFlg) {
	if(actionFlg==null||actionFlg=="") actionFlg="PMA_getPrf";
	if(prfN==null || prfN=="") prfN=currName;
	if(fpn==null || fpn=="") fpn="__LAST";
	var fpName=fpn+".prf."+prfN;
	if(asyFlg==null) asyFlg=true;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fpName
		+'&callback=?';
	$.ajax({url:urlName,type:"GET",dataType:"json", async:asyFlg,
		// data:dataStr,
		success:function(ret){
			var prfData=ret.jsonData;
			if(document.getElementById("prfViewGrid") != null)
				loadPrfGrid("prfViewGrid",prfN,prfData);
			if(typeof prfBas != "undefined")
				prfBas[prfN]=prfData;
		}
	});
}

function RUN_exportCln(actionFlg,dealName) {
	if(actionFlg.length<1) actionFlg="PMA_exportCln";
	if(dealName.length<2) {alert("No deal selected");return 0; }
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + dealName
		+'&loginName=' + loginName
		+'&callback=?';
	$.getJSON(urlName,function(ret){ });
}

function RUN_updDataTable(actionFlg,tblName,fpName) {
	tblBtn=tblName+'Btn';
	tblGrid=tblName+'Grid';
	fp=fpName;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fp
		+'&dataType=' + 1
		+'&callback=?';
	$.getJSON(urlName,function(cfsObj) { GridTbl(tblName,cfsObj); });
}

function RUN_getDataTable(actionFlg,tblName,fpName) {
	tblBtn=tblName+'Btn';
	tblGrid=tblName+'Grid';
	fp=fpName;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fp
		+'&dataType=' + 1
		+'&callback=?';
	$.getJSON(urlName,function(cfsObj) {
		GridTbl(tblName,cfsObj);
		tblBtn=tblName+'Btn';
		tblGrid=tblName+'Grid';
		document.getElementById(tblGrid).style.display = "block";
	});
}

function loginBB(flg) {
	RUN_loginChk("PMA_loginChk",flg);
}

//PMA_loginChk
function RUN_loginChk(actionFlg,flg) {
	user=document.getElementById("username").value;
	pass=document.getElementById("password").value;
	status=flg;

	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + user
		+'&callback=?';
	dtStr= 
		  '{"username":"' + user +'"'
		+ ',"password":"' + pass +'"'
		+ ',"loginStatus":' + status 
		+ "}" ;
	$.ajax({
		type: 'POST',
		url: urlName,
		data: dtStr,
		processData: false,
		dataType: "text",
		async: false,
		success:function (data) {
			ret=JSON.parse(data);
			loginStatus=ret[0];
			if(loginStatus==1) {
				loginName=ret[1];
				document.getElementById("loginBox").innerHTML="Hi "+loginName;
				RUN_getDealList("PMA_getDealList",loginName,isCtr);
				RUN_getAsmList("PMA_getAsmList",loginName,isCtr);
			} else {
				loginName="";
				document.getElementById("loginBox").innerHTML="Please Login";
				console.log("Login Incorrect");
			}
			document.getElementById("statusVal").value=loginStatus;
		},
		error:function() {
			console.log("Fail to login");
		}
	});
}

function prfBasUpd(prfN) {
	if(prfN==null||prfN=="") prfN="cln";
	cX=PageGrid[prfN].getColumns();
	$.each(cX,function(i,d) {d.colid=i;});jlen=cX.length;
	$.each(prfBas[prfN],function(i,dx) {
		j=$.map(cX,function(d,i) {if(d.field==dx.field) return(i);});
		if(j.length>0){
			cx=cX[j];
			dx.width=cx.width;dx.colid=cx.colid;
		} else {
			dx.colid=jlen;jlen++;
		}
	});
	var px=_.sortBy(prfBas[prfN],function(item){ return(item.colid);});
	prfBas[prfN]=px;
}

function viewEdit(yn,prfN) {
	if(prfN==null||prfN=="") prfN="cln";
	showSec(prfN);
	prfBasUpd(prfN);
	selist="prfView_"+prfN;
	var urlName='_prfViewPop.htm?appName='+selist
		+'&loginName='+loginName
		+'&dealType='+dealType
		+'&prfName='+prfN;
	prfViewWin=window.open(urlName,'ViewPreference','resizable=yes,menubar=0,titlebar=1,status=0,width=600,height=800');
}

function showSec(yName) {
	xName=currName;
	currSec=yName+"Sec";
	currBtn=yName+"Btn";
	lastSec=xName+"Sec";
	lastBtn=xName+"Btn";
	if(document.getElementById(currSec)) {
			document.getElementById(currSec).style.display = "block";
			document.getElementById(currBtn).style.background = "#EDFFF0";
			currName=yName;
	}
	if(currName!=xName && document.getElementById(lastSec)) {
			document.getElementById(lastSec).style.display = "none";
			document.getElementById(lastBtn).style.removeProperty("background");
	}
//	showGph(0);
}

function showGph(yn) {
	xName=currName;
	nameSec=xName+"Sec";
	nameChart=xName+"Chart";
	if(document.getElementById(nameChart) == null) return false;
	if(yn) gphBtnFlg=(gphBtnFlg==1)?0:1;
	if(gphBtnFlg == 0) {
		document.getElementById(nameChart).style.display = "none";
		document.getElementById("gphLink").style.removeProperty("background");
	} else {
		document.getElementById(nameChart).style.display = "block";
		document.getElementById("gphLink").style.background = "#EDFFF0";
	}
}

//PMA_getCfs
function RUN_getCfs(actionFlg,vObj,idName,p) {
	var fp=vObj.value;
	var px=(p!=null)?p:prfName;
	if(idName==null) idName="cfs";
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&fileName=' + fp
		+'&prfName=' + px
		+'&callback=?';
	$.getJSON(urlName, function(cfsObj) {
		if(cfsObj.dataType==1) {
			GridTbl(idName,cfsObj);
			document.getElementById("txtGrid").style.display = "none";
	//		document.getElementById(idName+"Grid").style.display = "block";
	//		chartTbl(idName,cfsObj);
			if(idName=="pst") {
				data2Grid(idName);
			} else if(idName=="cfs") {
				var xcfsNew=PageGrid[idName].getColumns();
				var xcolNew=_.pluck(xcfsNew,"field");
				if((typeof xcfsAll == "undefined") || 
				   $(xcolNew).not(_.pluck(xcfsAll,"field")).length > 0 ) {
					loadSelectBox("colNum_cht",xcolNew.slice(2),0);
				}
				xcfsAll=xcfsNew;
				chgPytCol();
			} else if(idName=="pyt") {
				rx=$('#pytGrid .slick-row').length;
				if(rx>3) {
				ra= Math.round(rx/2-1-.5);
				rb= rx-2;
				rc= rx-1;
				$('#pytGrid .slick-row')[ra].style.background="#DDFFDD";
				$('#pytGrid .slick-row')[rb].style.background="#EEEEEE";
				$('#pytGrid .slick-row')[rc].style.background="#EEEEEE";
				}
				// Clean up the old cashflow via un-check cashflow flg and hide the display
				$('#cfsFlg_cfs').prop('checked', false);
				$('#cfsGrid,#cfsChart').css('display','none');
			}
		} else {			
			document.getElementById("txtGrid").innerHTML= (cfsObj.jsonData);
			document.getElementById("txtGrid").style.display = "block";
			document.getElementById(idName+"Grid").style.display = "none";
		}
	});
}

function requiredFieldValidator(value) {
	if (value == null || value == undefined || !value.length) {
		return {valid: false, msg: "This is a required field"};
	} else {
		return {valid: true, msg: null};
	}
}

function getIndexOfList(id,ids) {
	j=-1;
	$.each(ids, function(i,ix) { if(id==ix) { j=i; } });
	return j;
}

// NOT USED
function colObjAsg() {
	urlName='/scripts/processPMA.php.1.3?actionFlg=PMA_getPrf&dealType=5&loginName=ted&fileName=last.prf.cln&callback=?';
	$.ajax({url:urlName,type:"GET",dataType:"json",success:function(ret){xCol=ret;}});
	var colV=[];
	// $(xCol.jsonData).each(function(i,d) {colV[i]=colObjInit(i,d);})
	$(xCol.jsonData).each(function(i,d) {
		var fieldName=xCol.jsonData[i].field;
		var sd=PageGrid["cln"].getData()[0][fieldName];
		colV[i]=colObjInit(i,d,sd);
	});
	return colV;
}

function colObjInit(idNum,prfObj,sampleData) {
	var toolTipX,nameX,idX,fieldX,precisionX,datatypeX,showX=1,widthX=90;
	toolTipX=nameX=idX=fieldX="";datatypeX,precisionX=0;
	if(typeof(prfObj) == "object") {
		idX=prfObj.field;
		fieldX=prfObj.field;
		nameX=prfObj.name;
		if(typeof prfObj.toolTip != "undefined") toolTipX=prfObj.toolTip;
		precisionX=prfObj.precision;
		datatypeX=prfObj.datatype;
		showX=prfObj.show;
		widthX=prfObj.width;
	} else if(typeof(prfObj) == "string") {
		toolTipX=nameX=idX=fieldX=prfObj;
	}
	var colObj = {
		id : idX, field: fieldX, name : nameX, width : widthX, 
		toolTip:toolTipX,
		precision : precisionX, datatype : datatypeX, show : showX, colid: idNum, 
		datatype: datatypeX, editor: Slick.Editors.Text
	}
	if(sampleData != null && typeof(sampleData) == "number") {
		colObj.datatype =(datatypeX<1)?1:datatypeX;
		colObj["formatter"]=rvmTypeConverter(datatypeX);
	}
	return colObj;
}

// column reference 
// {id: "RawId", name: "ID", field: "RawId", width: 40, cssClass: "cell-title", 
// editor: Slick.Editors.Text, validator: requiredFieldValidator},
// special formatting regs [idname] may apply
function colAsg(hdr,data,idname) {
	clx = [];
	lastRow=(data.length>1)?data.length-1:0;
	$.each(hdr, function(i, hx) { 
		if(hx == "RawId") {
			var obj = {
			id : hdr[i],	 
			field: hdr[i],	 
			name : "ID",
			toolTip : "Row Number",
			width : 20,
			cssClass: "cell-title",
			precision : 2,
			datatype : 1,
			show : 1,
			validator: requiredFieldValidator
			}
			obj["colid"]=i; obj["colnew"]=0;
			clx.push(obj);
		}
//		return false;
	});
	$.each(hdr, function(i, hx) { 
		if(hx != "RawId") {
			var obj = {
			id : hdr[i],	 
			field: hdr[i],	 
			name : hdr[i],
			toolTip : hdr[i],
			width : 90,
			precision : 4,
			datatype : 0,
			show : 1,
			editor: Slick.Editors.Text
			}
			obj["colid"]=i; obj["colnew"]=0;
			if(typeof(data[0][hx]) == "number" && typeof(data[lastRow][hx]) == "number") { 
				obj["datatype"]=1;
				obj["editor"]=FloatEditor;
				obj["formatter"]= roundingFormatter;
				if(hx == "DATE") { obj["formatter"]= mdYFormatter; obj["precision"]=0; }
				else if(idname!=null && idname=='cfs' && data[1][hx]>1000) {
					obj["formatter"]= moneyFormatter; obj["precision"]=2; obj["width"]=130; }
			}
			else { obj["width"]=100; }
			clx.push(obj);
		}
	});
	return(clx);
}

// NOT USED
function prfColLoad(fpn,prfN){	 // load preference file if exist 
	if(prfN==null|prfN=="") prfN=currName;
	if(fpn==null|fpn=="") fpName="__LAST";
	if(prfBas[prfN]!=null) {
		RUN_getPrf("PMA_getPrf",fpn,prfN,false);
	}
	return(prfBas[prfN]);
}

// NOT USED
function prfColAdd(hdrL,clx){  // add additional columns if not in preference
	xits=_.intersection(hdrL,_.pluck(clx,"field"));
	xdif=_.difference(hdrL,xits);
	if(xdif.length<1) return clx;
	xlen=clx.length;
	$(xdif).each(function(i,d) {clx[i+xlen]=colObjInit(i,d);})
	return clx;
}

function prfClone(clx){	// clone columns  
	var cly=[];
	$(clx).each(function(i,dx) { cly[i]=_.clone(dx); } );
	return cly;
}

function prfColSel(clx){	// select show columns 
	var cly=[];
	var j=0;
	$(clx).each(function(i,dx) {
		if(dx.show==1) {
			cly[j]={};
			// ensure datatype & width are integers
			dx["datatype"]=parseInt(dx["datatype"]);
			dx["width"]=parseInt(dx["width"]);
			_.extend(cly[j], dx,
				{editor: Slick.Editors.Text,validator: requiredFieldValidator});
			if(dx.datatype>0) {
				cly[j]["formatter"]= rvmTypeConverter(dx.datatype);
			}
			j++;
		}
	});
	return cly;
}

// get up-to-date preference
// if prfBas[idName] is available
function prfColAsg(hdrC,dataC,idName) {
	var prfB=prfBas[idName];
	var hdrB=_.pluck(prfB,'field');
	var prfC=[];
	var s1=_.intersection(hdrB,hdrC);
	var s2=_.difference(hdrC,s1);
		
	// Get RawId column 1st
	var jx=0;
	var j=hdrB.indexOf('RawId');
	if(s1.indexOf('RawId')>=0 && prfB[j]["show"]==1) {
		prfC.push(prfB[j]);
		prfC[prfC.length-1]=colObjInit(jx,prfB[j],0);
		jx++;
	}
	$.map(s1,function(x,i){
		var j=hdrB.indexOf(x);
		var sd=dataC[0][x];
		if(prfB[j]["show"]==1 && x!='RawId'){
			prfC.push(prfB[j]);
			prfC[jx]=colObjInit(jx,prfB[j],sd);
			jx++;
		}
	});
	if(s2.length<1)
		return(prfC);
	$.map(s2,function(x,i){
		if(x!='RawId'){
			var sd=dataC[0][x];
			j=prfC.length-1;
			prfC.push(colObjInit(jx,x,sd));
			jx++;
		}
	});
	return(prfC);
}

// NOT USED
function CridColAsg(hdrL,dataG,prfN) {
	var clxBas=[];
	var clxCur=[];
	if(prfN==null || prfN=="") prfN=currName;
	if(PageGrid[prfN]!=null) {
		if(hdrL=="") hdrL=_.pluck(PageGrid[prfN].getColumns(),"field");
		if(dataG=="") dataG=PageGrid[prfN].getdata();
	}
	// clxBas=prfColLoad(fpName,prfN);	   // load preference file if exist 
	clxBas=prfBas[prfN];           // Use __LAST preference as base
	clxBas=prfColAdd(hdrL,clxBas); // add additional columns if not in preference
	clxCur=prfColSel(clxBas);      // select show columns 
	prfCur[prfN]=clxCur;
	return clxCur;
}

function formatMoney (n, c, d, t) {
var c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function rvmTypeConverter(a) {
	var xType=roundingFormatter;
		switch(a) {
				case 1: xType=roundingFormatter; break;
				case 2: xType=mdYFormatter; break;
				case 3: xType=ynFormatter; break;
				case 4: xType=tfFormatter; break;
				case 5: xType=moneyFormatter; break;
				case 6: xType=rvmFormatter; break;
				case 7: xType=curveFormatter; break;
				case 8: xType=rateFormatter; break;
		}
		return xType;
}

// case 8
function rateFormatter(row, cell, value, columnDef, dataContext) {
	switch(Math.round(value)) {
			case 0:  return("Fixed");
			case 1:  return("Adjustable");
			case 2:  return("W.A.Coupon");
			default: return("N/A");
	}
}

// case 7
function curveFormatter(row, cell, value, columnDef, dataContext) {
	return value ? "SWP" : "TSY";
}

// case 5
function moneyFormatter(row, cell, value, columnDef, dataContext) {
	var n=(columnDef["precision"]<0)?2:columnDef["precision"];
	var f=formatMoney(value,n, '.', ',');
	return "<span style='float:right;'>" + f + "</span>";
}

// case 6
function rvmFormatter(row, cell, value, columnDef, dataContext) {
		var xType="N/A";
		switch(Math.round(value)) {
				case 1: xType="LOC"; break;
				case 2: xType="TERM"; break;
				case 3: xType="Tenure"; break;
				case 4: xType="ModTerm"; break;
				case 5: xType="ModTenure"; break;
		}
		return xType;
}

// case 4
function tfFormatter(row, cell, value, columnDef, dataContext) {
	return value ? true : false;
}

// case 3
function ynFormatter(row, cell, value, columnDef, dataContext) {
	return value ? "Yes" : "No";
}

// case 2
function mdYFormatter(row, cell, value, columnDef, dataContext) {
	var x=value;
	var f=(x<12345678) ? "01/01/1900":
	Math.round((x%10000)/100,0)+"/"+x%100+"/"+Math.round(x/10000,0);
	return "<span style='float:right;'>" + f + "</span>";
}


function roundingFormatter(row, cell, value, columnDef, dataContext) {
	value=parseFloat(value);
	if(isNaN(value)) value=-999999;
	n=(columnDef["precision"]<0)?3:columnDef["precision"];
	num=Math.round(value*Math.pow(10.,n))/Math.pow(10.,n);
	var f= num.toFixed(n);
	return "<span style='float:right;'>" + f + "</span>";
}

function dcm2str(v) {for(j=0;j<v.length;j++){var y=v[j];$.each(y, function(i,x){if(i.substr(-3)!="Grp"&&i!="RawId"){y[i]=x.toString();}});}}

// CREATE GRID TABLE 
function GridTbl(idName,tblObj) {
	gridId="#"+idName+"Grid";
	data=tblObj.jsonData;
	hdr=tblObj.jsonHeader;
	tblObj.gridId=gridId;
	prfHdr[idName]=hdr;
	if(prfBas[idName]==null) {
		if(idName=="xtsy_dat") {
			col=xtsy_datCol;
		} else if (idName=="xindex_dat"){ 
			col=xindex_datCol;
		} else if (idName=="pyt") {
			col=pytCol;
			if(hdr[0]=='YIELD') { col[0] = pyt1st_YIELD;
			} else if(hdr[0]=='DM') { col[0] = pyt1st_DM;
			} else { col[0] = pyt1st_PRICE;
			}
		} else if (idName=="cfs") {
//			col=cfsCol;
			col= colAsg(hdr,data,idName);
		} else {
			col= colAsg(hdr,data);
		}
	} else {
	//	col= colAsg(hdr,data);
	//	col= gridColAsg(hdr,data,idName);
		col= prfColAsg(hdr,data,idName);
	}
	if($(gridId)[0]) { $(gridId)[0].style.width ="800px"; }
	grid = new Slick.Grid(gridId, data, col, options);
/*
	grid.onAddNewRow.subscribe(function (e, args) {
		var item = args.item;
		grid.invalidateRow(data.length);
		data.push(item);
		grid.updateRowCount();
		grid.render();
	});
*/

	grid.setSelectionModel(new Slick.CellSelectionModel());

//	grid.registerPlugin(new Slick.CellExternalCopyManager());
	PageGrid[idName]=grid;
	PagePrf[idName]=grid.getColumns(); 


	grid.onCellChange.subscribe(function (e, args) {
		xlist=args.grid.getColumns();
		colname=xlist[args.cell].name;
		ret=colname + "[" + args.row + "," + args.cell + "] = ";
		ret = ret + args.item[colname] ;
	 });


	grid.onContextMenu.subscribe(function (e,args) {
		e.preventDefault();
		$("#contextMenu")
			.css("border", "solix 1px")
			.css("margin", "10px")
			.css("top", e.pageY)
			.css("left", e.pageX)
			.css("z-index", "2")
			.css("background", "white")
			.show();
		$("body").one("click", function (e) {
		//	alert($(e.target).attr("data"));
			$("#contextMenu").hide();
		});
	});


/*
	grid.onKeyDown.subscribe(function (e, args) {
		if(e.which==86 && e.ctrlKey) {
			alert("Ctrl+V was pressed!!");
			alert(JSON.stringify(args));
		}

	});
*/
	adjGridCanvasWidth(idName,gridId); 
	PageGrid[idName].render();
}

function adjGridCanvasWidth(idName,gridId) {
	if(parseFloat(PageGrid[idName].getCanvasNode().style.width) > parseFloat($(gridId).css("width"))+10)
		$(gridId)[0].style.width=addPixel(PageGrid[idName].getCanvasNode().style.width,15);
	else
		$(gridId)[0].style.width=PageGrid[idName].getCanvasNode().style.width;
}

function addPixel(origPx,addPx) {
	u = origPx;
	if(m=u.match(/^(\d+)px$/)) 
		u = (Number(m[1]) + addPx) + 'px'; 
	return u;
}

//- CHART SETUP
function chartHC(idName,tblObj) {
	var series1=[];
	var series2=[];
	var ctgList=[];
	chartIdName=idName+"Chart";
	if(document.getElementById(chartIdName)==null) { return 0; }
	titleName=idName+" Chart";
	xctgName=tblObj.jsonHeader[tblObj.jsonHeader.length-1];
	xnu=(tblObj.jsonHeader.length>4+3)?4:tblObj.jsonHeader.length-3;
	labelName1=tblObj.jsonHeader[xnu];
	data=tblObj.jsonData;
	j=0;
	$.each(data, function(i, dx){ 
		if(i>0 && i<20) {
			for(var key in dx) {
	if(key == xctgName) {
		ctgList[j]=dx[key];
	} else if(key == labelName1) {
		series1[j]=dx[key];
	}
			}
			j++;
		}
	});
	chart = new Highcharts.Chart({
			chart: { renderTo: chartIdName, alignTicks: false },
			title: { text: titleName },
			series: [ { type: 'column', name: labelName1, data: series1 } ]
	});

}

//drawHiChart("cfsChart","Cashflow","column","Net CashFlow",_.pluck(PageGrid.cfs.getData(),"Net CashFlow"))
function drawHiChart(element_id,chart_title,series_type,series_name,series_data,yTitle,xTitle,xCategories,xpts) {
	if(xTitle==null) xTitle="";
	if(yTitle==null) yTitle="";
	series_data=series_data.map(function(x,i){return (typeof(x)=="string")?0:x;});
	var series_min=_.min(series_data);
	var series_max=_.max(series_data);
	var LegendYN=false;
	if(series_min==series_max){
		series_max+=5;
		series_min-=5;
	}
	var opts = {
		title: { text: chart_title },
		chart: { renderTo: element_id, alignTicks: true },
		yAxis: { min: series_min, max:series_max,startOnTick: false,title:{text:yTitle}},
		xAxis: { 
			title:{text:xTitle},
			categories:xCategories
		},
		credits: { enabled: false },
		series: [{type:series_type,name:series_name,showInLegend:LegendYN,data:series_data}]
        };
	if(xpts!=null && typeof xpts=="object") { 
		$.extend(true,opts,xpts); }
	var chart = new Highcharts.Chart(opts);
	return chart;
}

function chartTbl(idName,tblObj) {
	chartID=idName+"Chart";
	if(document.getElementById(chartID)==null) { return 0; }
	chartObj={};
	chartObj.chartID=chartID;
	chartObj.data=tblObj.jsonData;
	chartObj.hdr=tblObj.jsonHeader;
	chartObj.xKey=chartObj.hdr[chartObj.hdr.length-1];
	chartObj.yKeyS=[];
	chartObj.yTypS=[];
	chartObj.yKeyS.push(chartObj.hdr[1]);
	chartObj.yKeyS.push(chartObj.hdr[2]);
	chartObj.titleName=chartID+ "Chart";
	chartObj.nobs=120;
	chartDrawHC(chartObj);
}

function chartDrawHC(chartObj) {
	var nobs=chartObj.nobs;
	var ySeries=[];
	var yElem={};
	ctgList=get_kyVec(chartObj.xKey,chartObj.data,nobs);
	for(var k in chartObj.yKeyS) { 
		kyName=chartObj.yKeyS[k];
		yElem.type='column';
		yElem.name=kyName;
		yElem.data=get_kyVec(kyName,chartObj.data,nobs); 
		ySeries.push(yElem);
	 }
	chart = new Highcharts.Chart({
			chart: { renderTo: chartObj.chartID, alignTicks: false },
			xAxis : [{categories: ctgList}],
			title: { text: titleName },
			series: ySeries
	});
}

function get_kyVec(kyName,tblData,nobs) {
	vx=[];
	for (var k in tblData) {
		if(k<nobs)
			vx.push(tblData[k][kyName]);
	}
	return vx;
}

function RUN_getAsm(actionFlg) {
	asmTypeName=$("#asmTypeList").find('option:selected').val();
	fpval=$("#asmList").find('option:selected').val();
	if(fpval && fpval.length>0) {
		fpName=fpval.trim() + '.vec.'+ asmTypeName;
		RUN_getDataTable(actionFlg,'asm',fpName);
	}
}

//PMA_newDeal
function RUN_newDeal(actionFlg,dealName) {
	if(actionFlg.length<1) actionFlg="PMA_newDeal";
	if(dealName.length<1) {alert("please a dealname");return 0; }
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealFrom=' + '_NEW'
		+'&dealName=' + dealName
		+'&loginName=' + loginName
		+'&callback=?';
	$.getJSON(urlName, callback);

	function callback(jsonObj) {
		PageTbl=jsonObj;
		for(keyObjName in jsonObj) {
			keyObj=jsonObj[keyObjName];
			tabName=keyObj.tabName;
			dataType=keyObj.dataType;
			gridName=tabName+"Grid";
			if(keyObjName.substr(0,4)=="dcm_") dcm2str(keyObj.jsonData);
			if(document.getElementById(gridName)!=null) {
				if(dataType==1) {
					GridTbl(tabName,keyObj);
//					chartHC(tabName,keyObj);
				} else {
					tmpStr='';
					$.each(keyObj.jsonData,function(i,d) {
						tmpStr=tmpStr+d+"\n";});
					document.getElementById(gridName).innerHTML=tmpStr;
				}
			}
		}
		for(ky in asmDspList) { asmDcmUpdByType(ky,asmFpList[ky]); }
		if(initAsmX==0) { asmTableUpd(); initAsmX++; }
 		RUN_getOutputList("PMA_getOutputList");
		if($("#secTabs").css("display")=="none") $("#secTabs").show();
		showSec(currName);
		currDealName=dealName;
		document.getElementById("dealInfo").innerHTML="Deal: "+currDealName;
		loadSelectBox("loanNum_cfs",_.pluck(PageGrid.cln.getData(),"RawId"),0,"ALL");
		RUN_getDealList("PMA_getDealList",loginName,isCtr);
	}
	document.getElementById("outGrid").innerHTML="";
}

//PMA_getDeal
function RUN_getDeal(actionFlg,dealName,dealStatus) {
	if(actionFlg.length<1) actionFlg="PMA_getDeal";
	if(dealName.length<2) {alert("No deal selected");return 0; }
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + dealName
		+'&loginName=' + loginName
		+'&callback=?';
	$.getJSON(urlName, call_getDeal);

	function call_getDeal(jsonObj) {
		PageTbl=jsonObj;
		for(keyObjName in jsonObj) {
			keyObj=jsonObj[keyObjName];
			tabName=keyObj.tabName;
			dataType=keyObj.dataType;
			gridName=tabName+"Grid";
			if(keyObjName.substr(0,4)=="dcm_") dcm2str(keyObj.jsonData);
			if(document.getElementById(gridName)!=null) {
				if(dataType==1) {
// TO LOAD  jsonData to [tab]Grid as table & graph such as cln & bnd
					GridTbl(tabName,keyObj);
				//	chartHC(tabName,keyObj);
				} else {
// TO LOAD  jsonData to [tab]Grid as text, such as rle & gnr
					tmpStr='';
					$.each(keyObj.jsonData,function(i,d) {
						tmpStr=tmpStr+d+"\n";});
					document.getElementById(gridName).innerHTML=tmpStr;
				}
			}
		}
		for(ky in asmDspList) { asmDcmUpdByType(ky,asmFpList[ky]); }
		if(initAsmX==0) { asmTableUpd(); initAsmX++; }
 		RUN_getOutputList("PMA_getOutputList");
		if($("#secTabs").css("display")=="none") $("#secTabs").show();
		showSec(currName);
		currDealName=dealName;
		document.getElementById("dealInfo").innerHTML="Deal: "+currDealName;
		loadSelectBox("loanNum_cfs",_.pluck(PageGrid.cln.getData(),"RawId"),0,"ALL");
		if(typeof PageTbl.bnd_OBJ != "undefined") {
			var bndLstX=_.pluck(PageTbl.bnd_OBJ.jsonData,'Bclname');
			loadSelectBox("tranche_cfs",bndLstX,0);
			loadSelectBox("trancheNum_cfs",bndLstX,0);
		}
		if(typeof dealStatus != "undefined" && dealStatus==1) 
		RUN_getDealList("PMA_getDealList",loginName,isCtr);
	}
	document.getElementById("outGrid").innerHTML="";
}

//PMA_deleteAsm
function RUN_deleteAsm(actionFlg) {
	if($("#asmList option").length<2) {
		alert("Unable to delete last selection.");
		return(-3);
	}
	asmTypeName=$("#asmTypeList").find('option:selected').val();
	selN=$("#asmList").find('option:selected').val().trim();
	if(selN.length<1) { alert("Empty Name"); return(-1); }
	if(selN.substr(0,1)=='_') { alert("Unable to delete Reserved "+selN); return(-2); } 
        var xS="#"+asmTypeName+"Row select";
	var x2=_.pluck($(xS).find('option:selected'),"value");
	if(x2.indexOf(selN)>=0) { alert("Unable to delete used "+selN); return(-3); } 

	extName='.vec.'+asmTypeName;
	fpName=selN + extName;
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&fileName=' + fpName
		+'&extName=' + extName
		+'&callback=?';
	$.getJSON(urlName, callback);
	function callback(ret) {
		var tp=asmTypeName;
		asmFpList[tp]=$.map(ret,function(d,k) {if(d.substr(-3)==tp)return d.split(":")[0].trim();});
		loadSelectBox("asmList",asmFpList[asmTypeName]);
		var selN=$("#asmList option")[0].value;
		$("#asmList").val(selN).attr('selected',true);
		RUN_getAsm("PMA_getAsm");
		asm2ScnXupd(tp);
	}
}

//PMA_getAsmList
function RUN_getAsmList(actionFlg,loginName,isCtr) {
	asmTypeName=$("#asmTypeList").find('option:selected').val();
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&extName=' + '.vec.*' 
		+'&callback=?';
	$.getJSON(urlName, callback);
	function callback(ret) {
		aType=$("#asmTypeList option").map(function(k,d) {return d.value;});
		$.each(aType, function(i,tp) {
//			asmFpList[tp]=$.map(ret,function(d,k) {if(d.substr(-3)==tp)return d;});
			asmFpList[tp]=$.map(ret,function(d,k) {if(d.substr(-3)==tp)return d.split(":")[0].trim();});
		});
		loadSelectBox("asmList",asmFpList[asmTypeName]);
		RUN_getAsm("PMA_getAsm");
		asmDcmGridInit(asmDspList,asmFpList); // asmDcmGridLoad(asmDspList,asmFpList);
	}
}

function swtAsmList(aname) {
	loadSelectBox("asmList",asmFpList[aname]);
	RUN_getAsm("PMA_getAsm");
}
	
//PMA_deleteDeal
function RUN_deleteDeal(actionFlg) {
	var yn=prompt("Are you sure? (Y/N)");
	if(yn!="Y") return(0);
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + PageTbl.adminInfo.loginName
		+'&callback=?';
	$.getJSON(urlName, callback);
	function callback(ret) {
		idName="dealList";
		loadSelectBox(idName,ret);
		alert(PageTbl.adminInfo.dealName+" Deleted");
		location.reload();
	}
}

//PMA_getOutputList
function RUN_getOutputList(actionFlg) {
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&dealName=' + PageTbl.adminInfo.dealName
		+'&loginName=' + loginName
		+'&callback=?';
	$.getJSON(urlName, callback);
	function callback(ret) { getOutputList(ret); }
}
	
//PMA_getDealList
function RUN_getDealList(actionFlg,loginName,isCtr) {
	urlName=urlPath
		+'?actionFlg='+actionFlg
		+'&dealType=' + dealType
		+'&loginName=' + loginName
		+'&callback=?';
	$.getJSON(urlName, function(ret) {
		idName="dealList";
		loadSelectBox1(idName,ret,"","(Select Pool)");
		if(currDealName.length>1)
		$('#dealList option[value="'+currDealName+'"]').attr('selected',true);
	});
}
	
function loadSelect2Box(idName,ret) {
	var dealListBox=document.getElementById(idName);
	if(dealListBox==null) return;
	dealListBox.length=0;
	ix=0;
	$.each(ret, function(i, d2){
		xd=d2.split(":");
		if(xd.length<2) xd[1]=xd[0];
		if(ix==0)
		dealListBox.options[ix] = new Option(xd[0],xd[1],true,true);
		else 
		dealListBox.options[ix] = new Option(xd[0],xd[1],false,false);
		ix++;
	})
}

function loadSelectBox1(idName,ret,val,txt) {
	var dealListBox=document.getElementById(idName);
	if(dealListBox==null) return;
	if(val==null) val="";
	if(txt==null) txt=val;
	dealListBox.length=0;
	iz=-1;
	iy=0;
	$.each(ret, function(i, d){
		if(d != "") {
			if(val==d) { 
				iz=iy;
				dealListBox.options[iy] = new Option(txt,val,true,true);
			} else {
				dealListBox.options[iy] = new Option(d,d,false,false);
			}
			iy++;
		}
	});
	if(iz<0) {
		dealListBox.options[iy] =  new Option(txt,val,true,true);
	}
}

function loadSelectBox(idName,ret,j,t) {
	var dealListBox=document.getElementById(idName);
	if(dealListBox==null) return;
	dealListBox.length=0;
	ix=0;
	iy=(j!=null)?j:ret.length-1;
	$.each(ret, function(i, d){
		if(ix!=iy)
		dealListBox.options[ix] = new Option(d,d,false,false);
		ix++;
	})
	txt=(t!=null)?t:ret[iy];
	dealListBox.options[iy] =  new Option(txt,ret[iy],true,true);
}
	
function openNewWin(url,name,attr) {
	return window.open(url,name,attr);
}

function getQueryString() {
	var queries = {};
	$.each(document.location.search.substr(1).split('&'),function(c,q){
	var i = q.split('=');
	//queries[i[0].toString()] = i[1].toString();
	});
	//console.log(queries);
	//alert(queries);
}

function prfView_bnd(actionFlg,appN,prfN,actN) {
 	x=actionFlg+":"+appN+" "+prfN+" "+actN;
//	alert(x);
	var clxBas=prfBas[prfN];
	var clxCur=prfColSel(clxBas);	
	PageGrid[prfN].setColumns(clxCur);
	prfCur[prfN]=clxCur;
}

function prfView_cln(actionFlg,appN,prfN,actN) {
 	x=actionFlg+":"+appN+" "+prfN+" "+actN;
//	alert(x);
	var clxBas=prfBas[prfN];
	var clxCur=prfColSel(clxBas);	
	PageGrid[prfN].setColumns(clxCur);
	prfCur[prfN]=clxCur;
}

function prfViewAction(appN,prfN,actN) {
	var appList   ={"prfView_cln":prfView_cln,"prfView_bnd":prfView_bnd};
	var appFlgList={"prfView_cln":"PMA_savePrf","prfView_bnd":"PMA_savePrf"};
	if(typeof(prfViewWin)!="undefined")
		prfViewWin.close();
	appList[appN](appFlgList[appN],appN,prfN,actN);
}

function saveAsAction(appN,selN) {
	var appList   ={"dealList":RUN_saveAsDeal,"asmList":RUN_saveAsm};
	var appFlgList={"dealList":"PMA_saveAsDeal","asmList":"PMA_saveAsm"};
	if(typeof(saveAsWin)!="undefined")
		saveAsWin.close();
	appList[appN](appFlgList[appN],appN,selN);
}

function includeScript(filename) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	head.appendChild(script);
}

function includeStyle(filename) {
	var head = document.getElementsByTagName('head')[0];
	var style = document.createElement('link');
	script.href = filename;
	script.type = 'text/css';
	script.rel = 'stylesheet';
	head.appendChild(style);
}

/* following codes for creating asmTable
useage of asmDcmGridLoad(asmDspList,asmFpList) {
usage of asmDcmUpdByType("ppy",asmFpList["ppy"])
OR
	for(ky in asmDspList) {
		asmDcmUpdByType(ky,asmFpList[ky]);
	}
*/
function asmDcmGridLoad(xlst,asmList) {
	$("#asmDcmGrid").load("asmTbl.shtm #asmTable",function(){
		asmDcmGridInit(xlst,asmList);
	});
}
	
function asmDcmGridInit(xlst,asmList) {
	var ky,ix,iy;
	for(ky in xlst) {
		ix=iy=1;
		rName="#"+ky+"Row"+" td";
		$.each($(rName), function(i,x) {
			if(i==0) {
				x.innerHTML=xlst[ky]+":";
			} else if(i%2) {
				sx=ky+"MulX"+ix;
				x.innerHTML="<input id="+sx+" size=5 type=text value=100 >";
				ix++;
			} else {
				sy=ky+"ScnX"+iy;
				x.innerHTML="<select id="+sy+" ></select>";
				loadSelectBox1(sy,asmList[ky]);
				iy++;
			}
		});
	}
	$("#asmTable *").css({"margin":"0","padding":"0"});
	$("#asmTable select").css("width","100px");
	$("#asmTable input").css("width","30px");
	$("#asmTable td:first-child").css({"width":"110px","font":"bold 12pt Arial"});
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function asmDcmUpdByTypeRVM(ky,asmLx) {
	var ix,iy,selN;
	ix=iy=1;
	sName=$("#"+ky+"Row"+" select");
	iName=$("#"+ky+"Row"+" input");
	for(j=0;j<sName.length;j++) {
		var sy=sName[j].id;
		var scnName= sy.capitalize();
		ms=PageTbl["dcm_"+ky+"_OBJ"].jsonData[0][scnName].split(" ");
		if(ky=="drw"||ky=="ppy") {
			selN=(ms.length>2)?ms[1].trim():"SMM";
			loadSelectBox1(sy,asmLx,"SMM","(Monthly Flat)");
		} else if(ky=="dft") {
			if (ms.length >= 2) {
				selN=ms[1].trim();
			} else {
				selN="MDR";
			}
			xsm = asmLx;
			if (xsm.indexOf("MDR")<0) 
				xsm[xsm.length]="MDR";
			if (xsm.indexOf("CDR")<0) 
				xsm[xsm.length]="CDR";
			loadSelectBox1(sy,xsm,selN,selN);
		} else {
			selN=(ms.length>2)?ms[1].trim():"";
			loadSelectBox1(sy,asmLx,"","(Flat)");
		}
		$("#"+sy).val(selN).attr("selected",true);
		$("#"+iName[j].id).val(ms[0]);
	}
}

function asmDcmUpdByTypeMBS(ky,asmLx) {
	var ix,iy,selN;
	ix=iy=1;
	sName=$("#"+ky+"Row"+" select");
	iName=$("#"+ky+"Row"+" input");
	for(j=0;j<sName.length;j++) {
		var sy=sName[j].id;
		var scnName= sy.capitalize();
		ms=PageTbl["dcm_"+ky+"_OBJ"].jsonData[0][scnName].split(" ");
		if(ky=="ppy" || ky=="dft" ) {
			var typLst=asmType[ky].TypeList
			if (ms.length >= 3) {
				selN=ms[2].trim();
			} else if (ms.length == 2) {
				selN=ms[1].trim();
			}
			if(typLst.indexOf(selN)<0)
				selN=asmProdList[ky];
			xsm = asmLx.slice();
			typLst.map(function (k,j){if(xsm.indexOf(k)<0) xsm.splice(0,0,k);});
			loadSelectBox1(sy,xsm,selN,selN);
		} else {
			selN=(ms.length>2)?ms[1].trim():"";
			loadSelectBox1(sy,asmLx,"","(Flat)");
		}
		$("#"+sy).val(selN).attr("selected",true);
		$("#"+iName[j].id).val(ms[0]);
	}
}

/* following codes for binding asmTable
function _tmpStr(x,y,t) {var z=$("#"+y+"MulX"+x).val()+" "+$("#"+y+"ScnX"+x).val()+t;return(z);}
function _dcmGridUpd(x,y,xstr) {
function ScnXupd(id) {
function asmTableUpd() {
************************/
function _tmpStr(x,y,t) {
	var a=$("#"+y+"MulX"+x).val();
	var b=$("#"+y+"ScnX"+x).val();
	var z="";
	if(a==null || b==null) return(z);
	z=a+" "+b;
	if(asmType[y].TypeList.indexOf(b.toUpperCase())<0)
		z+=" "+t;
	return(z);
}
function _dcmGridUpd(x,y,xstr) {
	o="dcm_"+y;h=y.capitalize()+"ScnX"+x;
	PageTbl[o+"_OBJ"].jsonData[0][h]=xstr;
	PageGrid[o].setData(PageGrid[o].getData());PageGrid[o].render();
}

function ScnXupd(id,a) {
	var x,y,z,xstr;
	y=id.substr(0,3); // asm type
	if(Object.keys(asmDspList).indexOf(y)<0) 
		return false;
	x=id.substr(7); // scn#
	t=" "+a[y]; // prepay type
	xstr=_tmpStr(x,y,t);
	_dcmGridUpd(x,y,xstr);
}

function asmTableUpd() {
	$("#asmTable input").change(function(e) {
		ScnXupd(this.id,asmProdList); });
	$("#asmTable select").change(function(e) {
		ScnXupd(this.id,asmProdList); });
}

function asm2ScnXupd(ky) {
//	var ky=$("#asmTypeList option").val();
	var x1=_.pluck($("#asmList option"),"value");
	var xS="#"+ky+"ScnX";
	var x2=_.without(_.pluck($(xS+1+" option"),"value"),"");
	if(_.difference(x1,x2).length > 0 || _.difference(x2,x1).length > 0) {
		asmDcmUpdByType(ky,x1);
	}
}

function getPageGridArray(id,name) {
	if(PageGrid[id]==null) return "undefined";
	return _.pluck(PageGrid[id].getData().slice(1),name);
}

function groupByArray(vx,a,t) {
	if(t==null) t=1;
	var vy=_.groupBy(vx,function(num){ return _.find(a,function(x1) { return num<x1; }); });
	var vyy={};$.each(vy,function(m,d) {x=a.indexOf(parseFloat(m));l=(x<0)?a[a.length-1]/t+"+":(x<1)?a[0]/t+"-":a[x-1]/t+"+";vyy[l]=d;});
	return vyy;
}

//sttColumnChart("stt_d2","cln","CageBrw","","column","Brw Age") {
function sttColumnChart(chartId,gridId,name,a,chartType,chartTitle,yTitle,xTitle) {
	if(yTitle==null)yTitle="%"; if(xTitle==null)xTitle="range";
	if(a==null || !_.isArray(a) ) a=[60,62,65,70,75,80,90];
	var vx,vy,vzz,j,t;
	vx=getPageGridArray(gridId,name);
	t=(a[a.length-1]>10000)?1000:1;
	vy=groupByArray(vx,a,t);
	vzz=$.map(vy,function(x,i){return x.length/vx.length*100;});
	var xtmp=Object.keys(vy);
	drawHiChart(chartId,chartTitle,chartType,chartTitle,vzz,yTitle,xTitle,xtmp);
}

//sttPieChart("stt_d1","cln","CageBrw","","pie","Brw Age") {
function sttPieChart(chartId,gridId,name,a,chartType,chartTitle) {
	if(a==null || !_.isArray(a) ) a=[60,62,65,70,75,80,90];
	var vx,vy,vzz,j;
	vx=getPageGridArray(gridId,name);
	vy=groupByArray(vx,a);
	j=0;vzz=[];$.each(vy,function(i,x){vzz[j]=[i,x.length/vx.length*100];j++;});
	drawHiChart(chartId,chartTitle,chartType,chartTitle,vzz,"%","Range");
}

function FloatEditor(args) {
		var $input;
		var defaultValue;
		var scope = this;

		this.init = function () {
$input = $("<INPUT type=text class='editor-text' />");

$input.bind("keydown.nav", function (e) {
	if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
		e.stopImmediatePropagation();
	}
});

$input.appendTo(args.container);
$input.focus().select();
		};

		this.destroy = function () {
$input.remove();
		};

		this.focus = function () {
$input.focus();
		};

		this.loadValue = function (item) {
defaultValue = item[args.column.field];
$input.val(defaultValue);
$input[0].defaultValue = defaultValue;
$input.select();
		};

		this.serializeValue = function () {
return parseFloat($input.val(), 10) || 0;
		};

		this.applyValue = function (item, state) {
item[args.column.field] = state;
		};

		this.isValueChanged = function () {
return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
		};

		this.validate = function () {
if (isNaN($input.val())) {
	return {
		valid: false,
		msg: "Please enter a valid decimal number"
	};
}

return {
	valid: true,
	msg: null
};
		};

		this.init();
}

