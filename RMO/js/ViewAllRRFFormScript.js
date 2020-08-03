var table_header = "";
var table_element = "";
var url = "";
var allrecordCount = 0;
var rrfsavedCount = 0;
var rmovalidationCount = 0;
var fpnapprovalCount = 0;
var resourceproposedCount = 0;
var resourceselectionCount = 0;
var fulfilledCount = 0;
var withdrawnCount = 0;
var rrfexternalHiring = 0;
var rrfnonbillable = 0;
var ResourceTableFlag = "0";
var CountFlag = 0;
var TotalCount = 0;
var BookedCount = 0;
var FreeCount = 0;
var RRFFormLength = 5;
var RRFtblFlag = "0";
var resourceProjectTableFlag = "0";
var pageStatus = "";
var LogProjectGUID = "";
var LoginUserName = "";
var txtidIndex = 0;
var RRFRowID = "";
//var site_url = "https://ppmdev.bcone.com/";
var ResourceData = "";
var ResourceApprovalData = "";
var resourceListID = "";
var resourceRRFCount = "";
var RRF_Number = "";
var ResourceAllocationFlag = "";
var chechBoxFlag = "";
var LoginUserID = "";
var EmployeeRole = "";
var Counter = 0;
var GBU = "";
var Customer = "";
var NonBillableStatus = "";
var PrimarySkill = "";
var SecondrySkill = "";
var RolBand = "";
var ResourceAvailbilityCount = "";
var projectStrtdate = "";
var projectEndDate = "";
var RRFEmployeeRole = "";
var projectName = "";
var ProLocation = "";
var ResourceTable = "";
var MinRevExp = "";
var ProjectManagerUserId = "";
var StatusFlag = "";
var multipleAssignProject_Array = [];
var softblockFlag = "";
var NonBillableApproverID = "";
var RRF_Table = "";
var indecator_Parameter = [];
var Projectdetails = "";
var rrfresourceextension = 0;
var TATMappingDays = "";
var currentDate = "";
var RMOSPOCUserId = "";
var rrfStartDate = "";
var rrfEndDate = "";
var RMOSuperUserFlag = "";
//code to display indicator value on datatable page change

$(document).on('click', '.paginate_button ', function (event) {

    //get_alerts(parseInt($(this).text(), 10)); //commented as per abhishek instruction
    if (RRFtblFlag == "1") {
        $('#tblResources').on('click', 'tr', function () {
            var oData = oTable.fnGetData(this);
            console.log(oData.ID);
        });

        var activeBtnVal = RRF_Table.page.info().page; //changes by varsha 12-sep
        activeBtnVal = activeBtnVal + 1;
        var last_i = $(this)[0].innerText;
        if (last_i == "Next") {
            last_i = parseInt(activeBtnVal);
        }
        if (last_i == "Previous") {
            last_i = parseInt(activeBtnVal);
        }
        findProjectCode(last_i, RRFFormLength);

    }
    $('#mCSB_3_scrollbar_vertical').css('visibility', 'visible');
    //else {
    //    if (chechBoxFlag == "1") {
    //        bindcheckedResources(RRF_Number);
    //    }

    //}
});

//code to bind Employee role
$(document).on('click', '#ShowAddResource ', function () {
    var roleval = document.getElementById('txtEmployeeRole').value;
    $('.txtEmployeeRole').val(roleval);
});

//paginate_button.click(function(event){});
function get_alerts(page) {
    console.log('calling get_alerts');
    $.getJSON('/api/import_preview?p=1', function (data) {
        $('#alerts').empty();
        $.each(data, function (key, val) {
            $('#alerts').append(key);

        });
        populate_pagination(page, data['num_pages'])
    });
};

function populate_pagination(current_page, total_pages) {
    var i;
    var page_element;
    $('.pagination').empty();
    for (i = current_page - 5; i < current_page + 5; i++) {
        console.log('i=' + i)
        console.log('current_page=' + current_page)
        if (i > 0 && i <= total_pages) {
            console.log('creating new element');
            page_element = $('<li><a href="#!">' + i + '</a></li>')
            page_element.addClass('waves-effect');
            //page_element.attr('onclick', 'get_alerts('+i+');');
            if (i == current_page) {
                page_element.addClass('active');
            }
            else {
                page_element.click(function (event) { get_alerts($(this).text()); });
            }
            $('.pagination').append(page_element);
        };
    };
};


$(document).ready(function () {
    currentDate = new Date();
    //code to bind resouces in Resource Search Dropdown in Resource assignment
    url = GetResource();//"https://ppmdev.bcone.com/_api/Resources";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            $('#ddlResourceName').append(new Option("", 0));
            $.each(data.d.results, function (key, value) {
                $('#ddlResourceName').append("<option data-value = '" + value["EmployeeID"] + "'>" + value.ResourceName + "</option>");
            })
        }
    });
    //code to searchable DropDpwn
    window.Search = $('.search-box').SumoSelect({ csvDispCount: 3, search: true, placeholder: 'Type Name' });


});


$(document).on('click', '.a-close ', function () {
    $('.popup-bg-alert').hide();
});

$(document).ready(function () {
    //Get logged in user name
    var CurrentUser = GetCurrentUserData();
    $.getJSON(CurrentUser)
    .done(function (data) {
        LoginUserName = data.Title;
        LoginUserID = data.Id;
        var GetRMOUserURL = getuserinRMOSuperUsergroup(LoginUserID);
        var RMOUserRoleCount = resultset(GetRMOUserURL);

        if (RMOUserRoleCount.length > 0) {
            RMOSuperUserFlag = "1";
        }
        else {
            RMOSuperUserFlag = "";
        }
        getRRFData();

    });

    setTimeout(function () {
        if (Counter == 0)  //Run the code on Page load 
        {
            var restUrl = "../_api/web/lists/getbytitle('RRF')/items?$select=Status&$Filter=Status eq 'Fulfilled' or Status eq 'WITHDRAWN' or Status eq 'REJECTED'&$Top=100000&$orderby=ID%20desc";
            $.ajax({
                url: restUrl,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $.each(data.d.results, function (key, value) {
                        if (value.Status == "Fulfilled") {
                            fulfilledCount++;
                        }
                        else if (value.Status == "Withdrawn" || value.Status == "Rejected") {
                            withdrawnCount++;
                        }
                        Counter = 1;
                    });
                    document.getElementById('rrffulfilledcount').innerHTML = fulfilledCount;
                    document.getElementById('rrfwithdrawncount').innerHTML = withdrawnCount;
                }
            });

            var restUrlBillable = "../_api/web/lists/getbytitle('RRF')/items?$select=PendingWithId,NonBillableFlag,EmployeeRole&$Filter=EmployeeRole ne 'Billable' and ((Status eq 'VPHR') or (Status eq 'Recruitment Head') or (Status eq 'FPNA') or (Status eq 'Functional Head') or (Status eq 'Non Billable')) and ((Status ne 'Withdrawn') or (Status ne 'Fulfilled'))&$Top=100000&$orderby=ID%20desc";
            $.ajax({
                url: restUrlBillable,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $.each(data.d.results, function (key, value) {
                        rrfnonbillable++;
                        Counter = 1;
                    });
                    document.getElementById('rrfnonbillable').innerHTML = rrfnonbillable;
                }
            });

            var restSave = "../_api/web/lists/getbytitle('RRF')/items?$select=ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Filter=Status eq 'Draft' or Status eq 'RRF Saved'&$Top=100000&$orderby=ID%20desc";
            $.ajax({
                url: restSave,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $.each(data.d.results, function (key, value) {
                        rrfsavedCount++;
                        Counter = 1;
                    });
                    document.getElementById('rrfsavedcount').innerHTML = rrfsavedCount;
                }
            });


            var restSaveExternalHiring = "../_api/web/lists/getbytitle('RRF')/items?$Filter=Status eq 'Initiated External Hiring'&$Top=100000&$orderby=ID%20desc";
            $.ajax({
                url: restSaveExternalHiring,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $.each(data.d.results, function (key, value) {
                        fpnapprovalCount++;
                        Counter = 1;// If Counter is one it will not execute for the next time
                        document.getElementById('rrffpnaapproval').innerHTML = fpnapprovalCount;
                        document.getElementById('lifpnaApproval').style.display = "block";
                    });

                }
            });
        }
    }, 1000);

    //$("#txtAllocation").input('Regex', { regex: "^[1-9][0-9]?$|^100$" });
    $('.classAllocation').numeric({ max: 100 });



});


(function ($) {

    $.fn.numeric = function (options) {

        return this.each(function () {
            var $this = $(this);

            $this.keypress(options, function (e) {
                // allow backspace and delete 
                if (e.which == 8 || e.which == 0)
                    return true;

                //if the letter is not digit 
                if (e.which < 48 || e.which > 57)
                    return false;

                // check max range 
                var dest = e.which - 48;
                var result = this.value + dest.toString();
                if (result > e.data.max) {
                    return false;
                }
            });
        });
    };
})(jQuery);

function getRRFData() {
    RRFtblFlag = "1";
    refine_status('allrecord', 'ALL RECORD', 'FirstTimeLoad');
    $(".stage ul li").on('click', function () {
        $(".stage ul li").removeClass('active');
        $(this).addClass('active');
    });
    //code to popup hide           
    $('.pupup-close').on('click', function () {
        RRFtblFlag = "1";
        $('.popup-bg').hide();
    });
    $('.p-close').on('click', function () {
        $('.popup-bg').hide();
    });
    $('.T-close').on('click', function () {
        $('.Toppopup-bg').hide();
    });
    $('.Toppupup-close').on('click', function () {
        RRFtblFlag = "1";
        $('.Toppopup-bg').hide();
    });


    $(document).on("click", "input", function () {
        $(".strtDt,.endDt").datepicker({
            dateFormat: 'dd-M-yy',
            changeMonth: true,
            changeYear: true,
            minDate: new Date(),
            onSelect: function (selected, evnt) {
                removeErrorMsgResourceAssignment();
                takeenddate();
            }
        });
    });
    $(".strtDt,.endDt").keypress(function (e) {
        return false;
    });
    $('.strtDt,.endDt').bind("cut copy paste", function (e) {
        e.preventDefault();
    });
    $(".VScroll,.VScroll-2").mCustomScrollbar('update');
    $(".VScroll").mCustomScrollbar({
        scrollButtons: {
            enable: true
        },
        theme: "dark-thin",
        advanced: { autoExpandHorizontalScroll: true, updateOnContentResize: true }
    });
    $(".VScroll,.VScroll-2").mCustomScrollbar({
        scrollButtons: {
            enable: true
        },
        theme: "dark-thin",
        advanced: { autoExpandHorizontalScroll: true, updateOnContentResize: true }
    });
    //$(".dataTables_wrapper").mCustomScrollbar({
    // scrollButtons: {
    //        enable: true
    //    },
    //    horizontalScroll: true,
    //    theme: "dark-thin",
    //   autoExpandScrollbar: true,
    //    advanced: { autoExpandHorizontalScroll: true }
    //});

}

//code to show popup dynemically
//code to show Request approval popup
function showApprovalpopup(ResourceApprovalData) {
    var resourceApprovalRRF = ResourceApprovalData.id.split('#');
    RRFRowID = resourceApprovalRRF[0]; //ROW ID
    LogProjectGUID = resourceApprovalRRF[1]; // RRF Project GUID
    RRFEmployeeRole = resourceApprovalRRF[2] + "#" + resourceApprovalRRF[4]; // RRF Employee Role
    pageStatus = resourceApprovalRRF[3]; // RRF Status
    GBU = resourceApprovalRRF[5]; // RRF GBU
    EmployeeRole = resourceApprovalRRF[6]; // RRF Employee Role
    NonBillableApproverID = resourceApprovalRRF[7]; //RRF Project Manager ID
    var rrfValidationData = "";
    if (pageStatus == "RRF Saved" || pageStatus == "Non Billable") {
        rrfValidationData = ValidatedData(RRFRowID);
    }

    if (rrfValidationData == "false") {

        $('.alertmessage').show();
        $('#withdrawnrejectdata').hide();
        $('.alertmessage').text('Please fill complete RRF and Submit');
        $('.popup-bg-alert').show();
    }
    else {
        $('.clssPopupHead').text('Are You Sure Want To Submit?');
        $('.popup h4').css('text-align', 'center');
        $('.allbtn').css('text-align', 'center');
        document.getElementById('divRejectBody').style.display = "none";
        document.getElementById('divComment').style.display = "none";
        document.getElementById('divSearchResource').style.display = "none";
        document.getElementById('divViewLog').style.display = "none";
        document.getElementById('divApproveBody').style.display = "block";
        $('.popup-bg').show();

    }

}
//code to show Request rejection popup
function showRejectionpopup(rejId) {
    //var rowID = rejId.id;
    RRFRowID = rejId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[0];
    var RowProjectID = rejId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[1];
    LogProjectGUID = RowProjectID;
    $('.clssPopupHead').text('Please Provide Reason For Rejection Of This Request.');
    $('.popup h4').css('text-align', 'left');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divApproveBody').style.display = "none";
    document.getElementById('divComment').style.display = "none";
    document.getElementById('divSearchResource').style.display = "none";
    document.getElementById('divViewLog').style.display = "none";
    document.getElementById('divRejectBody').style.display = "block";
    document.getElementById('Txt_Comment').value = "";
    $('.popup-bg').show();
    $('#Txt_Comment').css({
        "border": "",
        "background": ""
    });
    document.getElementById("AlertMsg").innerHTML = "";
    var url = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$Select=Comment,NewCreatedDate,Name,Flag&$filter=ProjectGUID eq '" + RowProjectID + "'and Flag eq '3' and RRFListItemId eq '" + RRFRowID + "'&$orderby=Created desc";
    getRMOTransactionDetails(url, RowProjectID, 'RejCommentlog');
}
//code to show Request Comment popup
function showCommentpopup(cmntId) {
    //var rowCmntID = cmntId.id;
    RRFRowID = cmntId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[0];
    var RowProjectID = cmntId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[1];
    LogProjectGUID = RowProjectID;
    $('.clssPopupHead').text('Please Enter Comment');
    $('.popup h4').css('text-align', 'left');
    // $('.left-pol').css('float', 'left');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divApproveBody').style.display = "none";
    document.getElementById('divRejectBody').style.display = "none";
    document.getElementById('divSearchResource').style.display = "none";
    document.getElementById('divViewLog').style.display = "none";
    document.getElementById('divComment').style.display = "block";
    document.getElementById('TxtAria_Comment').value = "";

    $('#TxtAria_Comment').css({
        "border": "",
        "background": ""
    });
    document.getElementById("commentAlert").innerHTML = "";
    var url = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$Select=Comment,NewCreatedDate,Name,Flag&$filter=ProjectGUID eq '" + RowProjectID + "'and Flag eq '2' and RRFListItemId eq '" + RRFRowID + "'&$orderby=Created desc";
    getRMOTransactionDetails(url, RowProjectID, 'Commentlog');
    $('.popup-bg').show();
}
//code to show search resources popup
function showResourcepopup(ResourceData) {
    $('.loader').show();
    setTimeout(function () {
        getResourceDataPopUp(ResourceData);
        $('.loader').hide();
    }, 100);
}

