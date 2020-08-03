
var DataLink = GetEmpSkillsPivot(); //"https://ppmdev.bcone.com/_api/EmployeeSkillsPivot";

var StoredPrimarySkills = "";
var StoredSecondarySkills = "";

var RowId = "";

var CurPrimarySkillGuids = "";
var CurSecondarySkillGuids = "";

$(document).ready(function () {
    //$('.loader').show();

    //setTimeout(function () {

    $("#ResourceMatrixTable td:first-child span").css("cursor", "pointer");
    $('.p-close').on('click', function () {
        $('.popup-bg').hide();
    });

    $("#ShowPrimary,#ShowSecondary").hide();

    $("#AddPrimarySkills").click(function () {
        $("#ShowPrimary").toggle();

        //var e = document.getElementById("ddlPrimarySkillStream");
        //e.options[e.selectedIndex].value = "Select";

        $("#ddlPrimarySkillStream").val("Select");

        $('#ddlPrimary').multiselect('refresh');
        $('#ddlPrimary').multiselect('destroy');

        $('#ddlPrimary').hide();
        $('#lblPSkill').hide();
    });


    $("#AddSecondarySkills").click(function () {
        $("#ShowSecondary").toggle();

        //var e = document.getElementById("ddlSecodarySkillStream");
        //e.options[e.selectedIndex].value = "Select";

        $("#ddlSecodarySkillStream").val("Select");

        $('#ddlSecondary').multiselect('refresh');
        $('#ddlSecondary').multiselect('destroy');

        $('#ddlSecondary').hide();
        $('#lblSSkill').hide();
    });

    $('#ddlPrimary').hide();
    $('#ddlSecondary').hide();
    $('.lblSkills').hide();



    $('#ResourceMatrixTable > tbody').empty();

    $('#ResourceMatrixTable').css('display', 'none');

    $('.loader').show();
    setTimeout(function () {
        BindResourceData(DataLink);
    }, 100);

	 var url=GetSkillData(1,'');
	 
    BindSkillStream(url, "{\"On\":\"Skill_Stream\"}");

    var PrimarySelectedValues = "";
    var len = "";

    $('#ddlPrimarySkillStream').multiselect({
        //includeSelectAllOption: true,
        numberDisplayed: 1,
        maxHeight: 200,
        buttonWidth: '420px',
        nonSelectedText: 'Select Skill Stream',
        onDropdownHide: function (event) {
            $('#ddlPrimary').empty();
            $('#lblPSkill').hide();
            //PrimarySelectedValues=$('#txtExistingPrimarySkills')[0].value.split(';');
            //len=PrimarySelectedValues.length;
            GetPrimarySkillDetails();
        },
        onChange: function (option, checked, select) {
            if (checked == false) {
               // var url = "https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq" + encodeURIComponent("'" + $(option).val() + "'") + "";
                var url=GetSkillData(2,$(option).val());
				RemoveSelectedSkills(url, 'Primary');
            }
        }

    });

    $('#ddlSecodarySkillStream').multiselect({
        //includeSelectAllOption: true,
        numberDisplayed: 1,
        maxHeight: 200,
        buttonWidth: '420px',
        nonSelectedText: 'Select Skill Stream',
        onDropdownHide: function (event) {
            $('#ddlSecondary').empty();
            $('#lblSSkill').hide();
            GetSecondarySkillDetails();
        },
        onChange: function (option, checked, select) {
            if (checked == false) {
                var url =GetSkillData(2,$(option).val()); //"https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq" + encodeURIComponent("'" + $(option).val() + "'") + "";
                RemoveSelectedSkills(url, 'Secondary');
            }
        }
    });

    //}, 100);

    //$('.loader').hide();

});
function Showdata() {
    //$('.loader').show();
    //setTimeout(function () {
    //    BindResourceData(DataLink);
    //    BindSkillStream("https://ppmdev.bcone.com/_api/Skills/Distinct?$select=Skill_Stream", "{\"On\":\"Skill_Stream\"}");
    //}, 100);
}
function ShowPopUp(id) {
    $('.popup-bg').show();
    Functionality = 'Edit';

    // BindSkillStream("https://ppmdev.bcone.com/_api/Skills/Distinct?$select=Skill_Stream", "{\"On\":\"Skill_Stream\"}");

    $("#ShowPrimary,#ShowSecondary").hide();

    $('#ddlPrimarySkillStream').multiselect('deselectAll', false);
    $('#ddlPrimarySkillStream').multiselect('updateButtonText');

    $('#ddlPrimary').multiselect('rebuild');
    $('#ddlPrimary').multiselect('destroy');

    $('#ddlPrimary').hide();
    $('#lblPSkill').hide();

    $('#ddlSecodarySkillStream').multiselect('deselectAll', false);
    $('#ddlSecodarySkillStream').multiselect('updateButtonText');

    $('#ddlSecondary').multiselect('refresh');
    $('#ddlSecondary').multiselect('destroy');

    $('#ddlSecondary').hide();
    $('#lblSSkill').hide();

    var CurRowid = id.parentNode.parentNode.id;
    RowId = CurRowid;

    var EmpId = id.parentNode.parentNode.cells[1].innerText;
    var EmpName = id.parentNode.parentNode.cells[2].innerText;

    var PrimarySkills = id.parentNode.parentNode.cells[3].innerText.trim();
    var SecondarySkills = id.parentNode.parentNode.cells[4].innerText.trim();

    document.getElementById('txtEmpId').value = EmpId;
    document.getElementById('txtName').value = EmpName;
    document.getElementById('txtExistingPrimarySkills').value = PrimarySkills;
    document.getElementById('txtExistingSecondarySkills').value = SecondarySkills;

    StoredPrimarySkills = PrimarySkills;
    StoredSecondarySkills = SecondarySkills

    CurPrimarySkillGuids = id.parentNode.parentNode.cells[5].innerText;
    CurSecondarySkillGuids = id.parentNode.parentNode.cells[6].innerText;
}

