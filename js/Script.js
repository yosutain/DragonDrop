var myApp = angular.module('myApp',['ngResource'])
.controller('myCtrl', myCtrl)
.controller('accessCtrl', accessCtrl)
.service('flowMoveService',flowMoveService)
.service('counterService',counterService)
.service('accessService',accessService)
.service('templateService',templateService)
.service('questionService',questionService)
.service('previewService',previewService)
.service('columnService',columnService)
.service('linkService',linkService)
.service('flowChartService',flowChartService)
.service('userService',userService)
.factory('accessFactory',accessFactory)
.factory('userFactory',userFactory)

function myCtrl($scope, columnService, linkService, flowMoveService) {
	columnService.createFirst($scope);
	linkService.link();
	$scope.keydown = function(ev){
		if(document.getElementById('flowChart').className == "scrollableClass"){
			var scrollObject = "0";
			if (document.getElementById('flowChart').children[0].getElementsByTagName("div").length > 0){
				scrollObject = document.getElementById('flowChart').children[0].getElementsByTagName("div")[0].getBoundingClientRect();
			}
			if(ev.keyCode == 38) {
				flowMoveService.flowUp(scrollObject);
			}
			if(ev.keyCode == 40) {
				flowMoveService.flowDown(scrollObject);
			}
			if(ev.keyCode == 39) {
				flowMoveService.flowLeft(scrollObject);
			}
			if(ev.keyCode == 37) {
				flowMoveService.flowRight(scrollObject);
			}
			document.getElementById("myCanvas").innerHTML = "";
			linkService.link();
		} else if(document.getElementById('receiverContainer').className == "scrollableClass"){
			var scrollObject = "0";
			if (document.getElementById('receiverContainer').getElementsByClassName("activeReceiver").length >= 0){
				scrollObject = document.getElementsByClassName("activeReceiver")[0].getElementsByTagName("li")[0].getBoundingClientRect();
			}
			if(ev.keyCode == 38) {
				document.getElementById('receiverContainer').getElementsByClassName("activeReceiver")[0].scrollTop -= scrollObject.height;
			}
			if(ev.keyCode == 40) {
				document.getElementById('receiverContainer').getElementsByClassName("activeReceiver")[0].scrollTop += scrollObject.height;
			}
		}
	}
}

function accessCtrl($scope, userService) {
	$scope.newUserLoggedIn = function () {
		$scope.myUserText = userService.getUserInfo();
	};
}

function flowMoveService(counterService) {
	var myVariable = counterService.getScroll();
	this.flowUp = function(scrollObject) {
		var flowChart = document.getElementById('flowChart').children;
		for (var i=0; i<flowChart.length; i++) {
			flowChart[i].scrollTop -= +scrollObject.height * 2;
			counterService.setVerticalScroll(flowChart[i].scrollTop);
		}
	}		
	this.flowDown = function(scrollObject) {
		var flowChart = document.getElementById('flowChart').children;
		var longestCol = 1;
		for (var i=0; i<flowChart.length; i++) {
			if (flowChart[i].getElementsByTagName("div").length > longestCol) {
				longestCol = flowChart[i].getElementsByTagName("div").length;
			}
		}
		for (var i=0; i<flowChart.length; i++) {
			while (flowChart[i].getElementsByTagName("div").length < longestCol) {
				flowChart[i].innerHTML += '<div class="emptyRow"></div>';
			}
			flowChart[i].scrollTop += +scrollObject.height * 2;
			counterService.setVerticalScroll(flowChart[i].scrollTop);
		}
	}
	this.flowLeft = function(scrollObject) {
		var flowChart = document.getElementById('flowChart').children;
		if (myVariable >= (8 - flowChart.length)) {
			counterService.decScroll();
			myVariable --;
		}
		for (var i=0; i<flowChart.length; i++) {
			flowChart[i].style.left = ((i + myVariable) * 5) + "vw";
		}
	}
	this.flowRight	= function(scrollObject) {
		var flowChart = document.getElementById('flowChart').children;
		if (myVariable < (flowChart.length - 8)) {
			counterService.incScroll();
			myVariable ++;
		}
		for (var i=0; i<flowChart.length; i++) {
			flowChart[i].style.left = ((i + myVariable) * 5) + "vw";
		}
	}
	this.update = function() {
		var myVerticalScroll = "0"
		var scrollObject = "0";
		var scrollDowns = "0"
		myVerticalScroll = counterService.getVerticalScroll();
		if (document.getElementById('flowChart').children[0].getElementsByTagName("div").length > 0) {
			scrollObject = document.getElementById('flowChart').children[0].getElementsByTagName("div")[0].getBoundingClientRect();
		}
		if (typeof scrollObject.height != "undefined") {
			scrollDowns = Math.round(myVerticalScroll / (scrollObject.height * 2));	
			for (var i=0; i<scrollDowns; i++) {
				console.log(scrollDowns);
				this.flowDown(scrollObject);					
			}
		}
	}			
}

function counterService() {
	var currentCount = 0;
	var myHorizontalScroll = 0;
	var myVerticalScroll = 0;
	this.inc = function() {
    	currentCount += 1;
    }
    this.get = function() {
    	return currentCount;
    }
	this.getScroll = function() {
    	return myHorizontalScroll;
    }
	this.incScroll = function() {
    	myHorizontalScroll += 1;
    }
	this.decScroll = function() {
    	myHorizontalScroll -= 1;
    }
	this.getVerticalScroll = function() {
    	return myVerticalScroll;
    }
	this.setVerticalScroll = function(newScroll){
    	myVerticalScroll = newScroll;
    }
}

function accessService($resource) {
	return $resource('http://design-jostein.rhcloud.com/DragonDrop/api.php/:table/:id', {});
}

