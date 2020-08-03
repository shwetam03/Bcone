ppmuaturl="https://ppmprod.bcone.com/";
SharepointOnlineUrlppmuat="https://bristleconeonline.sharepoint.com/sites/pwa/";

var CurDateToFifteenthDateFormat="";
var CurDateFormat="";
CurDateFormat=FilterCurrentDateFormat();
CurDateToFifteenthDateFormat=FilterFifteenDateFormat();
function getppmuatURl()
{
	return ppmuaturl;
}
function GetListName(ProjectListName)
{
   return ""+SharepointOnlineUrlppmuat+"_api/Web/Lists/GetByTitle('"+ProjectListName+"')/items";
}

function GetListDataByProjectCode(ProjectCode)
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceReleaseExtensionApprovalMaster')/items?$filter=ProjectCode eq '"+ProjectCode+"'";
	
}
function GetRequestedDataByEmpIdandResType(ProjectGUID,ResourceType)
{
	//return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$filter=ProjectGUID eq '"+ProjectGUID+"' and ApprovalStatus eq 'Pending'&$select=*,PendingWithUserID/Title&$expand=PendingWithUserID";
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$select=*,PendingWithUserID/Title&$expand=PendingWithUserID&$filter=ProjectGUID eq '"+ProjectGUID+"' and ApprovalStatus eq 'Pending' and ResourceType eq '"+ResourceType+"'&$top=100000";
		
	
}
function GetProjectDataByPUID(ProjectUID)
{
	
	return ""+ppmuaturl+"_api/Projects?$select=ProjectOwnerName,ProjectCode,ProjectName,RMOSPOC,ProjectOwnerId,ClientPartner,GBU,ProjectFinishDate,EnterpriseProjectTypeName&$filter=ProjectId eq guid'"+ProjectUID+"'";
}

function GetResourceDataFromMspByPCode(PCode,ResourceType,flag)
{
	
	if(ResourceType=="Early Release")
	{
		if(flag=='1')
		{
		return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq '"+PCode+"' and Active eq 1 and ((Finishdatetime ge datetime'"+CurDateFormat+"') and (Finishdatetime le datetime'"+CurDateToFifteenthDateFormat+"'))  and (Flag eq 'Internal' or Flag eq 'New' or Flag eq 'new'or Flag eq 'Extension'or Flag eq 'Early Release')&$orderby=modify_date desc";
		}
		if(flag=='2')
		{
			return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq '"+PCode+"' and Active eq 1 and (Flag eq 'Internal' or Flag eq 'New' or Flag eq 'new'or Flag eq 'Extension'or Flag eq 'Early Release')&$orderby=modify_date desc";
		}
		if(flag=='3')
		{
			return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq '"+PCode+"' and Active eq 2 and (Flag eq 'Internal' or Flag eq 'New' or Flag eq 'new'or Flag eq 'Extension'or Flag eq 'Early Release')&$orderby=modify_date desc";
		}
		
	}
	
	if(ResourceType=="Extension")
	{
		if(flag=='1')
		{
		return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq '"+PCode+"' and Active eq 1 and ((Finishdatetime ge datetime'"+CurDateFormat+"') and (Finishdatetime le datetime'"+CurDateToFifteenthDateFormat+"'))  and (Flag eq 'Internal' or Flag eq 'New' or Flag eq 'new'or Flag eq 'Extension'or Flag eq 'Early Release')&$orderby=modify_date desc";
		}
		if(flag=='2')
		{
			return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=AllocatedProjectCode eq '"+PCode+"' and Active eq 1 and (Flag eq 'Internal' or Flag eq 'New' or Flag eq 'new'or Flag eq 'Extension'or Flag eq 'Early Release')&$orderby=modify_date desc";
		}
		if(flag == '3')
		{
			return ""+ppmuaturl+"_api/GetLastInacticeResources?$filter=AllocatedProjectCode eq '"+PCode+"'";
		}
	}
	
	
}