function getResourceDataPopUp(ResourceData) {
    var resourceRRF = ResourceData.id.split('#');
    multipleAssignProject_Array = [];
    RRFtblFlag = "0";
    ResourceTableFlag = "1";
    softblockFlag = "";
    if ($.fn.dataTable.isDataTable('#tblResources')) {
        destroyjs('#tblResources');
    }
    var requestID = resourceRRF[0];  //ROW ID
    RRFRowID = resourceRRF[0];
    var rrfprojectID = resourceRRF[1]; //ProjectGUID
    LogProjectGUID = resourceRRF[1]; //ProjectGUID
    PrimarySkill = resourceRRF[2]; // PrimarySkill
    SecondrySkill = resourceRRF[3];//SecondarySkill
    RolBand = resourceRRF[4]; //RoleBand
    var IndustryExp = resourceRRF[5];//IndustryExp
    MinRevExp = resourceRRF[6];//MinimunExp
    var RRFNumber = resourceRRF[7];//RRFNumber
    pageStatus = resourceRRF[8]; //RRF Status
    var sub_pracitc = resourceRRF[9]; //Sub Practic 
    projectName = resourceRRF[10];//project name
    ProLocation = resourceRRF[11];
    projectStrtdate = resourceRRF[12];
    projectEnddate = resourceRRF[13]; //2017-08-29T19:00:00
    var AuthorId = resourceRRF[14]; // Creater or Initiator
    RMOSPOCUserId = resourceRRF[15]; // RMO
    ProjectManagerUserId = resourceRRF[16]; // Project Manager
    var FPNAUserId = resourceRRF[17]; // FPNA
    var ReportingToUserId = resourceRRF[18]; // Reporting Manager
    var ClientPartnerUserId = resourceRRF[19]; // Client partner
    var EmployeeRole = resourceRRF[20]; // Role
    var RRFAllocationPercent = resourceRRF[21]; //RRF Percentage
    var ProjectManagerName = resourceRRF[22]; // Project Manager Name
    var ClientPartnerName = resourceRRF[23]; // Client Partner Name
    var RMOSPOCName = resourceRRF[24]; // RMO SPOC Name
    var ProjectCode = resourceRRF[25]; // Project Code
    rrfStartDate = resourceRRF[28]; // RRF Start Date
    rrfEndDate = resourceRRF[29]; //RRF End Date
    var ResourceAgainstRRFInWDId = "";
    var ExternalEmplooyeeId = "";
    var ExternalEmplooyeeName = "";
    var externalhiringflag = "";

    if (resourceRRF[26] != "" && (pageStatus == "External Hiring" || pageStatus == "Offer")) {
        ResourceAgainstRRFInWDId = getResourceEmpIdEmpName(resourceRRF[26]) // Assigned Resource Emailid
        ExternalEmplooyeeId = ResourceAgainstRRFInWDId.split('#')[0];
        ExternalEmplooyeeName = ResourceAgainstRRFInWDId.split('#')[1];
    }

    if (pageStatus == "External Hiring" || pageStatus == "Offer")
        externalhiringflag = resourceRRF[27];

    RRF_Number = RRFNumber;
    $('.clssPopupHead').html(RRFNumber + ' : Search Resources ' + '| Primary Skill : ' + PrimarySkill + ' | Secondary Skill : ' + SecondrySkill + ' | View Selected Resources ').append(" <span  id='show-popup' class='action-c pull-right'><i class='fa fa-users' aria-hidden='true'></i><div class='action-c-view VScroll '> <ul id='slectedResource'></ul> </div></span>");
    $('.popup h4').css({ 'text-align': 'left', 'width': '100%' });
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divRejectBody').style.display = "none";
    document.getElementById('divComment').style.display = "none";
    document.getElementById('divApproveBody').style.display = "none";
    document.getElementById('divViewLog').style.display = "none";
    document.getElementById('divSearchResource').style.display = "block";
    $('.error').css('display', 'none');
    $('.strtDt').val('');
    $('.endDt').val('');
    $('.loader').show();

    url = "../_api/web/lists/getbytitle('RMOResourceAllocation')/items?$filter=RRFNumber eq'" + RRFNumber + "'";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                ResourceAllocationFlag = data.d.results[0].Flag;
            } else {
                ResourceAllocationFlag = "";
            }
        }
    });
    var SeletedEmployeeIDcheck = "";
    var dataurl = "../_api/web/lists/getbytitle('RMOResourceAllocation')/items?$filter=RRFNumber eq'" + RRFNumber + "'";
    $.ajax({
        url: dataurl,
        async: false,
        type: "GET",
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            resourceRRFCount = data.d.results.length;

            if (resourceRRFCount > 0) {
                var dataset = data.d.results[0];
                resourceListID = dataset.ID;
                if (pageStatus == "RRF Saved") {
                    SeletedEmployeeIDcheck = dataset.suggestedResource.split(';');
                } else if (pageStatus == "RMO Validation") {
                    SeletedEmployeeIDcheck = dataset.ShortlistedResource.split(';');

                } else if (pageStatus == "Resource Proposed") {
                    SeletedEmployeeIDcheck = dataset.ShortlistedResource.split(';'); // Changes done on 30-8-2017 

                } else if (pageStatus == "Resource Selection") {
                    SeletedEmployeeIDcheck = dataset.AllocatedResource.split(';');

                } else if (pageStatus == "Fulfilled") {
                    SeletedEmployeeIDcheck = dataset.AllocatedResource.split(';');
                }

            }
        }
    });
    document.getElementById('btnSoftblockOK').style.display = 'none';
    if (rrfprojectID != "" && rrfprojectID != undefined && rrfprojectID != "null") {
        document.getElementById('divmsgNoresource').style.display = 'none';
        var resourceTbl_header = "";
        var resourcetable_element = "";
        resourceTbl_header = "<thead><tr>";
        var ResourceLIHTML = "<tbody>";
        //table binding for resources data
        resourceTbl_header = resourceTbl_header + "<th >Item</th>"
        resourceTbl_header = resourceTbl_header + "<th >Emp ID</th>"
        resourceTbl_header = resourceTbl_header + "<th >Name</th>"
        resourceTbl_header = resourceTbl_header + "<th >Project Name</th>"
        resourceTbl_header = resourceTbl_header + "<th>Project Manager</th>"
        resourceTbl_header = resourceTbl_header + "<th>Sub-Practice</th>"
        resourceTbl_header = resourceTbl_header + "<th >Start Date</th>"
        resourceTbl_header = resourceTbl_header + "<th >End Date</th>"
        resourceTbl_header = resourceTbl_header + "<th>Allocation %</th>"
        resourceTbl_header = resourceTbl_header + "<th>Status</th>"
        resourceTbl_header = resourceTbl_header + "<th >Work Location</th>"
        resourceTbl_header = resourceTbl_header + "<th >Action</th>"
        resourceTbl_header = resourceTbl_header + "</tr></thead>";

        //footer menu
        resourceTbl_header = resourceTbl_header + "<tfoot><tr>";
        resourceTbl_header = resourceTbl_header + "<th>Item</th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th>Action</th>"
        resourceTbl_header = resourceTbl_header + " </tr></tfoot>";
        //Call Rest API to Get Data from project Server
        var bool = "";
        url = EmployeeSkill(PrimarySkill); //site_url + "_api/EmployeeSkills?$filter=Skill_Type eq 'Primary' and Skill_Detail eq'" + PrimarySkill + "'";
        var tdId = "";
        var rejId = "";
        var cmntID = "";

        if (resourceRRF[26] != "" && (pageStatus == "External Hiring" || pageStatus == "Offer") || externalhiringflag == "1") {
            document.getElementById('SoftBlockResource').style.display = 'none';
            document.getElementById('softblockHead').style.display = 'none';
            $('#errMsgSvaeSoftBlock').css('display', 'none');
            var Resource_Dataset = searchResource(ExternalEmplooyeeId);
            $.each(Resource_Dataset, function (index, value) {
                var EmpID = "";
                var EmpName = "";
                var Designation = "";
                var projectcode = "";
                var ProjectName = "";
                var ProjectstartDate = "";
                var ProjectEnddate = "";
                var allocationPercent = ""
                var Location = "";
                var status = "";

                if (value.EmployeeID != null) {
                    EmpID = value.EmployeeID;
                }
                // if (value.ResourceFullName != null) {
                EmpName = ExternalEmplooyeeName;
                //}
                if (value.Designation != null) {
                    Designation = value.Designation;
                }
                //if (value.ProjectName != null) {
                //    ProjectName = value.ProjectName;
                //}
                //if (value.Startdatetime != null) {
                ProjectstartDate = convert_date_DDMMYYYY(projectStrtdate);
                //}
                //if (value.Finishdatetime != null) {
                ProjectEnddate = convert_date_DDMMYYYY(projectEnddate);
                //}
                //if (value.Allocation != null) {
                //    allocationPercent = value.Allocation;
                //}
                //if (value.Work_Location != null) {
                //    Location = value.Work_Location;
                //}
                if (value.Employee_status != null) {
                    status = value.Employee_status;
                }
                document.getElementById('btnResorceSave').style.display = 'none';
                var ProjectNameHTML = projectName;
                EmpID = ExternalEmplooyeeId;
                cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;

                var externalDetails = rrfprojectID + "#;" + EmpID + "#;" + EmpName + "#;" + Designation + "#;" + projectName + "#;" + sub_pracitc + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + status + "#;" + ProLocation + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName;
                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td><input type='checkbox' name='checkResource' value='" + EmpID + "' /></td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td>" + ProjectNameHTML + "</td><td>" + ProjectManagerName + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + RRFAllocationPercent + "</td><td>" + status + "</td><td>" + ProLocation + "</td><td><span id='" + externalDetails + "' class='glyphicon glyphicon-ok-sign icon-weight' aria-hidden='true' title='Approve' onclick='ResourceExternalApproval(this)'></span><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

            });

        } else if ((pageStatus == "Resource Selection" || ResourceAllocationFlag == "1" || ResourceAllocationFlag == "2") && pageStatus != "Fulfilled") {
            document.getElementById('SoftBlockResource').style.display = 'none';
            document.getElementById('softblockHead').style.display = 'none';
            $('#errMsgSvaeSoftBlock').css('display', 'none');
            url = "../_api/web/lists/getbytitle('RMOResourceAllocation')/items?$filter=RRFNumber eq'" + RRFNumber + "'";
            //document.getElementById('btnResorceSave').style.display = 'none';
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $('.loader').show();
                    //var ResourceLIHTML = "<tbody>";
                    tdId = "";
                    rejId = "";
                    cmntID = "";
                    $.each(data.d.results, function (key, value) {
                        var EmpID = "";
                        if ((pageStatus == "Resource Proposed" && ResourceAllocationFlag == "1") || pageStatus == "Resource Selection" || pageStatus == "Fulfilled") {
                            var EmpID_array = "";
                            if (pageStatus == "Resource Proposed") {
                                EmpID_array = value.ShortlistedResource;
                            } else {
                                EmpID_array = value.AllocatedResource;
                            }
                            if (EmpID_array != "" && EmpID_array != null) {
                                if (EmpID_array.indexOf(';') > 0) {
                                    EmpID_array = EmpID_array.split(';');
                                } else {
                                    var empIDSingle = EmpID_array;
                                    var EmpID_array = [];
                                    EmpID_array.push(empIDSingle);
                                }
                                $.each(EmpID_array, function (index, eployeeid) {
                                    EmpID = eployeeid;
                                    var Resource_Dataset = searchResource(EmpID, PrimarySkill, SecondrySkill, RolBand, projectStrtdate, RRFAllocationPercent, rrfEndDate);
                                    $.each(Resource_Dataset, function (index, value) {
                                        bool = index + 1;
                                        var EmpID = "";
                                        var EmpName = "";
                                        var Designation = "";
                                        var projectcode = "";
                                        var ProjectName = "";
                                        var ProjectstartDate = "";
                                        var ProjectEnddate = "";
                                        var allocationPercent = ""
                                        var Location = "";
                                        var status = "";
                                        var Employee_Email = "";
                                        var Project_Manager = "";
                                        if (value.EmployeeID != null) {
                                            EmpID = value.EmployeeID;
                                        }
                                        if (value.ResourceFullName != null) {
                                            EmpName = value.ResourceFullName;
                                        }
                                        if (value.Designation != null) {
                                            Designation = value.Designation;
                                        }
                                        if (value.ProjectName != null) {
                                            ProjectName = value.ProjectName;
                                        }
                                        if (value.Startdatetime != null) {
                                            ProjectstartDate = value.Startdatetime;
                                        }
                                        if (value.Finishdatetime != null) {
                                            ProjectEnddate = value.Finishdatetime;
                                        }
                                        if (value.Allocation != null) {
                                            allocationPercent = value.Allocation;
                                        }
                                        if (value.Work_Location != null) {
                                            Location = value.Work_Location;
                                        }
                                        if (value.Employee_status != null) {
                                            status = value.Employee_status;
                                        }
                                        if (value.Work_Email != null) {
                                            Employee_Email = value.Work_Email;
                                        }
                                        //if (value.Project_Manager != null) {
                                        //    Project_Manager = value.Project_Manager;
                                        //}
                                        $.each(SeletedEmployeeIDcheck, function (key, checkvalue) {
                                            if (checkvalue == EmpID) {
                                                bool = 0;
                                            }

                                        })
                                        var ProjectNameHTML = "";
                                        if (ProjectName == "Multiple Assignment") {
                                            Project_Manager = "NA";
                                            ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                                        } else {
                                            ProjectNameHTML = ProjectName;
                                            if (value.ProjectCode != null) {
                                                Project_Manager = findProjectwiseProjectManager(value.ProjectCode);
                                            }
                                        }

                                        EmpID = eployeeid;
                                        tdId = "resourcebtnApprove" + key;
                                        rejId = "resourcebtnReject" + "#;" + EmpID + "#;" + EmpName + "#;" + ProjectCode + "#;" + projectName + "#;" + ProLocation + "#;" + PrimarySkill + "#;" + RRFNumber + "#;" + EmployeeRole;
                                        cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;
                                        var assigmntDetails = EmpID + "#;" + rrfprojectID + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill;
                                        if (pageStatus == "Resource Proposed" && (LoginUserID == RMOSPOCUserId || LoginUserID == ProjectManagerUserId || RMOSuperUserFlag == "1")) {

                                            if (ResourceAllocationFlag == "1" && (LoginUserID == ProjectManagerUserId || RMOSuperUserFlag == "1")) {
                                                document.getElementById('btnResorceSave').style.display = 'none';
                                                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + EmpID + "#" + rrfprojectID + "' class='glyphicon glyphicon-ok-sign icon-weight' aria-hidden='true' title='Approve' onclick='ResourceApproval(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span> <span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            }
                                            else {
                                                document.getElementById('btnResorceSave').style.display = 'none';
                                                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' /></td>" + bool + "<td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            }
                                        }
                                        else if (pageStatus == "Resource Selection" && (LoginUserID == RMOSPOCUserId || RMOSuperUserFlag == "1")) {
                                            ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td></td><td id=" + EmpID + "#;" + rrfprojectID + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + assigmntDetails + "' class='glyphicon glyphicon-lock icon-weight' aria-hidden='true' title='Resource Allocation' onclick='ResourceAssignment(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span> <span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            document.getElementById('btnResorceSave').style.display = 'none';
                                        }
                                        else {
                                            ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td></td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            document.getElementById('btnResorceSave').style.display = 'none';
                                        }

                                    });

                                })
                            }
                        }
                    });
                }
            });

        } else if (pageStatus == "Fulfilled") {
            document.getElementById('softblockHead').style.display = 'none';
            document.getElementById('SoftBlockResource').style.display = 'none';
            $('#errMsgSvaeSoftBlock').css('display', 'none');
            $('.clssPopupHead').text(RRFNumber + ' : Allocated Resource');
            url = "../_api/web/lists/getbytitle('RMOResourceAssignment')/items?$select=ResourceID,ResourceName,Designation,ProjectName,NewStartDate,NewEndDate,AllocationPercent,ProjectLoaction,Employee_status&$filter=RRFNumber eq'" + RRFNumber + "'";
            document.getElementById('btnResorceSave').style.display = 'none';
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    $.each(data.d.results, function (index, value) {
                        // var value = data.d.results;
                        var EmpID = "";
                        var EmpName = "";
                        var Designation = "";
                        var projectcode = "";
                        var ProjectName = "";
                        var ProjectstartDate = "";
                        var ProjectEnddate = "";
                        var allocationPercent = ""
                        var Location = "";
                        var status = "";
                        var Employee_Email = "";
                        var Project_Manager = "";
                        if (value.ResourceID != null) {
                            EmpID = value.ResourceID;
                        }
                        if (value.ResourceName != null) {
                            EmpName = value.ResourceName;
                        }
                        if (value.Designation != null) {
                            Designation = value.Designation;
                        }
                        if (value.ProjectName != null) {
                            ProjectName = value.ProjectName;
                        }
                        if (value.NewStartDate != null) {
                            ProjectstartDate = value.NewStartDate;
                            ProjectstartDate = convert_date_DDMMYYYY(ProjectstartDate);
                        }
                        if (value.NewEndDate != null) {
                            ProjectEnddate = value.NewEndDate;
                            ProjectEnddate = convert_date_DDMMYYYY(ProjectEnddate);
                        }
                        if (value.AllocationPercent != null) {
                            allocationPercent = value.AllocationPercent;
                        }
                        if (value.ProjectLoaction != null) {
                            Location = value.ProjectLoaction;
                        }
                        if (value.Employee_status != null) {
                            status = value.Employee_status;
                        }
                        if (value.Work_Email != null) {
                            Employee_Email = value.Work_Email;
                        }

                        //if (value.Project_Manager != null) {
                        //    Project_Manager = value.Project_Manager;
                        //}
                        var ProjectNameHTML = "";
                        if (ProjectName == "Multiple Assignment")
                            ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                        else
                            ProjectNameHTML = ProjectName;

                        tdId = "resourcebtnApprove";
                        rejId = "resourcebtnReject" + "#;" + EmpID + "#;" + EmpName + "#;" + ProjectCode + "#;" + projectName + "#;" + ProLocation + "#;" + PrimarySkill + "#;" + RRFNumber;
                        cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;
                        var assigmntDetails = EmpID + "#;" + projectcode + "#;" + RRFNumber + "#;" + ProjectstartDate + "#;" + ProjectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill;
                        ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + ProjectManagerName + ">" + ProjectNameHTML + "</td><td>" + ProjectManagerName + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"


                    });
                }
            });
        } else {
            //document.getElementById('btnResorceSave').style.display = 'block';
            document.getElementById('SoftBlockResource').style.display = 'none';
            document.getElementById('softblockHead').style.display = 'none';
            EmployeeIDPara = "NA";
            chechBoxFlag = "1";
            var Resource_Dataset = searchResource(EmployeeIDPara, PrimarySkill, SecondrySkill, RolBand, projectStrtdate, RRFAllocationPercent, rrfEndDate);
            if (Resource_Dataset.length == 0) {
                document.getElementById('btnResorceSave').style.display = 'none';
            }
            $.each(Resource_Dataset, function (index, value) {
                bool = index + 1;
                var EmpID = "";
                var EmpName = "";
                var Designation = "";
                var projectcode = "";
                var ProjectName = "";
                var ProjectstartDate = "";
                var ProjectEnddate = "";
                var allocationPercent = ""
                var Location = "";
                var status = "";
                var Employee_Email = "";
                var Project_Manager = "";
                if (value.EmployeeID != null) {
                    EmpID = value.EmployeeID;
                }
                if (value.ResourceFullName != null) {
                    EmpName = value.ResourceFullName;
                }
                if (value.Designation != null) {
                    Designation = value.Designation;
                }
                if (value.ProjectName != null) {
                    ProjectName = value.ProjectName;
                }
                if (value.Startdatetime != null) {
                    ProjectstartDate = value.Startdatetime;
                }
                if (value.Finishdatetime != null) {
                    ProjectEnddate = value.Finishdatetime;
                }
                if (value.Allocation != null) {
                    allocationPercent = value.Allocation;
                }
                if (value.Work_Location != null) {
                    Location = value.Work_Location;
                }
                if (value.Employee_status != null) {
                    status = value.Employee_status;
                }
                if (value.Work_Email != null) {
                    Employee_Email = value.Work_Email;
                }
                //if (value.Project_Manager != null) {
                //    Project_Manager = value.Project_Manager;
                //}
                $.each(SeletedEmployeeIDcheck, function (key, checkvalue) {
                    if (checkvalue == EmpID) {
                        bool = 0;
                    }

                })
                var ProjectNameHTML = "";
                if (ProjectName == "Multiple Assignment") {
                    Project_Manager = "NA"
                    ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                } else {
                    if (value.ProjectCode != null) {
                        Project_Manager = findProjectwiseProjectManager(value.ProjectCode);
                    }
                    ProjectNameHTML = ProjectName;
                }
                tdId = "resourcebtnApprove" + index;
                rejId = "resourcebtnReject" + "#;" + EmpID + "#;" + EmpName + "#;" + ProjectCode + "#;" + projectName + "#;" + ProLocation + "#;" + PrimarySkill + "#;" + RRFNumber;
                cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;
                var assigmntDetails = EmpID + "#;" + rrfprojectID + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill;
                Projectdetails = ProjectCode + "#;" + projectName + "#;" + RRFAllocationPercent + "#;" + ProLocation + "#;" + RMOSPOCName + "#;" + ProjectManagerName + "#;" + PrimarySkill;
                if (pageStatus == "RRF Saved" && (LoginUserID == AuthorId || RMOSuperUserFlag == "1")) {
                    // display Save button 
                    document.getElementById('btnResorceSave').style.display = 'inline-block';
                    //document.getElementById('divSkillInfo').style.display = 'none';
                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                    document.getElementById('softblockHead').style.display = 'none';
                    document.getElementById('SoftBlockResource').style.display = 'none';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');
                }
                else if (pageStatus == "RMO Validation" && (LoginUserID == RMOSPOCUserId || RMOSuperUserFlag == "1")) {
                    document.getElementById('btnResorceSave').style.display = 'inline-block';
                    document.getElementById('divSkillInfo').style.display = 'none';
                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                    document.getElementById('softblockHead').style.display = 'none';
                    document.getElementById('SoftBlockResource').style.display = 'none';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');
                }
                else if (pageStatus == "Resource Proposed" && (LoginUserID == RMOSPOCUserId || RMOSuperUserFlag == "1") && (ResourceAllocationFlag == null || ResourceAllocationFlag == "" || ResourceAllocationFlag == undefined)) {
                    document.getElementById('btnResorceSave').style.display = 'inline-block';
                    //document.getElementById('divSkillInfo').style.display = 'none';
                    document.getElementById('softblockHead').style.display = 'block';
                    document.getElementById('SoftBlockResource').style.display = 'block';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');

                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

                }
                else {
                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + sub_pracitc + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                    document.getElementById('btnResorceSave').style.display = 'none';
                    // document.getElementById('divSkillInfo').style.display = 'none';
                    document.getElementById('softblockHead').style.display = 'none';
                    document.getElementById('SoftBlockResource').style.display = 'none';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');

                }
            });

        }
        ResourceLIHTML += "</tbody>";
        resourcetable_element = resourceTbl_header + ResourceLIHTML;
        $("#tblResources").append(resourcetable_element);

        ResourceTable = $('#tblResources').DataTable({
            "dom": 'Rlfrtip',
            "iDisplayLength": 5,
            "lengthMenu": [[5, 15, 35, -1], [5, 15, 35, "All"]],
            "pagingType": "simple_numbers"
        });

        $('#tblResources tfoot th').each(function () {
            var title = $(this).text();
            if (title != 'Action' && title != 'Item') {
                $(this).html('<input type="text" placeholder="Search ' + title + '" />');
            }
            else {
                $(this).html('');
            }
        });

        // DataTable
        var table = $('#tblResources').DataTable();

        // Apply the search
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

        if (table.data().any()) {

            bindcheckedResources(RRFNumber);
        }

    } else {
        document.getElementById('divmsgNoresource').style.display = 'block';
    }

    $('.popup-bg').show();
    $('.loader').hide();
}



//code to show view log popup
function showViewlogPopup(tdId) {
    RRFRowID = tdId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[0];
    var RowProjectID = tdId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[1];
    var RRFNumber = tdId.id.split('#;')[2];
    $('.clssPopupHead').text('View Log');
    $('.popup h4').css('text-align', 'left');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divRejectBody').style.display = "none";
    document.getElementById('divComment').style.display = "none";
    document.getElementById('divSearchResource').style.display = "none";
    document.getElementById('divApproveBody').style.display = "none";
    document.getElementById('divViewLog').style.display = "block";
    $(".removedata").remove();
    var url = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$Select=LogType,NewCreatedDate,Name,Flag,Author/Title&$expand=Author&$filter=(Flag eq '1' or Flag eq '5' or Flag eq '3') and (RRFNO eq '" + RRFNumber + "' or RRFListItemId eq '" + RRFRowID + "')&$orderby=Created desc";
    getRMOTransactionDetails(url, RowProjectID, "Log");
    $('.popup-bg').show();
}


//Code to show transactional Record details

function getRMOTransactionDetails(url, RowProjectID, Type) {
    $("#commentdata").empty();
    $("#rejectdata").empty();
    $("#resourceCommetdata").empty();
    $('#TextareaResourceComment').html('');
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            $.each(data.d.results, function (index, value) {

                var Date = convert_date_DDMMYYYY(value.NewCreatedDate);
                var Time = value.NewCreatedDate.split('T')[1];
                var FinalTime = Time.split('Z')[0];

                if (Type == "Log" || value.LogType == "External Hiring") {
                    if (value.Flag == "1" || value.Flag == "5" || value.Flag == "3") {
                        var logDeatils = '<div class="user-comments removedata"><div class="com-user-text" style="text-align:center"><label><b><u>' + value.LogType + '</u></b></label></div>';
                        logDeatils += '<div class="com-user-text"><i>' + value.Author.Title + ' | ' + Date + ' - ' + FinalTime + '</i></div><hr/></div>';

                        $("#logdata").append(logDeatils);
                    }
                }
                else if (Type == "Commentlog") {
                    if (value.Flag == "2") {
                        var logDeatils = '<div class="user-comments removedata"><div class="com-user-text" style="text-align:center"><label class="pull-left"><b><u>' + value.Name + ' | ' + Date + ' - ' + FinalTime + '</u></b></label></div><br/>';
                        logDeatils += '<div class="clearfix"></div><div class="com-user-text"><i>' + value.Comment + '</i></div><hr/></div>';
                        $("#commentdata").append(logDeatils);
                    }
                }
                else if (Type == "RejCommentlog") {
                    if (value.Flag == "3") {
                        var logDeatils = '<div class="user-comments removedata"><div class="com-user-text" style="text-align:center"><label class="pull-left"><b><u>' + value.Name + ' | ' + Date + ' - ' + FinalTime + '</u></b></label></div><br/>';
                        logDeatils += '<div class="clearfix"></div><div class="com-user-text"><i>' + value.Comment + '</i></div><hr/></div>';
                        $("#rejectdata").append(logDeatils);
                        $("#withdrawnrejectdata").append(logDeatils);
                    }
                }
                else if (Type == "ResourceComment") {
                    var logDeatils = '<div class="user-comments removedata"><div class="com-user-text" style="text-align:center"><label class="pull-left"><b><u>' + value.Name + ' | ' + Date + ' - ' + FinalTime + '</u></b></label></div><br/>';
                    logDeatils += '<div class="clearfix"></div><div class="com-user-text"><i>' + value.Comment + '</i></div><hr/></div>';
                    $('#resourceCommetdata').append(logDeatils);
                }
            });
        }
    });
}