function templateService() {
	var template = "";
	this.template1a = function(myCounter, titleText, inputText) {
		if (typeof titleText == "undefined") {
			titleText = "myRating";
		}
		if (typeof inputText == "undefined") {
			inputText = 3;
		}
		template =
		'<li value="'+myCounter+'">'+
			'<input type="text" ng-model="titleText'+myCounter+'" ng-init="titleText'+myCounter+'=\''+titleText+'\'">'+
			'</input>'+
									
			'<input type="number" min="3" max="10" ng-model="inputText'+myCounter+'" ng-init="inputText'+myCounter+'='+inputText+'">'+
			'</input>'+
			'<button hide-me>'+
				'OK'+
			'</button>'+
		'</li>';
		return template;
	}

	this.template1b = function(myCounter) {
		template =
		'<li class="firstContentObject contentObject">'+
			'<p show-me value="'+myCounter+'">'+
				'{{titleText'+myCounter+'}}'+
			'</p>'+
		
			'<p>'+
				'{{inputText'+myCounter+'}}'+
			'</p>'+
			'<div class="moveBox" movable> | | | </div>'+
		'</li>';
		return template;
	 }
	 
	 this.template2a = function(myCounter, inputText) {
		if (typeof inputText == "undefined") {
			inputText = "myQuestion";
		}
		template =
		'<li value="'+myCounter+'">'+
			'<input type="text" ng-model="titleText'+myCounter+'" ng-init="titleText'+myCounter+'=\''+inputText+'\'">'+
			'</input>'+

			'<button hide-me>'+
				'OK'+
			'</button>'+
		'</li>';
		return template;
	}
	
	this.template2b = function(myCounter) {
		template =
		'<li  class="secondContentObject contentObject">'+
			'<p show-me value="'+myCounter+'">'+
				'{{titleText'+myCounter+'}}'+
			'</p>'+
			'<div class="moveBox" movable> | | | </div>'+
		'</li>';
		return template;
	}
	 
	 this.template3a = function(myCounter, titleText, inputText, radioText) {
		if (typeof titleText == "undefined") {
			titleText = "Thank You!";
		}
		if (typeof inputText == "undefined") {
			inputText = "Share your result";
		}
		if (typeof radioText == "undefined") {
			radioText = "send via email";
		}
		template =
		'<li value="'+myCounter+'">'+
			'<input type="text" ng-model="titleText'+myCounter+'" ng-init="titleText'+myCounter+'=\''+titleText+'\'">'+
			'</input>'+
			
			'<input type="text" ng-model="inputText'+myCounter+'" ng-init="inputText'+myCounter+'=\''+inputText+'\'">'+
			'</input>'+
									
			'<input id="radio1id'+myCounter+'" type="radio" ng-model="radio'+myCounter+'" value="send via email" ng-init="radio'+myCounter+'=\''+radioText+'\'">'+
			'</input>'+
			
			'<label for="radio1id'+myCounter+'">'+
				'send via email'+
			'</label>'+
			
			'<input id="radio2id'+myCounter+'" type="radio" ng-model="radio'+myCounter+'" value="submit to database">'+
			'</input>'+
			'<label for="radio2id'+myCounter+'">'+
				'submit to database'+
			'</label>'+
			
			'<input id="radio3id'+myCounter+'" type="radio" ng-model="radio'+myCounter+'" value="save to file">'+
			'</input>'+
			'<label for="radio3id'+myCounter+'">'+
				'save to file'+
			'</label>'+
			
			'<button hide-me>'+
				'OK'+
			'</button>'+
		'</li>';
		return template;
	}
	 
	this.template3b = function(myCounter) {
		template =
		'<li  class="thirdContentObject contentObject">'+
			'<p show-me value="'+myCounter+'">'+
				'{{titleText'+myCounter+'}}'+
			'</p>'+
		
			'<p>'+
				'{{inputText'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{radio'+myCounter+'}}'+
			'</p>'+
			
			'<div class="moveBox" movable> | | | </div>'+
		'</li>';
		return template;
	}
	 
	this.template4a = function(myCounter, titleText, firstChoiceText, secondChoiceText, thirdChoiceText, button1, button2, button3) {
		if (typeof titleText == "undefined") {
			titleText = "myMultipleChoice";
		}
		if (typeof firstChoiceText == "undefined") {
			firstChoiceText = "first choice";
		}
		if (typeof secondChoiceText == "undefined") {
			secondChoiceText = "second choice";
		}
		if (typeof thirdChoiceText == "undefined") {
			thirdChoiceText = "third choice";
		}
		if (typeof button1 == "undefined") {
			button1 = '0">link';
		}
		if (typeof button2 == "undefined") {
			button2 = '0">link';
		}
		if (typeof button3 == "undefined") {
			button3 = '0">link';
		}
		template =
		'<li value="'+myCounter+'">'+
			'<input type="text" ng-model="titleText'+myCounter+'" ng-init="titleText'+myCounter+'=\''+titleText+'\'">'+
			'</input>'+
		
			'<input type="text" ng-model="firstChoiceText'+myCounter+'" ng-init="firstChoiceText'+myCounter+'=\''+firstChoiceText+'\'">'+
			'</input>'+
			
			'<button class="toggleLinkButton" add-col ng-click="firstChoiceButton'+myCounter+' = +firstChoiceButton'+myCounter+' + 1" ng-init="firstChoiceButton'+myCounter+'='+button1+
			'</button>'+
			
			'<input type="text" ng-model="secondChoiceText'+myCounter+'" ng-init="secondChoiceText'+myCounter+'=\''+secondChoiceText+'\'">'+
			'</input>'+
			
			'<button class="toggleLinkButton" add-col ng-click="secondChoiceButton'+myCounter+' = +secondChoiceButton'+myCounter+' + 1" ng-init="secondChoiceButton'+myCounter+'='+button2+
			'</button>'+
			
			'<input type="text" ng-model="thirdChoiceText'+myCounter+'" ng-init="thirdChoiceText'+myCounter+'=\''+thirdChoiceText+'\'">'+
			'</input>'+
			
			'<button class="toggleLinkButton" add-col ng-click="thirdChoiceButton'+myCounter+' = +thirdChoiceButton'+myCounter+' + 1" ng-init="thirdChoiceButton'+myCounter+'='+button3+
			'</button>'+

			'<button hide-me>'+
				'OK'+
			'</button>'+
		'</li>';
		return template;
	 }
	 
	this.template4b = function(myCounter, pl, pl1, pl2, pl3) {
		if (typeof pl == "undefined") {
			pl = "";
		}
		if (typeof pl1 == "undefined") {
			pl1 = "";
		}
		if (typeof pl2 == "undefined") {
			pl2 = "";
		}
		if (typeof pl3 == "undefined") {
			pl3 = "";
		}
		
		template =
		'<li class="fourthContentObject contentObject"'+pl+pl1+pl2+pl3+'>'+
			'<p show-me value="'+myCounter+'">'+
				'{{titleText'+myCounter+'}}'+
			'</p>'+
		
			'<p>'+
				'{{firstChoiceText'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{firstChoiceButton'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{secondChoiceText'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{secondChoiceButton'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{thirdChoiceText'+myCounter+'}}'+
			'</p>'+
			
			'<p>'+
				'{{thirdChoiceButton'+myCounter+'}}'+
			'</p>'+
			
			'<div class="moveBox" movable> | | | </div>'+
		'</li>';
		return template;
	 }
}

function questionService() {
	this.next = function(element) {
		document.activeElement.blur();
		var oldValue = element.prop("offsetTop");
		var newValue = element.next().prop("offsetTop");
		var interval, i = 1;
		var incrementalValue = 0;
		if (oldValue < newValue) {
			incrementalValue = (newValue - oldValue) / 10;
		}
		function scrollToNew() {
			document.getElementById('previewContainer').scrollTop += incrementalValue;
			if (i < 10) { 
				i++
			} else {
				clearInterval(interval)
				if (typeof element.next().find("input")[0] != "undefined") {
					element.next().find("input")[0].focus();
				}  else if (typeof element.next().find("div")[1]  != "undefined") {
					element.next().find("div")[1].focus();
				}
			}
		}
		interval = setInterval(scrollToNew, 60);
	}
	 
	 
	this.section = function(element, pl) {
		document.activeElement.blur();
		if(pl != 0) {
			var sectionList = angular.element(document.getElementById('previewContainer')).find("h2");
			for (var i = 0; i < sectionList.length; ++i) {
				if (sectionList[i].innerHTML.lastIndexOf(pl, 0) === 0) {
					sectionList[i].parentNode.className = " ";
					var myInput = sectionList[i].parentNode.getElementsByTagName("div")[0].getElementsByTagName("input")[0];
					var myButton = sectionList[i].parentNode.getElementsByTagName("div")[0].getElementsByTagName("div")[0];
					var oldValue = element.prop("offsetTop");
					var newValue = sectionList[i].nextSibling.offsetTop;
					var interval, j = 1;
					var incrementalValue = 0;
					if (oldValue < newValue) {
						incrementalValue = (newValue - oldValue) / 10;
					}
					function scrollToNew() {
						document.getElementById('previewContainer').scrollTop += incrementalValue;
						if (j < 10) { 
							j++
						} else {
							clearInterval(interval)
							
							if (typeof myInput != "undefined") {
								myInput.focus();
							} else if (typeof myButton != "undefined") {
								myButton.focus();
							}
						}
					}
					interval = setInterval(scrollToNew, 60);
				} else {
					sectionList[i].parentNode.className = "myHiddenPreview";
				}
			}	
		} else {
			var oldValue = element.prop("offsetTop");
		 	var newValue = element.next().prop("offsetTop");
		 	var interval, i = 1;
		 	var incrementalValue = 0;
		 	if (oldValue < newValue) {
			 	incrementalValue = (newValue - oldValue) / 10;
			}
			function scrollToNew() {
				document.getElementById('previewContainer').scrollTop += incrementalValue;
				if (i < 10){ 
					i++
				} else {
					clearInterval(interval)
					if (typeof element.next().find("input")[0] != "undefined") {
						element.next().find("input")[0].focus();
					} else if (typeof element.next().find("div")[1]  != "undefined") {
						element.next().find("div")[1].focus();
					}
				}
			}
			interval = setInterval(scrollToNew, 60);
		}
	} 
}

function previewService($compile) {	
    this.get = function(scope) {
		document.getElementById('previewContainer').innerHTML = "";
		var receiverContainer = document.getElementById("receiverContainer");
		var containerObjects = receiverContainer.getElementsByTagName("ul");	
		var myArrayContainer = [];
		var myArray = [];
		var myString = "";
		var myLink = "";
		var myChoice = "";
		var firstSplit = "0";
		for (var r = 0; r < containerObjects.length; ++r) {
			if (firstSplit == "0"){
				myArrayContainer += ['<ul tabindex="-1"><h2>receiverObject'+r+'</h2>']; 
			} else {
				myArrayContainer += ['<ul tabindex="-1" class="myHiddenPreview"><h2>receiverObject'+r+'</h2>']; 
			} 
			elements = containerObjects[r].getElementsByTagName("li");
			for (var i = 0; i < elements.length; ++i) {
				myArray = [];
				if (elements[i].className.match("firstContentObject")) {	
					myArray += '<li tabindex="-1"><div tabindex="-1" class="firstContentPreview">';
					myString = elements[i].getElementsByTagName("p")[0].innerHTML;
					myString = '<h4 tabindex="-1">'+myString+'</h4>';   
					myArray += myString;
					myString = elements[i].getElementsByTagName("p")[1].innerHTML;
					for (var j = 0; j < myString; ++j) {
						myArray += '<div tabindex="-1" click-section go-to-section pl="0">'+(j+1)+'</div>';   
					}			
					myArray += '</div></li>';
				} else if (elements[i].className.match("secondContentObject")) {
					myArray += '<li tabindex="-1"><div tabindex="-1" class="secondContentPreview">';
					myString = elements[i].getElementsByTagName("p")[0].innerHTML;
					myString = '<p tabindex="-1">'+myString+'</p>';   
					myArray += myString;
					myString = '<input tabindex="-1" click-next></input><div tabindex="-1" next-question>OK</div>';   
					myArray += myString;
					myArray += '</div></li>';
				} else if (elements[i].className.match("thirdContentObject")) {
					myArray += '<li tabindex="-1"><div tabindex="-1" class="thirdContentPreview">';
					myString = elements[i].getElementsByTagName("p")[0].innerHTML;
					myString = '<h4 tabindex="-1">'+myString+'</h4>';   
					myArray += myString;
					myString = elements[i].getElementsByTagName("p")[1].innerHTML;
					myString = '<p tabindex="-1">'+myString+'</p>';   
					myArray += myString;
					myChoice = elements[i].getElementsByTagName("p")[2].innerHTML;
					myString = '<div tabindex="-1">'+myChoice+'</div>';   
					myArray += myString;
					myArray += '</div></li>';
				} else if (elements[i].className.match("fourthContentObject")) {
					myArray += '<li tabindex="-1"><div class="fourthContentPreview">';
					firstSplit = "1";
					myString = elements[i].getElementsByTagName("p")[0].innerHTML;
					myString = '<p tabindex="-1">'+myString+'</p>';   
					myArray += myString;
					myString = elements[i].getElementsByTagName("p")[1].innerHTML;
					myLink = elements[i].getElementsByTagName("p")[2].innerHTML;
					if (myLink%2 != 0) {
						myLink = elements[i].getAttribute("pl1")
					}
					myString = '<div tabindex="-1" click-section go-to-section pl="'+myLink+'">'+myString+'</div>';   
					myArray += myString;
					myString = elements[i].getElementsByTagName("p")[3].innerHTML;
					myLink = elements[i].getElementsByTagName("p")[4].innerHTML;
					if (myLink%2 != 0) {
						myLink = elements[i].getAttribute("pl2")
					}
					myString = '<div tabindex="-1" click-section go-to-section pl="'+myLink+'">'+myString+'</div>';   
					myArray += myString;
					myString = elements[i].getElementsByTagName("p")[5].innerHTML;
					myLink = elements[i].getElementsByTagName("p")[6].innerHTML;
					if (myLink%2 != 0) {
						myLink = elements[i].getAttribute("pl3")
					}
					myString = '<div tabindex="-1" click-section go-to-section pl="'+myLink+'">'+myString+'</div>';   
					myArray += myString;
					myArray += '</div></li>';
				}
				myArrayContainer += myArray;
			}
			myArrayContainer += ['</ul>'];  
		}
		var previewString = '<ul>';
		for (var i = 0; i < myArrayContainer.length; ++i) {
			myArray = myArrayContainer[i];
			for (var j = 0; j < myArray.length; ++j) {
				previewString += myArray[j];
			}
		}
		previewString += '</ul>';
		angular.element(document.getElementById('previewContainer')).append($compile( previewString )(scope));
		if (typeof angular.element(document.getElementById('previewContainer')).find("li")[0].getElementsByTagName("input")[0] != "undefined"){
			angular.element(document.getElementById('previewContainer')).find("li")[0].getElementsByTagName("input")[0].focus();
		} else if (typeof angular.element(document.getElementById('previewContainer')).find("li")[0].getElementsByTagName("div")[1]  != "undefined"){
			angular.element(document.getElementById('previewContainer')).find("li")[0].getElementsByTagName("div")[1].focus();
		}
    }
	this.show = function(){
		document.getElementById('previewContainer').scrollTop = "0";
		angular.element(document.getElementById('closePreviewContainer')).css({
			zIndex: '95'
        });
		angular.element(document.getElementById('previewContainer')).css({
			zIndex: '100'
        });
	}
	this.hide = function(){
		angular.element(document.getElementById('closePreviewContainer')).css({
			zIndex: '0'
        });
		angular.element(document.getElementById('previewContainer')).css({
			zIndex: '0'
        });
	}
}

function columnService($compile, flowChartService, linkService) {
	this.create = function(primaryLink, scope, element, button) {
		var receiverContainer = angular.element(document.getElementById('receiverContainer'));
		var containerObjects = receiverContainer.find("ul");
		var newColNumber = containerObjects.length;
		var insertColumn = 0;
		for (var i = 0; i < containerObjects.length; ++i) {
			if  (containerObjects[i].getAttribute("id") !=  "receiverObject" + i) {
				newColNumber  = i;
				i = containerObjects.length;
				insertColumn = 1;
			}
		}
		if (button.attr("PL")){
			var buttonLink = button.attr("PL");
			document.getElementById( buttonLink ).remove();
			var currentLinks = element.getAttribute("PL");
			if (element.getAttribute("PL").indexOf(buttonLink) != -1) {
				element.setAttribute("PL", element.getAttribute("PL").replace( buttonLink, "" ));
			} else {
				element.removeAttribute("PL");
			}
			button.removeAttr("PL");
			button.text("link");
			if (button.attr("ng-click").lastIndexOf("f", 0) === 0) {
				element.removeAttribute("PL1");
			} else if (button.attr("ng-click").lastIndexOf("s", 0) === 0) {
				element.removeAttribute("PL2");
			} else if (button.attr("ng-click").lastIndexOf("t", 0) === 0) {
				element.removeAttribute("PL3");
			}
			flowChartService.update();
			linkService.update();		
		} else {
			button.attr("PL", "receiverObject" + newColNumber);
			button.text("unlink");
			if (button.attr("ng-click").lastIndexOf("f", 0) === 0) {
				element.setAttribute("PL1", "receiverObject" + newColNumber);
			} else if (button.attr("ng-click").lastIndexOf("s", 0) === 0) {
				element.setAttribute("PL2", "receiverObject" + newColNumber);
			} else if (button.attr("ng-click").lastIndexOf("t", 0) === 0) {
				element.setAttribute("PL3", "receiverObject" + newColNumber);
			}
			if (typeof element.className != 'undefined'){
				if (element.hasAttribute("PL")){
					element.setAttribute("PL", element.getAttribute("PL") + " " + "receiverObject" + newColNumber + " ");
				} else {
					element.setAttribute("PL", "receiverObject" + newColNumber);
				}
			}
			var receiverObject = angular.element(document.getElementById('receiverObject' + (newColNumber -1)));
			receiverObject.after($compile(
			'<ul id="receiverObject'+newColNumber+'" class="receiverClass receiverObject inactiveReceiver" primaryLink="'+primaryLink+'"></ul>'
			)(scope));
			flowChartService.update();
		}
	}
	this.createFirst = function(scope) {
		var receiverContainer = angular.element(document.getElementById('receiverContainer'));
		var containerObjects = receiverContainer.find("ul");
		var newColNumber = containerObjects.length;
		receiverContainer.append($compile(
		'<ul id="receiverObject'+newColNumber+'" class="receiverClass receiverObject activeReceiver"></ul>'
		)(scope));
		flowChartService.update();
	}
};

function linkService(flowChartService) {
	this.update = function(primaryLink, scope, element) {
		var flowChart = document.getElementById("flowChart")
		var flowCol = flowChart.getElementsByClassName("flowCol")
		var emptyRows = [];
		var flowRows = [];
		var emptyRow = [];
		var flowRow = [];
		var updateMe = 0;
		for (var i = 0; i < flowCol.length; ++i) {
			emptyRows = flowCol[i].getElementsByClassName("emptyRow");
			flowRows = flowCol[i].getElementsByClassName("flowRow");
			emptyRow = [];
			flowRow = [];
			for (var j = 0; j < emptyRows.length; ++j) {
				emptyRow.push(emptyRows[j]);
			};
			for (var j = 0; j < flowRows.length; ++j) {
				flowRow.push(flowRows[j]);
				if (flowRow[j].getAttribute("PL")) {
					updateMe = 1;
					var primaryLink = flowRow[j].getAttribute("PL");
					var primaryLinkList = primaryLink.split(" ");
					for (var k = 0; k < primaryLinkList.length; ++k) {
						var targetContainer = document.getElementById(primaryLinkList[k]);
						if (targetContainer != null){
							targetContainer.setAttribute("primaryLink", +emptyRow.length + +flowRow.length);
						}
					}
				}
			}
		}
		if (updateMe == 1){
			flowChartService.update();
		}
	}
	this.link = function() {
		var flowChart = document.getElementById("flowChart")
		var flowCol = flowChart.getElementsByClassName("flowCol")
		var rows = [];
		for (var i = 0; i < flowCol.length; ++i) {
			rows = flowCol[i].getElementsByTagName("div");
			for (var j = 0; j < rows.length; ++j) {
				if (rows[j].getAttribute("PL")) {
					var primaryLink = rows[j].getAttribute("PL");
					var primaryLinkList = primaryLink.split(" ");
					for (var k = 0; k < primaryLinkList.length; ++k) {
						var targetContainer = flowCol[primaryLinkList[k].split("receiverObject")[1]]
						if (typeof targetContainer != "undefined"){
							var firstFlowRow = targetContainer.getElementsByClassName("flowRow")[0];
						}
						if (typeof firstFlowRow != "undefined") {
							var a = rows[j].getBoundingClientRect();
							var b = firstFlowRow.getBoundingClientRect();
							var f = flowChart.getBoundingClientRect();
							var fx = f.left;
							var fy = f.top;
							var ax = (a.left - fx)+(a.width / 2);
							var ay = (a.top - fy)+(a.height / 2);
							var bx = (b.left - fx)+(b.width / 2);
							var by = (b.top - fy)+(b.height / 2);
							if(ay>by){
								bx=ax+bx;  
								ax=bx-ax;
								bx=bx-ax;
								by=ay+by;  
								ay=by-ay;  
								by=by-ay;
							}
							document.getElementById("myCanvas").innerHTML +=
							'<line x1="'+ax+'" y1="'+ay+'" x2="'+bx+'" y2="'+ay+'" />'+
							'<line x1="'+bx+'" y1="'+ay+'" x2="'+bx+'" y2="'+by+'" />';
						}
					}
				}
			}
		}
	}
}

function flowChartService($compile, $rootScope, counterService) {
	this.update = function() {
		scope=$rootScope;
		document.getElementById('flowChart').innerHTML = "";
		document.getElementById("myCanvas").innerHTML = "";
		var flowChart = [];
		var primaryLink = "0";
		var myValue = "0";
		var myClass = '';
		var receiverContainer = document.getElementById("receiverContainer");
		var containerObjects = receiverContainer.getElementsByTagName("ul");	
		if ( containerObjects.length > 8){
			myClass = ' flowColCell'
		} else {
			myClass = ' flowColBlock'
		}
		for (var i = 0; i < containerObjects.length; ++i) {
			flowChart.push(containerObjects[i]);
		}
		for (var i = 0; i < flowChart.length; ++i) {
			myValue = flowChart[i].getAttribute("id").split("receiverObject")[1];
			if( (" " + flowChart[i].className + " ").indexOf(" activeReceiver ")  > -1 ) {
				angular.element(document.getElementById('flowChart')).append($compile(
				"<div scroll-flow get-col class='flowCol activeColumn"+myClass+"' value="+myValue+"></div>"
				)(scope));
			} else {
				angular.element(document.getElementById('flowChart')).append($compile(
				"<div scroll-flow get-col class='flowCol"+myClass+"' value="+myValue+"></div>"
				)(scope));
			}	
			primaryLink = flowChart[i].getAttribute("primaryLink");
			var rows = flowChart[i].getElementsByTagName("li");
			for (var j = 0; j < primaryLink; ++j) {
				document.getElementById('flowChart').children[i].innerHTML += "<div class='emptyRow'></div>";
			}
			for (var j = 0; j < rows.length; ++j) {
				if (rows[j].getAttribute("PL")) {
					var primaryLink = rows[j].getAttribute("PL");
					document.getElementById('flowChart').children[i].innerHTML += "<div class='flowRow' pl='"+primaryLink+"'></div>";
				} else {
					document.getElementById('flowChart').children[i].innerHTML += "<div class='flowRow'></div>";
				}
			}	
		}
		var myFlowChart = document.getElementById('flowChart').children;
		var myVariable = counterService.getScroll();
		for (var i=0; i<myFlowChart.length; i++) {
			myFlowChart[i].style.left = ((i + myVariable) * 5) + "vw";
		}
   	}
}

function userService(accessService) {
	var currentUser = "myUserName";
	var currentWorkSpace = "notSelected";
	function numberize(input) {
		var inputlength = input.length;
		input = input.toLowerCase();
		var numberized = "";
		for (i = 0; i < inputlength; i++) {
			var character = input.charAt(i);
			switch(character) {
				 case '0': numberized+="00";break;
				 case '1': numberized+="01";break;
				 case '2': numberized+="02";break;
				 case '3': numberized+="03";break;
				 case '4': numberized+="04";break;
				 case '5': numberized+="05";break;
				 case '6': numberized+="06";break;
				 case '7': numberized+="07";break;
				 case '8': numberized+="08";break;
				 case '9': numberized+="09";break;
				 case 'a': numberized+="10";break;
				 case 'b': numberized+="11";break;
				 case 'c': numberized+="12";break;
				 case 'd': numberized+="13";break;
				 case 'e': numberized+="14";break;
				 case 'f': numberized+="15";break;
				 case 'g': numberized+="16";break;
				 case 'h': numberized+="17";break;
				 case 'i': numberized+="18";break;
				 case 'j': numberized+="19";break;
				 case 'k': numberized+="20";break;
				 case 'l': numberized+="21";break;
				 case 'm': numberized+="22";break;
				 case 'n': numberized+="23";break;
				 case 'o': numberized+="24";break;
				 case 'p': numberized+="25";break;
				 case 'q': numberized+="26";break;
				 case 'r': numberized+="27";break;
				 case 's': numberized+="28";break;
				 case 't': numberized+="29";break;
				 case 'u': numberized+="30";break;
				 case 'v': numberized+="31";break;
				 case 'w': numberized+="32";break;
				 case 'x': numberized+="33";break;
				 case 'y': numberized+="34";break;
				 case 'z': numberized+="35";break;
			}
		}
		return numberized;
	}		
	this.loginUser = function(user) {
      currentUser = user;
    }	
    this.get = function() {
      return currentUser;
    }
	this.getNumber = function() {
		var userNumber = numberize(currentUser);
		return userNumber;
	}	
	this.getUserInfo = function() {
		var userNumber = numberize(currentUser);
		return accessService.get({ table: "Users", id: userNumber}) 
	}	
	this.setWorkSpace = function(selected) {
      currentWorkSpace = selected;
    }
    this.getWorkSpace = function() {
      return currentWorkSpace;
    }
}

function accessFactory($resource) {
	return $resource('http://design-jostein.rhcloud.com/DragonDrop/api.php/myFirstTable/:id', {id:'@id'}, {
		update: {
			method: 'PUT' 
		}
	});
}

function userFactory($resource) {
	return $resource('http://design-jostein.rhcloud.com/DragonDrop/api.php/Users/:username', {username:'@username'}, {
		update: {
			method: 'PUT' 
		}
	});
}

myApp.directive("addFirstElement", function($compile, counterService, flowChartService, linkService, templateService, flowMoveService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			counterService.inc();
			var myCounter = counterService.get();
			angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));
			angular.element(document.getElementsByClassName('activeReceiver')).append($compile(templateService.template1b(myCounter))(scope));
			flowChartService.update();
			linkService.update();
			flowMoveService.update();
			linkService.link();
		});
	}
});

