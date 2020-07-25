var pageTotal = 5;
var totalResults = 496;
var currentPage = 0;
var pageNumber = 1;
var load = 1; //video
var chosenSort = 0;
var currentFilters = [];
var filterType = 0
var searchValue = ""

function filterButton(name) {
	let button = document.getElementById(name);
	if(button.className == "btn btn-danger btn-sm"){
		button.setAttribute("class","btn btn-success btn-sm");
		currentFilters.push(name)
	}
	else {
		button.setAttribute("class","btn btn-danger btn-sm");
		var index = currentFilters.indexOf(name);
		currentFilters.splice(index,1);
	} 

	currentPage = 0;
	pageNumber=1;

	readData();
	updatePage();
	checkButtons();
}

function setSort(val){
	if(val == chosenSort)
		return;
	chosenSort = val;

	document.getElementById('sort-val').innerHTML = sortRequirements[chosenSort].name

	for(let i=0;i<18;i++){
		let button = document.getElementById('sort-'+i)
		if(i == val){
			button.setAttribute("class","btn btn-success btn-sm");
		}
		else {
			button.setAttribute("class","btn btn-danger btn-sm");
		}
	}
	currentPage = 0;
	pageNumber=1;
	readData();
	updatePage();
	checkButtons();
}

function setPageSize(size){
	if(size == pageTotal)
		return;
	currentPage = 0;
	pageNumber = 1;
	pageTotal = size;
	var pageSelect = document.getElementById("page-select");
	pageSelect.innerText = size;
	readData();
	updatePage();
	checkButtons();
}

function nextPage(){
	pageNumber++;
	currentPage = currentPage + pageTotal;
	readData();
	updatePage();
	checkButtons();
}

function lastPage(){
	pageNumber--;
	currentPage = currentPage - pageTotal;
	readData();
	updatePage();
	checkButtons();
}

function updatePage(){
	var pageVisual = document.getElementById("current-page");
	var tempPageNumber = pageNumber
	if(totalResults == 0){
		tempPageNumber = 0;
	}
	pageVisual.innerHTML="Showing Page " + tempPageNumber +  " of " + (Math.ceil(totalResults/pageTotal));
}

function checkButtons(){
	if(Math.ceil(totalResults/pageTotal) == pageNumber){
		document.getElementById("next-button").hidden="true"
		document.getElementById("next-button-2").hidden="true"
	}
	else {
		document.getElementById("next-button").removeAttribute("hidden")
		document.getElementById("next-button-2").removeAttribute("hidden")
	}
	if(pageNumber == 1){
		document.getElementById("previous-button").hidden="true"
		document.getElementById("previous-button-2").hidden="true"
	}
	else {
		document.getElementById("previous-button").removeAttribute("hidden")
		document.getElementById("previous-button-2").removeAttribute("hidden")
	}

	if(totalResults==0){
		document.getElementById("next-button").hidden="true"
		document.getElementById("next-button-2").hidden="true"
		document.getElementById("previous-button").hidden="true"
		document.getElementById("previous-button-2").hidden="true"
	}
}


function changeLoad(val){
	for(let i=1; i<4; i++){
		var button = document.getElementById("media-" + i);
		if(i==val){
			button.setAttribute("class","btn btn-success btn-sm");
		}
		else {
			button.setAttribute("class","btn btn-danger btn-sm");
		}
	}
	if(val != load){
	load = val;
	readData();
	}
}

function onLoad(){
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		changeLoad(2);
		var searchBox = document.getElementById("searchBox");
		searchBox.style.transform = "translateY(0px)"
	}

	readData();
	checkButtons();
}

function readData()
{
	var tableBody = document.getElementById("table-body");
	tableBody.innerHTML ="";

	var currentSort = sortRequirements[chosenSort].array.slice(0) //clone the array

	var indeces;

	if(sortRequirements[chosenSort].value == "integer") {
		indeces = sortWithIndecesValues(currentSort).sortIndices;
	}
	else{
		indeces = sortWithIndeces(currentSort).sortIndices;
	}

	if(chosenSort == 5){
		var numOfEmpty = currentSort.filter(function(x){ return x === ""; }).length;
		indeces = indeces.slice(numOfEmpty).concat(indeces.slice(0,numOfEmpty))
	}

	if(sortRequirements[chosenSort].type == "reverse") {
		indeces = indeces.reverse();
	}

	let currentCount = currentPage;

	indeces = filterArray(indeces)

	indeces = searchTitles(indeces)

	totalResults = indeces.length

	document.getElementById("total-results").innerText = totalResults;

	for(let idx=0; idx<indeces.length;idx++){
		currentCount = currentCount + 1;
		if(videoID[indeces[currentCount-1]]) {
			let row = tableBody.insertRow();
			row.className = "d-flex"
			let countCell = row.insertCell(0);
			countCell.className = "col-1"
			let text = document.createTextNode(currentCount);
			countCell.appendChild(text);

			let videoCell = row.insertCell(1);
			videoCell.className = "col-5"
			let div = document.createElement('div');

			if(load == 1){
				div.className = "videoWrapper";
				div.innerHTML = "<iframe width='560' height='315' src='https://www.youtube.com/embed/" + videoID[indeces[currentCount-1]] + "'frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
			} else if(load == 2){
				div.innerHTML = '<a href=https://www.youtube.com/watch?v=' + videoID[indeces[currentCount-1]] + '" target="_blank" rel="noopener noreferrer" >' + "<img style='width:100%; display:block;' src='" + thumbnailID[indeces[currentCount-1]] + "'></a>"
			}
			else
				div.innerHTML = '<a href=https://www.youtube.com/watch?v=' + videoID[indeces[currentCount-1]] + '" target="_blank" rel="noopener noreferrer" >youtube.com/watch?v=' + videoID[indeces[currentCount-1]] + '</a>'
			
			videoCell.appendChild(div)

			let titleCell = row.insertCell(2)
			titleCell.className = "col-3"
			text = document.createTextNode(videoTitle[indeces[currentCount-1]]);
			titleCell.append(text)

			let sortCell = row.insertCell(3)
			sortCell.className = 'col-3'
			var sortText;
			if(sortRequirements[chosenSort].number=="true"){
				sortText = document.createTextNode(numberWithCommas(sortRequirements[chosenSort].displayArray[[indeces[currentCount-1]]]))
			}
			else {
				sortText = document.createTextNode(sortRequirements[chosenSort].displayArray[[indeces[currentCount-1]]])
			}

			sortCell.append(sortText)
		}

		if(idx>pageTotal-2){
			break;
		}
	}
}