//code to resource assignment popup
function ResourceAssignment(data) {
    txtidIndex = 0;
    var empId = data.id.split('#;')[0];
    var projectId = data.id.split('#;')[1];
    var rrfNumebr = data.id.split('#;')[2];
    var employeeRole = data.id.split('#;')[3];
    var rrfProjStartDate = data.id.split('#;')[4];
    var rrfProjEndDate = data.id.split('#;')[5];
    var rrfProjAllocation = data.id.split('#;')[6];
    var Designation = data.id.split('#;')[7];
    var status = data.id.split('#;')[9];
    var employee_email = data.id.split('#;')[10];
    var Location = data.id.split('#;')[11];
    var ProjectCode = data.id.split('#;')[12];
    var ProjectManager = data.id.split('#;')[13];
    var ClientPertner = data.id.split('#;')[14];
    var RMOSPOC = data.id.split('#;')[15];
    var ProjectName = data.id.split('#;')[16];
    var Primaryskill = data.id.split('#;')[17];



    var ResourceFullName = data.id.split('#;')[8];
    document.getElementById('rrfnumber').innerHTML = rrfNumebr;
    document.getElementById('txtEmployeeRole').value = data.id.split('#;')[3];
    $('.Toppopup h4').css('text-align', 'left');
    $('.Toppopup').css('top', '0%');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divResourceApproval').style.display = "none";
    document.getElementById('divResourceComment').style.display = "none";
    document.getElementById('divResourceRejection').style.display = "none";
    document.getElementById('divMultipleAssignment').style.display = 'none';
    document.getElementById('divResourceAssignment').style.display = "block";
    document.getElementById('Availabilitysign').style.display = 'none';
    $('.AddResource').remove();
    $('.error').css('display', 'none');
    document.getElementById('Availabilityvalue').innerHTML = "";
    document.getElementById('btnSoftblockOK').style.display = 'none';
    document.getElementById('sftblckstartDt').value = "";
    document.getElementById('sftblckendDt').value = "";
    //url = GetProjects(projectId);//"https://ppmdev.bcone.com/_api/Projects?$filter=ProjectId eq (guid'" + projectId + "')";

    //$.ajax({
    //    url: url,
    //    method: "GET",
    //    async: false,
    //    headers: { "Accept": "application/json; odata=verbose" },
    //    success: function (data) {


    if (ProjectCode != null && ProjectCode != "null") {
        document.getElementById('txtProjectCode').value = ProjectCode;
        document.getElementById('txtProjectCode').title = ProjectCode;
    }
    if (ProjectName != null && ProjectName != "null") {
        document.getElementById('txtProjectName').value = ProjectName;
        document.getElementById('txtProjectName').title = ProjectName;
    }
    if (ProjectManager != null && ProjectManager != "null") {
        document.getElementById('txtProjectManager').value = ProjectManager;
        document.getElementById('txtProjectManager').title = ProjectManager;
    }
    if (ClientPertner != null && ClientPertner != "null") {
        document.getElementById('txtclientPertner').value = ClientPertner;
        document.getElementById('txtclientPertner').title = ClientPertner;
    }
    if (RMOSPOC != null && RMOSPOC != "null") {
        document.getElementById('txtResourcemanager').value = RMOSPOC;
        document.getElementById('txtResourcemanager').title = RMOSPOC;
    }
    if (Location != null && Location != "null") {
        document.getElementById('txtPLocation').value = Location;
        document.getElementById('txtPLocation').title = Location;
    }


    //    }

    //});
    //previous Save data from RRF Library

    document.getElementById('txtAllocation').value = rrfProjAllocation;
    document.getElementById("txtstrtDt").value = convert_date_DDMMYYYY(rrfStartDate);
    document.getElementById("txtendDt").value = convert_date_DDMMYYYY(rrfEndDate);
    $('.txtEmployeeRole').val(employeeRole);
    //url = GetProjectWiseResourceAllocation(ProjectCode, empId); //"https://ppmdev.bcone.com/_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq'" + ProjectCode + "' and EmployeeID eq'" + empId + "'";
    //var details = "";

    //$.ajax({
    //    url: url,
    //    method: "GET",
    //    async: false,
    //    headers: { "Accept": "application/json; odata=verbose" },
    //    success: function (data) {
    //        if (data.d.results.length > 0) {
    //            var allocationPercent = data.d.results[0].Allocation;
    //            ResourceFullName = data.d.results[0].ResourceFullName;
    //            var srtDate = convert_date_DDMMYYYY(data.d.results[0].Startdatetime);
    //            var endDate = convert_date_DDMMYYYY(data.d.results[0].Finishdatetime);
    //            document.getElementById('txtAllocation').value = allocationPercent;
    //            document.getElementById("txtstrtDt").value = srtDate;
    //            document.getElementById("txtendDt").value = endDate;
    //        }
    //    }
    //});
    $('.TopclssPopupHead').text('Resource Assignment : ' + ResourceFullName);
    document.getElementById('rrfnumber').innerHTML = rrfNumebr + ";" + ResourceFullName + ";" + empId + ";" + Designation + ";" + status + ";" + employee_email + ";" + Primaryskill;
    if (txtidIndex == 0) {
        document.getElementById('removeaddResource').style.display = 'none';
    }
    $('.Toppopup-bg').show();
}

//code to show resource approval popup
function ResourceApproval(tdID) {
    var empID = tdID.id.split('#')[0];
    LogProjectGUID = tdID.id.split('#')[1];
    $('.TopclssPopupHead').text('Are You Sure Want To Approve?');
    $('.Toppopup h4').css('text-align', 'center');
    $('.Toppopup').css('top', '25%');
    $('.allbtn').css('text-align', 'center');
    document.getElementById('divResourceRejection').style.display = "none";
    document.getElementById('divResourceComment').style.display = "none";
    document.getElementById('divResourceAssignment').style.display = "none";
    document.getElementById('divMultipleAssignment').style.display = 'none';
    document.getElementById('divResourceApproval').style.display = "block";
    document.getElementById('empIdResourceSelection').innerHTML = empID;
    $('.Toppopup-bg').show();

}

// Code to Approver External Hiring 

function showExternalApprovalpopup(ResourceApprovalData) {

    var resourceApprovalRRF = ResourceApprovalData.id.split('#');
    RRFRowID = resourceApprovalRRF[0]; //ROW ID
    LogProjectGUID = resourceApprovalRRF[1]; // RRF Project GUID
    EmployeeRole = resourceApprovalRRF[2] + "#" + resourceApprovalRRF[4]; // RRF Employee Role
    pageStatus = resourceApprovalRRF[3]; // RRF Status
    GBU = resourceApprovalRRF[5]; // RRF GBU
    updateRRF("2");
}

//code to show resource rejection popup
function ResourceRejectionpopup(rejID) {
    var empID = rejID.id.split('#;')[1];
    var empNm = rejID.id.split('#;')[2];
    var ProjectCode = rejID.id.split('#;')[3];
    var projectName = rejID.id.split('#;')[4];
    var ProjLocation = rejID.id.split('#;')[5];
    var Skill = rejID.id.split('#;')[6];
    var RRFNumber = rejID.id.split('#;')[7];
    $('.TopclssPopupHead').text('Rejection of Proposed Resources');
    $('.Toppopup h4').css('text-align', 'left');
    $('.Toppopup').css('top', '25%');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('TextareaResourceReject').value = "";
    document.getElementById('divResourceApproval').style.display = "none";
    document.getElementById('divResourceComment').style.display = "none";
    document.getElementById('divResourceAssignment').style.display = "none";
    document.getElementById('divMultipleAssignment').style.display = 'none';
    document.getElementById('divResourceRejection').style.display = "block";
    document.getElementById('empIDName').innerHTML = empID + " " + empNm;
    $('#TextareaResourceReject').prop({
        'disabled': true
    });
    document.getElementById('ProjecDetails').innerHTML = empID + "#;" + empNm + "#;" + ProjectCode + "#;" + projectName + "#;" + ProjLocation + "#;" + Skill + "#;" + RRFNumber;
    url = "../_api/web/lists/getbytitle('ResourceRejectionReasonHead')/items?$select=ReasonHead,Flag";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            $('#ddlRejectionReason').empty();
            var parentReason = [];
            var parentFlag = [];
            var childReason = [];
            var childFlag = [];
            $('#ddlRejectionReason').append(new Option("Select Reason of Rejection", 0));
            $.each(data.d.results, function (index, value) {

                if (value.Flag.indexOf('Item') >= 0) {
                    childReason.push(value.ReasonHead);
                    childFlag.push(value.Flag);
                } else {
                    parentReason.push(value.ReasonHead);
                    parentFlag.push(value.Flag);
                }
            });
            for (var i = 0; i < parentReason.length; i++) {
                $('#ddlRejectionReason').append("<optgroup label = '" + parentReason[i] + "'>" + parentFlag[i] + "</optgroup>");
                for (var j = 0; j < childReason.length; j++) {
                    if (childFlag[j].indexOf(parentFlag[i]) >= 0) {
                        $('#ddlRejectionReason').append("<option data-value = '" + childFlag[j] + "'>" + childReason[j] + "</option>");
                    }
                }
            }
        }

    });

    $('.Toppopup-bg').show();

}
//code to show resources comment popup
function ResourceCommentpopup(comntId) {
    var resourceId = comntId.id.split('#;')[1];
    var rrfNumber = comntId.id.split('#;')[3];
    document.getElementById('TextareaResourceComment').value = "";
    document.getElementById('resourceCommentSpan').innerHTML = rrfNumber + '#' + resourceId;
    $('.TopclssPopupHead').text('Please Enter Comment');
    $('.Toppopup h4').css('text-align', 'left');
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divResourceApproval').style.display = "none";
    document.getElementById('divResourceRejection').style.display = "none";
    document.getElementById('divResourceAssignment').style.display = "none";
    document.getElementById('divMultipleAssignment').style.display = 'none';
    document.getElementById('divResourceComment').style.display = "block";
    var comment = document.getElementById('TextareaResourceComment').value;
    //showPreviousComment(resourceId, rrfNumber);
    var dataurl = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$filter=RRFNO eq'" + rrfNumber + "'and ResourceID eq'" + resourceId + "'&$orderby=Created desc";
    getRMOTransactionDetails(dataurl, "", "ResourceComment");
    $('.Toppopup-bg').show();
}
//Code to refine data based on status

function refine_status(status, liname, PageLoad) {
    indecator_Parameter = [];
    $('.loader').show();
    setTimeout(function () {
        defer_refine_status(status, liname, PageLoad)
        $('.loader').hide();
    }, 100);
}