myApp.directive("addSecondElement", function($compile, counterService, flowChartService, linkService, templateService, flowMoveService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			counterService.inc();
			var myCounter = counterService.get();
			angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter))(scope));
			angular.element(document.getElementsByClassName('activeReceiver')).append($compile(templateService.template2b(myCounter))(scope));
			flowChartService.update();
			linkService.update();
			flowMoveService.update();
			linkService.link();
		});
	}
});

myApp.directive("addThirdElement", function($compile, counterService, flowChartService, linkService, templateService, flowMoveService) {
	return function(scope, element, attrs){
		element.bind("click", function(){
			counterService.inc();
			var myCounter = counterService.get();
			angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter))(scope));
			angular.element(document.getElementsByClassName('activeReceiver')).append($compile(templateService.template3b(myCounter))(scope));
			flowChartService.update();
			linkService.update();
			flowMoveService.update();
			linkService.link();
		});
	}
});

myApp.directive("addFourthElement", function($compile, counterService, flowChartService, linkService, templateService, flowMoveService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			counterService.inc();
			var myCounter = counterService.get();
			angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));
			angular.element(document.getElementsByClassName('activeReceiver')).append($compile(templateService.template4b(myCounter))(scope));
			flowChartService.update();
			linkService.update();
			flowMoveService.update();
			linkService.link();
		});
	}
});

