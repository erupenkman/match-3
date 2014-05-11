
beforeEach(function(){
	resetGrid();
});
describe("create2DArray", function() {
	it("should create a 2d array", function() {
		var array = create2DArray(10);
		expect(array[9]).toEqual([]);
	})
});
describe("resetGrid", function() {
	it("should remove dom nodes", function() {
		addObject(0, 0, 'fox1');
		resetGrid();
		expect($('#grid').children().length).toEqual(0);
	})
});

describe("isAdjacent", function() {
	it("should be true for adjacent squares", function() {
		expect(isAdjacent(1,0,1,1)).toBe(true);
		expect(isAdjacent(1,0,2,0)).toBe(true);
		expect(isAdjacent(1,0,5,5)).toBe(false);
	})
});

describe("startSwapObjects", function() {
	it("should swap their visual position", function() {
		var object1 = addObject(3, 3, 'fox1');
		var object2 = addObject(4, 3, 'fox2');
		var originalLeft2 = object2.domNode.css('left');

		startSwapObjects(object1, object2);
		expect(object1.domNode.css('left')).toBe(originalLeft2);
		expect(object1.gridLeft).toBe(3);

		//expect(after1.domNode.css('left')).toBe(before2.domNode.css('left'));
	});
});

describe("finishedSwapObjects", function() {
	it("should swap their grid position", function() {
		var object1 = addObject(3, 3, 'fox1');
		var object2 = addObject(4, 3, 'fox2');

		var originalLeft2 = object2.domNode.css('left');

		finishedSwapObjects(object1, object2);
		var new1 = allObjects[3][3];
		var new2 = allObjects[4][3];

		expect(new1.gridLeft).toBe(3);
		expect(new2.gridLeft).toBe(4);

		expect(new1.className).toBe('fox2');
		expect(new2.className).toBe( 'fox1');

		//expect(after1.domNode.css('left')).toBe(before2.domNode.css('left'));
	});
});
describe("clickObject", function() {
	it("set the clicked domNode class", function() {
		var newObject = addObject(0, 0, 'fox1');
		clickObject(0,0);
		expect(newObject.domNode.hasClass('selected')).toBe(true);
	});
	it("re-select far away object", function() {
		
		
		var newObject1 = addObject(0, 0, 'fox1');
		var newObject2 = addObject(0, 5, 'fox2');
		clickObject(0, 0);
		clickObject(0, 5);
		expect(newObject1.domNode.hasClass('selected')).toBe(false);
		expect(newObject2.domNode.hasClass('selected')).toBe(true);
	});
});



describe("handleMatches", function() {


	it("should find remove the objects", function() {
		var obj1 = addObject(0, 0, 'fox1');
		var obj2 = addObject(1, 0, 'fox1');
		var obj3 = addObject(2, 0, 'fox1');
		var matches = [{
			startLeft: 0,
			startDown: 0,
			direction: 'left',
			numMatches: 3
		}];
		handleMatches(matches);
		expect(allObjects[0][0]).toEqual(null);
	})
});
describe("checkForMatches", function(){

	it("should check first row", function() {

		addObject(0, 0, 'fox1');
		addObject(1, 0, 'fox1');
		addObject(2, 0, 'fox1');
		var result = checkForMatches();
		expect(result[0].numMatches).toBe(3);
		expect(result[0].direction).toBe('left');
		expect(result[0].startLeft).toBe(0);
	});
});
describe("countMatchesAccross", function() {


	it("should find three in the first row", function() {
		addObject(0, 0, 'fox1');
		addObject(1, 0, 'fox1');
		addObject(2, 0, 'fox1');
		var matches = countMatchesAccross(0,0);
		expect(matches).toEqual(3);
	})
});
describe("countMatchesDown", function() {


	it("should find three in the first col", function() {
		addObject(0, 0, 'fox1');
		addObject(0, 1, 'fox1');
		addObject(0, 2, 'fox1');
		var matches = countMatchesDown(0,0);
		expect(matches).toEqual(3);
	})
	it("should find one in the last col", function() {
		addObject(0, 5, 'fox1');
		var matches = countMatchesDown(0,5);
		expect(matches).toEqual(1);
	})
});
describe("removeObject", function() {


	it("should delete the elements from the dom and array", function() {
		addObject(0, 0, 'fox1');
		removeObject(0, 0);

		expect($('#grid').children().length).toEqual(0);
		expect(allObjects[0][0]).toEqual(null);
	})
});
describe("populateGrid", function() {


	it("should place an item in the bottom right corner", function() {
		populateGrid();
		var matches = countMatchesAccross(0,0);
		expect(allObjects[9][5].gridLeft).toEqual(9);
		expect(allObjects[9][5].gridDown).toEqual(5);
	})
});