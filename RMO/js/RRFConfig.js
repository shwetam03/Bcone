pwaurl = "https://ppmprod.bcone.com/";
SharepointOnlineUrlpwa = "https://bristleconeonline.sharepoint.com/sites/pwa/";
NonBillableStatus = "";
NonApprovers = "";
RRFRowID = "";
LogProjectGUID = "";
SharePointListId = "";
//Search Dropdown in Resource

function getPWAURl() {
    return "" + pwaurl + "";
}

function getSiteURl() {
    return "" + SharepointOnlineUrlpwa + "";
}

function GetResource() {
    return "" + pwaurl + "_api/Resources";
}

function GetCurrentUserData() {
    return "" + SharepointOnlineUrlpwa + "/_api/web/currentuser";
}

function GetProjects(ProjectId) {
    return "" + pwaurl + "_api/Projects?$filter=ProjectId eq (guid'" + ProjectId + "')";
}

function GetProjectWiseResourceAllocation(ProjectCode, empId) {
    return "" + pwaurl + "_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq'" + ProjectCode + "' and EmployeeID eq'" + empId + "'";
}

function ProjectWiseAllocation() {
    return "" + pwaurl + "/_api/ProjectWiseResourceAllocation";
}


function EmployeeAvailability() {
    return "" + pwaurl + "api/RMO/EmployeeAvailability";
}


function Subpractice(sub_pracitc) {
    return "" + pwaurl + "_api/Skills?$filter=Sub_Practice eq'" + sub_pracitc + "'";
}

//Get Value and RRFUID from RRF Master

function GetRoleBand() {
    return "" + pwaurl + "_api/RRFMaster?$select=Value,RRF_Uid&$filter=Type eq'RoleBand'";
}

function getCodeEmployeeType(employetype) {
    return "" + pwaurl + "_api/RRFMaster?$filter=Type eq 'EmployeeTypeId' and Value eq '" + employetype + "'&$orderby=Code asc"
}

function EmployeeSkill(PrimarySkill) {
    return "" + pwaurl + "_api/EmployeeSkills?$filter=Skill_Type eq 'Primary' and Skill_Detail eq'" + PrimarySkill + "'";
}

//---------------------------------------------------------------------------//