function DeleteItem(id) {

    var CurRowid = id.parentNode.parentNode.id;

    var EmpId = id.parentNode.parentNode.cells[1].innerText;
    var EmpName = id.parentNode.parentNode.cells[2].innerText;

    var status = "";
	
	var PrimarySkills='';
	var SecondarySkills='';
	

    var PrimarySkillGuids = id.parentNode.parentNode.cells[5].innerText;
    PrimarySkillGuids = PrimarySkillGuids.split(';');

    var SecondarySkillGuids = id.parentNode.parentNode.cells[6].innerText;
    SecondarySkillGuids = SecondarySkillGuids.split(';');

    if ((PrimarySkillGuids.length == 1 && PrimarySkillGuids[0] == "") && (SecondarySkillGuids.length == 1 && SecondarySkillGuids[0] == "")) {
        alert('No Skills to Delete');
        return false;
    }

    if (confirm("Are you sure to Delete the Resource Skills?")) {
        for (i = 0; i < PrimarySkillGuids.length; i++) {

            //var url = "https://ppmdev.bcone.com/_api/EmployeeSkills(guid'" + PrimarySkillGuids[i] + "')";
			var url=GetEmpSkillsByGuid(PrimarySkillGuids[i],2);
			
            $.ajax({
                url: url,
                async: false,
                method: "PUT",
                data: {
                    "EmployeeID": EmpId,
                    "Full_Name": EmpName,
                    "Skill_Detail": "",
                    "Skill_Type": "",
                    "ItemUID": PrimarySkillGuids[i]
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    if (SecondarySkillGuids.length == 0 && PrimarySkillGuids.length == i) {

                        status = "Success";
                        //alert('Skills updated successfully');
                    }

                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }

            });

        }

        for (j = 0; j < SecondarySkillGuids.length; j++) {

           // var url = "https://ppmdev.bcone.com/_api/EmployeeSkills(guid'" + SecondarySkillGuids[j] + "')";
			var url=GetEmpSkillsByGuid(SecondarySkillGuids[j],2);
			
            $.ajax({
                url: url,
                async: false,
                method: "PUT",
                data: {
                    "EmployeeID": EmpId,
                    "Full_Name": EmpName,
                    "Skill_Detail": "",
                    "Skill_Type": "",
                    "ItemUID": SecondarySkillGuids[j]
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    if (SecondarySkillGuids.length == j) {
                        status = "Success";
                        //alert('Skills updated successfully');
                    }
                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }

            });
         
        }
        if (status == "Success") {
            alert('Assigned resource skills deleted successfully');
        }
        //window.location.reload();
		 $('.popup-bg').hide();
         $('.loader').show();
          setTimeout(function () {
	      Reloadjs();
	     BindResourceData(DataLink);
         }, 100);
    }

  UpdateWorkDayResourceMaster(EmpId,PrimarySkills,SecondarySkills);
}
function BindResourceData(url) {

    $.ajax({
        url: url,
        async: false,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
            result = data.d.results;
            var nextdata = data.d.__next;

            //$('#ResourceMatrixTable > tbody').append("<tr id=" + 01 + "><td><span title='EDIT' class='glyphicon glyphicon-pencil  btnedit' onclick='ShowPopUp(this)' aria-hidden='true'></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span title='DELETE' class='glyphicon glyphicon-trash btndelete' onclick='DeleteItem(this)' aria-hidden='true'></span></td><td>01</td><td>Test Resource1</td><td></td><td></td></tr>");
            //$('#ResourceMatrixTable > tbody').append("<tr id=" + 02 + "><td><span title='EDIT' class='glyphicon glyphicon-pencil  btnedit' onclick='ShowPopUp(this)' aria-hidden='true'></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span title='DELETE' class='glyphicon glyphicon-trash btndelete' onclick='DeleteItem(this)' aria-hidden='true'></span></td><td>02</td><td>Test Resource2</td><td></td><td></td></tr>");

            for (var i = 0; i < result.length; i++) {
                var row = "<tr id=" + result[i].EmployeeID + "><td><span title='EDIT' class='glyphicon glyphicon-pencil  btnedit' onclick='ShowPopUp(this)' aria-hidden='true'></span><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span title='DELETE' class='glyphicon glyphicon-trash btndelete' onclick='DeleteItem(this)' aria-hidden='true'></span></td><td>" + (result[i].EmployeeID == null ? '' : result[i].EmployeeID) + "</td><td>" + (result[i].ResourceName == null ? '' : result[i].ResourceName) + "</td><td>" + (result[i].Primary_skill_Details == null ? '' : result[i].Primary_skill_Details) + "</td><td>" + (result[i].Secondary_skill_Details == null ? '' : result[i].Secondary_skill_Details) + "</td><td class='HideData' style='display:none'>" + (result[i].Primary_skill_Guids == null ? '' : result[i].Primary_skill_Guids) + "</td><td class='HideData' style='display:none'>" + (result[i].Secondary_skill_Guids == null ? '' : result[i].Secondary_skill_Guids) + "</td></tr>";
                $('#ResourceMatrixTable > tbody').append(row);
            }
        },
        error: function (error) {
            result = 'error';
        }
    });

    $('#ResourceMatrixTable').dataTable({
        "dom": 'Rlfrtip',
		"aLengthMenu": [5, 10, 15, 20, 25, 30],
        "pageLength": 10,
        "aaSorting": [[2, "asc"]],
        "destroy": true,
		 "dom": 'lBfrtip',
        buttons: [
         //'excel', 'print'
		 {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            },
            {
                extend: 'print',
                exportOptions: {
                    columns: [1,2,3,4]
                }
            },
        ],
		// [extend: 'pdfHtml5',
                // orientation: 'landscape',
                // pageSize: 'LEGAL']
    });

    $('#ResourceMatrixTable tfoot th').each(function () {
        var title = $(this).text();
        if (title != "") {
            $(this).html('<input type="text"/>');    // placeholder="Search" 
        }
    });

    var table = $('#ResourceMatrixTable').DataTable();

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
	
    $('#ResourceMatrixTable').css('display', '');

    $('.loader').hide();

}


