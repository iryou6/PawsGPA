var text;
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    text = request.source;
    parseHTML(text);
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}
function parseHTML(myText){
		var classTR = /<TR>(\s*?\S*?)*?<\/TR>/gi; 
		var classsect=myText.match(classTR);
		var myArray = classsect;
// 		if (myArray[0].match(/pldefault/g).length>1){
// 		document.getElementById('message').textContent = myArray[0];
// }
		var gpaInfo=makeDict(myArray);
		// document.getElementById('message').textContent = gpaInfo;
		formatCheckBoxes(gpaInfo);	


// 	document.getElementById('getClasses').textContent = "Get courses!";
//         if (myText !== "parsing"){
//                 document.getElementById("message").textContent = "";
//                 var re =  />Instructor\&nbsp\;\&nbsp\;(\s*\S*)*/i; 
// 		var classSect = myText.match(re);
// 		var classTR = /<TR>(\s*?\S*?)*?<\/TR>/gi;  //(\S*\s*)*\<tr\/\>/g;
//                 var myArray = classSect[0].match(classTR);
// 		var gpaInfo = makeDict(myArray);
//                 formatCheckBoxes(gpaInfo);	
//                 changeButton();
//                 return gpaInfo;
//         };
};
function makeDict(myArray){
	//var gpaInfo = new Array();
	var re, sub, title, params, credits, Grade, gradeNum, creditsNum, subNum;
        var gpaInfo=[];
        var useless=[];
        var temp;
        var n = 0;
        var m=0;
	      for (i=0; i<myArray.length; i++){
	        temp=myArray[i];
                    if (checkvalid(temp)){
                        // gpaInfo[n]=temp;
                        // myArray[i] = myArray[i].replace("amp;","")
                        re = /"dddefault">(\S*?\s*?)*?<\/td>/gi;
                        params = temp.match(re);
                        sub = params[0].match(/>(\S*?\s*?)*?</i);
                        sub = sub[0].replace(">","").replace("<","");
                        subNum = params[1].match(/>(\S*?\s*?)*?</i);
                        subNum = subNum[0].replace(">","").replace("<","");
                        title = params[4].match(/>(\S*?\s*?)*?</i);
                        title = title[0].replace(">","").replace("<","");
                        Grade = params[5].match(/>(\S*?\s*?)*?</i);
                        Grade = Grade[0].replace("\>","").replace("<","");
                        // // gradeNum = gradeToNum(letterGrade);
                        credits = params[6].match(/rightaligntext">(\S*?\s*?)*?</i);
                        credits = credits[0].replace("rightaligntext\"\>","").replace("<","");
                        creditsNum = parseFloat(credits);
                        gpaInfo[n] = [sub,subNum,title,Grade,creditsNum];
                        // gpaInfo[n]=creditsNum;
                        n = n+1;
                    }
                    else{
                      useless[m]=2;
                      m=m+1;
                    }
	}
	return gpaInfo;
}
function checkvalid(temp){
  if((temp.match(/dddefault/g)|| []).length>7){
    return true;
  }
  else{
    return false;
  }
}
function formatCheckBoxes(gpaInfo){
    for (i = 0; i<gpaInfo.length; i++){
        var div = document.createElement("div");
        var id = gpaInfo[i][0]+gpaInfo[i][1];
        div.setAttribute('id',id);
        div.style.display = "block";
        document.getElementById("message").appendChild(div);
        var pair = gpaInfo[i][0] + " " + gpaInfo[i][1]+" - " + gpaInfo[i][2];
        var label= document.createElement("label");
        var description = document.createTextNode(pair);
        var checkbox = document.createElement("input");   
        checkbox.type = "checkbox";    // make the element a checkbox
        checkbox.name = "slct[]";      // give it a name we can check on the server side
        checkbox.value = pair;         // make its value "pair"
        checkbox.setAttribute('id',"ch"+i)
        label.appendChild(checkbox);   // add the box to the element
        label.appendChild(description);// add the description to the element

        // add the label element to your div
        document.getElementById(id).appendChild(label);
    };

}
window.onload = onWindowLoad;