function defer_refine_status(status, liname, PageLoad) {
    ResourceTableFlag = "";
    pageStatus = status;
    $("#status").text(liname);
    if (PageLoad != "FirstTimeLoad")
        destroyjs('#RRFForm');
    table_header = "<thead><tr>";
    if (status == "allrecord") {
        //Table binding for ALL Record
        StatusFlag = "allrecord"; //
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Status</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";

        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        allrecordCount = 0;
        //url for get All records.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,ExternalHiring,RequirementPct,RRFCreatedDate,PendingWith/Title,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,PendingWithId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser,PendingWith&$Filter=Status ne 'Fulfilled' and Status ne 'Withdrawn'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "rmovalidation") {



        //Table binding for RMO Validation
        StatusFlag = "rmovalidation";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        rmovalidationCount = 0;
        //url for get only projects with status is Submitted or RMO validation.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'RMO Validation'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "fpnapproval") {
        // //Table binding for FPNA Approval
        StatusFlag = "fpnapproval";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        fpnapprovalCount = 0;
        //url for get only project with status is FPNA Approval.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,PendingWith/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,PendingWithId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser,PendingWith&$Filter=Status eq 'Initiated External Hiring'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "resourceproposed") {
        //Table binding for Resource Proposed
        StatusFlag = "resourceproposed";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        resourceproposedCount = 0;
        //url for get only projects with status is Resource Proposed.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,PendingWith/Title,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,PendingWithId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser,PendingWith&$Filter=Status eq 'Resource Proposed'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "resourceselection") {
        //Table binding for Resource Selection
        StatusFlag = "resourceselection";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        resourceselectionCount = 0;
        //url for get only projects with status is Resource Selection.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Resource Selection'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "fulfilled") {
        //Table binding for Fulfilled
        StatusFlag = "fulfilled";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        fulfilledCount = 0;
        //url for get only projects with status is Resource Allocation and Offer.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=Status,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Fulfilled'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "withdrawn") {
        //Table binding for Withdrawn
        StatusFlag = "withdrawn";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        //table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";
        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        //table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        withdrawnCount = 0;
        //url for get only projects with status is Withdrawn.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Withdrawn' or Status eq 'REJECTED'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "rrfsaved") {
        //Table binding for RRF Saved.
        StatusFlag = "rrfsaved";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";

        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        //rrfsavedCount = 0;
        //url for get only projects with status is Draft.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Draft' or Status eq 'RRF Saved'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "externalhiring") {
        //Table binding for RRF Saved.
        StatusFlag = "externalhiring";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "</tr></thead>";

        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + " </tr></tfoot>";
        rrfexternalHiring = 0;
        //url for get only projects with status is Draft.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ExternalHiring,ProjectCode,ExternalHiring,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ResourceAgainstRRFInWDId,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Offer' or Status eq 'External Hiring'&$Top=100000&$orderby=ID%20desc";
    }
    else if (status == "rrfnonbillable") {

        //Table to bind NonBillable data
        StatusFlag = "rrfnonbillable";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:7%'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project</th>"
        table_header = table_header + "<th style='width:9%'>Customer</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"
        table_header = table_header + "<th style=''>Pending With</th>"
        table_header = table_header + "<th style='width:9%'>Indicators</th>"
        table_header = table_header + "</tr></thead>";

        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th>Indicators</th>"
        table_header = table_header + " </tr></tfoot>";
        //rrfsavedCount = 0;
        //url for get only projects with status is Draft.
        url = "../_api/web/lists/getbytitle('RRF')/items?$select=WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,NewAuthor/Title,PendingWith/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,NonBillableFlag,PendingWithId,EmployeeRole,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$expand=ResourceAgainstRRFInWD,PendingWith,NewAuthor&$Filter=EmployeeRole ne 'Billable' and ((Status eq 'VPHR') or (Status eq 'Recruitment Head') or (Status eq 'FPNA') or (Status eq 'Functional Head') or (Status eq 'Non Billable')) and ((Status ne 'Withdrawn') or (Status ne 'Fulfilled'))&$Top=100000&$orderby=ID%20desc";
    }

    //Call Rest API to Get Data from List
    var listname = "RRF";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            document.getElementById('rrfallrecordcount').innerHTML = allrecordCount;
            document.getElementById('rrfrmovalidationcount').innerHTML = rmovalidationCount;
            document.getElementById('rrfnonbillable').innerHTML = rrfnonbillable;
            document.getElementById('rrfresourceproposedcount').innerHTML = resourceproposedCount;
            document.getElementById('rrfresourceselectioncount').innerHTML = resourceselectionCount;
            document.getElementById('rrffulfilledcount').innerHTML = fulfilledCount;
            document.getElementById('rrfwithdrawncount').innerHTML = withdrawnCount;
            //document.getElementById('rrfsavedcount').innerHTML = rrfsavedCount;
            document.getElementById('rrfexternalhiring').innerHTML = rrfexternalHiring;
            if (status == "allrecord") {
                allrecordCount = data.d.results.length;
            } else {
                if (data.d.results.length > 0) {
                    TATMappingDays = getRRFTATdaysbyStatus(data.d.results[0].Status);
                }
            }
            var RRFLIHTML = "<tbody>";
            var tdId = "";
            var rejId = "";
            var cmntID = "";
            $.each(data.d.results, function (key, value) {
                var ProjectName = "";
                var ProjectGUID = "";
                var RRFNO = "";
                var StartDate = "";
                var EndDate = "";
                var Location = "";
                var RoleBand = "";
                var Billability = "";
                var RRFStatus = "";
                var projRRFNo = "";
                var RRFCreatedDate = "";

                if (value.ProjectName != null) {
                    ProjectName = value.ProjectName;
                }
                else if (value.LinkFilename != null) {
                    ProjectName = value.LinkFilename;
                }
                if (value.ProjectGUID != null) {
                    ProjectGUID = value.ProjectGUID;
                }
                if (value.RRFNO != null) {
                    RRFNO = value.RRFNO;
                }

                if (value.StartDate != null) {
                    StartDate = convert_date_DDMMYYYY(value.NewStartDate);
                }
                if (value.EndDate != null) {
                    EndDate = convert_date_DDMMYYYY(value.NewEndDate);
                }
                if (value.WorkLocation != null) {
                    Location = value.WorkLocation;
                }
                if (value.RoleBand != null) {
                    RoleBand = value.RoleBand;
                }
                if (value.Customer != null) {
                    Customer = value.Customer;
                }
                if (value.Status != null) {
                    RRFStatus = value.Status;
                }
                if (value.SubmittedDate != null) {
                    RRFCreatedDate = convert_date_DDMMYYYY(value.SubmittedDate);
                }

                if (PageLoad == "FirstTimeLoad") {
                    if (value.Status == "RMO Validation" || value.Status == "Submitted") {
                        rmovalidationCount++;
                    }
                    else if (value.Status == "Resource Proposed") {
                        resourceproposedCount++;
                    }
                    else if (value.Status == "Resource Selection") {
                        resourceselectionCount++;
                    }
                    else if (value.Status == "Resource Allocation") {
                        fulfilledCount++;
                    }
                    else if (value.Status == "Withdrawn" || value.status == "Rejected") {
                        withdrawnCount++;
                    }

                    else if (value.ExternalHiring == "1") {
                        rrfexternalHiring++;
                    }
                    else if (value.Status == "Fulfilled") {
                        fulfilledCount++;
                    }
                }
                else {
                    if (status == "allrecord") {
                        allrecordCount;
                    }
                    else if (status == "rmovalidation") {
                        rmovalidationCount++;
                    }
                    else if (status == "resourceproposed") {
                        resourceproposedCount++;
                    }
                    else if (status == "resourceselection") {
                        resourceselectionCount++;
                    }
                    else if (status == "fulfilled") {
                        fulfilledCount++;
                    }
                    else if (status == "withdrawn") {
                        withdrawnCount++;
                    }

                    else if (status == "externalhiring") {
                        rrfexternalHiring++;
                    }
                }
                if ((key < 5 && value.Status != "External Hiring" && value.Status != "Offer")) { //changes by varsha 12-sep
                    if ((value.PrimarySkill != null || value.SecondarySkill != null) && value.RoleBand != null) {
                        var serviceurl = EmployeeAvailability(); //"https://ppmdev.bcone.com/api/RMO/EmployeeAvailability";
                        requestData = "{\"PrimarySkills\":\"" + value.PrimarySkill + "\",\"SecondarySkills\":\"" + value.SecondarySkill + "\",\"RoleBand\":\"" + value.RoleBand + "\",\"StartDate\":\"" + value.NewStartDate + "\",\"EndDate\":\"" + value.NewEndDate + "\"}";
                        $.ajax({

                            url: serviceurl,
                            method: "POST",
                            data: requestData,
                            async: false,
                            dataType: "json",
                            headers:
                            {
                                "content-Type": "application/json"
                            },
                            success: function (data) {
                                TotalCount = data.EmployeeAvailability[0].Total;
                                BookedCount = data.EmployeeAvailability[2].Booked;
                                FreeCount = data.EmployeeAvailability[1].Free;
                            }
                        });
                    } else {
                        TotalCount = 0;
                        BookedCount = 0;
                        FreeCount = 0;
                    }
                } else {
                    TotalCount = 0;
                    BookedCount = 0;
                    FreeCount = 0;
                }

                //value.SubmittedDate;
                if (status == "externalhiring")
                    ResourceData = value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.WorkLocation + "#" + value.NewProjectStartDate + "#" + value.NewProjectEndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode + "#" + value.ResourceAgainstRRFInWD.EMail + "#" + value.ExternalHiring + "#" + value.NewStartDate + "#" + value.NewEndDate;
                else if (status == "rrfnonbillable")
                    ResourceData = "";//value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.BaseLocation + "#" + value.StartDate + "#" + value.EndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode;
                else
                    ResourceData = value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.WorkLocation + "#" + value.NewProjectStartDate + "#" + value.NewProjectEndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode + "#" + value.ResourceAgainstRRFInWD.EMail + "#" + value.ExternalHiring + "#" + value.NewStartDate + "#" + value.NewEndDate;

                ResourceApprovalData = value.ID + "#" + value.ProjectGUID + "#" + value.EmployeeRole + "#" + value.Status + "#" + value.NonBillableFlag + "#" + value.GBU + "#" + value.EmployeeRole + "#" + value.ProjectManagerUserId;
                document.getElementById('rrfallrecordcount').innerHTML = allrecordCount;
                document.getElementById('rrfrmovalidationcount').innerHTML = rmovalidationCount;
                document.getElementById('rrfnonbillable').innerHTML = rrfnonbillable;
                document.getElementById('rrfresourceproposedcount').innerHTML = resourceproposedCount;
                document.getElementById('rrfresourceselectioncount').innerHTML = resourceselectionCount;
                document.getElementById('rrffulfilledcount').innerHTML = fulfilledCount;
                document.getElementById('rrfwithdrawncount').innerHTML = withdrawnCount;
                //document.getElementById('rrfsavedcount').innerHTML = rrfsavedCount;
                document.getElementById('rrfexternalhiring').innerHTML = rrfexternalHiring;
                tdId = "imgbtnApprove" + key;
                rejId = "imgbtnReject" + key;
                cmntID = "imgbtnComment" + key;
                if (value.Status == "RMO Validation" || value.Status == "Resource Proposed")
                    projRRFNo = value.ProjectGUID + "#;" + (value.LinkFilename.split('.')[0]) + "#;" + value.RRFNO + "#;" + value.RequirementPct + "#;" + value.EmployeeRole + "#;" + value.Status;
                else
                    projRRFNo = value.ProjectGUID + "#;" + (value.LinkFilename.split('.')[0]) + "#;" + value.RRFNO + "#;" + value.Status;
                var totalResourceId = "Total" + key;
                var BookedResourceId = "Booked" + key;
                var FreeResourceId = "Free" + key;
                //var rrfprojectName = value.LinkFilename;
                var IndicatorParameter = value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand;
                indecator_Parameter.push(IndicatorParameter);

                var clone = "";;
                if (value.CloneType != null) {
                    clone = "<span class='clone'>Clone</span>";
                }
                else {
                    clone = "";
                }

                var ExternalInitated = "";
                if (value.InternallyFulfilled != null && value.InternallyFulfilled != "") {
                    ExternalInitated = "<span class='clone'>Internally Fulfilled</span>";
                }
                else {
                    ExternalInitated = "";
                }


                //var SOWTatDate = dt.format("d-MMM-yy");
                //var days = new Date(value.SubmittedDate.getDate() - i);

                var BusinessDaysCount = "";

                if (value.TATDateTime != "" && value.TATDateTime != null) {
                    if (status != "allrecord" && TATMappingDays.length > 0) {

                        var totalweekdays = "";
                        var newDate = new Date();
                        var submittedDate = new Date(value.TATDateTime);
                        var TodayDate = new Date(newDate);
                        for (var i = submittedDate; i <= TodayDate;) {
                            if (i.getDay() == 0) {
                                totalweekdays++;
                            }
                            if (i.getDay() == 6) {
                                totalweekdays++;
                            }
                            i.setTime(i.getTime() + 1000 * 60 * 60 * 24);
                        }

                        if (TATMappingDays.length > 1) {
                            $.each(TATMappingDays, function (Flagkey, Flag_Value) {
                                if ((value.ResourceProposedFlag == "1" || value.ResourceProposedFlag == 1) && (Flag_Value.Flag == 1)) {
                                    var T_days = Flag_Value.TATDays;
                                    T_days = parseInt(T_days);

                                    if (totalweekdays > T_days) {
                                        BusinessDaysCount = "<div class='bgred'>" + totalweekdays + " - D</div>";
                                    }
                                    else if (totalweekdays != 0) {
                                        BusinessDaysCount = "<div class='bggreen'>" + totalweekdays + " - D</div>";
                                    }
                                } else {
                                    var T_days = Flag_Value.TATDays;
                                    T_days = parseInt(T_days);

                                    if (totalweekdays > T_days) {
                                        BusinessDaysCount = "<div class='bgred'>" + totalweekdays + " - D</div>";
                                    }
                                    else if (totalweekdays != 0) {
                                        BusinessDaysCount = "<div class='bggreen'>" + totalweekdays + " - D</div>";
                                    }
                                }

                            });
                        } else {
                            var T_days = TATMappingDays[0].TATDays;
                            T_days = parseInt(T_days);

                            if (totalweekdays > T_days) {
                                BusinessDaysCount = "<div class='bgred'>" + totalweekdays + " - D</div>";
                            }
                            else if (totalweekdays != 0) {
                                BusinessDaysCount = "<div class='bggreen'>" + totalweekdays + " - D</div>";
                            }
                        }
                    }
                }
                if (status == "rrfnonbillable") {

                    if (value.NonBillableFlag == null && (LoginUserID == value.NewAuthorId || RMOSuperUserFlag == "1")) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && (LoginUserID == value.PendingWithId || RMOSuperUserFlag == "1")) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Withdrawn</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.PendingWith.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else {
                        var NonPendingWith = "";
                        if (value.NonBillableFlag == null)
                            NonPendingWith = value.NewAuthor.Title;
                        else if (value.NonBillableFlag == 1)
                            NonPendingWith = value.PendingWith.Title;
                        else
                            NonPendingWith = "";

                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + NonPendingWith + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }

                }
                else if (status == "allrecord") {
                    if ((value.Status == "Draft" || value.Status == "RRF Saved") && value.NewAuthorId == LoginUserID) {

                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                        //Check RMO ID
                    else if ((value.Status == "RMO Validation") && value.RMOSPOCUserId == LoginUserID) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.RMOSPOCUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                        //Check RMO ID
                    else if (value.Status == "Resource Proposed" && (value.RMOSPOCUserId == LoginUserID || value.ProjectManagerUserId == LoginUserID)) {

                        var PendingWithTitle = "";
                        var ExternalLink = "";

                        if (value.PendingWithId != -1 && value.PendingWithId != null) {
                            PendingWithTitle = value.PendingWith.Title;
                            rejecticon = "";
                            ExternalLink = "";
                        }
                        else {
                            PendingWithTitle = value.RMOSPOCUser.Title;

                            rejecticon = "";
                            //ExternalLink = "<div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='fa fa-external-link-square' aria-hidden='true' onclick='ExternalPopUp(this)'></span><div class='tooltiptext-1' style='width:100px !important'>External Hiring</div></div>";
                        }


                        if (value.RMOSPOCUserId == LoginUserID) {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div>" + ExternalLink + "</div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + PendingWithTitle + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                        else {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + PendingWithTitle + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                    }
                    else if (value.Status == "Resource Selection" && value.RMOSPOCUserId == LoginUserID) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.RMOSPOCUser.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                        //Check RMO ID
                    else if (value.Status == "Resource Allocation" && value.RMOSPOCUserId == LoginUserID) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.RMOSPOCUser.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Fulfilled") {
                        if (value.EmployeeRole != "Billable" && value.EmployeeRole != "Billable Consultant") // changed by Abhishek 13 09 17
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        else
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Withdrawn" || value.Status == "Rejected") {
                        if (value.NewAuthorId == LoginUserID) {
                            if (value.EmployeeRole != "Billable" && value.EmployeeRole != "Billable Consultant") {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='action-view'><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                            }
                            else {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td></td><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                            }
                        }
                        else {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td></td><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                    }
                    else if (value.Status == "Offer" || value.Status == "External Hiring") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td></td><td></td></tr>"
                    }
                    else if (value.NonBillableFlag == null && LoginUserID == value.NewAuthorId && value.Status == "Non Billable") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && LoginUserID == value.PendingWithId && value.Status == "FPNA") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.PendingWith.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && LoginUserID == value.PendingWithId && value.Status == "Recruitment Head") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.PendingWith.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && LoginUserID == value.PendingWithId && value.Status == "VPHR") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.PendingWith.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && LoginUserID == value.PendingWithId && value.Status == "Functional Head") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.PendingWith.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Initiated External Hiring" && LoginUserID == value.FPNAUserId) {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.FPNAUser.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Non Billable") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.NewAuthor.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "FPNA" || value.Status == "Recruitment Head" || value.Status == "VPHR" || value.Status == "Functional Head") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + value.PendingWith.Title + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else {
                        var PendingWith = "";
                        if (value.Status == "RRF Saved") {
                            PendingWith = value.NewAuthor.Title;
                        }
                        else if (value.Status == "RMO Validation") {
                            PendingWith = value.RMOSPOCUser.Title;
                        }
                        else if (value.Status == "Resource Proposed") {
                            if (value.PendingWithId != -1 && value.PendingWithId != null) {
                                PendingWith = value.PendingWith.Title;
                                rejecticon = "";
                                ExternalLink = "";
                            }

                            else {
                                PendingWith = value.RMOSPOCUser.Title;
                            }

                        }
                        else if (value.Status == "Resource Selection") {
                            PendingWith = value.RMOSPOCUser.Title;
                        }
                        else if (value.Status == "External Hiring") {
                            PendingWith = value.FPNAUser.Title;
                        }
                        else if (value.Status == "Functional Head" || value.Status == "Non Billable") {
                            PendingWith = value.NewAuthor.Title;
                        }
                        else if (value.Status == "FPNA" || value.Status == "Recruitment Head" || value.Status == "VPHR") {
                            PendingWith = value.PendingWith.Title;
                        }
                        else if (value.Status == "Initiated External Hiring") {
                            PendingWith = value.FPNAUser.Title;
                        }
                        else {
                            PendingWith = "";
                        }
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td><td>" + PendingWith + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                }
                else {
                    if ((value.Status == "Draft" || value.Status == "RRF Saved") && RMOSuperUserFlag == "1") {

                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                        //Check RMO ID
                    else if ((value.Status == "RMO Validation") && RMOSuperUserFlag == "1") {

                        if (RMOSuperUserFlag == "1") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='fa fa-external-link-square' aria-hidden='true' onclick='ExternalPopUp(this)'></span><div class='tooltiptext-1' style='width:100px !important'>External Hiring</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.RMOSPOCUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                        else if (value.NewAuthorId == LoginUserID) {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Withdrawn</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.RMOSPOCUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }

                    }
                        //Check RMO ID


                        //Check RMO ID
                    else if (value.Status == "Resource Allocation" && RMOSuperUserFlag == "1") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.RMOSPOCUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Fulfilled") {
                        if (value.EmployeeRole != "Billable Consultant" && value.EmployeeRole != "Billable") // changed by Abhishek 13 09 17
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        else
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Withdrawn" || value.Status == "Rejected") {
                        var ModifiedDate = "";
                        if (value.Modified != null) {
                            ModifiedDate = convert_date_DDMMYYYY(value.Modified);
                        }
                        if (RMOSuperUserFlag == "1") {
                            if (value.EmployeeRole != "Billable" && value.EmployeeRole != "Billable Consultant") {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td></tr>"
                            }
                            else {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td></tr>"
                            }
                        }
                        else {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td></tr>"
                        }
                    }
                    else if (value.Status == "Offer" || value.Status == "External Hiring" || value.InternallyFulfilled == "External" && StatusFlag == "externalhiring") {

                        var PendingWith = "";
                        if (value.Status == "Resource Proposed") {
                            PendingWith = value.ProjectManagerUser.Title;
                        }
                        else if (value.Status == "Resource Selection") {
                            PendingWith = value.RMOSPOCUser.Title;
                        }
                        else {
                            PendingWith = "";
                        }

                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + PendingWith + "</td></tr>"
                    }
                    else if (value.Status == "Resource Proposed" && RMOSuperUserFlag == "1") {
                        var PendingWithTitle = "";
                        var ExternalLink = "";

                        if (value.PendingWithId != -1 && value.PendingWithId != null) {
                            PendingWithTitle = value.PendingWith.Title;
                            rejecticon = "";
                            ExternalLink = "";
                        }
                        else {
                            PendingWithTitle = value.RMOSPOCUser.Title;

                            rejecticon = "<div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Withdrawn</div></div>";
                            ExternalLink = "<div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='fa fa-external-link-square' aria-hidden='true' onclick='ExternalPopUp(this)'></span><div class='tooltiptext-1' style='width:100px !important'>External Hiring</div></div>";
                        }

                        if (value.RMOSPOCUserId == LoginUserID || RMOSuperUserFlag == "1") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'>" + rejecticon + "<div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div>" + ExternalLink + "</div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + PendingWithTitle + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                        else {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + PendingWithTitle + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                        }
                    }
                    else if (value.Status == "Resource Selection" && RMOSuperUserFlag == "1") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.RMOSPOCUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == null && RMOSuperUserFlag == "1" && value.Status == "Non Billable") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Withdrawn</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.NewAuthor.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && RMOSuperUserFlag == "1" && value.Status == "FPNA") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.PendingWith.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && RMOSuperUserFlag == "1" && value.Status == "Recruitment Head") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.PendingWith.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && RMOSuperUserFlag == "1" && value.Status == "VPHR") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.PendingWith.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.NonBillableFlag == 1 && RMOSuperUserFlag == "1" && value.Status == "Functional Head") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.PendingWith.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else if (value.Status == "Initiated External Hiring" && RMOSuperUserFlag == "1") {
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceApprovalData + "' class='glyphicon glyphicon-send' aria-hidden='true' onclick='showExternalApprovalpopup(this)'></span><div class='tooltiptext-1'>Submit</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Reject</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + value.FPNAUser.Title + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                    else {
                        var PendingWith = "";
                        if (value.Status == "RRF Saved") {
                            PendingWith = value.NewAuthor.Title;
                        }
                        else if (value.Status == "RMO Validation") {
                            PendingWith = value.RMOSPOCUser.Title;
                        }
                        else if (value.Status == "Resource Proposed") {
                            if (value.PendingWithId != -1) {
                                PendingWith = value.PendingWith.Title;
                                rejecticon = "";
                                ExternalLink = "";
                            }

                            else {
                                PendingWith = value.RMOSPOCUser.Title;
                            }

                        }
                        else if (value.Status == "Resource Selection") {
                            PendingWith = value.RMOSPOCUser.Title;
                        }
                        else if (value.Status == "External Hiring") {
                            PendingWith = value.FPNAUser.Title;
                        }
                        else if (value.Status == "Functional Head" || value.Status == "Non Billable") {
                            PendingWith = value.NewAuthor.Title;
                        }
                        else if (value.Status == "FPNA" || value.Status == "Recruitment Head" || value.Status == "VPHR") {
                            PendingWith = value.PendingWith.Title;
                        }
                        else if (value.Status == "Initiated External Hiring") {
                            PendingWith = value.FPNAUser.Title;
                        }
                        else {
                            PendingWith = "";
                        }
                        RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td><td>" + PendingWith + " " + BusinessDaysCount + "</td><td id='" + key + "'><div class='indication'><ul><li id='" + totalResourceId + "' title='Capacity'>" + TotalCount + "</li><li id='" + FreeResourceId + "' title='Availability'>" + FreeCount + "</li><li id='" + BookedResourceId + "' title='Roll Offs'>" + BookedCount + "</li><li onclick='refreshData(this)' title='Refresh'><i class='fa fa-refresh' aria-hidden='true'></i></li></ul></div></td></tr>"
                    }
                }
            });

            RRFLIHTML += "</tbody>";
            table_element = table_header + RRFLIHTML;
            $("#RRFForm").append(table_element);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }

    });
      RRF_Table = $('#RRFForm').DataTable({
            // "autoWidth": false,
            "dom": 'Rlfrtip',
            "iDisplayLength": 5,
            "lengthMenu": [[5, 15, 35, -1], [5, 15, 35, "All"]],
            "dom": 'lBfrtip',
            buttons: [
              {
                  extend: 'excelHtml5',
                  exportOptions: {
                      columns: [2, 3, 4, 5, 6, 7, 8, 9,10]
                  }
              },
            ],
        });

    $('#RRFForm tfoot th').each(function () {
        var title = $(this).text();
        if (title != 'Action' && title != 'Indicators') {
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
        else {
            $(this).html('');
        }
    });
    // DataTable
    var table = $('#RRFForm').DataTable();

    // Apply the search
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
    $('.loader').hide();
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
        $(tableid).html("");
        $(tableid + " tbody tr").remove();
    }

}

// code to submit RRF
function submitRRF() {
    var Flag = "1";
    var comment = "";
    $('.loader').show();
    setTimeout(function () {
        insertProjectComment(comment, Flag, "", "");
        updateRRF(Flag);
        $('.alertmessage').show();
        $('#withdrawnrejectdata').hide();
        $('.alertmessage').text('RRF Submitted Successfully');
        $('.popup-bg-alert').show();
        $('.loader').hide();
    }, 100);
}


//Close Popup
function closePopUp() {
    $('.popup-bg').hide();
    $('.clssPopupHead').text('');
    $('#divExternalMsg').css('display', 'none');
}

