
function PMA_runTM(actionFlg) {
        if(actionFlg==1 && $('#txtAreaR').val().length<1) { alert("No Input Text"); return(-1); }
        if(actionFlg==2 && $('#txtAreaP').val().length<1) { alert("No Input Text"); return(-1); }
	var urlPath='/TM/runTM.php'
        urlName=urlPath
                +'?actionFlg='+actionFlg
                +'&callback=?';
	var myObj={};
	myObj.txtAreaP=$('#txtAreaP').val();
	myObj.txtAreaN=$('#txtAreaN').val();
	myObj.txtAreaR=$('#txtAreaR').val();
        $.ajax({
                type: 'POST',
                url: urlName,
                data: JSON.stringify(myObj),
                processData: false,
                dataType: "json",
                statusCode: { 401: function() { alert("page not found"); } },
                success:function(ret) {
                        $('#txtOut').text(ret.txtOut);
		},
                error:function(ret) {
			alert("error to run");
		}
        });
}
