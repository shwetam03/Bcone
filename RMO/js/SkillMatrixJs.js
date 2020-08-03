
var endpoint =GetSkills(1);// "https://ppmdev.bcone.com/_api/Skills";
var functionality = "";
var CurRowId = "";

$(document).ready(function () {

 

    $('#txtPractice')[0].value="";

	 $('.loader').show();
    setTimeout(function () {
     BindSkills();
	}, 100);
	
    
   
    $('#btnAddNew').on('click', function () {
        $('.popup-bg').show();
        $('#ddlSkillFamily').empty();
        $('#ddlSkillGroup').empty();
        $('#ddlSkillStream').empty();
        $('#ddlSkillDetails').empty();
        $('#ddlSillType').empty();
        $('#ddlStrategy').empty();
        $('#ddlAvailable').empty();
        $('#txtPractice').empty();
        $('#txtRemarks').empty();

        functionality = 'Insert';
        GetRowData();

    });

    $('.p-close').on('click', function () {
        $('.popup-bg').css("display", "none");
    });

	
	$('#ddlSubPractice').on('change',function(){
		
		var SelectedSubPracticeVal=$('#ddlSubPractice option:selected').val();
		GetSkills('',1);
		var url=GetSubPracticeVal(SelectedSubPracticeVal);//"https://ppmdev.bcone.com/_api/Skills?$filter=Sub_Practice+eq'"+SelectedSubPracticeVal+"'";
		
		$.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d.results;
					//for (var i = 0; i < data.length; i++) {
						$('#txtPractice').empty();
						if(data[0].Practice!=null)
						{
						    $('#txtPractice').val(data[0].Practice);
							
							
							//append("<option value=\"" + data[0].Practice + "\">" + data[0].Practice + "</option>");
						}
					//}
				},
				error: function (error) {
					result = 'error';
				}
			});
	});

});

function BindSkills()
{
	 $.ajax({
        url: endpoint,
        async: false,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
            result = data.d.results;
            $('#example > tbody').empty();
            for (var i = 0; i < result.length; i++) {
                var row = "<tr id=" + result[i].UID + "><td><span title='EDIT' class='glyphicon glyphicon-pencil  btnedit' aria-hidden='true' onclick='showPopUp(this)'></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span title='DELETE' class='glyphicon glyphicon-trash btndelete' aria-hidden='true' onclick='DeleteItem(this)'></span></td><td>" + (result[i].Skill_Family==null?'':result[i].Skill_Family) + "</td><td>" + (result[i].Skill_Group==null?'':result[i].Skill_Group) + "</td><td>" + (result[i].Skill_Stream==null?'':result[i].Skill_Stream) + "</td><td>" + (result[i].Skill_Details==null?'':result[i].Skill_Details) + "</td><td>" + (result[i].Skill_Type==null?'':result[i].Skill_Type) + "</td><td>" + (result[i].Strategicness==null?'':result[i].Strategicness) + "</td><td>" + (result[i].Availability==null?'':result[i].Availability) + "</td><td>" + (result[i].Practice==null?'':result[i].Practice) + "</td><td>" + (result[i].Sub_Practice==null?'':result[i].Sub_Practice) + "</td></tr>";
                $('#example > tbody').append(row);
            }

		$('#example tfoot th').each(function () {
				var title = $(this).text();
				if(title!="")
				{
					$(this).html('<input type="text"/>');    // placeholder="Search" 
				}
			});
			
           $('#example').dataTable({
                "dom": 'Rlfrtip',
				
				 "lengthMenu": [5, 10, 15, 20, 25, 30],
                "pageLength": 10,
                "aaSorting": [[1, "asc"]],
                "destroy": 'true',
				  "dom": 'lBfrtip',
        buttons: [
          {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [1,2,3,4,5,6,7,8,9]
                }
            },
        ],
		
		   });
                var table = $('#example').DataTable();

			 //Apply the search
			table.columns().every(function () {
				var that = this;
				$('input', this.footer()).on('keyup change', function () {
					if (that.search() !== this.value) {
						that
							.search(this.value)
							.draw();
					    }
				});
			});
				
			$(".buttons-excel,.buttons-print").find('span').empty();
			$(".buttons-excel").find('span').addClass('fa').addClass('fa-file-excel-o');
			$(".buttons-print").find('span').addClass('fa').addClass('fa-print');
			$(".buttons-excel").find('span').attr('title', 'Export to Excel');
			$(".buttons-print").find('span').attr('title', 'Print');
        },
        error: function (error) {
            result = 'error';
        }
         
    });
	 $('.loader').hide();
	
}