myApp.directive("showMe", function() {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var modificationNumber = element.attr("value");
			angular.element(document.getElementById('closeModificationList')).attr("value", modificationNumber);
			angular.element(document.getElementById('closeModificationList')).css({
				zIndex: 95
			});
			var modificationArray = angular.element(document.getElementById('modificationList')).children();
			for (var i = 0; i < modificationArray.length; i++ ) {
				if (modificationArray[ i ].getAttribute("value") == modificationNumber) {
					modificationArray[ i ].style.zIndex = 100;
				}
			}
		});
	}
});

myApp.directive("hideMe", function() {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var modificationArray = angular.element(document.getElementById('modificationList')).children();
			var myElement = angular.element(document.getElementById('closeModificationList'));
			var modificationNumber = myElement.attr("value");
			myElement.css({
				zIndex: 0
			});
			for (var i = 0; i < modificationArray.length; i++ ) {
				if (modificationArray[ i ].getAttribute("value") == modificationNumber) {
					modificationArray[ i ].style.zIndex = 0;
				}
			}
		});
	}
});

myApp.directive('draggable', function($document, $compile, counterService, flowChartService, linkService, templateService, flowMoveService) {
    return function(scope, element, attr) {
		var x = 0, y = 0;
		var myCounter = counterService.get();
		var data = element.parent();
      	data.css({
       		position: 'relative',
       		cursor: 'pointer',
      	});
      	element.on('mousedown', function(ev) {
        ev.preventDefault(); 
		angular.element(document.getElementsByClassName('contentObject')).addClass("insertAfterClass");
		data.removeClass("insertAfterClass");
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
    });

    function mousemove(ev) {
        y = ev.pageY +10;
        x = ev.pageX;
        data.css({
          	top: y + 'px',
          	left:  x + 'px',
		  	position: 'fixed',
		  	zIndex: '20'
        });
		data.parent().parent().css({
		  	zIndex: '20'
        });
    }
	  
    function mouseup(ev) {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
		angular.element(document.getElementsByClassName('contentObject')).removeClass("insertAfterClass");
		data.css({
          	top: '0',
          	left:  '0',
		  	position: 'relative',
		  	zIndex: '10'
        });
		data.parent().parent().css({
		  	zIndex: '10'
        });
		if (angular.element(ev.target).hasClass( "contentObject" )) {
			counterService.inc();
			myCounter = counterService.get();
			if (data.hasClass( "firstContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));				
				angular.element(ev.target).after($compile(templateService.template1b(myCounter))(scope));
			} else if (data.hasClass( "secondContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter))(scope));
				angular.element(ev.target).after($compile(templateService.template2b(myCounter))(scope));
			} else if (data.hasClass( "thirdContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter))(scope));
				angular.element(ev.target).after($compile(templateService.template3b(myCounter))(scope));
			} else if (data.hasClass( "fourthContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));			
				angular.element(ev.target).after($compile(templateService.template4b(myCounter))(scope));
			}
		} else if (angular.element(ev.target).parent().hasClass( "contentObject" )) {
			counterService.inc();
			myCounter = counterService.get();
			if (data.hasClass( "firstContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));				
				angular.element(ev.target).parent().after($compile(templateService.template1b(myCounter))(scope));
			} else if (data.hasClass( "secondContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter))(scope));
				angular.element(ev.target).parent().after($compile(templateService.template2b(myCounter))(scope));
			} else if (data.hasClass( "thirdContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter))(scope));
				angular.element(ev.target).parent().after($compile(templateService.template3b(myCounter))(scope));
			} else if (data.hasClass( "fourthContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));			
				angular.element(ev.target).parent().after($compile(templateService.template4b(myCounter))(scope));
			}
		} else if (angular.element(ev.target).hasClass( "receiverObject" )) {
			counterService.inc();
			myCounter = counterService.get();
			if (data.hasClass( "firstContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));
				angular.element(ev.target).append($compile(templateService.template1b(myCounter))(scope));
			} else if (data.hasClass( "secondContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(	templateService.template2a(myCounter))(scope));
				angular.element(ev.target).append($compile(templateService.template2b(myCounter))(scope));
			} else if (data.hasClass( "thirdContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(	templateService.template3a(myCounter))(scope));
				angular.element(ev.target).append($compile(templateService.template3b(myCounter)		
				)(scope));
			} else if (data.hasClass( "fourthContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));
				angular.element(ev.target).append($compile(templateService.template4b(myCounter))(scope));
			}
		} else if (angular.element(ev.target).hasClass( "flowRow" ) || angular.element(ev.target).hasClass( "emptyRow" )) {
			counterService.inc();
			myCounter = counterService.get();
			var targetValue = angular.element(ev.target).attr("value");
			var parentValue = angular.element(ev.target).parent().attr("value");
			var targetContainer = angular.element(document.getElementById('receiverObject'+parentValue));
			if (data.hasClass( "firstContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));				
				targetContainer.append($compile(templateService.template1b(myCounter))(scope));
			} else if (data.hasClass( "secondContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter))(scope));
				targetContainer.append($compile(templateService.template2b(myCounter))(scope));
			} else if (data.hasClass( "thirdContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter))(scope));
				targetContainer.append($compile(templateService.template3b(myCounter))(scope));
			} else if (data.hasClass( "fourthContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));			
				targetContainer.append($compile(templateService.template4b(myCounter))(scope));
			}
		} else if (angular.element(ev.target).hasClass( "flowCol" )) {
			counterService.inc();
			myCounter = counterService.get();
			var targetValue = angular.element(ev.target).attr("value");
			var targetContainer = angular.element(document.getElementById('receiverObject'+targetValue));
			if (data.hasClass( "firstContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter))(scope));				
				targetContainer.append($compile(templateService.template1b(myCounter))(scope));
			} else if (data.hasClass( "secondContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter))(scope));
				targetContainer.append($compile(templateService.template2b(myCounter))(scope));
			} else if (data.hasClass( "thirdContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter))(scope));
				targetContainer.append($compile(templateService.template3b(myCounter))(scope));
			} else if (data.hasClass( "fourthContentObject" )) {
				angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter))(scope));			
				targetContainer.append($compile(templateService.template4b(myCounter))(scope));
			}
		}
	  	flowChartService.update();
	  	linkService.update();
	  	flowMoveService.update();
	  	linkService.link();
    	}
	}
});

myApp.directive('movable', function($document, $compile, flowChartService, linkService, flowMoveService) {
    return function(scope, element, attr) {
      	var x = 0, y = 0;
	  	var data = element.parent();
      	data.css({
       		position: 'relative',
       		cursor: 'pointer',
      	});
      	element.on('mousedown', function(ev) {
        	ev.preventDefault();
			angular.element(document.getElementsByClassName('contentObject')).addClass("insertAfterClass");
			data.removeClass("insertAfterClass");
        	$document.on('mousemove', mousemove);
        	$document.on('mouseup', mouseup);
      	});

      	function mousemove(ev) {
        	y = ev.pageY + 10;
        	x = ev.pageX;
        	data.css({
          		top: y + 'px',
          		left:  x + 'px',
		  		position: 'fixed',
		  		zIndex: '20'
        	});
			data.parent().css({
		  		zIndex: '20'
        	});
    	}
	  
      	function mouseup(ev) {
        	$document.off('mousemove', mousemove);
        	$document.off('mouseup', mouseup);
			angular.element(document.getElementsByClassName('contentObject')).removeClass("insertAfterClass");
			data.css({
    		    top: '0',
          		left: '0',
		  		position: 'relative',
		  		zIndex: '10'
        	});
			data.parent().css({
		  		zIndex: '10'
        	});
			var killMe = "0";
			if (typeof  data.attr("pl") != "undefined") {
				if ( data.attr("pl").split('receiverObject').length > 1 ) {
					killMe = "1";
				} else {
					data.removeAttr("pl");
				}
			}
			if (killMe == "1"){
				alert ("Please remove all links before moving object");
			} else if (angular.element(ev.target).hasClass( "contentObject" )) {
				angular.element(ev.target).after($compile(data)(scope));
			} else if (angular.element(ev.target).parent().hasClass( "contentObject" )) {
				angular.element(ev.target).parent().after($compile(data)(scope));
			} else if (angular.element(ev.target).hasClass( "receiverObject" )) {
				angular.element(ev.target).append($compile(data)(scope));
			} else if (angular.element(ev.target).hasClass( "flowRow" ) || angular.element(ev.target).hasClass( "emptyRow" )) {
				var targetValue = angular.element(ev.target).attr("value");
				var parentValue = angular.element(ev.target).parent().attr("value");
				var targetContainer = angular.element(document.getElementById('receiverObject'+parentValue));
				targetContainer.append($compile(data)(scope));
			} else if (angular.element(ev.target).hasClass( "flowCol" )) {
				var targetValue = angular.element(ev.target).attr("value");
				var targetContainer = angular.element(document.getElementById('receiverObject'+targetValue));
				targetContainer.append($compile(data)(scope));
			}
	  		flowChartService.update();
	  		linkService.update();
	  		flowMoveService.update();
	  		linkService.link();
      	}
    }
});

myApp.directive("saveElement", function(accessFactory, accessService, userService, userFactory) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
		var userName = "";
		var newId = "";
		var primaryLink = "";
		accessService.get({table:"myFirstTable", columns:"id", order:"id,desc"}, function(response) { 
			userName = response.toSource();
			userName = userName.split('records:[["');
			userName = userName[1].split('"]');
			lastId = userName[0];
			lastId = Number(lastId);
			newId = lastId + 1;
			newId = newId.toString();
			var newName = accessFactory.get({id: lastId}, function() {
				newName.id = newId;
				newName.name = '';
				newName.linklist = '';
				var receiverContainer = document.getElementById("receiverContainer");
				var containerObjects = receiverContainer.getElementsByTagName("ul");
				for (var r = 0; r < containerObjects.length; ++r) {
					primaryLink = containerObjects[r].getAttribute("primaryLink");
					newName.linklist += primaryLink;
					newName.linklist += ')PL(';
					elements = containerObjects[r].getElementsByTagName("li");
					for (var i = 0; i < elements.length; ++i) {
						if (elements[i].className.match("firstContentObject")) {
							newName.name += '1';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[1].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("secondContentObject")) {
							newName.name += '2';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("thirdContentObject")) {
							newName.name += '3';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[1].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[2].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("fourthContentObject")) {
							newName.name += '4';
							for (var j = 0; j < 7; ++j) {
								newName.name += ')dragonRow(';
								if (j == 2 || j == 4 || j == 6) {
									if (elements[i].getElementsByTagName("p")[j].innerHTML%2 == 0) {
										newName.name += "not linked";
									} else {	
										if (j == 2) {
											newName.name += elements[i].getAttribute("PL1");
										} else if (j == 4) {
											newName.name += elements[i].getAttribute("PL2");
										} else {
											newName.name += elements[i].getAttribute("PL3");
										}
									}
								} else {
									newName.name += elements[i].getElementsByTagName("p")[j].innerHTML;
								}
							}
							newName.name += ')dragonDrop(';
						}
					}
					newName.name += ')dragonCol(';
				}
				newName.tablename = "newTable" + newId;
				newName.Answer = 'I have a new Answer';
				newName.$save();
				alert("Number " + newId + " has been saved");
			});
			userName = userService.getNumber();
			var addToUser = userFactory.get({username: userName}, function() {
				if (addToUser.email.indexOf(newId) == -1) {
					addToUser.email += newId;
					addToUser.email += ",";
					addToUser.$update();
				}
			});
		});	
	});
	}
});

myApp.directive("loadElement", function(accessFactory, $rootScope) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var myTable = 'myFirstTable';
			var myId = 1;
			$rootScope.loadElement = accessFactory.get({ table: myTable, id: myId});
		});
	};
});

myApp.directive("updateElement", function(accessFactory, userService, userFactory) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
		var currentWorkSpace = userService.getWorkSpace();
		if (currentWorkSpace == "notSelected"){
			alert("You have not selected an object to update");
		} else {
			var userName = "";
			var newId = "";
			var primaryLink = "";
			var newName = accessFactory.get({id: currentWorkSpace}, function() {
				newId = newName.id;
				newName.name = '';
				newName.linklist = '';
				var editorList = "";
				var elements = "";
				var receiverContainer = document.getElementById("receiverContainer");
				var containerObjects = receiverContainer.getElementsByTagName("ul");	
				for (var r = 0; r < containerObjects.length; ++r) {
					primaryLink = containerObjects[r].getAttribute("primaryLink");
					newName.linklist += primaryLink;
					newName.linklist += ')PL(';
					elements = containerObjects[r].getElementsByTagName("li");
					for (var i = 0; i < elements.length; ++i) {
						if (elements[i].className.match("firstContentObject")) {
							newName.name += '1';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[1].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("secondContentObject")) {
							newName.name += '2';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("thirdContentObject")) {
							newName.name += '3';
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[0].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[1].innerHTML;
							newName.name += ')dragonRow(';
							newName.name += elements[i].getElementsByTagName("p")[2].innerHTML;
							newName.name += ')dragonDrop(';
						} else if (elements[i].className.match("fourthContentObject")) {
							newName.name += '4';
							for (var j = 0; j < 7; ++j) {
								newName.name += ')dragonRow(';
								if (j == 2 || j == 4 || j == 6) {
									if (elements[i].getElementsByTagName("p")[j].innerHTML%2 == 0) {
										newName.name += "not linked";
									} else {	
										if (j == 2) {
											newName.name += elements[i].getAttribute("PL1");
										} else if (j == 4) {
											newName.name += elements[i].getAttribute("PL2");
										} else {
											newName.name += elements[i].getAttribute("PL3");
										}
									}	
								} else {
									newName.name += elements[i].getElementsByTagName("p")[j].innerHTML;
								}
							}
							newName.name += ')dragonDrop(';
						}
					}
					newName.name += ')dragonCol(';
				}
				newName.$update();
				alert("Number " + currentWorkSpace + " has been updated");
			});
			
			userName = userService.getNumber();
			var addToUser = userFactory.get({username: userName}, function() {
				if (addToUser.email.indexOf(newId) == -1) {
					addToUser.email += newId;
					addToUser.email += ",";
					addToUser.$update();
				}
			});
			}
		});
	}
});

myApp.directive("deleteElement", function(accessFactory, userService, userFactory) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var currentWorkSpace = userService.getWorkSpace();
			if (currentWorkSpace == "notSelected") {
				alert("You have not selected an object for deletion");
			} else {
				var newName = accessFactory.get({id: currentWorkSpace}, function() {
					newName.$delete();
				});
				var userName = userService.getNumber();
				var removeFromUser = userFactory.get({username: userName}, function() {
					var str = removeFromUser.email.toString();
					var res = str.replace(currentWorkSpace + ",", "");
					removeFromUser.email = res;
					removeFromUser.$update();
					alert("Number " + currentWorkSpace + " has been deleted");
				});
			};
		});
	};
});

