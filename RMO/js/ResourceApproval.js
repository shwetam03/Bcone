
//Globally Declared Variables

var useruid="";//To store the current login userid
var AllocatedProjectCode="";//To store the current project project code
var NewlyInsertedInternalID="";//To store the value of InternalID i.e.,after the data is finally approved and inserted,newly inserted record internal id is stored
var ReloadVal=0;

//array variable to get month value from index value
var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

//Document Ready function
$(document).ready(function () {
	
	//function to get the current login user id,Refer config.js file for code
  GetCurrentUserGUID("1");
 
 //Current login user GUID
  useruid = sessionStorage.CurrentUserGUID;
 
 //function to check if current login user is a authenticate user to access the page
 //$('.loader').show();
						//setTimeout(function () {
  CheckIfValidLoginUser(useruid);
	//}, 100);	
				
				//To intialize the Table 
					$('#tblProjectApprovalData').DataTable();

				//To close the pop up on click of X button in popup
				$('.p-close').on('click',function(){
					
			  $('.Toppopup-bg,.popup-bg').hide(); 
				
				if(ReloadVal==1)
				{
					//$('.loader').show();
						//setTimeout(function () {
						window.location.reload();
					//}, 100);
				}
			  
			 });
});

//function to go to home page on click of ok button,if user is not a valid user are after all the approvals are done
function GoToHomePage()
{
	window.location.href="../default.aspx";

}

//function to check if current login user is a authenticate user to access the page
function CheckIfValidLoginUser(UserUID)
{
	//Refer ReleaseExtensionConfig.js file
		var url=GetDataFromApprovalMaster(UserUID,1);
		
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
					
                    //if invalid user
					if(data<=0)
					{
						$('.popup-bg').show().css('top','25%');
						
						$('#RejectionReason').hide();
						$('#AlertmsgDiv').hide();
						
						
					    $('#Rejection').css('display','none');
						$('#Approve').css('display','none');
						
						
						$('#NotificationMsgDiv').show();
						$('#InvaildUser').css('display','');
					    $('#spnInvalidUser').css('display','');
						
						
					}
					
					//if valid user
					else
					{
						$('.popup-bg').hide();
						GetApprovalData(UserUID);
					}
					
					
				},
				error: function (error) {
					result = 'error';
				}
			});
			//$('.loader').hide();
}

//function to get the data of Pending items of approval from the list
function GetApprovalData(UID)
{
	var requestCount=0;
	
	//Refer ReleaseExtensionConfig.js file
		var url=GetDataFromApprovalMaster(UID,2);
		$('#tblProjectApprovalData > tbody').empty();
		
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
					for(var i=0;i<data.length;i++)
					{
						var id=data[i].ID;
						var ProjectName=data[i].ProjectName;
						var Status=data[i].Status;
						var ResorceGUID=data[i].RmoSpocGUID;
						var ProjectManagerGUID=data[i].RmoSpocGUID;
						var Flag=data[i].ApprovalFlag;
						var Type=data[i].ResourceType;
						var EarlyReleaseComment=data[i].ReasonForEarlyRelease;
						var PendingWith=data[i].PendingWithUserID.Title;
						AllocatedProjectCode=data[i].AllocatedProjectCode;
						
						//function to get the data of Pending items of approval from the list by the ID
						 GetResourceApprovalItems(id,ProjectName,Status,Flag,Type,PendingWith);
						  requestCount+=1;
					}
					//Approval Pending Counts displayed in the BreadCrum
					$('#RequestCount')[0].innerText=requestCount;
				},
				error: function (error) {
					result = 'error';
				}
			});
}

