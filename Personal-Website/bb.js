/*
@author Yifan Gu
Two dimensional array to store elements of each cell. 
First coordinate is column second is row.
*/
var database = new Array();

// array of ids of previously selected bubbles
var selected = new Array();
// total score the player got
var total_score = 0;
// the points the player can get if broke current selected bubbles
var current_points = 0;
// the game state; if true the game over.
var over = false;

// time variable
var c=0;
var t;
// user name
var name;

function start() {
	
	// The array containing the information of ecah column's data
	for(var i = 0; i < 15; i ++){
		var tmp = new Array();
		database.push(tmp);
	}
	
        // get the reference for the body
        var body = document.getElementsByTagName("body")[0];

		// creates a <div> element
		var make_center = document.createElement("center");
		var make_center_2 = document.createElement("center");
		var make_center_3 = document.createElement("center");
		var make_center_4 = document.createElement("center");
		
        // creates a <table> element and a <tbody> element
        var tbl     = document.createElement("table");
        var tblBody = document.createElement("tbody");

		var j;
		var i;
		
        // creating all cells
        for (j = 0; j < 8; j++) {
            // creates a table row
            var row = document.createElement("tr");

            for (i = 0; i < 15; i++) {
                // Create a <td> element and a text node, make the text
                // node the contents of the <td>, and put the <td> at
                // the end of the table row

                var cell = document.createElement("td");
				var randomnumber = Math.floor(Math.random()*5);
				var cellt = randomnumber.toString();
				var cellt_2 = "";
				
				//calculate the id
				var id;
				if(i >= 10) {
						id = j.toString() + i.toString();
					} else {
						id = j.toString() + "0" + i.toString();
					}
				
				// set the image (span tag)	
				var img = document.createElement("span");
				img.setAttribute("class", "type_" + cellt);
				img.setAttribute("id", "s" + id);
				
                		cell.appendChild(img);
				database[i][j] = cellt;
                		cell.setAttribute("id", id);
				var funcCall = "circle(" + "\"" + id + "\"" + ")";
				cell.setAttribute("onclick", funcCall);
				row.appendChild(cell);
            }

            // add the row to the end of the table body
            tblBody.appendChild(row);
        }

        // put the <tbody> in the <table>
        tbl.appendChild(tblBody);
		// appends <table> into <center>
		make_center.appendChild(tbl);
        // appends <center> into <body>
        body.appendChild(make_center);
        // sets the border attribute of tbl to 2;
        tbl.setAttribute("border", "0");

		// add score to it.
		var div_points = document.createElement("p");
		div_points.setAttribute("id", "score_region");
		var div_total = document.createElement("p");
		div_total.setAttribute("id", "total_score");
		div_total.innerHTML = "Total score is 0";
		
		make_center_2.appendChild(div_points);
		make_center_3.appendChild(div_total);
		body.appendChild(make_center_2);
		body.appendChild(make_center_3);
		
		// set restart button
		var restart_form = document.createElement("form");
		restart_form.setAttribute("method","post");
		var restart_button = document.createElement("input");
		restart_button.setAttribute("type", "button");
		restart_button.setAttribute("value", "Restart");
		restart_button.setAttribute("onclick", "window.location.reload()");
		
		// set timer div
		var timer_input = document.createElement("p");
		timer_input.setAttribute("id", "txt");
		
		var br = document.createElement("br");
		
		restart_form.appendChild(timer_input);
		restart_form.appendChild(br);
		restart_form.appendChild(restart_button);
		
		make_center_4.appendChild(restart_form);
		
		body.appendChild(make_center_4);
		
		timedCount();

    }

/*
Function used to timing.
*/
function timedCount()
{
	if(!over) {
		document.getElementById('txt').innerHTML = "Time used : " + c;
		c=c+1;
		t=setTimeout("timedCount()",1000);
	}
	
}

/*
Find all possible bubbles can be selected then call main function
*/

