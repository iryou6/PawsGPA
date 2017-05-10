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
		if (myArray[0].match(/pldefault/g).length>1){
		document.getElementById('message').textContent = myArray[0];
}
		var gpaInfo = makeDict(myArray);

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
	var re, sub, title, params, credits, letterGrade, gradeNum, creditsNum, subNum;
        var gpaInfo = [];
        var n = 0;
	for (var i=0; i<myArray.length; i++){
                if (myArray[i].test("darkblue") > -1){
                    if (myArray[i].match(/tr>/ig).length <=2){
                        myArray[i] = myArray[i].replace("amp;","")
                        re = /"dddefault">(\S*?\s*?)*?<\/td>/gi;
                        params = myArray[i].match(re);
                        sub = params[0].match(/>(\S*?\s*?)*?</i);
                        sub = sub[0].replace(">","").replace("<","");
                        subNum = params[1].match(/>(\S*?\s*?)*?</i);
                        subNum = subNum[0].replace(">","").replace("<","");
                        title = params[2].match(/text\">(\S*?\s*?)*?</i);
                        title = title[0].replace("text\"\>","").replace("<","");
                        letterGrade = params[3].match(/text\">(\S*?\s*?)*?</i);
                        letterGrade = letterGrade[0].replace("text\"\>","").replace("<","");
                        gradeNum = gradeToNum(letterGrade);
                        credits = params[4].match(/text\">(\S*?\s*?)*?</i);
                        credits = credits[0].replace("text\"\>","").replace("<","");
                        creditsNum = parseFloat(credits);
                        gpaInfo[n] = [sub,subNum,title,gradeNum,creditsNum];
                        n = n+1;
                    }
                }
	}
	return gpaInfo;
}
window.onload = onWindowLoad;
