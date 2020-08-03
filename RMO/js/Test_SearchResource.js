
function searchResource(Employee_ID, PrimarySkill, SecondrySkill, RolBand, projectStrtdate, Allocationvalue, ProjectEnddate) {
    if (PrimarySkill.indexOf('&') >= 0) {
        PrimarySkill = PrimarySkill.replace('&', '%26');
    }
    if (PrimarySkill.indexOf('&') >= 0) {
        PrimarySkill = PrimarySkill.replace('&', '%26');
    }
    if (SecondrySkill.indexOf('&') >= 0) {
        SecondrySkill = SecondrySkill.replace('&', '%26');
    }
    if (SecondrySkill.indexOf('&') >= 0) {
        SecondrySkill = SecondrySkill.replace('&', '%26');
    }
    //Employee_ID = "10799";
    var refined_data = [];
    var refined_array = [];
    var array_ProjectWiseResource = [];
    var array_EmployeeSkills = [];
    var array_Resources = [];
    var denieddate_Array = [];
    var site_url = "https://ppmdev.bcone.com/";
    if (Employee_ID == "NA") {
        //array_EmployeeSkills = [];
        //url = site_url + "/_api/EmployeeSkills?$filter=((Skill_Type eq 'Primary' and Skill_Detail eq'" + PrimarySkill + "') or (Skill_Type eq 'Secondary' and Skill_Detail eq'" + SecondrySkill + "'))";
        //$.ajax({
        //    url: url,
        //    method: "GET",
        //    async: false,
        //    headers: { "Accept": "application/json; odata=verbose" },
        //    success: function (data) {
        //        $.each(data.d.results, function (key, value) {
        //            array_EmployeeSkills.push(value.EmployeeID);

        //        });
        //    }
        //});
        array_Resources = [];
        //  $.each(array_EmployeeSkills, function (key, value) {

        url = url = searchResourcefromResources(RolBand, PrimarySkill, SecondrySkill); //"https://ppmdev.bcone.com/_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName&$filter=RoleBand eq'" + RolBand + "' and (PrimarySkill eq'" + PrimarySkill + "' or Skill eq'" + SecondrySkill + "')"; //"_api/WorkdayResourceMaster?$select=EmployeeID,Designation,Employee_status,Work_Email&$filter=Role_Band eq'" + RolBand + "' and (PrimarySkill eq'" + PrimarySkill + "' or secondarySkill eq'" + SecondrySkill + "')";
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                $.each(data.d.results, function (key, value) {
                    array_Resources.push(value);

                });

            }
        });

        // });
        array_ProjectWiseResource = [];
        $.each(array_Resources, function (key, Resourcesdata) {
            url = searchResourceProjectWiseResourceAllocationNew(projectStrtdate, ProjectEnddate, Resourcesdata.EmployeeID);
            //searchResourceProjectWiseResourceAllocation(projectStrtdate, Resourcesdata.EmployeeID); //site_url + "_api/ProjectWiseResourceAllocation?$filter=(Finishdatetime lt datetime'" + projectStrtdate + "'or Allocation lt 100) and EmployeeID eq '" + Resourcesdata.EmployeeID + "'"; //2017-08-29T19:00:00
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {

                    if (data.d.results.length > 0) {
                        var ProjectStrtdateParse = Date.parse(projectStrtdate);
                        var ProjectEnddateParse = Date.parse(ProjectEnddate);
                        $.each(data.d.results, function (key, value) {
                            var allocatedStartdate = value.Startdatetime;
                            allocatedStartdate = Date.parse(allocatedStartdate);
                            var allocatedEnddate = value.Finishdatetime;
                            allocatedEnddate = Date.parse(allocatedEnddate);

                            if ((allocatedStartdate >= ProjectStrtdateParse && allocatedStartdate <= ProjectEnddateParse) || (allocatedEnddate >= ProjectStrtdateParse && allocatedEnddate <= ProjectEnddateParse) || (ProjectStrtdateParse >= allocatedStartdate && ProjectStrtdateParse <= ProjectEnddateParse) || (ProjectEnddateParse >= allocatedStartdate && ProjectEnddateParse <= allocatedEnddate)) {

                                array_ProjectWiseResource.push({
                                    "EmployeeID": Resourcesdata.EmployeeID,
                                    "ResourceFullName": value.ResourceFullName,
                                    "Designation": Resourcesdata.Designation,
                                    "ProjectName": value.ProjectName,
                                    "Startdatetime": value.Startdatetime,
                                    "Finishdatetime": value.Finishdatetime,
                                    "Allocation": value.Allocation,
                                    "Work_Location": value.ProjectLocation,
                                    "Employee_status": Resourcesdata.EmployeeStatus,
                                    "Work_Email": Resourcesdata.ResourceEmailAddress,
                                    "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                                    "Type": value.Flag,
                                    "ProjectCode": value.AllocatedProjectCode,
                                    "SubPractice": Resourcesdata.SubPractice,
                                    "BaseLocation": Resourcesdata.BaseLocation
                                })
                            }
                        });
                    } else {
                        denieddate_Array.push({
                            "EmployeeID": Resourcesdata.EmployeeID,
                            "ResourceFullName": Resourcesdata.ResourceName,
                            "Designation": Resourcesdata.Designation,
                            "ProjectName": "",
                            "Startdatetime": "",
                            "Finishdatetime": "",
                            "Allocation": "",
                            "Work_Location": "",
                            "Employee_status": Resourcesdata.EmployeeStatus,
                            "Work_Email": Resourcesdata.ResourceEmailAddress,
                            "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                            "Type": "",
                            "ProjectCode": "",
                            "SubPractice": Resourcesdata.SubPractice,
                            "BaseLocation": Resourcesdata.BaseLocation
                        });
                    }
                }
            });


        })
    } else if (projectStrtdate == "" || projectStrtdate == undefined) {

        var array_Resources = [];


        url = searchResourcefromResourcesUsingEmpid(Employee_ID); //"https://ppmdev.bcone.com/_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName&$filter=EmployeeID eq'" + Employee_ID + "'";//"_api/WorkdayResourceMaster?$select=EmployeeID,Designation,Employee_status,Work_Email&$filter=EmployeeID eq'" + Employee_ID + "'";
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                $.each(data.d.results, function (key, value) {
                    array_Resources.push(value);

                });

            }
        });


        array_ProjectWiseResource = [];
        $.each(array_Resources, function (key, Resourcesdata) {
            url = searchResourceProjectWiseResourceAllocationUsingEmpid(Resourcesdata.EmployeeID);//site_url + "_api/ProjectWiseResourceAllocation?$filter=EmployeeID eq '" + Resourcesdata.EmployeeID + "'"; //2017-08-29T19:00:00
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    if (data.d.results.length > 0) {
                        $.each(data.d.results, function (key, value) {
                            array_ProjectWiseResource.push({
                                "EmployeeID": Resourcesdata.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": Resourcesdata.Designation,
                                "ProjectName": value.ProjectName,
                                "Startdatetime": value.Startdatetime,
                                "Finishdatetime": value.Finishdatetime,
                                "Allocation": value.Allocation,
                                "Work_Location": value.ProjectLocation,
                                "Employee_status": Resourcesdata.EmployeeStatus,
                                "Work_Email": Resourcesdata.ResourceEmailAddress,
                                "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                                "Type": value.Flag,
                                "ProjectCode": value.AllocatedProjectCode,
                                "SubPractice": Resourcesdata.SubPractice,
                                "BaseLocation": Resourcesdata.BaseLocation
                            })
                        });
                    } else {

                        denieddate_Array.push({
                            "EmployeeID": Resourcesdata.EmployeeID,
                            "ResourceFullName": Resourcesdata.ResourceName,
                            "Designation": Resourcesdata.Designation,
                            "ProjectName": "",
                            "Startdatetime": "",
                            "Finishdatetime": "",
                            "Allocation": "",
                            "Work_Location": "",
                            "Employee_status": Resourcesdata.EmployeeStatus,
                            "Work_Email": Resourcesdata.ResourceEmailAddress,
                            "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                            "Type": "",
                            "ProjectCode": "",
                            "SubPractice": Resourcesdata.SubPractice,
                            "BaseLocation": Resourcesdata.BaseLocation
                        })

                    }
                }
            });


        })
    }
    else {

        var array_Resources = [];


        url = searchResourcefromResourcesUsingEmpid(Employee_ID); //"https://ppmdev.bcone.com/_api/Resources?$select=EmployeeID,Designation,EmployeeStatus,ResourceEmailAddress,ResourceName&$filter=EmployeeID eq'" + Employee_ID + "'";//"_api/WorkdayResourceMaster?$select=EmployeeID,Designation,Employee_status,Work_Email&$filter=EmployeeID eq'" + Employee_ID + "'";
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                $.each(data.d.results, function (key, value) {
                    array_Resources.push(value);

                });

            }
        });


        array_ProjectWiseResource = [];
        $.each(array_Resources, function (key, Resourcesdata) {
            url = searchResourceProjectWiseResourceAllocationNew(projectStrtdate, ProjectEnddate, Resourcesdata.EmployeeID);
            //searchResourceProjectWiseResourceAllocation(projectStrtdate, Resourcesdata.EmployeeID);//site_url + "_api/ProjectWiseResourceAllocation?$filter=(Finishdatetime lt datetime'" + projectStrtdate + "'or Allocation le 100) and EmployeeID eq '" + Resourcesdata.EmployeeID + "'"; //2017-08-29T19:00:00
            $.ajax({
                url: url,
                method: "GET",
                async: false,
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    if (data.d.results.length > 0) {
                        var ProjectStrtdateParse = Date.parse(projectStrtdate);
                        var ProjectEnddateParse = Date.parse(ProjectEnddate);
                        $.each(data.d.results, function (key, value) {
                            var allocatedStartdate = value.Startdatetime;
                            allocatedStartdate = Date.parse(allocatedStartdate);
                            var allocatedEnddate = value.Finishdatetime;
                            allocatedEnddate = Date.parse(allocatedEnddate);
                            if ((allocatedStartdate >= ProjectStrtdateParse && allocatedStartdate <= ProjectEnddateParse) || (allocatedEnddate >= ProjectStrtdateParse && allocatedEnddate <= ProjectEnddateParse) || (ProjectStrtdateParse >= allocatedStartdate && ProjectStrtdateParse <= ProjectEnddateParse) || (ProjectEnddateParse >= allocatedStartdate && ProjectEnddateParse <= allocatedEnddate)) {
                                array_ProjectWiseResource.push({
                                    "EmployeeID": Resourcesdata.EmployeeID,
                                    "ResourceFullName": value.ResourceFullName,
                                    "Designation": Resourcesdata.Designation,
                                    "ProjectName": value.ProjectName,
                                    "Startdatetime": value.Startdatetime,
                                    "Finishdatetime": value.Finishdatetime,
                                    "Allocation": value.Allocation,
                                    "Work_Location": value.ProjectLocation,
                                    "Employee_status": Resourcesdata.EmployeeStatus,
                                    "Work_Email": Resourcesdata.ResourceEmailAddress,
                                    "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                                    "Type": value.Flag,
                                    "ProjectCode": value.AllocatedProjectCode,
                                    "SubPractice": Resourcesdata.SubPractice,
                                    "BaseLocation": Resourcesdata.BaseLocation
                                })
                            }
                        });
                    } else {
                        denieddate_Array.push({
                            "EmployeeID": Resourcesdata.EmployeeID,
                            "ResourceFullName": Resourcesdata.ResourceName,
                            "Designation": Resourcesdata.Designation,
                            "ProjectName": "",
                            "Startdatetime": "",
                            "Finishdatetime": "",
                            "Allocation": "",
                            "Work_Location": "",
                            "Employee_status": Resourcesdata.EmployeeStatus,
                            "Work_Email": Resourcesdata.ResourceEmailAddress,
                            "OrganisationDOJ": Resourcesdata.OrganisationDOJ,
                            "Type": "",
                            "ProjectCode": "",
                            "SubPractice": Resourcesdata.SubPractice,
                            "BaseLocation": Resourcesdata.BaseLocation
                        });
                    }
                }
            });


        })
    }
    //
    var resource_Array = [];
    resource_Array.push.apply(resource_Array, array_ProjectWiseResource);

    var lookup = {};
    var items = resource_Array;
    var result = [];
    for (var item, i = 0; item = items[i++];) {
        var name = item.EmployeeID;
        var projectStrtMinDate = [];
        var projectEndMaxtDate = [];
        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(item);
        }
    }
    for (var j = 0; j < result.length; j++) {
        var array2 = [];
        var array_d1 = [];
        var array_d2 = [];
        var Projectdatacount = 0;
        var Locationdatacount = 0;
        var allocation = [];
        var singleProjectAllocation = 0;
        for (var k = 0; k < resource_Array.length; k++) {
            if (resource_Array[k].EmployeeID == result[j].EmployeeID) {
                array2.push(resource_Array[k]);

                var srtDate = resource_Array[k].Startdatetime;
                var endDate = resource_Array[k].Finishdatetime;
                srtDate = Date.parse(srtDate);
                endDate = Date.parse(endDate);
                array_d1.push(srtDate);
                array_d2.push(endDate);
                if (Employee_ID != "NA") {
                    if (resource_Array[k].ProjectName != result[j].ProjectName) {
                        // multipleAssignProject_Array.push(resource_Array);
                        multipleAssignProject_Array.push.apply(multipleAssignProject_Array, resource_Array);
                        Projectdatacount++;
                    }
                } else {
                    if (resource_Array[k].ProjectName != result[j].ProjectName || (Projectdatacount == 0 || Projectdatacount == "0")) {
                        multipleAssignProject_Array.push(resource_Array[k]);
                        Projectdatacount++;
                        if (resource_Array[k].ProjectName == result[j].ProjectName && (Projectdatacount == 1 || Projectdatacount == "1")) {
                            singleProjectAllocation++;
                        } else {
                            singleProjectAllocation--;
                        }

                    }
                    else {
                        if (Projectdatacount > 0) {
                            multipleAssignProject_Array.push(resource_Array[k]);
                            singleProjectAllocation--;
                        }
                    }

                }

                if (resource_Array[k].Work_Location != result[j].Work_Location) {
                    Locationdatacount++;
                }
                allocation.push(resource_Array[k].Allocation);
            }

        }
        var minStartDate = Math.min.apply(Math, array_d1);
        minStartDate = formateRefinedDate(minStartDate);
        var maxEndDate = Math.max.apply(Math, array_d2);
        maxEndDate = formateRefinedDate(maxEndDate);
        var allocationPer = Math.max.apply(Math, allocation);
        var project_Name = (Projectdatacount > 0 && singleProjectAllocation != 1) ? "Multiple Assignment" : array2[0].ProjectName;
        var Project_Loaction = Locationdatacount > 0 ? "Multiple Location" : array2[0].Work_Location;
        if (Allocationvalue != "" && Allocationvalue != undefined) {
            if (100 > (100 - parseInt(allocationPer)))
                refined_array.push({
                    "EmployeeID": array2[0].EmployeeID,
                    "ResourceFullName": array2[0].ResourceFullName,
                    "Designation": array2[0].Designation,
                    "ProjectName": project_Name,
                    "Startdatetime": minStartDate,
                    "Finishdatetime": maxEndDate,
                    "Allocation": allocationPer,
                    "Work_Location": Project_Loaction,
                    "Employee_status": array2[0].Employee_status,
                    "Work_Email": array2[0].Work_Email,
                    "OrganisationDOJ": array2[0].OrganisationDOJ,
                    "ProjectCode": array2[0].ProjectCode,
                    "SubPractice": array2[0].SubPractice,
                    "BaseLocation": array2[0].BaseLocation
                })
        } else {

            refined_array.push({
                "EmployeeID": array2[0].EmployeeID,
                "ResourceFullName": array2[0].ResourceFullName,
                "Designation": array2[0].Designation,
                "ProjectName": project_Name,
                "Startdatetime": minStartDate,
                "Finishdatetime": maxEndDate,
                "Allocation": allocationPer,
                "Work_Location": Project_Loaction,
                "Employee_status": array2[0].Employee_status,
                "Work_Email": array2[0].Work_Email,
                "OrganisationDOJ": array2[0].OrganisationDOJ,
                "ProjectCode": array2[0].ProjectCode,
                "SubPractice": array2[0].SubPractice,
                "BaseLocation": array2[0].BaseLocation
            })
        }


    }

    if (denieddate_Array.length > 0) {
        refined_array.push.apply(refined_array, denieddate_Array);
    }
    //  }
    // });
    return refined_array;
}