function circle(id) {
	var cells = new Array();
	var tmp = new Array();
	
	// add the selected bubble itself to array
	cells.push(id);

	// add all the surrounding ones
	tmp = check_around(id);
	cells = cells.concat(tmp);

	
	var newcells = new Array();

	// continue to look for further ones until all are found
	for (var i = 1; i < cells.length; i++) {
		newcells =  check_around(cells[i]);
		tmp = check_new(cells, newcells);
		if(tmp.length != 0) {
			cells = cells.concat(tmp);
		}
	}
	
	main_function(cells);

}

/* 
main fucntion to control the game
there are two states: first is nothing is selected,
the other one is some bubbles are selected
*/

function main_function(cells) {

	// to check the game state to see if game is over
	if(over) {
		alert("Congrats! Game over! Your score is " + total_score + "! Please input your name and see your ranking!");
	} else {
		//if the player want to break currently selected ones.
		if( arraysAreEqual(cells, selected) ) {
			// if only one bubble is selected.
			if(selected.length == 1) {
				//deactivate(selected);
				return;
			} else {
				mark_selected(selected);
				updown_move_update();
				lr_move_update();
				score_and_view_update();
				deactivate(selected);
				selected = new Array();
			}	

		} else {
			// if the player selects the bubble not in the previously selected
			// if select the blank ones
			var tmp_1 = cells[0];
			var tmp_row = Math.round( tmp_1 / 100 );
			var tmp_col = tmp_1 % 100;
			var tmp_2 = database[tmp_col][tmp_row]; 
			if(tmp_2 == "*") {
				return;
			}

			deactivate(selected);
			selected = cells;
			view_update(cells);
		}
		// check if the game is over
		over = check_over();
	}
}

/*
Drop the bubbles then the bubbles below them are broken by 
updating the database.
*/

function updown_move_update() {
	
	// Check every cell.
	// First shift all elements in one column to a temp array but not
	// including "#". Then move them back into the column, if the length 
	// of the column is not 8, padd "*" to it until its length is 8.
	for(var i = 0; i < 15; i++) {
		
		var tmp = new Array();
		do {
			var cur = database[i].shift();

			if(cur == "#") {
				
			} else if(cur == "*") {
				
			} else {
				tmp.unshift(cur);
			}
			
		} while(database[i].length > 0)
		
		while(tmp.length > 0){
			var cur_2 = tmp.shift();
			database[i].unshift(cur_2);
		}
		
		while(database[i].length < 8) {
			database[i].unshift("*");
		}
		
	}
}

/*
Move the column of bubbles to right if a ceertain column of bubbles are
broken.
*/

function lr_move_update() {
	
	var flag;
	
	for(var i = 0; i < 15; i++) {
		flag = check_empty(database[i]);
		if(flag) {
			lr_move_helper(i);
		}
	}
}

/*
to check if a column of bubbles in database are all broken. 
*/

function check_empty(ary) {
	
	var flag = true;
	var cur;
	
	for(var j = 0; j < ary.length; j++) {
		cur = ary[j];
		if(cur == "*") {
			
		} else {
			flag = false;
			break;
		}
	}
	
	return flag;
}

/*
Helper function of lr_move_update.
*/

function lr_move_helper(i) {
	
		var tmp = new Array();
		
		for(var j = i; j > 0; j--) {
			tmp = database[j];
			database[j] = database[j-1];
			database[j-1] = tmp;
		}
}

/*
Mark bubbles that need to be broken by "#" in database.
*/

function mark_selected(selected) {
	
	var col;
	var row;
	var id;
	
	for(var i = 0; i < selected.length; i++) {
		id = selected[i];
		row =  Math.round( id / 100 );
		col = id % 100;
		database[col][row] = "#"
	}
}

/*
Update the score and view after certain bubbles being broken.
*/

