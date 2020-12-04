$(document).ready(function(){
        $(document).on('click', ".dashboardRemoveAlarm", function() {
        
         if(checkDemoUsername()==false){
            var parentId = $(this).parents().eq(3).attr('id');
            var buttonId = $(this).attr('id');
            var device_id = parentId.split(/_/);
            $(this).closest('tr').remove();
            removeNewAlarm(buttonId, device_id[1]);
           }
        else 
        {
            callDemoUserAlertModal();
            console.log("Functions disabled");
        }
        });
});

function removeNewAlarm(id, device_id){


   data = {"device_id": device_id, "alarm_id": id, "username": username};

   $.ajax({

        type: "POST",
        url: "https://api.cl-ds.com/deleteAlarm/",
        headers: {"Authorization": "Token 62990ac3b609e5601a678c1e133416e6da7f10db"},
        // The key needs to match your method's input parameter (case-sensitive).
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
            alert(data.message);
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
    });

}
