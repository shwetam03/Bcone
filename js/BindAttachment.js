<script type="text/javascript" src="https://bristleconeonline.sharepoint.com/sites/pwa/SiteAssets/js/3.1.1-jquery.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
$("input[title='Practice']").attr('disabled', 'disabled');
$("input[title='Region']").attr('disabled', 'disabled');
$("input[title='Title Required Field']").attr('disabled', 'disabled');
GetAllAttachments();
	});

function GetParentID()
{
var Item=0;
var itemID=window.location.href.substring(window.location.href.indexOf('?ID=')+4,window.location.href.indexOf('&'));
 debugger;
var url =_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/GetByTitle('Deal Desk Title')/Items('"+parseInt(itemID)+"')?$Select=DDMID";
$.ajax({
        url: url,
        type: "GET",
       async: false,
        headers: {
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
var result=data.d;
Item=result.DDMID;
           debugger;
        },

        error: function (error) {

            alert("error");
        }
    });
return Item;
}

function GetAllAttachments()
{
var itemID=GetParentID();//window.location.href.substring(window.location.href.indexOf('?ID=')+4,window.location.href.indexOf('&'));
var getHost=window.location.href.substring(0,window.location.href.indexOf('.com')+4)+'/';
var url =_spPageContextInfo.webAbsoluteUrl+"/_api/web/lists/GetByTitle('Deal_Desk_Master')/items('"+parseInt(itemID)+"')/AttachmentFiles?$Select=ServerRelativeUrl,FileName";
var getHTMLRow='';
$.ajax({
        url: url,
        type: "GET",
       async: false,
        headers: {
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
        success: function (data) {
var result=data.d.results;
getHTMLRow='<tr><td>Attachments </td><td>';
for(var i=0;i<result.length;i++){
	var FileUrl=getHost+result[i].ServerRelativeUrl.replace(/ /gi,'%20');
getHTMLRow=getHTMLRow+'<a href='+FileUrl+' target="_blank">'+result[i].FileName+'</a><br />';
//console.log(getHost+result[i].ServerRelativeUrl);
}
getHTMLRow=getHTMLRow+'</td></tr>';
$('.ms-formtable').append(getHTMLRow);
        },

        error: function (error) {

            alert("error");
        }
    });
}
function PreSaveAction()
{
var getComments= $("textarea[title='Comments']").val().trim();
if(getComments=="")
{
debugger;
if($('select[title=Status] option:selected').text()=="Approved")
{
alert('Please provide comments');
return false;
}
else if($('select[title=Status] option:selected').text()=="Rejected")
{
alert('Please provide comments');
return false;
}
else
{
return true;
}
}
else
{
return true;
}
}
</script>