//function to get the data of Pending items of approval from the list by the ID
function GetResourceApprovalItems(ID,pName,status,ApprovalFlag,ResourceType,PendingWithUserName)
{

	var ReleaseDate="";
	var ExtensionDate="";
	var RequestDate="";
	
	//Refer ReleaseExtensionConfig.js file
	var url=GetApprovalDataByID(ID);
	 
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

					{
						ReleaseDate=data[0].Created;
							ReleaseDate=ReleaseDate.split('T')[0];
							ReleaseDate=ReleaseDate.split('-');
							var CurMonth=parseInt(ReleaseDate[1]-1);
							ReleaseDate=ReleaseDate[2]+" "+months[CurMonth]+" "+ReleaseDate[0];
							RequestDate=ReleaseDate;
							var PendingwithDesg=(data[0].PendingWithDesig==undefined?'':data[0].PendingWithDesig);
						    var RMOID=data[0].RmoSpocGUID;
						     var ResId=data[0].ID;
							 
							 //Binding the row data to tblProjectApprovalData table
						 var row = "<tr id=" +ID+"><td><div id='action'><i class='fa fa-info-circle' aria-hidden='true'></i><div class='action-view'><div class='tooltip-1' id='"+ResId+"' onclick='ApproveRelease(this)'><span class='glyphicon glyphicon-ok-sign' aria-hidden='true'></span><div class='tooltiptext-1'>Approve</div></div><div class='tooltip-1' onclick='RejectRelease(this)'><span class='glyphicon glyphicon-remove-sign' aria-hidden='true''></span><div class='tooltiptext-1' >Reject</div></div><div class='tooltip-1' id='"+ID+"' onclick='GetRequestData(this)'><span class='glyphicon glyphicon-user' aria-hidden='true'></span><div class='tooltiptext-1' style='width:120px'>View Resources</div></div></div></div></td><td>"+pName+"</td><td style='text-align:center'>"+RequestDate+"</td><td>"+status+"</td><td style='display:none'>"+RMOID+"</td><td style='display:none'>"+ApprovalFlag+"</td><td>"+PendingWithUserName+"</td><td>"+ResourceType+"</td><td style='display:none'>"+PendingwithDesg+"</td></tr>";
                         $('#tblProjectApprovalData > tbody').append(row);
						 
					}
				},
				error: function (error) {
					result = 'error';
				}
			});
	//$('.loader').hide();
}

//function will trigger when the approve option is clicked
//$('.loader').show();
	//setTimeout(function () {
