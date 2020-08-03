    var site_url = getPWAURl();
    var urluserprofile = _spPageContextInfo.webAbsoluteUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";
    var resultuserprofile = resultsetProfile(urluserprofile);
    var currentuseremail = resultuserprofile.Email;
    // var resourceurl = site_url + "_api/Resources";
    var projecturl;
    var projectresult = "";
    //  var resourceresult = resultset(resourceurl);
    var resultproject = "";
    var projectguid;
    var table_header = "";
    var PageStatus = "";
    var rrfno = "";
    var urlrrf = "";
    var resultRRF = "";
    var reportingtouid = "";
    //var skipmanageruid = "";
    var fpna = "";
    var projectmanager = "";
    var clientpartner = "";
    var rmospoc = "";
    var fpnauid = "";
    var clientpartneruid = "";
    var projectmanageruid = "";
    var rmospocuid = "";
    var id;
    var projectmanageruserid = -1;
    var rmospocuserid = -1;
    var fpnauserid = -1;
    var clientpartneruserid = -1;
    var reportingtouserid = -1;
    var rrfid = "";
    var resourcename = "";
    var resourcenameRMO = "";
    var RRFItemId = "";
    var Firstflag = "0";
    var Secondflag = "0";
    var Thirdflag = "0";
    var Forthflag = "0";
    var approverid = -1;
    var projectownerid;
    var table;
    var Reportingflag = "0";
    var multipleAssignProject_Array = [];
    var rrfsecondflag = "0";
    var ddlEType = "";
    var ddlPrimaryType = "";
    var ddlSecondryType = "";
    var ddlbaselocationType = "";
    var rdbclientinterviewType = "";
    var projectownerGUID;
    var projectcode;
    var pagerequestid = "";
    var resultindustryexp;
    var currentuserloginid;
    var rrfAuthorEmailAddress = "";
    var Project_StartDate = "";
    var Project_EndDate = "";
    var NonBillableFlag = null;
    var RMOSuperUserFlag = "";
    var EmailFlag = 0;
    /* On page load code*/
    $(document).ready(function () {

        $("#headingTwo").on("click", function () {
            $("#ddlprimaryskill").parent().parent().addClass('margin-opx');
            $("#ddlsecondryskill").parent().parent().addClass('margin-opx');
            document.getElementById("ddlprimaryskill").tabIndex = 23;
            document.getElementById("ddlsecondryskill").tabIndex = 24;

        });
        $("#ddlnatureofvacancy").on("click", function () {
            $("#ddlreplacementfor").parent().parent().addClass('margin-opx');
        });
        assigntooltipvalue();
        currentuserloginid = _spPageContextInfo.userId;
        //currentuserEmailAddress = _spPageContextInfo.userEmail;
        $("#projectname").hide();
        $('.loader').show();

        /*custom scroll bar code */
        $("#VScroll").mCustomScrollbar
       ({
           scrollButtons:
        {
            enable: true
        },
           theme: "dark-thin",
           advanced: { autoExpandHorizontalScroll: true, updateOnContentResize: true }
       });
        date();

        /*code is used for date picker  */
        // $(function () {
        //     $("#txtrequirementstartdate,#txtrequirementenddate").datepicker({
        //         dateFormat: 'dd-M-yy',
        //         changeMonth: true,
        //         changeYear: true,
        //         minDate: 0,
        //         onSelect: function (selected, evnt) {
        //
        //         }
        //     });
        // });

        $("#divReportingTo").spPeoplePicker();
        /*code is used to checked Existing radio button  and bind project dropdown */

        /*Get current login user GUID */
        rrfno = getURLParameters("RRFNO");

        var currentuserid = GetCurrentUserGUID();
        var currentuserRole_empID = GetCurrentUserRole(currentuseremail);
        var currentuserRole = currentuserRole_empID.split(';')[0];
        var currentuser_EmployeeID = currentuserRole_empID.split(';')[1];
        //Get User Group
        var groupURL = getuserinRMOSuperUsergroup(currentuserloginid);
        var gropVal = resultset(groupURL);
        if (gropVal.length > 0) {
            RMOSuperUserFlag = "1";
        }
        if (rrfno == undefined || rrfno == null) {
            if (currentuserRole == "RMO") {
                projecturl = site_url + "_api/Projects?$select=ProjectName,ProjectId,ProjectCode,ProjectOwnerId,CustomerName,GBU,FinanceTeam,ClientPartner,RMOSPOC,ProjectOwnerName,ProjectStartDate,ProjectFinishDate";
            }
            else {
                projecturl = site_url + "_api/Projects?$select=ProjectName,ProjectId,ProjectCode,ProjectOwnerId,CustomerName,GBU,FinanceTeam,ClientPartner,RMOSPOC,ProjectOwnerName,ProjectStartDate,ProjectFinishDate&$filter=ProjectOwnerId eq guid'" + currentuserid + "' or substringof('" + currentuser_EmployeeID + "',ClientPartner) or RRFDelegation1 eq'" + currentuseremail + "' or RRFDelegation2 eq'" + currentuseremail + "'  or RRFDelegation3 eq'" + currentuseremail + "' or PracticeHead eq '" + currentuseremail + "' or PracticeLead2 eq '" + currentuseremail + "'";
            }

            //projecturl = site_url + "_api/Projects?$filter=ProjectOwnerId eq guid'" + currentuserid + "'"; //old for only PM
            projectresult = resultset(projecturl);
        }


        $("#btnsearch").prop("disabled", true);

        $("#txtoppertunitystatus,#txtgbu,#txtpractice,#txtcustomer,#txtclientpartner,#txtprojectmanager,#txtjobsummary,#txtrmospoc,#txtfpaapprover").prop("disabled", true);
        binddropdown();
        if (rrfno != undefined || rrfno != null) {

            url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRF')/Items?$select=RMOSPOCUser/Title,FPNAUser/Title,ProjectManagerUser/Title,ClientPartnerUser/Title,ReportingToUser/Title,ReportingToUser/EMail,NewAuthor/Title,NewAuthor/EMail,*&$expand=ReportingToUser,NewAuthor,ProjectManagerUser,RMOSPOCUser,FPNAUser,ClientPartnerUser&$filter=RRFNO eq '" + rrfno + "'";
            resultRRF = resultset(url);
            if (resultRRF[0].ProjectGUID != null) {
                projectguid = resultRRF[0].ProjectGUID;
            }

            if (resultRRF[0].ProjectCode != null) {
                projectcode = resultRRF[0].ProjectCode;
            }

            if (resultRRF[0].ReportingTo != null) {
                reportingtouid = resultRRF[0].ReportingTo;
            }
            //if(resultRRF[0].SkipManager!=null)
            //{
            //skipmanageruid=resultRRF[0].SkipManager;
            //}

            if (resultRRF[0].ProjectManagerGUID != null) {
                projectownerGUID = resultRRF[0].ProjectManagerGUID;
            }
            if (resultRRF[0].ClientPartner != null) {
                clientpartneruid = resultRRF[0].ClientPartner;
            }
            if (resultRRF[0].ProjectManager != null) {
                projectmanageruid = resultRRF[0].ProjectManager;

            }
            if (resultRRF[0].FPAApprover != null) {
                fpnauid = resultRRF[0].FPAApprover;
            }
            if (resultRRF[0].RMOSpoc != null) {
                rmospocuid = resultRRF[0].RMOSpoc;
            }
            if (resultRRF[0].ProjectManagerUserId != null) {
                projectmanageruserid = resultRRF[0].ProjectManagerUserId;

            }
            if (resultRRF[0].RMOSPOCUserId != null) {
                rmospocuserid = resultRRF[0].RMOSPOCUserId;
            }
            if (resultRRF[0].FPNAUserId != null) {
                fpnauserid = resultRRF[0].FPNAUserId;
            }
            if (resultRRF[0].ClientPartnerUserId != null) {
                clientpartneruserid = resultRRF[0].ClientPartnerUserId;
            }
            if (resultRRF[0].ReportingToUserId != null) {
                reportingtouserid = resultRRF[0].ReportingToUserId;
            }
            if (resultRRF[0].RoleBand != null && resultRRF[0].RoleBand != "Select") {
                $("#btnsearch").prop("disabled", false);
            }
            if (resultRRF[0].EmployeeRole != "Billable" && resultRRF[0].EmployeeRole != "Billable Consultant") {
                $("#btnsearch").prop("disabled", true);
            }
            if (resultRRF[0].NewAuthor.Title != null || resultRRF[0].NewAuthor.Title != undefined) {
                var RRFAuthor = resultRRF[0].NewAuthor.Title;
                rrfAuthorEmailAddress = resultRRF[0].NewAuthor.EMail;
                $('#lbluser').html(RRFAuthor);
            }

            if (resultRRF[0].NewAuthor.EMail == currentuseremail) {
                var CloneflagValue = CheckForCloneFlagStatus(rrfno);
                if (CloneflagValue == "Yes") {
                    $("#spnClone").css('display', '');
                    $('.clone').text('Cloning in Process').css('pointer-events', 'none').css('cursor', 'not-allowed');//.unbind('click').css('cursor','not-allowed');
                }
                else
                    if (CloneflagValue == "No") {
                        $("#spnClone").css('display', '');
                    }
            }
            else {
                $("#spnClone").css('display', 'none');
            }

            // $("#ddlprojectname").prop("disabled", true);
            // $("#ddlprojectname").append(new Option("Select", 0));
            // for (var index = 0; index < projectresult.length; index++) {
            //     $("#ddlprojectname").append($('<option></option>').text(projectresult[index].ProjectName));
            // }
            // $("#ddlprojectname").val(resultRRF[0].ProjectName);

            if (resultRRF[0].ProjectStatus == "Existing") {
                $("#rdbexisting").prop('checked', true);
                $("#ddlprojectname").hide();
                $("#projectname").show();
                $("#projectname").val(resultRRF[0].ProjectName);
                $("#projectname").prop("disabled", true);


                //		   if(projectresult.length>0)
                //		   {
                //		$("#projectname").hide();
                //		$("#ddlprojectname").empty();
                //        $("#rdbexisting").prop('checked', true);			
                //        $("#ddlprojectname").append(new Option("Select", 0)); 
                //		for (var index = 0; index < projectresult.length; index++) {
                //        $("#ddlprojectname").append($('<option></option>').text(projectresult[index].ProjectName));
                //    }
                //	$("#ddlprojectname").val(resultRRF[0].ProjectName);
                //	$("#ddlprojectname").prop("disabled", true);
                //		   }
                //		   else{
                //			    
                //				$("#projectname").show();
                //				$("#rdbexisting").prop('checked', true);
                //			   $("#projectname").val(resultRRF[0].ProjectName);
                //			   $("#projectname").prop("disabled", true);
                //		   }
            }
            else if (resultRRF[0].ProjectStatus == "New") {
                $("#ddlprojectname").hide();
                $("#projectname").show();
                $("#rdbnew").prop('checked', true);
                $("#projectname").val(resultRRF[0].ProjectName);
                $("#projectname").prop("disabled", true);

                //			 
                //             var opertunityurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Opportunity')/Items?$select=Title&$filter=OpportunityOwnerId eq '"+userid+"'&$orderby=Title asc";
                //             var opertunityresult = resultset(opertunityurl); 
                //          if(opertunityresult.length>0)
                //			   {
                //				   $("#projectname").hide();
                //            $("#ddlprojectname").empty();
                //            $("#rdbnew").prop('checked', true);			
                //            $("#ddlprojectname").append(new Option("Select", 0)); 				   
                //          for (var index = 0; index < opertunityresult.length; index++) { 
                //			  $("#ddlprojectname").append($('<option></option>').text(opertunityresult[index].Title));		  
                //             // $("#ddlprojectname").append(new Option(opertunityresult[index].Title, 0));
                //          }
                //		  $("#ddlprojectname").val(resultRRF[0].ProjectName);
                //		  $("#ddlprojectname").prop("disabled", true);
                //			   }
                //			   else{
                //				   $("#ddlprojectname").hide();
                //					$("#projectname").show();
                //					$("#rdbnew").prop('checked', true);
                //				   $("#projectname").val(resultRRF[0].ProjectName);
                //				   $("#projectname").prop("disabled", true);
                //			   }
            }
            if (resultRRF[0].ProjectStartDate != null) {
                Project_StartDate = resultRRF[0].ProjectStartDate;
            }
            if (resultRRF[0].ProjectEndDate != null) {
                Project_EndDate = resultRRF[0].ProjectEndDate;
            }


            displayFirstAccData(resultRRF);
            bindsecondaccdataonload();
            //bindsecondaccdata();            //Bind 2nd and 3rd acordian data of save recored in page load
            //bindthirdaccdata();

            fourthaccordiandata(resultRRF);

            if ((resultRRF[0].Status == "Withdrawn" || resultRRF[0].Status == "Rejected") && currentuseremail == rrfAuthorEmailAddress) {
                $('input[name=projectstatus]').prop("disabled", false);
            }
            else if (resultRRF[0].Status == "RMO Validation" || resultRRF[0].Status == "RRF Saved" || resultRRF[0].Status == "Non Billable" || resultRRF[0].Status == "Functional Head") {
                $('input[name=projectstatus]').prop("disabled", true);
            }
            if ((resultRRF[0].Status == "Withdrawn" || resultRRF[0].Status == "Rejected") && currentuseremail == rrfAuthorEmailAddress) {
                $("#btnsave").show();
                $("#btnsubmit").show();
                $("#btnsearch").hide();
            }
            else if ((resultRRF[0].Status != "RRF Saved" && resultRRF[0].Status != "Non Billable" && resultRRF[0].Status != null) || (resultRRF[0].Status == "RRF Saved" && currentuseremail != rrfAuthorEmailAddress) || ((resultRRF[0].Status == "Withdrawn" || resultRRF[0].Status == "Rejected") && currentuseremail != rrfAuthorEmailAddress)) {
                $("#btnsave").hide();
                $("#btnsubmit").hide();
                $("#btnsearch").hide();
                if (RMOSuperUserFlag != "1") {
                    disablecontrols();
                }
            }
            if (RMOSuperUserFlag == "1") {
                $("#btnsave").show();
                //enablecontrols();
            }

        }
        else {
            $("#spnClone").css('display', 'none');
            $("#rdbexisting").prop('checked', true);
            $("#txtoppertunitystatus").attr("disabled", true);
            $("#ddlprojectname").empty();
            $("#ddlprojectname").append(new Option("Select", 0));
            for (var index = 0; index < projectresult.length; index++) {
                // $("#ddlprojectname").append($('<option></option>').text(projectresult[index].ProjectName));
                $('#ddlprojectname').append("<option data-value = '" + projectresult[index].ProjectId + "'>" + projectresult[index].ProjectName + "</option>");
            }

            /* Disable all controls if Projectname having select value */
            if ($('#ddlprojectname option:selected').text() == "Select") {
                $("#accordion input[type=text],#accordion input[type=radio],#accordion textarea,#accordion input[type=checkbox],#accordion select").attr('disabled', true);
            }

        }
        $('.classReqPercentage').numeric({ max: 100 });
        function toggleIcon(e) {
            $(e.target)
                .prev('.panel-heading')
                .find(".more-less")
                .toggleClass('glyphicon-plus glyphicon-minus');
        }
        $('.panel-group').on('hidden.bs.collapse', toggleIcon);
        $('.panel-group').on('shown.bs.collapse', toggleIcon);
        $('.accordion-body').each(function () {
            if ($(this).hasClass('in')) {
                $(this).collapse('toggle');
            }
        });
        $('.loader').hide();

    });


    function date() {

        //$("#txtrequirementstartdate,#txtrequirementenddate").datepicker({
        //        dateFormat: 'dd-M-yy',
        //        changeMonth: true,
        //        changeYear: true,
        //        minDate: 0,
        //        onSelect: function (selected, evnt) {
        //
        //        }
        //    });
        //	

        $(".txtrequirementstartdate").datepicker({
            dateFormat: 'dd-M-yy',
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            onSelect: function (selected) {
                $(".txtrequirementenddate").datepicker("option", "minDate", selected)

            }

        });

        $(".txtrequirementenddate").datepicker({
            dateFormat: 'dd-M-yy',
            changeMonth: true,
            changeYear: true,
            minDate: 0,
            onSelect: function (selected) {

                $(".txtrequirementstartdate").datepicker("option", "maxDate", selected)

            }

        });
    }
    /*Bind Entity,RequirementType,RatePerDay,SubPractice fields on Page Load*/
    function binddropdown() {
        var urlentity = site_url + "_api/RRFMaster?$filter=(Type eq 'Entity') or (Type eq 'RequirementType') or (Type eq 'RatePerDay')or (Type eq 'SalaryRange')&$orderby=Value asc";
        var urlsubpratice = site_url + "_api/Skills?$select=Sub_Practice&$orderby=Sub_Practice asc";
        var resultentity = resultset(urlentity);
        //$('#lbluser').html(resultuserprofile.DisplayName);
        $("#ddlentity").append(new Option("Select", 0));
        $("#ddlrequirementtype").append(new Option("Select", 0));
        $("#ddlclientrate").append(new Option("Select", 0));
        for (var index = 0; index < resultentity.length; index++) {
            if (resultentity[index].Type == "Entity") {
                $("#ddlentity").append($('<option></option>').text(resultentity[index].Value));
            }
            else if (resultentity[index].Type == "RequirementType") {
                $("#ddlrequirementtype").append($('<option></option>').text(resultentity[index].Value));
            }
            else if (resultentity[index].Type == "RatePerDay") {
                $("#ddlclientrate").append($('<option></option>').text(resultentity[index].Value));
            } else if (resultentity[index].Type == "SalaryRange") {

                $("#ddlsalaryrange").append($('<option></option>').text(resultentity[index].Value));

            }
        }
        var resultsubpractice = resultset(urlsubpratice);
        var unique = {};
        var distinct = [];
        for (var index in resultsubpractice) {
            if (typeof (unique[resultsubpractice[index].Sub_Practice]) == "undefined") {
                distinct.push(resultsubpractice[index].Sub_Practice);
            }
            unique[resultsubpractice[index].Sub_Practice] = 0;
        }
        $.each(distinct, function (val, text) {
            $('#ddlsubpractice').append($('<option></option>').val(text).html(text));
        });
        $("#ddlsubpractice").prepend("<option value='Select'>Select</option>").val('Select');

    }

    /* End */


    /*function is used to display first accordian data on page load if we get RRF Number */
    function displayFirstAccData(result) {
        $('#lblrrfid').html((result[0].RRFNO));
        $("#txtoppertunitystatus").val(result[0].OpportunityStatus);
        $("#txtcustomer").val(result[0].Customer);
        if (result[0].Entity != "Select" && result[0].Entity != null) {

            $("#ddlentity").val(result[0].Entity);
            bindentitydependentdata();
        }
        $("#ddlsubpractice").val(result[0].SubPractice);
        $("#txtpractice").val(result[0].Practice);
        $("#txtgbu").val(result[0].GBU);
        if (result[0].RequirementType != "Select" && result[0].RequirementType != null) {
            $("#ddlrequirementtype").val(result[0].RequirementType);
        }
        if (result[0].ClientRateCurrancy != "Select" && result[0].ClientRateCurrancy != null) {
            $("#ddlclientrate").val(result[0].ClientRateCurrancy);
        }
        $("#txtclientrate").val(result[0].ClientRate);
        if (result[0].CostCenter != "Select" && result[0].CostCenter != null) {
            costcenter();
            $("#ddlcostcenter").val(result[0].CostCenter);
        }

        if (result[0].Infrastructure != undefined || result[0].Infrastructure != null) {
            var infrastructure = result[0].Infrastructure;
            infrastructure = infrastructure.split(';');
            for (var i = 0; i < infrastructure.length; i++) {
                $(':checkbox').each(function (j) {
                    if ($(this).val() == infrastructure[i]) {
                        $(this).prop('checked', true);
                    }

                });
            }
        }

    }


    /*Bind Industry,Industryexperiance,Minimumrelevantexperiance,TypeOfAssignment,Vacancy,SalaryRange and BaseLocation on 2nd accordian click */
    function bindsecondaccdata() {

        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('show');
        $("#collapseThree").collapse('hide');
        $("#collapseFour").collapse('hide');



        if (rrfno != undefined || rrfno != null) {
            if (rrfsecondflag == "0") {
                secondaccdropdownfill();
            }
            rrfsecondflag = "1";
            displaySecondAccData(resultRRF);
            bindspecificdata(resultRRF);
        }
        else {
            if (Secondflag == "0") {
                secondaccdropdownfill();
            }
            Secondflag = "1";
        }
    }
    function bindsecondaccdataonload() {
        $("#collapseOne").collapse('show');
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapseFour").collapse('hide');



        if (rrfno != undefined || rrfno != null) {
            if (rrfsecondflag == "0") {
                secondaccdropdownfill();
            }
            rrfsecondflag = "1";
            displaySecondAccData(resultRRF);
            bindspecificdata(resultRRF);
        }
        else {
            if (Secondflag == "0") {
                secondaccdropdownfill();
            }
            Secondflag = "1";
        }

    }
    function secondaccdropdownfill() {
        var urlvacancy = site_url + "_api/RRFMaster?$filter=(Type ne 'Entity') or (Type ne 'IndustryExperience') or (Type ne 'MinRelevantExperience') or (Type ne 'RequirementType') or (Type ne 'RatePerDay') or (Type ne 'Sub-Practice')&$orderby=Value asc";
        var urlindustryexp = site_url + "_api/RRFMaster?$filter=(Type eq 'IndustryExperience') or (Type eq 'MinRelevantExperience') or (Type eq 'OnSiteTravelDuration')&$orderby=Created_Date asc";
        var urllocation = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRF')/fields?$filter=(EntityPropertyName eq 'PostingTimeTypeId')";
        var result = resultset(urllocation);
        var resultvacancy = resultset(urlvacancy);
        resultindustryexp = resultset(urlindustryexp);
        //$("#ddlemployeerole").empty();
        $("#ddldesignation").empty();
        $("#ddlroleband").empty();
        $("#ddltypeofassignemnt").empty();
        $("#ddlemploymenttype").empty();
        $("#ddlpositiontype").empty();
        $("#ddlindustry").empty();
        $("#ddlindustryexperiance").empty();
        $("#ddlminrelevantexp").empty();
        $("#ddlnatureofvacancy").empty();
        $("#txtdurationofonsitetravel").empty();
        if ($('#ddlentity option:selected').text() == "Select") {
            $("#ddlsalaryrange").empty();
            $("#ddlbaselocation").empty();
            $("#ddlsalaryrange").append(new Option("Select", 0));
            $("#ddlbaselocation").append(new Option("Select", 0));
        }

        // $("#ddlemployeerole").append(new Option("Select", 0));
        $("#ddldesignation").append(new Option("Select", 0));
        $("#ddlroleband").append(new Option("Select", 0));
        $("#ddltypeofassignemnt").append(new Option("Select", 0));
        $("#ddlemploymenttype").append(new Option("Select", 0));
        $("#ddlpositiontype").append(new Option("Select", 0));
        $("#ddlindustry").append(new Option("Select", 0));
        $("#ddlindustryexperiance").append(new Option("Select", 0));
        $("#ddlnatureofvacancy").append(new Option("Select", 0));
        $("#ddlreplacementfor").append(new Option("Select", 0));
        $("#ddlprimaryskill").append(new Option("Select", 0));
        $("#ddlsecondryskill").append(new Option("Select", 0));
        $("#ddlminrelevantexp").append(new Option("Select", 0));
        $("#txtdurationofonsitetravel").append(new Option("Select", 0));

        for (var index = 0; index < resultvacancy.length; index++) {
            if (resultvacancy[index].Type == "EmployeeRoles") {
                if ($('#rdbnew').is(':checked')) {
                    $("#ddlnatureofvacancy").attr("disabled", true);
                    $("#ddlreplacementfor").attr("disabled", true);
                    if (resultvacancy[index].Value == "Billable" || resultvacancy[index].Value == "Billable Consultant") {
                        //$("#ddlemployeerole").empty();
                        $("#ddlemployeerole").append($('<option></option>').text(resultvacancy[index].Value));
                    }
                }
                else {
                    $("#ddlnatureofvacancy").attr("disabled", false);
                    $("#ddlreplacementfor").attr("disabled", false);
                    //$("#ddlemployeerole").empty();
                    $("#ddlemployeerole").append($('<option></option>').text(resultvacancy[index].Value));
                }
            }
            else if (resultvacancy[index].Type == "Designation") {
                $("#ddldesignation").append($('<option></option>').text(resultvacancy[index].Value));
            }
            else if (resultvacancy[index].Type == "RoleBand") {
                $("#ddlroleband").append($('<option></option>').text(resultvacancy[index].Value));
            }
            else if (resultvacancy[index].Type == "Industry") {
                $("#ddlindustry").append($('<option></option>').text(resultvacancy[index].Value));
            }
            else if (resultvacancy[index].Type == "TypeOfAssignment") {
                $("#ddltypeofassignemnt").append($('<option></option>').text(resultvacancy[index].Value));

            }
            else if (resultvacancy[index].Type == "NatureOfVacancy") {
                $("#ddlnatureofvacancy").append($('<option></option>').text(resultvacancy[index].Value));

            }
            else if (resultvacancy[index].Type == "SalaryRange") {
                if ($('#ddlentity option:selected').text() == "Select") {
                    $("#ddlsalaryrange").append($('<option></option>').text(resultvacancy[index].Value));
                }
            }
            else if (resultvacancy[index].Type == "Location") {
                if ($('#ddlentity option:selected').text() == "Select") {
                    $("#ddlbaselocation").append($('<option></option>').text(resultvacancy[index].Value));
                }
            }
            else if (resultvacancy[index].Type == "WorkerType") {
                $("#ddlemploymenttype").append($('<option></option>').text(resultvacancy[index].Value));

            }

        }

        for (var index = 0; index < resultindustryexp.length; index++) {
            if (resultindustryexp[index].Type == "IndustryExperience") {
                $("#ddlindustryexperiance").append($('<option></option>').text(resultindustryexp[index].Value));

            }
            if (resultindustryexp[index].Type == "OnSiteTravelDuration") {
                $("#txtdurationofonsitetravel").append($('<option></option>').text(resultindustryexp[index].Value));
            }

        }


        for (var index = 0; index < result.length; index++) {
            for (var subindex = 0; subindex < result[index].Choices.results.length; subindex++) {
                $("#ddlpositiontype").append($('<option></option>').text(result[index].Choices.results[subindex]));
            }
        }

    }


    /* Bind Employee Role on the selection of Project Status */
    function bindemployeerole() {
        $("#ddlemployeerole").empty();
        $("#ddlemployeerole").append(new Option("Select", 0));
        var urlvacancy = site_url + "_api/RRFMaster?$filter=(Type eq 'EmployeeRoles')&$orderby=Value asc";
        var resultvacancy = resultset(urlvacancy);
        for (var index = 0; index < resultvacancy.length; index++) {
            if (resultvacancy[index].Type == "EmployeeRoles") {
                if ($('#rdbnew').is(':checked')) {
                    if (resultvacancy[index].Value == "Billable" || resultvacancy[index].Value == "Billable Consultant") {
                        //$("#ddlemployeerole").empty();
                        $("#ddlemployeerole").append($('<option></option>').text(resultvacancy[index].Value));
                    }
                }
                else {
                    //$("#ddlemployeerole").empty();
                    $("#ddlemployeerole").append($('<option></option>').text(resultvacancy[index].Value));
                }
            }
        }

    }


    /*function is used to display second accordian data on 2nd accordian click after RRF saved or submit  */
    function displaySecondAccData(result) {
        if (result[0].EmployeeRole != null && result[0].EmployeeRole != "Select") {
            $("#ddlemployeerole").val(result[0].EmployeeRole);
        }

        if (result[0].Designation != null && result[0].Designation != "Select") {
            $("#ddldesignation").val(result[0].Designation);
        }
        if (result[0].RoleBand != null && result[0].RoleBand != "Select") {
            // $("#btnsearch").prop("disabled", false);		
            $("#ddlroleband").val(result[0].RoleBand);
        }

        if ($('#ddlrequirementtype option:selected').text() == "G&A") {
            $('input[name="clientinterview"]').prop("disabled", true);
        }
        else if (rdbclientinterviewType != "") {

            if (rdbclientinterviewType == "Yes")
                $("#rdbyes").prop('checked', true);
            else
                $("#rdbno").prop('checked', true);
        }
        else if (result[0].ClientInterviewRequired == "Yes") {
            $("#rdbyes").prop('checked', true);
        }
        else {
            $("#rdbno").prop('checked', true);
        }

        if (result[0].WorkerType != null && result[0].WorkerType != "Select") {
            $("#ddlemploymenttype").val(result[0].WorkerType);
        }
        if (result[0].PostingTimeTypeId != null && result[0].PostingTimeTypeId != "Select") {
            $("#ddlpositiontype").val(result[0].PostingTimeTypeId);
        }
        if (result[0].StartDate != null) {
            if (result[0].NewStartDate != null) {
                var startdate = convert_date_DDMMYYYY(result[0].NewStartDate);
                $("#txtrequirementstartdate").val(startdate);
            }
        }
        if (result[0].EndDate != null) {
            if (result[0].NewEndDate != null) {
                var enddate = convert_date_DDMMYYYY(result[0].NewEndDate);
                $("#txtrequirementenddate").val(enddate);
            }
        }
        //else {
        //    $("#txtrequirementenddate").val("");
        //}
        if (result[0].RequirementPct != null) {
            $("#txtrequirementpercentage").val(result[0].RequirementPct);
        }
        if (result[0].NatureofVacancy != null && result[0].NatureofVacancy != "Select") {
            $("#ddlnatureofvacancy").val(result[0].NatureofVacancy);
        }
        if (result[0].Industry != null && result[0].Industry != "Select") {
            $("#ddlindustry").val(result[0].Industry);
        }
        if (result[0].IndustryExp != null && result[0].IndustryExp != "Select") {
            $("#ddlindustryexperiance").val(result[0].IndustryExp);
        }

        if (result[0].WorkLocation != null) {
            $("#txtworklocation").val(result[0].WorkLocation);
        }
        if (result[0].SalaryRangeMinAmt != null) {
            $("#txtminsalaryrange").val(result[0].SalaryRangeMinAmt);
        }
        if (result[0].SalaryRangeMaxAmt != null) {
            $("#txtmaxsalaryrange").val(result[0].SalaryRangeMaxAmt);
        }
        if (result[0].TypeofAssignment != null && result[0].TypeofAssignment != "Select") {
            $("#ddltypeofassignemnt").val(result[0].TypeofAssignment);
        }
        if (result[0].DurationofOnsiteTravel != null) {
            $("#txtdurationofonsitetravel").val(result[0].DurationofOnsiteTravel);
        }




    }

    /*set dropdown value after RRF Saved or submit on page load */
    function bindspecificdata(resultRRF) {
        var employetype = $('#ddlemploymenttype option:selected').text();
        if (employetype != "Select") {
            var urllocation = site_url + "_api/RRFMaster?$filter=Type eq 'EmployeeTypeId' and Value eq '" + employetype + "'&$orderby=Value asc";
            var result = resultset(urllocation);
            $("#ddlemptypey").empty();
            $("#ddlemptypey").append(new Option("Select", 0));
            for (var index = 0; index < result.length; index++) {
                $("#ddlemptypey").append($('<option></option>').text(result[index].Code));
            }
        }
        if (resultRRF[0].EmployeeTypeId != null && resultRRF[0].EmployeeTypeId != "Select") {
            $("#ddlemptypey").val(resultRRF[0].EmployeeTypeId);
        }
        else {
            $("#ddlemptypey").val(ddlEType);
        }
        var value = $('#ddlentity option:selected').text();
        if (value != "Select") {
            var url = site_url + "_api/RRFMaster?$filter=Entity eq '" + value + "'";
            var resultloc = resultset(url);
            $("#ddlsalaryrange").empty();
            $("#ddlbaselocation").empty();
            for (var index = 0; index < resultloc.length; index++) {
                if (resultloc[index].Type == "SalaryRange") {
                    $("#ddlsalaryrange").append($('<option></option>').text(resultloc[index].Value));
                }
                else if (resultloc[index].Type == "Location") {
                    $("#ddlbaselocation").append($('<option></option>').text(resultloc[index].Value));
                }
            }
        }
        if (resultRRF[0].BaseLocation != null && resultRRF[0].BaseLocation != "Select") {
            $("#ddlbaselocation").val(resultRRF[0].BaseLocation);
        }
        else {
            $("#ddlbaselocation").val(ddlbaselocationType);
        }
        if (resultRRF[0].SalaryRangeCurrancy != null && resultRRF[0].SalaryRangeCurrancy != "Select") {
            $("#ddlsalaryrange").val(resultRRF[0].SalaryRangeCurrancy);
        }
        var value = $('#ddlsubpractice option:selected').text();
        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }
        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }
        if (value != "Select") {
            var url = site_url + "_api/Skills?$select=Skill_Details,Practice&$filter=Sub_Practice eq '" + value + "'&$orderby=Skill_Details asc";
            var resultskill = resultset(url);
            $('#ddlprimaryskill').empty();
            $('#ddlsecondryskill').empty();
            $("#ddlprimaryskill").append(new Option("Select", 0));
            $("#ddlsecondryskill").append(new Option("Select", 0));

            var array1 = [];
            var array2 = [];
            for (var index in resultskill) {
                array1.push(resultskill[index].Skill_Details);
                array2.push(resultskill[index].Skill_Details);
                $("#ddlprimaryskill").append($('<option></option>').text(resultskill[index].Skill_Details));
                $("#ddlsecondryskill").append($('<option></option>').text(resultskill[index].Skill_Details));
            }
            $("#ddlprimaryskill").select2({
                data: array1
            });
            $("#ddlsecondryskill").select2({
                data: array2
            });

        }
        if (resultRRF[0].PrimarySkill != null && resultRRF[0].PrimarySkill != "Select") {
            //$('select.ddlprimaryskill')[0].sumo.selectItem(resultRRF[0].PrimarySkill);
            //$("#ddlprimaryskill").val(resultRRF[0].PrimarySkill);
            $("#ddlprimaryskill").val(resultRRF[0].PrimarySkill).trigger('change');
            //window.Search = $('.ddlprimaryskill').SumoSelect({ csvDispCount: 3, search: true, placeholder: 'Type Name' });
        }
        else {
            $("#ddlprimaryskill").val(ddlPrimaryType);
        }

        if (resultRRF[0].SecondarySkill != null && resultRRF[0].SecondarySkill != "Select") {
            //window.Search = $('.ddlsecondryskill').SumoSelect({ csvDispCount: 3, search: true, placeholder: 'Type Name' });
            //$('select.ddlsecondryskill')[0].sumo.selectItem(resultRRF[0].SecondarySkill);
            // $("#ddlsecondryskill").val(resultRRF[0].SecondarySkill);
            $("#ddlsecondryskill").val(resultRRF[0].SecondarySkill).trigger('change');
        }
        else {
            $("#ddlsecondryskill").val(ddlSecondryType);
        }


        if ($('#ddlindustryexperiance option:selected').text() != "Select") {
            var minexp = "0";
            for (var index = 0; index < resultindustryexp.length; index++) {

                if (resultindustryexp[index].Type == "MinRelevantExperience") {
                    var minrelevantexp = resultindustryexp[index].Value;
                    if ($('#ddlindustryexperiance option:selected').text() == minrelevantexp) {
                        if (minexp == "0") {
                            $("#ddlminrelevantexp").append($('<option></option>').text(minrelevantexp));
                            minexp = "1";
                        }
                        if (resultRRF[0].MinRelevantExp != null && resultRRF[0].MinRelevantExp != "Select") {
                            $("#ddlminrelevantexp").val(resultRRF[0].MinRelevantExp);
                        }
                        //return false;
                    }
                    else {
                        $("#ddlminrelevantexp").append($('<option></option>').text(minrelevantexp));
                    }

                }

            }
            //return true;
        }


        if ($('#ddlnatureofvacancy option:selected').text() != "Select") {
            if ($('#ddlnatureofvacancy option:selected').text() == "New") {
                $('#ddlreplacementfor').empty();
                $('#select2-ddlreplacementfor-container').empty();
                $("#ddlreplacementfor").attr("disabled", true);
            }
            else {

                if (resultRRF[0].Status != "RRF Saved" && resultRRF[0].Status != "Non Billable" && resultRRF[0].Status != null) {
                    $("#ddlreplacementfor").attr("disabled", true);
                }
                else {
                    $("#ddlreplacementfor").attr("disabled", false);
                }
                $('#ddlreplacementfor').empty();
                var resourceurl = site_url + "_api/ProjectTeam?$select=ResourceName&$filter=ProjectId eq guid'" + projectguid + "'";
                var resourceresult = resultset(resourceurl);
                var array = [];
                $('#ddlreplacementfor').append(new Option("Select", 0));
                for (var index = 0; index < resourceresult.length; index++) {
                    array.push(resourceresult[index].ResourceName);
                    $("#ddlreplacementfor").append($('<option></option>').text(resourceresult[index].ResourceName));
                }
                $("#ddlreplacementfor").select2({
                    data: array
                });
            }
        }
        if (resultRRF[0].ReplacementFor != null && resultRRF[0].ReplacementFor != "Select") {
            //$('#ddlreplacementfor').select2(resultRRF[0].ReplacementFor);
            //$("#ddlreplacementfor").select2("val", "+resultRRF[0].ReplacementFor+");
            $("#ddlreplacementfor").val(resultRRF[0].ReplacementFor).trigger('change');
            //$("#ddlreplacementfor").select2('data', {text: resultRRF[0].ReplacementFor});
            // $("#ddlreplacementfor").val(resultRRF[0].ReplacementFor);
            //$('select.ddlreplacementfor')[0].sumo.selectItem(resultRRF[0].ReplacementFor);
        }

    }

    /*function is used to get all resource id on 3rd accordian click */
    function bindthirdaccdata() {
        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('show');
        $("#collapseFour").collapse('hide');
        if (rrfno != undefined || rrfno != null) {
            displayData(resultRRF);
        }

    }


    function displayData(result) {
        if (Reportingflag == "0") {
            var SalesPerson = this.SPClientPeoplePicker.SPClientPeoplePickerDict.divReportingTo_TopSpan;
            var SalesPersonEmail = result[0].ReportingToUser.Title;
            SalesPerson.AddUserKeys(SalesPersonEmail);
        }
        Reportingflag = "1";

        if (resultRRF[0].ProjectManagerUser.Title != null || resultRRF[0].ProjectManagerUser.Title != undefined) {
            var projectmanager = resultRRF[0].ProjectManagerUser.Title;
            // projectmanager = projectmanager.split(";");
            //projectmanager = projectmanager[0];
            $("#txtprojectmanager").val(projectmanager);
        }

        if (resultRRF[0].FPNAUser.Title != null || resultRRF[0].FPNAUser.Title != undefined) {
            var fpnaapprover = resultRRF[0].FPNAUser.Title;
            //fpnaapprover = fpnaapprover.split(";");
            //fpnaapprover = fpnaapprover[0];
            $("#txtfpaapprover").val(fpnaapprover);
        }

        if (resultRRF[0].ClientPartnerUser.Title != null || resultRRF[0].ClientPartnerUser.Title != undefined) {
            var clientpartner = resultRRF[0].ClientPartnerUser.Title;
            //clientpartner = clientpartner.split(";");
            //clientpartner = clientpartner[0];
            $("#txtclientpartner").val(clientpartner);
        }

        if (resultRRF[0].RMOSPOCUser.Title != null || resultRRF[0].RMOSPOCUser.Title != undefined) {
            var rmospoc = resultRRF[0].RMOSPOCUser.Title;
            //rmospoc = rmospoc.split(";");
            //rmospoc = rmospoc[0];
            $("#txtrmospoc").val(rmospoc);
        }


    }

    function fourthaccordiandata(result) {
        $("#txtjobsummary").val(result[0].DescriptionSummary);
        $("#txtjobdescription").val(result[0].JobDescriptionSummary);
        getUploadedFiles(rrfno);
    }

    function bindfirstaccdata() {
        $("#collapseOne").collapse('show');
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapseFour").collapse('hide');
    }

    function bindfouraccdata() {
        $("#collapseOne").collapse('hide');
        $("#collapseTwo").collapse('hide');
        $("#collapseThree").collapse('hide');
        $("#collapseFour").collapse('show');
    }

    /*Code is used to disable all controls */
    function disablecontrols() {
        $(".contain-div input[type=text],.contain-div input[type=radio],.contain-div input[type=file],.contain-div textarea,.contain-div input[type=checkbox],.contain-div select").attr('disabled', true);
    }
    function enablecontrols() {
        $(".contain-div input[type=text],.contain-div input[type=radio],.contain-div input[type=file],.contain-div textarea,.contain-div input[type=checkbox],.contain-div select").attr('disabled', false);
    }

    function getUploadedFiles(rrfno) {
        var Folder_name = rrfno;
        var url = "../_api/web/Lists/getbytitle('RRFSupportDocument')/items?$filter=RRFID eq \'" + rrfno + "\'&$select=FileLeafRef,ID";
        $.ajax({
            url: url,
            type: "GET",
            async: false,
            headers: { "Accept": "application/json;odata=verbose" },
            success: function (data) {
                var file_ids = '';
                $('#delete_file_ids').text('');
                $(".raisedDocumnts").remove();
                $("#uploaded_files").empty();

                var upload_file_id = 0;
                var remove_id = '';
                $.each(data.d.results, function (key, val) {
                    upload_file_id++;
                    remove_id = 'remove' + upload_file_id;

                    ID = val.Id;

                    if (file_ids == '') {
                        file_ids = ID;
                    }
                    else {
                        file_ids = file_ids + "," + ID;
                    }
                    //var href = "../_layouts/15/download.aspx?SourceUrl=https://bristleconeonline.sharepoint.com/sites/PPMUAT/RRFSupportDocument/" + Folder_name + "/" + val.FileLeafRef + "";
                    var href = getSupportDocUrl(Folder_name, val.FileLeafRef);
                    var file_html = "<tr id=" + remove_id + "><td>" + val.FileLeafRef + "</td>";
                    file_html = file_html + "<td class='text-center' style='width:30px;'><a href=\"" + href + "\" download ><i class='fa fa-download'></i></a></td>";
                    file_html = file_html + "<td class='text-center' style='width:30px;'><a onclick='delete_file(\"" + remove_id + "\",\"" + ID + "\")' href='javascript:void(0)'><i class='fa fa-trash-o'></i></a></td>";
                    file_html = file_html + " </tr>";
                    var liHtml = "<li class='raisedDocumnts'><a href=\"" + href + "\">" + val.FileLeafRef + "</a></li>";
                    $("#uploaded_files").append(file_html);
                });
                $('#delete_file_ids').text(file_ids);
                $('#uploaded_file_count').text(upload_file_id);
                if (upload_file_id > 0) {
                    $('#outer-popup-a').show();
                }
                //else {
                //    var file_html = "<tr><td colspan='3' style='text-align:center'>No file found</td>";
                //    file_html = file_html + " </tr>";
                //    $("#uploaded_files").append(file_html);
                //    $('#outer-popup-a').hide();
                //}

            }
        });
        $('.loader').hide();
    }

    // Delete file

    function delete_file(id, i) {


        $("#rrfsavedmsg").css("display", "none");
        $("#rrfconfirmationmsg").css("display", "none");
        $("#divMultipleAssignment").css("display", "none");
        $("#divResourceSaveMsg").css("display", "none");
        $("#fileuploadmsg").css("display", "block");
        document.getElementById("Confirmation_msg").innerHTML = "Are you sure you want to Delete the item?";
        $('#ok_click').attr('onclick', 'delete_file_temp("' + id + '","' + i + '")');
        $("#alertmain").show();
    }

    function delete_file_temp(hide_id, id) {
        $('.loader').show();
        var listname = "RRFSupportDocument";
        var requestUri = _spPageContextInfo.siteAbsoluteUrl;
        getListItemForDelete(requestUri, listname, id, function (data) {
            $.ajax({
                url: data.d.__metadata.uri,
                type: "POST",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-Http-Method": "DELETE",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "If-Match": data.d.__metadata.etag
                },
                success: function (data) {
                    $('.loader').hide();
                    $("#alertmain").hide();
                    //document.getElementById("Alert_msg").innerHTML = "Attachment Deleted Successfully!";
                    $('#' + hide_id).fadeOut();
                    var file_count = $('#uploaded_file_count').text();
                    file_count = file_count - 1;
                    $('#uploaded_file_count').text(file_count);
                },
                error: function (data) {


                }
            });
        });
    }


    function getListItemForDelete(url, listname, Id, complete) {
        $.ajax({
            url: url + "/_api/web/lists/GetByTitle('" + listname + "')/items('" + Id + "')",
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                complete(data);
            },
            error: function (data) {

            }
        });
    }


    /* Project status radio button on change function */
    $('input:radio[name="projectstatus"]').change
    (
      function () {
          if ($(this).is(':checked') && $(this).val() == 'New') {

              $("#ddlprojectname").empty();
              $("#txtoppertunitystatus").attr("disabled", true);
              $("#ddlnatureofvacancy").attr("disabled", true);
              $("#ddlreplacementfor").attr("disabled", true);
              var userid = _spPageContextInfo.userId;
              var opertunityurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Opportunity')/Items?$select=Title&$filter=OpportunityOwnerId eq '" + userid + "' or DeliveryLeadId eq '" + userid + "' or PracticeLeadId eq '" + userid + "'&$orderby=Title asc";
              var opertunityresult = resultset(opertunityurl);
              $("#ddlprojectname").append(new Option("Select", 0));
              for (var index = 0; index < opertunityresult.length; index++) {
                  //$("#ddlprojectname").append(new Option(opertunityresult[index].Title, 0));
                  $("#ddlprojectname").append($('<option></option>').text(opertunityresult[index].Title));
              }
          }
          else if ($(this).is(':checked') && $(this).val() == 'Existing') {
              $("#ddlnatureofvacancy").attr("disabled", false);
              $("#ddlreplacementfor").attr("disabled", false);
              $("#txtoppertunitystatus").attr("disabled", true);
              $("#ddlprojectname").empty();
              $("#ddlprojectname").append(new Option("Select", 0));
              for (var index = 0; index < projectresult.length; index++) {
                  //$("#ddlprojectname").append(new Option(projectresult[index].ProjectName, 0));
                  //$("#ddlprojectname").append($('<option></option>').text(projectresult[index].ProjectName)); // old
                  $('#ddlprojectname').append("<option data-value = '" + projectresult[index].ProjectId + "'>" + projectresult[index].ProjectName + "</option>");
              }
          }
          // bindemployeerole();
      }
    );


    /*Code is used to bind oppertunity Status,customer,GBU,FPAApprover,RMOSpoc on change of ProjectName dropdown */
    $("#ddlprojectname").change(function () {
        $('#errprojectname').css('display', 'none');
        $('#errgbu').css('display', 'none');
        var Secondflag = "0";
        var Thirdflag = "0";
        $("#accordion input[type=text],#accordion input[type=radio],#accordion textarea,#accordion input[type=checkbox],#accordion select").attr('disabled', false);
        $("#txtoppertunitystatus,#txtgbu,#txtpractice,#txtcustomer,#txtjobsummary,#txtclientpartner,#txtprojectmanager,#txtrmospoc,#txtfpaapprover").prop("disabled", true);

        if ($('input[name=projectstatus]:checked').val() == "Existing") {
            //var value = $('#ddlprojectname option:selected').text();
            var value = $("#ddlprojectname option:selected").attr('data-value');
            var url = site_url + "_api/Projects?$select=ProjectName,ProjectId,ProjectCode,ProjectOwnerId,CustomerName,GBU,FinanceTeam,ClientPartner,RMOSPOC,ProjectOwnerName,ProjectStartDate,ProjectFinishDate&$filter=ProjectId eq (guid'" + value + "')";
            var result = resultset(url);
            projectguid = result[0].ProjectId;
            projectcode = result[0].ProjectCode;
            projectownerGUID = result[0].ProjectOwnerId;
            $("#txtoppertunitystatus").val("");
            $("#txtcustomer").val("");
            $("#txtgbu").val("");
            $("#txtfpaapprover").val("");
            $("#txtrmospoc").val("");
            $("#txtclientpartner").val("");
            $("#txtprojectmanager").val("");
            //$("#txtoppertunitystatus").val("");
            $("#txtcustomer").val(result[0].CustomerName);
            $("#txtgbu").val(result[0].GBU);
            //if (result[0].FinanceTeam != null) {
            //    fpna = result[0].FinanceTeam;
            //    if (fpna.indexOf("|") > 0) {
            //        $("#txtfpaapprover").val(fpna.substr(fpna.lastIndexOf('|') + 1));
            //        var fpnaid = fpna.substring(0, fpna.lastIndexOf("|"));
            //        var urlfpna = searchResourcefromResourcesUsingEmpid(fpnaid);//"https://ppmdev.bcone.com/_api/Resources?$select=ResourceId,ResourceEmailAddress&$filter=EmployeeID eq '" + fpnaid + "'";
            //        var resultfpna = resultset(urlfpna);
            //        fpnauid = fpna.substr(fpna.lastIndexOf('|') + 1);
            //        fpnauid = fpnauid + ";" + resultfpna[0].ResourceId + "#" + resultfpna[0].ResourceEmailAddress;
            //        var useridurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + resultfpna[0].ResourceEmailAddress + "'";
            //        var userdetails = resultset(useridurl);
            //        fpnauserid = userdetails[0].Id;
            //    }
            //    else if (fpna.indexOf("@") > 0) {

            //        var fpnauser = getSharePointUserID(fpna);
            //        if (fpnauser != null) {
            //            var fpnauserdetails = fpnauser.split("#");
            //            fpnauserid = parseInt(fpnauserdetails[0]);
            //            $("#txtfpaapprover").val(fpnauserdetails[1]);
            //            fpnauid = fpnauserdetails[1];
            //        }

            //    }
            //    else {
            //        $("#txtfpaapprover").val(fpna);
            //        fpnauid = fpna;
            //    }
            //}
            var GUBValue = result[0].GBU;
            if (GUBValue.indexOf("&") > 0) {
                GUBValue = GUBValue.replace('&', '%26');
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRFGBUMAPPING')/Items?$select=FPNAId,FPNA/Title&$Expand=FPNA&$filter=GBU eq '" + GUBValue + "'";
                var gburesult = resultset(url);
                fpnauserid = gburesult[0].FPNAId;
                $("#txtfpaapprover").val(gburesult[0].FPNA.Title);
            }
            else {
                var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRFGBUMAPPING')/Items?$select=FPNAId,FPNA/Title&$Expand=FPNA&$filter=GBU eq '" + GUBValue + "'";
                var gburesult = resultset(url);
                fpnauserid = gburesult[0].FPNAId;
                $("#txtfpaapprover").val(gburesult[0].FPNA.Title);
            }

            if (result[0].RMOSPOC != null) {
                rmospoc = result[0].RMOSPOC;
                if (rmospoc.indexOf("|") > 0) {
                    $("#txtrmospoc").val(rmospoc.substr(rmospoc.lastIndexOf('|') + 1));
                    var rmoid = rmospoc.substring(0, rmospoc.lastIndexOf("|"));
                    var urlrmospoc = searchResourcefromResourcesUsingEmpid(rmoid);//"https://ppmdev.bcone.com/_api/Resources?$select=ResourceId,ResourceEmailAddress&$filter=EmployeeID eq '" + rmoid + "'";
                    var resultrmospoc = resultset(urlrmospoc);
                    rmospocuid = rmospoc.substr(rmospoc.lastIndexOf('|') + 1);
                    rmospocuid = rmospocuid + ";" + resultrmospoc[0].ResourceId + "#" + resultrmospoc[0].ResourceEmailAddress;
                    var useridurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + resultrmospoc[0].ResourceEmailAddress + "'";
                    var userdetails = resultset(useridurl);
                    rmospocuserid = userdetails[0].Id;
                }
                else {
                    $("#txtrmospoc").val(rmospoc);
                    rmospocuid = "";
                }
            }
            if (result[0].ClientPartner != null) {
                clientpartner = result[0].ClientPartner;
                if (clientpartner.indexOf("|") > 0) {
                    $("#txtclientpartner").val(clientpartner.substr(clientpartner.lastIndexOf('|') + 1));
                    var cpid = clientpartner.substring(0, clientpartner.lastIndexOf("|"));
                    var urlcp = searchResourcefromResourcesUsingEmpid(cpid);//"https://ppmdev.bcone.com/_api/Resources?$select=ResourceId,ResourceEmailAddress&$filter=EmployeeID eq '" + cpid + "'";
                    var resultcp = resultset(urlcp);
                    clientpartneruid = clientpartner.substr(clientpartner.lastIndexOf('|') + 1);
                    clientpartneruid = clientpartneruid + ";" + resultcp[0].ResourceId + "#" + resultcp[0].ResourceEmailAddress;
                    var useridurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + resultcp[0].ResourceEmailAddress + "'";
                    var userdetails = resultset(useridurl);
                    clientpartneruserid = userdetails[0].Id;
                }
                else {
                    $("#txtclientpartner").val(clientpartner);
                    clientpartneruid = "";
                }
            }
            if (result[0].ProjectOwnerName != null) {
                projectownerid = result[0].ProjectOwnerId
                projectmanager = result[0].ProjectOwnerName;
                $("#txtprojectmanager").val(projectmanager);
                var projectmanagerdetails = getProjectManagerEmail(projectownerid);
                if (projectmanagerdetails != null) {
                    var projmanager = projectmanagerdetails.split("#");
                    projectmanageruid = projectmanager + ";" + projmanager[2] + "#" + projmanager[1];
                    projectmanageruserid = parseInt(projmanager[0]);
                }

                //if (projectmanager.indexOf("|") > 0) {
                //    $("#txtprojectmanager").val(projectmanager.substr(projectmanager.lastIndexOf('|') + 1));
                //	 var pmid = projectmanager.substring(0, projectmanager.lastIndexOf("|"));
                //     var urlpm = site_url + "_api/Resources?$select=ResourceId,ResourceEmailAddress&$filter=EmployeeID eq '" + pmid + "'";
                //     var resultpm = resultset(urlpm);
                //     projectmanageruid = projectmanager.substr(projectmanager.lastIndexOf('|') + 1);
                //     projectmanageruid = projectmanageruid + ";" + resultpm[0].ResourceId + "#" + resultpm[0].ResourceEmailAddress;
                //     var useridurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + resultpm[0].ResourceEmailAddress + "'";
                //     var userdetails = resultset(useridurl);
                //     projectmanageruserid = userdetails[0].Id;
                //}
                // else {

                //projectmanageruid = "";
                // }
            }
            if (result[0].ProjectStartDate != null) {
                Project_StartDate = result[0].ProjectStartDate;
            }
            if (result[0].ProjectFinishDate != null) {
                Project_EndDate = result[0].ProjectFinishDate;
            }

        }
        else if ($('input[name=projectstatus]:checked').val() == "New") {
            var value = $('#ddlprojectname option:selected').text();
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('Opportunity')/Items?$filter=Title eq '" + value + "'";
            var result = resultset(url);
            $("#txtoppertunitystatus").val("");
            $("#txtcustomer").val("");
            $("#txtgbu").val("");
            //rrfid=result[0].OpportunityID;		
            if (result[0].Status != undefined) {
                $("#txtoppertunitystatus").val(result[0].Status);
            }
            if (result[0].Customer != undefined) {
                $("#txtcustomer").val(result[0].Customer);
            }
            if (result[0].GBU != undefined) {
                $("#txtgbu").val(result[0].GBU);
            }
            if (result[0].OpportunityID != undefined) {
                projectcode = result[0].OpportunityID;
            }

            $("#txtprojectmanager").val(resultuserprofile.DisplayName);
            var PMurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + currentuseremail + "'";
            var PMdetails = resultset(PMurl);
            projectmanageruserid = PMdetails[0].Id;
            projectmanageruid = resultuserprofile.DisplayName;
            var gbudetails = GetOpertunityApprovalName(result[0].GBU);
            if (gbudetails != null) {
                var gbu = gbudetails.split("#");
                rmospocuserid = parseInt(gbu[1]);
                fpnauserid = parseInt(gbu[0]);
                $("#txtrmospoc").val(gbu[3]);
                $("#txtfpaapprover").val(gbu[2]);
                fpnauid = gbu[2];
                rmospocuid = gbu[3];
            }
        }
    });

    /* drop down entity change function used for binding salary range, client rate  */
    $("#ddlentity").change(function () {
        $('#errentity').css('display', 'none');
        bindentitydependentdata();
        costcenter();
    });

    function bindentitydependentdata() {
        var value = $('#ddlentity option:selected').text();
        var url = site_url + "_api/RRFMaster?$filter=Entity eq '" + value + "'&$orderby=Value asc";
        var result = resultset(url);
        //$("#ddlclientrate").empty();
        //$("#ddlsalaryrange").empty();
        $("#ddlbaselocation").empty();
        $("#ddlbaselocation").append(new Option("Select", 0));
        for (var index = 0; index < result.length; index++) {
            if (result[index].Type == "SalaryRange") {
                $("#ddlsalaryrange").val(result[index].Value);
                //$("#ddlsalaryrange").append($('<option></option>').text(result[index].Value));
            }
            else if (result[index].Type == "RatePerDay") {
                $("#ddlclientrate").val(result[index].Value);
                //$("#ddlclientrate").append($('<option></option>').text(result[index].Value));
            }
            else if (result[index].Type == "Location") {
                $("#ddlbaselocation").append($('<option></option>').text(result[index].Value));
            }
        }

    }


    /* function is used to bind primary skill, secondry skill and practice on subpractice change event*/
    $("#ddlsubpractice").change(function () {
        $('#errsubpractice').css('display', 'none');
        var value = $('#ddlsubpractice option:selected').text();
        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }
        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }
        var url = site_url + "_api/Skills?$select=Skill_Details,Practice&$filter=Sub_Practice eq '" + value + "'&$orderby=Skill_Details asc";
        var result = resultset(url);
        $("#txtpractice").val("");
        $("#ddlprimaryskill").empty();
        $("#ddlsecondryskill").empty();
        $("#ddlprimaryskill").append(new Option("Select", 0));
        $("#ddlsecondryskill").append(new Option("Select", 0));
        var unique = {};
        var distinct = [];
        var array1 = [];
        var array2 = [];
        for (var index in result) {
            array1.push(result[index].Skill_Details);
            array2.push(result[index].Skill_Details);
            $("#ddlprimaryskill").append($('<option></option>').text(result[index].Skill_Details));
            $("#ddlsecondryskill").append($('<option></option>').text(result[index].Skill_Details));
            if (typeof (unique[result[index].Practice]) == "undefined") {
                distinct.push(result[index].Practice);
            }
            unique[result[index].Practice] = 0;
        }

        $("#ddlprimaryskill").select2({
            data: array1
        });
        $("#ddlsecondryskill").select2({
            data: array2
        });

        //Code Change on 11-06-2017 Abhishek
        costcenter();
        //Code end here

        //$("#ddlprimaryskill,#ddlsecondryskill").parent().parent().css("margin-bottom","5px");
        //window.Search = $('.search-box').SumoSelect({ csvDispCount: 3, search: true, placeholder: 'Type Name' });
        //window.Search = $('.ddlsecondryskill').SumoSelect({ csvDispCount: 3, search: true, placeholder: 'Type Name' });

        $.each(distinct, function (val, text) {
            $("#txtpractice").val(text);
        });
    });

    $("#ddlrequirementtype").change(function () {
        $('#errrequirementtype').css('display', 'none');
        if ($('#ddlrequirementtype option:selected').text() == "G&A") {
            $('input[name="clientinterview"]').prop("checked", false);
            $('input[name="clientinterview"]').prop("disabled", true);
        }
        else {
            $('input[name="clientinterview"]').prop("checked", false);
            $('input[name="clientinterview"]').prop("disabled", false);
        }
    });


    /*Code on EmploymentType change dropdown */
    $('#ddlemploymenttype').on('change', function () {
        $('#erremploymenttype').css('display', 'none');
        var employetype = $('#ddlemploymenttype option:selected').text();
        var urllocation = getCodeEmployeeType(employetype);//"https://ppmdev.bcone.com/_api/RRFMaster?$filter=Type eq 'EmployeeTypeId' and Value eq '" + employetype + "'&$orderby=Code asc";
        var result = resultset(urllocation);
        $("#ddlemptypey").empty();
        $("#ddlemptypey").append(new Option("Select", 0));
        for (var index = 0; index < result.length; index++) {
            $("#ddlemptypey").append($('<option></option>').text(result[index].Code));
        }

    });


    /*Code is used to fill job Description textbox on change of primarySkill dropdown */
    $("#ddlprimaryskill").change(function () {
        ddlPrimaryType = document.getElementById("ddlprimaryskill").value;
        $('#errprimaryskill').css('display', 'none');
        var subpractice = $('#ddlsubpractice option:selected').text();
        if (subpractice.indexOf('&') >= 0) {
            subpractice = subpractice.replace('&', '%26');
        }
        if (subpractice.indexOf('&') >= 0) {
            subpractice = subpractice.replace('&', '%26');
        }
        var designation = $('#ddldesignation option:selected').text();
        var roleband = $('#ddlroleband option:selected').text();
        var primaryskill = $('#ddlprimaryskill option:selected').text();
        var minrelevant = $('#ddlminrelevantexp option:selected').text();
        $("#txtjobsummary").val(designation + "-" + primaryskill);
        var url = site_url + "_api/RMOPositions?$select=Standard_Jd&$filter=(Sub_Practice eq '" + subpractice + "') and (Designation eq '" + designation + "') and (Role_Band eq '" + roleband + "') and (Skill eq '" + primaryskill + "')";
        var result = resultset(url);
        if (result.length != 0) {
            $("#txtjobdescription").val(result[0].Standard_Jd);
        }

    });


    $("#ddldesignation").change(function () {
        $('#errdesignation').css('display', 'none');
        var designation = $('#ddldesignation option:selected').text();
        var primaryskill = $('#ddlprimaryskill option:selected').text();
        $("#txtjobsummary").val(designation + "-" + primaryskill);
    });


    /*Code is used to bind ReplacementFor dropdown on change of Nature of vacancy dropdown */
    $("#ddlnatureofvacancy").change(function () {
        $('#errnatureofvacancy').css('display', 'none');
        if ($('#ddlnatureofvacancy option:selected').text() == "New") {
            $('#ddlreplacementfor').empty();
            $('#select2-ddlreplacementfor-container').empty();
            $("#ddlreplacementfor").attr("disabled", true);
        }
        else {
            $("#ddlreplacementfor").attr("disabled", false);
            $('#ddlreplacementfor').empty();
            var resourceurl = site_url + "_api/ProjectTeam?$select=ResourceName&$filter=ProjectId eq guid'" + projectguid + "'";
            var resourceresult = resultset(resourceurl);
            var array = [];
            $('#ddlreplacementfor').append(new Option("Select", 0));
            for (var index = 0; index < resourceresult.length; index++) {
                array.push(resourceresult[index].ResourceName);
                $("#ddlreplacementfor").append($('<option></option>').text(resourceresult[index].ResourceName));
            }
            $("#ddlreplacementfor").select2({
                data: array
            });
        }
    });


    $("#ddlindustryexperiance").change(function (e) {
        $('#errindustryexp').css('display', 'none');
        $("#ddlminrelevantexp").empty();
        var minexp = "0";
        if ($('#ddlindustryexperiance option:selected').text() == "Select") {
            $("#ddlminrelevantexp").append(new Option("Select", 0));
        }
        else {
            $("#ddlminrelevantexp").append(new Option("Select", 0));
            for (var index = 0; index < resultindustryexp.length; index++) {

                if (resultindustryexp[index].Type == "MinRelevantExperience") {
                    var minrelevantexp = resultindustryexp[index].Value;
                    if ($('#ddlindustryexperiance option:selected').text() == minrelevantexp) {
                        if (minexp == "0") {
                            $("#ddlminrelevantexp").append($('<option></option>').text(minrelevantexp));
                            minexp = "1";
                        }

                        return false;
                    }
                    else {
                        $("#ddlminrelevantexp").append($('<option></option>').text(minrelevantexp));
                    }

                }

            }
        }
        return true;
    });

    /*get skip manager and thier id on selection of reporting to drop down */
    //$("#ddlreportingto").change(function () {
    //    var reportingtoid = $('#ddlreportingto option:selected').val();
    //    var reportingto = $('#ddlreportingto option:selected').text();
    //    var reportingtourl = "https://ppmdev.bcone.com/_api/Resources?$select=ReportingManager,ResourceEmailAddress&$filter=ResourceId eq guid'" + reportingtoid + "'";
    //    var resultreportingto = resultset(reportingtourl);
    //    $("#txtskipmanager").val(resultreportingto.ReportingManager);
    //    //var skipmanageremailid=resultreportingto.ReportingManagerEmail;
    //    // var skipmanagerurl="https://ppmdev.bcone.com/_api/Resources?$select=ResourceId&$filter=ReportingManagerEmail eq '"+skipmanageremailid+"'";
    //    // var resultskipmanager=resultset(skipmanagerurl);
    //    // var skipmanagerid=resultskipmanager.ResourceId;	 
    //    reportingtouid = reportingto + ";" + reportingtoid + "#" + resultreportingto[0].ResourceEmailAddress;
    //    var resourcemailid = resultreportingto[0].ResourceEmailAddress;
    //    var useridurl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/siteusers?$filter=Email eq '" + resourcemailid + "'";
    //    var userdetails = resultset(useridurl);
    //    reportingtouserid = userdetails[0].Id;
    //    skipmanageruid=resultreportingto.ReportingManager;
    //
    //
    //});

    $("#txtworklocation").keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z\\s]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        else {
            e.preventDefault();
            //alert('Please Enter Alphabate');
            return false;
        }


    });

    //$("#txtdurationofonsitetravel").keypress(function (e) {
    //    var regex = new RegExp("^[a-zA-Z0-9\\s]+$");
    //    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    //    if (regex.test(str)) {
    //        return true;
    //    }
    //    else {
    //        e.preventDefault();
    //        //alert('Please Enter Alphabate');
    //        return false;
    //    }


    //});



    $("#txtclientrate").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errnummsg").html("Digits Only").show().fadeOut("slow");
            return false;
        }
    });
    $("#txtminsalaryrange").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errnumminmsg").html("Digits Only").show().fadeOut("slow");
            return false;
        }
    });
    $("#txtmaxsalaryrange").keypress(function (e) {
        //if the letter is not digit then display error and don't type anything
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            //display error message
            $("#errnummaxmsg").html("Digits Only").show().fadeOut("slow");
            return false;
        }
    });

    //$("#txtrequirementpercentage").keypress(function (e) {
    //    $('#errreqpercentagemsg').css('display', 'block');
    //    // $("#errreqpercentagemsg").html("Requirement Percentage should not be greater than 100").show().fadeOut("slow");
    //    //return false; 
    //});

    $('#txtrequirementpercentage').change(function () {
        $('#errreqpercentagemsg').css('display', 'none');
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




    $('#txtjobdescription').keypress(function (e) {

        //$("#errjobdescriptionmsg").html("Special Characters are not allowed").show().fadeOut("slow");
        var regex = new RegExp("^[a-zA-Z0-9\\s]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            $('#errjobdescriptionmsg').css('display', 'none');
            return true;
        } else {
            $('#errjobdescriptionmsg').css('display', 'block');
            e.preventDefault();
            return false;
        }


    });

    $('#txtjobdescription').change(function () {
        $('#errjobdescriptionmsg').css('display', 'none');
    });

    $(function () {
        $("#txtjobdescription").bind('paste', function () {
            setTimeout(function () {
                //get the value of the input text
                var data = $('#txtjobdescription').val();
                //replace the special characters to '' 
                var dataFull = data.replace(/[^\w\s]/gi, '');
                //set the new value of the input text without special characters
                $('#txtjobdescription').val(dataFull);
            });

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
    /*Get current login user details*/
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




    /*code on search button click  */
    $("#btnsearch").click(function () {
        if ($('#ddlroleband option:selected').text() == "Select") {
            $('#errroleband').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseFour").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        else if ($('#txtrequirementstartdate').val() == "") {
            $('#errrequirementstartdate').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseFour").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        else if ($('#txtrequirementenddate').val() == "") {
            $('#errrequirementenddate').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseFour").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        else if ($('#ddlprimaryskill option:selected').text() == "Select") {
            $('#errprimaryskill').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseFour").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        else if ($('#ddlsecondryskill option:selected').text() == "Select") {
            $('#errsecondryskillmsg').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseFour").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        else {
            $('.loader').show();
            $('.popup-bg').show();
            getSerachDetails();
            $('.loader').hide();
        }
    });
    /*method is used for show Resource search deatils in resource table  */
    function getSerachDetails() {
        var date1;
        var month1;
        var date2;
        var month2;
        //var primaryskill = "SAP ABAP"; 
        //var secondryskill = "SAP Fiori";
        //var RoleBand = "RB 4";
        //var projectstartdate = "2017-08-10";

        var secondryskill = $('#ddlsecondryskill option:selected').text();
        var primaryskill = $('#ddlprimaryskill option:selected').text();
        var RoleBand = $('#ddlroleband option:selected').text();
        var Requiredpercentage = $("#txtrequirementpercentage").val();
        var startdate = $('#txtrequirementstartdate').val();
        var date = startdate.split("-");
        var month = new Date(Date.parse(date[1] + " 1, 2012")).getMonth() + 1;
        // if (date[0] < 10) {
        //     date1 = "0" + date[0];
        // }
        // else {
        //     date1 = date[0];
        // }
        if (month < 10) {
            month1 = "0" + month;
        }
        else {
            month1 = month;
        }

        var end_date = $('#txtrequirementenddate').val();
        var date_end = end_date.split("-");
        var month_end = new Date(Date.parse(date_end[1] + " 1, 2012")).getMonth() + 1;
        // if (date[0] < 10) {
        //     date1 = "0" + date[0];
        // }
        // else {
        //     date1 = date[0];
        // }
        if (month_end < 10) {
            month2 = "0" + month_end;
        }
        else {
            month2 = month_end;
        }


        var time = "T00:00:00";
        var projectstartdate = date[2] + "-" + month1 + "-" + date[0] + time;
        //var projectstartdate = date[2]+"-"+ month1+"-"+ date1;
        // projectstartdate = Date.parse(projectstartdate);
        var Project_newenddate = date_end[2] + "-" + month2 + "-" + date_end[0] + time;
        var result = searchResource("NA", primaryskill, secondryskill, RoleBand, projectstartdate, Requiredpercentage, Project_newenddate)
        bindtblResource(result);
    }

    function bindtblResource(result) {
        destroyjs('#tblResourceSearch');
        table_header = "<thead><tr>";
        table_header = table_header + "<th>Item</th>"
        table_header = table_header + "<th>Employee ID</th>"
        table_header = table_header + "<th>Employee Name</th>"
        table_header = table_header + "<th>Designation</th>"
        table_header = table_header + "<th>Base Location</th>"
        table_header = table_header + "<th>Project Name</th>"
        table_header = table_header + "<th>Role Band</th>"
        table_header = table_header + "<th>Date of Joining</th>"

        //footer menu
        table_header = table_header + "<tfoot><tr>";
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + "<th></th>"
        table_header = table_header + " </tr></tfoot>";


        var RoleBand = $('#ddlroleband option:selected').text();

        var RRFFROMLIHTML = "<tbody>";
        for (var index = 0; index < result.length; index++) {
            var ProjectNameHTML = "";
            var Flag = "1";
            if (result[index].ProjectName == "Multiple Assignment")

                ProjectNameHTML = "<a href='#' onclick='ShowMultipleAssignmentProjectsDetails(this,1)'>" + result[index].ProjectName + "</a>";
            else
                ProjectNameHTML = result[index].ProjectName;

            var JoiningDate = convert_date_DDMMYYYY(result[index].OrganisationDOJ);
            var tdid = result[index].EmployeeID + "#" + result[index].ResourceFullName + "#" + Flag;
            RRFFROMLIHTML = RRFFROMLIHTML + "<tr><td><input type=\"checkbox\" name='select' ></td><td><span class=\"spval1 \" id =\"span1\">" + result[index].EmployeeID + "</span></td><td><span href='#' id='show-popup' class='action-b'>" + result[index].ResourceFullName + "<div class='action-b-view'><a href='../SitePages/ResourceProjectInformation.aspx?employeeID=" + result[index].EmployeeID + "&employeename=" + result[index].ResourceFullName + "' target='_blank'>Project Detail</a><a href='../SitePages/ViewProfile.aspx?employeeID=" + result[index].EmployeeID + "&employeename=" + result[index].ResourceFullName + "' target='_blank' >View Profile</a></div></span></td><td><span class= \"spval1\" id =\"span3\">" + result[index].Designation + "</span></td><td><span class= \"spval1\" id =\"span4\">" + result[index].Work_Location + "</span></td><td id=" + tdid + ">" + ProjectNameHTML + "</td><td>" + RoleBand + "</td><td>" + JoiningDate + "</td></tr>"

        }
        RRFFROMLIHTML += "</tbody>";
        var table_element = table_header + RRFFROMLIHTML;
        $("#tblResourceSearch").append(table_element);
        table = $('#tblResourceSearch').DataTable({
            "dom": 'Rlfrtip',
            "iDisplayLength": 20,
            "lengthMenu": [[20, 30, 40, -1], [20, 30, 40, "All"]],
            "pagingType": "simple_numbers"
        });



        var urlresourceallocation = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RMOResourceAllocation')/Items?$filter=RRFNumber eq '" + rrfno + "'";
        var resultresourceallocation = resultset(urlresourceallocation);
        if (resultresourceallocation.length > 0) {
            var resourceid = resultresourceallocation[0].suggestedResource;
            resourceid = resourceid.split(";");
            var childCheckboxes = table.rows().nodes().to$('#tblResourceSearch tbody tr td').find('input[type=checkbox]');
            for (var i = 0; i < resourceid.length ; i++) {
                for (var index = 0; index < childCheckboxes.length; index++) {
                    if (childCheckboxes[index].parentNode.parentNode.firstElementChild.nextSibling.innerText == resourceid[i]) {
                        childCheckboxes[index].parentNode.children.select.checked = true;
                    }
                    else {
                        //childCheckboxes[0].parentNode.children.select.checked
                    }
                }
            }
        }
    }

    function getFormatDate(date) {
        if (date != null && date != "") {
            var year = date.toString().substring(0, 4);
            var month = GetMonthName(date.toString().substring(4, 6));
            var date = date.toString().substring(6, 8);
            var formatDate = date + '-' + month + '-' + year;
            return formatDate;
        }
    }
    function GetMonthName(monthNumber) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNumber - 1];
    }

    $("#btnresourcesave").click(function () {
        resourcenameRMO = "";
        var childCheckboxes = table.rows().nodes().to$('#tblResourceSearch tbody tr td').find('input[type=checkbox]');
        var no_checked = childCheckboxes.filter(':checked').each(function () { });
        for (var index = 0; index < no_checked.length; index++) {
            if (resourcenameRMO == "") {
                resourcenameRMO = no_checked[index].parentNode.parentNode.firstElementChild.nextSibling.innerText;
            }
            else {
                resourcenameRMO = resourcenameRMO + ";" + no_checked[index].parentNode.parentNode.firstElementChild.nextSibling.innerText;
            }
        }



        $("#fileuploadmsg").css("display", "none");
        $("#rrfsavedmsg").css("display", "none");
        $("#rrfconfirmationmsg").css("display", "none");
        $("#divMultipleAssignment").css("display", "none");
        $("#divResourceSaveMsg").css("display", "block");
        $("#alertmain").show();
        $('.popup-bg').hide();

    });



    // $("#btnresourcecancel").click(function () {
    //     $('.popup-bg').hide();
    // });
    $(".p-close").click(function () {
        $('.popup-bg').hide();
    });
    $(".top-close").click(function () {
        $('.Toppopup-bg').hide();
    });



    ///*code on save button click  */
    //$("#btnsave").click(function () {
    //
    //    setTimeout(function () {
    //		if($('#ddlemployeerole option:selected').text()!="Billable" && $('#ddlemployeerole option:selected').text()!="Select" && $('#ddlemployeerole option:selected').text()!="")
    //	{
    //	  PageStatus="Non Billable";	
    //	} 
    //	else{
    //        PageStatus = "RRF Saved";  
    //	}
    //        if (resultRRF.length > 0) {
    //            $('.loader').show(); 
    //            insertRRFDetails(); 
    //           
    //
    //        }
    //        else {
    //           
    //                $('.loader').show();
    //                uploadDocument();
    //               // $('.loader').hide();
    //            
    //        }
    //    }, 300);
    // $('.loader').hide();
    //});

    $(document).on("click", "#btnsave", function () {
        if ($("#txtgbu").val() == "") {
            $("#collapseOne").collapse('show');
            $('#errgbu').css('display', 'block');
        }
        else {
            setTimeout(function () {
                if (($('#ddlemployeerole option:selected').text() != "Billable" && $('#ddlemployeerole option:selected').text() != "Billable Consultant") && $('#ddlemployeerole option:selected').text() != "Select" && $('#ddlemployeerole option:selected').text() != "") {
                    PageStatus = "Non Billable";
                    NonBillableFlag = null;
                }
                else {
                    PageStatus = "RRF Saved";
                }
                $('.loader').show();
                if (resultRRF.length > 0) {

                    insertRRFDetails();


                }
                else {

                    uploadDocument();

                }
            }, 3000);
        }

    });

    /*code on submit button click  */
    $("#btnsubmit").click(function () {
        if ($('#ddlprojectname option:selected').text() == "Select") {
            $('#errprojectname').css('display', 'block');
            return false;
        }
        else if ($("#txtgbu").val() == "") {
            $("#collapseOne").collapse('show');
            $('#errgbu').css('display', 'block');
        }
        else {

            if (validate()) {
                $("#fileuploadmsg").css("display", "none");
                $("#rrfsavedmsg").css("display", "none");
                $("#divMultipleAssignment").css("display", "none");
                $("#divResourceSaveMsg").css("display", "none");

                $("#rrfconfirmationmsg").css("display", "block");
                $("#alertmain").show();
            }
        }

    });

    function submitRRF() {

        setTimeout(function () {


            $('.loader').show();
            if (($('#ddlemployeerole option:selected').text() != "Billable" && $('#ddlemployeerole option:selected').text() != "Billable Consultant") && $('#ddlemployeerole option:selected').text() != "Select") {
                PageStatus = "Functional Head";
                NonBillableFlag = 1;
            }
            else {
                PageStatus = "RMO Validation";
            }

            if (resultRRF.length > 0) {

                EmailFlag = 1;
                insertRRFDetails();
                $('.loader').hide();

            }
            else {
                if (validate()) {

                    uploadDocument();
                    $('.loader').hide();
                }
            }

        }, 3000);


    }


    $("#ddlsecondryskill").change(function (e) {
        ddlSecondryType = document.getElementById("ddlsecondryskill").value;
        $('#errsecondryskillmsg').css('display', 'none');
    });



    $("#txtgbu").keyup(function (e) {

        $('#errgbu').css('display', 'none');
    });

    $(document).on('keyup', '#txtclientrate', function (event) {
        $('#errclientrateperday').css('display', 'none');
        var input = event.currentTarget.value;

        if (input.search(/^0/) != -1) {
            $('#errzeroselectperday').css('display', 'block');
            $("#txtclientrate").val('');
        }
        else {
            $('#errzeroselectperday').css('display', 'none');
        }
    });


    //   $("#txtclientrate").keyup(function (e) {
    //
    //       $('#errclientrateperday').css('display', 'none');
    //		var myLength = $("#txtclientrate").val().length;
    //   if(myLength == 1) //To check only when entering first character.
    //   {
    //       if($(this).val() === '0')
    //       {
    //			$('#errzeroselectperday').css('display', 'block');
    //           $(this).val('');
    //       }
    //		else{
    //			$('#errzeroselectperday').css('display', 'none');
    //		}
    //	}
    //		
    //   });
    //
    $("#txtrequirementstartdate").blur(function (e) {

        $('#errrequirementstartdate').css('display', 'none');
    });


    $("#txtrequirementenddate").blur(function (e) {
        $('#errrequirementenddate').css('display', 'none');
    });


    $("#txtworklocation").keyup(function (e) {

        $('#errworklocation').css('display', 'none');
    });


    $("#ddlbaselocation").change(function (e) {
        ddlbaselocationType = document.getElementById("ddlbaselocation").value;
        $('#errbaselocation').css('display', 'none');
    });


    $("#ddlemploymenttype").change(function (e) {

        $('#erremploymenttype').css('display', 'none');
    });


    $("#ddlemptypey").change(function (e) {

        $('#erremploymentsubtype').css('display', 'none');
    });


    $("#ddlprimaryskill").change(function (e) {

        $('#errprimaryskill').css('display', 'none');
    });


    $("#txtjobsummary").keyup(function (e) {

        $('#errjobsummary').css('display', 'none');
    });


    $("#txtjobdescription").keyup(function (e) {

        $('#errjobdescription').css('display', 'none');
    });



    $("#ddlemployeerole").change(function (e) {
        $('#erremployeerole').css('display', 'none');
        if ($('#ddlemployeerole option:selected').text() != "Billable" && $('#ddlemployeerole option:selected').text() != "Billable Consultant") {
            $("#btnsearch").prop("disabled", true);
            resourcenameRMO = "";
        }
        else {
            $("#btnsearch").prop("disabled", false);
        }

    });

    $("#ddlroleband").change(function (e) {
        if (($('#ddlemployeerole option:selected').text() != "Billable Consultant" && $('#ddlemployeerole option:selected').text() != "Billable") && $('#ddlemployeerole option:selected').text() != "Select") {
            $("#btnsearch").prop("disabled", true);
        }
        else if ($('#ddlemployeerole option:selected').text() == "Select" || $('#ddlemployeerole option:selected').text() == "Billable" || $('#ddlemployeerole option:selected').text() == "Billable Consultant") {
            $("#btnsearch").prop("disabled", false);
        }
        // $("#btnsearch").prop("disabled", false);
        $('#errroleband').css('display', 'none');
        var entity = $('#ddlentity option:selected').text();
        if (entity != "Select") {
            var roleband = $('#ddlroleband option:selected').text();
            var url = site_url + "_api/RRFMaster?$filter=(Entity eq '" + entity + "') and (Code eq '" + roleband + "')";
            var result = resultset(url);
            if (result.length > 0) {
                if (result[0].Type == "SalaryRangeValue") {
                    var salaryrangevalue = result[0].Value;

                    salaryrangevalue = salaryrangevalue.split("-");
                    $("#txtminsalaryrange").val(salaryrangevalue[0]);
                    $("#txtmaxsalaryrange").val(salaryrangevalue[1]);
                }
            }
            else {
                $("#txtminsalaryrange").val("");
                $("#txtmaxsalaryrange").val("");
            }
        }
    });


    $("#ddlpositiontype").change(function (e) {

        $('#errpositiontype').css('display', 'none');
    });


    $(document).on('keyup', '#txtrequirementpercentage', function (event) {
        $('#errrequirementpercentage').css('display', 'none');
        var input = event.currentTarget.value;

        if (input.search(/^0/) != -1) {
            $('#errzeroreqpercentage').css('display', 'block');
            $("#txtrequirementpercentage").val('');
        }
        else {
            $('#errzeroreqpercentage').css('display', 'none');
        }
    });


    //    $("#txtrequirementpercentage").keyup(function (e) {
    //
    //        $('#errrequirementpercentage').css('display', 'none');
    //		var myLength = $("#txtrequirementpercentage").val().length;
    //    if(myLength == 1) //To check only when entering first character.
    //    {
    //        if($(this).val() === '0')
    //        {
    //			$('#errzeroreqpercentage').css('display', 'block');
    //            $(this).val('');
    //        }
    //		else{
    //			$('#errzeroreqpercentage').css('display', 'none');
    //		}
    //	}
    //		
    //    });

    $("#ddlreportngto").keyup(function (e) {

        $('#errreportingto').css('display', 'none');
        $('#errreportingtoinvalid').css('display', 'none');
    });



    //new  
    $("#ddlminrelevantexp").change(function (e) {

        $('#errminrelevantexp').css('display', 'none');
    });

    $("#ddlnatureofvacancy").change(function (e) {

        $('#errnatureofvacancy').css('display', 'none');
    });

    $("#ddlreplacementfor").change(function (e) {
        $('#errreplacementfor').css('display', 'none');
    });

    //new
    $("#ddlsalaryrange").change(function (e) {

        $('#errsalaryrange').css('display', 'none');
    });


    $(document).on('keyup', '#txtminsalaryrange', function (event) {
        $('#errminsalaryrange').css('display', 'none');
        var input = event.currentTarget.value;

        if (input.search(/^0/) != -1) {
            $('#errzerominsalary').css('display', 'block');
            $("#txtminsalaryrange").val('');
        }
        else {
            $('#errzerominsalary').css('display', 'none');
        }
    });



    //   $("#txtminsalaryrange").keyup(function (e) {
    //       $('#errminsalaryrange').css('display', 'none');
    //		var myLength = $("#txtminsalaryrange").val().length;
    //   if(myLength == 1) //To check only when entering first character.
    //   {
    //       if($(this).val() === '0')
    //       {
    //			$('#errzerominsalary').css('display', 'block');
    //           $(this).val('');
    //       }
    //		else{
    //			$('#errzerominsalary').css('display', 'none');
    //		}
    //   }
    //   });
    //	
    $(document).on('keyup', '#txtmaxsalaryrange', function (event) {
        $('#errmaxsalaryrange').css('display', 'none');
        var input = event.currentTarget.value;

        if (input.search(/^0/) != -1) {
            $('#errzeromaxsalary').css('display', 'block');
            $("#txtmaxsalaryrange").val('');
        }
        else {
            $('#errzeromaxsalary').css('display', 'none');
        }
    });

    //   $("#txtmaxsalaryrange").keyup(function (e) {		
    //       $('#errmaxsalaryrange').css('display', 'none');
    //		var myLength = $("#txtmaxsalaryrange").val().length;
    //   if(myLength == 1) //To check only when entering first character.
    //   {
    //       if($(this).val() === '0')
    //       {
    //			$('#errzeromaxsalary').css('display', 'block');
    //           $(this).val('');
    //       }
    //		else{
    //			$('#errzeromaxsalary').css('display', 'none');
    //		}
    //   }
    //		
    //   });

    $("#txtmaxsalaryrange").blur(function () {
        var minsalaryvalue = $("#txtminsalaryrange").val();
        var minsalaryvalue = parseInt(minsalaryvalue) + 1;
        var maxsalaryvalue = $("#txtmaxsalaryrange").val();
        if (maxsalaryvalue < minsalaryvalue) {
            $('#errmaxsalary').css('display', 'block');

        }
        else {
            $('#errmaxsalary').css('display', 'none');
        }
    });

    $("input[name$='clientinterview']").click(function () {
        rdbclientinterviewType = $('input[name=clientinterview]:checked').val();
        $('#errclientinterviewrequired').css('display', 'none');
    });

    $('#divReportingTo').on("click", function () {
        $('#errreportingto').css('display', 'none');
        $('#errreportingtoinvalid').css('display', 'none');
    });
    /* Validation code on Submit button */
    function validate() {
        if ($('#ddlprojectname option:selected').text() == "Select") {
            $('#errprojectname').css('display', 'block');
            return false;
        }
        else if ($('#ddlentity option:selected').text() == "Select") {
            $('#errentity').css('display', 'block');
            //$("#panel0").collapse('show');
            $("#collapseOne").collapse('show');
            return false;
        }

        else if ($('#ddlsubpractice option:selected').text() == "Select") {
            $('#errsubpractice').css('display', 'block');
            $("#collapseOne").collapse('show');
            return false;
        }
        else if ($('#ddlcostcenter option:selected').text() == "Select") {
            $('#errCostCenter').css('display', 'block');
            $("#collapseOne").collapse('show');
            return false;
        }
        else if ($('#ddlrequirementtype option:selected').text() == "Select") {
            $('#errrequirementtype').css('display', 'block');
            $("#collapseOne").collapse('show');
            return false;
        }

        else if ($('#ddlclientrate option:selected').text() == "Select") {
            $('#errclientrate').css('display', 'block');
            $("#collapseOne").collapse('show');
            return false;
        }

        else if ($('#txtclientrate').val() == "") {
            $('#errclientrateperday').css('display', 'block');
            $("#collapseOne").collapse('show');
            return false;
        }
        else if ($('#ddlemployeerole option:selected').text() == "Select") {
            bindsecondaccdata();
            $('#erremployeerole').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#ddldesignation option:selected').text() == "Select") {
            $('#errdesignation').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#ddlroleband option:selected').text() == "Select") {
            $('#errroleband').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#ddlemploymenttype option:selected').text() == "Select") {
            $('#erremploymenttype').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlemptypey option:selected').text() == "Select") {
            $('#erremploymentsubtype').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlpositiontype option:selected').text() == "Select") {
            $('#errpositiontype').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#txtrequirementpercentage').val() == "") {
            $('#errrequirementpercentage').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#txtrequirementstartdate').val() == "") {
            $('#errrequirementstartdate').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#txtrequirementenddate').val() == "") {
            $('#errrequirementenddate').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlprimaryskill option:selected').text() == "Select") {
            $('#errprimaryskill').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if (!$('#rdbyes').is(':checked') && !$('#rdbno').is(':checked') && (($('#ddlrequirementtype option:selected').text() != "G&A"))) {
            $('#errclientinterviewrequired').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlindustryexperiance option:selected').text() == "Select") {
            $('#errindustryexp').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#ddlminrelevantexp option:selected').text() == "Select") {
            $('#errminrelevantexp').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlnatureofvacancy option:selected').text() == "Select" && $('#rdbexisting').is(':checked')) {
            $('#errnatureofvacancy').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlreplacementfor option:selected').text() == "Select" && $('#ddlnatureofvacancy option:selected').text() != "New" && $('#rdbexisting').is(':checked')) {

            $('#errreplacementfor').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;

        }

        else if ($('#ddlsalaryrange option:selected').text() == "Select") {
            $('#errsalaryrange').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#txtminsalaryrange').val() == "") {
            $('#errminsalaryrange').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#txtmaxsalaryrange').val() == "") {
            $('#errmaxsalaryrange').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($('#txtworklocation').val() == "") {
            $('#errworklocation').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }
        else if ($('#ddlbaselocation option:selected').text() == "Select") {
            $('#errbaselocation').css('display', 'block');
            $("#collapseTwo").collapse('show');
            $("#collapseOne").collapse('hide');
            return false;
        }

        else if ($("#divReportingTo_TopSpan_HiddenInput").val() == "" || $("#divReportingTo_TopSpan_HiddenInput").val() == "[]") {
            $('#errreportingtoinvalid').css('display', 'none');
            $('#errreportingto').css('display', 'block');
            $("#collapseThree").collapse('show');
            $("#collapseOne").collapse('hide');
            $("#collapseFour").collapse('hide');
            $("#collapseTwo").collapse('hide');
            return false;
        }
        else if ($('#txtjobdescription').val() == "") {
            $('#errjobdescription').css('display', 'block');
            $("#collapseFour").collapse('show');
            $("#collapseTwo").collapse('hide');
            $("#collapseOne").collapse('hide');
            $("#collapseThree").collapse('hide');
            return false;
        }
        if ($("#divReportingTo_TopSpan_HiddenInput").val() != "" || $("#divReportingTo_TopSpan_HiddenInput").val() != "[]") {
            var loginName = $("span.ms-entity-resolved").attr("ID");
            if (loginName != undefined && loginName != "undefined") {
                if (loginName.indexOf('|') > 0) {
                    var start = loginName.indexOf(":");
                    var end = loginName.indexOf("_Processed");
                    var finalUserName = loginName.substring(start - 1, end);
                    if (finalUserName.indexOf('|') > 0) {
                        var NewUser = $("#divReportingTo").getUserInfo();
                        reportingtouserid = GetUserIdByLogin(finalUserName);
                    } else {
                        $('#errreportingtoinvalid').css('display', 'block');
                        $("#collapseThree").collapse('show');
                        $("#collapseOne").collapse('hide');
                        $("#collapseFour").collapse('hide');
                        $("#collapseTwo").collapse('hide');
                        return false;
                    }
                } else {
                    $('#errreportingtoinvalid').css('display', 'block');
                    $("#collapseThree").collapse('show');
                    $("#collapseOne").collapse('hide');
                    $("#collapseFour").collapse('hide');
                    $("#collapseTwo").collapse('hide');
                    return false;
                }
            } else {
                $('#errreportingtoinvalid').css('display', 'block');
                $("#collapseThree").collapse('show');
                $("#collapseOne").collapse('hide');
                $("#collapseFour").collapse('hide');
                $("#collapseTwo").collapse('hide');
                return false;
            }
        }



        return true;
    }


    /*code to call insertRRFDetails function on save and submit button */
    function insertRRFDetails() {
        var startdate;
        var enddate;
        var rrfcreateddate;
        var gbu = $("#txtgbu").val();
        if (pagerequestid == "1") {
            $('input[name=projectstatus]').prop("disabled", true);
            $("#projectname").prop("disabled", true);
        }
        if (rrfno != undefined || rrfno != null) {
            id = resultRRF[0].ID;
            rrfid = rrfno[0];
            RRFItemId = rrfid;
            rrfcreateddate = resultRRF[0].RRFCreatedDate;
        }
        else {
            var itemid;
            var isinsert;
            if (gbu.indexOf('&') >= 0) {
                gbu = gbu.replace('&', '%26');
            }
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRFGBUMAPPING')/Items?$select=GBUID &$filter=GBU eq '" + gbu + "'";
            var gburesult = resultset(url);
            var urlRRF = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('RRF')/Items?$select=ID&$Top=1&$orderby=ID desc"
            var rrfresult = resultset(urlRRF);
            rrfid = gburesult[0].GBUID;
            var date = new Date();
            rrfcreateddate = date;

            var month = (date.getMonth() + 1);
            var year = date.getFullYear().toString().substr(-2);

            var financialYr = "";
            if (month > 3) {
                var financialyear = parseInt(year) + 1;
                financialYr = year + financialyear;
            }
            else {
                var financialyear = parseInt(year) - 1;
                financialYr = financialyear + year;
            }


            if (month < 10) {
                month = "0" + month;
            }

            var financilyear = financialYr + month;
            id = rrfresult[0].ID;
            rrfid = rrfid + "-" + financilyear + "-" + id;
            RRFItemId = rrfid;

        }
        itemid = id;
        isinsert = false;

        var infrastructure = "";
        $(':checkbox:checked').each(function (i) {
            if (i == 0) {
                infrastructure = $(this).val();
            }
            else {
                infrastructure = infrastructure + ";" + $(this).val();
            }
        });
        if (($('#ddlemployeerole option:selected').text() != "Billable" && $('#ddlemployeerole option:selected').text() != "Billable Consultant") && $('#ddlemployeerole option:selected').text() != "Select" && $('#ddlemployeerole option:selected').text() != "") {
            //var approverdetails = getProjectManagerEmail(projectownerGUID, gbu, id, projectguid);
            //approverdetails = approverdetails.split("#");
            approverid = clientpartneruserid; //approverdetails[0];

            // approverid=getApproverNames(gbu,id,projectguid);	  
            getApproverNames(gbu, id, projectguid, parseInt(approverid));
        }

        if ($("#txtrequirementstartdate").val() == "") {
            startdate = null;
        }
        else {
            startdate = $("#txtrequirementstartdate").val();
        }

        if ($("#txtrequirementenddate").val() == "") {
            enddate = null;
        }
        else {
            enddate = $("#txtrequirementenddate").val();
        }

        if ($("#divReportingTo_TopSpan_HiddenInput").val() != "") {

            var loginName = $("span.ms-entity-resolved").attr("ID");
            var start = loginName.indexOf(":");
            var end = loginName.indexOf("_Processed");
            var finalUserName = loginName.substring(start - 1, end);
            var NewUser = $("#divReportingTo").getUserInfo();
            reportingtouserid = GetUserIdByLogin(finalUserName);
        }
        var Project_NameofRRF = "";
        if (rrfno != undefined || rrfno != null) {

            Project_NameofRRF = document.getElementById("projectname").value;
        } else {
            Project_NameofRRF = $('#ddlprojectname option:selected').text();
        }
        var currentDate = "";
        //$.extend(item, { TATDateTime: currentDate });  $.extend(item, { SubmittedDate: currentDate });
        if (PageStatus == "RMO Validation" || PageStatus == "Functional Head") {
            currentDate = new Date();
            if (PageStatus == "RMO Validation") {
                var To = rmospocuserid.toString();
                var Cc = currentuserloginid + ";" + clientpartneruserid + ";" + "rmo@bcone.com";
                var EventId = "25";
                var Flag = "5";
                var TrackingId = rrfid.toString();
                insertIntoSendEmailData(To, Cc.toString(), EventId, Flag, TrackingId);
                var otherCC = currentuserloginid + ";" + "rmo@bcone.com";
                insertIntoSendEmailData(rmospocuserid.toString(), otherCC.toString(), "27", Flag, TrackingId);
            }
            else if (PageStatus == "Functional Head") {
                var NonApproversCC = NonApprovers.split(',');
                var To = approverid.toString();
                NonApproversCC = NonApproversCC[0] + ";" + NonApproversCC[1] + ";" + NonApproversCC[2] + ";" + NonApproversCC[3];
                var Cc = currentuserloginid.toString() + ";" + NonApproversCC.toString() + ";" + "rmo@bcone.com";
                var EventId = "59";
                var Flag = "5";
                var TrackingId = rrfid;
                insertIntoSendEmailData(To, Cc, EventId, Flag, TrackingId);
            }
        }
        if (currentDate == "") {
            currentDate = null;
        }
        if (NonBillableFlag != null) {
            NonBillableFlag = 1;
        }
        //var costcenterSelectedValue= $("#ddlcostcenter")
        if (Project_StartDate == "") {
            Project_StartDate = null;
        }
        if (Project_EndDate == "") {
            Project_EndDate = null;
        }
        var data = {
            'ProjectStatus': $('input[name=projectstatus]:checked').val(),
            'RRFNO': rrfid,
            'ProjectName': Project_NameofRRF,
            'Status': PageStatus,
            'OpportunityStatus': $("#txtoppertunitystatus").val(),
            'Customer': $("#txtcustomer").val(),
            'Entity': $('#ddlentity option:selected').text(),
            'SubPractice': $('#ddlsubpractice option:selected').text(),
            'Practice': $("#txtpractice").val(),
            'GBU': $("#txtgbu").val(),
            'RequirementType': $('#ddlrequirementtype option:selected').text(),
            'ClientRateCurrancy': $('#ddlclientrate option:selected').text(),
            'ClientRate': $("#txtclientrate").val(),
            'Infrastructure': infrastructure,
            'EmployeeRole': $('#ddlemployeerole option:selected').text(),
            'Designation': $('#ddldesignation option:selected').text(),
            'RoleBand': $('#ddlroleband option:selected').text(),
            'EmployeeTypeId': $('#ddlemptypey option:selected').text(),
            'PostingTimeTypeId': $('#ddlpositiontype option:selected').text(),
            'StartDate': startdate,
            'EndDate': enddate,
            'RequirementPct': $("#txtrequirementpercentage").val(),
            'ClientInterviewRequired': $('input[name=clientinterview]:checked').val(),
            'NatureofVacancy': $('#ddlnatureofvacancy option:selected').text(),
            'ReplacementFor': $('#ddlreplacementfor option:selected').text(),
            'PrimarySkill': $('#ddlprimaryskill option:selected').text(),
            'SecondarySkill': $('#ddlsecondryskill option:selected').text(),
            'Industry': $('#ddlindustry option:selected').text(),
            'IndustryExp': $('#ddlindustryexperiance option:selected').text(),
            'MinRelevantExp': $('#ddlminrelevantexp option:selected').text(),
            'SalaryRangeCurrancy': $('#ddlsalaryrange option:selected').text(),
            'SalaryRangeMinAmt': $("#txtminsalaryrange").val(),
            'SalaryRangeMaxAmt': $("#txtmaxsalaryrange").val(),
            'WorkLocation': $("#txtworklocation").val(),
            'BaseLocation': $('#ddlbaselocation option:selected').text(),
            'TypeofAssignment': $('#ddltypeofassignemnt option:selected').text(),
            'DurationofOnsiteTravel': $('#txtdurationofonsitetravel option:selected').text(),
            'WorkerType': $('#ddlemploymenttype option:selected').text(),
            'ProjectGUID': projectguid,
            'ReportingTo': reportingtouid,
            'NonApprovers': NonApprovers,
            'ProjectManager': projectmanageruid,
            'FPAApprover': fpnauid,
            'ClientPartner': clientpartneruid,
            'RMOSpoc': rmospocuid,
            'ProjectManagerUserId': projectmanageruserid,
            'FPNAUserId': fpnauserid,
            'ClientPartnerUserId': clientpartneruserid,
            'RMOSPOCUserId': rmospocuserid,
            'ReportingToUserId': reportingtouserid,
            'PendingWithId': approverid,
            //'RRFCreatedDate': rrfcreateddate,
            'DescriptionSummary': $("#txtjobsummary").val(),
            'WorkDay': 1,
            'ProjectCode': projectcode,
            'NewAuthorId': currentuserloginid,
            'JobDescriptionSummary': $("#txtjobdescription").val(),
            'ProjectManagerGUID': projectownerGUID,
            'NonBillableFlag': NonBillableFlag,
            'CostCenter': $('#ddlcostcenter option:selected').text(),
            'TATDateTime': currentDate,
            'SubmittedDate': currentDate,
            'ProjectStartDate': Project_StartDate,
            'ProjectEndDate': Project_EndDate,
            'EmailFlag': EmailFlag

        }





        var result = insertOrUpdateRRF('RRF', isinsert, itemid, data);


        var fileArray = [];
        $("#attachFilesContainer input:file").each(function () {
            if ($(this)[0].files[0]) {
                fileArray.push({ "Attachment": $(this)[0].files[0] });

            }
        });
        var total_numberoffile = 0;
        total_numberoffile = fileArray.length;
        if (total_numberoffile > 0) {
            getAttchmentReason();
        }


        if (resourcenameRMO != undefined && resourcenameRMO != "" && resourcenameRMO != null) {
            var url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/Lists/getbytitle('RMOResourceAllocation')/items?$filter=RRFNumber eq '" + rrfid + "'";
            var resultresourceallocation = resultset(url);
            if (resultresourceallocation.length > 0) {
                var itemresourceid = resultresourceallocation[0].ID;
                resourceinsert = false;

            }
            else {
                var itemresourceid = "";
                resourceinsert = true;
            }
            var dataresourcealloc = { 'suggestedResource': resourcenameRMO, 'RRFNumber': rrfid, 'ShortlistedResource': resourcenameRMO }
            var result = insertOrUpdateResource('RMOResourceAllocation', resourceinsert, itemresourceid, dataresourcealloc);
        }

        if (PageStatus == "RMO Validation" || PageStatus == "Functional Head") {
            var flag = "1";
            var transctioninsert = true;
            var itemid = "";

            var datatransaction = { 'Flag': flag, 'LogType': "RRF Initiated", 'RRFNO': rrfid, 'ProjectGUID': projectguid }
            var result = insertOrUpdateTransaction('RRFTransactionDetails', transctioninsert, itemid, datatransaction);
        }


        //alert("RRF saved successfully");
        show_RRFSaved_alert(PageStatus);

    }


    function GetUserIdByLogin(sthname) {
        var uri = $("#divReportingTo").getUserInfo();
        var weblink = _spPageContextInfo.webServerRelativeUrl + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(sthname) + "'";
        var userid = null;
        $.ajax({
            url: weblink,
            async: false,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                userid = data.d.Id;
            },
            error: function (data) {
                alert("Error : " + data);
            }
        });
        return userid;
    }


    /* Insert or Update ListItem By passing parameter 
    listName=Name of thr list
    insert=true/false
    ID=listItem ID
    data=Item which you want to insert or update*/
    function insertOrUpdateRRF(listName, insert, ID, data) {
        var Val = '';
        //var itemType = GetItemTypeForListName(listName);
        var item = $.extend({
            "__metadata": { "type": "SP.Data.RRFItem" }


        }, data);
        var header;
        var Url;
        if (insert) {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            };
        } else {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + ID + ")";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            };
        }
        $.ajax({
            url: Url,
            type: "POST",
            async: false,
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: header,
            success: function (data) {
                Val = 'success';
            },
            error: function (data) {
                alert(' error inserting/updating dependencies');
                Val = 'error';
            }
        });
        return Val;
    }

    /*End */

    /* Insert or Update ListItem By passing parameter 
    listName=Name of thr list
    insert=true/false
    ID=listItem ID
    data=Item which you want to insert or update*/
    function insertOrUpdateResource(listName, insert, ID, data) {
        var Val = '';
        //var itemType = GetItemTypeForListName(listName);
        var item = $.extend({
            "__metadata": { "type": "SP.Data.RMOResourceAllocationListItem" }

        }, data);
        var header;
        var Url;
        if (insert) {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            };
        } else {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + ID + ")";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            };
        }
        $.ajax({
            url: Url,
            type: "POST",
            async: false,
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: header,
            success: function (data) {
                Val = 'success';
            },
            error: function (data) {
                alert(' error inserting/updating dependencies');
                Val = 'error';
            }
        });
        return Val;
    }

    /*End */

    /* Insert or Update ListItem By passing parameter 
    listName=Name of thr list
    insert=true/false
    ID=listItem ID
    data=Item which you want to insert or update*/
    function insertOrUpdateTransaction(listName, insert, ID, data) {
        var Val = '';
        //var itemType = GetItemTypeForListName(listName);
        var item = $.extend({
            "__metadata": { "type": "SP.Data.RRFTransactionDetailsListItem" }

        }, data);
        var header;
        var Url;
        if (insert) {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            };
        } else {
            Url = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('" + listName + "')/items(" + ID + ")";
            header = {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": "*"
            };
        }
        $.ajax({
            url: Url,
            type: "POST",
            async: false,
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: header,
            success: function (data) {
                Val = 'success';
            },
            error: function (data) {
                alert(' error inserting/updating dependencies');
                Val = 'error';
            }
        });
        return Val;
    }

    /*End */

    //Code to destroy jquery datatable 
    function destroyjs(tableid) {
        if ($.fn.dataTable.isDataTable(tableid)) {
            $(tableid).DataTable({
                "filter": false,
                "destroy": true
            });
            $(tableid).DataTable().destroy();
            $(tableid).html("");
            $(tableid + " tbody tr").remove();
        }

    }


    function uploadDocument() {
        if (rrfno != undefined || rrfno != null) {
            insertRRFDetails();
        }
        else if (pagerequestid == "") {
            var sourceLib = 'RRFTemplate';
            var destLib = 'RRF';
            var projectname = $('#ddlprojectname option:selected').text();
            var date = new Date();
            date = date.getFullYear().toString().substr(-2) + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var folderSrc = web.getFolderByServerRelativeUrl(sourceLib);
            context.load(folderSrc, 'Files');
            context.executeQueryAsync(
                function () {
                    var files = folderSrc.get_files();
                    var e = files.getEnumerator();
                    var dest = [];
                    while (e.moveNext()) {
                        var file = e.get_current();
                        var filename = file.get_name();
                        var ext = filename.substr(filename.lastIndexOf('.') + 1);
                        var finalfilename = projectname + date + '.' + ext;
                        var destLibUrl = destLib + "/" + finalfilename;
                        dest.push(destLibUrl); //delete this when we're happy we got the file paths right
                        file.copyTo(destLibUrl, true);
                    }
                    context.executeQueryAsync(function () {
                        console.log("Files moved successfully!");
                        pagerequestid = "1";
                        insertRRFDetails();
                    }, function (sender, args) { console.log("error: ") + args.get_message() });
                },
                function (sender, args) { console.log("Sorry, something messed up: " + args.get_message()); }
                );
        }
        else if (pagerequestid == "1") {
            insertRRFDetails();
        }
    }


    function getAttchmentReason() {
        var context = SP.ClientContext.get_current(); //gets the current context
        var web = context.get_web(); //gets the web object
        var list = web.get_lists(); //gets the collection of lists
        var targetList = list.getByTitle("RRFSupportDocument");
        var itemCreation = new SP.ListItemCreationInformation();
        var FolderURL = getFolderURL();
        itemCreation.set_folderUrl(FolderURL);//URL of the folder
        itemCreation.set_underlyingObjectType(SP.FileSystemObjectType.folder);
        itemCreation.set_leafName(rrfid); // pass the id from the url
        var folderItem = targetList.addItem(itemCreation);
        folderItem.update();
        context.load(folderItem);
        context.executeQueryAsync(function (sender, arges) {
            // RRFItemId = rrfid;
            var dfd = $.Deferred();
            var fileArray = [];
            $("#attachFilesContainer input:file").each(function () {
                if ($(this)[0].files[0]) {
                    fileArray.push({ "Attachment": $(this)[0].files[0] });
                }
            });
            total_numberoffile = fileArray.length;

            for (var b = 0; b < fileArray.length; b++) {
                uploadfile(fileArray[b].Attachment, RRFItemId, RRFItemId);
            }
        },

        function (sender, arges) {
            var catcherr = arges.get_message();
            if (catcherr.indexOf('already exists.')) {
                //RRFItemId 
                var dfd = $.Deferred();
                var fileArray = [];
                $("#attachFilesContainer input:file").each(function () {
                    if ($(this)[0].files[0]) {
                        fileArray.push({ "Attachment": $(this)[0].files[0] });
                    }
                });
                total_numberoffile = fileArray.length;
                for (var b = 0; b < fileArray.length; b++) {
                    uploadfile(fileArray[b].Attachment, RRFItemId, rrfid);
                }
            }
            else {
                alert(arges.get_message());
                var Confirm = 1;
                if (Confirm) {
                    window.location = window.location.href;
                }
            }

        });
    }
    function uploadfile(file, RRFItemId, folder_name) {
        var url = getSiteURl(); //"https://bristleconeonline.sharepoint.com/sites/PPMUAT/";
        uploadFileLocal(file, RRFItemId, folder_name);
    }
    function uploadFileLocal(file, RRFItemId, folder_name) {
        var fileName = file.name;
        var reName = fileName.split(".")[0];
        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        var dateTime = date + '_' + time;
        reName = reName + "_" + dateTime;
        reName = reName.replace("&", "and");
        var extension = fileName.split(".")[1];
        fileName = reName + "." + extension;
        var digest = jQuery("#__REQUESTDIGEST").val();
        var webUrl = _spPageContextInfo.webAbsoluteUrl;
        var NewItemID = folder_name;
        var reader = new FileReader();
        var arrayBuffer;
        reader.onload = function (e) {
            arrayBuffer = reader.result;
            //String.format("{0}/_api/web/GetFolderByServerRelativeUrl('..sites/PPMUAT/RRFSupportDocument/" + NewItemID + "')/Files/Add(url='{1}', overwrite=true)",_spPageContextInfo.webAbsoluteUrl, fileName);
            url = getUploadFileURL(NewItemID, fileName); //String.format("{0}/_api/web/GetFolderByServerRelativeUrl('/sites/PPMUAT/RRFSupportDocument/" + NewItemID + "')/Files/Add(url='{1}', overwrite=true)",_spPageContextInfo.webAbsoluteUrl, fileName);
            //JQuery Ajax call here
            jQuery.ajax({
                url: url,
                type: "POST",
                async: false,
                data: arrayBuffer,
                headers: {
                    "Accept": "application/json; odata=verbose",
                    "X-RequestDigest": digest
                },
                contentType: "application/json;odata=verbose",
                processData: false,
                success: function (data, status) {
                    console.log(data);
                    getItem(data.d, RRFItemId);
                },
                error: function (arr, error) {
                    alert('Error in uploading.');
                }
            });
        };
        reader.readAsArrayBuffer(file);

    }

    //Update RRF number against file

    function getItem(file, RRFItemId) {
        var call = jQuery.ajax({
            url: file.ListItemAllFields.__deferred.uri,
            type: "GET",
            async: false,
            dataType: "json",
            headers: {
                Accept: "application/json;odata=verbose"
            },
            success: function (data, status) {
                console.log(data);
                updateItemFields(data.d, RRFItemId);
            },
            error: function (arr, error) {
                alert('Error in uploading.');

            }
        });
        return call;
    }


    function updateItemFields(item, RRFItemId) {
        var call = jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl +
                "/_api/Web/Lists/getByTitle('RRFSupportDocument')/Items(" +
                item.Id + ")",
            type: "POST",
            async: false,
            data: JSON.stringify({
                "__metadata": { type: "SP.Data.RRFSupportDocumentItem" },
                RRFID: RRFItemId,
            }),
            headers: {
                Accept: "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "IF-MATCH": item.__metadata.etag,
                "X-Http-Method": "MERGE"
            },
            success: function (data, status) {

                //alert('file uploaded successfully');
            },
            error: function (arr, error) {
                alert('Error in updating id..!!');
            }
        });
    }


    function getURLParameters(paramName) {
        paramName = paramName.split(';');
        var sURL = window.document.URL.toString();
        if (sURL.indexOf("?") > 0) {
            var arrParams = sURL.split("?");
            var arrURLParams = arrParams[1].split("&");
            var arrParamNames = new Array(arrURLParams.length);
            var arrParamValues = [];

            var i = 0;
            for (i = 0; i < arrURLParams.length; i++) {
                var sParam = arrURLParams[i].split("=");
                if (sParam[0] == paramName[i]) {
                    if (sParam[1].indexOf('#') > 0) {
                        var parameter = sParam[1].split('#');
                        parameter = parameter[0];
                        arrParamValues.push(unescape(parameter));
                    } else {
                        arrParamValues.push(unescape(sParam[1]));
                    }
                }
            }
            return arrParamValues;

        }
    }

    $(function () {
        // 2 jpgs under 100kb only
        $('.multi1').MultiFile({
            onFileDuplicate: function (element, value, master_element) {
                show_fileduplicate_alert('This file already selected.');
            },
            afterFileSelect: function (element, value, master_element) {
                var result = value.substring(0, value.lastIndexOf("."));
                var extension = value.substring(value.lastIndexOf(".") + 1);
                if (!validation_dataFile(result)) {
                    show_fileduplicate_alert('File contain Invalid characters.');
                    $("#File_Control_div1 div a").last().trigger("click");
                }

                if (validation_dataFileExtension(extension)) {
                    show_fileduplicate_alert('File with this extension are not allowed.');
                    $("#File_Control_div1 div a").last().trigger("click");

                }
                var fileSize = master_element.files.size;
                fileSize = Math.round((fileSize / 1024));
                if (fileSize > 2000) {
                    show_fileduplicate_alert('File more than 2MB are not allowed');
                    $("#File_Control_div1 div a").last().trigger("click");
                }
                //var newFileSize=(Math.round((fileSize / 1024)))+"KB";
                //alert(fileSize);
                //if()


            }

        });

    });


    function validation_dataFileExtension(mystring) {

        var strArray = ['rtf', 'csv', 'doc', 'docm', 'docx', 'wpd', 'eml', 'htm', 'html', 'pdf', 'ppt', 'pptm', 'pptx', 'ppsx', 'pps', 'ppsm', 'txt', 'xls', 'xlsx', 'zip', 'jpg', 'img', 'png', 'gif', 'war'];

        for (var j = 0; j < strArray.length; j++) {
            if (strArray[j].match(mystring.toLowerCase())) return false;
        }
        return true;

    }


    function validation_dataFile(mystring) {
        var iChars = ".!@#$%^&*()+=[]\\\'/{}|\":<>";
        for (var i = 0; i < mystring.length; i++) {
            if (iChars.indexOf(mystring[i]) != -1) {
                return false;
            }
        }
        return true;
    }

    //$('#alert_ok_click')
    function show_fileduplicate_alert(msg) {

        $("#rrfsavedmsg").css("display", "none");
        $("#rrfconfirmationmsg").css("display", "none");
        $("#divMultipleAssignment").css("display", "none");
        $("#divResourceSaveMsg").css("display", "none");
        $("#fileuploadmsg").css("display", "block");
        document.getElementById("Alert_msg").innerHTML = msg;
        $("#alertmain").show();
    }


    function show_RRFSaved_alert(msg) {


        if (PageStatus == "RRF Saved") {
            var msg = 'RRF Saved Successfully..';
            document.getElementById("RRFsaved_msg").innerHTML = msg;
        }
        else if (PageStatus == "RMO Validation") {
            var msg = 'RRF Submitted Successfully';
            document.getElementById("RRFsaved_msg").innerHTML = msg;
        }
        else if (PageStatus == "Non Billable") {
            var msg = 'RRF Saved Successfully..';
            document.getElementById("RRFsaved_msg").innerHTML = msg;
        }
        else if (PageStatus == "Functional Head") {
            var msg = 'RRF Submitted Successfully';
            document.getElementById("RRFsaved_msg").innerHTML = msg;
        }
        $('.loader').hide();


        $("#fileuploadmsg").css("display", "none");
        $("#rrfconfirmationmsg").css("display", "none");
        $("#divMultipleAssignment").css("display", "none");
        $("#divResourceSaveMsg").css("display", "none");
        //$("#fileuploadmsg").hide();
        //$("#divMultipleAssignment").hide();
        $("#rrfsavedmsg").css("display", "block");
        //$("#rrfsavedmsg").show();
        $("#alertmain").show();


    }

    //RRFok_click

    $("#RRFok_click").click(function () {
        $("#alertmain").hide();
        if (PageStatus == "RMO Validation" || PageStatus == "Functional Head") {
            window.location.replace("../SitePages/RRFForm.aspx");
        }
    });
    $("#ok_click").click(function () {
        $("#alertmain").hide();
    });

    $("#RRFconfirmyes_click").click(function () {
        $("#alertmain").hide();
        submitRRF();
    });

    $("#RRFConfirmno_click").click(function () {
        $("#alertmain").hide();
    });
    $("#Resourceok_click").click(function () {
        $("#alertmain").hide();
    });


    // function confirmation_close() {
    //     $("#alertmain").hide();
    // }


    function convert_date_DDMMYYYY(date_to_convert) {
        if (date_to_convert != null) {
            var arr_dateandtime = date_to_convert.split('T');
            var arr_dateonly = arr_dateandtime[0].split('-');
            var MonthName = GetMonthName(arr_dateonly[1]);
            converted_date = arr_dateonly[2] + "-" + MonthName + "-" + arr_dateonly[0];
            return converted_date;
        }
        //alert(converted_date);

    }

    function mySelectEType() {
        ddlEType = document.getElementById("ddlemptypey").value;
    }


    function costcenter() {
        var entity = $('#ddlentity option:selected').text();
        var value = $('#ddlsubpractice option:selected').text();
        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }

        if (value.indexOf('&') >= 0) {
            value = value.replace('&', '%26');
        }
        if (entity != "Select" && value != "Select") {
            var CostCenterURL = site_url + "_api/RRFMaster?$select=Code&$filter=Entity eq '" + entity + "' and Value eq '" + value + "' and Type eq 'CostcenterName'&$orderby=Code asc";
            var resultCost = resultset(CostCenterURL);
            $("#ddlcostcenter").empty();
            $("#ddlcostcenter").append(new Option("Select", 0));
            var distinctCost = [];
            var uniqueCost = {};
            var array1Cost = [];
            for (var index in resultCost) {
                array1Cost.push(resultCost[index].Code);
                $("#ddlcostcenter").append($('<option></option>').text(resultCost[index].Code));
                if (typeof (uniqueCost[resultCost[index].Code]) == "undefined") {
                    distinctCost.push(resultCost[index].Code);
                }
                uniqueCost[resultCost[index].Code] = 0;
            }
        }
    }


    function AddNoofCloneItems() {
        var urlforcloning = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('RRF')/items?$select=RRFNO,CloneFlag,ID&$filter=RRFNO%20eq%20'" + rrfno + "'and%20CloneFlag%20eq%20%27No%27";

        var CloneValue = document.getElementById('CloneNumber').value;

        if (isNaN(CloneValue)) {
            $('#ErrClone').css('display', 'block');
            //$('#ErrClone').text('Invalid Clone value.Please enter only numeric value from 1-100');
            //document.getElementById('ErrClone').innerHTML='Invalid Clone value.Please enter only numeric value from 1-100';
            document.getElementById('CloneNumber').focus();
            return false;

        }
        else
            if (CloneValue > 25 || CloneValue <= 0) {
                $('#ErrClone').css('display', 'block');
                //$('#ErrClone').text('Invalid Clone value.Please enter only numeric value from 1-100');
                //document.getElementById('ErrClone').innerHTML='Invalid Clone value.Please enter only numeric value from 1-100';
                document.getElementById('CloneNumber').focus();
                return false;
            }
        $('.loader').show();
        $.ajax({
            url: urlforcloning,
            async: false,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            },
            success: function (data) {
                var data = data.d.results;
                var RRfno = data[0].RRFNO;
                var CloneItemID = data[0].Id;
                var data = {
                    'CloneFlag': "Yes",
                    'Clone': CloneValue
                };

                var result = insertOrUpdateRRF("RRF", false, CloneItemID, data);
                $('.loader').hide();

                if (result == "success") {
                    document.getElementById('CloneNumber').value = "";
                    $('#ErrClone').css('display', 'none');
                    $('#clone').css('display', 'none');
                    $('#alertclone').css('display', 'block');
                    $('.clone').text('Cloning in Process').css('pointer-events', 'none').css('cursor', 'not-allowed');//.unbind('click').css('cursor','not-allowed');

                }
            },
            error: function (error) {
                result = 'error';
            }
        });
    }

    function GetItemTypeForListName(name) {
        return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
    }

    function CheckForCloneFlagStatus(RRFNo) {
        var urlForCloneVal = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('RRF')/items?$filter=RRFNO%20eq%20'" + RRFNo + "'&$select=CloneFlag";
        var CloneVal = "";
        $.ajax({
            url: urlForCloneVal,
            async: false,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json; odata=verbose"
            },
            success: function (data) {
                var data = data.d.results;
                CloneVal = data[0].CloneFlag;
            },
            error: function (error) {
                result = 'error';
            }
        });
        return CloneVal;
    }

    function ValidateCloneValue() {

        var CloneValue = document.getElementById('CloneNumber').value;

        if (isNaN(CloneValue)) {
            $('#ErrClone').css('display', 'block');
            //$('#ErrClone').text('Invalid Clone value.Please enter only numeric value from 1-100');
            //document.getElementById('ErrClone').innerHTML='Invalid Clone value.Please enter only numeric value from 1-100';
            document.getElementById('CloneNumber').focus();
            return false;

        }
        else
            if (CloneValue > 25 || CloneValue <= 0) {
                $('#ErrClone').css('display', 'block');
                //$('#ErrClone').text('Invalid Clone value.Please enter only numeric value from 1-100');
                //document.getElementById('ErrClone').innerHTML='Invalid Clone value.Please enter only numeric value from 1-100';
                document.getElementById('CloneNumber').focus();
                return false;
            }
            else {
                $('#ErrClone').css('display', 'none');
            }

    }

    function insertIntoSendEmailData(To, Cc, EventId, Flag, TrackingId) {
        var item = {
            __metadata: { "type": "SP.Data.BconeEmailDataListItem" }
        };

        $.extend(item, { To: To });

        $.extend(item, { Cc: Cc });

        $.extend(item, { EventId: EventId });
        $.extend(item, { Flag: Flag });
        $.extend(item, { TrackingId: TrackingId });

        $.ajax({
            url: "../_api/Web/Lists/GetByTitle('BconeEmailData')/items",
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                //alert('success');
            },
            error: function (error) {
                //alert(JSON.stringify(error));
            }
        });
    }