function BindSkillStream(url, requestData) {

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
                if (data[i].Skill_Stream != null) {
                    $('.SkillStream').append("<option value=\"" + data[i].Skill_Stream + "\">" + data[i].Skill_Stream + "</option>");
                }
            }
            
        },
        error: function (error) {
            result = 'error';
            console.log(JSON.stringify(error));
        }
    });
}

function GetPrimarySkillDetails() {

    // var e = document.getElementById("ddlPrimarySkillStream");
    //var selectedValue = e.options[e.selectedIndex].value;

    var PrimarySelected = $("#ddlPrimarySkillStream option:selected");

    // $('#ddlPrimary').hide();
    $('#ddlPrimary').multiselect('refresh');
    $('#ddlPrimary').multiselect('destroy');

    //var PrimarySelectedValues=$('#txtExistingPrimarySkills')[0].value.split(',');

    //var url = "https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq'" + selectedValue + "'";

    var count = 0;

    PrimarySelected.each(function () {

        PrimarySelected = $(this).val();

       // var url = "https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq" + encodeURIComponent("'" + PrimarySelected + "'") + "";
        var url=GetSkillData(2,PrimarySelected);
		
        $.ajax({
            url: url,
            async: false,
            //data: requestData,
            type: "GET",
            dataType: "json",
            headers:
            {
                //"content-Type": "application/json"
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            },
            success: function (data) {
                var data = data.d.results;

                //$('#ddlPrimary').empty();

                $('#ddlPrimary').append("<optgroup label=" + PrimarySelected + ">");

                for (var i = 0; i < data.length; i++) {

                    $('#ddlPrimary').append("<option value=\"" + data[i].Skill_Details.trim() + "\">" + data[i].Skill_Details.trim() + "</option>");

                }
                $('#ddlPrimary').append("</optgroup>");
                count = 1;
            },
            error: function (error) {
                result = 'error';
                console.log(JSON.stringify(error));
                count = 0;
            }
        });

    });

    //var PresentPrimarySkills=$('#txtExistingPrimarySkills').val();

    if (count != 0) {
        $('#ddlPrimary').multiselect({
            //includeSelectAllOption: true,
            numberDisplayed: 1,
            maxHeight: 200,
            buttonWidth: '420px',
            nonSelectedText: 'Select Primary Skills',
            onChange: function (option, checked, select) {
                if (checked == true) {
                    if ($('#txtExistingPrimarySkills').val().trim() == "" || $('#txtExistingPrimarySkills').val() == null) {
                        $('#txtExistingPrimarySkills').val($(option).val().trim());
                    }
                    else {
                        $('#txtExistingPrimarySkills').val($('#txtExistingPrimarySkills').val() + ";" + $(option).val().trim());
                    }

                }
                else
                    if (checked == false) {
                        var contents = $("#txtExistingPrimarySkills").val();

                        var PresentPrimarySkills = contents.split(';');

                        var Len = PresentPrimarySkills.length;

                        var skillIndex = PresentPrimarySkills[Len - 1];

                        if (($(option).val()).trim() == skillIndex.trim()) {
                            if (Len == 1) {
                                $('#txtExistingPrimarySkills').val(contents.replace($(option).val(), ""));
                            }
                            else {
                                var ColonPrependedReplaceUnCheckValue = ";" + $(option).val();
                                $('#txtExistingPrimarySkills').val(contents.replace(ColonPrependedReplaceUnCheckValue, ""));
                            }
                        }
                        else {
                            var ColonAppendedReplaceUnCheckValue = $(option).val() + ";";
                            $('#txtExistingPrimarySkills').val(contents.replace(ColonAppendedReplaceUnCheckValue, ""));
                        }

                    }
            }
        });

        var PrimarySelectedValues = $('#txtExistingPrimarySkills')[0].value.split(';');

        for (i = 0; i < PrimarySelectedValues.length; i++) {
            $('#ddlPrimary').multiselect('select', PrimarySelectedValues[i].trim());
            $('#ddlPrimary').multiselect('rebuild');
            $('#ddlPrimary option[value="+PrimarySelectedValues[i]+"]').prop('disabled', true);


            var nonSelectedOptions = $('#ddlPrimary option').filter(function () {
                return $(this).is(':selected');
            });


            //var dropdown = $('#ddlPrimary').siblings('.multiselect-container');
            nonSelectedOptions.each(function () {
                var input = $('input[value="' + $(this).val() + '"]');
                input.prop('disabled', true);
                input.parent('li').addClass('disabled');
            });
        }
        $('#lblPSkill').show();
        $('#ddlPrimary').show();
    }
}

