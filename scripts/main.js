/* jshint devel:true */
$(document).ready(onReady);
function onReady(){
// this renders the towatch list upon pageload
var rendertowatch = function(movie) {
	for(var i=0; i<movie.length;i++){
		$('.towatch').append("<tr>"+movie[i].movie.movie+"</tr>");	
	}
};
var getTowatch = function() {
	$.get('https://tiny-pizza-server.herokuapp.com/collections/charlestowatchf-http', 	
		function(movie) {
			rendertowatch(movie);
	  	},
		'json'
	);
};
getTowatch();
//this renders the watched list upon pageload
var renderwatched = function(movie) {
	for(var i=0; i<movie.length;i++){
		$('.watched').append("<tr>"+movie[i].movie.movie+"</tr>");	
	}
};
var getMovies = function() {
	$.get('https://tiny-pizza-server.herokuapp.com/collections/charlesmoviesf-http', 	
		function(movie) {
			renderwatched(movie);
		},
		'json'
	);
};
getMovies();

//this clears your search results when you press the "Clear Results" button
$("#clearresults").click(function(){
	$('#table').html("");
	$('.search-box').val("");
});
//movieSearch() takes your input/query and runs its through onResultsReceived
function movieSearch(query) {
	$('#table').html("");
	$.get('http://www.omdbapi.com',
		{
		s: query,
		},
		onResultsReceived,
		'json'
	);
};
//when onSearchButtonClick is activated it runs the value in the search-box
//through the function movieSearch
function onSearchButtonClick(){	
	movieSearch($('.search-box').val());	
};
//creates an action from clicking the button - it runs onSearchButtonClick
$('#searchbutton').on('click', onSearchButtonClick);

//onResultsReceived 
function onResultsReceived(data) {
	//this creates a table row with the returned data
	function makeRow(data){
		return '<tr class="tableRow"><td>' + data.Title + '</td>\
		<td>'+data.Year+'</td>'+'</tr>';
	};
	//this appends that row to the #table
	for (var i=0; i<data.Search.length; i++){
		var movieInfo=data.Search[i];
		$('#table').append(makeRow(movieInfo));
	};	
//QUESTION POINT is this where the closing } should be?

//when you click on a table row in #table it appends it to the towatch list and
//posts it to the towatch db
	$("tr").click(function watchlist(){
		$('.towatch').append(this);
		// console.log(this);
		// console.log(this.innerHTML);
		$.post('https://tiny-pizza-server.herokuapp.com/collections/charlestowatchf-http',
			{
				movie: {
					movie: this.innerHTML,
					}
			}, 
				'json'
		);
		//The .off() is here b/c otherwise a duplicate
		//object is created when onClickB() is run.
		$(this).off('click');

		$(this).on('click', onClickB);
//QUESTION POINT is this where another} should go?
		function onClickB(){
			// console.log(this.innerHTML);
			// console.log(this);
			
			$('.watched').append(this);
			$.post('https://tiny-pizza-server.herokuapp.com/collections/charlesmoviesf-http',
				{
					movie: {
						movie: this.innerHTML,
						}
				}, 
				function(movie){
					renderwatched(movie);
					// console.log(movie._id);
				},
				'json'
			)			
			
			var inner=this.innerHTML;
//gitMovies() compares the row you clicked on with the towatch list data and deletes
//the towatch data item if they match
			var gitMovies = function() {
				$.get('https://tiny-pizza-server.herokuapp.com/collections/charlestowatchf-http', 	
					function(john) {
						for(var i=0; i<john.length;i++){
							
							if(john[i].movie.movie===inner){
								console.log("They matched");	
								console.log(inner);
								console.log(john[i].movie.movie);
								console.log(john[i]._id);
								console.log('http://tiny-pizza-server.herokuapp.com/collections/charlestowatchf-http/'+john[i]._id);
									$.ajax({
								    url: 'http://tiny-pizza-server.herokuapp.com/collections/charlestowatchf-http/'+john[i]._id,
								    type: 'DELETE',
									});
							}
						}
					},
					'json'
				);	
			}
			gitMovies();
		}//<--this closes onClickB-->
	})//<--this closes watchlist()-->
}//<--this closes onResultsReceived-->
		

};
// for(var i in this) {
		// console.log('http://tiny-pizza-server.herokuapp.com/collections/charlestowatche-http/'+movie[i].movie._id);
// 	$.ajax({
// 	    url: 'http://tiny-pizza-server.herokuapp.com/collections/charlestowatche-http/'+movie[i]._id,
// 	    type: 'DELETE',
// 	});
// }



