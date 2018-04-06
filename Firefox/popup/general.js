
getTodaysDate();

//filter by date
function getTodaysDate(){
  var today = new Date();
  //var dd = today.getDate();
  //var mm = today.getMonth()+1; //January is 0!
  //var yyyy = today.getFullYear();

  console.log("Todays date " + today.toDateString());
  
  var tD = document.getElementById("getDate");

  //var newDate = document.createElement("p");
  var dateNode = document.createTextNode(today.toDateString());     // Create a text node
  //newDate.appendChild(dateNode);                               
  tD.appendChild(dateNode);
};