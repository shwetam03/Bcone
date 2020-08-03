productionName = "pwa";
ajaxProductionName ="ppmprod";

popUpMessage = {
	CusterDetailsUpdate: "Customer Details Successfully Update",
	PaymentAdd: "Payment Terms Added Successfully !",
	PaymentUpdate:"Payment Terms Updated Successfully !",
	InvoiceReportAdd:"Invoice Report Added Successfully !",
	InvoiceReportUpdate:"Invoice Report Updated Successfully !"
};

ValidationMsg = {
		errorRadioBtn:"Please select IsActives Option",
		errorPaymentTermsDesc:"Please enter  payment terms description",
		errorPaymentTermName:"Please enter payment terms name",
		errorInvoiceLayDesc:"Please enter invoice report layouts description",
		errorInvoiceRepotName:"Please enter invoice report layout name",
		errorSpecialCharName:"Max 250 characters and these special characters are not allowed !@#$%^&*()+=[]';/{}|\":<>?",
		errorSpecialCharDesc:"Max 500 characters and these special characters are not allowed !@#$%^&*()+=[]';/{}|\":<>?"
}


function Get_CustomerListUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/bcone/Get_CustomerList";
}
function Update_CustomersUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/Bcone/Update_Customers";
}

function GetInvoiceReportLayoutMasterUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/BCONEReport/GetInvoiceReportLayoutMaster";
}
function SubmitInvoiceReportLayoutMasterUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/BCONEReport/SubmitInvoiceReportLayoutMaster";
}
function GetPaymentTermsMasterUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/BCONEReport/GetPaymentTermsMaster";
}

function SubmitPaymentTermsMasterUri()
{
	
	return "https://"+ajaxProductionName+".bcone.com/api/BCONEReport/SubmitPaymentTermsMaster";
}