//code to update RRF 
function updateRRF(Flag) {

    var rrfstatus = "";
    var item = {
        __metadata: { "type": "SP.Data.RRFItem" }
    };

    if (pageStatus == "Withdrawn") {
        if (RRFEmployeeRole.split('#')[0] != "Billable" && RRFEmployeeRole.split('#')[0] != "Billable Consultant") {
            getApproverNames(GBU, RRFRowID, LogProjectGUID, NonBillableApproverID);
            $.extend(item, { PendingWithId: NonBillableApproverID });
            $.extend(item, { NonApprovers: NonApprovers });
            $.extend(item, { NonBillableFlag: null });
            $.extend(item, { Status: "Non Billable" });
            $.extend(item, { TATDateTime: currentDate });
            $.extend(item, { SubmittedDate: currentDate });
        }
        else {
            pageStatus = "RRF Saved";
            $.extend(item, { Status: pageStatus });
            $.extend(item, { ReinitiatedFlag: 1 });
            $.extend(item, { TATDateTime: currentDate });
            $.extend(item, { SubmittedDate: currentDate });
        }
    }
    else if (RRFEmployeeRole.split('#')[0] != "Billable" && RRFEmployeeRole.split('#')[0] != "Billable Consultant" && RRFEmployeeRole.split('#')[1] == "null" && pageStatus != "Functional Head") {
        getApproverNames(GBU, RRFRowID, LogProjectGUID, NonBillableApproverID);
        $.extend(item, { PendingWithId: NonBillableApproverID });
        $.extend(item, { Status: "Functional Head" });
        $.extend(item, { NonBillableFlag: 1 });
        $.extend(item, { NonApprovers: NonApprovers });
        $.extend(item, { TATDateTime: currentDate });
        $.extend(item, { SubmittedDate: currentDate });

    }
    else if (RRFEmployeeRole.split('#')[1] == 1 || pageStatus == "Functional Head") {
        var ApproverId = getApprover2Name(RRFRowID, LogProjectGUID);
        $.extend(item, { PendingWithId: ApproverId });
        $.extend(item, { NonBillableFlag: 1 });
        $.extend(item, { Status: NonBillableStatus });
        $.extend(item, { TATDateTime: currentDate });

    }
    else {
        if (Flag == "1") {

            if (pageStatus == "RRF Saved") {
                pageStatus = "RMO Validation";
                $.extend(item, { CloneType: "" });
                $.extend(item, { TATDateTime: currentDate });
                $.extend(item, { SubmittedDate: currentDate });
                $.extend(item, { ReinitiatedFlag: 1 });
                // Save Email Data (To : RMO SPOC) ( CC : Requestor , Client Partner , RMO Team )
                //saveEmailData("25", "RMO SPOC", "");
            }
            else if (pageStatus == "RMO Validation") {
                pageStatus = "Resource Proposed";
                $.extend(item, { TATDateTime: currentDate });
            }
            else if (pageStatus == "Resource Proposed") {
                pageStatus = "Resource Selection";
            }
            $.extend(item, { WorkDayUpdate: 1 });// Code to set the flag for Work Day
            $.extend(item, { Status: pageStatus });
        }
        else if (Flag == "2") {
            if (pageStatus == "Initiated External Hiring") {
                pageStatus = "External Hiring";
            }
            $.extend(item, { Status: pageStatus });
            $.extend(item, { ExternalHiring: 1 });// Code to set the flag for Work Day
            $.extend(item, { WorkDay: 1 });// Code to set the flag for Work Day
        }
        else if (Flag == "4") {
            if (pageStatus == "RMO Validation" || pageStatus == "Resource Proposed") {
                //pageStatus = "Initiated External Hiring";
                $.extend(item, { Status: "Initiated External Hiring" });
                $.extend(item, { WorkDayUpdate: 1 });// Code to set the flag for Work Day
                $.extend(item, { TATDateTime: currentDate });
            }

        }
        else if (Flag == "3") {
            pageStatus = "Resource Proposed";
            $.extend(item, { PendingWithId: ProjectManagerUserId });
            $.extend(item, { WorkDayUpdate: 1 }); // Code to set the flag for Work Day
            $.extend(item, { TATDateTime: currentDate });
            $.extend(item, { ResourceProposedFlag: 1 }); //proposed flag 1 for step1
        }
    }
    $.ajax({
        url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*"
        },
        success: function (data) {
            // $('.popup-bg').hide();

            if (StatusFlag == "allrecord") {
                rrfstatus = "allrecord"; pageStatus = "All Record";
            }
            else if (StatusFlag == "rmovalidation") {
                rrfstatus = "rmovalidation"; pageStatus = "RMO Validation";
            }
            else if (StatusFlag == "resourceproposed") {
                rrfstatus = "resourceproposed"; pageStatus = "Resource Proposed";
            }
            else if (StatusFlag == "fpnapproval") {
                rrfstatus = "fpnapproval"; pageStatus = "FPNA Approval";
            }
            else if (StatusFlag == "resourceselection") {
                rrfstatus = "resourceselection"; pageStatus = "Resource Selection";
            }
            else if (StatusFlag == "fulfilled") {
                rrfstatus = "fulfilled"; pageStatus = "Fulfilled";
            }
            else if (StatusFlag == "withdrawn") {
                rrfstatus = "withdrawn"; pageStatus = "Withdrawn";
            }
            else if (StatusFlag == "rrfsaved") {
                rrfstatus = "rrfsaved"; pageStatus = "RRF Saved";
            }
            else if (StatusFlag == "externalhiring") {
                rrfstatus = "externalhiring"; pageStatus = "External Hiring";
            }
            else if (StatusFlag == "rrfnonbillable") {
                rrfstatus = "rrfnonbillable"; pageStatus = "Non Billable";
            }

            refine_status(rrfstatus, pageStatus, "");

        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}






// code to reject request
function rejectRequest() {
    $('.loader').show();
    setTimeout(function () {
        var comment = document.getElementById('Txt_Comment').value;
        if (comment == "") {
            $('#Txt_Comment').css({
                "border": "1px solid red",
                "background": "#FFCECE"
            });
            document.getElementById("AlertMsg").innerHTML = "Please Enter the Comment";
            document.getElementById("Txt_Comment").focus();
            $('.loader').hide();
            return false;
        }
        else {
            $('#Txt_Comment').css({
                "border": "",
                "background": ""
            });
            document.getElementById("AlertMsg").innerHTML = "";
            var Flag = "3";
            insertProjectComment(comment, Flag, "", "");
            UpdateProjectStatus();
            $('.alertmessage').show();
            $('#withdrawnrejectdata').hide();
            $('.alertmessage').text('RRF Rejected Successfully');
            $('.popup-bg-alert').show();
            $('.loader').hide();
        }
    }, 100);

}
// code to save comment
function saveComment() {
    $('.loader').show();
    setTimeout(function () {
        saveCommentDate();
        $('.loader').hide();
    }, 100);

}

function saveCommentDate() {
    var comment = document.getElementById('TxtAria_Comment').value;
    if (comment == "") {
        $('#TxtAria_Comment').css({

            "border": "1px solid red",
            "background": "#FFCECE"
        });

        document.getElementById("commentAlert").innerHTML = "Please Enter the Comment";
        document.getElementById("TxtAria_Comment").focus();
        return false;
    }
    else {
        var match = (new RegExp('[~#%\&{}+\|]|\\\\|^\\|\\$')).test(comment);
        if (match) {
            return false;

        } else {


            $('#TxtAria_Comment').css({

                "border": "",
                "background": ""
            });
            document.getElementById("commentAlert").innerHTML = "";
            var Flag = "2";
            insertProjectComment(comment, Flag, "", "");

        }
    }
}

function insertProjectComment(comment, Flag, RRFNumber, ResourceID) {
    var item = {
        __metadata: { "type": "SP.Data.RRFTransactionDetailsListItem" }
    };
    if (RRFNumber == "") {
        $.extend(item, { ProjectGUID: LogProjectGUID });
        $.extend(item, { Comment: comment });
        $.extend(item, { Flag: Flag });
        $.extend(item, { Name: LoginUserName });
        $.extend(item, { RRFListItemId: RRFRowID });
        if (Flag == "1") {
            Type = "";
            if (pageStatus == "RRF Saved") {
                Type = "RRF Initiated";
            }
            else {
                Type = pageStatus;
            }
            $.extend(item, { LogType: Type });
        }
    } else {
        $.extend(item, { RRFNO: RRFNumber });
        $.extend(item, { Comment: comment });
        $.extend(item, { Name: LoginUserName });
        $.extend(item, { ResourceID: ResourceID });
        $.extend(item, { LogType: pageStatus });

    }
    if (Flag == "3") {
        $.extend(item, { LogType: "RRF Rejected" });
    }
    $.ajax({
        url: "../_api/Web/Lists/GetByTitle('RRFTransactionDetails')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            if (RRFNumber != "") {
                $('.Toppopup-bg').hide();
            } else {
                $('.popup-bg').hide();
            }
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });

}

function UpdateProjectStatus() {
    var item = {
        __metadata: { "type": "SP.Data.RRFItem" }
    };
    $.extend(item, { Status: "Withdrawn" });
    $.extend(item, { PendingWithId: -1 });
    $.extend(item, { TATDateTime: currentDate });

    $.ajax({
        url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(item),
        async: false,
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "X-HTTP-Method": "MERGE",
            "If-Match": "*"
        },
        success: function (data) {
            refine_status("withdrawn", "withdrawn", "");
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
}

function hideerrormsg(comment) {
    var commentID = comment.id;
    var comment = document.getElementById(commentID).value;
    var match = (new RegExp('[~#%\&{}+\|]|\\\\|^\\|\\$')).test(comment);
    if (match) {
        $('#' + commentID).css({

            "border": "1px solid red",
            "background": "#FFCECE"
        });

        document.getElementById("AlertMsg").innerHTML = "Comment contains invalid character";
        document.getElementById("commentAlert").innerHTML = "Comment contains invalid character";
        document.getElementById("ResourceRejecterrormsg").innerHTML = "Comment contains invalid character";
        document.getElementById("errorMsgComment").innerHTML = "Comment contains invalid character";
        $('#errMsgNote').css('display', 'block');

        document.getElementById(commentID).focus();
        return false;
    } else {
        $('#' + commentID).css({

            "border": "",
            "background": ""
        });
        document.getElementById("AlertMsg").innerHTML = "";
        document.getElementById("commentAlert").innerHTML = "";
        document.getElementById("ResourceRejecterrormsg").innerHTML = "";
        document.getElementById("errorMsgComment").innerHTML = "";
        $('#errMsgNote').css('display', 'none');
    }
    return true;
}
//code to reject Resources
function RejectResources() {
    var reason = document.getElementById('ddlRejectionReason').value;
    if (reason == "" || reason == "0") {
        document.getElementById("errorMsgddlReason").innerHTML = "Please select the reason of rejection";
    } else {
        if (reason == "Additional Comments") {

            var Comment = document.getElementById('TextareaResourceReject').value;
            if (Comment == "") {
                document.getElementById("ResourceRejecterrormsg").innerHTML = "Please Provide comment";
                return false;
            } else {
                var match = (new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$')).test(Comment);
                if (match) {
                    document.getElementById("ResourceRejecterrormsg").innerHTML = "Comment contains invalid character";
                    return false;
                }
            }
        }
        var ResourceProjectDetails = document.getElementById('ProjecDetails').innerHTML;
        var empID = ResourceProjectDetails.split("#;")[0];
        var empName = ResourceProjectDetails.split("#;")[1];
        var projectCode = ResourceProjectDetails.split("#;")[2];
        var ProjName = ResourceProjectDetails.split("#;")[3];
        var ProjLocation = ResourceProjectDetails.split("#;")[4];
        var Skill = ResourceProjectDetails.split("#;")[5];
        var RRFNumber = ResourceProjectDetails.split("#;")[6];
        var listName = "RMOAssignmentRefusal";
        var itemType = GetItemTypeForListName(listName);
        var item = {
            __metadata: { "type": itemType },
            RRFNo: RRFNumber,
            ProjectCode: projectCode,
            ProjectName: ProjName,
            SkillWorked: Skill,
            Location: ProjLocation,
            EmployeeID: empID,
            RejectionReason: reason,
            RejectedBy: LoginUserName,
            Comment: Comment
        };

        $.ajax({
            url: "../_api/Web/Lists/GetByTitle('" + listName + "')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                //alert("Insert Refuasal data");
                var EmployeeID_array = [];
                var Employee_Save = "";
                $('#tblResources tbody tr').each(function () {
                    EmployeeID_array.push($(this).find('td:eq(1)')[0].innerText);
                });
                $.each(EmployeeID_array, function (index, employee) {
                    if (employee != empID) {
                        Employee_Save = Employee_Save == "" ? employee : Employee_Save + ";" + employee;
                    }
                });
                var listName = "RMOResourceAllocation";
                var itemType = GetItemTypeForListName(listName);
                var item = {
                    __metadata: { "type": itemType },

                };
                $.extend(item, { ShortlistedResource: Employee_Save });
                //$.extend(item, { AllocatedResource: Employee_Save });
                if (Employee_Save == "") {
                    $.extend(item, { Flag: "" });
                    $.extend(item, { AllocatedResource: "" });
                }
                $.ajax({
                    url: "../_api/Web/Lists/GetByTitle('" + listName + "')/GetItemById('" + resourceListID + "')",
                    type: "POST",
                    async: false,
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(item),
                    headers: {
                        "accept": "application/json;odata=verbose",
                        "Content-Type": "application/json;odata=verbose",
                        "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                        "IF-MATCH": "*",
                        "X-Http-Method": "MERGE"
                    },
                    success: function (data) {
                        //alert("Resource Rejected Successfully");
                        if (Employee_Save == "") {

                            NewpageStatus = "Resource Proposed";
                            var rrfstatus = "";
                            var item = {
                                __metadata: { "type": "SP.Data.RRFItem" }
                            };
                            $.extend(item, { Status: NewpageStatus });
                            $.extend(item, { TATDateTime: currentDate });
                            $.extend(item, { PendingWithId: -1 });

                            $.ajax({
                                url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
                                type: "POST",
                                contentType: "application/json;odata=verbose",
                                data: JSON.stringify(item),
                                async: false,
                                headers: {
                                    "Accept": "application/json;odata=verbose",
                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                    "X-HTTP-Method": "MERGE",
                                    "If-Match": "*"
                                },
                                success: function (data) {
                                    if (pageStatus == "Resource Proposed") {
                                        document.getElementById('RejectMsg').innerHTML = "PM rejected the proposed resource. Check the feedback given and propose another resource.";
                                    } else if (pageStatus == "Resource Selection") {
                                        document.getElementById('RejectMsg').innerHTML = "RMO rejected the resource preferred by PM.";
                                    }
                                    $('.AlertclssPopupHead').text('Rejected Message');
                                    document.getElementById('divMsgProposedResourceFirst').style.display = 'none';
                                    document.getElementById('divMsgSaveValidateResource').style.display = "none";
                                    document.getElementById('divMsgAllocateResource').style.display = 'none';
                                    document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                                    document.getElementById('divMsgOnApprove').style.display = 'none';
                                    document.getElementById('divMsgOnreject').style.display = 'block';
                                    $('.Alertpopup-bg').show();


                                },
                                error: function (error) {
                                    alert(JSON.stringify(error));
                                }
                            });
                        } else {
                            if (pageStatus == "Resource Proposed") {
                                document.getElementById('RejectMsg').innerHTML = "PM rejected the proposed resource. Check the feedback given and propose another resource.";
                            } else if (pageStatus == "Resource Selection") {
                                document.getElementById('RejectMsg').innerHTML = "RMO rejected the resource preferred by PM.";
                            }
                            $('.AlertclssPopupHead').text('Rejected Message');
                            document.getElementById('divMsgProposedResourceFirst').style.display = 'none';
                            document.getElementById('divMsgSaveValidateResource').style.display = "none";
                            document.getElementById('divMsgAllocateResource').style.display = 'none';
                            document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                            document.getElementById('divMsgOnApprove').style.display = 'none';
                            document.getElementById('divMsgOnreject').style.display = 'block';
                            $('.Alertpopup-bg').show();

                        }

                    },
                    error: function (error) {
                        //alert(JSON.stringify(error));
                    }
                });
            },
            error: function (error) {
                //alert(JSON.stringify(error));
            }
        });
    }
}
function ResourcesCommentSubmit() {
    var comment = document.getElementById('TextareaResourceComment').value;
    if (comment == "") {
        $('#TextareaResourceComment').css({

            "border": "1px solid red",
            "background": "#FFCECE"
        });

        document.getElementById("errorMsgComment").innerHTML = "Please Enter the Comment";
        document.getElementById("TextareaResourceComment").focus();
        return false;
    }
    else {
        var match = (new RegExp('[~#%\&{}+\|]|\\\\|^\\|\\$')).test(comment);
        if (match) {
            return false;

        } else {

            $('#TextareaResourceComment').css({
                "border": "",
                "background": ""
            });
            document.getElementById("errorMsgComment").innerHTML = "";
            var data = document.getElementById('resourceCommentSpan').innerHTML;
            var rrfNumeber = data.split('#')[0];
            var resourceId = data.split('#')[1];
            insertProjectComment(comment, "", rrfNumeber, resourceId);
        }
    }
}
function validReason() {
    var reason = document.getElementById('ddlRejectionReason').value;
    if (reason != "" || reason != "0") {
        document.getElementById("errorMsgddlReason").innerHTML = "";
        if (reason == "Additional Comments") {
            $('#TextareaResourceReject').prop({
                'disabled': false
            });
        } else {
            $('#TextareaResourceReject').prop({
                'disabled': true
            });
        }
    }
}
function findProjectCode(index) {
    var last_i = index;
    var strt_i = 0;
    if (last_i == "1") {
        strt_i = 0;
        last_i = parseInt(RRFFormLength);
    } else {
        last_i = parseInt(last_i) * parseInt(RRFFormLength);
        strt_i = last_i - parseInt(RRFFormLength);
    }

    for (var i = strt_i; i < last_i; i++) { //changes by varsha 12-sep
        if (i < RRF_Table.page.info().recordsTotal) {
            if (pageStatus == "allrecord") {
                if (RRF_Table.rows().nodes()[i].childNodes[9].innerHTML != "External Hiring" && RRF_Table.rows().nodes()[i].childNodes[9].innerHTML != "Offer") {
                    //var ProjectCode = RRF_Table.rows().nodes()[i].id;
                    // ProjectCode = ProjectCode.split('#')[1];
                    var ParameterVal = indecator_Parameter[i];
                    var PSkill = ParameterVal.split('#')[2];
                    var SSkill = ParameterVal.split('#')[3];
                    var RBand = ParameterVal.split('#')[4];
                    if ((PSkill != "null" || SSkill != "null") && RBand != "null") {
                        bindIndicatorsValue(PSkill, SSkill, RBand, i);
                    }
                }
            } else if (pageStatus != "externalhiring") {
                //var ProjectCode = RRF_Table.rows().nodes()[i].id;
                //ProjectCode = ProjectCode.split('#')[1];
                //if (ProjectCode != null && ProjectCode != "0" && ProjectCode != 0 && ProjectCode != "null") {
                //    bindIndicatorsValue(ProjectCode, i);
                //}
                var ParameterVal = indecator_Parameter[i];
                var PSkill = ParameterVal.split('#')[2];
                var SSkill = ParameterVal.split('#')[3];
                var RBand = ParameterVal.split('#')[4];
                if ((PSkill != "null" || SSkill != "null") && RBand != "null") {
                    bindIndicatorsValue(PSkill, SSkill, RBand, i);
                }
            }
        }
    }
}
function bindIndicatorsValue(PrimarySkill, SecondarySkill, RoleBand, count) {

    var url = EmployeeAvailability(); //"https://ppmdev.bcone.com/api/RMO/EmployeeAvailability";
    //url = "https://ppmdev.bcone.com/api/RMO/EmployeeAvailability";
    requestData = "{\"PrimarySkills\":\"" + PrimarySkill + "\",\"SecondarySkills\":\"" + SecondarySkill + "\",\"RoleBand\":\"" + RoleBand + "\"}";
    $.ajax({

        url: url,
        method: "POST",
        data: requestData,
        async: false,
        dataType: "json",
        headers:
        {
            "content-Type": "application/json"
        },
        success: function (data) {
            TotalCount = data.EmployeeAvailability[0].Total;
            BookedCount = data.EmployeeAvailability[2].Booked;
            FreeCount = data.EmployeeAvailability[1].Free;

            var total_id = "Total" + count;
            var booked_id = "Booked" + count;
            var free_id = "Free" + count;

            $('#RRFForm tbody tr td').find("#" + total_id).text(TotalCount);
            $('#RRFForm tbody tr td').find("#" + booked_id).text(BookedCount);
            $('#RRFForm tbody tr td').find("#" + free_id).text(FreeCount);

        }
    });
}

function refreshData(element) {
    if (pageStatus != "External Hiring" && pageStatus != "Offer" && pageStatus != "externalhiring") { //changes by varsha 12-sep
        $(this).addClass('refresh');
        setTimeout(function () {
            var ProjectGUID = element.parentNode.parentNode.parentNode.parentNode.id.split('#')[1];
            var Total = element.parentNode.children[0].id;
            var Free = element.parentNode.children[1].id;
            var Booked = element.parentNode.children[2].id;
            var indexVal = element.parentNode.parentNode.parentNode.id;
            var ParameterVal = indecator_Parameter[indexVal];
            var PSkill = ParameterVal.split('#')[2];
            var SSkill = ParameterVal.split('#')[3];
            var RBand = ParameterVal.split('#')[4];

            var url = EmployeeAvailability(); //"https://ppmdev.bcone.com/api/RMO/EmployeeAvailability";
            if ((PSkill != "null" || SSkill != "null") && RBand != "null") {
                requestData = "{\"PrimarySkills\":\"" + PSkill + "\",\"SecondarySkills\":\"" + SSkill + "\",\"RoleBand\":\"" + RBand + "\"}";
                $.ajax({

                    url: url,
                    method: "POST",
                    data: requestData,
                    async: false,
                    dataType: "json",
                    headers:
                    {
                        "content-Type": "application/json"
                    },
                    success: function (data) {
                        TotalCount = data.EmployeeAvailability[0].Total;
                        BookedCount = data.EmployeeAvailability[2].Booked;
                        FreeCount = data.EmployeeAvailability[1].Free;

                        $('#RRFForm tbody tr td').find("#" + Total).text(TotalCount);
                        $('#RRFForm tbody tr td').find("#" + Booked).text(BookedCount);
                        $('#RRFForm tbody tr td').find("#" + Free).text(FreeCount);
                        jQuery('ul').children().removeClass('refresh');
                    }
                });
            }
        }, 100);

    }

}

//code to find project allocation details based on resource
function findprojectAllocationDetails(projectCode, EmployeeID) {
    url = GetProjectWiseResourceAllocation(ProjectCode, empId);  //"https://ppmdev.bcone.com/_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq'" + projectCode + "' and EmployeeID eq'" + EmployeeID + "'";
    var details = "";

    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                var allocationPercent = data.d.results[0].Allocation;
                var srtDate = getFormatDate(data.d.results[0].Start);
                var endDate = getFormatDate(data.d.results[0].Finish);
                details = allocationPercent + ";" + srtDate + ";" + endDate;
            }
        }
    });
    return details;
}
//code to format date
function getFormatDate(date) {
    if (date != null && date != "") {
        var year = date.toString().substring(0, 4);
        var month = GetMonthName(date.toString().substring(4, 6));
        var date = date.toString().substring(6, 8);
        var formatDate = date + '-' + month + '-' + year;
        return formatDate;
    }
}


function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.slice(1) + "ListItem";
}