function ApproveRelease(rowVal)//,MainItemID)
{
	var MainItemID=rowVal.id;
	var CurRow=rowVal.parentNode.parentNode.parentNode.parentNode;
	var CurRowID=CurRow.id;
	var CurApprovalStatus="InProgress";
	var RMOId=CurRow.cells[4].innerText;
	var ApprovalFlag=CurRow.cells[5].innerText;
	var PendingWith="";
	var flag="";
	var ApprovalStatus="";
	var ProjectName=CurRow.cells[1].innerText;
	var ResType=CurRow.cells[7].innerText;
	var PendingDesg=CurRow.cells[8].innerText;
	var PendingID=0;
	var SuccessMsg="";
	var ConfrimMsg="";
	var CurDate=new Date();
	var ProjectWiseFlag="";
	var PendingWithDesig="";
	
	//For Resource Early Release
	if(ResType=="Resource Early Release")
	{
	  ConfrimMsg="Are you sure to approve resources for early release?";
	  if(PendingDesg=="VP")
	  {
	  SuccessMsg="Early release of resources than allocated is approved by VP-Delivery as an exception.";
	  }
	  else
	  {
		SuccessMsg="Early release of resources than allocated is approved by RMO.";
	  }
	  
	  //If first level Approval i.e., if VP-Delivery approved
	if(ApprovalFlag==1)
	{
		
		ApprovalFlag=2;
		CurApprovalStatus=CurApprovalStatus;
		PendingWith=RMOId;
		var SpID=GetUserIDbyGuid(RMOId); 
		if(SpID!="")
		{
			SpID=SpID.split(';')[0]==undefined?'':SpID.split(';')[0];
		}
		else
		{
			SpID="";
		}
		PendingID=SpID;
		flag=2;
		ApprovalStatus="Pending";
		PendingWithDesig="RMO"
		
	}
	
	//If Sencond level Approval i.e., if RMO approved
	else
		if(ApprovalFlag==2)
		{
			
			ApprovalFlag=3;
			CurApprovalStatus="Approved";
			PendingWith="";
			PendingID=parseInt(-1);
			flag=3;
		   ApprovalStatus="Approved";
		   PendingWithDesig="";
		  
		}
		ProjectWiseFlag="Early Release";
	}
	
	//for Resource Extension
	// oly one level approval in Extension  i.e., RMO approval
	else
		if(ResType=="Resource Extension")
		{
			ConfrimMsg="Are you sure to approve resources for Extension?"
		  	ApprovalFlag=3;
			CurApprovalStatus="Approved";
			PendingWith="";
			PendingID=parseInt(-1);
			flag=3;
		   ApprovalStatus="Approved";
		   ProjectWiseFlag="Extension";
           SuccessMsg="Extension of resources in the Project completed successfully";
      		   
		}
		
		if(confirm(ConfrimMsg))
		{
	 var MaterlistName = "ResourceReleaseExtensionApprovalMaster";
     var MasteritemType = GetItemTypeForListName(MaterlistName);
	 var Masteritems = {
                 __metadata: { "type": MasteritemType },
                  ApprovalFlag:ApprovalFlag,
				  Status:CurApprovalStatus,
				  PendingWith:PendingWith,
				  PendingWithUserIDId:PendingID,
				  PendingWithDesig:PendingWithDesig
                   };
				   
	 var DetailslistName = "ResourceAllocationDetails";
     var DetailsitemType = GetItemTypeForListName(DetailslistName);
	 var Detailsitems = {
                 __metadata: { "type": DetailsitemType },
                  flag:flag,
				  ApprovalStatus:ApprovalStatus,
				  PendingWith:PendingWith,
				  ApproverGUID:useruid,
				  PendingWithUserIDId:PendingID,
				  SubmittedDate:CurDate,
				  TATDate:CurDate,
				  PendingWithDesig:PendingWithDesig
                   };
				   
	//Refer ReleaseExtensionConfig.js file
	var Masterurl=GetDataByRowId(CurRowID,1);
	
	         $.ajax({
				url: Masterurl,
				async: false,
				type: "POST",
				contentType: "application/json;odata=verbose",
				data:JSON.stringify(Masteritems),
                headers: {
                     "Accept": "application/json;odata=verbose",
					 "X-RequestDigest": $("#__REQUESTDIGEST").val(),
					 "X-HTTP-Method": "MERGE",
					 "If-Match": "*"
                },
				success: function (data) {
					
					//Refer ReleaseExtensionConfig.js file
	              var url=GetDataByRowId(CurRowID,2);
	
	            $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
				    var maindata=data.d.results;
					var NewEndDate="";
					
					for(var i=0;i<maindata.length;i++)
					{
						if(ResType=="Resource Early Release")
						{
							NewEndDate=maindata[i].ReleaseDate;
						}
						else
							if(ResType=="Resource Extension")
							{
								NewEndDate=maindata[i].ExtensionDate;
							}
							
				//Refer ReleaseExtensionConfig.js file			
				var  DetailsListurl=GetDataDetailsByID(maindata[i].ID);
				
			     $.ajax({
				 url: DetailsListurl,
				 async: false,
				 type: "POST",
			     contentType: "application/json;odata=verbose",
				 data:JSON.stringify(Detailsitems),
                 headers: {
                     "Accept": "application/json;odata=verbose",
					 "X-RequestDigest": $("#__REQUESTDIGEST").val(),
					 "X-HTTP-Method": "MERGE",
					 "If-Match": "*"
                },
				 success: function (data) {
					 if(flag==3)
					 {
						 //To get the Skills of the user assigned
						 var skills=GetSkillsByProjectID(AllocatedProjectCode);
						 var Pskills;
						 var Sskills;
						 var RRFNo;
						 
						 if(skills!="")
						 {
							 Pskills=skills.split(';')[0]==undefined?'':skills.split(';')[0];
						     Sskills=skills.split(';')[1]==undefined?'':skills.split(';')[1];
							 RRFNo=skills.split(';')[2]==undefined?'':skills.split(';')[2];
						 }
						 
						 if(Pskills!=""&& (Sskills!=""&&Sskills!="null"))
						 {
						    Pskills=Pskills;
						    Sskills=Sskills;
						 }
						 
						 else if(Pskills!=""&&(Sskills=="null"||Sskills==""))
						 {
							 Pskills=skills.split(',')[0];
							 Sskills="";
						 }
						 
						 else
						 {
							 Pskills="";
							 Sskills="";
						 
						 }
						 var eid=maindata[i].EmployeeID==undefined?'':maindata[i].EmployeeID;
						 var PrjLctn=maindata[i].ProjectLocation==undefined?'':maindata[i].ProjectLocation;
						 var PrjMngr=maindata[i].ProjectManagerName==undefined?'':maindata[i].ProjectManagerName;
						 var Resname=maindata[i].ResourceName==undefined?'':maindata[i].ResourceName;
						 var SDate=maindata[i].StartDate==undefined?'':maindata[i].StartDate;
						 var AllocPer=maindata[i].AllocationPercentage==undefined?'':maindata[i].AllocationPercentage;
						 var RMoId=maindata[i].RmoSpocGUID==undefined?'':maindata[i].RmoSpocGUID;
						 
						 //to get the previous record of the resource of same project code and update the record active flag to 0 as before it will be 1
						getActiveByResourceWiseProjectAllocation(AllocatedProjectCode, eid);
						
						//Insert the record in Project wise resource allocation table after the request final approval with active flag 1
						GetResourceData(eid,NewEndDate,AllocatedProjectCode,PrjLctn,PrjMngr,ProjectName,Resname,SDate,AllocPer,RMoId,Pskills,Sskills,ProjectWiseFlag,MainItemID,RRFNo);
	                    
					 }
				 },
				
				  error: function (error) {
					result = 'error';
				  }
				 });
					}
				},
				
				error: function (error) {
					result = 'error';
				}
				});
				
				//alert(SuccessMsg);
				
					$('.popup-bg').show().css('top','25%');
						
						$('#RejectionReason').hide();
						$('#NotificationMsgDiv').hide();
						
						$('#InvaildUser').css('display','none');
					    $('#spnInvalidUser').css('display','none');
						
					    $('#Rejection').css('display','none');
						
						$('#AlertmsgDiv').show();
						$('#Approve').css('display','');
						$('#AlertMsg').css('display','');
						$('#AlertMsg').text(SuccessMsg);
						ReloadVal=1;
				 },
				
				  error: function (error) {
					result = 'error';
				  }
				
	});
		}
	//$('.loader').hide();
}
//}, 100);
//function will trigger when the reject option is clicked.Reason for reject popup will open
function RejectRelease(rowID)
{
	var CurRow=rowID.parentNode.parentNode.parentNode.parentNode;
	var CurRowID=CurRow.id;
	var RMOId=CurRow.cells[4].innerText;
	var ApprovalFlag=CurRow.cells[5].innerText;
	var ResType=CurRow.cells[7].innerText;
	var PendingDesg=CurRow.cells[8].innerText;
	
	var CellCol=CurRowID+";"+RMOId+";"+ApprovalFlag+";"+ResType+";"+PendingDesg;
	var ConfrimMsg="";
	
	if(ResType=="Resource Early Release")
	{
		 ConfrimMsg="Are you sure to reject resources for early release?";

	}
	else
		if(ResType=="Resource Extension")
		{
			 ConfrimMsg="Are you sure to reject resources for extension?";

		}
		
		if(confirm(ConfrimMsg))
		{
			$('.popup-bg').show().css('top','25%');
						
						
						$('#NotificationMsgDiv').hide();
						
						$('#InvaildUser').css('display','none');
					    $('#spnInvalidUser').css('display','none');
						
						$('#AlertmsgDiv').hide();
						$('#Approve').css('display','none');
						$('#AlertMsg').css('display','none');
						
						$('#Rejection').css('display','');
						$('#RejectionReason').show();
						
			   $('#rowid').text(CellCol);
		}
		
		
}