function score_and_view_update() {
	var row;
	var col;
	var id;
	
	// points update
	var temp = document.getElementById("score_region");
	temp.innerHTML = "";
	
	var temp_2 = document.getElementById("total_score");
	total_score = total_score + current_points;
	
	temp_2.innerHTML = "Total score is " + total_score.toString();
	current_points = 0;
	
	// View update.
	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 8; j++){
			if(i < 10) {
				col = "0" + i.toString();
			} else {
				col = i.toString();
			}
			if(j == 0) {
				row = "0";
			} else {
				row = j.toString();
			}
			id = row + col;
			change_bg(id);
		}
	}
}

/*
Helper function of score_and_view_update.
Change the background to corresponding image.
*/

function change_bg(id) {
	
	var row = Math.round( id / 100 );
	var col = id % 100;
	var num = database[col][row];
	
	var img = document.getElementById("s" + id);
	img.setAttribute("class", "type_" + num);

}

/*
If the player selects other bubbles other than previous ones.
Then add border to new ones and pdate possible points at the 
same time.
*/
function view_update(cells) {
	
	// points one can get selecting current bubbles
	var temp = document.getElementById("score_region");
	var points;
	
	if(cells.length == 1) {
		points = 0;
	} else {
		points = cells.length * cells.length;
	}
	current_points = points;
	temp.innerHTML = "Points are " + points.toString();
	
	for(var i = 0; i < cells.length; i++) {
		var tmp = document.getElementById(cells[i]);
		tmp.setAttribute("class", "thickBorder");
	}
}

/*
Remove the borders of previous previously selected ones.
*/

function deactivate(selected) {
	
	if(selected.length == 0) {
		return;
	}
	
	for(var i = 0; i < selected.length; i++) {
		var tmp = document.getElementById(selected[i]);
		tmp.setAttribute("class", "");
	}
	
	return;
}

/*
Compare if the elements of two arrays are equal. 
Not necesarrily in the same order.
*/

function arraysAreEqual(ary1,ary2){
	if(ary1.length == ary2.length) {
		
		var i;
		var j;
		var tmp = 0;
		
		for( i = 0; i < ary1.length; i++) {
			
			for( j = 0; j < ary2.length; j++) {
				
				if(ary1[i] == ary2[j]){
					
					tmp++;
					break;
				}
				
			}
			
		}
		
		if(tmp == ary1.length) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
	} else {
		
		return false;
		
	}
	
  return (ary1.join('') == ary2.join(''));
}

/*
Check if there is any new elements in array new_one but 
not in array old. If any, return them in an array.
*/

function check_new(old, new_one) {
	
	// return the new ones in new_one.
	
	var ret = new Array();
	var flag = 0;
	var i;
	var j;
	
	for( i = 0; i < new_one.length; i++) {
		for( j = 0; j < old.length; j++) {
			if(new_one[i] == old[j]) {
				flag = 1;
				break;
			}
		}

		if(flag == 1) {
			flag = 0;
		} else {
			ret.push(new_one[i])
		}
	}
	
	return ret;
}

/*
Find bubbles with same content as the one with ID id 
from four positions: up, down, right and left.
*/