function showPopUp(id) {
    $('.popup-bg').show();
   // alert('edit func call');

    $('#ddlSkillFamily').empty();
    $('#ddlSkillGroup').empty();
    $('#ddlSkillStream').empty();
    $('#ddlSkillDetails').empty();
    $('#ddlSillType').empty();
    $('#ddlStrategy').empty();
    $('#ddlAvailable').empty();
    $('#txtPractice').empty();
    $('#txtRemarks').empty();

    functionality = 'Update';
    CurRowId = id.parentNode.parentNode.id;
    GetRowData();

}

function DeleteItem(id) {
    var CurRowId = id.parentNode.parentNode.id;
   // alert("delete item function");

    var url =GetorSetSkillsByRowId(CurRowId);// "https://ppmdev.bcone.com/_api/Skills(guid'" + CurRowId + "')";

    if (confirm("Are you sure to delete the item?")) {

        $.ajax({
            url: url,
            async: false,
            method: "DELETE",
            data: {
                "UID": CurRowId
            },
            headers: {
                "Accept": "application/json;odata=verbose"
            },

            success: function (data) {
                alert('Skills Deleted successfully');
                //window.location.reload();
            },
            error: function (error) {
                result = 'error';
                console.log(JSON.stringify(error));
            }

        });
		
         $('.loader').show();
          setTimeout(function () {
	      Reloadjs();
	      BindSkills();
         }, 100);
    }
}

function GetRowData() {

    //var url = "https://ppmdev.bcone.com/_api/Skills/Distinct?$select=Skill_Family";
    //var Skill_FamilyData = [];

	 var Url=GetDistinctValue();
	 
    Binddropdown(""+Url+"?$select=Skill_Family", "{\"On\":\"Skill_Family\"}", '#ddlSkillFamily', 0);
    Binddropdown(""+Url+"?$select=Skill_Group", "{\"On\":\"Skill_Group\"}", '#ddlSkillGroup', 1);
    Binddropdown(""+Url+"?$select=Skill_Stream", "{\"On\":\"Skill_Stream\"}", '#ddlSkillStream', 2);
    Binddropdown(""+Url+"?$select=Skill_Details", "{\"On\":\"Skill_Details\"}", '#ddlSkillDetails', 3);
    Binddropdown(""+Url+"?$select=Skill_Type", "{\"On\":\"Skill_Type\"}", '#ddlSillType', 4);
    Binddropdown(""+Url+"?$select=Strategicness", "{\"On\":\"Strategicness\"}", '#ddlStrategy', 5);
    Binddropdown(""+Url+"?$select=Availability", "{\"On\":\"Availability\"}", '#ddlAvailable', 6);
	Binddropdown(""+Url+"?$select=Sub_Practice", "{\"On\":\"Sub_Practice\"}", '#ddlSubPractice', 7);
	//Binddropdown("https://ppmdev.bcone.com/_api/Skills/Distinct?$filter=Sub_Practice eq ''", "{\"On\":\"Practice\"}", '#ddlPractice', 8);

        if (functionality == 'Update') {
            BindSkillsData();
        }
}

