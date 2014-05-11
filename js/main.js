var GRID_WIDTH = 100;
var NUM_ROWS = 6;
var NUM_COLS = 10;
var CLASS_NAMES = ['fox1', 'fox2', 'fox3', 'fox4','fox5','fox6','fox7' ,'fox8' ,'fox9' ,'fox10' ,'fox11', 'foxt1','foxt2','foxt3', 'walk', 'walk2', 'bush'];

var allObjects = null;
var selectedObject = null;

function create2DArray(cols) {
  var arr = [];

  for (var i=0;i<cols;i++) {
     arr[i] = [];
  }

  return arr;
}

function resetGrid(){
	allObjects = create2DArray(NUM_COLS);
	$('#grid').html('');
}
function setPosition(node, gridLeft, gridDown){
	var topPosition = gridDown * GRID_WIDTH;
	var leftPosition = gridLeft * GRID_WIDTH;

	node.css('top', topPosition);
	node.css('left', leftPosition);
}
function addObject(gridLeft, gridDown, className){
	var newNode = $('<span class="object"></span>');

	var newObject = {
		gridLeft: gridLeft, 
		gridDown: gridDown, 
		className: className,
		domNode: newNode

	};
	newNode.click(function(){
		clickObject(gridLeft,gridDown);
	});
	allObjects[gridLeft][gridDown] = newObject;

	setPosition(newNode, gridLeft, gridDown);

	newNode.addClass(className);

	$('#grid').append(newNode);
	return newObject;
}

function isAdjacent(x1, y1, x2, y2){
	if(x1===x2 && y1 === y2 + 1 ||
		x1===x2 && y1 === y2 - 1 ||
		x1===x2 + 1 && y1 === y2 ||
		x1===x2 - 1 && y1 === y2 ){
		return true;
	}
	else{
		return false;
	}
}
function startSwapObjects(object1, object2, finishEvent){
	//update dom
	setPosition(object1.domNode, object2.gridLeft, object2.gridDown);
	setPosition(object2.domNode, object1.gridLeft, object1.gridDown);
	object.domNode.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){ 
		object.domNode.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");
		finishedSwapObjects(selectedObject, object);
		if(finishEvent){
			finishEvent();
		}
	});

}

function finishedSwapObjects(object1, object2){

	//update grid position
	tempGridLeft = object1.gridLeft;
	tempgridDown = object1.gridDown;
	object1.gridLeft = object2.gridLeft;
	object1.gridDown = object2.gridDown;
	object2.gridLeft = tempGridLeft;
	object2.gridDown = tempgridDown;

	//update references

	allObjects[object1.gridLeft][object1.gridDown] = object1;
	allObjects[object2.gridLeft][object2.gridDown] = object2;
}

function clickObject(gridLeft, gridDown){

	object = allObjects[gridLeft][gridDown];
	// if an adjecent object is clicked, swap the objects
	if(selectedObject != null && 
		isAdjacent(selectedObject.gridLeft, selectedObject.gridDown, object.gridLeft, object.gridDown)){

		

		startSwapObjects(selectedObject, object, function(){
			startSwapObjects(selectedObject, object);
		});
		
		

		//checkForMatches

		//if(!isMatch)
		//swapObjects(selectedObject, object);

	}
	else{
		$('.object').removeClass('selected');
		selectedObject = object;
		selectedObject.domNode.addClass('selected');
	}

	
}

function removeObject(left, top){
	//remove objectToremove.domNode from the page.
	objectToRemove = allObjects[left][top];
	objectToRemove.domNode.remove();
	allObjects[left][top] = null;

}

function countMatchesDown(gridLeft, gridDown){
	var matches = 0;
	var thisObject = allObjects[gridLeft][gridDown];
	for(checkForMatchesDown = 0; checkForMatchesDown < NUM_ROWS; checkForMatchesDown++){
		if ( gridDown+checkForMatchesDown < NUM_ROWS){
			var nextObject = allObjects[gridLeft][gridDown+checkForMatchesDown];
			if(nextObject != null && thisObject != null && thisObject.className === nextObject.className){
				matches++;
			}
		}
	}
	return matches;
}

function countMatchesAccross(gridLeft, gridDown){
	var matches = 0;
	var thisObject = allObjects[gridLeft][gridDown];
	for(checkForMatchesAhead = 0; checkForMatchesAhead < NUM_COLS; checkForMatchesAhead++){
		if ( gridLeft+checkForMatchesAhead < NUM_COLS){
			var nextObject = allObjects[gridLeft+checkForMatchesAhead][gridDown];
			if(nextObject != null && thisObject != null && thisObject.className === nextObject.className){
				matches++;
			}
		}
	}
	return matches;
}


function checkForMatches(){
	var allMatches = [];
	for(var gridLeft = 0; gridLeft < NUM_COLS; gridLeft++){
		for(var gridDown = 0; gridDown < NUM_ROWS; gridDown++) {

			//check across
			var numberOfMatches = countMatchesAccross(gridLeft,gridDown);

			if(numberOfMatches >= 3){
				allMatches.push({
					startLeft: gridLeft,
					startDown: gridDown,
					direction: 'left',
					numMatches: numberOfMatches
				});
			}
			//check down
			var numberOfMatches = countMatchesDown(gridLeft,gridDown);

			if(numberOfMatches >= 3){
				allMatches.push({
					startLeft: gridLeft,
					startDown: gridDown,
					direction: 'down',
					numMatches: numberOfMatches
				});
			}
		}
	}
	return allMatches;
}

function populateGrid(){
	for(var gridLeft = 0; gridLeft < NUM_COLS; gridLeft++){
		for(var gridDown = 0; gridDown < NUM_ROWS; gridDown++) {

			var randomIndex = Math.floor(Math.random()*CLASS_NAMES.length)
			var randomFoxClass =  CLASS_NAMES[randomIndex];

			addObject( gridLeft, gridDown, randomFoxClass);
		}
	}
}

function handleMatches(allMatchGroups){

	for(var i = 0; i < allMatchGroups.length; i++){

		var matchGroup = allMatchGroups[i];
		for(var removeAhead = 0; removeAhead < matchGroup.numMatches; removeAhead++){
			if(matchGroup.direction == 'left'){
				removeObject(matchGroup.startLeft+removeAhead,matchGroup.startDown);
			}
			else if(matchGroup.direction == 'down'){
				removeObject(matchGroup.startLeft, matchGroup.startDown+removeAhead);
			}
		}
	}
}

function start(){
	// addObject(0, 0, "fox1");
	//have an array of class names
	resetGrid();
	
	populateGrid();
	

	//test if there are three or more in a row
	var allMatches = checkForMatches();
	handleMatches(allMatches);




	//test if three or more in a column

}