myApp.directive("clearReceiver", function(columnService) {
	return function(scope, element, attrs) {
		element.bind("click", function(scope) {
			document.getElementById("receiverContainer").innerHTML = "";
			document.getElementById("binObject").innerHTML = "";
			document.getElementById("modificationList").innerHTML = "";
			document.getElementById("flowChart").innerHTML = "";
			document.getElementById("myCanvas").innerHTML = "";
			columnService.createFirst(scope);
		});
	};
});

myApp.directive("populateReceiver", function(accessFactory, $compile, counterService, flowChartService, userService, linkService, templateService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			document.getElementById("receiverContainer").innerHTML = "";
			document.getElementById("modificationList").innerHTML = "";
			flowChartService.update();
			var myCounter = counterService.get();
			var titleText= "defaultText";
			var inputText= "defaultText";
			var userName = userService.get();
			var myId = element.attr("value");
			var primaryLinks= "defaultText";
			var primaryLink = 1;
			userService.setWorkSpace(myId);
			var receiverContainer = angular.element(document.getElementById('receiverContainer'));
			var populationObject = accessFactory.get({id: myId}, function() {
				var populationColumns = populationObject.name.split(')dragonCol(');
				for (var j = 0; j < populationColumns.length -1; ++j) {
					if (j != 0) {
						primaryLink = populationObject.linklist.split(')PL(')[j];
					}
					if (j == 0) {
						receiverContainer.append($compile(
						'<ul id="receiverObject'+j+'" class="receiverClass receiverObject activeReceiver"></ul>'
						)(scope));
					} else {
						receiverContainer.append($compile(
						'<ul id="receiverObject'+j+'" class="receiverClass receiverObject inactiveReceiver" primaryLink="'+primaryLink+'"></ul>'
						)(scope));
					}
					var populationArray = populationColumns[j].split(')dragonDrop(')
					for (var i = 0; i < populationArray.length; ++i) {
						counterService.inc();
						myCounter = counterService.get()
						if (populationArray[i].split(')dragonRow(')[0] == 1) {
							titleText = populationArray[i].split(')dragonRow(')[1];
							inputText = populationArray[i].split(')dragonRow(')[2];
							titleText = titleText.replace(/'/g, "\\'");
							angular.element(document.getElementById('modificationList')).append($compile(templateService.template1a(myCounter, titleText, inputText))(scope));
							angular.element(document.getElementById('receiverObject'+j)).append($compile(templateService.template1b(myCounter))(scope));
						} else if (populationArray[i].split(')dragonRow(')[0] == 2) {
							inputText= populationArray[i].split(')dragonRow(')[1];
							inputText = inputText.replace(/'/g, "\\'");
							angular.element(document.getElementById('modificationList')).append($compile(templateService.template2a(myCounter, inputText))(scope));
							angular.element(document.getElementById('receiverObject'+j)).append($compile(templateService.template2b(myCounter))(scope));
						} else if (populationArray[i].split(')dragonRow(')[0] == 3) {
							titleText= populationArray[i].split(')dragonRow(')[1];
							inputText= populationArray[i].split(')dragonRow(')[2];
							radioText= populationArray[i].split(')dragonRow(')[3];
							titleText = titleText.replace(/'/g, "\\'");
							inputText = inputText.replace(/'/g, "\\'");
							radioText = radioText.replace(/'/g, "\\'");
							angular.element(document.getElementById('modificationList')).append($compile(templateService.template3a(myCounter, titleText, inputText, radioText))(scope));
							angular.element(document.getElementById('receiverObject'+j)).append($compile(templateService.template3b(myCounter))(scope));	
						} else if (populationArray[i].split(')dragonRow(')[0] == 4) {
							titleText= populationArray[i].split(')dragonRow(')[1];
							var firstChoiceText= populationArray[i].split(')dragonRow(')[2];
							var firstChoiceButton= populationArray[i].split(')dragonRow(')[3];
							var secondChoiceText= populationArray[i].split(')dragonRow(')[4];
							var secondChoiceButton= populationArray[i].split(')dragonRow(')[5];
							var thirdChoiceText= populationArray[i].split(')dragonRow(')[6];
							var thirdChoiceButton= populationArray[i].split(')dragonRow(')[7];
							titleText = titleText.replace(/'/g, "\\'");
							firstChoiceText = firstChoiceText.replace(/'/g, "\\'");
							secondChoiceText = secondChoiceText.replace(/'/g, "\\'");
							thirdChoiceText = thirdChoiceText.replace(/'/g, "\\'");
							var pl = "";
							var pl1 = "";
							var pl2 = "";
							var pl3 = "";
							if (firstChoiceButton.lastIndexOf("r", 0) === 0) {
								pl1 = ' pl1="' + firstChoiceButton + '"';
							}
							if (secondChoiceButton.lastIndexOf("r", 0) === 0) {
								pl2 = ' pl2="' + secondChoiceButton + '"';
							}
							if (thirdChoiceButton.lastIndexOf("r", 0) === 0) {
								pl3 = ' pl3="' + thirdChoiceButton + '"';
							}
							if (pl1 != "" || pl2 != "" || pl3 != "" ) {
								pl = ' pl="';
								if (pl1 != "") { 
									pl += firstChoiceButton + " ";
								};
								if (pl2 != "") { 
									pl += secondChoiceButton + " ";
								};
								if (pl3 != "") { 
									pl += thirdChoiceButton;
								};
								pl += '"';
							}		
							var button1 =  '0">link';
							var button2 =  '0">link';
							var button3 =  '0">link';
							if (pl1 != "") { 
								button1 = '1" pl="'+firstChoiceButton+'">unlink';
								};
							if (pl2 != "") { 
								button2 = '1" pl="'+secondChoiceButton+'">unlink';
								};
							if (pl3 != "") { 
								button3 = '1" pl="'+thirdChoiceButton+'">unlink';
								};
							angular.element(document.getElementById('modificationList')).append($compile(templateService.template4a(myCounter, titleText, firstChoiceText, secondChoiceText, thirdChoiceText, button1, button2, button3))(scope));
							angular.element(document.getElementById('receiverObject'+j)).append($compile(templateService.template4b(myCounter, pl, pl1, pl2, pl3))(scope));
						}
					}			
				}
				flowChartService.update();
				linkService.link();
			});
		});
	}
});

myApp.directive("getCol", function() {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var colNumber = element.attr("value");
			var receiverContainer = document.getElementById('receiverContainer');
			var containerObjects = receiverContainer.getElementsByTagName("ul");
			for (var i = 0; i < containerObjects.length; ++i) {
				var myId = containerObjects[i].getAttribute("id");
				document.getElementById(myId).classList.add("inactiveReceiver");
				document.getElementById(myId).classList.remove("activeReceiver");
			};
			document.getElementById('receiverObject'+colNumber).classList.remove("inactiveReceiver");
			document.getElementById('receiverObject'+colNumber).classList.add("activeReceiver");
			element.parent().children().removeClass("activeColumn");
			element.addClass("activeColumn");
		});
	}
});

myApp.directive("addCol", function($compile, flowChartService, columnService, linkService, flowMoveService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var myButton = element;
			var linkValue = "0";
			var parentValue = element.parent().attr("value");
			var myElement = "";
			if (typeof parentValue != 'undefined') {
				var receiverContainer = document.getElementById('receiverContainer');
				var columns = receiverContainer.getElementsByTagName("ul");
				for (var i = 0; i < columns.length; ++i) {
					var rows = columns[i].getElementsByTagName("li");
					for (var j = 0; j < rows.length; ++j) {
						if(rows[j].getElementsByTagName("p")[0].getAttribute("value") == parentValue) {
							myElement = rows[j];
							var columnLink = columns[i].getAttribute("primaryLink");
							linkValue = j + +columnLink +1;
						}
					}
				}
			}
			columnService.create(linkValue,scope, myElement, myButton);
			flowMoveService.update();
			linkService.link();
		});
	}
});