function GetSecondarySkillDetails() {


    //var e = document.getElementById("ddlSecodarySkillStream");
    // var selectedValue = e.options[e.selectedIndex].value;

    // var SecondarySelected = $("#ddlSecodarySkillStream option:selected");

    var SecondarySelected = $("#ddlSecodarySkillStream option:selected");

    //$('#ddlSecondary').hide();
    $('#ddlSecondary').multiselect('refresh');
    $('#ddlSecondary').multiselect('destroy');

    //var SecoundarySelectedValues=$('#txtExistingPrimarySkills')[0].value.split(',');

    //var url = "https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq'" + selectedValue + "'";

    var count = 0;

    SecondarySelected.each(function () {

        SecondarySelected = $(this).val();


        //var url = "https://ppmdev.bcone.com/_api/Skills?$filter=Skill_Stream+eq" + encodeURIComponent("'" + SecondarySelected + "'") + "";
		 var url=GetSkillData(2,SecondarySelected);
		 
        $.ajax({
            url: url,
            async: false,
            //data: requestData,
            type: "GET",
            dataType: "json",
            headers:
            {
                //"content-Type": "application/json"
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            },
            success: function (data) {
                var data = data.d.results;

                //$('#ddlSecondary').empty();

                $('#ddlSecondary').append("<optgroup label=" + SecondarySelected + ">");

                for (var i = 0; i < data.length; i++) {
                    $('#ddlSecondary').append("<option value=\"" + data[i].Skill_Details.trim() + "\">" + data[i].Skill_Details.trim() + "</option>");
                }

                $('#ddlSecondary').append("</optgroup>");
                count = 1;

            },
            error: function (error) {
                result = 'error';
                console.log(JSON.stringify(error));
            }
        });
    });
    if (count != 0) {
        $('#ddlSecondary').multiselect({
            //includeSelectAllOption: true,
            numberDisplayed: 1,
            maxHeight: 200,
            buttonWidth: '420px',
            nonSelectedText: 'Select Secondary Skills',
            onChange: function (option, checked, select) {
                if (checked == true) {

                    if ($('#txtExistingSecondarySkills').val().trim() == "" || $('#txtExistingSecondarySkills').val() == null) {
                        $('#txtExistingSecondarySkills').val($(option).val().trim());
                    }
                    else {
                        $('#txtExistingSecondarySkills').val($('#txtExistingSecondarySkills').val() + ";" + $(option).val().trim());
                    }
                }
                else
                    if (checked == false) {
                        var contents = $("#txtExistingSecondarySkills").val();

                        var PresentSecondarySkills = contents.split(';');

                        var Len = PresentSecondarySkills.length;

                        var skillIndex = PresentSecondarySkills[Len - 1];

                        if (($(option).val()).trim() == skillIndex.trim()) {
                            if (Len == 1) {
                                $('#txtExistingSecondarySkills').val(contents.replace($(option).val(), ""));
                            }
                            else {
                                var ColonPrependedReplaceUnCheckValue = ";" + $(option).val();
                                $('#txtExistingSecondarySkills').val(contents.replace(ColonPrependedReplaceUnCheckValue, ""));
                            }
                        }
                        else {
                            var ColonAppendedReplaceUnCheckValue = $(option).val() + ";";

                            $('#txtExistingSecondarySkills').val(contents.replace(ColonAppendedReplaceUnCheckValue, ""));
                        }
                    }
            }

        });

        var SecoundarySelectedValues = $('#txtExistingSecondarySkills')[0].value.split(';');

        for (i = 0; i < SecoundarySelectedValues.length; i++) {
            $('#ddlSecondary').multiselect('select', SecoundarySelectedValues[i].trim());
            $('#ddlSecondary').multiselect('rebuild');

            $('#ddlSecondary option[value="+SecoundarySelectedValues[i]+"]').prop('disabled', true);

            var nonSelectedOptions = $('#ddlSecondary option').filter(function () {
                return $(this).is(':selected');
            });

            nonSelectedOptions.each(function () {
                var input = $('input[value="' + $(this).val() + '"]');
                input.prop('disabled', true);
                input.parent('li').addClass('disabled');
            });

        }



        $('#lblSSkill').show();
        $('#ddlSecondary').show();
    }

}