//code to bind new Resource information div
function BindResourceInfoDiv() {

    var divHtml = "<div class='AddResource' id='maindiv" + txtidIndex + "'><div class='col-md-3'><label>Allocation%</label></div><div class='col-md-3'><input type='text' id='txtAllocation" + txtidIndex + "' class='form-control mx-sm-3 classAllocation' onkeyup='removeErrorMsgResourceAssignment()'><div id='errtxtAllocation" + txtidIndex + "' class='error'>Allocation % is required</div></div><div class='col-md-3'><label>Employee Role</label></div><div class='col-md-3'><input id='txtEmployeeRole" + txtidIndex + "' class='form-control mx-sm-3 txtEmployeeRole' readonly='readonly'></input><div id='errddlBillability" + txtidIndex + "' class='error'>Employee Role is required</div></div><div class='clear'></div><div class='col-md-3'><label>Start Date</label></div><div class='col-md-3'><div class='date'><input type='text' id='txtstrtDt" + txtidIndex + "' class='form-control mx-sm-3 strtDt' onselect='removeErrorMsgResourceAssignment()'></div><div id='errtxtstrtDt" + txtidIndex + "' class='error'>Start date is required</div></div><div class='col-md-3'><label>End Date</label></div><div class='col-md-3'><div class='date'><input type='text' id='txtendDt" + txtidIndex + "' class='form-control mx-sm-3 endDt' onselect='removeErrorMsgResourceAssignment()'></div><div id='errtxtendDt" + txtidIndex + "' class='error'>End date is required</div></div><div class='clear'></div><div class='col-md-3'><label>Type Of Assignment</label></div><div class='col-md-4'><select id='selectAssignment" + txtidIndex + "' class='form-control mx-sm-3'><option value='BCONE LOCATION'>BCONE LOCATION</option><option value='CLIENT LOCATION'>CLIENT LOCATION</option><option value='Both'>Both</option></select></div><div class='col-md-5 action'><input type='button' class='btn btn-primary' id='btncheckAvailbility" + txtidIndex + "' value='Check Availability' onclick='checkResourceAvailbility(this);'/><a href='#'><span class='glyphicon glyphicon-ok-sign' id='Availabilitysign' style='display:none'></span><span id='Availabilityvalue" + txtidIndex + "' style='visibility:hidden'></span></a><div id='AvailbilityErrMsg" + txtidIndex + "' class='error' style='font-size: 11px;'>Please check Resource Availbility</div></div><div class='clear'></div></div>"
    if (txtidIndex > 0) {
        var divId = txtidIndex - 1;
        $(divHtml).insertAfter("#maindiv" + divId);
    } else {
        $(divHtml).insertAfter("#ResourceInformation");
    }
    if (txtidIndex >= 0) {
        document.getElementById('removeaddResource').style.display = 'inline-block';
    }
    txtidIndex++;
}
//code to remove resource informaition div
function RemoveResourceInfoDiv() {
    txtidIndex--;
    $('#maindiv' + txtidIndex).remove();
    if (txtidIndex < 1) {
        document.getElementById('removeaddResource').style.display = 'none';
    }
}

function convert_date_DDMMYYYY(date_to_convert) {
    var arr_dateandtime = date_to_convert.split('T');
    var arr_dateonly = arr_dateandtime[0].split('-');
    var MonthName = GetMonthName(arr_dateonly[1]);
    converted_date = arr_dateonly[2] + "-" + MonthName + "-" + arr_dateonly[0];
    return converted_date;
}

function GetMonthName(monthNumber) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1];
}


//code to save RRF Save Resources
function RRFSaveResource(ResourceEmpID) {
    if (pageStatus == "RRF Saved" || pageStatus == "RMO Validation" || pageStatus == "Resource Proposed" || pageStatus == "Resource Selection") {
        var selectedEmployeeID = "";
        var SaveFlag = "";
        var RRFNumber = $('.clssPopupHead')[0].innerText.split(' :')[0];
        //$('#tblResources tbody tr').each(function () {
        //    if ($(this).find('td:eq(0) input').prop('checked') == true) {
        //        selectedEmployeeID = selectedEmployeeID == "" ? $(this).find('td:eq(1)')[0].innerText : selectedEmployeeID + ";" + $(this).find('td:eq(1)')[0].innerText;
        //    }
        //});

        var childCheckboxes = ResourceTable.rows().nodes().to$('#tblResources tbody tr td').find('input[type=checkbox]');
        var no_checked = childCheckboxes.filter(':checked').each(function () { });
        for (var index = 0; index < no_checked.length; index++) {
            if (selectedEmployeeID == "") {
                selectedEmployeeID = no_checked[index].parentNode.parentNode.firstElementChild.nextSibling.innerText;
            }
            else {
                selectedEmployeeID = selectedEmployeeID + ";" + no_checked[index].parentNode.parentNode.firstElementChild.nextSibling.innerText;
            }
        }
        var listName = "RMOResourceAllocation";
        var itemType = GetItemTypeForListName(listName);
        var item = {
            __metadata: { "type": itemType },
            RRFNumber: RRFNumber
        };

        if (pageStatus == "RRF Saved") {
            $.extend(item, { suggestedResource: selectedEmployeeID });
            $.extend(item, { ShortlistedResource: selectedEmployeeID });
        } else if (pageStatus == "RMO Validation") {
            $.extend(item, { ShortlistedResource: selectedEmployeeID });
            //$.extend(item, { AllocatedResource: selectedEmployeeID });
        } else if (pageStatus == "Resource Proposed") {
            if (ResourceAllocationFlag == null) {
                $.extend(item, { ShortlistedResource: selectedEmployeeID });
                $.extend(item, { Flag: "1" });
                SaveFlag = "1";
            } else if (ResourceAllocationFlag == "1") {
                if (ResourceEmpID != "") {
                    selectedEmployeeID = ResourceEmpID;
                }
                $.extend(item, { AllocatedResource: selectedEmployeeID });
                $.extend(item, { Flag: "2" });
            }
        } else if (pageStatus = "Resource Selection") {
            $.extend(item, { AllocatedResource: selectedEmployeeID });
        }

        if (resourceRRFCount > 0) {
            $.ajax({
                url: "../_api/Web/Lists/GetByTitle('" + listName + "')/GetItemById('" + resourceListID + "')",
                type: "POST",
                async: false,
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "IF-MATCH": "*",
                    "X-Http-Method": "MERGE"
                },
                success: function (data) {
                    if (ResourceAllocationFlag == "1") {
                        NewpageStatus = "Resource Selection";
                        var rrfstatus = "";
                        var item = {
                            __metadata: { "type": "SP.Data.RRFItem" }
                        };
                        $.extend(item, { Status: NewpageStatus });
                        $.extend(item, { PendingWithId: -1 });
                        $.extend(item, { TATDateTime: currentDate });
                        $.extend(item, { ResourceProposedFlag: 2 });
                        $.ajax({
                            url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            data: JSON.stringify(item),
                            async: false,
                            headers: {
                                "Accept": "application/json;odata=verbose",
                                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                "X-HTTP-Method": "MERGE",
                                "If-Match": "*"
                            },
                            success: function (data) {
                                $('.AlertclssPopupHead').text('Sucess');
                                document.getElementById('divMsgAllocateResource').style.display = 'none';
                                document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                                document.getElementById('divMsgOnreject').style.display = 'none';
                                document.getElementById('divMsgSaveValidateResource').style.display = "none";
                                document.getElementById('divMsgProposedResourceFirst').style.display = "none";
                                document.getElementById('divMsgOnApprove').style.display = 'block';
                                $('.Alertpopup-bg').show();
                            },
                            error: function (error) {
                                alert(JSON.stringify(error));
                            }
                        });
                    }
                    else if (SaveFlag == "1" && ResourceAllocationFlag == null) {
                        updateRRF("3");
                    }
                    if (pageStatus == "RMO Validation") {
                        $('.AlertclssPopupHead').text('Sucess');
                        document.getElementById('divMsgOnreject').style.display = 'none';
                        document.getElementById('divMsgOnApprove').style.display = 'none';
                        document.getElementById('divMsgAllocateResource').style.display = 'none';
                        document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                        document.getElementById('divMsgProposedResourceFirst').style.display = "none";
                        document.getElementById('divMsgSaveValidateResource').style.display = 'block';
                        $('.Alertpopup-bg').show();
                    }
                    if (pageStatus == "Resource Proposed") {
                        if (ResourceAllocationFlag == "1") {
                            document.getElementById('propsedMsg').innerHTML = "PM approved the proposed resource. Check the feedback given and allocate as per RRF.";
                        } else {
                            document.getElementById('propsedMsg').innerHTML = "RMO softblocked the selected resources successfully";
                        }
                        $('.AlertclssPopupHead').text('Sucess');
                        document.getElementById('divMsgOnreject').style.display = 'none';
                        document.getElementById('divMsgOnApprove').style.display = 'none';
                        document.getElementById('divMsgAllocateResource').style.display = 'none';
                        document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                        document.getElementById('divMsgSaveValidateResource').style.display = 'none';
                        document.getElementById('divMsgProposedResourceFirst').style.display = 'block';
                        $('.Alertpopup-bg').show();
                    }
                },
                error: function (error) {
                    //alert(JSON.stringify(error));
                }
            });

        } else {
            $.ajax({
                url: "../_api/Web/Lists/GetByTitle('" + listName + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    if (pageStatus == "RMO Validation") {
                        $('.AlertclssPopupHead').text('Sucess');
                        document.getElementById('divMsgOnreject').style.display = 'none';
                        document.getElementById('divMsgOnApprove').style.display = 'none';
                        document.getElementById('divMsgAllocateResource').style.display = 'none';
                        document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                        document.getElementById('divMsgProposedResourceFirst').style.display = "none";
                        document.getElementById('divMsgSaveValidateResource').style.display = 'block';
                        $('.Alertpopup-bg').show();
                    }
                    //alert("Insert");
                },
                error: function (error) {
                    //alert(JSON.stringify(error));
                }
            });
        }
    }
}

function bindcheckedResources(RRFNumber) {
    $("#slectedResource").empty();
    //code to display Saved record
    var dataurl = "../_api/web/lists/getbytitle('RMOResourceAllocation')/items?$filter=RRFNumber eq'" + RRFNumber + "'";
    $.ajax({
        url: dataurl,
        async: false,
        type: "GET",
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            resourceRRFCount = data.d.results.length;
            var SeletedEmployeeID = "";
            if (resourceRRFCount > 0) {
                var dataset = data.d.results[0];
                resourceListID = dataset.ID;
                if (pageStatus == "RRF Saved") {
                    SeletedEmployeeID = dataset.suggestedResource.split(';');
                } else if (pageStatus == "RMO Validation") {
                    SeletedEmployeeID = dataset.ShortlistedResource.split(';');

                } else if (pageStatus == "Resource Proposed") {
                    SeletedEmployeeID = dataset.ShortlistedResource.split(';'); // Changes done on 30-8-2017 

                } else if (pageStatus == "Resource Selection") {
                    SeletedEmployeeID = dataset.AllocatedResource.split(';');

                } else if (pageStatus == "Fulfilled") {
                    SeletedEmployeeID = dataset.AllocatedResource.split(';');
                }
                $.each(SeletedEmployeeID, function (key, value) {

                    var childCheckboxes = ResourceTable.rows().nodes().to$('#tblResources tbody tr td').find('input[type=checkbox]');
                    if (childCheckboxes.length > 0) {
                        for (var index = 0; index < childCheckboxes.length; index++) {
                            if (childCheckboxes[index].parentNode.parentNode.firstElementChild.nextSibling.innerText == value) {
                                childCheckboxes[index].defaultChecked = true;

                                var name = childCheckboxes[index].parentNode.parentNode.childNodes[2].innerText.split('Project')[0];
                                var logDeatils = '<li>' + value + ' | ' + name + '</li>';
                                $("#slectedResource").append(logDeatils);
                            }

                        }
                    } else {
                        $('#tblResources tbody tr').each(function () {
                            //var abc = $(this).find('td:eq(1)')[0].innerText;
                            if ($(this).find('td:eq(1)')[0].innerText == value) {
                                var name = $(this).find('td:eq(2)')[0].innerText.split('Project')[0];
                                var logDeatils = '<li>' + value + ' | ' + name + '</li>';
                                $("#slectedResource").append(logDeatils);
                            }
                        });

                    }
                });
            } else {
                $('#tblResources tbody tr').each(function () {
                    $(this).find('td:eq(0) input').prop('checked', false);
                });
            }

        },
        complete: function () {

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}
//code to save RRF Selection Proposed
function ResourceApproveForSelection() {
    var empID = document.getElementById('empIdResourceSelection').innerHTML;
    insertProjectComment("", "1", "", "");
    RRFSaveResource(empID);
}

//Code to move RRF to External hiring 
function ExternalPopUp(element) {
    RRFRowID = element.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[0];
    pageStatus = element.id.split('#;')[5]; // Page Status //element.parentNode.parentNode.parentNode.parentNode.parentNode.cells[9].innerText;
    var RequimentPercentage = element.id.split('#;')[3];
    EmployeeRole = element.id.split('#;')[4];
    if (RequimentPercentage == "100") {
        var Flag = "4";
        $('.loader').show();
        setTimeout(function () {
            updateRRF(Flag);
            $('.popup-bg').show();
            $('.clssPopupHead').text('External Hiring has been initiated');
            $('#divExternalMsg').css('display', 'block');
            document.getElementById('divRejectBody').style.display = "none";
            document.getElementById('divComment').style.display = "none";
            document.getElementById('divSearchResource').style.display = "none";
            document.getElementById('divViewLog').style.display = "none";
            $('.loader').hide();
        }, 100);

    }
    else {
        $('.popup-bg').show();
        $('.clssPopupHead').text('Please ensure to have the requirement 100%, to initiate external hiring');
        $('#divExternalMsg').css('display', 'block');
        document.getElementById('divRejectBody').style.display = "none";
        document.getElementById('divComment').style.display = "none";
        document.getElementById('divSearchResource').style.display = "none";
        document.getElementById('divViewLog').style.display = "none";
    }
}
//bind selected resource id
function bindSelectedResourceData() {
    var resourceID = $("#ddlResourceName option:selected").attr('data-value');
    document.getElementById('txtResourceID').value = resourceID
}
//code to save resource after assigned in RRF
function SaveResourceassignment() {
    var resourceFlag = 0;
    if (validateResourceAssignementData()) {
        var projectCode = document.getElementById('txtProjectCode').value;
        var projectName = document.getElementById('txtProjectName').value;
        var projecManager = document.getElementById('txtProjectManager').value;
        var clientPartner = document.getElementById('txtclientPertner').value;
        var resourceManager = document.getElementById('txtResourcemanager').value;
        var ProjectLoaction = document.getElementById('txtPLocation').value;
        var resourceAllocation = document.getElementById('txtAllocation').value;
        var EmployeeRole = document.getElementById('txtEmployeeRole').value;
        var startDate = $('#txtstrtDt').datepicker("getDate").format("yyyy-MM-dd");
        startDate = getformateDateForSave(startDate);
        // startDate = startDate.substring(0, 19);
        var endDate = $('#txtendDt').datepicker("getDate").format("yyyy-MM-dd");
        endDate = getformateDateForSave(endDate);
        // endDate = endDate.substring(0, 19);
        var assignmentType = document.getElementById('ddlAssignmentTyp').value;
        var spandata = document.getElementById('rrfnumber').innerHTML;
        var RRFNumber = spandata.split(';')[0];
        var resourceName = spandata.split(';')[1];
        var resourceID = spandata.split(';')[2];
        var designation = spandata.split(';')[3];
        var status = spandata.split(';')[4];
        var employee_email = spandata.split(';')[5];
        var PrimarySkill = spandata.split(';')[6];
        var emailId = document.getElementById('txtAdditionalEmail').value;
        var Note = document.getElementById('TextareaResourceNote').value;
        var getactiveflagData = getActiveByResourceWiseProjectAllocation(projectCode, resourceID);
        var ResourceAllUrl = ProjectWiseAllocation();
        var flagvalue = "Internal";
        var result = InserdataProjectwiseResourceallocation(projectCode, projectName, resourceName, resourceID, startDate, endDate, resourceAllocation, ProjectLoaction, resourceManager, projecManager, flagvalue, PrimarySkill)
        if (result == "Inserted") {
            var listName = "RMOResourceAssignment";
            var itemType = GetItemTypeForListName(listName);
            var item = {
                __metadata: { "type": itemType },

                ProjectCode: projectCode,
                ProjectName: projectName,
                RRFNumber: RRFNumber,
            };
            $.extend(item, { ProjectManager: projecManager });
            $.extend(item, { ClientPartner: clientPartner });
            $.extend(item, { ResourceManager: resourceManager });
            $.extend(item, { ProjectLoaction: ProjectLoaction });
            $.extend(item, { ResourceName: resourceName });
            $.extend(item, { ResourceID: resourceID });
            $.extend(item, { AllocationPercent: resourceAllocation });
            $.extend(item, { Billability: EmployeeRole });
            $.extend(item, { StartDate: startDate });
            $.extend(item, { EndDate: endDate });
            $.extend(item, { TypeofAssignment: assignmentType });
            $.extend(item, { AdditionalEmail: emailId });
            $.extend(item, { Note: Note });
            $.extend(item, { Designation: designation });
            $.extend(item, { Employee_status: status });
            $.extend(item, { ResourceEmailID: employee_email });
            $.ajax({
                url: "../_api/Web/Lists/GetByTitle('" + listName + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),

                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    //alert('Resource Allocated Successfully');
                    if (txtidIndex == 0) {
                        //var RRFRowID = "1307";
                        var resourcesharepointId = getSharePointUserID(employee_email);
                        resourcesharepointId = parseInt(resourcesharepointId.split('#')[0]);
                        var item = {
                            __metadata: { "type": "SP.Data.RRFItem" }
                        };
                        $.extend(item, { Status: "Fulfilled" });
                        $.extend(item, { ResourceAgainstRRFInWDId: resourcesharepointId });
                        $.extend(item, { TATDateTime: currentDate });
                        $.ajax({
                            url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
                            type: "POST",
                            contentType: "application/json;odata=verbose",
                            data: JSON.stringify(item),
                            async: false,
                            headers: {
                                "Accept": "application/json;odata=verbose",
                                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                "X-HTTP-Method": "MERGE",
                                "If-Match": "*"
                            },
                            success: function (data) {
                                insertProjectComment("", "1", "", "");
                                //alert('Resource Allocated Successfully');
                                // $('.popup-bg').hide();
                                $('.AlertclssPopupHead').text('Sucess');
                                document.getElementById('divMsgOnreject').style.display = 'none';
                                document.getElementById('divMsgOnApprove').style.display = 'none';
                                document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                                document.getElementById('divMsgSaveValidateResource').style.display = "none";
                                document.getElementById('divMsgProposedResourceFirst').style.display = "none";
                                document.getElementById('divMsgAllocateResource').style.display = 'block';

                                $('.Alertpopup-bg').show();

                            },
                            error: function (error) {
                                alert(JSON.stringify(error));
                            }
                        });
                    }
                    if (txtidIndex > 0) {
                        for (var z = 0; z < txtidIndex; z++) {
                            projectCode = document.getElementById('txtProjectCode').value;
                            projectName = document.getElementById('txtProjectName').value;
                            projecManager = document.getElementById('txtProjectManager').value;
                            clientPartner = document.getElementById('txtclientPertner').value;
                            resourceManager = document.getElementById('txtResourcemanager').value;
                            ProjectLoaction = document.getElementById('txtPLocation').value;

                            resourceAllocation = document.getElementById('txtAllocation' + z).value;
                            EmployeeRole = document.getElementById('txtEmployeeRole' + z).value;
                            startDate = $('#txtstrtDt' + z).datepicker("getDate").format("yyyy-MM-dd");
                            startDate = getformateDateForSave(startDate);
                            //startDate = startDate.substring(0, 19);
                            endDate = $('#txtendDt' + z).datepicker("getDate").format("yyyy-MM-dd");
                            endDate = getformateDateForSave(endDate);
                            // endDate = endDate.substring(0, 19);
                            assignmentType = document.getElementById('selectAssignment' + z).value;

                            emailId = document.getElementById('txtAdditionalEmail').value;
                            Note = document.getElementById('TextareaResourceNote').value;
                            var result = InserdataProjectwiseResourceallocation(projectCode, projectName, resourceName, resourceID, startDate, endDate, resourceAllocation, ProjectLoaction, resourceManager, projecManager, flagvalue, PrimarySkill)
                            if (result == "Inserted") {
                                // alert('added successfully');
                                var listName = "RMOResourceAssignment";
                                var itemType = GetItemTypeForListName(listName);
                                var item = {
                                    __metadata: { "type": itemType },

                                    ProjectCode: projectCode,
                                    ProjectName: projectName,
                                    RRFNumber: RRFNumber,
                                };
                                $.extend(item, { ProjectManager: projecManager });
                                $.extend(item, { ClientPartner: clientPartner });
                                $.extend(item, { ResourceManager: resourceManager });
                                $.extend(item, { ProjectLoaction: ProjectLoaction });
                                $.extend(item, { ResourceName: resourceName });
                                $.extend(item, { ResourceID: resourceID });
                                $.extend(item, { AllocationPercent: resourceAllocation });
                                $.extend(item, { Billability: EmployeeRole });
                                $.extend(item, { StartDate: startDate });
                                $.extend(item, { EndDate: endDate });
                                $.extend(item, { TypeofAssignment: assignmentType });
                                $.extend(item, { AdditionalEmail: emailId });
                                $.extend(item, { Note: Note });
                                $.extend(item, { Designation: designation });
                                $.extend(item, { Employee_status: status });
                                $.extend(item, { ResourceEmailID: employee_email });
                                $.ajax({
                                    url: "../_api/Web/Lists/GetByTitle('" + listName + "')/items",
                                    type: "POST",
                                    contentType: "application/json;odata=verbose",
                                    data: JSON.stringify(item),

                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "X-RequestDigest": $("#__REQUESTDIGEST").val()
                                    },
                                    success: function (data) {
                                        resourceFlag++;
                                        if (resourceFlag == txtidIndex) {
                                            //var RRFRowID = "1307";
                                            var resourcesharepointId = getSharePointUserID(employee_email);
                                            resourcesharepointId = parseInt(resourcesharepointId.split('#')[0]);
                                            var item = {
                                                __metadata: { "type": "SP.Data.RRFItem" }
                                            };
                                            $.extend(item, { Status: "Fulfilled" });
                                            $.extend(item, { ResourceAgainstRRFInWDId: resourcesharepointId });
                                            $.extend(item, { TATDateTime: currentDate });
                                            $.ajax({
                                                url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
                                                type: "POST",
                                                contentType: "application/json;odata=verbose",
                                                data: JSON.stringify(item),
                                                async: false,
                                                headers: {
                                                    "Accept": "application/json;odata=verbose",
                                                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                                                    "X-HTTP-Method": "MERGE",
                                                    "If-Match": "*"
                                                },
                                                success: function (data) {
                                                    insertProjectComment("", "1", "", "");
                                                    //alert('Resource Allocated Successfully');
                                                    $('.AlertclssPopupHead').text('Sucess');
                                                    document.getElementById('divMsgOnreject').style.display = 'none';
                                                    document.getElementById('divMsgOnApprove').style.display = 'none';
                                                    document.getElementById('divMsgExternalAlloctaion').style.display = 'none';
                                                    document.getElementById('divMsgSaveValidateResource').style.display = "none";
                                                    document.getElementById('divMsgProposedResourceFirst').style.display = "none";
                                                    document.getElementById('divMsgAllocateResource').style.display = 'block';
                                                    $('.Alertpopup-bg').show();
                                                },
                                                error: function (error) {
                                                    alert(JSON.stringify(error));
                                                }
                                            });
                                        }
                                    },
                                    error: function (error) {
                                        //alert(JSON.stringify(error));
                                    }
                                });
                            }
                        }
                    }
                },
                error: function (error) {
                    //alert(JSON.stringify(error));
                }
            });
        }


    }
}