function GetResourceDataByEmpCode(IDval,flag)
{
	if(flag==1)
	{
		return ""+SharepointOnlineUrlppmuat+"_api/ProjectData/Resources?$filter=EmployeeID eq '"+IDval+"'&$select=ResourceEmailAddress,ResourceName";
	}
	else
		if(flag==2){
			return ""+SharepointOnlineUrlppmuat+"_api/ProjectData/Resources?$Select=ResourceId&$filter=EmployeeID eq '"+IDval+"'";
		}
		if(flag==3)
		{
			return ""+SharepointOnlineUrlppmuat+"_api/ProjectData/Resources(guid'"+IDval+"')?$select=ResourceEmailAddress,ResourceName";
		}
}

function GetVPDeliveryByRMO(GBU)
{
	return ""+ppmuaturl+"_api/WorkdayResourceMaster?$top=1&$filter=Role_Band eq 'RB 7'& GBU='"+GBU+"'";
}

function GetSpidByResEmailID(EmailId)
{
	
	return ""+SharepointOnlineUrlppmuat+"_api/web/siteusers?$filter=Email eq '"+EmailId+"'&$select=Id";
	
}
//For Approval Page
function GetDataFromApprovalMaster(Uid,flag)
{
	if(flag==1)
	{
		return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$filter=PendingWith eq '"+Uid+"'";
	}
	else
		if(flag==2)
		{
			return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$select=*,PendingWithUserID/Title&$expand=PendingWithUserID&$filter=PendingWith eq '"+Uid+"' and ApprovalStatus eq 'Pending'";
		}
}

function GetApprovaDataBySuperUser()
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$select=*,PendingWithUserID/Title&$expand=PendingWithUserID&$filter= ApprovalStatus eq 'Pending'&$top=2000";	
}

function GetApprovalDataByID(id)
{
	//return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$filter=ReleaseExtensionMasterIDId eq '"+id+"'";
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$select=*,PendingWithUserID/Title&$expand=PendingWithUserID&$filter=PendingWith eq '"+id+"' and ApprovalStatus eq 'Pending'";
}

function GetDataByRowId(RowID,flag)
{
	if(flag==1)
	{
		return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceReleaseExtensionApprovalMaster')/GetItemById('" +RowID+ "')";
	}
	else
		if(flag==2)
		{
			//return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$filter=ReleaseExtensionMasterIDId eq '"+RowID+"'";
			return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/GetItemById("+RowID+")";
		}
	
}

function GetDataDetailsByID(id)
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/GetItemById("+id+")";
	
}

function GetskillsDataByPid(pName,eid)
{
	
	return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$top=1&$filter=Active eq 1 and EmployeeID eq '"+eid+"' and AllocatedProjectCode eq '"+pName+"'&order by modify_date desc";
}

function GetResourceDetails()
{
	return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation";

}

//Skills Details

function GetEmpSkillsPivot()
{
	return ""+ppmuaturl+"_api/EmployeeSkillsPivot";
	
}

function GetSkillData(value,OptionValue)
{
	if(value==1)
	{
		return ""+ppmuaturl+"_api/Skills/Distinct?$select=Skill_Stream";
	}
	else
		if(value==2)
		{
		   return ""+ppmuaturl+"_api/Skills?$filter=Skill_Stream+eq" + encodeURIComponent("'" + OptionValue + "'") + "";
			
		}

}

function GetEmpSkillsByGuid(guid,flag)
{
	if(flag==1)
	{
		return ""+ppmuaturl+"_api/EmployeeSkills";
	}
	else
		if(flag==2)
		{
			return ""+ppmuaturl+"_api/EmployeeSkills(guid'" + guid + "')"; //harshith code
			
		}
}

function UpdateWorkDayMasterByEmpid(Eid)
{
	return ""+ppmuaturl+"_api/WorkdayResourceMaster('"+Eid+"')";

}

function GetSkills()
{
	
	return ""+ppmuaturl+"_api/Skills";
}
function GetSubPracticeVal(SubPracticeVal)
{
	
	return ""+ppmuaturl+"_api/Skills?$filter=Sub_Practice+eq'"+SubPracticeVal+"'";
		
}

function GetorSetSkillsByRowId(RowId)
{
	
	return ""+ppmuaturl+"_api/Skills(guid'" + RowId + "')";
}

function GetDistinctValue()
{
return ""+ppmuaturl+"_api/Skills/Distinct";
	
}

