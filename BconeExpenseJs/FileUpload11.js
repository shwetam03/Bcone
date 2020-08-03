    var NewItemID = "";
	var newFileName="";
    function CreateFolder(ItemID, docElement, doctype, GateaBRDNo) {
		//alert(docElement);
        NewItemID = ItemID;
        try {
            var context = SP.ClientContext.get_current(); //gets the current context
            var web = context.get_web(); //gets the web object
            var list = web.get_lists(); //gets the collection of lists
            var targetList = list.getByTitle("BconeBillAttachment");
            var itemCreation = new SP.ListItemCreationInformation();
            itemCreation.set_folderUrl('/sites/Dev/BconeBillAttachment');//URL of the folder
            itemCreation.set_underlyingObjectType(SP.FileSystemObjectType.folder);
            itemCreation.set_leafName(ItemID); // pass the id from the url
            var folderItem = targetList.addItem(itemCreation);
            folderItem.update();
            context.load(folderItem);
        
            context.executeQueryAsync(function (sender, arges) {
                uploadDocument(docElement, doctype, GateaBRDNo); 
            },
            
            function (sender, arges) {
                var catcherr = arges.get_message();
                if (catcherr.indexOf('already exists.')) {
                    uploadDocument(docElement, doctype, GateaBRDNo);
                   
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


    }



    function uploadDocument(docElement, docType, GateaBRDNo) {
       
        if (!window.FileReader) {
            alert("This browser does not support the HTML5 File APIs");
            return;
        }

        var element = docElement;
		//alert('element'+element);
        var file = element.files[0];
        var parts = element.value.split("\\");
        var fileName = parts[parts.length - 1];
        var reader = new FileReader();
        reader.onload = function (e) {
			 e.preventDefault();
            addItem(e.target.result, fileName, docType, GateaBRDNo);
        }
        reader.onerror = function (e) {
            alert(e.target.error);
        }
        reader.readAsArrayBuffer(file);


        function addItem(buffer, fileName, docType, GateaBRDNo) {
            var call = uploadDocumentFile(buffer, fileName);
            call.done(function (data, textStatus, jqXHR) {
                var call2 = getItem(data.d);
              
                call2.done(function (data, textStatus, jqXHR) {
                    var item = data.d;
					//alert('item'+item);
                    var callUpdate = updateItemFields(item, docType, GateaBRDNo,'chk');
                    
                    callUpdate.done(function (data, textStatus, jqXHR) {
                        // var div = jQuery("#message");
                        //div.text("Item added");
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
                  "{0}/_api/web/GetFolderByServerRelativeUrl('/sites/Dev/BconeBillAttachment/" + NewItemID + "')/Files/Add(url='{1}', overwrite=true)",
                _spPageContextInfo.webAbsoluteUrl, fileName);
            var call = jQuery.ajax({
                url: url,
                type: "POST",
                data: buffer,
                processData: false,
                headers: {
                    Accept: "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val()
                },
				success: function (data, status) {
                },
                error: function (arr, error) {
                    alert('Error in uploading..!!');
                }
            });

            return call;
        }

        function getItem(file) {
            var call = jQuery.ajax({
                url: file.ListItemAllFields.__deferred.uri,
                type: "GET",
                dataType: "json",
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


        function updateItemFields(item, documentType, GateaBRDNo,idchk) {
			
			
			//alert('item'+item);
			//alert('documentType'+documentType);
			//alert('GateaBRDNo'+GateaBRDNo);
			alert('idchk'+idchk);

            var call = jQuery.ajax({
                url: _spPageContextInfo.webAbsoluteUrl +
                    "/_api/Web/Lists/BconeBillAttachment/getByTitle('nilmifolder'),
                type: "POST",
                data: JSON.stringify({
                    "__metadata": { type: "SP.Data.BRDDocumentsItem" },
                    BRDNo: GateaBRDNo,
                    DocumentType: documentType,
					ExpenseItemId:idchk
                }),
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
				 FinalSubmitMail(docType);
                },
                error: function (arr, error) {
                    alert('Error in updating id..!!');
                }
            });
            return call;
        }      
    }