//Get Non Billable Workflow approval
function getApproverNames(GBU, RRFRowID, LogProjectGUID, Approver1SharePointId) {
    RRFRowID = RRFRowID;
    LogProjectGUID = LogProjectGUID;
	
	if (GBU.indexOf('&') > -1) {
                    GBU = GBU.replace('&', '%26');
                }
    //var ApproverValue = "";
    $.ajax({
        url: "../_api/web/lists/getbytitle('RRFGBUMAPPING')/Items?$Filter=GBU eq '" + GBU + "'",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            //ApproverValue = insertDataToApprovalTransaction(data, "0", Approver1SharePointId);
            getSharePointNonBilListId(RRFRowID, LogProjectGUID)
            insertDataToApprovalTransaction(data, "0", Approver1SharePointId, RRFRowID, LogProjectGUID);
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    //return ApproverValue;

}

// Insert Data to Non Billable transaction Approval List
function insertDataToApprovalTransaction(data, Flag, Approver1SharePointId, RRFRowID, LogProjectGUID) {
    var Approver = "";
    var NonBillableId = "";
    var item = {
        __metadata: { "type": "SP.Data.NonBillableApprovalTransactionListItem" }
    };

    if (Flag == "1") {
        if (data.d.results[0].Flag == 0) {
            $.extend(item, { Flag: 1 });
            Approver = data.d.results[0].Approver2Id;
            NonBillableId = data.d.results[0].ID;
            NonBillableStatus = "FPNA";
        }
        else if (data.d.results[0].Flag == 1) {
            $.extend(item, { Flag: 2 });
            Approver = data.d.results[0].Approver3Id;
            NonBillableId = data.d.results[0].ID;
            NonBillableStatus = "Recruitment Head";
        }
        else if (data.d.results[0].Flag == 2) {
            $.extend(item, { Flag: 3 });
            Approver = data.d.results[0].Approver4Id;
            NonBillableId = data.d.results[0].ID;
            NonBillableStatus = "VPHR";
        }
        else if (data.d.results[0].Flag == 3) {
            $.extend(item, { Flag: 4 });
            Approver = -1;
            NonBillableId = data.d.results[0].ID;
            NonBillableStatus = "External Hiring";
        }
    }
    else if (Flag == "0") {
        Approver = Approver1SharePointId;
        var Apporver2 = data.d.results[0].FPNAId;
        var Apporver3 = data.d.results[0].RecruitmentHeadId;
        var Apporver4 = data.d.results[0].VPHRId;
        var RRFNo = String(RRFRowID);
        $.extend(item, { Approver1Id: Approver1SharePointId });
        $.extend(item, { Approver2Id: data.d.results[0].FPNAId });
        $.extend(item, { Approver3Id: data.d.results[0].RecruitmentHeadId });
        $.extend(item, { Approver4Id: data.d.results[0].VPHRId });
        $.extend(item, { RRFNo: RRFNo });
        $.extend(item, { ProjectGUID: LogProjectGUID });
        $.extend(item, { Flag: 0 });
        NonApprovers = Approver + ',' + Apporver2 + ',' + Apporver3 + ',' + Apporver4;

        //NonBillableStatus ="Non Billable";
    }
    if (NonBillableId != "") {
        SharePointListId = NonBillableId;
    }

    if (SharePointListId != "") {

        $.ajax({
            url: "../_api/Web/Lists/GetByTitle('NonBillableApprovalTransaction')/getItemById(" + SharePointListId + ")",
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
            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    }
    else {

        $.ajax({
            url: "../_api/Web/Lists/GetByTitle('NonBillableApprovalTransaction')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            async: false,
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {

            },
            error: function (error) {
                alert(JSON.stringify(error));
            }
        });
    }
    return Approver;
}

//Get Sharepoint List Id

function getSharePointNonBilListId(RRFRowID, LogProjectGUID) {

    $.ajax({
        url: "../_api/web/lists/getbytitle('NonBillableApprovalTransaction')/Items?$Filter=RRFNo eq '" + RRFRowID + "' and ProjectGUID eq '" + LogProjectGUID + "'",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                SharePointListId = data.d.results[0].Id;
            }
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return SharePointListId;
}


//GetApprovalName

function getApprover2Name(RRFRowID, LogProjectGUID) {
    var ApproverValue = "";
    $.ajax({
        url: "../_api/web/lists/getbytitle('NonBillableApprovalTransaction')/Items?$Filter=RRFNo eq '" + RRFRowID + "' and ProjectGUID eq '" + LogProjectGUID + "'",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                ApproverValue = insertDataToApprovalTransaction(data, "1");
            }
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return ApproverValue;
}

//-----------------------------------------------------//


// Abhay  Opertunity Code

function GetOpertunityApprovalName(GBU) {
    var ApproverId = "";
    $.ajax({
        url: "../_api/web/lists/getbytitle('RRFGBUMAPPING')/Items?$select=FPNA/Title,RMOSPOC/Title,FPNA/Id,RMOSPOC/Id&$expand=FPNA/Id,RMOSPOC/Id&$Filter=GBU eq '" + GBU + "'",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
			if(data.d.results.length > 0 )
			{
				var FPNAID = data.d.results[0].FPNA.Id;
				var FPNATitle = data.d.results[0].FPNA.Title;
				var RMOSPOCId = data.d.results[0].RMOSPOC.Id;
				var RMOSPOCName = data.d.results[0].RMOSPOC.Title;
				ApproverId = "" + FPNAID + "#" + RMOSPOCId + "#" + FPNATitle + "#" + RMOSPOCName + "";
			}
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return ApproverId;
}

// Get Project Manager ID

function getProjectManagerEmail(GUID, GBU, RRFRowID, LogProjectGUID) {
    var ResourceUrl = "" + pwaurl + "_api/Resources?$filter=ResourceId eq guid'" + GUID + "'";
    var ApproverId = "";
    $.ajax({
        url: ResourceUrl,
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
			if(data.d.results.length > 0)
			{
				var SharePointId = getSharePointUserID(data.d.results[0].ResourceEmailAddress);
				var Email = data.d.results[0].ResourceEmailAddress;
				var EmpoyeeID = data.d.results[0].EmployeeID;
				ApproverId = "" + SharePointId.split('#')[0] + "#" + Email + "#" + EmpoyeeID + "";
				//getApproverNames(GBU, RRFRowID, LogProjectGUID, SharePointId.split('#')[0]);
			}
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return ApproverId;
}

function getSharePointUserID(Email) {

    var SharePointUserId = "";
    $.ajax({
        url: "../_api/web/siteusers?$Filter=Email eq '" + Email + "'",
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
			if(data.d.results.length > 0)
			{
				var SharePointUser = data.d.results[0].Id;
				var SharePointUserTitle = data.d.results[0].Title;
				SharePointUserId = "" + SharePointUser + "#" + SharePointUserTitle + "";
			}
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return SharePointUserId;
}

function getResourceEmpIdEmpName(Email) {
    var EmployeeIdName = "";
    var url = "" + pwaurl + "_api/WorkdayResourceMaster?$select=EmployeeID,First_Name,Middle_Name,Lat_Name&$filter=Work_Email eq '" + Email + "'";
    $.ajax({
        url: url,
        async: false,
        method: "GET",
        headers: {
            "Accept": "application/json;odata=verbose"
        },
        success: function (data) 
		{
			if(data.d.results.length>0)
			{
				EmployeeIdName = data.d.results[0].EmployeeID + "#" + data.d.results[0].First_Name + " " + data.d.results[0].Middle_Name + " " + data.d.results[0].Lat_Name;
			}
		},
        error: function (error) {
            result = 'error';
            console.log(JSON.stringify(error));
        }

    });
    return EmployeeIdName;
}
//get user Role from Resources API using Email address
function GetCurrentUserRole(currentuserEmailAddress) {
    //https://ppmprod.bcone.com/_api/Resources?$filter=Role%20ne%20null%20&$filter=ResourceEmailAddress%20eq%20%27spdevadmin@bcone.com%27    
    var ResourceUrl = pwaurl + "_api/Resources?$filter=ResourceEmailAddress eq '" + currentuserEmailAddress + "'";
    var userRoleEmpID = "";
    $.ajax({
        url: ResourceUrl,
        async: false,
        headers: { "Accept": "application/json;odata=verbose" },
        success: function (data) {
			if(data.d.results.length > 0)
			{
				var userRole = data.d.results[0].Role;
				var Empl_ID = data.d.results[0].EmployeeID;
				userRoleEmpID = userRole + ";" + Empl_ID;
			}
        },
        error: function (error) {
            alert(JSON.stringify(error));
        }
    });
    return userRoleEmpID;
}



// Allocation percentage

function searchresourceAllocationPercentResource(ProjectStrtdate, Employee_ID) {
    return "" + pwaurl + "_api/ProjectWiseResourceAllocation?$filter=(Finishdatetime lt datetime'" + ProjectStrtdate + "'or Allocation lt 100) and EmployeeID eq '" + Employee_ID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and Active eq 1";
}

// Search resources info using WorkdayResourceMaster
function searchResourceWorkdayResourceMaster(RolBand, PrimarySkill, SecondrySkill) {
    return pwaurl + "_api/WorkdayResourceMaster?$select=EmployeeID,Designation,Employee_status,Work_Email&$filter=Role_Band eq'" + RolBand + "' and (PrimarySkill eq'" + PrimarySkill + "' or secondarySkill eq'" + SecondrySkill + "')";
}
//search resource info using ProjectWiseResourceAllocation
function searchResourceProjectWiseResourceAllocation(projectStrtdate, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=(Finishdatetime lt datetime'" + projectStrtdate + "'or Allocation lt 100) and EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and Active eq 1"; //2017-08-29T19:00:00
}
//Search resources info using WorkdayResourceMaster using empID
function searchResourceWorkdayResourceMasterUsingEmpid(Employee_ID) {
    return pwaurl + "_api/WorkdayResourceMaster?$select=EmployeeID,Designation,Employee_status,Work_Email&$filter=EmployeeID eq'" + Employee_ID + "'";
}
//search resource info using ProjectWiseResourceAllocation using empid
function searchResourceProjectWiseResourceAllocationUsingEmpid(EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=EmployeeID eq '" + EmployeeID + "'and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and Active eq 1"; //2017-08-29T19:00:00
}
function getProjectwiseProjectManagername(ProjectCode) {
    return pwaurl + "_api/Projects?$select=ProjectOwnerName&$filter=ProjectCode eq'" + ProjectCode + "'";
}
//find role from workdayResourcemaster
function getRolebandworkdayresourcemasterusinfempid(EmployeeId) {
    return pwaurl + "_api/WorkdayResourceMaster?$select=Role_Band&$filter=EmployeeID eq'" + EmployeeId + "'";
}
function getProjectTeamusingEmpid(EmployeeId) {
    return pwaurl + "_api/ProjectTeam?$filter=EmployeeID eq'" + EmployeeId + "'&$top=20";
}
function getDetailsProjectwiseresourceAllocationUsingPnameEmpid(projectname, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=ProjectName eq'" + projectname + "' and EmployeeID eq'" + EmployeeID + "'";
}
function getProjectOwnerusingProjectname(ProjectName) {
    return pwaurl + "_api/Projects?$select=ProjectOwnerName&$filter=ProjectName eq'" + ProjectName + "'";
}
function getDetailsProjectwiseresourceAllocationUsingPCodeEmpid(ProjectCode, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq'" + ProjectCode + "' and EmployeeID eq'" + EmployeeID + "'and Active eq 1&$top=1&$orderby=created_date%20desc";
}
function updateProjectWiseResourceAllocationByActiveflag(ResAllo_UID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation(guid'" + ResAllo_UID + "')";
}
function getProjectWiseResourceAllocationDetailsofAllocatedResource(EmployeeID) {
    //return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq 'Early Release')&$orderby=created_date%20desc";
    //changed by manohar internalID desc
	return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq 'Early Release')&$orderby=InternalID%20desc";
}
function getProjectWiseResourceAllocationDetail(EmployeeID) {
    //return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq 'Early Release')&$orderby=created_date%20desc";
    //changed by manohar internalID desc
	return pwaurl + "_api/ProjectDetailsPage?$filter=EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq 'Early Release')&$orderby=InternalID%20desc";
}
function searchResourcefromResources(RolBand, PrimarySkill, SecondrySkill) {
    return pwaurl + "_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName,OrganisationDOJ,SubPractice,BaseLocation&$filter=(substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill)) and EmployeeStatus ne'Terminated'";                                           //(PrimarySkill eq'" + PrimarySkill + "' or Skill eq'" + SecondrySkill + "')";
    //"_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName,OrganisationDOJ,SubPractice&$filter=RoleBand eq'" + RolBand + "' and (substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill))"

}
function searchResourcefromResourcesUsingEmpid(Employee_ID) {
    return pwaurl + "_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName,ResourceId,OrganisationDOJ,SubPractice,PrimarySkill,BaseLocation&$filter=EmployeeID eq'" + Employee_ID + "'";
}

function getSupportDocUrl(Folder_name, FileLeafRef) {
    return "../_layouts/15/download.aspx?SourceUrl=https://bristleconeonline.sharepoint.com/sites/pwa/RRFSupportDocument/" + Folder_name + "/" + FileLeafRef + "";
}

function getUploadFileURL(NewItemID, fileName) {
    return String.format("{0}/_api/web/GetFolderByServerRelativeUrl('/sites/pwa/RRFSupportDocument/" + NewItemID + "')/Files/Add(url='{1}', overwrite=true)", _spPageContextInfo.webAbsoluteUrl, fileName);
}
function getFolderURL() {
    return "/sites/pwa/RRFSupportDocument";
}
function getRRFMasterEmpRole() {
    return pwaurl + "_api/RRFMaster?$select=Value&$filter=Type eq 'EmployeeRoles'";
}
function getResourceName() {
    return pwaurl + "api/BCONE/GetResourceNames";
}
function getRolewiseResourcesData() {
    return pwaurl + "api/rmo/EmployeeAvailability_RoleWise";
}
function getProjectOwnerusingProjectCode(ProjectCode) {
    return pwaurl + "_api/Projects?$select=ProjectOwnerName,ProjectName&$filter=ProjectCode eq'" + ProjectCode + "'";
}
function getuserinRMOSuperUsergroup(currentuserloginid) {
    return SharepointOnlineUrlpwa + "_api/Web/GetUserById('" + currentuserloginid + "')/Groups?$select=Id,Title&$filter=Title%20eq%20%27_RMOSuperUser%27";
}
function searchResourceProjectWiseResourceAllocationNew(projectStrtdate, ProjectEnddate, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100) and EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and (Active eq 1 or Active eq 2)"; //2017-08-29T19:00:00
}
function getAllResourcesData() {
    return pwaurl + "_api/Resources?$select=EmployeeID,ResourceName,RoleBand,PrimarySkill,Skill,Designation,BaseLocation,EmployeeStatus,ResourceEmailAddress";

}
function searchresourceAllocationPercentResourceNew(projectStrtdate, ProjectEnddate, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100) and EmployeeID eq '" + EmployeeID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and (Active eq 1 or Active eq 2)"; //2017-08-29T19:00:00
}
function getResourceInfoByEmailID(EmailAddress) {
    return pwaurl + "_api/Resources?$select=EmployeeID,ResourceName&$filter=ResourceEmailAddress eq'" + EmailAddress + "'";
}
function getDetailsProjectwiseresourceAllocationUsingPCodeEmpidFuture(ProjectCode, EmployeeID) {
    return pwaurl + "_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq'" + ProjectCode + "' and EmployeeID eq'" + EmployeeID + "'and Active eq 2&$top=1&$orderby=created_date%20desc";
}
function getuserinRMOUsergroup(currentuserloginid) {
    return SharepointOnlineUrlpwa + "_api/Web/GetUserById('" + currentuserloginid + "')/Groups?$select=Id,Title&$filter=Title%20eq%20%27_RMO%27";
}

function getDocumntUploadURL(RRFNO, fileName) {
    var url = String.format(
              "{0}/_api/web/GetFolderByServerRelativeUrl('/sites/pwa/RMOResourceDocuments/" + RRFNO + "')/Files/Add(url='{1}', overwrite=true)",
            _spPageContextInfo.webAbsoluteUrl, fileName);
    return url;
}
function getResourcesDocUrl(Folder_name, FileLeafRef) {
    return "../_layouts/15/download.aspx?SourceUrl=https://bristleconeonline.sharepoint.com/sites/PWA/RMOResourceDocuments/" + Folder_name + "/" + FileLeafRef + "";
}
function searchResourceNewResourceAllocationData(projectStrtdate, ProjectEnddate, PrimarySkill, SecondrySkill) {
    //return pwaurl + "_api/ResourceallocationdataSearch?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100)and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null) and (substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill))";
	//return pwaurl + "_api/ResourceallocationdataSearch?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100)and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null) and (substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill) or substringof('" + SecondrySkill + "',Skill) or (substringof('" + PrimarySkill + "',PrimarySkill))";
	
    //return pwaurl + "_api/ResourceallocationdataSearch?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100)and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null) and (substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill) or substringof('" + PrimarySkill + "',Skill) or (substringof('" + SecondrySkill + "',PrimarySkill)))";
	//as per shwetha demand i check Activeflag 2
    return pwaurl + "_api/ResourceallocationdataSearch?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100)and (flag ne'Soft Block') and (ActiveFlag eq 1 or ActiveFlag eq null or ActiveFlag eq 2) and (substringof('" + PrimarySkill + "',PrimarySkill) or substringof('" + SecondrySkill + "',Skill) or substringof('" + PrimarySkill + "',Skill) or (substringof('" + SecondrySkill + "',PrimarySkill)))";
	
}
function searchResourceNewResourceAllocationDataWithoutSkillusingEmployeeID(EmployeeID) {
    return pwaurl + "_api/ResourceallocationdataSearch?$filter=EmployeeID eq '" + EmployeeID + "' and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null or ActiveFlag eq 2)"
}
function searchResourceNewResourceAllocationDataUsingEmployeeID(projectStrtdate, ProjectEnddate, EmployeeID) {
	
    //return pwaurl + "_api/ResourceallocationdataSearch?$filter=(((Startdatetime ge datetime'" + projectStrtdate + "' and Startdatetime le datetime'" + ProjectEnddate + "') or (Finishdatetime ge datetime'" + projectStrtdate + "' and Finishdatetime le datetime'" + ProjectEnddate + "')or(datetime'" + projectStrtdate + "' ge Startdatetime and datetime'" + projectStrtdate + "' le datetime'" + ProjectEnddate + "')or(datetime'" + ProjectEnddate + "' ge Startdatetime and datetime'" + ProjectEnddate + "' le Finishdatetime))or Allocation lt 100)and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null) and EmployeeID eq '" + EmployeeID + "'";//manohar change 9 oct 2018
    return pwaurl + "_api/ResourceallocationdataSearch?$filter=(EmployeeID eq '" + EmployeeID + "') and (flag ne'Soft Block' and flag ne'NA') and (ActiveFlag eq 1 or ActiveFlag eq null or ActiveFlag eq 2)";
}
function rmobyResource(emp_ID){
	return pwaurl+"_api/ProjectWiseResourcesAllocationWithRMO?$select=RMOSpocId,SubPracticeMailBox&$filter=EmployeeID eq'" + emp_ID + "'&$top=1";
}