myApp.directive("addFirstCol", function(columnService, linkService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			columnService.createFirst(scope);
			linkService.link();
		});
	}
});

myApp.directive("loginUser", function(userService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			if (element.attr("data")) {
				userService.loginUser(element.attr("data"));
			}
			alert('You are logged in as "'+userService.get()+'"');
		});
	}
});

myApp.directive("updateLinks", function(linkService, flowChartService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			linkService.link();
		});
	}
});

myApp.directive("getAvailable", function(userService, accessService, $compile) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			var userNumber = userService.getNumber();
			accessService.get({ table: "Users", id: userNumber}, function(response) {
				var availableString = response.toSource();
				availableString = availableString.split('email:"');
				availableString = availableString[1].split('"');
				var availableArray = availableString[0].split(',');
				var loadableContainer = angular.element(document.getElementById('loadableContainer'));
				loadableContainer.empty();
				for (var i = 0; i < availableArray.length -1; ++i) {
					loadableContainer.append($compile(
					'<li>'+
						'<div populate-receiver value="'+availableArray[i]+'">'+
							'Load '+availableArray[i]+
						'</div>'+
					'</li>'
					)(scope));
				}
			});
		});
	}
});

myApp.directive("previewQuestionaire", function(previewService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			previewService.get(scope);
			previewService.show();
		});
	}
});

