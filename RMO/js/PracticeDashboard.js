



var table_header = "";
var table_element = "";
var url = "";
var allrecordCount = 0;
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
var internallyfulfilledFlag = "";
var RRFCreatedBy = "";
var currentuserRole = "";
var currentuserGUID;
var ResourcesResult = "";

$(document).ready(function () {
    var urluserprofile = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";
    var resultuserprofile = resultsetProfile(urluserprofile);
    var currentuseremail = resultuserprofile.Email;
    currentuserGUID = GetCurrentUserGUID();
    var currentuserRole_empID = GetCurrentUserRole(currentuseremail);
    currentuserRole = currentuserRole_empID.split(';')[0];
    //Get logged in user name
    var CurrentUser = GetCurrentUserData();
    $.getJSON(CurrentUser)
    .done(function (data) {
        LoginUserName = data.Title;
        LoginUserID = data.Id;
        getRRFData();

    })
    $(".horizontalcontent").mCustomScrollbar({
        scrollButtons: {
            enable: true
        },
        horizontalScroll: true,
        theme: "dark-thick",
        autoExpandScrollbar: true,
        advanced: { autoExpandHorizontalScroll: true }
    });
});
function getRRFData() {
    RRFtblFlag = "1";
    getRoleWiseResources(currentuserRole, currentuserGUID);
    refine_status('allrecord', 'ALL RECORDS', 'FirstTimeLoad');
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
        $('.popup-bg-alert').hide();
    });
    $('.T-close').on('click', function () {
        $('.Toppopup-bg').hide();
    });
    $('.Toppupup-close').on('click', function () {
        RRFtblFlag = "1";
        $('.Toppopup-bg').hide();
    });


    $(document).on("click", "input", function () {
        $(".strtDt").datepicker({
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
    $(document).on("click", "input", function () {
        $(".endDt").datepicker({
            dateFormat: 'dd-M-yy',
            changeMonth: true,
            changeYear: true,
            minDate: new Date(),
            onSelect: function (selected, evnt) {
                removeErrorMsgResourceAssignment();
                //takeenddate();
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
    if ($.fn.dataTable.isDataTable('#RRFTable')) {
        destroyjs('#RRFTable');
    }


    table_header = "<thead><tr>";
    if (status == "allrecord") {
        //Table binding for ALL Record
        StatusFlag = "allrecord"; //
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project Name</th>"
        table_header = table_header + "<th style='width:9%'>Customer Name</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Status</th>"

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
        table_header = table_header + " </tr></tfoot>";
        allrecordCount = 0;
        //url for get All records.
        if (currentuserRole == "RMO") {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,ExternalHiring,RequirementPct,RRFCreatedDate,PendingWith/Title,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,PendingWithId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser,PendingWith&$Filter=Status ne 'Fulfilled' and Status ne 'Withdrawn' and Status ne 'Rejected'&$Top=100000&$orderby=ID%20desc";
        } else {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,ExternalHiring,RequirementPct,RRFCreatedDate,PendingWith/Title,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,PendingWithId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser,PendingWith&$Filter=Status ne 'Fulfilled' and Status ne 'Withdrawn' and Status ne 'Rejected' and ((NewAuthorId eq '" + LoginUserID + "') or (ReportingToUser eq '" + LoginUserID + "') or (ClientPartnerUser eq '" + LoginUserID + "') or (ProjectManagerUser eq '" + LoginUserID + "') or (FPNAUser eq '" + LoginUserID + "') or (RMOSPOCUser eq '" + LoginUserID + "') or substringof('" + LoginUserID + "',NonApprovers))&$Top=100000&$orderby=ID%20desc";
        }

    }
    else if (status == "fulfilled") {

        //Table binding for Fulfilled
        StatusFlag = "fulfilled";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th style='width:'>Action</th>"
        table_header = table_header + "<th style='width:10%'>RRF No.</th>"
        table_header = table_header + "<th style='width:20%'>Project Name</th>"
        table_header = table_header + "<th style='width:9%'>Customer Name</th>"
        table_header = table_header + "<th style='width:8%'>Start Date</th>"
        table_header = table_header + "<th style='width:8%'>End Date</th>"
        table_header = table_header + "<th style='width:8%'>Work Location</th>"
        table_header = table_header + "<th style='width:8%'>Role-Band</th>"
        table_header = table_header + "<th style=''>Submitted Date</th>"

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
        table_header = table_header + " </tr></tfoot>";

        //url for get only projects with status is Resource Allocation and Offer.
        if (currentuserRole == "RMO") {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Fulfilled'&$Top=100000&$orderby=ID%20desc";
        } else {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=Status eq 'Fulfilled' and ((NewAuthorId eq '" + LoginUserID + "') or (ReportingToUser eq '" + LoginUserID + "') or (ClientPartnerUser eq '" + LoginUserID + "') or (ProjectManagerUser eq '" + LoginUserID + "') or (FPNAUser eq '" + LoginUserID + "') or (RMOSPOCUser eq '" + LoginUserID + "') or substringof('" + LoginUserID + "',NonApprovers))&$Top=100000&$orderby=ID%20desc";
        }

    }
    else if (status == "withdrawn") {

        //Table binding for Withdrawn
        StatusFlag = "withdrawn";
        table_header = table_header + "<th style='display: none;'>ID</th>"
        table_header = table_header + "<th>Action</th>"
        table_header = table_header + "<th>RRF No.</th>"
        table_header = table_header + "<th>Project Name</th>"
        table_header = table_header + "<th>Customer Name</th>"
        table_header = table_header + "<th>Start Date</th>"
        table_header = table_header + "<th>End Date</th>"
        table_header = table_header + "<th>Work Location</th>"
        table_header = table_header + "<th>Role-Band</th>"
        table_header = table_header + "<th>Withdrawn/Rejected Date</th>"
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
        table_header = table_header + " </tr></tfoot>";
        withdrawnCount = 0;
        //url for get only projects with status is Withdrawn.
        if (currentuserRole == "RMO") {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=Modified,InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=(Status eq 'Withdrawn' or Status eq 'Rejected')&$Top=100000&$orderby=ID%20desc";
        } else {
            url = "../_api/web/lists/getbytitle('RRF')/items?$select=Modified,InternallyFulfilled,WorkLocation,NewProjectStartDate,NewProjectEndDate,ResourceProposedFlag,TATDateTime,SubmittedDate,CloneType,ProjectCode,RequirementPct,RRFCreatedDate,ProjectManagerUser/Title,NewAuthor/Title,FPNAUser/Title,ReportingToUser/Title,ClientPartnerUser/Title,RMOSPOCUser/Title,ResourceAgainstRRFInWD/EMail,Customer,GBU,EmployeeRole,NonBillableFlag,ProjectManagerUserId,FPNAUserId,ReportingToUserId,ClientPartnerUserId,RMOSPOCUserId,NewAuthorId,ID,ProjectName,LinkFilename,MinRelevantExp,IndustryExp,SecondarySkill,PrimarySkill,RoleBand,ProjectGUID,RRFNO,SubPractice,NewStartDate,NewEndDate,StartDate,EndDate,BaseLocation,RoleBand,Billability,Status&$Expand=ResourceAgainstRRFInWD,ProjectManagerUser,NewAuthor,FPNAUser,ReportingToUser,ClientPartnerUser,RMOSPOCUser&$Filter=(Status eq 'Withdrawn' or Status eq 'Rejected') and ((NewAuthorId eq '" + LoginUserID + "') or (ReportingToUser eq '" + LoginUserID + "') or (ClientPartnerUser eq '" + LoginUserID + "') or (ProjectManagerUser eq '" + LoginUserID + "') or (FPNAUser eq '" + LoginUserID + "') or (RMOSPOCUser eq '" + LoginUserID + "') or substringof('" + LoginUserID + "',NonApprovers))&$Top=100000&$orderby=ID%20desc";
        }

    }

    //Call Rest API to Get Data from List
    var listname = "RRF";
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {

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


                //value.SubmittedDate;
                if (status == "externalhiring")
                    ResourceData = value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.WorkLocation + "#" + value.NewProjectStartDate + "#" + value.NewProjectEndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode + "#" + value.ResourceAgainstRRFInWD.EMail + "#" + value.ExternalHiring + "#" + value.NewStartDate + "#" + value.NewEndDate + "#" + value.InternallyFulfilled;
                else if (status == "rrfnonbillable")
                    ResourceData = "";//value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.BaseLocation + "#" + value.StartDate + "#" + value.EndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode;
                else
                    ResourceData = value.ID + "#" + value.ProjectGUID + "#" + value.PrimarySkill + "#" + value.SecondarySkill + "#" + value.RoleBand + "#" + value.IndustryExp + "#" + value.MinRelevantExp + "#" + value.RRFNO + "#" + value.Status + "#" + value.SubPractice + "#" + value.ProjectName + "#" + value.WorkLocation + "#" + value.NewProjectStartDate + "#" + value.NewProjectEndDate + "#" + value.NewAuthorId + "#" + value.RMOSPOCUserId + "#" + value.ProjectManagerUserId + "#" + value.FPNAUserId + "#" + value.ReportingToUserId + "#" + value.ClientPartnerUserId + "#" + value.EmployeeRole + "#" + value.RequirementPct + "#" + value.ProjectManagerUser.Title + "#" + value.ClientPartnerUser.Title + "#" + value.RMOSPOCUser.Title + "#" + value.ProjectCode + "#" + value.ResourceAgainstRRFInWD.EMail + "#" + value.ExternalHiring + "#" + value.NewStartDate + "#" + value.NewEndDate + "#" + value.InternallyFulfilled;

                ResourceApprovalData = value.ID + "#" + value.ProjectGUID + "#" + value.EmployeeRole + "#" + value.Status + "#" + value.NonBillableFlag + "#" + value.GBU + "#" + value.EmployeeRole + "#" + value.ProjectManagerUserId;
                //document.getElementById('rrfallrecordcount').innerHTML = allrecordCount;
                //document.getElementById('rrfrmovalidationcount').innerHTML = rmovalidationCount;
                //document.getElementById('rrfnonbillable').innerHTML = rrfnonbillable;
                //document.getElementById('rrfresourceproposedcount').innerHTML = resourceproposedCount;
                //document.getElementById('rrfresourceselectioncount').innerHTML = resourceselectionCount;
                //document.getElementById('rrffulfilledcount').innerHTML = fulfilledCount;
                //document.getElementById('rrfwithdrawncount').innerHTML = withdrawnCount;
                ////document.getElementById('rrfsavedcount').innerHTML = rrfsavedCount;
                //document.getElementById('rrfexternalhiring').innerHTML = rrfexternalHiring;
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
                        submittedDate.setHours(0, 0, 0, 0);
                        TodayDate.setHours(0, 0, 0, 0);
                        var timeDiff_ = new Date(TodayDate - submittedDate);
                        var diffDays_ = timeDiff_ / 1000 / 60 / 60 / 24;
                        for (var i = submittedDate; i <= TodayDate;) {
                            if (i.getDay() == 0) {
                                totalweekdays++;
                            }
                            if (i.getDay() == 6) {
                                totalweekdays++;
                            }
                            i.setTime(i.getTime() + 1000 * 60 * 60 * 24);
                        }
                        var Total_Week_days = parseInt(totalweekdays);
                        diffDays_ = diffDays_ - Total_Week_days;
                        if (TATMappingDays.length > 1) {
                            $.each(TATMappingDays, function (Flagkey, Flag_Value) {
                                if ((value.ResourceProposedFlag == "1" || value.ResourceProposedFlag == 1) && (Flag_Value.Flag == 1)) {
                                    var T_days = Flag_Value.TATDays;
                                    T_days = parseInt(T_days);

                                    if (diffDays_ > T_days) {
                                        BusinessDaysCount = "<div class='bgred'>" + diffDays_ + " - D</div>";
                                    }
                                    else if (diffDays_ > 0) {
                                        BusinessDaysCount = "<div class='bggreen'>" + diffDays_ + " - D</div>";
                                    }
                                } else {
                                    var T_days = Flag_Value.TATDays;
                                    T_days = parseInt(T_days);

                                    if (diffDays_ > T_days) {
                                        BusinessDaysCount = "<div class='bgred'>" + diffDays_ + " - D</div>";
                                    }
                                    else if (diffDays_ > 0) {
                                        BusinessDaysCount = "<div class='bggreen'>" + diffDays_ + " - D</div>";
                                    }
                                }

                            });
                        } else {
                            var T_days = TATMappingDays[0].TATDays;
                            T_days = parseInt(T_days);

                            if (diffDays_ > T_days) {
                                BusinessDaysCount = "<div class='bgred'>" + diffDays_ + " - D</div>";
                            }
                            else if (diffDays_ > 0) {
                                BusinessDaysCount = "<div class='bggreen'>" + diffDays_ + " - D</div>";
                            }
                        }
                    }
                }
                if (status == "allrecord") {
                    //RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + " " + BusinessDaysCount + "</td></tr>"
                    if (status == "allrecord") {
                        if ((value.Status == "Draft" || value.Status == "RRF Saved")) {

                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                            //Check RMO ID
                        else if ((value.Status == "RMO Validation")) {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                            //Check RMO ID
                        else if (value.Status == "Resource Proposed") {
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
                                //ExternalLink = "<div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='fa fa-external-link-square' aria-hidden='true' onclick='ExternalPopUp(this)'></span><div class='tooltiptext-1' style='width:100px !important'>External Hiring</div></div>";
                            }
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div>" + ExternalLink + "</div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.Status == "Resource Selection") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                            //Check RMO ID
                        else if (value.Status == "Resource Allocation") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-remove-sign' aria-hidden='true' onclick='showRejectionpopup(this)'></span><div class='tooltiptext-1'>Withdrawn</div></div><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }

                        else if (value.Status == "Offer" || value.Status == "External Hiring") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.NonBillableFlag == null && value.Status == "Non Billable") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.NonBillableFlag == 1 && value.Status == "FPNA") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.NonBillableFlag == 1 && value.Status == "Recruitment Head") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.NonBillableFlag == 1 && value.Status == "VPHR") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.NonBillableFlag == 1 && value.Status == "Functional Head") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.Status == "Initiated External Hiring") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.Status == "Non Billable") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else if (value.Status == "FPNA" || value.Status == "Recruitment Head" || value.Status == "VPHR" || value.Status == "Functional Head") {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                        else {
                            var PendingWith = "";
                            if (value.Status == "RRF Saved")
                                PendingWith = value.NewAuthor.Title;
                            else if (value.Status == "RMO Validation")
                                PendingWith = value.RMOSPOCUser.Title;
                            else if (value.Status == "Resource Proposed")
                                PendingWith = value.RMOSPOCUser.Title;
                            else if (value.Status == "Resource Selection")
                                PendingWith = value.RMOSPOCUser.Title;
                            else if (value.Status == "External Hiring")
                                PendingWith = value.FPNAUser.Title;
                            else if (value.Status == "Functional Head" || value.Status == "Non Billable")
                                PendingWith = value.NewAuthor.Title;
                            else if (value.Status == "FPNA" || value.Status == "Recruitment Head" || value.Status == "VPHR")
                                PendingWith = value.PendingWith.Title;
                            else if (value.Status == "Initiated External Hiring")
                                PendingWith = value.FPNAUser.Title;
                            else
                                PendingWith = "";
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFStatus + "</td></tr>"
                        }
                    }


                } else {
                    if (value.Status == "Fulfilled") {
                        if (value.EmployeeRole != "Billable") // changed by Abhishek 13 09 17
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td></tr>"
                        else
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + ResourceData + "' class='glyphicon glyphicon-user' aria-hidden='true' onclick='showResourcepopup(this)'></span><div class='tooltiptext-1'>Resource</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + RRFCreatedDate + "</td></tr>"

                    } else if (value.Status == "Withdrawn" || value.Status == "Rejected") {
                        var ModifiedDate = "";
                        if (value.Modified != null) {
                            ModifiedDate = convert_date_DDMMYYYY(value.Modified);
                        }

                        if (value.NewAuthorId == LoginUserID) {
                            if (value.EmployeeRole != "Billable") {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td></tr>"
                            }
                            else {
                                RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td></tr>"
                            }
                        }
                        else {
                            RRFLIHTML = RRFLIHTML + "<tr id=" + value.ID + "#" + value.ProjectGUID + "><td style='display:none;'></td><td width='10%'><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1'><span id='" + cmntID + "' class='glyphicon glyphicon-comment' aria-hidden='true' onclick='showCommentpopup(this)'></span><div class='tooltiptext-1'>Comment</div></div><div class='tooltip-1'><span id='" + rejId + "' class='fa fa-ban' aria-hidden='true' onclick='getWithdrawnComment(this)'></span><div class='tooltiptext-1' style='width:141px !important'>Withdrawn Comment</div></div><div class='tooltip-1'><span id='" + projRRFNo + '#;View' + "' class='glyphicon glyphicon-tag' aria-hidden='true' onclick='showViewlogPopup(this)'></span><div class='tooltiptext-1'>Log</div></div></div></div></td><td><a href='../SitePages/ResourceRequestForm.aspx?RRFNO=" + RRFNO + "' target='_blank' >" + RRFNO + "</a>" + clone + "</td><td>" + ProjectName + "" + ExternalInitated + "</td><td>" + Customer + "</td><td>" + StartDate + "</td><td>" + EndDate + "</td><td>" + Location + "</td><td>" + RoleBand + "</td><td>" + ModifiedDate + "</td></tr>"
                        }
                    }
                }
            });

            RRFLIHTML += "</tbody>";
            table_element = table_header + RRFLIHTML;
            $("#RRFTable").append(table_element);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }

    });


    RRF_Table = $('#RRFTable').DataTable({

        "dom": 'Rlfrtip',
        "autoWidth": 'false',
        "paging": 'true',
        "lengthMenu": [[5, 15, 35, -1], [5, 15, 35, "All"]],

    });

    $('#RRFTable tfoot th').each(function () {
        var title = $(this).text();
        if (title != 'Action' && title != 'Indicators') {
            $(this).html('<input type="text" placeholder="Search ' + title + '" />');
        }
        else {
            $(this).html('');
        }
    });
    // DataTable
    var table = $('#RRFTable').DataTable();

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
    document.getElementById('divExternalMsgApproval').style.display = "none";
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
    internallyfulfilledFlag = resourceRRF[30];
    var ResourceAgainstRRFInWDId = "";
    var ExternalEmplooyeeId = "";
    var ExternalEmplooyeeName = "";
    var externalhiringflag = "";

    if (resourceRRF[26] != "" && resourceRRF[26] !== undefined && resourceRRF[26] != "undefined" && undefined != null && (pageStatus == "External Hiring" || pageStatus == "Offer")) {
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
    document.getElementById('divExternalMsgApproval').style.display = "none";
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
                    SeletedEmployeeIDcheck = (dataset.ShortlistedResource != "" && dataset.ShortlistedResource != null) ? dataset.ShortlistedResource.split(';') : "";

                } else if (pageStatus == "Resource Proposed") {
                    SeletedEmployeeIDcheck = (dataset.ShortlistedResource != "" && dataset.ShortlistedResource != null) ? dataset.ShortlistedResource.split(';') : ""; // Changes done on 30-8-2017 

                } else if (pageStatus == "Resource Selection") {

                    SeletedEmployeeIDcheck = (dataset.AllocatedResource != "" && dataset.AllocatedResource != null) ? dataset.AllocatedResource.split(';') : "";

                } else if (pageStatus == "Fulfilled") {
                    SeletedEmployeeIDcheck = (dataset.AllocatedResource != "" && dataset.AllocatedResource != null) ? dataset.AllocatedResource.split(';') : "";
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
        resourceTbl_header = resourceTbl_header + "<th >Employee ID</th>"
        resourceTbl_header = resourceTbl_header + "<th >Employee Name</th>"
        resourceTbl_header = resourceTbl_header + "<th >Project Name</th>"
        resourceTbl_header = resourceTbl_header + "<th>Project Manager</th>"
        resourceTbl_header = resourceTbl_header + "<th>Sub-Practice</th>"
        resourceTbl_header = resourceTbl_header + "<th >Start Date</th>"
        resourceTbl_header = resourceTbl_header + "<th >End Date</th>"
        resourceTbl_header = resourceTbl_header + "<th>Allocation %</th>"
        resourceTbl_header = resourceTbl_header + "<th>Employee Status</th>"
        resourceTbl_header = resourceTbl_header + "<th >Base Location</th>"
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

        if (resourceRRF[26] != "" && resourceRRF[26] !== undefined && resourceRRF[26] != "undefined" && undefined != null && ((pageStatus == "External Hiring" || pageStatus == "Offer") || externalhiringflag == "1")) {

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
                var SubPractice = "";
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
                if (value.SubPractice != null) {
                    SubPractice = value.SubPractice;
                }

                var ProjectNameHTML = projectName;
                EmpID = ExternalEmplooyeeId;
                cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;

                var externalDetails = rrfprojectID + "#;" + EmpID + "#;" + EmpName + "#;" + Designation + "#;" + projectName + "#;" + SubPractice + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + status + "#;" + ProLocation + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + SubPractice;
                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td><input type='checkbox' name='checkResource' value='" + EmpID + "' /></td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td>" + ProjectNameHTML + "</td><td>" + ProjectManagerName + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + RRFAllocationPercent + "</td><td>" + status + "</td><td>" + ProLocation + "</td><td><span id='" + externalDetails + "' class='glyphicon glyphicon-ok-sign icon-weight' aria-hidden='true' title='Approve' onclick='ResourceExternalApproval(this)'></span><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

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
                                    var Resource_Dataset = searchResource(EmpID, PrimarySkill, SecondrySkill, RolBand, rrfStartDate, RRFAllocationPercent, rrfEndDate);
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
                                        var SubPractice = "";
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
                                        if (value.SubPractice != null) {
                                            SubPractice = value.SubPractice;
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
                                        var assigmntDetails = EmpID + "#;" + rrfprojectID + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill + "#;" + SubPractice;
                                        if (pageStatus == "Resource Proposed" && (LoginUserID == RMOSPOCUserId || LoginUserID == ProjectManagerUserId)) {

                                            if (ResourceAllocationFlag == "1" && LoginUserID == ProjectManagerUserId) {

                                                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + EmpID + "#" + rrfprojectID + "' class='glyphicon glyphicon-ok-sign icon-weight' aria-hidden='true' title='Approve' onclick='ResourceApproval(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span> <span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            }
                                            else {

                                                ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' /></td>" + bool + "<td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                            }
                                        }
                                        else if (pageStatus == "Resource Selection" && LoginUserID == RMOSPOCUserId) {
                                            ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td></td><td id=" + EmpID + "#;" + rrfprojectID + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + assigmntDetails + "' class='glyphicon glyphicon-lock icon-weight' aria-hidden='true' title='Resource Allocation' onclick='ResourceAssignment(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span> <span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                                        }
                                        else {
                                            ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td></td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

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
            url = "../_api/web/lists/getbytitle('RMOResourceAssignment')/items?$select=ResourceID,ResourceName,Designation,ProjectName,NewStartDate,NewEndDate,AllocationPercent,ProjectLoaction,Employee_status,SubPractice&$filter=RRFNumber eq'" + RRFNumber + "'";

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
                        var SubPractice = "";
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
                        if (value.SubPractice != null) {
                            SubPractice = value.SubPractice;
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
                        var assigmntDetails = EmpID + "#;" + projectcode + "#;" + RRFNumber + "#;" + ProjectstartDate + "#;" + ProjectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill + "#;" + SubPractice;
                        ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + ProjectManagerName + ">" + ProjectNameHTML + "</td><td>" + ProjectManagerName + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"


                    });
                }
            });
        } else {
            //document.getElementById('btnResorceSave').style.display = 'block';
            document.getElementById('SoftBlockResource').style.display = 'none';
            document.getElementById('softblockHead').style.display = 'none';
            EmployeeIDPara = "NA";
            chechBoxFlag = "1";
            var Resource_Dataset = searchResource(EmployeeIDPara, PrimarySkill, SecondrySkill, RolBand, rrfStartDate, RRFAllocationPercent, rrfEndDate);
            if (Resource_Dataset.length == 0) {

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
                var SubPractice = "";
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
                if (value.SubPractice != null) {
                    SubPractice = value.SubPractice;
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
                rejId = "resourcebtnReject" + "#;" + EmpID + "#;" + EmpName + "#;" + ProjectCode + "#;" + projectName + "#;" + ProLocation + "#;" + PrimarySkill + "#;" + RRFNumber + "#;" + EmployeeRole;
                cmntID = "resourcebtnComment" + "#;" + EmpID + "#;" + EmpName + "#;" + RRFNumber;
                var assigmntDetails = EmpID + "#;" + rrfprojectID + "#;" + RRFNumber + "#;" + EmployeeRole + "#;" + projectStrtdate + "#;" + projectEnddate + "#;" + RRFAllocationPercent + "#;" + Designation + "#;" + EmpName + "#;" + status + "#;" + Employee_Email + "#;" + ProLocation + "#;" + ProjectCode + "#;" + ProjectManagerName + "#;" + ClientPartnerName + "#;" + RMOSPOCName + "#;" + projectName + "#;" + PrimarySkill + "#;" + SubPractice;
                Projectdetails = ProjectCode + "#;" + projectName + "#;" + RRFAllocationPercent + "#;" + ProLocation + "#;" + RMOSPOCName + "#;" + ProjectManagerName + "#;" + PrimarySkill + "#;" + RRFNumber;
                if (pageStatus == "RRF Saved" && LoginUserID == AuthorId) {

                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"
                    document.getElementById('softblockHead').style.display = 'none';
                    document.getElementById('SoftBlockResource').style.display = 'none';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');
                }
                else if ((pageStatus == "RMO Validation" || pageStatus == "External Hiring" || pageStatus == "Offer") && LoginUserID == RMOSPOCUserId) {

                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span></td></tr>"
                    document.getElementById('softblockHead').style.display = 'none';
                    document.getElementById('SoftBlockResource').style.display = 'none';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');
                }
                else if (pageStatus == "Resource Proposed" && LoginUserID == RMOSPOCUserId && (ResourceAllocationFlag == null || ResourceAllocationFlag == "" || ResourceAllocationFlag == undefined)) {

                    document.getElementById('softblockHead').style.display = 'block';
                    document.getElementById('SoftBlockResource').style.display = 'block';
                    $('#errMsgSvaeSoftBlock').css('display', 'none');

                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span> <span id='" + rejId + "' class='glyphicon glyphicon-remove-sign icon-weight' aria-hidden='true' title='Reject' onclick='ResourceRejectionpopup(this)'></span></td></tr>"

                }
                else {
                    ResourceLIHTML = ResourceLIHTML + "<tr id=" + rrfprojectID + "><td class='clsCheckbox'><input type='checkbox' name='checkResource' value='" + EmpID + "' />" + bool + "</td><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td><span href='#' id='show-popup' class='action-b'>" + EmpName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + EmpID + "&employeename=" + EmpName + "' target='_blank' >View Profile</a></div></span></td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Project_Manager + "</td><td>" + SubPractice + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + status + "</td><td>" + Location + "</td><td><span id='" + cmntID + "' class='glyphicon glyphicon-comment icon-weight' aria-hidden='true' title='Comment' onclick='ResourceCommentpopup(this)'></span></td></tr>"

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
    document.getElementById('divExternalMsgApproval').style.display = "none";
    document.getElementById('divViewLog').style.display = "block";
    $(".removedata").remove();
    var url = "../_api/web/lists/getbytitle('RRFTransactionDetails')/items?$Select=LogType,NewCreatedDate,Name,Flag,Author/Title&$expand=Author&$filter=(Flag eq '1' or Flag eq '5' or Flag eq '3') and (RRFNO eq '" + RRFNumber + "' or RRFListItemId eq '" + RRFRowID + "')&$orderby=Created desc";
    getRMOTransactionDetails(url, RowProjectID, "Log");
    $('.popup-bg').show();
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
                    SeletedEmployeeID = (dataset.suggestedResource != "" && dataset.suggestedResource != null) ? dataset.suggestedResource.split(';') : "";
                } else if (pageStatus == "RMO Validation") {
                    SeletedEmployeeID = (dataset.ShortlistedResource != "" && dataset.ShortlistedResource != null) ? dataset.ShortlistedResource.split(';') : "";

                } else if (pageStatus == "Resource Proposed") {
                    SeletedEmployeeID = (dataset.ShortlistedResource != "" && dataset.ShortlistedResource != null) ? dataset.ShortlistedResource.split(';') : ""; // Changes done on 30-8-2017 

                } else if (pageStatus == "Resource Selection") {
                    SeletedEmployeeID = (dataset.AllocatedResource != "" && dataset.AllocatedResource != null) ? dataset.AllocatedResource.split(';') : "";

                } else if (pageStatus == "Fulfilled") {
                    SeletedEmployeeID = (dataset.AllocatedResource != "" && dataset.AllocatedResource != null) ? dataset.AllocatedResource.split(';') : "";
                } else if (pageStatus == "External Hiring" || pageStatus == "Offer") {

                    SeletedEmployeeID = (dataset.ShortlistedResource != "" && dataset.ShortlistedResource != null) ? dataset.ShortlistedResource.split(';') : "";
                }
                if (SeletedEmployeeID != "") {
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
            }


        },
        complete: function () {
            //bind rejected resource indication

            var dataurl = "../_api/web/lists/getbytitle('RMOAssignmentRefusal')/items?$filter=RRFNo eq'" + RRFNumber + "'&$Top=1";
            $.ajax({
                url: dataurl,
                async: false,
                type: "GET",
                headers: { "Accept": "application/json;odata=verbose" },
                success: function (data) {
                    var RRFRefuseResourceCount = data.d.results.length;
                    var RRFRefuseResources = data.d.results;
                    var SeletedEmployeeID = "";
                    if (RRFRefuseResourceCount > 0) {
                        $.each(RRFRefuseResources, function (key, value) {
                            $('#tblResources tbody tr').each(function () {
                                // $('#tblResources tbody tr td:eq(1)')[0].innerHTML
                                if ($(this).find('td:eq(1)')[0].innerHTML == value.EmployeeID) {
                                    $(this).find('td:eq(9)')[0].innerHTML = $(this).find('td:eq(9)')[0].innerHTML + "  " + "<span class='bgred' title='Rejected'>REJ</span>";
                                }
                            });

                        });
                    }


                },
                error: function (jqXHR, textStatus, errorThrown) {

                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {

        }
    });
}
//code to get total,booked,Free resources from service
function getRoleWiseResources(Role, ResouceUID) {
    var getResourcesURL = getRolewiseResourcesData();
    requestData = "{\"Role\":\"" + Role + "\",\"ResouceUID\":\"" + ResouceUID + "\"}";
    $.ajax({

        url: getResourcesURL,
        method: "POST",
        data: requestData,
        async: false,
        dataType: "json",
        headers:
        {
            "content-Type": "application/json"
        },
        success: function (data) {
            var TotalCount = data.EmployeeAvailability[0].Total;
            var FreeCount = data.EmployeeAvailability[0].Free;
            var BookedCount = data.EmployeeAvailability[0].Booked;
            var RollOffCount = 0;
            var InvestmentCount = 0;
            var NewJoineeCount = 0;
            document.getElementById('TotalCapacityVal').innerText = TotalCount;
            document.getElementById('DeployableVal').innerText = FreeCount;
            document.getElementById('AllocatedVal').innerText = BookedCount;
            document.getElementById('RollOffVal').innerText = RollOffCount;
            document.getElementById('InvestmentVal').innerText = InvestmentCount;
            document.getElementById('NewJoineeVal').innerText = NewJoineeCount;

            ResourcesResult = data.ResourceData;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        }
    });
}
function getResourcesDetails(type) {
    multipleAssignProject_Array = [];
    if ($.fn.dataTable.isDataTable('#tblResources')) {
        destroyjs('#tblResources');
    }

    $('.popup h4').css({ 'text-align': 'left', 'width': '100%' });
    $('.allbtn').css('text-align', 'left');
    document.getElementById('divRejectBody').style.display = "none";
    document.getElementById('divComment').style.display = "none";
    document.getElementById('divApproveBody').style.display = "none";
    document.getElementById('divExternalMsgApproval').style.display = "none";
    document.getElementById('divViewLog').style.display = "none";
    document.getElementById('divSearchResource').style.display = "block";
    var resourceTbl_header = "";
    var resourcetable_element = "";
    var ResourceLIHTML = "";
    if (type == "Total" || type == "Booked" || type == "Free") {
        //Table Structure

        resourceTbl_header = "<thead><tr>";
        ResourceLIHTML = "<tbody>";
        //table binding for resources data
        resourceTbl_header = resourceTbl_header + "<th >Employee ID</th>"
        resourceTbl_header = resourceTbl_header + "<th >Employee Name</th>"
        resourceTbl_header = resourceTbl_header + "<th >Role Band</th>"
        resourceTbl_header = resourceTbl_header + "<th>Current Project</th>"
        resourceTbl_header = resourceTbl_header + "<th>Location</th>"
        resourceTbl_header = resourceTbl_header + "<th >Assignment End Date</th>"
        resourceTbl_header = resourceTbl_header + "</tr></thead>";

        //footer menu
        resourceTbl_header = resourceTbl_header + "<tfoot><tr>";
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + " </tr></tfoot>";
    }
    if (type == "Total") {
        $('.clssPopupHead').html("Complete Resource List");
        if (ResourcesResult.length > 0) {

            $.each(ResourcesResult, function (key, Resource) {
                var empData = [];
                var EmpID = Resource.EmployeeID;
                var EmpName = Resource.ResourceName;
                empData.push({
                    "EmployeeID": EmpID,
                    "ResourceFullName": EmpName
                });
                var RoleBand = Resource.Role_Band;
                var projectDetails = Resource.ProjectsData;
                var ProjectName = "";
                var Location = "";
                var EndDate = "";
                var Project_Manager = "";
                if (projectDetails.length > 1) {
                    var array2 = [];
                    var array_d1 = [];
                    var array_d2 = [];
                    var Projectdatacount = 0;
                    var Locationdatacount = 0;
                    var allocation = [];
                    var singleProjectAllocation = 0;
                    for (var k = 0; k < projectDetails.length; k++) {

                        projectDetails[k].EmployeeID = EmpID;
                        projectDetails[k].ResourceFullName = EmpName;

                        var endDate = projectDetails[k].Finishdatetime;
                        if (endDate != null && endDate != "") {
                            endDate = Date.parse(endDate);
                            array_d2.push(endDate);
                        }
                        if (projectDetails[k].ProjectName != projectDetails[0].ProjectName || (Projectdatacount == 0 || Projectdatacount == "0")) {
                            multipleAssignProject_Array.push(projectDetails[k]);
                            Projectdatacount++;
                            if (projectDetails[k].ProjectName == projectDetails[0].ProjectName && (Projectdatacount == 1 || Projectdatacount == "1")) {
                                singleProjectAllocation++;
                            } else {
                                singleProjectAllocation--;
                            }
                        }
                        else {
                            if (Projectdatacount > 0) {
                                multipleAssignProject_Array.push(projectDetails[k]);
                                singleProjectAllocation--;
                            }
                        }
                        if (projectDetails[k].Location != projectDetails[0].Location) {
                            Locationdatacount++;
                        }
                        allocation.push(projectDetails[k].Allocation);
                        Project_Manager = projectDetails[k].ProjectOwnerName;
                    }
                    var maxEndDate = Math.max.apply(Math, array_d2);
                    EndDate = formateRefinedDate(maxEndDate);
                    var allocationPer = Math.max.apply(Math, allocation);
                    ProjectName = (Projectdatacount > 0 && singleProjectAllocation != 1) ? "Multiple Assignment" : projectDetails[0].ProjectName;
                    Location = Locationdatacount > 0 ? "Multiple Location" : projectDetails[0].Location;
                } else {
                    if (projectDetails.length > 0) {
                        ProjectName = projectDetails[0].ProjectName;
                        Location = projectDetails[0].Location;
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? Date.parse(projectDetails[0].Finishdatetime) : "";
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? formateRefinedDate(EndDate) : "";

                    }
                }
                var ProjectNameHTML = "";
                if (ProjectName == "Multiple Assignment") {
                    ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                } else {
                    ProjectNameHTML = ProjectName;
                }
                ResourceLIHTML = ResourceLIHTML + "<tr id=" + EmpID + "><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td>" + EmpName + "</td><td>" + RoleBand + "</td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Location + "</td><td>" + EndDate + "</td></tr>"

            });

        }

    } else if (type == "Free") {
        $('.clssPopupHead').html("Deployable Resource List");

        $.each(ResourcesResult, function (key, Resource) {

            if (Resource.Allocation_Status == "FREE") {
                var empData = [];
                var EmpID = Resource.EmployeeID;
                var EmpName = Resource.ResourceName;
                empData.push({
                    "EmployeeID": EmpID,
                    "ResourceFullName": EmpName
                });
                var RoleBand = Resource.Role_Band;
                var projectDetails = Resource.ProjectsData;
                var ProjectName = "";
                var Location = "";
                var EndDate = "";
                var Project_Manager = "";
                if (projectDetails.length > 1) {
                    var array2 = [];
                    var array_d1 = [];
                    var array_d2 = [];
                    var Projectdatacount = 0;
                    var Locationdatacount = 0;
                    var allocation = [];
                    var singleProjectAllocation = 0;
                    for (var k = 0; k < projectDetails.length; k++) {

                        projectDetails[k].EmployeeID = EmpID;
                        projectDetails[k].ResourceFullName = EmpName;

                        var endDate = projectDetails[k].Finishdatetime;
                        if (endDate != null && endDate != "") {
                            endDate = Date.parse(endDate);
                            array_d2.push(endDate);
                        }
                        if (projectDetails[k].ProjectName != projectDetails[0].ProjectName || (Projectdatacount == 0 || Projectdatacount == "0")) {
                            multipleAssignProject_Array.push(projectDetails[k]);
                            Projectdatacount++;
                            if (projectDetails[k].ProjectName == projectDetails[0].ProjectName && (Projectdatacount == 1 || Projectdatacount == "1")) {
                                singleProjectAllocation++;
                            } else {
                                singleProjectAllocation--;
                            }
                        }
                        else {
                            if (Projectdatacount > 0) {
                                multipleAssignProject_Array.push(projectDetails[k]);
                                singleProjectAllocation--;
                            }
                        }
                        if (projectDetails[k].Location != projectDetails[0].Location) {
                            Locationdatacount++;
                        }
                        allocation.push(projectDetails[k].Allocation);
                        Project_Manager = projectDetails[k].ProjectOwnerName;
                    }
                    var maxEndDate = Math.max.apply(Math, array_d2);
                    EndDate = formateRefinedDate(maxEndDate);
                    var allocationPer = Math.max.apply(Math, allocation);
                    ProjectName = (Projectdatacount > 0 && singleProjectAllocation != 1) ? "Multiple Assignment" : projectDetails[0].ProjectName;
                    Location = Locationdatacount > 0 ? "Multiple Location" : projectDetails[0].Location;
                } else {
                    if (projectDetails.length > 0) {
                        ProjectName = projectDetails[0].ProjectName;
                        Location = projectDetails[0].Location;
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? Date.parse(projectDetails[0].Finishdatetime) : "";
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? formateRefinedDate(EndDate) : "";

                    }
                }
                var ProjectNameHTML = "";
                if (ProjectName == "Multiple Assignment") {
                    ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                } else {
                    ProjectNameHTML = ProjectName;
                }
                ResourceLIHTML = ResourceLIHTML + "<tr id=" + EmpID + "><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td>" + EmpName + "</td><td>" + RoleBand + "</td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Location + "</td><td>" + EndDate + "</td></tr>"
            }
        });



    } else if (type == "Booked") {
        $('.clssPopupHead').html("Allocated Resource List");
        $.each(ResourcesResult, function (key, Resource) {

            if (Resource.Allocation_Status == "BOOKED") {
                var empData = [];
                var EmpID = Resource.EmployeeID;
                var EmpName = Resource.ResourceName;
                empData.push({
                    "EmployeeID": EmpID,
                    "ResourceFullName": EmpName
                });
                var RoleBand = Resource.Role_Band;
                var projectDetails = Resource.ProjectsData;
                var ProjectName = "";
                var Location = "";
                var EndDate = "";
                var Project_Manager = "";
                if (projectDetails.length > 1) {
                    var array2 = [];
                    var array_d1 = [];
                    var array_d2 = [];
                    var Projectdatacount = 0;
                    var Locationdatacount = 0;
                    var allocation = [];
                    var singleProjectAllocation = 0;
                    for (var k = 0; k < projectDetails.length; k++) {

                        projectDetails[k].EmployeeID = EmpID;
                        projectDetails[k].ResourceFullName = EmpName;

                        var endDate = projectDetails[k].Finishdatetime;
                        if (endDate != null && endDate != "") {
                            endDate = Date.parse(endDate);
                            array_d2.push(endDate);
                        }
                        if (projectDetails[k].ProjectName != projectDetails[0].ProjectName || (Projectdatacount == 0 || Projectdatacount == "0")) {
                            multipleAssignProject_Array.push(projectDetails[k]);
                            Projectdatacount++;
                            if (projectDetails[k].ProjectName == projectDetails[0].ProjectName && (Projectdatacount == 1 || Projectdatacount == "1")) {
                                singleProjectAllocation++;
                            } else {
                                singleProjectAllocation--;
                            }
                        }
                        else {
                            if (Projectdatacount > 0) {
                                multipleAssignProject_Array.push(projectDetails[k]);
                                singleProjectAllocation--;
                            }
                        }
                        if (projectDetails[k].Location != projectDetails[0].Location) {
                            Locationdatacount++;
                        }
                        allocation.push(projectDetails[k].Allocation);
                        Project_Manager = projectDetails[k].ProjectOwnerName;
                    }
                    var maxEndDate = Math.max.apply(Math, array_d2);
                    EndDate = formateRefinedDate(maxEndDate);
                    var allocationPer = Math.max.apply(Math, allocation);
                    ProjectName = (Projectdatacount > 0 && singleProjectAllocation != 1) ? "Multiple Assignment" : projectDetails[0].ProjectName;
                    Location = Locationdatacount > 0 ? "Multiple Location" : projectDetails[0].Location;
                } else {
                    if (projectDetails.length > 0) {
                        ProjectName = projectDetails[0].ProjectName;
                        Location = projectDetails[0].Location;
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? Date.parse(projectDetails[0].Finishdatetime) : "";
                        EndDate = projectDetails[0].Finishdatetime != "" && projectDetails[0].Finishdatetime != null ? formateRefinedDate(EndDate) : "";
                    }
                }
                var ProjectNameHTML = "";
                if (ProjectName == "Multiple Assignment") {
                    ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this)'>" + ProjectName + "</a>";
                } else {
                    ProjectNameHTML = ProjectName;
                }
                ResourceLIHTML = ResourceLIHTML + "<tr id=" + EmpID + "><td id=" + EmpID + "#;" + EmpName + ">" + EmpID + "</td><td>" + EmpName + "</td><td>" + RoleBand + "</td><td id=" + EmpID + "#" + EmpName + "#" + Project_Manager + ">" + ProjectNameHTML + "</td><td>" + Location + "</td><td>" + EndDate + "</td></tr>"
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
    $('.popup-bg').show();
}
function resultsetProfile(Url) {
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
            result = data.d;
        },
        error: function (error) {
            result = 'error';
        }
    });
    return result;
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
function convert_date_DDMMYYYY(date_to_convert) {
    if (date_to_convert.indexOf('T') >= 0) {
        var arr_dateandtime = date_to_convert.split('T');

    } else {
        var arr_dateandtime = date_to_convert.split(' ');
    }
    var arr_dateonly = arr_dateandtime[0].split('-');
    var MonthName = GetMonthName(arr_dateonly[1]);
    converted_date = arr_dateonly[2] + "-" + MonthName + "-" + arr_dateonly[0];
    return converted_date;
}
function formateRefinedDate(date) {
    var resultdate = "";
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate());
    var tempDate_array = newdate.toDateString().split(' ');

    resultdate = tempDate_array[2] + "-" + tempDate_array[1] + "-" + tempDate_array[3];
    return resultdate;
}
function GetMonthName(monthNumber) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1];
}
function ShowMultipleAssignmentProjectsDetails(event, Flag) {
    if (event.firstChild.nodeValue == "Multiple Assignment") {
        var eid = event.parentNode.id.split('#')[0];//.parentNode.parentNode.childNodes[1].innerText;
        var eName = event.parentNode.id.split('#')[1];//event.parentNode.parentNode.childNodes[2].innerText;       
        document.getElementById('divMultipleAssignment').style.display = 'block';

        $('.TopclssPopupHead').text('Multiple Assignment of : ' + eName + ' | ' + eid);
        $('.Toppopup h4').css('text-align', 'left');
        if ($.fn.dataTable.isDataTable('#tblMultipleAssignment')) {
            destroyjs('#tblMultipleAssignment');
        }
        var resourceTbl_header = "";
        var resourcetable_element = "";
        resourceTbl_header = "<thead><tr>";
        var ResourceLIHTML = "<tbody>";
        //table binding for resources data

        resourceTbl_header = resourceTbl_header + "<th>Project Name</th>"
        resourceTbl_header = resourceTbl_header + "<th>Start Date</th>"
        resourceTbl_header = resourceTbl_header + "<th>End Date</th>"
        resourceTbl_header = resourceTbl_header + "<th>Allocation %</th>"
        resourceTbl_header = resourceTbl_header + "<th>Project Manager</th>"
        resourceTbl_header = resourceTbl_header + "<th>Work Location</th>"
        resourceTbl_header = resourceTbl_header + "<th>Fulfillment Type</th>"
        resourceTbl_header = resourceTbl_header + "</tr></thead>";

        //footer menu
        resourceTbl_header = resourceTbl_header + "<tfoot><tr>";


        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"
        resourceTbl_header = resourceTbl_header + "<th></th>"

        resourceTbl_header = resourceTbl_header + " </tr></tfoot>";
        if (multipleAssignProject_Array.length > 0) {
            $.each(multipleAssignProject_Array, function (index, value) {
                if (eid == value.EmployeeID) {
                    var EmpID = "";
                    var EmpName = "";
                    var Designation = "";
                    var projectcode = "";
                    var ProjectName = "";
                    var ProjectstartDate = "";
                    var ProjectEnddate = "";
                    var allocationPercent = ""
                    var Location = "";
                    var projectManager = "";
                    var projectCode = "";
                    var Type = "";
                    //if (value.EmployeeID != null) {
                    //    EmpID = value.EmployeeID;
                    //}
                    //if (value.ResourceFullName != null) {
                    //    EmpName = value.ResourceFullName;
                    //}
                    if (value.Designation != null) {
                        Designation = value.Designation;
                    }
                    if (value.ProjectName != null) {
                        ProjectName = value.ProjectName;

                    }
                    if (value.ProjectCode != null) {
                        projectCode = value.ProjectCode;
                        projectManager = value.ProjectOwnerName;
                    }
                    if (value.Startdatetime != null && value.Startdatetime != "") {
                        ProjectstartDate = value.Startdatetime;
                        var date1 = Date.parse(ProjectstartDate);
                        ProjectstartDate = formateRefinedDate(date1);
                    }
                    if (value.Finishdatetime != null && value.Finishdatetime != "") {
                        ProjectEnddate = value.Finishdatetime;
                        var date2 = Date.parse(ProjectEnddate);
                        ProjectEnddate = formateRefinedDate(date2);
                    }
                    if (value.Allocation != null) {
                        allocationPercent = value.Allocation;
                    }
                    if (value.Location != null) {
                        Location = value.Location;
                    }
                    if (value.Flag != null) {
                        Type = value.Flag;
                    }

                    ResourceLIHTML = ResourceLIHTML + "<tr><td>" + ProjectName + "</td><td>" + ProjectstartDate + "</td><td>" + ProjectEnddate + "</td><td>" + allocationPercent + "</td><td>" + projectManager + "</td><td>" + Location + "</td><td>" + Type + "</td></tr>"
                }
            })
            ResourceLIHTML = ResourceLIHTML + "</tbody>";
            resourcetable_element = resourceTbl_header + ResourceLIHTML;
            $("#tblMultipleAssignment").append(resourcetable_element);

            $('#tblMultipleAssignment').DataTable({
                "dom": 'Rlfrtip',
                "iDisplayLength": 5,
                "lengthMenu": [[5, 15, 35, -1], [5, 15, 35, "All"]],
                "pagingType": "simple_numbers"
            });

            $('#tblMultipleAssignment tfoot th').each(function () {
                var title = $(this).text();
                if (title != 'Action' && title != 'Indicators') {
                    $(this).html('<input type="text" placeholder="Search ' + title + '" />');
                }
            });

            // DataTable
            var table = $('#tblMultipleAssignment').DataTable();

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
            $('.Toppopup-bg').show();

        }
    }

}
