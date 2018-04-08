  //another way to get variable
  //var id = window.location.search;
  //console.log(id);

//get URL variable
 var decode = getVar( 'id' );
 console.log("event id: " + decode);


function getVar(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}


window.fbAsyncInit = function() {
  FB.init({
    appId      : '168464403873738',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.12'
  });
    
  FB.AppEvents.logPageView();   
  
  var searchId = '/' + decode;
  //get login status
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {

    //console.log("about to search " + getEvent);
      //get events
      FB.api(
	    //'/me/events/' + decode,
	    searchId,
	    'GET',
	    //{},
	    function(response) {
	        console.log(response);
	        console.log(decode);
	    }
	  );
    }
  });
};


(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));