function checkResourceAvailbility(event) {
    if (removeErrorMsgResourceAssignment()) {
        var Employee_ID = document.getElementById('rrfnumber').innerHTML.split(';')[2];
        //Employee_ID = "10062";
        var projectStartdate = "";
        var projectEnddate = "";
        var Allocationvalue = "";
        if (event.parentNode.parentNode.childNodes.length == 14) {
            var projectStrtdateID = event.parentNode.parentNode.childNodes[6].firstElementChild.firstElementChild.id;
            projectStrtdate = $('#' + projectStrtdateID).datepicker("getDate");
            projectStrtdate.setDate(projectStrtdate.getDate() + 1);
            projectStrtdate = projectStrtdate.toISOString();
            projectStrtdate = projectStrtdate != "" ? projectStrtdate.substring(0, 19) : "";
            var ProjectEnddateID = event.parentNode.parentNode.childNodes[8].firstElementChild.firstElementChild.id;
            projectEnddate = $('#' + ProjectEnddateID).datepicker("getDate");
            projectEnddate.setDate(projectEnddate.getDate() + 1);
            projectEnddate = projectEnddate.toISOString();
            projectEnddate = projectEnddate != "" ? projectEnddate.substring(0, 19) : "";
            Allocationvalue = event.parentNode.parentNode.childNodes[1].firstElementChild.value;
            if (projectStrtdate != "" && Allocationvalue != "" && projectEnddate != "") {
                var result = searchresourceAllocationPercent(Employee_ID, projectStrtdate, projectEnddate, Allocationvalue);
                if (result.length > 0) {
                    ResourceAvailbilityCount++;
                    event.parentNode.parentNode.childNodes[12].childNodes[1].lastElementChild.innerHTML = "1";
                    event.parentNode.parentNode.childNodes[12].childNodes[2].style.display = "none"
                    event.parentNode.parentNode.childNodes[12].childNodes[1].firstElementChild.style.display = 'inline-block';
                } else {
                    event.parentNode.parentNode.childNodes[12].childNodes[1].lastElementChild.innerHTML = "";
                    event.parentNode.parentNode.childNodes[12].childNodes[1].firstElementChild.style.display = 'none';
                    event.parentNode.parentNode.childNodes[12].childNodes[2].innerHTML = "Resource is not Available";
                    event.parentNode.parentNode.childNodes[12].childNodes[2].style.display = "block";
                }

            } else {
                event.parentNode.parentNode.childNodes[12].childNodes[1].firstElementChild.style.display = 'none';
                if (Allocationvalue == "") {
                    event.parentNode.parentNode.childNodes[1].lastElementChild.style.display = 'block';
                    return false;
                } else if (projectStrtdate == "") {
                    event.parentNode.parentNode.childNodes[6].firstElementChild.nextElementSibling.style.display = 'block'
                    return false;
                } else if (projectEnddate == "") {
                    event.parentNode.parentNode.childNodes[8].firstElementChild.nextElementSibling.innerHTML = "End date is required";
                    event.parentNode.parentNode.childNodes[8].firstElementChild.nextElementSibling.style.display = 'block'
                    return false;
                }
            }
        } else {
            var projectStrtdateID = event.parentNode.parentNode.childNodes[13].firstElementChild.firstElementChild.id;
            projectStrtdate = $('#' + projectStrtdateID).datepicker("getDate");
            projectStrtdate.setDate(projectStrtdate.getDate() + 1);
            projectStrtdate = projectStrtdate.toISOString();
            projectStrtdate = projectStrtdate != "" ? projectStrtdate.substring(0, 19) : "";
            var ProjectEnddateID = event.parentNode.parentNode.childNodes[17].firstElementChild.firstElementChild.id;
            projectEnddate = $('#' + ProjectEnddateID).datepicker("getDate");//.toISOString();
            projectEnddate.setDate(projectEnddate.getDate() + 1);
            projectEnddate = projectEnddate.toISOString();
            projectEnddate = projectEnddate != "" ? projectEnddate.substring(0, 19) : "";
            Allocationvalue = event.parentNode.parentNode.childNodes[3].firstElementChild.value;
            if (projectStrtdate != "" && Allocationvalue != "" && projectEnddate != "") {
                var result = searchresourceAllocationPercent(Employee_ID, projectStrtdate, projectEnddate, Allocationvalue);
                if (result.length > 0) {
                    ResourceAvailbilityCount++;
                    event.parentNode.parentNode.childNodes[25].childNodes[3].lastElementChild.innerHTML = "1";
                    event.parentNode.parentNode.childNodes[25].childNodes[9].style.display = "none"
                    event.parentNode.parentNode.childNodes[25].childNodes[3].firstElementChild.style.display = "inline-block";
                } else {
                    event.parentNode.parentNode.childNodes[25].childNodes[3].lastElementChild.innerHTML = "";
                    event.parentNode.parentNode.childNodes[25].childNodes[3].firstElementChild.style.display = "none";
                    event.parentNode.parentNode.childNodes[25].childNodes[9].innerHTML = "Resource is not Available";
                    event.parentNode.parentNode.childNodes[25].childNodes[9].style.display = "block";
                }
            } else {
                if (Allocationvalue == "") {
                    event.parentNode.parentNode.childNodes[3].lastElementChild.style.display = 'block';
                    return false;
                } else if (projectStrtdate == "") {
                    event.parentNode.parentNode.childNodes[13].firstElementChild.nextElementSibling.style.display = 'block'
                    return false;
                } else if (projectEnddate == "") {
                    event.parentNode.parentNode.childNodes[17].firstElementChild.nextElementSibling.innerHTML = "End date is required"
                    event.parentNode.parentNode.childNodes[17].firstElementChild.nextElementSibling.style.display = 'block'
                    return false;
                }
            }
        }
    }
}
function removeErrorMsgResourceAssignment() {
    var formatedProjectEndDate = convert_date_DDMMYYYY(projectEnddate);
    if (softblockFlag == "1") {
        if (document.getElementById('sftblckstartDt').value != "") {
            $('#errsftblckstartDt').css('display', 'none');
        }
        if (document.getElementById('sftblckendDt').value != "") {
            $('#errsftblckendDt').css('display', 'none');
        }

    } else {

        var projectEndDateTemp = Date.parse(projectEnddate);
        if (document.getElementById('txtAllocation').value != "") {

            var allocationVal = document.getElementById('txtAllocation').value;
            allocationVal = parseInt(allocationVal);
            if (allocationVal > 100 || allocationVal == 0) {
                document.getElementById('errtxtAllocation').innerHTML = 'Allocation % should be between 1-100';
                $('#errtxtAllocation').css('display', 'block');
                return false;
            } else {
                $('#errtxtAllocation').css('display', 'none');
            }
        }
        if (document.getElementById('txtEmployeeRole').value != "") {
            $('#errddlBillability').css('display', 'none');
        }
        if (document.getElementById('txtstrtDt').value != "") {
            $('#errtxtstrtDt').css('display', 'none');
            var strtdate = document.getElementById('txtstrtDt').value;
            strtdate = Date.parse(strtdate);
            var ParseprojectEndDate = Date.parse(projectEnddate);

            if (document.getElementById('txtendDt').value != "") {
                var enddate = document.getElementById('txtendDt').value;
                enddate = Date.parse(enddate);
                if (strtdate > enddate) {
                    document.getElementById('txtstrtDt').value = "";
                    document.getElementById('errtxtstrtDt').innerHTML = "it can't be greater-than End date";
                    $('#errtxtstrtDt').css('display', 'block');
                    return false;
                }
            }
            if (ParseprojectEndDate < strtdate) {
                document.getElementById('txtstrtDt').value = "";
                document.getElementById('errtxtstrtDt').innerHTML = "it can't be greater-than Project End date:" + "<br/>" + formatedProjectEndDate + "";
                $('#errtxtstrtDt').css('display', 'block');
                return false;
            } else {
                $('#errtxtstrtDt').css('display', 'none');
            }
        }
        if (document.getElementById('txtendDt').value != "") {
            $('#errtxtendDt').css('display', 'none');
            var enddate = document.getElementById('txtendDt').value;
            enddate = Date.parse(enddate);
            var ParseprojectEndDate = Date.parse(projectEnddate);
            if (document.getElementById('txtstrtDt').value != "") {
                var strtdate = document.getElementById('txtstrtDt').value;
                strtdate = Date.parse(strtdate);
                if (strtdate > enddate) {
                    document.getElementById('txtendDt').value = "";
                    document.getElementById('errtxtendDt').innerHTML = "it can't be lesser-than Project start date";
                    $('#errtxtendDt').css('display', 'block');
                    return false;
                }
            }
            if (ParseprojectEndDate < enddate) {
                document.getElementById('txtendDt').value = "";
                document.getElementById('errtxtendDt').innerHTML = "it can't be greater-than Project End date:" + "<br/>" + formatedProjectEndDate + "";
                $('#errtxtendDt').css('display', 'block');
                return false;
            } else {
                $('#errtxtendDt').css('display', 'none');
            }
        }
        if (txtidIndex > 0) {
            for (var z = 0; z < txtidIndex; z++) {
                if (document.getElementById('txtAllocation' + z).value != "") {
                    // $('#errtxtAllocation' + z).css('display', 'none');
                    var allocationVal = document.getElementById('txtAllocation' + z).value;
                    allocationVal = parseInt(allocationVal);
                    if (allocationVal > 100 || allocationVal == 0) {
                        document.getElementById('#errtxtAllocation' + z).innerHTML = 'Allocation % should be between 1-100';
                        $('#errtxtAllocation' + z).css('display', 'block');
                        return false;
                    } else {
                        $('#errtxtAllocation' + z).css('display', 'none');
                    }
                }
                if (document.getElementById('txtEmployeeRole' + z).value != "") {
                    $('#errddlBillability' + z).css('display', 'none');
                }
                if (document.getElementById('txtstrtDt' + z).value != "") {
                    $('#errtxtstrtDt' + z).css('display', 'none');
                    var strtdate = document.getElementById('txtstrtDt' + z).value;
                    strtdate = Date.parse(strtdate);
                    var ParseprojectEndDate = Date.parse(projectEndDate);
                    if (document.getElementById('txtendDt' + z).value != "") {
                        var enddate = document.getElementById('txtendDt' + z).value;
                        enddate = Date.parse(enddate);
                        if (strtdate > enddate) {
                            document.getElementById('txtstrtDt' + z).value = "";
                            document.getElementById('errtxtstrtDt' + z).innerHTML = "it can't be greater-than End date:";
                            $('#errtxtstrtDt' + z).css('display', 'block');
                            return false;
                        }
                    }
                    if (ParseprojectEndDate < strtdate) {
                        document.getElementById('txtstrtDt' + z).value = "";
                        document.getElementById('errtxtstrtDt' + z).innerHTML = "it can't be greater-than Project End date:" + "<br/>" + formatedProjectEndDate + "";
                        $('#errtxtstrtDt' + z).css('display', 'block');
                        return false;
                    } else {
                        $('#errtxtstrtDt' + z).css('display', 'none');
                    }



                }
                if (document.getElementById('txtendDt' + z).value != "") {
                    var enddate = document.getElementById('txtendDt' + z).value;
                    enddate = Date.parse(enddate);
                    var ParseprojectEndDate = Date.parse(projectEndDate);
                    if (document.getElementById('txtstrtDt' + z).value != "") {
                        var strtdate = document.getElementById('txtstrtDt' + z).value;
                        strtdate = Date.parse(strtdate);
                        if (strtdate > enddate) {
                            document.getElementById('txtendDt' + z).value = "";
                            document.getElementById('errtxtendDt' + z).innerHTML = "it can't be lesser-than Project start date";
                            $('#errtxtendDt' + z).css('display', 'block');
                            return false;
                        }
                    }
                    if (ParseprojectEndDate < enddate) {
                        document.getElementById('txtendDt' + z).value = "";
                        document.getElementById('errtxtendDt' + z).innerHTML = "it can't be greater-than Project End date:" + "<br/>" + formatedProjectEndDate + "";
                        $('#errtxtendDt' + z).css('display', 'block');
                        return false;
                    } else {
                        $('#errtxtendDt' + z).css('display', 'none');
                    }
                }
            }
        }
        if (document.getElementById('txtAdditionalEmail').value != "") {
            var email = document.getElementById('txtAdditionalEmail').value;
            if (!validateEmail(email)) {
                $('#errMsgEmail').css('display', 'block');
                return false;
            } else {
                $('#errMsgEmail').css('display', 'none');
            }

        }
    }
    return true;
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateResourceAssignementData() {
    if (softblockFlag == "1") {
        if (document.getElementById('sftblckstartDt').value == "") {
            $('#errsftblckstartDt').css('display', 'block');
            return false;
        }
        if (document.getElementById('sftblckendDt').value == "") {
            $('#errsftblckendDt').css('display', 'block');
            return false;
        }

    } else {
        if (document.getElementById('txtAllocation').value == "") {
            $('#errtxtAllocation').css('display', 'block');
            return false;
        } else {
            var allocationVal = document.getElementById('txtAllocation').value;
            allocationVal = parseInt(allocationVal);
            if (allocationVal > 100 || allocationVal == 0) {
                document.getElementById('errtxtAllocation').innerHTML = 'Allocation % should be between 1-100';
                $('#errtxtAllocation').css('display', 'block');
                return false;
            } else {
                $('#errtxtAllocation').css('display', 'none');
            }

        }
        if (document.getElementById('txtEmployeeRole').value == "") {
            $('#errddlBillability').css('display', 'block');
            return false;
        } else {
            $('#errddlBillability').css('display', 'none');
        }
        if (document.getElementById('txtstrtDt').value == "") {
            $('#errtxtstrtDt').css('display', 'block');
            return false;
        } else {
            $('#errtxtstrtDt').css('display', 'none');
        }
        if (document.getElementById('txtendDt').value == "") {
            document.getElementById('txtendDt').innerHTML = "End date is required";
            $('#errtxtendDt').css('display', 'block');

            return false;
        } else {
            $('#errtxtendDt').css('display', 'none');
        }
        if (document.getElementById('Availabilityvalue').innerHTML == "") {
            document.getElementById('AvailbilityErrMsg').innerHTML = "Please check Resource Availbility "
            $('#AvailbilityErrMsg').css('display', 'block');
            return false;
        } else {
            $('#AvailbilityErrMsg').css('display', 'none');
        }
        if (document.getElementById('txtAdditionalEmail').value != "") {
            var email = document.getElementById('txtAdditionalEmail').value;
            if (!validateEmail(email)) {
                $('#errMsgEmail').css('display', 'block');
                return false;
            } else {
                $('#errMsgEmail').css('display', 'none');
            }

        }

        var comment = document.getElementById('TextareaResourceNote').value;
        var match = (new RegExp('[~#%\&{}+\|]|\\\\|^\\|\\$')).test(comment);
        if (match) {
            return false;
        }

        if (txtidIndex > 0) {
            for (var z = 0; z < txtidIndex; z++) {
                if (document.getElementById('txtAllocation' + z).value == "") {
                    $('#errtxtAllocation' + z).css('display', 'block');
                    return false;
                } else {
                    var allocationVal = document.getElementById('txtAllocation' + z).value;
                    allocationVal = parseInt(allocationVal);
                    if (allocationVal > 100 || allocationVal == 0) {
                        document.getElementById('#errtxtAllocation' + z).innerHTML = 'Allocation % should be between 1-100';
                        $('#errtxtAllocation' + z).css('display', 'block');
                        return false;
                    } else {
                        $('#errtxtAllocation' + z).css('display', 'none');
                    }
                }
                if (document.getElementById('txtEmployeeRole' + z).value == "") {
                    $('#errddlBillability' + z).css('display', 'block');
                    return false;
                } else {
                    $('#errddlBillability' + z).css('display', 'none');
                }
                if (document.getElementById('txtstrtDt' + z).value == "") {
                    $('#errtxtstrtDt' + z).css('display', 'block');
                    return false;
                } else {
                    $('#errtxtstrtDt' + z).css('display', 'none');
                }
                if (document.getElementById('txtendDt' + z).value == "") {
                    document.getElementById('txtendDt' + z).innerHTML = "End date is required";
                    $('#errtxtendDt' + z).css('display', 'block');
                    return false;
                } else {
                    $('#errtxtendDt' + z).css('display', 'none');
                }
                if (document.getElementById('Availabilityvalue' + z).innerHTML == "") {
                    document.getElementById('AvailbilityErrMsg' + z).innerHTML = "Please check Resource Availbility "
                    $('#AvailbilityErrMsg' + z).css('display', 'block');
                    return false;
                } else {
                    $('#AvailbilityErrMsg' + z).css('display', 'none');
                }
            }
        }

    }
    return true;
}
function searchresourceAllocationPercent(Employee_ID, ProjectStrtdate, ProjectEnddate, Allocationvalue) {
    var refined_array = [];
    var site_url = searchresourceAllocationPercentResource(ProjectStrtdate, Employee_ID);
    $.ajax({
        url: site_url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            var tdId = "";
            var rejId = "";
            var cmntID = "";
            var resource_Array = [];
            var denieddate_Array = [];
            ProjectStrtdate = Date.parse(ProjectStrtdate);
            ProjectEnddate = Date.parse(ProjectEnddate);
            $.each(data.d.results, function (key, value) {
                var allocatedStartdate = value.Startdatetime;
                allocatedStartdate = Date.parse(allocatedStartdate);
                var allocatedEnddate = value.Finishdatetime;
                allocatedEnddate = Date.parse(allocatedEnddate);
                if ((allocatedStartdate >= ProjectStrtdate && allocatedStartdate <= ProjectEnddate) || (allocatedEnddate >= ProjectStrtdate && allocatedEnddate <= ProjectEnddate) || (ProjectStrtdate >= allocatedStartdate && ProjectStrtdate <= allocatedEnddate) || (ProjectEnddate >= allocatedStartdate && ProjectEnddate <= allocatedEnddate)) {
                    resource_Array.push(value);
                } else {
                    denieddate_Array.push(value);
                }
            });

            var array2 = [];
            var array_d1 = [];
            var array_d2 = [];
            var Projectdatacount = 0;
            var Locationdatacount = 0;
            var allocation = 0;
            var array_d3 = [];
            for (var k = 0; k < resource_Array.length; k++) {

                array2.push(resource_Array[k]);

                var srtDate = resource_Array[k].Startdatetime;
                var endDate = resource_Array[k].Finishdatetime;
                srtDate = Date.parse(srtDate);
                endDate = Date.parse(endDate);
                array_d1.push(srtDate);
                array_d2.push(endDate);

                allocation = parseInt(allocation) + parseInt(resource_Array[k].Allocation);


            }
            var minStartDate = Math.min.apply(Math, array_d1);
            minStartDate = formateRefinedDate(minStartDate);
            var maxEndDate = Math.max.apply(Math, array_d2);
            maxEndDate = formateRefinedDate(maxEndDate);
            var allocationPer = allocation   // Math.max.apply(Math, allocation);
            if (resource_Array.length > 0) {
                if (Allocationvalue != "" && Allocationvalue != undefined) {
                    if (Allocationvalue <= (100 - parseInt(allocationPer)))
                        refined_array.push({
                            "EmployeeID": array2[0].EmployeeID,
                            "ResourceFullName": array2[0].ResourceFullName,
                            "Designation": array2[0].Designation,
                            "ProjectName": array2[0].ProjectName,
                            "Startdatetime": minStartDate,
                            "Finishdatetime": maxEndDate,
                            "Allocation": allocationPer,
                            "Work_Location": array2[0].ProjectLocation
                        })
                } else {

                    refined_array.push({
                        "EmployeeID": array2[0].EmployeeID,
                        "ResourceFullName": array2[0].ResourceFullName,
                        "Designation": array2[0].Designation,
                        "ProjectName": array2[0].ProjectName,
                        "Startdatetime": minStartDate,
                        "Finishdatetime": maxEndDate,
                        "Allocation": allocationPer,
                        "Work_Location": array2[0].ProjectLocation
                    })
                }
            }

            // }
            if (refined_array.length == 0) {
                if (denieddate_Array.length == data.d.results.length) {
                    refined_array.push(denieddate_Array);
                }
            }
        }
    });

    return refined_array;
}