function formateRefinedDate(date) {
    var resultdate = "";
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate());
    var tempDate_array = newdate.toDateString().split(' ');

    resultdate = tempDate_array[2] + "-" + tempDate_array[1] + "-" + tempDate_array[3];
    return resultdate;
}
function ShowMultipleAssignmentProjectsDetails(event, Flag) {
    if (event.firstChild.nodeValue == "Multiple Assignment") {
        var eid = event.parentNode.id.split('#')[0];//.parentNode.parentNode.childNodes[1].innerText;
        var eName = event.parentNode.id.split('#')[1];//event.parentNode.parentNode.childNodes[2].innerText;
        //var Flag=event.parentNode.id.split('#')[2];
        if (Flag != "1") {
            document.getElementById('divResourceApproval').style.display = "none";
            document.getElementById('divResourceComment').style.display = "none";
            document.getElementById('divResourceRejection').style.display = "none";
            document.getElementById('divResourceAssignment').style.display = "none";
        }
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
                        projectManager = value.ProjectManagerName; //findProjectwiseProjectManager(projectCode);
                    }
                    if (value.Startdatetime != null) {
                        ProjectstartDate = value.Startdatetime;
                        var date1 = Date.parse(ProjectstartDate);
                        ProjectstartDate = formateRefinedDate(date1);
                    }
                    if (value.Finishdatetime != null) {
                        ProjectEnddate = value.Finishdatetime;
                        var date2 = Date.parse(ProjectEnddate);
                        ProjectEnddate = formateRefinedDate(date2);
                    }
                    if (value.Allocation != null) {
                        allocationPercent = value.Allocation;
                    }
                    if (value.Work_Location != null) {
                        Location = value.Work_Location;
                    }
                    if (value.Type != null) {
                        Type = value.Type;
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
function findProjectwiseProjectManager(ProjectCode) {
    var ProjectManagerName = "";

    url = getProjectwiseProjectManagername(ProjectCode);
    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                ProjectManagerName = data.d.results[0].ProjectOwnerName;
            }
        }
    });
    return ProjectManagerName;
}
function getActiveByResourceWiseProjectAllocation(projectCode, resourceID, LoginUserEmail, futureAllocationflag) {
    //projectCode = "0000001NP";
    // resourceID = "Parth";
    if (futureAllocationflag == "2") {
        url = getDetailsProjectwiseresourceAllocationUsingPCodeEmpidFuture(projectCode, resourceID);
    } else {
        url = getDetailsProjectwiseresourceAllocationUsingPCodeEmpid(projectCode, resourceID);
    }



    $.ajax({
        url: url,
        method: "GET",
        async: false,
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            if (data.d.results.length > 0) {
                var activeflag = data.d.results[0].Active;
                var ResAllo_UID = data.d.results[0].ResAllo_UID;
                var geturl = getPWAURl();

                if (activeflag == "1" || activeflag == 1 || activeflag == 2 || activeflag == "2") {
                    var serviceurl = geturl + "api/bcone/Update_AllocationData";

                    $.ajax({
                        url: serviceurl,
                        method: "POST",
                        async: false,
                        data: { "ResAllo_UID": ResAllo_UID, "ModifyBy_EmailID": LoginUserEmail },
                        headers:
                        {
                            "Accept": "application/json;odata=verbose"
                        },
                        success: function (data) {
                            //alert('success');
                        },
                        error: function (error) {
                            alert(JSON.stringify(error));
                        }
                    });
                }
            }
        }
    });
    return 1;
}
function searchResourceWithNewService(Employee_ID, PrimarySkill, SecondrySkill, RolBand, projectStrtdate, Allocationvalue, ProjectEnddate) {
    if (PrimarySkill.indexOf('&') >= 0) {
        PrimarySkill = PrimarySkill.replace('&', '%26');
    }
    if (PrimarySkill.indexOf('&') >= 0) {
        PrimarySkill = PrimarySkill.replace('&', '%26');
    }
    if (SecondrySkill.indexOf('&') >= 0) {
        SecondrySkill = SecondrySkill.replace('&', '%26');
    }
    if (SecondrySkill.indexOf('&') >= 0) {
        SecondrySkill = SecondrySkill.replace('&', '%26');
    }
    //Employee_ID = "10799";
    var refined_data = [];
    var refined_array = [];
    var array_ProjectWiseResource = [];
    var array_EmployeeSkills = [];
    var array_Resources = [];
    var denieddate_Array = [];
    var future_Array = [];
    var site_url = "https://ppmdev.bcone.com/";
    if (Employee_ID == "NA") {

        array_Resources = [];
        array_ProjectWiseResource = [];
        array_Temp = [];
        url = searchResourceNewResourceAllocationData(projectStrtdate, ProjectEnddate, PrimarySkill, SecondrySkill);
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {

                if (data.d.results.length > 0) {
                    var ProjectStrtdateParse = Date.parse(projectStrtdate);
                    var ProjectEnddateParse = Date.parse(ProjectEnddate);
                    $.each(data.d.results, function (key, value) {
                        var allocatedStartdate = value.Startdatetime;
                        allocatedStartdate = Date.parse(allocatedStartdate);
                        var allocatedEnddate = value.Finishdatetime;
                        allocatedEnddate = Date.parse(allocatedEnddate);
                        if (value.ActiveFlag == 2 || value.ActiveFlag == "2") {
                            future_Array.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": value.ProjectName,
                                "Startdatetime": value.Startdatetime,
                                "Finishdatetime": value.Finishdatetime,
                                "Allocation": value.Allocation,
                                "Work_Location": value.ProjectLocation,
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": value.flag,
                                "ProjectCode": value.AllocatedProjectCode,
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            })

                        } else if (value.ProjectName == null || value.ProjectName=="NA") {
                            denieddate_Array.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": "",
                                "Startdatetime": "",
                                "Finishdatetime": "",
                                "Allocation": value.Allocation,
                                "Work_Location": "",
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": "",
                                "ProjectCode": "",
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            });
                        
                        } else if ((allocatedStartdate >= ProjectStrtdateParse && allocatedStartdate <= ProjectEnddateParse) || (allocatedEnddate >= ProjectStrtdateParse && allocatedEnddate <= ProjectEnddateParse) || (ProjectStrtdateParse >= allocatedStartdate && ProjectStrtdateParse <= ProjectEnddateParse) || (ProjectEnddateParse >= allocatedStartdate && ProjectEnddateParse <= allocatedEnddate)) {
                            array_Temp.push(value.EmployeeID);
                            array_ProjectWiseResource.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": value.ProjectName,
                                "Startdatetime": value.Startdatetime,
                                "Finishdatetime": value.Finishdatetime,
                                "Allocation": value.Allocation,
                                "Work_Location": value.ProjectLocation,
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": value.flag,
                                "ProjectCode": value.AllocatedProjectCode,
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            })
                        } else {
                            denieddate_Array.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": "",
                                "Startdatetime": "",
                                "Finishdatetime": "",
                                "Allocation": value.Allocation,
                                "Work_Location": "",
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": "",
                                "ProjectCode": "",
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            });
                        }
                        //else {
                        //    var newEmpIDVal = value.EmployeeID;
                            
                        //    var TemCount = 0;
                        //    //while (i < array_Temp.length) {
                        //    //    if (array_Temp[i] == newEmpIDVal) {
                        //    //        TemCount++;
                        //    //        break;
                        //    //    } 
                        //    //    i++;

                        //    //}
                        //    for (var i = 0; i < array_Temp.length; i++) {
                        //        var duplicateid = array_Temp[i];
                        //        if (duplicateid == newEmpIDVal) {
                        //            TemCount++;
                        //        }
                        //    }
                        //    if (TemCount == 0 && value.flag!=2) {
                        //            denieddate_Array.push({
                        //                "EmployeeID": value.EmployeeID,
                        //                "ResourceFullName": value.ResourceFullName,
                        //                "Designation": value.Designation,
                        //                "ProjectName": "",
                        //                "Startdatetime": "",
                        //                "Finishdatetime": "",
                        //                "Allocation": value.Allocation,
                        //                "Work_Location": "",
                        //                "Employee_status": value.EmployeeStatus,
                        //                "Work_Email": value.ResourceEmailAddress,
                        //                "OrganisationDOJ": value.OrganisationDOJ,
                        //                "Type": "",
                        //                "ProjectCode": "",
                        //                "SubPractice": value.SubPractice,
                        //                "BaseLocation": value.BaseLocation,
                        //                "ProjectManagerName": value.ProjectManager
                        //            });
                        //}
                        //    //if (array_Temp.indexOf(newEmpIDVal) != -1) {

                        //    //} else {
                        //    //    denieddate_Array.push({
                        //    //        "EmployeeID": value.EmployeeID,
                        //    //        "ResourceFullName": value.ResourceFullName,
                        //    //        "Designation": value.Designation,
                        //    //        "ProjectName": "",
                        //    //        "Startdatetime": "",
                        //    //        "Finishdatetime": "",
                        //    //        "Allocation": value.Allocation,
                        //    //        "Work_Location": "",
                        //    //        "Employee_status": value.EmployeeStatus,
                        //    //        "Work_Email": value.ResourceEmailAddress,
                        //    //        "OrganisationDOJ": value.OrganisationDOJ,
                        //    //        "Type": "",
                        //    //        "ProjectCode": "",
                        //    //        "SubPractice": value.SubPractice,
                        //    //        "BaseLocation": value.BaseLocation,
                        //    //        "ProjectManagerName": value.ProjectManager
                        //    //    });
                        //    //}
                        //}
                    });
                }
            }
        });


        // })
    } else if (projectStrtdate == "" || projectStrtdate == undefined) {

        var array_Resources = [];

        array_ProjectWiseResource = [];
        //  $.each(array_Resources, function (key, Resourcesdata) {
        url = searchResourceNewResourceAllocationDataWithoutSkillusingEmployeeID(Employee_ID);
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data.d.results.length > 0) {
                    $.each(data.d.results, function (key, value) {
                        array_ProjectWiseResource.push({
                            "EmployeeID": value.EmployeeID,
                            "ResourceFullName": value.ResourceFullName,
                            "Designation": value.Designation,
                            "ProjectName": value.ProjectName,
                            "Startdatetime": value.Startdatetime,
                            "Finishdatetime": value.Finishdatetime,
                            "Allocation": value.Allocation,
                            "Work_Location": value.ProjectLocation,
                            "Employee_status": value.EmployeeStatus,
                            "Work_Email": value.ResourceEmailAddress,
                            "OrganisationDOJ": value.OrganisationDOJ,
                            "Type": value.Flag,
                            "ProjectCode": value.AllocatedProjectCode,
                            "SubPractice": value.SubPractice,
                            "BaseLocation": value.BaseLocation,
                            "ProjectManagerName": value.ProjectManager
                        })
                    });
                }
            }
        });


        // })
    }
    else {

        var array_Resources = [];

        array_ProjectWiseResource = [];

        //   $.each(array_Resources, function (key, Resourcesdata) {
        url = searchResourceNewResourceAllocationDataUsingEmployeeID(projectStrtdate, ProjectEnddate, Employee_ID);

        $.ajax({
            url: url,
            method: "GET",
            async: false,
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data.d.results.length > 0) {
                    var ProjectStrtdateParse = Date.parse(projectStrtdate);
                    var ProjectEnddateParse = Date.parse(ProjectEnddate);
                    $.each(data.d.results, function (key, value) {
                        var allocatedStartdate = value.Startdatetime;
                        allocatedStartdate = Date.parse(allocatedStartdate);
                        var allocatedEnddate = value.Finishdatetime;
                        allocatedEnddate = Date.parse(allocatedEnddate);
                        if (value.ActiveFlag == 2 || value.ActiveFlag == "2")  {
                            future_Array.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": value.ProjectName,
                                "Startdatetime": value.Startdatetime,
                                "Finishdatetime": value.Finishdatetime,
                                "Allocation": value.Allocation,
                                "Work_Location": value.ProjectLocation,
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": value.flag,
                                "ProjectCode": value.AllocatedProjectCode,
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            })

                        } else if ((allocatedStartdate >= ProjectStrtdateParse && allocatedStartdate <= ProjectEnddateParse) || (allocatedEnddate >= ProjectStrtdateParse && allocatedEnddate <= ProjectEnddateParse) || (ProjectStrtdateParse >= allocatedStartdate && ProjectStrtdateParse <= ProjectEnddateParse) || (ProjectEnddateParse >= allocatedStartdate && ProjectEnddateParse <= allocatedEnddate)) {
                            array_ProjectWiseResource.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": value.ProjectName,
                                "Startdatetime": value.Startdatetime,
                                "Finishdatetime": value.Finishdatetime,
                                "Allocation": value.Allocation,
                                "Work_Location": value.ProjectLocation,
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": value.Flag,
                                "ProjectCode": value.AllocatedProjectCode,
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            })
                        } else {
                            denieddate_Array.push({
                                "EmployeeID": value.EmployeeID,
                                "ResourceFullName": value.ResourceFullName,
                                "Designation": value.Designation,
                                "ProjectName": "",
                                "Startdatetime": "",
                                "Finishdatetime": "",
                                "Allocation": "",
                                "Work_Location": "",
                                "Employee_status": value.EmployeeStatus,
                                "Work_Email": value.ResourceEmailAddress,
                                "OrganisationDOJ": value.OrganisationDOJ,
                                "Type": "",
                                "ProjectCode": "",
                                "SubPractice": value.SubPractice,
                                "BaseLocation": value.BaseLocation,
                                "ProjectManagerName": value.ProjectManager
                            });
                        }
                    });
                }
            }
        });


        //})
    }
    //
    var resource_Array = [];
    resource_Array.push.apply(resource_Array, array_ProjectWiseResource);

    var lookup = {};
    var items = resource_Array;
    var result = [];
    for (var item, i = 0; item = items[i++];) {
        var name = item.EmployeeID;
        var projectStrtMinDate = [];
        var projectEndMaxtDate = [];
        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(item);
        }
    }
    for (var j = 0; j < result.length; j++) {
        var array2 = [];
        var array_d1 = [];
        var array_d2 = [];
        var Projectdatacount = 0;
        var Locationdatacount = 0;
        var allocation = [];
        var singleProjectAllocation = 0;
        for (var k = 0; k < resource_Array.length; k++) {
            if (resource_Array[k].EmployeeID == result[j].EmployeeID) {
                array2.push(resource_Array[k]);

                var srtDate = resource_Array[k].Startdatetime;
                var endDate = resource_Array[k].Finishdatetime;
                srtDate = Date.parse(srtDate);
                endDate = Date.parse(endDate);
                array_d1.push(srtDate);
                array_d2.push(endDate);
                if (Employee_ID != "NA") {
                    if (resource_Array[k].ProjectName != result[j].ProjectName) {
                        // multipleAssignProject_Array.push(resource_Array);
                        multipleAssignProject_Array.push.apply(multipleAssignProject_Array, resource_Array);
                        Projectdatacount++;
                    }
                } else {
                    if (resource_Array[k].ProjectName != result[j].ProjectName || (Projectdatacount == 0 || Projectdatacount == "0")) {
                        multipleAssignProject_Array.push(resource_Array[k]);
                        Projectdatacount++;
                        if (resource_Array[k].ProjectName == result[j].ProjectName && (Projectdatacount == 1 || Projectdatacount == "1")) {
                            singleProjectAllocation++;
                        } else {
                            singleProjectAllocation--;
                        }

                    }
                    else {
                        if (Projectdatacount > 0) {
                            multipleAssignProject_Array.push(resource_Array[k]);
                            singleProjectAllocation--;
                        }
                    }

                }

                if (resource_Array[k].Work_Location != result[j].Work_Location) {
                    Locationdatacount++;
                }
                allocation.push(resource_Array[k].Allocation);
            }

        }
        var minStartDate = Math.min.apply(Math, array_d1);
        minStartDate = formateRefinedDate(minStartDate);
        var maxEndDate = Math.max.apply(Math, array_d2);
        maxEndDate = formateRefinedDate(maxEndDate);
        var allocationPer = Math.max.apply(Math, allocation);
        var project_Name = (Projectdatacount > 0 && singleProjectAllocation != 1) ? "Multiple Assignment" : array2[0].ProjectName;
      
        var Project_Loaction = Locationdatacount > 0 ? "Multiple Location" : array2[0].Work_Location;
        if (Allocationvalue != "" && Allocationvalue != undefined) {
            if (100 > (100 - parseInt(allocationPer)))
                refined_array.push({
                    "EmployeeID": array2[0].EmployeeID,
                    "ResourceFullName": array2[0].ResourceFullName,
                    "Designation": array2[0].Designation,
                    "ProjectName": project_Name,
                    "Startdatetime": minStartDate,
                    "Finishdatetime": maxEndDate,
                    "Allocation": allocationPer,
                    "Work_Location": Project_Loaction,
                    "Employee_status": array2[0].Employee_status,
                    "Work_Email": array2[0].Work_Email,
                    "OrganisationDOJ": array2[0].OrganisationDOJ,
                    "ProjectCode": array2[0].ProjectCode,
                    "SubPractice": array2[0].SubPractice,
                    "BaseLocation": array2[0].BaseLocation,
                    "ProjectManagerName": array2[0].ProjectManagerName
                })
        } else {

            refined_array.push({
                "EmployeeID": array2[0].EmployeeID,
                "ResourceFullName": array2[0].ResourceFullName,
                "Designation": array2[0].Designation,
                "ProjectName": project_Name,
                "Startdatetime": minStartDate,
                "Finishdatetime": maxEndDate,
                "Allocation": allocationPer,
                "Work_Location": Project_Loaction,
                "Employee_status": array2[0].Employee_status,
                "Work_Email": array2[0].Work_Email,
                "OrganisationDOJ": array2[0].OrganisationDOJ,
                "ProjectCode": array2[0].ProjectCode,
                "SubPractice": array2[0].SubPractice,
                "BaseLocation": array2[0].BaseLocation,
                "ProjectManagerName": array2[0].ProjectManagerName
            })
        }


    }
    var result_denied = [];
    var items2 = denieddate_Array;
    for (var item2, i = 0; item2 = items2[i++];) {
        var name = item2.EmployeeID;
       
        if (!(name in lookup)) {
            lookup[name] = 1;
            result_denied.push(item2);
        }
    }
    denieddate_Array = result_denied;
    if (denieddate_Array.length > 0) {
        refined_array.push.apply(refined_array, denieddate_Array);
    }
    if (future_Array.length > 0) {
        refined_array.push.apply(refined_array, future_Array);
    }
    //  }
    // });
    return refined_array;
}