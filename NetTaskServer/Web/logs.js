﻿//@ sourceURL= log.js
var Log=new (function (){
    var ajax=function(method,datas,callback){
        var url=method;
        if(datas){
            var pa='';
            for(var k in datas){
                pa+=k+'='+datas[k]+'&'
            }
            url+='?'+pa.substr(0,pa.length-1);
        }
        $.get(basepath + url, function (res) {
            if (res.State == 0) {
                alert(res.Msg);
                return;
            }
            if(callback)
                callback(res.Data)
        });
    };

    var icons=['info','danger'];
    var levels=['info','error']

    this.getLogFiles=function() {
        ajax('GetLogFiles',{'number':20,'error': $("#cbOnlyError").prop('checked')},function (data) {
            var html='';
            for(var i=0;i<data.length;i++){
                var d=JSON.parse(data[i]);
                html += "<h6>"+ d.name +"</h6>";
                for (var j =0;j<d.logs.length;j++) {
                    html += "<div class=\"btn-group\"><button type='button' onclick='Log.getLogFile(\""+ (d.name+'$'+levels[d.logs[j].level]+'$'+d.logs[j].name) +"\")' class='btn btn-outline-"+ icons[d.logs[j].level] +" mb-2'><span data-feather='file'></span> "
                        + d.logs[j].name+ "</button> "+
                        '<button type="button" onclick=\'Log.delLog("'+(d.name+'$'+levels[d.logs[j].level]+'$'+d.logs[j].name)+'")\' class="btn btn-outline-'+ icons[d.logs[j].level] +' mb-2 mr-2"><span data-feather="x"></span></button></div>\n';
                }
            }
            $("#divOldLog").html(html);
            if (feather)
                feather.replace();
        });
    };

    this.getLogNames=function(){
        ajax('GetLogNames',null,function (data) {
            var html='';
            for(var i=0;i<data.length;i++){
                html+='<option value="'+data[i]+'">'+data[i]+'</option>';
            }
            $('#ddlTaskName').html(html);
        });
    }

    this.delLog=function(log){
        if(!confirm("确定删除该日志吗？"))
            return;
        var self=this;
        ajax('DeleteLog',{'log':log},function () {
            self.getLogFiles();
        });
    }

    this.getLogFile=function(log){
        window.open('/GetLogInfo?log='+log,"_blank");
    }

    this.getLogInfoRealtime=function(){
        var name=$('#ddlTaskName').val();
        if(!name || name=='')
            return;
        ajax('GetLogInfoRealtime',{'task':name,'lines':200},function(data){
            $("#tbxLog").val(data);
            $('#tbxLog').scrollTop($('#tbxLog')[0].scrollHeight);
        });
    };
})();
(function () {
    $(document).ready(function () {
        $("#cbOnlyError").change(()=>Log.getLogFiles());
        $("#cbShowInTime").change(function(e) { 
            if($(e.target).prop('checked')){
                window.autoLogRefresh = setInterval(Log.getLogInfoRealtime,1000);
            }
            else{
                 window.clearInterval(window.autoLogRefresh);
            }
         }); 
        Log.getLogFiles();
        Log.getLogNames();
        window.autoLogRefresh = setInterval(Log.getLogInfoRealtime,1000);
    });
})();





// (function () {
//     refreshLog();
// }());

// function getLogFiles() {
//     $.get(basepath
//         + "GetLogFiles",
//         function (res) {
//             var data = res.Data;
//             var html = "<label>往期日志：</label><br />";
//             for (i in data) {
//                 html += "<button type='button' onclick='getLogFile(\""
//                     + data[i] + "\")' class='btn btn-outline-warning mb-2'><span data-feather='file'></span>"
//                     + data[i]
//                     + "</button> ";
//                 i++;
//             }
//             $("#divOldLog").html(html);
//         }
//     );
// };

// function getLogFile(filekey) {
//     var apiUrl = basepath + "GetLogFile?filekey=" + filekey;
//     window.open(apiUrl);
// }

// function getLogFileInfo(lines) {
//     var apiUrl = basepath + "GetLogFileInfo?lastLines=" + lines;
//     $.get(apiUrl,
//         function (res) {
//             var data = res.Data;
//             var logText = "";
//             for (i in data) {
//                 logText += data[i] + "\r\n";
//             }
//             $("#tbxLog").val(logText);
//         }
//     );
// }

// function refreshLog() {
//     getLogFiles();
//     getLogFileInfo(20);
//     setTimeout(scrollToBottom, 200);
// }

// function scrollToBottom() {
//     $('#tbxLog').scrollTop($('#tbxLog')[0].scrollHeight);
// }

