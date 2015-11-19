// loadPRF-0.22.js
// GLOBAL VARIABLE
var urlPath='/scripts/processPMA.1.5.php';
var dealType=5;
var gridView=[];
var prfData=[];
var prfHdrL=[];
var prf_id;
var gridId;
var selectFieldName;
var saveFieldName;
var prfN;
var appN;
var loginName;
var currName;

var prfViewOpts = {
	editable: true,
	enableAddRow: false,
	enableCellNavigation: true,
	asyncEditorLoading: false,
	enableColumnReorder: false,
	multiColumnSort: true,
	autoEdit: true
};


var prfViewClx = [
	{id:"colid",name:"I.D.",field:"colid",toolTip:"Column Number",width:36,cssClass: "cell-title",editor:Slick.Editors.Integer,precision:0,sortable: true},
	{id:"show",name:"Show",field:"show",toolTip:"Show Header Column",width:60,editor:Slick.Editors.Integer,precision:0,formatter:ynFormatter,sortable: true},
	{id:"precision",name:"Prc",field:"precision",toolTip:"Decimal Precision",width:60,editor:Slick.Editors.Integer,precision:0,formatter:Slick.Formatters.Round2,sortable: true},
	{id:"field",name:"Field",field:"field",toolTip:"Header Internal Name",width:100,cssClass:"cell-field",editor:Slick.Editors.Text,sortable: true},
	{id:"name",name:"Display",field:"name",toolTip:"Header Display Name",width:180,cssClass:"cell-name",editor:Slick.Editors.Text,sortable: true},
	{id:"toolTip",name:"Description",field:"toolTip",toolTip:"Header Tool Tip",width:292,cssClass:"cell-name",editor:Slick.Editors.Text,sortable: true},
	{id:"datatype",name:"Datatype",field:"datatype",toolTip:"0:TEXT,1:NUMBER, 2:DATE, 3:YES/NO, 4:TRUE/FALSE, 5:CURRENCY, 6:RevMtge TYPE[0-5]:LoC/Term/Tenure/Modified/Term/ModifiedTenure, 7:CURVE TYPE, 8:RATE TYPE",width:140,editor:Slick.Editors.Integer,precision:0,formatter:rvmDataTypeFormatter,sortable: true}
];

// unfinished reference codes: 
//	prfData[_.indexOf(_.pluck(prfData,"field"),"Cgrp")].field;
//	aIdxList=$("#prfList option").map(function(k,d) {if(d.value=="last")return k;}); // return index list
//	aNameList=$("#prfList").find('option:selected').val();
//	saveViewName currViewName

/* FUNCTION LIST
function saveAsAppName(x) {
function asgViewName() {
function createSelectOptions(selectFieldName,opt) {
function createPrfGrid(idname, data, columns, options) {
function loadPrfGrid(idname,prfN,data) {
function getURLParameter(name) {
function getURLvariable(x) {
// below duplicated in loadPMA.js
function RUN_savePrf(actionFlg,loginName,fpn,prfN) { 
function RUN_deletePrf(actionFlg,loginName,fpn,prfN) {
function RUN_getPrfList(actionFlg,loginName,fpn,prfN) {
function RUN_getPrf(actionFlg,loginName,fpn,prfN,asyFlg) {
function prfColAdd(hdrL,clx){  // add additional columns if not in preference
function prfClone(clx){    // clone columns  
*/
//___________________________________________________________________________________________________________________

/*
 Actions for saveAsAppName() in load,apply,close,delete,save:
	1. load prf file:  RUN_getPrf
	2. save to prf file:  RUN_savePrf
	3. copy prfData to parent prfBas: prfClone
	4. trigger parent code: opener.prfViewAction
	5. delete prf file:  RUN_deletePrf
*/
function saveAsAppName(actName) {
	var appName=appN;
	var fpn=document.getElementById(saveFieldName).value.trim();
	var cloneX,actX,aFpList;
	cloneX=actX=0;
	aFpList=$("#prfList option").map(function(k,d) {return d.value;}); // to get select box list
	switch (actName){
		case 'load':  // 1. of selected
			if(window.opener!=null)
				prfData=prfClone(window.opener.prfBas[prfN]);
			else
				RUN_getPrf("PMA_getPrf",loginName,fpn,prfN);
		break;
		case 'apply': // 2. to "__LAST" then 3 & 4
			RUN_savePrf("PMA_savePrf",loginName,"__LAST",prfN);
			cloneX=actX=1;
		break;
		case 'close':  // do nothing then 4
			actX=1;
		break;
		case 'delete':  // 5. of selected, then 1. to load "__LAST"
			RUN_deletePrf("PMA_deletePrf",loginName,fpn,prfN);
		break;
		case 'save': // 2. to "__LAST" & saveViewName then 3 & 4
			RUN_savePrf("PMA_savePrf",loginName,fpn,prfN);
//			cloneX=actX=1;
		break;
	}
	if(window.opener!=null) {
		if(cloneX)
			window.opener.prfBas[prfN]=prfClone(prfData);
		if(actX) // only for close & save & apply
			window.opener.prfViewAction(appName,prfN,actName);
	}
}

function asgViewName() {
	var e=document.getElementById(selectFieldName);
	document.getElementById(saveFieldName).value=e.options[e.selectedIndex].value;
}

function createSelectOptions(selectFieldName,opt) {
	viewObj=document.getElementById(selectFieldName);
	viewObj.options.length = 0;
	var ix=0;
	$.each(opt, function(ky, d){
		if(d.innerHTML.length>0) {
		viewObj.options[ix] = new Option(d.innerHTML,d.value,false,false);
		ix++;
		}
	})
	viewObj.options[viewObj.options.length] = new Option("OR","",true,true);
}