//function will trigger when the view resource option is clicked.Display the selected resource details
//$('.loader').show();
						//setTimeout(function () {
function GetRequestData(val)//,Id)
{

	 $('.Toppopup-bg').show();
	 var Id=val.id;
	 var CurType=val.parentNode.parentNode.parentNode.parentNode.cells[7].innerText;
	  var NewDate="";

	  //Refer ReleaseExtensionConfig.js file	
	var url=GetDataByRowId(Id,2);
	
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
					 $('.tblResourceApprovalData > tbody').empty();
					for(var i=0;i<data.length;i++)
					{
						if(CurType=="Resource Early Release")
						{
							$("h4#popUpHeadertext").text("Resource Early Release");
						var ReleaseDate=data[0].CalculatedReleaseDate;
						ReleaseDate=ReleaseDate.split('T');
						ReleaseDate=ReleaseDate[0];
						ReleaseDate=ReleaseDate.split('-');
						var curMonth=parseInt(ReleaseDate[1]-1);
						ReleaseDate=ReleaseDate[2]+" "+months[curMonth]+" "+ReleaseDate[0];
						NewDate=ReleaseDate;
						}
						else
							if(CurType=="Resource Extension")
							{
								$("h4#popUpHeadertext").text("Resource Extension");
								ExtensionDate=data[0].CalculatedExtensionDate;
								ExtensionDate=ExtensionDate.split('T');
								ExtensionDate=ExtensionDate[0];
								ExtensionDate=ExtensionDate.split('-');
								var curMonth=parseInt(ExtensionDate[1]-1);
								ExtensionDate=ExtensionDate[2]+" "+months[curMonth]+" "+ExtensionDate[0];
								NewDate=ExtensionDate;
								
							}
						
						var ResourceName=data[i].ResourceName;
						var Empid=(data[i].EmployeeID==undefined?'':data[i].EmployeeID);
						var AllocationPercent=data[i].AllocationPercentage;
						var OldStartDate=data[i].CalculatedStartDate;
						OldStartDate=OldStartDate.split('T');
						OldStartDate=OldStartDate[0];
						OldStartDate=OldStartDate.split('-');
						var curSDMonth=parseInt(OldStartDate[1]-1);
						OldStartDate=OldStartDate[2]+" "+months[curSDMonth]+" "+OldStartDate[0];
						
						var OldEndDate=data[i].CalculatedEndDate;
						OldEndDate=OldEndDate.split('T');
						OldEndDate=OldEndDate[0];
						OldEndDate=OldEndDate.split('-');
						var curEDMonth=parseInt(OldEndDate[1]-1);
						OldEndDate=OldEndDate[2]+" "+months[curEDMonth]+" "+OldEndDate[0];
					   var ProjectFeedback=data[i].ProjectEndFeedBack==undefined?"":data[i].ProjectEndFeedBack;//.split('>')[1].split('</')[0];		
						var ID=data[i].ID;
						
						//Refer ReleaseExtensionConfig.js file	
						var Commenturl=GetDataByRowId(Id,1);
						
						$.ajax({
					url: Commenturl,
					async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
				    
						var Type=data.d.ResourceType;
						
					   var ReleaseComment=data.d.ReasonForEarlyRelease==undefined?"":data.d.ReasonForEarlyRelease.split('>')[1].split('</')[0];
				
					   
						//Binding the data to tblResourceApprovalData table
						var row ="<tr id="+ID+"><td><span href='#' id='show-popup' class='action-b'>" + ResourceName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + Empid + "&employeename=" + ResourceName + "' target='_blank' style='color:#337ab7' >View Profile</a></div></span></td><td>"+AllocationPercent+"</td><td style='text-align:center'>"+OldStartDate+"</td><td style='text-align:center'>"+OldEndDate+"</td><td style='text-align:center'>"+NewDate+"</td><td class='comments'>"+ReleaseComment+"</td><td>"+ProjectFeedback+"</td></tr>";
                         $('.tblResourceApprovalData > tbody').append(row);

						 //to display release comments if Early release else hide 
						if(Type=="Resource Early Release")
						{
							
							$('.tblResourceApprovalData td:nth-child(6),.tblResourceApprovalData th:nth-child(6)').show();
							$('.tblResourceApprovalData td:nth-child(7),.tblResourceApprovalData th:nth-child(7)').show();
						}
						else
						{
							$('.tblResourceApprovalData th:nth-child(6),.tblResourceApprovalData td:nth-child(6)').hide();
							$('.tblResourceApprovalData th:nth-child(7),.tblResourceApprovalData td:nth-child(7)').hide();
						}
					},
					error: function (error) {
					result = 'error';
				}
						 });
				}
				},
				error: function (error) {
					result = 'error';
				}
			});
	$('.tblResourceApprovalData').DataTable();
	//$('.loader').hide();
}
//}, 100);
function GetItemTypeForListName(name) {
	
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}