function GetNewDistinctDataUrl()
{
	return ""+ppmuaturl+"api/Distinct/DistinctSkill";
}

function GetDistinctValue_OnParameters()
{
	return ""+ppmuaturl+"api/Distinct/DistinctSkillValue";
}

//Check Avilability Extension.js
function CheckResourceAvailability(RevisedStartDate,EmpID)
{	
	//return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=(datetime'" + RevisedStartDate + "' lt Finishdatetime or Allocation lt 100) and EmployeeID eq '" + EmpID + "'";
	return ""+ppmuaturl+"_api/ProjectWiseResourceAllocation?$filter=(Finishdatetime lt datetime'" + RevisedStartDate + "'or Allocation lt 100) and EmployeeID eq '" + EmpID + "' and (Flag eq'New' or Flag eq'new' or Flag eq'Internal' or Flag eq'Extension' or Flag eq'Early Release') and Active eq 1";
}

//Approval.js
function GetApprovedDataFromSPList(ProjectUIDorMasterID,flag)
{
	if(flag==1)
	{
		return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceReleaseExtensionApprovalMaster')/items?$filter=ProjectCode eq '" + ProjectUIDorMasterID + "'and (Status eq 'Approved' or Status eq 'Rejected')";											
	}
	//for Extension.js
	if(flag==2)
	{
		//return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$Select=ResourceType,ReasonForReject,StartDate,NewStartDate,ExtensionDate,NewExtensionDate,NewReleaseDate,ApprovalStatus,AllocationPercentage,ResourceName,EmployeeID,NewEndDate,ReleaseExtensionMasterID/ID&$expand=ReleaseExtensionMasterID&$filter=ReleaseExtensionMasterID/ID eq '" + ProjectUIDorMasterID + "'";
		return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$Select=ID,ResourceType,ReasonForReject,StartDate,NewStartDate,ExtensionDate,NewExtensionDate,NewReleaseDate,ApprovalStatus,AllocationPercentage,ResourceName,EmployeeID,NewEndDate,ReleaseExtensionMasterID/ID&$expand=ReleaseExtensionMasterID&$filter=ProjectGUID eq '" + ProjectUIDorMasterID + "' and (ApprovalStatus eq 'Approved' or ApprovalStatus eq 'Rejected')&$top=100000";
	}
	//for Release.js
	if(flag==3)
	{
		return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$Select=ID,ResourceType,ReasonForReject,NewReleaseDate,StartDate,NewEndDate,NewStartDate,ReleaseDate,NewExtensionDate,ApprovalStatus,AllocationPercentage,ResourceName,EmployeeID,ReleaseExtensionMasterID/ID&$expand=ReleaseExtensionMasterID&$filter=ReleaseExtensionMasterID/ID eq '"+ProjectUIDorMasterID+"'&$top=100000";	
	}
	
}

//aprove reject of Early Release
function GetApprovedRejectEarlyRelease(puid)
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$Select=Modified,Created,ID,ReasonForRelease,ResourceType,ReasonForReject,StartDate,NewStartDate,ExtensionDate,NewExtensionDate,NewReleaseDate,ApprovalStatus,AllocationPercentage,ResourceName,EmployeeID,NewEndDate,ReleaseExtensionMasterID/ID,Author/Title,Editor/Title&$expand=ReleaseExtensionMasterID,Author,Editor&$filter=ProjectGUID eq '" + puid + "' and (ApprovalStatus eq 'Approved' or ApprovalStatus eq 'Rejected') and ResourceType eq 'Resource Early Release'&$top=100000&$orderby=Modified desc";
	
}

function GetApprovedRejectEarlyExtension(puid)
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('ResourceAllocationDetails')/items?$Select=ID,ResourceType,ReasonForReject,StartDate,NewStartDate,ExtensionDate,NewExtensionDate,NewReleaseDate,ApprovalStatus,AllocationPercentage,ResourceName,EmployeeID,NewEndDate,ReleaseExtensionMasterID/ID&$expand=ReleaseExtensionMasterID&$filter=ProjectGUID eq '" + puid + "' and (ApprovalStatus eq 'Approved' or ApprovalStatus eq 'Rejected') and ResourceType eq 'Resource Extension'&$top=100000&$orderby=Modified desc";

}
//Extension.js