function UpdateResourceSkills() {

	var PrimarySelectedSkills=($("#txtExistingPrimarySkills")[0].value == undefined ? '' : $("#txtExistingPrimarySkills")[0].value);
    var SecondarySelectedSkills = ($("#txtExistingSecondarySkills")[0].value == undefined ? '' : $("#txtExistingSecondarySkills")[0].value);
	
    var PrimarySelected = ($("#txtExistingPrimarySkills")[0].value == undefined ? '' : $("#txtExistingPrimarySkills")[0].value.split(';'));
    var SecondarySelected = ($("#txtExistingSecondarySkills")[0].value == undefined ? '' : $("#txtExistingSecondarySkills")[0].value.split(';'));

    if (StoredPrimarySkills != '' && StoredSecondarySkills != '') {
        DeleteAndCreateData('All');
    }
    else
        if (StoredPrimarySkills != '') {
            DeleteAndCreateData('Primary');
        }
        else
            if (StoredSecondarySkills != '') {
                DeleteAndCreateData('Secondary');
            }

    var PrimarySkills = "";
    var SecondarySkills = "";

    var StatusVar = "";

    var EmpID = $('#txtEmpId')[0].value
    var EmpName = $('#txtName')[0].value;

    //var url = "https://ppmdev.bcone.com/_api/EmployeeSkills";
	var url=GetEmpSkillsByGuid('',1);
    if (PrimarySelected.length == 0 && SecondarySelected.length == 0) {
        alert('No Selected Skills to Update');
        return false;
    }

    if (PrimarySelected.length > 0) {

        for (var i = 0; i < PrimarySelected.length; i++) {

            var PrimarySkillDetail = PrimarySelected[i];
			//var date = new Date();
			//var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			
            $.ajax({
                url: url,
                async: false,
                method: "POST",
                data: {
                    "EmployeeID": EmpID,
                    "Full_Name": EmpName,
                    "Skill_Detail": PrimarySkillDetail,
                    "Skill_Type": "Primary"
					//"Created_Date":str.toString()
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    StatusVar = "Success";
                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }

            });
             
            PrimarySkillDetail = "";
        }
    }

    if (SecondarySelected.length > 0) {

        for (var j = 0; j < SecondarySelected.length; j++) {

            var SecondarySkillDetail = SecondarySelected[j];
			//var date = new Date();
			//var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			
            $.ajax({
                url: url,
                async: false,
                method: "POST",
                data: {
                    "EmployeeID": EmpID,
                    "Full_Name": EmpName,
                    "Skill_Detail": SecondarySkillDetail,
                    "Skill_Type": "Secondary"
				//	"Created_Date":str.toString()
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    StatusVar = "Success";
                    //alert('Skills updated successfully');
                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }
              
            });
             
            SecondarySkillDetail = "";
            //message += $(this).val() + "#";
        }
		UpdateWorkDayResourceMaster(EmpID,PrimarySelectedSkills,SecondarySelectedSkills);
    }

    if (StatusVar == "Success") {
        alert('Skills updated successfully');
    }
    //window.location.reload();
	$('.popup-bg').hide();
	$('.loader').show();
    setTimeout(function () {
	Reloadjs();
	BindResourceData(DataLink);
    }, 100);
}