myApp.directive("closePreviewContainer", function(previewService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			previewService.hide();
		});
	}
});

myApp.directive("nextQuestion", function(questionService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			questionService.next(element.parent().parent());
		});
	}
});

myApp.directive("goToSection", function(questionService) {
	return function(scope, element, attrs) {
		element.bind("click", function() {
			questionService.section(element.parent().parent(), element.attr("pl"));
		});
	}
});

myApp.directive("clickNext", function(questionService) {
	return function(scope, element, attrs) {
		element.bind("keypress", function(ev) {
			if (ev.keyCode == 13) {
				questionService.next(element.next().parent().parent());
			}
		});
	}
});

myApp.directive("clickSection", function(questionService) {
	return function(scope, element, attrs) {
		element.bind("keyup", function(ev) {
			if (ev.keyCode == 37) {
				element.attr("selectedButton", "0");
				var myButtons = element.parent().children();
				for (var i=0; i<myButtons.length; i++) {
					if (myButtons[i].hasAttribute("selectedButton")) {
						element.removeAttr("selectedButton");
						if (i-1 > 0) {
							myButtons[i-1].focus();
						}
					}	 
				}
			}
			if (ev.keyCode == 39) {
				element.attr("selectedButton", "0");
				var myButtons = element.parent().children();
				for (var i=0; i<myButtons.length; i++) {
					if (myButtons[i].hasAttribute("selectedButton")) {
						element.removeAttr("selectedButton");
						if (i+1 < myButtons.length) {
							myButtons[i+1].focus();
						}
					}	 
				}
			}
			if(ev.keyCode == 13) {
				questionService.section(element.parent().parent(), element.attr("pl"));
			}
		});
	}
});