//function return skills by its project code
function GetSkillsByProjectID(PName){
	var Skillresult;

    //Refer ReleaseExtensionConfig.js file	
	var url=GetskillsDataByPid(PName)
	
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
					var PrimarySkills=data[0].PrimarySkills;
					var SecondarySkills=data[0].SecondarySkills;
					var RRFNO=data[0].RRFNO;
					if(RRFNO == null || RRFNO == "null" || RRFNO == undefined || RRFNO == "undefined")
					{
						RRFNO = null;
					}
					if(PrimarySkills!="" && SecondarySkills!="")
					{
						Skillresult=PrimarySkills+';'+SecondarySkills+';'+RRFNO;
					}
					else if(PrimarySkills!="")
					{
						Skillresult=PrimarySkills+';'+""+';'+RRFNO;
					}
					else if(SecondarySkills!="")
					{
						Skillresult=""+';'+SecondarySkills+';'+RRFNO;
					}
					else
					{
						Skillresult="";
					}

					
				},
				error: function (error) {
					result = 'error';
				}
				
				});
				return Skillresult;
}


//function to insert the final approved data into project wise resource allocation table by active flag 1	  
function GetResourceData(EmpID,EndDate,ProjectCode,ProjectLocation,ProjectManagerName,ProjName,ResourceName,StartDate,AllocationPercentage,RmoSpocGUID,PrimarySkills,SecondarySkills,FlagValue,ItemID,RRFNO)
{
     //Refer ReleaseExtensionConfig.js file	
	var Masterurl=GetResourceDetails();
	var GetRMOName=GetUserIDbyGuid(RmoSpocGUID);//ResourceName
	var RMO_Name="";
	if(GetRMOName!="")
	{
	RMO_Name=GetRMOName.split(';')[1];	
	}
	else
	{
		RMO_Name="";
	}
	
	$.ajax({
				url: Masterurl,
				async: false,
				method: "POST",
				data:{
					"ProjectName":ProjName,
					"ResourceFullName":ResourceName,
					"EmployeeID":EmpID,
					"BookingType":"Committed",
					"Startdatetime":StartDate,
					"Finishdatetime":EndDate,
					"Allocation":AllocationPercentage,
					"RMOSPOC":RMO_Name,
					"Flag":FlagValue,
					"PrimarySkills":PrimarySkills,
					"SecondarySkills":SecondarySkills,
					"Active":1,
					"AllocatedProjectCode":ProjectCode,
					"Reporting_Manager":ProjectManagerName,
					"ProjectLocation":ProjectLocation,
					"RRFNO":RRFNO
				},
                headers: {
                      "Accept": "application/json;odata=verbose",
            },
		success: function (data) {
			
			//to get inserted record internal id
			NewlyInsertedInternalID=(data.d.InternalID==undefined?'':data.d.InternalID);
			
			//to update the newly inserted internal id for the approved item in the list
			InsertNewRelatedInternalIdByID(NewlyInsertedInternalID,ItemID);
		},
	       error: function (error) {
			result = 'error';
				
		  },
	});
		
}