function sortWithIndeces(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function(left, right) {
    return left[0] < right[0] ? -1 : 1;
  });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

function sortWithIndecesValues(toSort) {
  for (var i = 0; i < toSort.length; i++) {
    toSort[i] = [toSort[i], i];
  }
  toSort.sort(function (a,b) { return a[0]-b[0]; });
  toSort.sortIndices = [];
  for (var j = 0; j < toSort.length; j++) {
    toSort.sortIndices.push(toSort[j][1]);
    toSort[j] = toSort[j][0];
  }
  return toSort;
}

function updateArray(toSort,idxArray){
	let newArray = new Array(idxArray.length)
	for(idx in toSort){
		newArray[idx]=toSort[idxArray[idx]]
	}
	return newArray
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function filterDropdown(name, input){
	var dropdown = document.getElementsByClassName(name);
	var input = document.getElementById(input)
	for(idx=0; idx<dropdown.length; idx++){
		if(!(dropdown[idx].innerText.toUpperCase()).includes(input.value.toUpperCase())){
			dropdown[idx].hidden="true"
		}
		else {
			dropdown[idx].removeAttribute("hidden")
		}

	}
}

function filterPicked(filter) {
	var button = document.getElementById(filter)
	var bonusButtons = document.getElementById("bonusButtons")
	if(button.className.includes(" filterPicked")){
		button.className = button.className.replace(" filterPicked","")
		var newButton = document.getElementById("temp-" + filter)
		newButton.parentNode.removeChild(newButton)
		var index = currentFilters.indexOf(filter);
		currentFilters.splice(index,1);
	}
	else {
		button.className += " filterPicked"
		bonusButtons.innerHTML = bonusButtons.innerHTML + '<button type="button" id = "temp-' + filter
		+  '"class="btn btn-success btn-sm"><i class="fa fa-times-circle" aria-hidden="true"></i> ' 
		+ filter + '</button> '
		var newButton = document.getElementById("temp-" + filter)
		newButton.setAttribute("onclick","filterPicked('" + filter + "')")
		currentFilters.push(filter)
	}
	currentPage = 0;
	pageNumber=1;
	readData();
	updatePage();
	checkButtons();
}

function filterArray(array){
	if (currentFilters.length == 0)
		return array;
	let newIndeces = []

	for(idx in array){

		overlappingFilters = []
		for(filter in currentFilters){
			if(allTags[array[idx]].includes(currentFilters[filter]))
				overlappingFilters.push(currentFilters[filter])
			//console.log(currentFilters.filter(value => allTags[array[idx]].includes(currentFilters[0])))
		}
		
		if(filterType == 0){
			if(overlappingFilters.length > 0){
				newIndeces.push(array[idx])
			}
		}
		else {
			if(overlappingFilters.length == currentFilters.length){
				newIndeces.push(array[idx])
			}
		}

	}
	console.log(newIndeces)
	return newIndeces;
}

function setFilterType(type){
	if(type == filterType){
		return;
	}
	filterType = type;
	if(type == 0){
		document.getElementById("exclusive").setAttribute("class","btn btn-success btn-sm");
		document.getElementById("inclusive").setAttribute("class","btn btn-danger btn-sm");
	}
	else {
		document.getElementById("inclusive").setAttribute("class","btn btn-success btn-sm");
		document.getElementById("exclusive").setAttribute("class","btn btn-danger btn-sm");
	}

	currentPage = 0;
	pageNumber=1;

	readData();
	updatePage();
	checkButtons();
}

function newSearch(){
	searchValue = document.getElementById("searchBox").value;
	currentPage = 0;
	pageNumber = 1;

	readData();
	updatePage();
	checkButtons();
}

function searchTitles(array){
	if(searchValue == "")
		return array;

	newArray = []

	for(idx in array){
		if((videoTitle[array[idx]]).toUpperCase().includes(searchValue.toUpperCase()))
			newArray.push(array[idx])
	}

	return newArray

}