function Binddropdown(url, requestData, dropdownid, count) {

    $.ajax({
        url: url,
        async: false,
        data: requestData,
        type: "POST",
        dataType: "json",
        headers:
        {
            "content-Type": "application/json"
        },
        success: function (data) {
            var data = data.value;
            for (var i = 0; i < data.length; i++) {
                // Skill_FamilyData.push(data[i].Skill_Family);
                if (count == 0) {
					if(data[i].Skill_Family!=null)
					{
                    $(dropdownid).append("<option value=\"" + data[i].Skill_Family + "\">" + data[i].Skill_Family + "</option>");
					}
                }
                else
                    if (count == 1) {
						if(data[i].Skill_Group!=null)
					   {
                        $(dropdownid).append("<option value=\"" + data[i].Skill_Group + "\">" + data[i].Skill_Group + "</option>");
					   }
                    }
                    else
                        if (count == 2) {
							if(data[i].Skill_Stream!=null)
							{
                            $(dropdownid).append("<option value=\"" + data[i].Skill_Stream + "\">" + data[i].Skill_Stream + "</option>");
							}
                        }
                        else
                            if (count == 3) {
								if(data[i].Skill_Details!=null)
								{
                                $(dropdownid).append("<option value=\"" + data[i].Skill_Details + "\">" + data[i].Skill_Details + "</option>");
								}
                            }
                            else
                                if (count == 4) {
									if(data[i].Skill_Type!=null)
									{
                                    $(dropdownid).append("<option value=\"" + data[i].Skill_Type + "\">" + data[i].Skill_Type + "</option>");
									}
                                }
                                else
                                    if (count == 5) {
										if(data[i].Strategicness!=null)
										{
                                        $(dropdownid).append("<option value=\"" + data[i].Strategicness + "\">" + data[i].Strategicness + "</option>");
									    }
                                    }
                                    else
                                        if (count == 6) {
											if(data[i].Availability!=null)
											{
                                            $(dropdownid).append("<option value=\"" + data[i].Availability + "\">" + data[i].Availability + "</option>");
											}
                                        }
                                        else
                                            if (count == 7) {
												if(data[i].Sub_Practice!=null)
												{
                                                $(dropdownid).append("<option value=\"" + data[i].Sub_Practice + "\">" + data[i].Sub_Practice + "</option>");
												}
                                            }
											//else
												//if(count==8){
													//if(data[i].Practice!=null)
													//{
													//$(dropdownid).append("<option value=\"" + data[i].Practice + "\">" + data[i].Practice + "</option>");
													//}
												//}
            }

			
            $("#ddlSkillFamily").val("null");
            $("#ddlSkillGroup").val("null");
            $("#ddlSkillStream").val("null");
            $("#ddlSkillDetails").val("null");
            $("#ddlSillType").val("null");
            $("#ddlStrategy").val("null");
            $("#ddlAvailable").val("null");
			$("#ddlSubPractice").val("null");
            //$("#txtPractice").val("null");
			 $('#txtPractice')[0].value="";
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });
}

function Validate()
{
    if($('#ddlSkillFamily').val()==null)
    {
        $('.mandatory').empty();
        $('#ErrSkillFamily').text("Please Select Skill Family");
        return false;
    }
    if ($('#ddlSkillGroup').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrSkillGroup').text("Please Select Skill Group");
        return false;
    }

    if ($('#ddlSkillStream').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrSkillStream').text("Please Select Skill Stream");
        return false;
    }

    if ($('#ddlSkillDetails').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrSkillDetails').text("Please Select Skill Details");
        return false;
    }

    if ($('#ddlSillType').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrSkillType').text("Please Select Skill Type");
        return false;
    }

    if ($('#ddlStrategy').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrStrategicness').text("Please Select Strategy");
        return false;
    }

    if ($('#ddlAvailable').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrAvailability').text("Please Select Available");
        return false;
    }

    if ($('#ddlSubPractice').val() == null)
    {
        $('.mandatory').empty();
        $('#ErrPractice').text("Please Select Sub-Practice");
        return false;
    }
    else
      if (functionality == 'Insert') {
          InsertSkillsData();
          window.location.reload();
    }
    else
        if (functionality == 'Update') {
            UpdateSkillsData();
            window.location.reload();
        }
}

function InsertSkillsData() {
    $('.ErrorMsg').empty();
    var SkillFamilyValue = $('#ddlSkillFamily option:selected').text();
    var SkillGroupValue = $('#ddlSkillGroup option:selected').text();
    var SkillStreamValue = $('#ddlSkillStream option:selected').text();
    var SkillDetailsValue = $('#ddlSkillDetails option:selected').text();
    var SkillTypeValue = $('#ddlSillType option:selected').text();
    var StrategicnessValue = $('#ddlStrategy option:selected').text();
    var AvailabilityValue = $('#ddlAvailable option:selected').text();
    var PracticeValue = $('#txtPractice')[0].value;
    var SubPracticeValue = $('#ddlSubPractice option:selected').text();

    $.ajax({
        url: endpoint,
        async: false,
        method: "POST",
        data: {
            "Skill_Family": SkillFamilyValue,
            "Skill_Group": SkillGroupValue,
            "Skill_Stream": SkillStreamValue,
            "Skill_Details": SkillDetailsValue,
            "Skill_Type": SkillTypeValue,
            "Strategicness": StrategicnessValue,
            "Availability": AvailabilityValue,
            "Practice": PracticeValue,
            "Sub_Practice": SubPracticeValue
        },
        headers: {
            "Accept": "application/json;odata=verbose",
        },
        success: function (data) {
            alert('Skills added successfully');
        },
        error: function (error) {
            result = 'error';
            console.log(JSON.stringify(error));
        }

    });
	$('.popup-bg').hide();
	$('.loader').show();
          setTimeout(function () {
	      Reloadjs();
	      BindSkills();
         }, 100);
}

function BindSkillsData() {

    var CurSkillFamilyValue = $("#" + CurRowId + "")[0].cells[1].innerText;
    var CurSkillGroupValue = $("#" + CurRowId + "")[0].cells[2].innerText;
    var CurSkillStreamValue = $("#" + CurRowId + "")[0].cells[3].innerText;
    var CurSkillDetailsValue = $("#" + CurRowId + "")[0].cells[4].innerText;
    var CurSkillTypeValue = $("#" + CurRowId + "")[0].cells[5].innerText;
    var CurStrategicnessValue = $("#" + CurRowId + "")[0].cells[6].innerText;
    var CurAvailabilityValue = $("#" + CurRowId + "")[0].cells[7].innerText;
    var CurPracticeValue = $("#" + CurRowId + "")[0].cells[8].innerText;
    var CurSubPracticeValue = $("#" + CurRowId + "")[0].cells[9].innerText;

    $("#ddlSkillFamily").val(CurSkillFamilyValue);
    $("#ddlSkillGroup").val(CurSkillGroupValue);
    $("#ddlSkillStream").val(CurSkillStreamValue);
    $("#ddlSkillDetails").val(CurSkillDetailsValue);
    $("#ddlSillType").val(CurSkillTypeValue);
    $("#ddlStrategy").val(CurStrategicnessValue);
    $("#ddlAvailable").val(CurAvailabilityValue);
    $("#txtPractice").val(CurPracticeValue);
    $("#ddlSubPractice").val(CurSubPracticeValue);
}


function UpdateSkillsData() {
    $('.ErrorMsg').empty();
    //  var url ="https://ppmdev.bcone.com/_api/Skills(guid'" + CurRowId + '")";
    var url = GetorSetSkillsByRowId(CurRowId); //"https://ppmdev.bcone.com/_api/Skills(guid'" + CurRowId + "')";

    var SkillFamilyValue = $('#ddlSkillFamily option:selected').text();
    var SkillGroupValue = $('#ddlSkillGroup option:selected').text();
    var SkillStreamValue = $('#ddlSkillStream option:selected').text();
    var SkillDetailsValue = $('#ddlSkillDetails option:selected').text();
    var SkillTypeValue = $('#ddlSillType option:selected').text();
    var StrategicnessValue = $('#ddlStrategy option:selected').text();
    var AvailabilityValue = $('#ddlAvailable option:selected').text();
    var PracticeValue = $('#txtPractice')[0].value;
    var SubPracticeValue = $('#ddlSubPractice option:selected').val();

    $.ajax({
        url: url,
        async: false,
        method: "PUT",
        data: {
            "Skill_Family": SkillFamilyValue,
            "Skill_Group": SkillGroupValue,
            "Skill_Stream": SkillStreamValue,
            "Skill_Details": SkillDetailsValue,
            "Skill_Type": SkillTypeValue,
            "Strategicness": StrategicnessValue,
            "Availability": AvailabilityValue,
            "Practice": PracticeValue,
            "Sub_Practice": SubPracticeValue,
            "UID": CurRowId
        },
        headers: {
            "Accept": "application/json;odata=verbose"
        },

        success: function (data) {
            alert('Skills updated successfully');
        },
        error: function (error) {
            result = 'error';
            console.log(JSON.stringify(error));
        }

    });
	$('.popup-bg').hide();
	$('.loader').show();
          setTimeout(function () {
	      Reloadjs();
	      BindSkills();
         }, 100);
}

function ClearErrMsg()
{
    $('.mandatory').empty();
}

function Reloadjs() {

    if ($.fn.dataTable.isDataTable('#example')) {
        destroyjs('#example');
    }
    //Code to destroy jquery datatable 
    function destroyjs(tableid) {
        if ($.fn.dataTable.isDataTable(tableid)) {
            $(tableid).DataTable({
                "filter": false,
                "destroy": true
            });
            $(tableid).DataTable().destroy();
            //clear_tbody();
            //$(tableid).html("");
            $(tableid + " tbody tr").remove();
        }
    }

}

	
	//function to export the html table to excel
	function Exporttoexcel()
	{
		   var tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";
		   var textRange; var j=0;
		   tab = document.getElementById('tblPayrollExcel'); // id of table

		   for(j = 0 ; j < tab.rows.length ; j++) 
		   {     
				 tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
				 //tab_text=tab_text+"</tr>";
		   }

		   tab_text=tab_text+"</table>";


		   var ua = window.navigator.userAgent;
		   var msie = ua.indexOf("MSIE "); 

		   if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
		   {
			  txtArea1.document.open("txt/html","replace");
			  txtArea1.document.write(tab_text);
			  txtArea1.document.close();
			  txtArea1.focus(); 
			  sa=txtArea1.document.execCommand("SaveAs",true,"PayrollReport.xls");
		   }  
		   else //other browser not tested on IE 11
			  sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  
			 return (sa);
	}