function check_around(id) {
	var cells = new Array();

	//var target = document.getElementById(id).innerHTML;
	var row =  Math.round( id / 100 );
	var col = id % 100;
	var target = database[col][row];
	
	// find all coordinates of four bubbles around the clicked bubble
	
	var id1;
	var id2;
	var id3;
	var id4;
	
	if( row > 0) {
			id1 = (row-1)*100 + col;
		} else {
			id1 = -1	
		}
	if( row < 7) {
			id2 = (row+1)*100 + col;
		} else {
			id2 = -1	
		}
	if( col > 0) {
	 		id3= row*100 + (col-1);
		} else {
			id3 = -1;	
		}
	if( col < 14){
			id4 = row*100 + (col+1);
		} else {
			id4 = -1;
		}

	// pad the coordinate if row is zero
	
	if( ((0<id1) && (id1<10)) || (id1 == 0) ) {
		id1 = "00" + id1.toString();
	}
	else if( ((10<id1) && (id1<100)) || (id1 == 10) ) {
		id1 = "0" + id1.toString();
	}
	if( ((0<id2) && (id2<10)) || (id2 == 0) ) {
		id2 = "00" + id2.toString();
	}
	else if( ((10<id2) && (id2<100)) || (id2 == 10) ) {
		id2 = "0" + id2.toString();
	}
	if( ((0<id3) && (id3<10)) || (id3 == 0)) {
		id3 = "00" + id3.toString();
	}
	else if( ((10<id3) && (id3<100)) || (id3 == 10) ) {
		id3 = "0" + id3.toString();
	}
	if( ((0<id4) && (id4<10)) || (id4 == 0) ) {
		id4 = "00" + id4.toString();
	}
	else if( ((10<id4) && (id4<100)) || (id4 == 10) ) {
		id4 = "0" + id4.toString();
	}
	
	// check if there is some surrounding bubble with the same color.
	// if so, push it to the array then return the array cell.

	if(id1 != -1){
		var tmp_row = Math.round( id1 / 100 );
		var tmp_col = id1 % 100;
		var tmp_1 = database[tmp_col][tmp_row]
		if(tmp_1 == target) {
			cells.push(id1);
		}
	}
	if(id2 != -1){
		var tmp_row = Math.round( id2 / 100 );
		var tmp_col = id2 % 100;
		var tmp_2 = database[tmp_col][tmp_row]
		if(tmp_2 == target) {
			cells.push(id2);
		}
	}
	if(id3 != -1){
		var tmp_row = Math.round( id3 / 100 );
		var tmp_col = id3 % 100;
		var tmp_3 = database[tmp_col][tmp_row]
		if(tmp_3 == target) {
			cells.push(id3);
		}
	}
	if(id4 != -1){
		var tmp_row = Math.round( id4 / 100 );
		var tmp_col = id4 % 100;
		var tmp_4 = database[tmp_col][tmp_row]
		if(tmp_4 == target) {
			cells.push(id4);
		}
	}
	
	return cells;
	
}

/*
Check if there is any possible bubbles to be broken.
If yes return false, otherwise return true.
*/

function check_over() {
	
	var tmp = new Array();
	var col;
	var row;
	var id;
	
	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 8; j++){
			if(database[i][j] != "*"){
				
				if(i < 10) {
					col = "0" + i.toString();
				} else {
					col = i.toString();
				}
				if(j == 0) {
					row = "0";
				} else {
					row = j.toString();
				}
				id = row + col;
				tmp = check_around(id);
				if(tmp.length > 0) {
					return false;
				}
			}
		}
		
	}
	
	alert("Congrats! Game over! Your score is " + total_score + "! Please input your name and see your ranking!");
	
	input_name();
	
	return true;
}

/*
When the game is over, it create the region where the player can input his name.
*/
function input_name() {
	
		var name_input = document.createElement("input");
		name_input.setAttribute("type", "text");
		name_input.setAttribute("name", "name_form");
		
		var name_form = document.createElement("form");
		name_form.setAttribute("method","post");
		var submit_button = document.createElement("input");
		submit_button.setAttribute("type", "button");
		submit_button.setAttribute("value", "See my ranking");
		submit_button.setAttribute("onclick", "submit_cgi_script(this.form)");
		
		var br = document.createElement("br");
		
		var name_msg = document.createElement("div");
		name_msg.setAttribute("id", "total_score");
		var tmpText = document.createTextNode("Please input your name below:");
		name_msg.appendChild(tmpText);
		
		name_form.appendChild(name_msg);
		name_form.appendChild(br);
		name_form.appendChild(name_input);
		name_form.appendChild(br);
		name_form.appendChild(submit_button);
		
		var body = document.getElementsByTagName("body")[0];
		body.appendChild(name_form);
}

function submit_cgi_script(form) {
	
	name = form.name_form.value;

	document.location = "http://localhost:31075/cgi-bin/topScore.pl?name=" +name+ "&score=" + total_score;
}