function RemoveSelectedSkills(Link, Category) {


    var Curcontents = '';

    $.ajax({
        url: Link,
        async: false,
        //data: requestData,
        type: "GET",
        dataType: "json",
        headers:
        {
            //"content-Type": "application/json"
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
            var data = data.d.results;
            var PreviousSkills = StoredPrimarySkills.split(';');

            for (var i = 0; i < data.length; i++) {
                {
                    if (Category == 'Primary') {
                        Curcontents = $("#txtExistingPrimarySkills").val();
                    }
                    else
                        if (Category == 'Secondary') {
                            Curcontents = $("#txtExistingSecondarySkills").val();
                        }
                    var CurSkills = Curcontents.split(';');
                    var CurSkillLen = CurSkills.length;


                    for (var j = 0; j < CurSkills.length; j++) {
                        if (CurSkills[j].trim() == data[i].Skill_Details.trim()) {
                            if (CurSkillLen == 1) {
                                if (Category == 'Primary') {
                                    $('#txtExistingPrimarySkills').val(Curcontents.replace(CurSkills[j], ""));
                                }
                                else
                                    if (Category == 'Secondary') {
                                        $('#txtExistingSecondarySkills').val(Curcontents.replace(CurSkills[j], ""));
                                    }
                            }
                            else if (j == 0) {

                                if (Category == 'Primary') {
                                    var ColonappendeddReplaceUnCheckValue = CurSkills[j] + ";";
                                    $('#txtExistingPrimarySkills').val(Curcontents.replace(ColonappendeddReplaceUnCheckValue, ""));
                                }
                                else
                                    if (Category == 'Secondary') {
                                        var ColonappendeddReplaceUnCheckValue = CurSkills[j] + ";";
                                        $('#txtExistingSecondarySkills').val(Curcontents.replace(ColonappendeddReplaceUnCheckValue, ""));
                                    }
                            }
                            else {
                                if (Category == 'Primary') {
                                    var ColonPrependedReplaceUnCheckValue = ";" + CurSkills[j];
                                    $('#txtExistingPrimarySkills').val(Curcontents.replace(ColonPrependedReplaceUnCheckValue, ""));
                                }
                                else
                                    if (Category == 'Secondary') {
                                        var ColonPrependedReplaceUnCheckValue = ";" + CurSkills[j];
                                        $('#txtExistingSecondarySkills').val(Curcontents.replace(ColonPrependedReplaceUnCheckValue, ""));
                                    }
                            }
                        }
                    }
                }

            }
        },
        error: function (error) {
            result = 'error';
            console.log(JSON.stringify(error));
            count = 0;
        }
    });
}

