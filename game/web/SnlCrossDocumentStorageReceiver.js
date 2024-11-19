window.addEventListener('message', function(e)
{
	if( e.data == null )
	{
		return;
	}
	
	if( e.data.Key == null )
	{
		return;
	}
	
	var Target = document.getElementById("game_main").contentWindow.frames;
	var Value = null;
	
	// console.log( e.data.Type + ":" + e.data.Key );
	
  	switch (e.data.Type) 
  	{
    	case "SnlCrossDocumentStorageRead_Request":
    		Value = localStorage.getItem( e.data.Key );
    		if( Value != null )
    		{
    			Value = btoa( encodeURIComponent( Value ) );
    		}
      	break;
      	
      	case "SnlCrossDocumentStorageWrite_Request":
      		if( e.data.Value != null )
      		{
	      		Value = decodeURIComponent(atob(e.data.Value));
	      	}
      		localStorage.setItem( e.data.Key, Value );
      	break;
      	
      	case "SuApiCrossDocumentLoginCheck_Request":
      		$.ajax({
				type: "post",
				url: "../../ajax/auth/info_token.json",
				success: function (jsondata) 
				{
				    Target.postMessage(
				    {
				    	Type : "SuApiCrossDocumentLoginCheck_Response",
				    	isSuccess : true,
				    	Value : jsondata
				    }, "*" );
				},
				error: function (request, status, error) {
				    Target.postMessage(
				    {
				    	Type : "SuApiCrossDocumentLoginCheck_Response",
				    	isSuccess : false,
				    	Request: request,
				    	Status: status,
				    	Error: error
				    }, "*" );
				}});
		return;
      	
      	default:
      		return;
    }
    
    var ResponseType = e.data.Type.replace("_Request", "_Response");
    
    Target.postMessage(
    {
    	Type : ResponseType,
    	Key  : e.data.Key,
    	Value : Value
    }, "*" );
    
    
} );