//function to get user Email id by its id
function GetUserIDbyGuid(ResGUID)
{
	var Id_Name="";
	
	//Refer ReleaseExtensionConfig.js file
	var url=GetResourceDataByEmpCode(ResGUID,3);
	  $.ajax({
				url: url,
				async: false,
				method: "GET",
				headers: {
					"Accept": "application/json; odata=verbose",
					"Content-Type": "application/json; odata=verbose"
				},
				success: function (data) {
					var data=data.d;
					var ResourceEmailID=(data.ResourceEmailAddress==undefined?'':data.ResourceEmailAddress);
					var ResourceName=(data.ResourceName==undefined?'':data.ResourceName);
					//to get user SPid by its Email id
					Id_Name=GetSpIDByEmailID(ResourceEmailID);
					
					Id_Name=Id_Name+";"+ResourceName;
					
				},
				error: function (error) {
					result = 'error';
				}
			});
        return Id_Name;
}

//function to get user SPid by its Email id
function GetSpIDByEmailID(ResEmailID)
{
	var SPid="";
	
	//Refer ReleaseExtensionConfig.js file
	var url=GetSpidByResEmailID(ResEmailID);

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
					Spid=data[0].Id;
					
				},
				error: function (error) {
					result = 'error';
				}
			});
	     return Spid;
}