function searchResourceOnSkill() {
    $('.loader').show();


    setTimeout(function () {
        GetSearchResourceSkillData();
        $('.loader').hide();
    }, 100);

}
function GetSearchResourceSkillData() {
    var PreSkill = document.getElementById('ddlPrimarySkill').value;
    var SecSkill = document.getElementById('ddlSecondrySkill').value;
    var ROlebandVal = document.getElementById('ddlRoleband').value;

    var Employee_ID = "NA";
    var dattSet = searchResource(Employee_ID, PreSkill, SecSkill, ROlebandVal, projectStrtdate, "");

    if ($.fn.dataTable.isDataTable('#tblResources')) {
        destroyjs('#tblResources');
    }

    var resourceTbl_header = "";
    var resourcetable_element = "";
    resourceTbl_header = "<thead><tr>";
    var ResourceLIHTML = "<tbody>";
    //table binding for resources data
    resourceTbl_header = resourceTbl_header + "<th>Item</th>"
    resourceTbl_header = resourceTbl_header + "<th>Emp ID</th>"
    resourceTbl_header = resourceTbl_header + "<th>Name</th>"
    resourceTbl_header = resourceTbl_header + "<th>Designation</th>"
    resourceTbl_header = resourceTbl_header + "<th>Project Name</th>"
    resourceTbl_header = resourceTbl_header + "<th>Start Date</th>"
    resourceTbl_header = resourceTbl_header + "<th>End Date</th>"
    resourceTbl_header = resourceTbl_header + "<th>Allocation %</th>"
    resourceTbl_header = resourceTbl_header + "<th>Work Location</th>"
    resourceTbl_header = resourceTbl_header + "<th>Action</th>"
    resourceTbl_header = resourceTbl_header + "</tr></thead>";

    //footer menu
    resourceTbl_header = resourceTbl_header + "<tfoot><tr>";
    resourceTbl_header = resourceTbl_header + "<th>Item</th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th></th>"
    resourceTbl_header = resourceTbl_header + "<th>Action</th>"
    resourceTbl_header = resourceTbl_header + " </tr></tfoot>";
    var RRFNumber = RRF_Number;
    var ProjectCode = "";
    $.each(dattSet, function (index, value) {
        var EmpID = "";
        var EmpName = "";
        var Designation = "";
        var projectcode = "";
        var ProjectName = "";
        var ProjectstartDate = "";
        var ProjectEnddate = "";
        var allocationPercent = ""
        var Location = "";
        var status = "";
        if (value.EmployeeID != null) {
            EmpID = value.EmployeeID;
        }
        if (value.ResourceFullName != null) {
            EmpName = value.ResourceFullName;
        }
        if (value.Designation != null) {
            Designation = value.Designation;
        }
        if (value.ProjectName != null) {
            ProjectName = value.ProjectName;
        }
        if (value.Startdatetime != null) {
            ProjectstartDate = value.Startdatetime;
        }
        if (value.Finishdatetime != null) {
            ProjectEnddate = value.Finishdatetime;
        }
        if (value.Allocation != null) {
            allocationPercent = value.Allocation;
        }
        if (value.Work_Location != null) {
            Location = value.Work_Location;
        }
        if (value.Employee_status != null) {
            status = value.Employee_status;
        }
        var ProjectNameHTML = "";
        if (ProjectName == "Multiple Assignment")
            ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
        else
            ProjectNameHTML = ProjectName;

        tdId = "resourcebtnApprove" + index;
        rejId = "resourcebtnReject" + "#;" + EmpID + "#;" + EmpName + "#;" + ProjectCode + "#;" + projectName + "#;" + ProLocation + "#;" + PrimarySkill + "#;" + RRFNumber;
        cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;
        var assigmntDetails = EmpID + "#;" + projectcode + "#;" + RRFNumber;

        ResourceLIHTML = ResourceLIHTML + "<tr id=" + LogProjectGUID + "><td><input type='checkbox' name='checkResource' value='" + EmpID + "' /></td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/MyProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td>" + Designation + "</td><td id=" + EmpID + "#" + EmpName + ">" + ProjectNameHTML + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

    })
    ResourceLIHTML = ResourceLIHTML + "</tbody>";
    resourcetable_element = resourceTbl_header + ResourceLIHTML;
    $("#tblResources").append(resourcetable_element);

    ResourceTable = $('#tblResources').DataTable({
        "dom": 'Rlfrtip',
        "iDisplayLength": 5,
        "lengthMenu": [[5, 15, 35, -1], [5, 15, 35, "All"]],
        "pagingType": "simple_numbers"
    });

    $('#tblResources tfoot th').each(function () {
        var title = $(this).text();
        if (title != 'Action' && title != 'Indicators') {
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
    });

    // DataTable
    var table = $('#tblResources').DataTable();

    // Apply the search
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


    if (table.data().any()) {

        bindcheckedResources(RRFNumber);
    }

}
function ResourceValidationAlert() {
    $('.Alertpopup-bg').hide();
    $('.Toppopup-bg').hide();
    $('.popup-bg').hide();
}
function RejectResourcesalert() {
    $('.Alertpopup-bg').hide();
    $('.Toppopup-bg').hide();
    $('.popup-bg').hide();
    if (pageStatus == "Resource Proposed") {
        refine_status("resourceproposed", "Resource Proposed", "");
    }
    else {
        refine_status("resourceselection", "Resource Selection", "");
    }
}
function SelectionResourceAlert() {
    $('.Alertpopup-bg').hide();
    $('.Toppopup-bg').hide();
    $('.popup-bg').hide();
    refine_status("resourceselection", "Resource Selection", "");

}
function ExternalResourceAlert() {
    $('.Alertpopup-bg').hide();
    $('.Toppopup-bg').hide();
    $('.popup-bg').hide();
    refine_status('externalhiring', 'External Hiring', "");

}

//code to show multiple assignment projects of resource

function resourceSoftblock() {
    softblockFlag = "1";
    if (validateResourceAssignementData()) {

        //SaveResourceassignment();
        var ProjectDataset = Projectdetails.split('#;');
        var ProjCode = ProjectDataset[0];
        var ProjName = ProjectDataset[1];
        var AllocationPerc = ProjectDataset[2];
        var ProjectLoaction = ProjectDataset[3];
        var RMOSPOCname = ProjectDataset[4];
        var ProjManager = ProjectDataset[5];
        var PrimarySkill = ProjectDataset[6];
        var count = 0;
        startDate = $('#sftblckstartDt').datepicker("getDate").format("yyyy-MM-dd");
        startDate = getformateDateForSave(startDate);
        endDate = $('#sftblckendDt').datepicker("getDate").format("yyyy-MM-dd");
        endDate = getformateDateForSave(endDate);
        flagvalue = "Soft Block";
        var childCheckboxes = ResourceTable.rows().nodes().to$('#tblResources tbody tr td').find('input[type=checkbox]');
        var no_checked = childCheckboxes.filter(':checked').each(function () { });
        if (no_checked.length > 0) {
            $('#errMsgSvaeSoftBlock').css('display', 'none');
            for (var index = 0; index < no_checked.length; index++) {
                var EmployeeID = no_checked[index].parentNode.parentNode.firstElementChild.nextSibling.innerText;
                var Employeename = childCheckboxes[index].parentNode.parentNode.childNodes[2].innerText.split('Project')[0];
                var result = InserdataProjectwiseResourceallocation(ProjCode, ProjName, Employeename, EmployeeID, startDate, endDate, AllocationPerc, ProjectLoaction, RMOSPOCname, ProjManager, flagvalue, PrimarySkill);
                if (result == "Inserted") {
                    count++;
                }
            }
            if (no_checked.length == count) {
                softblockFlag = "";
                document.getElementById('btnSoftblockOK').style.display = 'inline-block';
            }
        } else {
            $('#errMsgSvaeSoftBlock').css('display', 'block');
        }
    }
}
function takeenddate() {
    if (pageStatus == "Resource Proposed") {
        var dt = $('#sftblckstartDt').datepicker("getDate");
        //= new Date();
        var SowAssignDate = dt.format("d-MMM-yyyy");
        for (var i = 0; i < 14; i++) {
            dt.setDate(dt.getDate() + 1);

        }
        var NewendDate = dt.format("d-MMM-yyyy");
        document.getElementById('sftblckendDt').value = NewendDate;
    }
}
function ResourceExternalApproval(event) {

    var dataset = event.id.split('#;');
    var projectId = dataset[0];
    var resourceID = dataset[1];
    var resourceName = dataset[2];
    var designation = dataset[3];
    var projectName = dataset[4];
    var startDate = dataset[6];
    var endDate = dataset[7];
    var resourceAllocation = dataset[8];
    var status = dataset[9];
    var ProjectLoaction = dataset[10];
    var RRFNumber = dataset[11];
    var EmployeeRole = dataset[12];


    var projectCode = dataset[13];
    var projecManager = dataset[14];
    var clientPartner = dataset[15];
    var resourceManager = dataset[16];
    var assignmentType = "";
    var ResourceAllUrl = ProjectWiseAllocation();
    var flagvalue = "New";
    $.ajax({
        url: ResourceAllUrl,
        async: false,
        method: "POST",
        data: {
            "AllocatedProjectCode": projectCode,
            "ProjectName": projectName,
            "ResourceFullName": resourceName,
            "EmployeeID": resourceID,
            "BookingType": "null",
            "Startdatetime": startDate,
            "Finishdatetime": endDate,
            "Allocation": resourceAllocation,
            "ProjectLocation": ProjectLoaction,
            "BillableStatus": "null",
            "RMOSPOC": resourceManager,
            "Reporting_Manager": projecManager,
            "Flag": flagvalue
        },
        headers: {
            "Accept": "application/json;odata=verbose"
        },
        success: function (data) {


            var listName = "RMOResourceAssignment";
            var itemType = GetItemTypeForListName(listName);
            var item = {
                __metadata: { "type": itemType },

                ProjectCode: projectCode,
                ProjectName: projectName,
                RRFNumber: RRFNumber,
            };
            $.extend(item, { ProjectManager: projecManager });
            $.extend(item, { ClientPartner: clientPartner });
            $.extend(item, { ResourceManager: resourceManager });
            $.extend(item, { ProjectLoaction: ProjectLoaction });
            $.extend(item, { ResourceName: resourceName });
            $.extend(item, { ResourceID: resourceID });
            $.extend(item, { AllocationPercent: resourceAllocation });
            $.extend(item, { Billability: EmployeeRole });
            $.extend(item, { StartDate: startDate });
            $.extend(item, { EndDate: endDate });
            $.extend(item, { TypeofAssignment: assignmentType });
            $.extend(item, { Designation: designation });
            $.extend(item, { Employee_status: status });
            $.ajax({
                url: "../_api/Web/Lists/GetByTitle('" + listName + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),

                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val()
                },
                success: function (data) {
                    //alert('Resource Allocated Successfully');

                    //var RRFRowID = "1307";
                    var item = {
                        __metadata: { "type": "SP.Data.RRFItem" }
                    };
                    $.extend(item, { Status: "Fulfilled" });
                    $.ajax({
                        url: "../_api/Web/Lists/GetByTitle('RRF')/getItemById(" + RRFRowID + ")",
                        type: "POST",
                        contentType: "application/json;odata=verbose",
                        data: JSON.stringify(item),
                        async: false,
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                            "X-HTTP-Method": "MERGE",
                            "If-Match": "*"
                        },
                        success: function (data) {
                            //insertProjectComment("", "1", "", "");
                            //alert('Resource Allocated Successfully');
                            // $('.popup-bg').hide();
                            $('.AlertclssPopupHead').text('Sucess');
                            document.getElementById('divMsgOnreject').style.display = 'none';
                            document.getElementById('divMsgOnApprove').style.display = 'none';
                            document.getElementById('divMsgAllocateResource').style.display = 'none';
                            document.getElementById('divMsgSaveValidateResource').style.display = "none";
                            document.getElementById('divMsgExternalAlloctaion').style.display = 'block';

                            $('.Alertpopup-bg').show();

                        },
                        error: function (error) {
                            alert(JSON.stringify(error));
                        }
                    });

                }
            });
        }
    });
}
function InserdataProjectwiseResourceallocation(projectCode, projectName, resourceName, resourceID, startDate, endDate, resourceAllocation, ProjectLoaction, RMOSPOCname, projecManager, flagvalue, PrimarySkill) {
    var ResourceAllUrl = ProjectWiseAllocation();
    var result = "";
    $.ajax({
        url: ResourceAllUrl,
        async: false,
        method: "POST",
        data: {
            "AllocatedProjectCode": projectCode,
            "ProjectName": projectName,
            "ResourceFullName": resourceName,
            "EmployeeID": resourceID,
            "BookingType": "null",
            "Startdatetime": startDate,
            "Finishdatetime": endDate,
            "Allocation": resourceAllocation,
            "ProjectLocation": ProjectLoaction,
            "BillableStatus": "null",
            "RMOSPOC": RMOSPOCname,
            "Reporting_Manager": projecManager,
            "Flag": flagvalue,
            "PrimarySkills": PrimarySkill,
            "Active": 1
        },
        headers: {
            "Accept": "application/json;odata=verbose",
        },
        success: function (data) {
            result = "Inserted";
        },
        error: function (error) {
            result = "NotInserted";
            alert(JSON.stringify(error));
        }
    });
    return result;
}
function getformateDateForSave(date) {
    var newdate = date + "T00:00:00";
    return newdate;
}

function ValidatedData(RRFRowID) {
    var rrfvalue = "";
    $.ajax({
        url: "../_api/web/lists/getbytitle('RRF')/items?$filter=ID eq " + RRFRowID + "&$Top=1&$orderby=ID%20desc",
        type: "GET",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            var RRFCount = data.d.results.length;
            if (RRFCount > 0) {
                var dataset = data.d.results[0];

                if (dataset.ProjectName == "" || dataset.ProjectName == null) {

                    rrfvalue = "false";
                }
                else if (dataset.Entity == "" || dataset.Entity == null || dataset.Entity == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.SubPractice == "" || dataset.SubPractice == null || dataset.SubPractice == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.Practice == "" || dataset.Practice == null) {

                    rrfvalue = "false";
                }
                else if (dataset.GBU == "" || dataset.Practice == null) {

                    rrfvalue = "false";
                }
                else if (dataset.RequirementType == "" || dataset.RequirementType == null || dataset.RequirementType == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.ClientRate == "" || dataset.ClientRate == null) {

                    rrfvalue = "false";
                }
                else if (dataset.ClientRateCurrancy == "" || dataset.ClientRateCurrancy == null || dataset.ClientRateCurrancy == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.EmployeeRole == "" || dataset.EmployeeRole == null || dataset.EmployeeRole == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.Designation == "" || dataset.Designation == null || dataset.Designation == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.RoleBand == "" || dataset.RoleBand == null || dataset.RoleBand == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.EmployeeTypeId == "" || dataset.EmployeeTypeId == null || dataset.EmployeeTypeId == "Select") {
                    rrfvalue = "false";
                }
                else if (dataset.PostingTimeTypeId == "" || dataset.PostingTimeTypeId == null || dataset.PostingTimeTypeId == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.StartDate == "" || dataset.StartDate == null) {

                    rrfvalue = "false";
                }
                else if (dataset.EndDate == "" || dataset.EndDate == null) {

                    rrfvalue = "false";
                }
                else if (dataset.WorkerType == "" || dataset.WorkerType == null || dataset.WorkerType == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.PostingTimeTypeId == "" || dataset.PostingTimeTypeId == null || dataset.PostingTimeTypeId == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.RequirementPct == "" || dataset.RequirementPct == null) {

                    rrfvalue = "false";
                }
                else if (dataset.PrimarySkill == "" || dataset.PrimarySkill == null || dataset.PrimarySkill == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.ClientInterviewRequired == "" || dataset.ClientInterviewRequired == null) {

                    rrfvalue = "false";
                }
                else if (dataset.IndustryExp == "" || dataset.IndustryExp == null || dataset.IndustryExp == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.MinRelevantExp == "" || dataset.MinRelevantExp == null || dataset.MinRelevantExp == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.NatureofVacancy == "" || dataset.NatureofVacancy == null || dataset.NatureofVacancy == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.SalaryRangeCurrancy == "" || dataset.SalaryRangeCurrancy == null || dataset.SalaryRangeCurrancy == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.SalaryRangeMinAmt == "" || dataset.SalaryRangeMinAmt == null) {

                    rrfvalue = "false";
                }
                else if (dataset.SalaryRangeMaxAmt == "" || dataset.SalaryRangeMaxAmt == null) {

                    rrfvalue = "false";
                }
                else if (dataset.WorkLocation == "" || dataset.WorkLocation == null) {

                    rrfvalue = "false";
                }
                else if (dataset.BaseLocation == "" || dataset.BaseLocation == null || dataset.BaseLocation == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.ReportingToUserId == "" || dataset.ReportingToUserId == null || dataset.ReportingToUserId == "Select") {

                    rrfvalue = "false";
                }
                else if (dataset.DescriptionSummary == "" || dataset.WorkLocation == null) {

                    rrfvalue = "false";
                }
                //rrfvalue = "true";
            } else {

                rrfvalue = "false";
            }
        },
        complete: function () {

        },
        error: function (jqXHR, textStatus, errorThrown) {

        }

    });
    return rrfvalue;
}

function getWithdrawnComment(rejId) {
    $("#withdrawnrejectdata").empty();
    $('.popup-bg-alert').show();
    $('#withdrawnrejectdata').show();
    $('.alertmessage').text('  ');
    $('.alertmessage').show('');
    RRFRowID = rejId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[0];
    var RowProjectID = rejId.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('#')[1];
    LogProjectGUID = RowProjectID;
    var url = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$Select=Comment,NewCreatedDate,Name,Flag&$filter=ProjectGUID eq '" + RowProjectID + "'and Flag eq '3' and RRFListItemId eq '" + RRFRowID + "'&$orderby=Created desc";
    getRMOTransactionDetails(url, RowProjectID, 'RejCommentlog');
}
function getRRFTATdaysbyStatus(status) {
    var status_TATMappingDays = "";
    var restResoruceAllocation = "../_api/web/lists/getbytitle('RRFTATMapping')/items?$select=Status,TATDays,Flag&$filter=Status eq'" + status + "'";
    $.ajax({
        url: restResoruceAllocation,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            status_TATMappingDays = data.d.results;

        }
    });
    return status_TATMappingDays;
}


$(window).load(function () {
    $(".horizontalcontent-3").mCustomScrollbar({
        scrollButtons: {
            enable: true
        },
        horizontalScroll: true,
        theme: "dark-thick",
        autoExpandScrollbar: true,
        advanced: { autoExpandHorizontalScroll: true }
    });

});


function resultset(Url) {
    var result;
    $.ajax({
        url: Url,
        async: false,
        method: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
            result = data.d.results;
        },
        error: function (error) {
            result = 'error';
        }
    });
    return result;
}