function GetResourseVpByGBU(ResourceGBU)
{
	return ""+SharepointOnlineUrlppmuat+"_api/web/lists/getbytitle('RRFGBUMAPPING')/items?$filter=GBU eq '" + ResourceGBU + "'";
	
}

function GetResourceIDByEmailIDorEmpID(ResourceEmailIdOrEid,flag)
{
	if(flag==1)
	{
		return ""+ppmuaturl+"_api/Resources?$select=ResourceId&$filter=ResourceEmailAddress%20eq '" + ResourceEmailIdOrEid + "'";
	}
	if(flag==2)
	{
		return ""+ppmuaturl+"_api/Resources?$select=ResourceId&$filter=EmployeeID%20eq '" + ResourceEmailIdOrEid + "'";
	}
	
}

//Both js files
function TaTDates(TATStatus)
{
	
	return ""+SharepointOnlineUrlppmuat+"/_api/web/lists/getbytitle('RRFTATMapping')/items?$select=Status,TATDays,Flag&$filter=Status eq'" + TATStatus + "'";
}

//Release.js
function GetReasonForRelease()
{
	return ""+SharepointOnlineUrlppmuat+"/_api/web/lists/getbytitle('ResourceRejectionReasonHead')/items?$select=ReasonHead,Flag&$Filter=Flag eq 'Release'";
}

function GetMailForGivenResourceEmployeeID(EmployID)
{
	return ""+SharepointOnlineUrlppmuat+"/_api/ProjectData/Resources?$select=ResourceEmailAddress&$filter=EmployeeID eq '"+EmployID+"'";
}

function GetMailForGivenResourceGuid(GuidID)
{
	return ""+SharepointOnlineUrlppmuat+"/_api/ProjectData/Resources?$select=ResourceEmailAddress&$filter=ResourceId eq Guid'"+GuidID+"'";
}


function FilterCurrentDateFormat()
{
 var ToDay_Date = new Date();
 var Date_year = ToDay_Date.getFullYear();
 var Date_month = ToDay_Date.getMonth()+1;
 //var date_day = ToDay_Date.getDate();
 var ToDay_Date_Format= Date_year+"-"+("0" +Date_month).slice(-2)+"-"+("0" + ToDay_Date.getDate()).slice(-2)+"T00:00:00";
 return ToDay_Date_Format;
}


function FilterFifteenDateFormat()
{
	var ToDay_Date = new Date();
	var Date_year = ToDay_Date.getFullYear();
	var Date_month = ToDay_Date.getMonth()+1;
	var ToDay_Date_Format= Date_year+"-"+("0" +Date_month).slice(-2)+"-"+("0" + ToDay_Date.getDate()).slice(-2);
	var fiteenDays = new Date(ToDay_Date_Format);
	fiteenDays.setDate(fiteenDays.getDate()+15);
	var Date_year1 = fiteenDays.getFullYear();
	var Date_month1 = fiteenDays.getMonth()+1;
	//var date_day1 = fiteenDays.getDate();
	//var fiteenDays_Format= Date_year1+"-"+ Date_month1+"-"+ ("0" + fiteenDays.getDate()).slice(-2)+ "T00:00:00"; 
 	var fiteenDays_Format= Date_year1+"-"+("0" + Date_month1).slice(-2)+"-"+("0" + fiteenDays.getDate()).slice(-2)+"T00:00:00";
	return fiteenDays_Format;
 
}

function Past12_Days()
{
	var ToDay_Date = new Date();
	var Date_year = ToDay_Date.getFullYear();
	var Date_month = ToDay_Date.getMonth()+1;
	var ToDay_Date_Format= Date_year+"-"+("0" +Date_month).slice(-2)+"-"+("0" + ToDay_Date.getDate()).slice(-2);
	var fiteenDays = new Date(ToDay_Date_Format);
	fiteenDays.setDate(fiteenDays.getDate()-15);
	var Date_year1 = fiteenDays.getFullYear();
	var Date_month1 = fiteenDays.getMonth()+1;
	var fiteenDays_Format= Date_year1+"-"+("0" +Date_month1).slice(-2)+"-"+("0" + fiteenDays.getDate()).slice(-2);

	return fiteenDays_Format;

}