function createPrfGrid(idname, data, columns, options) {
	var gridId="#"+idname;
	var grid = {};
	if($(gridId)==null) return null;
	grid = new Slick.Grid(gridId, data, columns, options);
//	grid.setSelectionModel(new Slick.CellSelectionModel());
//  	grid.onCellChange.subscribe(function (e, args) { console.log("Hi"); });
	$(gridId)[0].style.width=addPixel(grid.getCanvasNode().style.width,15);
	grid.onSort.subscribe(function (e, args) {
		var cols = args.sortCols;
		data.sort(function (dataRow1, dataRow2) {
			for (var i = 0, l = cols.length; i < l; i++) {
				var field = cols[i].sortCol.field;
				var sign = cols[i].sortAsc ? 1 : -1;
				var value1 = dataRow1[field], value2 = dataRow2[field];
				var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
				if (result != 0) {
					return result;
				}
			}
			return 0;
		});
		grid.invalidate();
		grid.render();
	});
	return grid;
}

function loadPrfGrid(idname,prfN,data) {
	if(data==null) {
		alert("not data");
	}
	prfData=prfColAdd(prfHdrL,data);
	gridView = createPrfGrid(idname, prfData, prfViewClx, prfViewOpts);
}

function getURLParameter(name) {
	return decodeURI(
		(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]);
}

function getURLvariable(x) {
	var y=getURLParameter(x); 
	y=decodeURIComponent(y);
	return(y);
}

function prfListReset(fpn) {
	if(fpn=="__LAST") {
		$("#prfList").val("").attr('selected',true);
		$("#currViewName").text("(Internal)");
	} else {
		$("#"+"prfList").val(fpn).attr('selected',true);
		$("#currViewName").text(fpn);
	}
}

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
		prfListReset(fpn);
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
	$.getJSON(urlName, callback);
	function callback(ret) {
		var prfFpList=$.map(ret,function(d,k) {return d.split(":")[0].trim();});
		loadSelectBox("prfList",prfFpList);
		prfListReset(fpn);
//      aIdxList=$("#prfList option").map(function(k,d) {if(d.value=="last")return k;}); // return index list
//      aNameList=$("#prfList").find('option:selected').val();
//      saveViewName currViewName
	}
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
			prfListReset(fpn);
		}
	});
}

function prfColAdd(hdrL,clx){  // add additional columns if not in preference
	xits=_.intersection(hdrL,_.pluck(clx,"field"));
	xdif=_.difference(hdrL,xits);
	if(xdif.length<1) return clx;
	xlen=clx.length;
	$(xdif).each(function(i,d) {clx[i+xlen]=colObjInit(i,d);})
	return clx;
}

function prfClone(clx){    // clone columns  
	var cly=[];
	$(clx).each(function(i,dx) { cly[i]=_.clone(dx); } );
	return cly;
}
	
function addPixel(origPx,addPx) {
	u = origPx;
	if(m=u.match(/^(\d+)px$/)) 
		u = (Number(m[1]) + addPx) + 'px'; 
	return u;
}

function loadSelectBox(idName,ret) {
	var dealListBox=document.getElementById(idName);
	if(dealListBox==null) return;
	dealListBox.length=0;
	iy=0;
	$.each(ret, function(i, d){
		if(d != "") {
			dealListBox.options[iy] = new Option(d,d,false,false);
			iy++;
		}
	});
//	dealListBox.options[iy] =  new Option(ret[iy],ret[iy],true,true);
	dealListBox.options[iy] =  new Option("(Internal)","",true,true);
}

function ynFormatter(row, cell, value, columnDef, dataContext) {
	return ((value)?true:false);
}

function rvmDataTypeFormatter(row, cell, value, columnDef, dataContext) {
	var xType=0;
	switch(value) {
		case 0: xType="TEXT"; break;
		case 1: xType="NUMBER"; break;
		case 2: xType="DATE"; break;
		case 3: xType="YES/NO"; break;
		case 4: xType="TRUE/FALSE"; break;
		case 5: xType="CURRENCY"; break;
		case 6: xType="RevMtge TYPE"; break;
		case 7: xType="CURVE TYPE"; break;
		case 8: xType="RATE TYPE"; break;
	}
	return xType;
}

function SelectCellFormatter(row, cell, value, columnDef, dataContext) {
	opt_values = columnDef.options.split(',');
	option_str = "";
	for( i in opt_values ){ 
		v = opt_values[i]; 
		if(v == value)
		{
			option_str += "<OPTION value='"+v+"' selected>"+v+"</OPTION>";
		}
		else
		{
			option_str += "<OPTION value='"+v+"'>"+v+"</OPTION>";
		}
	} 
	return "<SELECT onchange='SelectCellFormatter_onchange(this, "
	   + row + "," + cell + ",\"" + value + "\");'>"+ option_str + "</SELECT>"
}

//SelectCellFormatter:

function SelectCellFormatter_onchange(vThis, vRow, vCell, vValue)
{
	 document.protokoll_form.protokoll_name.value += " row/" + vRow;
	 document.protokoll_form.protokoll_name.value += " cell/" + vCell;
	 document.protokoll_form.protokoll_name.value += " old/" + vValue;
	 document.protokoll_form.protokoll_name.value += " new/" 
			+  vThis[this.event.currentTarget.selectedIndex].value;
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