function DeleteAndCreateData(Value) {

    CurPrimarySkillGuids = CurPrimarySkillGuids.split(';');
    CurSecondarySkillGuids = CurSecondarySkillGuids.split(';');
	
    var EmpId = document.getElementById('txtName').value;
    var EmpName = document.getElementById('txtEmpId').value;

    if (Value == 'All' || Value == 'Primary') {
        for (i = 0; i < CurPrimarySkillGuids.length; i++) {

            //url = "https://ppmdev.bcone.com/_api/EmployeeSkills(guid'" + CurPrimarySkillGuids[i] + "')";
			var url=GetEmpSkillsByGuid(CurPrimarySkillGuids[i],2);

            $.ajax({
                url: url,
                async: false,
                method: "DELETE",
                data: {
                    "ItemUID": CurPrimarySkillGuids[i]
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    if (CurSecondarySkillGuids.length == 0 && CurPrimarySkillGuids.length == i) {

                        status = "Success";
                    }

                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }

            });

        }
    }


    if (Value == 'All' || Value == 'Secondary') {
        for (j = 0; j < CurSecondarySkillGuids.length; j++) {

            //var url = "https://ppmdev.bcone.com/_api/EmployeeSkills(guid'" + CurSecondarySkillGuids[j] + "')";
           // var url=url=GetEmpSkillsByGuid(CurSecondarySkillGuids[j],2);
            var url = GetEmpSkillsByGuid(CurSecondarySkillGuids[j],2);
            $.ajax({
                url: url,
                async: false,
                method: "DELETE",
                data: {
                    "ItemUID": CurSecondarySkillGuids[j]
                },
                headers: {
                    "Accept": "application/json;odata=verbose"
                },

                success: function (data) {
                    if (CurSecondarySkillGuids.length == j) {
                        status = "Success";
                    }
                },
                error: function (error) {
                    result = 'error';
                    console.log(JSON.stringify(error));
                }

            });

        }


    }
	
}

function Reloadjs() {
	

    if ($.fn.dataTable.isDataTable('#ResourceMatrixTable')) {
        destroyjs('#ResourceMatrixTable');
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

function UpdateWorkDayResourceMaster(Empid,Pskills,Sskills)
{
	if(Pskills=='')
	{
		Pskills="NA";
	}
	else
	{
		Pskills=Pskills;
	}
		if(Sskills=='')
	{
		Sskills="NA";
	}
	else
	{
		Sskills=Sskills;
	}
	//var url="https://ppmdev.bcone.com/_api/WorkdayResourceMaster('"+Empid+"')";
	var url=UpdateWorkDayMasterByEmpid(Empid);
	 $.ajax
	 ({
		url: url,
		async: false,
		method: "PATCH",
		data: {
			"EmployeeID":Empid,
			"PrimarySkill":Pskills,
			"secondarySkill":Sskills,
		},
		headers: {
			"Accept": "application/json;odata=verbose"
		},
		success: function (data) {
			StatusVar = "Success";
		},
		error: function (error) {
			result = 'error';
			console.log(JSON.stringify(error));
		}
	});

}