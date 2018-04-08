//website version

var allEvents = [];

//may not be necessary
var checkNoRep = false;
var checkEvents = false;

console.log("setting up!");

window.fbAsyncInit = function() {
  FB.init({
    appId      : '168464403873738',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.12'
  });
    
  FB.AppEvents.logPageView();   
  
  //get login status
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      console.log('Logged in.');
      console.log(response);
      //console.log(xfbml);
      
      //remove login button
      //var elem = document.querySelector('#logButt');
      //elem.style.display = 'none';

      //this could also work instead of removeChild
      //elem.parentNode.removeChild(elem);

      //do I need to reset allEvents with something like allEvents = [] here?

      //get events
      FB.api(
        '/me/events/not_replied',
        'GET',
        {since:'today'},//{"fields":"rsvp_status, event_rsvp"},
        function(response) {
            //console.log(response);
            sortEvents(response.data, "not_replied");
        }
      );

      //get events
      FB.api(
        //'/me',
        '/me/events',
        'GET',
        //{"fields":"events", "since":"today"}, //removed id,name from the search fields
        {since:'today'},
        function(response) {
            sortEvents(response.data, "events");
        }
      );
    }
    else {

        //make sure login button is visible
        //remove login button
        //var elem = document.querySelector('#logButt');
        //elem.style.display = 'initial';
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


function makeUL(array) {

    //clear an element

    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        //reverse order
        var r = array.length - i - 1;

        var listItem = array[r].start_time.substring(0, 10) + " " + array[r].start_time.substring(11, 24) + ", " + array[r].name;

        listItem = listItem + ", " + array[r].placename; //the object key placename corresponds to place.name in the FB api. (js didn't like the "." in the name)

        var a = document.createElement('a');
        a.setAttribute('href', 'https://www.justthecalendar.com/event.html?id=' + array[r].id);
        a.innerHTML = listItem;

        item.appendChild(a);
        // apend the anchor to the body
        // of course you can append it almost to any other dom element
        //.getElementsByTagName('body')[0].appendChild(a);

        // Set its contents:
        //item.appendChild(document.create('a');//href(listItem));// array[i].start_time + ", " + array[i].name

        //var link = document.createElement('a');
        //link.setAttribute('href', 'https://www.justthecalendar.com';
        //var test = 234432;
        //item.setAttribute("href", "https://www.justthecalendar.com/");
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

function loginButton() {

  //FB.login should only be called on button click to avoid pop-up blockers
  FB.login(function(response) {
    console.log(response);
    //should i refresh the page?
      location = location;

    }, {
    scope: 'user_events, rsvp_event', 
    return_scopes: true
  });
};

function diagnostics(){

  //check if user is logged in

  //check permissions
  FB.api(
    '/me/permissions',
    'GET',
    function(response){
      console.log(response);

      //if response != correct permission print something
    }
  );

  //check event calls

};

function sortEvents(array, string){

  console.log("sorting: " + string + " returned " + array.length);


  for (var e = 0; e < array.length; e++){

    var eSt = array[e].start_time;
//!str || 0 === str.length
    if (array[e].name || array[e].name.length != 0 ){
      var eN = array[e].name;
    } else {
      eN = "";
    }

    //this is glitchy -- didn't work for rose
    if (array[e].place.name !== undefined){// || 0 === array[e].place.name.length){
      var ePn = array[e].place.name;
    } else {
      var ePn = "";
    }

    if (array[e].rsvp_status !== undefined){// || 0 === array[e].place.name.length){
      var rsvpStat = array[e].rsvp_status;
    } else {
      var rsvpStat = "";
    }

    if (array[e].id !== undefined){// || 0 === array[e].place.name.length){
      var eventId = array[e].id;
    } else {
      var eventId = "";
    }
    //var eAs = ; //response

    var thisEvent = {start_time: eSt, name: eN, placename: ePn, rsvp_status: rsvpStat, id: eventId};
    allEvents.push(thisEvent);
  };
      //console.log(allEvents);


  //filter by month, sort each month by day, then sort everything by year for output

  var sortEvents = [];
  
  //sort by month
  var newMonth = true;
  var storeMonths = [];
  storeMonths[0] = []; //init as an array - needed?

  if(allEvents.length > 0){

    //cycle through all events
    for (var ye = 0; ye < allEvents.length; ye++){
      //initialize it
      if(ye == 0){
        storeMonths[0][ye]=allEvents[ye]; 
      } else {
        //check it against all months

        for(var ay = 0; ay < storeMonths.length; ay++){
          if (allEvents[ye].start_time.substring(0, 4) == storeMonths[ay][0].start_time.substring(0, 4)){
            newMonth = false;
            storeMonths[ay].push(allEvents[ye]); //if it's the same year add it
            //break;
          };
        };
         //if it doesn't match an existing month, store it
        if (newMonth == true){
          //console.log("new month!");
          storeMonths[storeMonths.length-1][0] = allEvents[ye];
        };
      };
      newMonth = true; //reset
    };

    //sort days in the months
    for (var sD = 0; sD < storeMonths.length; sD ++){
      //sort by day
      //var sortDays = [];
      storeMonths[sD] = storeMonths[sD].sort(function(a, b){
        var dateA=new Date(parseInt(a.start_time.substring(8, 10))), dateB=new Date(parseInt(b.start_time.substring(8, 10))); //must convert to int
        return dateB-dateA; //sort by date ascending
      });
    };

    //loop through and combine everything
    for(var addIt = 0; addIt < storeMonths.length; addIt++){

      for(var getItem = 0; getItem <storeMonths[addIt].length; getItem++){
        sortEvents.push(storeMonths[addIt][getItem]);
      };
    };

    //console.log(sortEvents);

    /*
    //sort by year
    sortEvents = sortEvents.sort(function(a, b){
    var dateA=new Date(a.start_time.substring(0, 4)), dateB=new Date(b.start_time.substring(0, 4));
    return dateB-dateA; //sort by date ascending
    });*/

  };

  var upEl = document.getElementById('upcoming');

  //remove duplicates
  while (upEl.hasChildNodes()) {   
    upEl.removeChild(upEl.firstChild);
  }
  upEl.appendChild(makeUL(sortEvents));
};

//convert time from this format 13:30 to this format 13.5 for sorting
function convertTime(time){
  var minutes = time.substring(16, 19);
  var hours = time.substring(13, 15);

  hours += (parseFloat(minutes)/ 60.0);
  console.log("converted time " + hours);

  return hours;
};