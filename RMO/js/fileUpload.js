 var NewItemID = "";
    var newFileName = "";
	var returnVlue = "";
    function CreateFolder(ItemID, docElement, doctype, EmpNumber) {
        NewItemID = ItemID;
        try {
            var context = SP.ClientContext.get_current(); //gets the current context
            var web = context.get_web(); //gets the web object
            var list = web.get_lists(); //gets the collection of lists
            var targetList = list.getByTitle("EmployeeProfileDocument");
            var itemCreation = new SP.ListItemCreationInformation();
            itemCreation.set_folderUrl('/sites/pwa/EmployeeProfileDocument');//URL of the folder
            itemCreation.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreation.set_leafName(ItemID); // pass the id from the url
            var folderItem = targetList.addItem(itemCreation);
            folderItem.update();
            context.load(folderItem);

            context.executeQueryAsync(function (sender, arges) {
                uploadDocument(docElement, doctype, EmpNumber);
            },

            function (sender, arges) {
                var catcherr = arges.get_message();
                if (catcherr.indexOf('already exists.')) {
                    uploadDocument(docElement, doctype, EmpNumber);

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
        catch (ex) {
            alert(ex.message());
            var Confirm = 1;
            if (Confirm) {
                window.location = window.location.href;
            }
        }
		return returnVlue;

    }



    function uploadDocument(docElement, docType, EmpNumber) 
	{

        if (!window.FileReader) {
            alert("This browser does not support the HTML5 File APIs");
            return;
        }

        var element = docElement;
        var file = element.files[0];
        var parts = element.value.split("\\");
        var fileName = parts[parts.length - 1];

        var reName = fileName.split(".")[0];
		var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
        var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        var dateTime = date + ' ' + time;
        reName = reName + " " + dateTime;
        var extension = fileName.split(".")[1];
        fileName = reName + "." + extension;

        var reader = new FileReader();
        reader.onload = function (e) {
            e.preventDefault();
            addItem(e.target.result, fileName, docType, EmpNumber);
        }
        reader.onerror = function (e) {
            alert(e.target.error);
        }
        reader.readAsArrayBuffer(file);


        function addItem(buffer, fileName, docType, EmpNumber) {
            var call = uploadDocumentFile(buffer, fileName);
            call.done(function (data, textStatus, jqXHR) {
                var call2 = getItem(data.d);

                call2.done(function (data, textStatus, jqXHR) {
                    var item = data.d;
                    var callUpdate = updateItemFields(item, docType, EmpNumber);

                    callUpdate.done(function (data, textStatus, jqXHR) {
                        // var div = jQuery("#message");
                        //div.text("Item added");
						//alert("File upload successfully");
						$(".alert-main1").show();
						$("#okPopupMsg").text("File upload successfully");
						returnVlue=1;
                    });
                    callUpdate.fail(function (jqXHR, textStatus, errorThrown) {
                        failHandler(jqXHR, textStatus, errorThrown);
                    });
                });
                call2.fail(function (jqXHR, textStatus, errorThrown) {
                    failHandler(jqXHR, textStatus, errorThrown);
                });
            });
            call.fail(function (jqXHR, textStatus, errorThrown) {
                alert("Document With Samename Already Exist");
                failHandler(jqXHR, textStatus, errorThrown);
            });

        }
        function uploadDocumentFile(buffer, fileName) {

            var url = String.format(
                  "{0}/_api/web/GetFolderByServerRelativeUrl('/sites/pwa/EmployeeProfileDocument/" + NewItemID + "')/Files/Add(url='{1}', overwrite=true)",
                _spPageContextInfo.webAbsoluteUrl, fileName);
            var call = jQuery.ajax({
                url: url,
                type: "POST",
                data: buffer,
                processData: false,
                async: false,
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                },
                success: function (data, status) {
					//alert('File upload successfully');
					
                },
                error: function (arr, error) {
                    alert('Error in updating id..!!');
                }
            });

            return call;
        }

        function getItem(file) {
            var call = jQuery.ajax({
                url: file.ListItemAllFields.__deferred.uri,
                type: "GET",
                dataType: "json",
                async: false,
                headers: {
                    Accept: "application/json;odata=verbose"
                }
            });

            return call;
        }

        function failHandler(jqXHR, textStatus, errorThrown) {
            var response = JSON.parse(jqXHR.responseText);
            var message = response ? response.error.message.value : textStatus;
            alert("Call failed. Error: " + message);
        }


        function updateItemFields(item, DocumentType, EmpNumber) {

            var call = jQuery.ajax({
                url: _spPageContextInfo.webAbsoluteUrl +
                    "/_api/Web/Lists/getByTitle('EmployeeProfileDocument')/Items(" +
                    item.Id + ")",
                type: "POST",
                data: JSON.stringify({
                    "__metadata": { type: "SP.Data.EmployeeProfileDocumentItem" },
                    EmployeeId: EmpNumber,
                    DocumentType: DocumentType
                }),
                async: false,
                headers: {
                    Accept: "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "IF-MATCH": item.__metadata.etag,
                    "X-Http-Method": "MERGE"
                },
                success: function (data, status) {
                    //console.log(data);
                    // alert('Id updated.......');
                    //FinalSubmitMail(docType);
                },
                error: function (arr, error) {
                    alert('Error in updating id..!!');
                }
            });
            return call;
        }
    }