//function to insert reason for rejection and update the list item of rejected reource in the list
//$('.loader').show();
//	setTimeout(function () {
function InsertReasonForRejection()
{
	var CellValues=$('#rowid')[0].innerText.split(';');
	
	var RejectionComments=$('#RejectComments').val();
	
	//Validations
			if(RejectionComments=='')
			{
				$('#CommentBoxErrorMsg').text('Please provide Reason for Rejection');
				$('#RejectComments').focus();
					return false;
			}
			
				 var match = (new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$')).test(RejectionComments);
        
			 if (match) {
				   $('#CommentBoxErrorMsg').text("Comments contain invalid characters");
				    return false;
				   } 
		 else{
				   $('#CommentBoxErrorMsg').text("");			   
		 }
		 
	var CurRowID=CellValues[0];	
	var CurApprovalStatus="Rejected";
	var RMOId=CellValues[1];
	var ApprovalFlag=CellValues[2];
	var PendingWith="";
	var flag="";
	var ApprovalStatus="";
    var PendingID=parseInt(-1);
	var SuccessMsg="";
	var ResType=CellValues[3];
	var ConfrimMsg="";
	var PendingWithDesg=(CellValues[4]==undefined?'':CellValues[4]);
	
		ApprovalFlag=0;
		CurApprovalStatus=CurApprovalStatus;
		flag=0;
		ApprovalStatus="Rejected";
		
    //Rejected messages for Early release
	if(ResType=="Resource Early Release")
	{
		 ConfrimMsg="Are you sure to reject resources for early release?";
		 if(PendingWithDesg=="VP")
		 {
		   SuccessMsg="Early release of resources than allocated is rejected by VP-Delivery as an exception. The resource continues to be on your Project for next 4 weeks.";
		 }

		 else
		 {
			 SuccessMsg="Early release of resources than allocated is rejected by RMO. The resource continues to be on your Project for next 4 weeks.";
		 }
	}
	
		 //Rejected messages for Resource Extension
	else
		if(ResType=="Resource Extension")
		{
			 ConfrimMsg="Are you sure to reject resources for extension?";
			SuccessMsg="Extension of resources rejected by RMO";
		}
		
	
				
	 var MaterlistName = "ResourceReleaseExtensionApprovalMaster";
     var MasteritemType = GetItemTypeForListName(MaterlistName);
	 var Masteritems = {
                 __metadata: { "type": MasteritemType },
                  ApprovalFlag:ApprovalFlag,
				  Status:CurApprovalStatus,
				  PendingWith:PendingWith,
				  PendingWithUserIDId:PendingID,
				  PendingWithDesig:""
                   };
				   
	 var DetailslistName = "ResourceAllocationDetails";
     var DetailsitemType = GetItemTypeForListName(DetailslistName);
	 var Detailsitems = {
                 __metadata: { "type": DetailsitemType },
                  flag:flag,
				  ApprovalStatus:ApprovalStatus,
				  PendingWith:PendingWith,
				  RejectedBYGUID:useruid,
				  PendingWithUserIDId:PendingID,
				  ReasonForReject:RejectionComments,
				  PendingWithDesig:""
                   };
				   
		//Refer ReleaseExtensionConfig.js file		   
	var Masterurl=GetDataByRowId(CurRowID,1);
	
	              $.ajax({
				url: Masterurl,
				async: false,
				type: "POST",
				contentType: "application/json;odata=verbose",
				data:JSON.stringify(Masteritems),
                headers: {
                     "Accept": "application/json;odata=verbose",
					 "X-RequestDigest": $("#__REQUESTDIGEST").val(),
					 "X-HTTP-Method": "MERGE",
					 "If-Match": "*"
                },
				success: function (data) {
					
					//Refer ReleaseExtensionConfig.js file
	                 var url=GetDataByRowId(CurRowID,2);
	
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
					
					for(var i=0;i<data.length;i++)
					{
				
				//Refer ReleaseExtensionConfig.js file
				var DetailsListurl=GetDataDetailsByID(data[i].ID);
				
			     $.ajax({
				 url: DetailsListurl,
				 async: false,
				 type: "POST",
			     contentType: "application/json;odata=verbose",
				 data:JSON.stringify(Detailsitems),
                 headers: {
                     "Accept": "application/json;odata=verbose",
					 "X-RequestDigest": $("#__REQUESTDIGEST").val(),
					 "X-HTTP-Method": "MERGE",
					 "If-Match": "*"
                },
				 success: function (data) {
					
				 },
				
				  error: function (error) {
					result = 'error';
				  }
				 });
					}
				},
				
				error: function (error) {
					result = 'error';
				}
				});
//				alert(SuccessMsg);
                 $('.popup-bg').show().css('top','25%');
						
						$('#RejectionReason').hide();
						$('#NotificationMsgDiv').hide();
						
						$('#InvaildUser').css('display','none');
					    $('#spnInvalidUser').css('display','none');
						
					    $('#Rejection').css('display','none');
						
						$('#AlertmsgDiv').show();
						$('#Approve').css('display','');
						$('#AlertMsg').css('display','');
						$('#AlertMsg').text(SuccessMsg);
						ReloadVal=1;
				 },
				
				  error: function (error) {
					result = 'error';
				  }
				
	});
	//$('.loader').hide();
}
//}, 100);
//Function for Reject comment box Validation on 'onkeyup' 
function CommentBoxValidation(commentID)
{
	commentID=commentID.id;
	 var comment = document.getElementById(commentID).value;
	 if(comment=='')
				  {
					$('#CommentBoxErrorMsg').text('Please provide reason for early release');
					$('#comment').focus();
					return false;
				 }
        var match = (new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$')).test(comment);
        if (match) {
            
            document.getElementById("CommentBoxErrorMsg").innerHTML = "Comment contains invalid character";
            
            document.getElementById(commentID).focus();
            return false;
        } 
		else {
           
            document.getElementById("CommentBoxErrorMsg").innerHTML = "";

		}
}

//function to update the newly inserted internal id for the approved item in the list
function InsertNewRelatedInternalIdByID(NewInternalID,ResItemID)
{	
	 var listName = "ResourceAllocationDetails";
	 var itemType = GetItemTypeForListName(listName);
	 
	 //New internal id of newly inserted record in Project wise resource allocation table
     var NewRelatedInternalIDValue=NewInternalID.toString();
	 
			var item = {
				 __metadata: { "type": itemType },
						NewInsertedInternalIDVal:NewRelatedInternalIDValue
				   };
				 
				//Refer ReleaseExtensionConfig.js file
	              var url=GetDataDetailsByID(ResItemID,2);
	
			     $.ajax({
				 url: url,
				 async: false,
				 type: "POST",
			     contentType: "application/json;odata=verbose",
				 data:JSON.stringify(item),
                 headers: {
                     "Accept": "application/json;odata=verbose",
					 "X-RequestDigest": $("#__REQUESTDIGEST").val(),
					 "X-HTTP-Method": "MERGE",
					 "If-Match": "*"
                },
				 success: function (data) {

			 },
				error: function (error) {
				result = 'error';

			}
		});	
}