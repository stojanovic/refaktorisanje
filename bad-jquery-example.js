var layer_counter = 0; 
var layer_id = 0;
var cnt = 0;

var selected = 0;
var layer_group_selected = 0;
var z_index = 1;
var layer_selected = 0;
var group_selected = new Array();
var test = 0;
var tabs = false;

var gcdf = {
	id: null,
	version: 0.2,
	name: null,
	resources: [],
	toString: function(){
		return "Id: "+this.id+", "+
			   "Name: "+this.name+", "+
			   "Version: "+this.version+", "+
			   "Resources: "+this.resources.length+" Nodes";
	}
}
 
var dump;

$R = $('div.resources');	

$this = { // for use for global scope;

	file_name : false,
	files : null
	
};

$($(this)).click(function(argument) {
	$(this).on('hover',function(){
		$(this).click();
		$("#delete")
	})
});

//----------------------------- New -------------------
var selected_layer = "";
var selected_folder = "";

var game;
var backStack = [];
function Sprite(data){
    for (var key in data) 
        this[key] = data[key]; 
}
var fileCache = [];
var modified = false;

function getModified(){
	return modified;
}

$(document).ready(function () {

	///$.ajaxSetup({cache: false});

	$("#sidebar #sortable").sortable({
		forceHelperSize: true,
		forcePlaceholderSize: true,
		revert: true,
		revert: 150,
		placeholder: "highlight panel",
		axis: "y",
		tolerance: "pointer",
		cancel: ".content"
	}).disableSelection();

	// $("#sidebar #sortable .panel").resizable({
	// 	cancel: ".content",
	// 	handles: "s"
	// });

 	// // TODO: layer group sortable revert glich.
  //   $("#layer_groups").sortable({
  //   	forceHelperSize: true,
 	// 	forcePlaceholderSize: true,
 	// 	revert: true,
 	// 	revert: 150,
  //       placeholder: "highlight",
  //       axis: "y",
  //       tolerance: "pointer",
  //   }).disableSelection();


    // Make the layers draggable / resizable only once
	$("#main #canvas").on("mouseover", ".layer:not(.ui-resizable)", function(event){
		$(this).draggable({
			snap: ".layer",
			stop: function( event, ui ){
				var id = $(this).attr("data-id");
				gcdf.resources.getById(id).setCoordinates(
					$(this).position().left,
					$(this).position().top
				);
				modified = true;
			}
		}).resizable({
			snap: ".layer", 
			handles: "all",
			zIndex: 0,
			stop: function( event, ui ){
				var id = $(this).attr("data-id");
				console.log(id);
				gcdf.resources.getById(id).setDimensions(
					$(this).width(),
					$(this).height()
				);
				modified = true;
			}
		});
	}).on("click", '.layer', function(){
	
		//layer_selected = $(this);

		//Asume that something has a selected layer.
		//$('.selected').removeClass('.selected');
		//$('.inner_layer', this).get(0).addClass('.selected');

	});

	// Make the (LIVE) layers draggable only once
	$("#live_resources").on("mouseover", '.draggable', function(event){
		$(this).draggable({
			cancel: "div.placeholder, input, button",
			containment: "document", 
			scroll: false
		});
	});
	

	x = 0;
	//$('#menubar li a').each(function(){
		//console.log($(this).html());
	//});

	var tabCounter = 2;

	/*$('#container_id').fileTree({
    	root: '../ckge/',
    	script: './filetree/jqueryFileTree.php',
    	expandSpeed: 300,
    	collapseSpeed: 300,
    	multiFolder: true
    }, function(file) {

    	efile = file.split("/");
    	efile = efile[efile.length-1];

    	console.log('ckge/'+file);

    	var tabTitle = efile+' '+$R.find('.close-tab').outerHTML(),
        	tabContent = $R.find('.tabftmp').attr('src','textedit/editor.php?file=ckge/'+file).addClass("tabs-" + tabCounter).outerHTML(), //<iframe src="http://localhost/game/textedit/editor.php?file='.file.'"></iframe>',
        	tabTemplate = $R.find('.tabtemp').clone();
        
		var	id = "tabs-" + tabCounter,
			li = $(tabTemplate);
			$(tabTemplate).find('a').attr('href','#'+id).append(tabTitle);
			//$(li).hide();

        tabs.find( ".ui-tabs-nav" ).append(li); 
        tabs.append('<div id="'+id+'">' +tabContent+ '</div>');
		tabs.tabs("refresh");

		$(".ui-tabs-nav li #ui-id-"+tabCounter).trigger('click');
		tabCounter++;

    });

	$('.close-tab').on('click',function(){
		var panelId = $( this ).closest( "li" ).fadeOut('fast',function(){$(this).remove()}).attr("aria-controls");
        $( "#" + panelId ).fadeOut('fast', function(){
        	$(this).remove();
        	tabs.tabs("refresh");
        });
	});*/

	/*$('.layers').css({ss
		'top': top,
		'left': left = $(document).width() - $('.layers').width() - 25,
	});
	
	$('.materials').css({
		'top': top + 30 + $('.layers').height(),
		'left': left,
	});*/
	
	
	//$(".materials_browser").resizable({ minHeight: 132, minWidth: 126 })
		

	$(".draggable").draggable({
		cancel: "div#scrolling, .content",
		containment: "document" 
	});

	$('.resizable').resizable({
		handles: "all",
		zIndex: 0,
		containment: "document" 
	});
	

	// $("#game_preview, #code_editor").draggable({
	// 	start: function(event, ui) {  $('.iframe_fix').css('display','block');  },
	// 	stop: function(event, ui) { $('.iframe_fix').css('display','none');  }
	// });

	$("#code_editor").resizable({
		resize: function(event, ui) { editor.resize(); }
	});

	$("#sidebar #layers").on("click", ".layer", function(e){

		$(".layer.selected").removeClass("selected");
		$(this).addClass('selected');

		var classes = $(this).attr("class");
		    classes = classes.split(" ");
		selected_layer = "."+classes[1];
		e.stopPropagation();

	});

	$("#sidebar #layers").on("click", ".folder", function(e){

		$(".folder.selected").removeClass("selected");
		$(this).addClass('selected');

		var classes = $(this).attr("class");
		    classes = classes.split(" ");
		selected_folder = "."+classes[1];
		e.stopPropagation();

	});
	
	$("#tabs").tabs();
	$(document).on('dragstart', "img", function(event) { 
		event.preventDefault(); 
	});

	$(window).bind('beforeunload', function(){
  		return 'Changes have not been saved!';
	});
	
	// $(".draglayer").draggable();
	// tabs = $("#tabs").tabs();
}); // Document ready // Main Meniu


var new_game_submit = false;
$("#new_game form").on("submit",function(e){

	if( new_game_submit == false ){

		new_game_submit = true;
		var name = $(this).find("input[name=name]").val();

		parent = $(this).find("button")
		parent.addClass("loading");

		createFolder(name,obj.id,function(result){
			$("#new_game").fadeOut("fast",function(){
				$('.fader').fadeOut("fast");
				$("#new_game input[name=name]").val("");
				if(obj.children == undefined ) 
					obj.children = [];
				obj.children.unshift(result);
				getGames(obj);
				new_game_submit = false;
				parent.removeClass("loading");
			});
		});

	}

	e.preventDefault();
}); // Creating a new Game


$("#main").on("click", function(e){

	selected_folder = "";
	$(".folder.selected").removeClass("selected");
});


$("#main #canvas").on("dblclick", ".layer", function(e){
	
	$(this).addClass("selected");
	e.stopPropagation();
});


$('.new_folder').click(function(){ 

	dialog("Create new folder","Enter your folder name","_input", {
	    
	    'OK' : function(){
	    	
	        var reply = $('.dialog_input').val();

	        if( reply != null && reply != "" ){

	        	var name = "fn_"+reply.split(' ').join('_');
	        	var parent = "";

	        	if(selected_folder != "" ){
	        		parent = selected_folder+" .content";
	        	}

	        	$R.find(".folder").clone()
	        		.addClass(name).find("h3").html(reply).end()
	        		.appendTo("#layer_groups "+parent);

	        	$R.find(".folder_group").clone()
	        		.addClass(name).appendTo('#canvas '+selected_folder);

	        }

	    }

	});
}); // Create a new folder group


$('.new_layer').click(function(){ 

	dialog("Create new layer","Enter your layer name","_input", {
	    
		'OK' : function(){
	    	
			var reply = $('.dialog_input').val();

			if( reply != null && reply != "" ){

				var name = "ln_"+reply.split(' ').join('_');
				var parent = "";

				if(selected_folder != "" ){
	        		parent = selected_folder+" .content";
				}

				$R.find(".layer").clone()
	        		.addClass(name).html(reply)
	        		.appendTo("#layer_groups "+parent);

				$R.find(".layers_group").clone()
	        		.addClass(name).appendTo('#canvas '+selected_folder);

	        }

	    }

	});
}); // Create a new layer group


$('#layer_groups').on('div','click', function(event){

	// Reset to make sure that not two are selected
	//$('.selected').removeClass('selected');

	$(this).addClass('selected');
	
	console.log(this);
});

$('#filebrowser').on('click','li.folder',function(e){

    var index = $(this).attr('index');
    var html = "";
    
    if( $(this).hasClass('back') ) {
      
      // Set the to the old list.
      game = backStack.pop();
      $this.files = game;
      if(backStack.length != 0){
        html = "<li class='folder back'>back</li>";
      }

    } else {

      // Store current level for return;
      backStack.push(game);

      // Move the level up one;
      game = game[index];
      $this.files = game;

      // Add a default back button
      html = "<li class='folder back'>back</li>";

    }

    html = html + inside(game.children);

    $('#filebrowser').html(html);
    e.stopPropagation();
}); // When you click on folder.


/* Fade in any window with correct class "open"
   (optional) provide "fade" to have fader 
   Eg: class="open test_window fader" */ 
$("button.open, a.open").on("click", function() {
	
	var name = $(this).attr('class');
		name = name.split(' ');

	$('#'+name[1]).center().css('z-index',z_index++).fadeIn('fast');
		
	if( name[2] == "fade" ){
		$('.fader.panels').css('z-index',z_index-2).fadeIn('fast');
	}

});

$('.list_of_games').on("click",".game",function(){
	$('.selected').removeClass("selected");
	$(this).addClass("selected");
});

$('.list_of_games').on("dblclick",".game",function(){

	var index = $(this).attr('id');
	
	game = obj.children[index];
	if(game.children === undefined) 
		game.children = [];
	
	$('#filebrowser').append(inside(game.children));
	getImages(game.children);
	getScripts(game.children);
	//alert(1);

	$('#intro').fadeOut('fast');
	$('#body_container').fadeIn('fast');
	//$('.selected').removeClass("selected");

	//alert($(this).html());

}); // Show main panel of double click of game.

$("#canvas").on('mousemove', function(e){
	
	if (e.ctrlKey){

		var img = $(this).find('.loltest')
		
		if( img.length == 0 ){
			
			$('#material_placeholder img').clone()
				.addClass("loltest")
				.hide()
				.fadeIn("fast")
				.appendTo($(this));

		} else {

			if( img[0].src != $('#material_placeholder img')[0].src){
				img[0].src = $('#material_placeholder img')[0].src
			}

			var offset = $(this).offset();
			img.css({
				position : "absolute",
				display : "block",
	  			left:  (e.pageX-offset.left)-img.width()/2,
				top:   (e.pageY-offset.top)-img.height()/2,
				opacity: 0.4
			})

		}

	} else {

		$(".loltest").fadeOut("fast");

	}

}); // Show a placeholder next to the mouse

$(document).on('click', '.layer', function(e){

	e.stopPropagation();
	return false;
});

$(document).on('dblclick', '#canvas', function(e){

	// if(selected_layer != ""){ //must have layer selected

	// 	var material = $('#material_placeholder img');
	// 	var image_src = material.attr('src');

	// 	$('.resources .layer').clone(true,true).addClass((layer_id++).toString()).css({
	// 		'background-image': 'url('+image_src+')',
	// 		'background-repeat': 'repeat',
	// 		'width': material.width(), 
	// 		'height': material.height(),
	// 		'left':  $('#canvas').scrollLeft() + e.offsetX - (material.width()/2),
	// 		'top':  $('#canvas').scrollTop() + e.offsetY - (material.height()/2)
	// 	}).appendTo('#canvas '+selected_folder+" "+selected_layer);

	// } else dialog("Error","You must have a layer selected materials/entities.","_prompt");

	var material = $('#material_placeholder img');
	var image_src = material.attr('src');

	if(image_src == "") return false; // No image provided;

	var spr = new Sprite({
		id: layer_id,
		link: material.attr("data-img-id"),
		x: $('#canvas').scrollLeft() + e.offsetX - (material.width()/2),
		y: $('#canvas').scrollTop() + e.offsetY - (material.height()/2),
		width: material.attr("data-real-width"),
		height: material.attr("data-real-height")
	});

	$('.resources .layer').clone(true,true)
		.attr('data-id',spr.id+"")
		.attr('data-img-id',spr.link)
		.css({
			'background': 'url('+image_src+') repeat',
			'width': spr.width,
			'height': spr.height,
			'left':  spr.x,
			'top':  spr.y
		})
	.appendTo('#canvas');

	gcdf.resources.push(spr);
	layer_id++;
	modified = true;
	e.stopPropagation();

	
});  // Create a layer from a double click action 2.0

$('#code_sidebar').on('click','li.default',function(){

	$(".selected").removeClass("selected"); 
    $(this).addClass("selected");

	var id = $(this).attr("data-id")
	var parent = $(this);
	
	var data = fileCache.getById(id);
	if( data !== undefined )
		return editor.setValue(data["data"]);

	$(this).addClass("loading");

	$.ajax({ url: "/static/javascript/core.js", dataType:"text"})
	.done(function(data){
		fileCache.push({"id":id,"data":data});
		parent.removeClass("loading");
		editor.setValue(data);
	});

});

$('#code_sidebar').on('click','li:not(.default, .selected, .loading)',function(){

	var pre_id = $(".selected").attr("data-id");
	fileCache.getById(id).data = editor.getValue();

	$(".selected").removeClass("selected"); 
    $(this).addClass("selected");

	var id = $(this).attr("data-id")
	var file = game.children.getById(id);
	var parent = $(this);

	var data = fileCache.getById(id);
	if( data !== undefined ){	
		if( parent.hasClass('unsaved') ){
			editor.setValue(data["data"]);
		} else {
			editor.setValue(data["data"]);
			parent.removeClass("unsaved");
		}
		return;
	}

	$(this).addClass("loading");

	downloadFile(file,function(data){
		fileCache.push({"id":id,"data":data});
		//load_entities();
		editor.setValue(data);
		parent.removeClass("unsaved");
		parent.removeClass("loading");
	});

})

$('.new_entity').on('click',function(){
	if($(this).hasClass("loading") == false){
		
		var parent = $(this).addClass('loading');
		var name = $('#enitity_name').val();
		var type = $('#enitity_type').val();
		var clas = $('#enitity_class').val();

		var output = "var "+name+" ";

		switch(type){
			case 'instance': output+="= new "+clas+"();\n	";
				break;
			case 'prototype': output+="= function(){\n	// Constructor\n	}\n\n	"
											+name+".prototype = new "+clas+"();\n	";
				break;
		}

		createFile(name+".js",output,game.id,function(result){
			parent.removeClass('loading');
			game.children.unshift(result);
			var script = getScript(result);
			script.trigger('click');
			$(".code_editor").trigger('click');
			$(this).addClass('loading');
		});
	}
});


$('#code_sidebar').on('click','.delete',function(e){
	var file = $(this).parent();
	var id = file.attr("data-id");

	dialog("Delete","Are you sure you want to delete?","_confirm",{
		'Yes' : function(){
			file.addClass("loading");
			deleteFile(id,function(reply){
				file.removeClass("loading");
				file.slideUp("fast",function(){$(this).remove()});
				fileCache.removeById(id);
				return true;
			});
			return false;
		}
	});

	e.stopPropagation();
});


$("#enitity_classname").on("change",function(e){

	var entity = Entities.getByName($(this).val());

	var spr = new Sprite({
		id: layer_id,
		link: entity.name,
		x: $('#canvas').scrollLeft() + ($('#canvas').width()/2),
		y: $('#canvas').scrollTop() + ($('#canvas').height()/2),
		width: entity.width,
		height: entity.height
	});

	$('.resources .layer').clone(true,true)
		.attr('data-id',spr.id+"")
		.attr('data-link',spr.link)
		.css({
			'background-color': 'red',
			'width': spr.width,
			'height': spr.height,
			'left':  spr.x,
			'top':  spr.y
		})
	.appendTo('#canvas');

	gcdf.resources.push(spr);
	layer_id++;
	e.stopPropagation();


});


function fun(){
	return "i just opened you...";
}



// Open/Close the folder
$('#layers').on('dblclick', '.header', function(event){
	//console.log( $(this).parentsUntil('.folder').html() );
	$(this).closest('.folder').children('.content').slideToggle('fast');
	$(this).children('.foldersizing').toggle(); 
});


$('.dropdown_logo').click(function(){
	
	if( $('.logo_menu_list').css('display') != "none" ){
		$('.logo_menu_list').slideUp('fast');
		$(this).attr('src','images/dropdown.gif');
	} else {
		 $('.logo_menu_list').slideDown('fast');
		 $(this).attr('src','images/dropup.gif');
	}
}); // Drop down of the logos box


//////// DEFO NEED ////////////////////////

$('div.titlebar').on('click', ".close", function(){
	
	var $panel = $(this).parent().parent();
	$panel.fadeOut('fast');
	
	$('.fader').fadeOut('fast'); // fades out the bg

	/*if( $obj.hasClass('permanent') ) {
		$obj.remove();
	}*/


	//var link = $(this).parent().parent().attr('class');
	//	link = link.split(" ");
	
	//$('.'+link).fadeOut('fast'); // fades out the box
	//$('#fader').fadeOut('fast'); // fades out the bg
	
	//if(link)

	//$(".menu [link='"+link+"']").removeClass('visable');	
}); // Close any specific open dragable box v2.0

$('.titlebar .sizing').on('click',function(){
	$(this).parent().parent().find('.content').slideToggle('fast');
	$(this).parent().find('.sizing').toggle();
}); // Minimize/Maximise a window v2.0

$('.panel.draggable').mousedown(function(){
	
	$(this).css('z-index',z_index);
	z_index++; //update it by 1;
	return true;
}); // Update the z-index of a dragable box v3.0

$('.hide_all').click(function(){
	
	if( !$(this).hasClass('visable') ){
		
		$('.window li a').each(function(index, element) {
			
			var link = $(element).attr('link');
			$('.'+link).fadeOut('fast');
			$('.window [link="'+link+'"]').removeClass('visable');
			
		});
		
	}
}); // Hide all windows on screen

$(".material_browser").on('click',function(){
		
		$('.materials_browser').center().fadeIn('fast');
}); // Show the materials window in center on button click v2.0

$('#canvas').on("click", '.remove_layer', function(e){
	var id = $(this).parent().attr('data-id');
	$(this).parent().fadeOut('fast',function(){
		$(this).remove();
	});
	gcdf.resources.removeById(id);
	modified = false;
	e.stopPropagation();
});  // Remove a specific layer from a group V2.0


$("select#layer_groups").change(function (){ 
	
	group_selected = []; // Empty out an array *fixes mutly select bug*
	
	$("select#layer_groups option:selected").each(function(index,value){
	
		group_selected[index] = $(value);
		
	});

}); // Select the correct layer group(s)


$('#resources').on('click','img',function(){ 

	var image_src = $(this).attr('src');
	var link = $(this).attr('data-img-id');
	var width = $(this).attr('data-real-width');
	var height = $(this).attr('data-real-height');

	$('#material_placeholder img')
		.attr('src',image_src)
		.attr('title',image_src)
		.attr('data-img-id',link)
		.attr('data-real-height',height)
		.attr('data-real-width',width);
		
}); // Insert a layer into a materials dialog





$('.material_add').click(function(){
	var material = $('.material_img');
	var image_src = material.attr('src');
		
	$( group_selected ).each(function(index,value){
			
		$('.resources .layer').clone(true,true).addClass((layer_id++).toString()).css({
			'background-image': 'url('+image_src+')',
			'background-repeat': 'repeat',
			'width': material.width(), 
			'height': material.height()
		}).appendTo('#canvas .layers_group.' + $(value).html());
		
	});	
	
}); // Create a layer in main screen from material



$('.hide_layer_group').click(function(){  

	$( group_selected ).each(function(index,value){
		
		$('#canvas .layers_group.' + $(value).html()).hide('slow');
		
	});
}); // Hide one or more layer groups

$('.show_layer_group').click(function(){ // hide the perent layer

	$( group_selected ).each(function(index,value){
		
		$('#canvas .layers_group.' + $(value).html()).show('slow');
		
	});
}); // Show one ore more layer groups

$(".del_layer_group").click(function(){

	$( group_selected ).each(function(index,value){

		var number_of_children = $('#canvas .layers_group.' + $(value).html() + ' div').length;
		
		if( number_of_children > 0 ){ // If one or more exist then promt user
			
			if(confirm( $(value).html()+" layer has "+number_of_children+" children layer(s). Are you sure you wan't to delete it?")){
				
				$('select .layers_group.' + $(value).html()).remove();
				$('#canvas .layers_group.' + $(value).html()).remove();
				$(".aplha").val(''); // Update the alpha;
								
			}
			
		} else { // no layers whiing a group, just delete it.
			
			$('select .layers_group.' + $(value).html()).remove();
			$('#canvas .layers_group.' + $(value).html()).remove();
			$(".aplha").val(''); // Update the alpha
		
		}
		
	});	
}); // Delete one or more layer groups

$("input.aplha").click(function() {
	
	if( group_selected.length > 0 ){
		
		var opacity = $(this).val();
		
		$( group_selected ).each(function(index,value){
			
			console.log($(value).html());
			
			$('#canvas .layers_group.'+ $(value).html()).css({ opacity: opacity/100 });
			
		});
	
	} 
});  // Change the alpha of the layer groups 



$('#save_as #scrolling table').on('click','tr',function(){
	$('#save_as .input_file_name').val( $(this).find('.a').html() );
	$('#save_as #scrolling table tr').removeClass('selected');
	$(this).addClass('selected');
	
}); // Replace the file name of save as dialog

$('#open #scrolling table').on('click','tr',function(){
	
	$('#open .input_file_name').val( $(this).find('.a').html() );
	$('#open #scrolling table tr').removeClass('selected');
	$(this).addClass('selected');
	
}); // Replace the file name of open dialog

/*$(".layer").live('dblclick',function(){
	
	//do some when double clicked,
	var reply = prompt("width & height", parseInt($(this).css('width')) +"|"+ parseInt($(this).css('height')) );
	var size = reply.split('|');
	
	$(this).css('width' , size[0]);
	$(this).css('height', size[1]);
	$(this).css('overflow', 'hidden');
	
	//alert(reply[0]+" - "+reply[1]);
	
}); // Double click a layer*/



/*$(".layer").on("click", function(){
	
	layer_selected = $(this);
	
	$(".layer_propertie.name").val( "Top: "+parseInt($(this).css('top')) +", Left:"+parseInt($(this).css('left')) );
	
	if( $(this).hasClass("collidable") ) {
		
		$(".layer_propertie.collidable").attr("checked","checked");
	
	}else $(".layer_propertie.collidable").removeAttr("checked");
	
	$(".layer_propertie.width").val( $(this).width() );
	$(".layer_propertie.height").val( $(this).height() );
	
	//alert(10);
	
}); */ // Click on a layer*/

$('.tools img').click( function(){
	
	$('.tools img').each(function(index, element) {
		
		$(element).removeClass('tool_selected');
		
	});
	
	$(this).addClass('tool_selected');
	
});

$('.btn_export_code').click(function(){

	var output = $('div.export select').attr('value'); //raw | game
	
	switch(output){
	
		case 'raw': $('div.export textarea').val( output_level_data() );
			break;
			
		case 'raw_2' : $('div.export textarea').val( output_tidy_level_data() );
			break;
			
		case 'raw_3' : $('div.export textarea').val( beautify_level_data($('div.export textarea').val()) );
			break;
			
		case 'raw_4' : $('div.export textarea').val( uglify_level_data($('div.export textarea').val()) );
			break;
			
		case 'game': $('div.export textarea').val( output_game_code() );
			break;
		
	}

	if( $('div.export textarea').html() == "" ){
		 $('div.export textarea').html("Nothing was outputted");
	}
	
}); // Export Actual Code


/*$('#canvas .droppable').droppable({drop: 
	function( event, ui ) {
			
		var id   = ui.draggable.attr('id');
			
		var div = $('.update_container').clone();
		div.find('.in_name').val( ui.draggable.find('div').html() );
		div.find('.in_desc').val( ui.draggable.attr('description') );
		div.attr('class', 'uc_1 hidden');
			
		$(this).html( div ).attr('class','asd');
		$('.uc_1').slideDown('fast'); 
			
	}
}); *///????????????????

$(".layer_propertie").click(function(){
	
	if( $(".layer_propertie.collidable").attr('checked') ) {
		
		$(layer_selected).addClass("collidable");
		
	}
	
	else $(layer_selected).removeClass("collidable");
	
}); // Layer Properties settings


$('.menu_item').hover(
  function () {
    $(this).parent().find('>ul').fadeIn('fast');
  }
);

$('#menubar li')
	.mouseleave(
		function () {
	    	$(this).find('ul').fadeOut(0);
	  	}
	)
	.click(function(){
		$(this).find('ul').fadeOut(0);	
});


$(".setting").click(function(){
	
	var setting = $(this).attr('name');
	var boolean = ($(this).attr('checked'))? 1 : 0 ;
	var value = $(this).val();
	
	switch(setting){
		
		case 'disable':
			if(boolean) $('.live_draggable').liveDraggable({ disabled: true });
			else $('.live_draggable').liveDraggable({ disabled: false });
			console.log(setting+" "+boolean+" "+value);
			break;
	
		case 'snap':
			if(boolean) $('.live_draggable').liveDraggable({snap: true});
			else $('.live_draggable').liveDraggable({snap: false});
			console.log(setting+" "+boolean+" "+value);
			break;
		
		case 'grid':
			$('.live_draggable').liveDraggable({grid: value});
			console.log(setting+" "+boolean+" "+value);
			break;	
			
		case 'snapmode':
			$('.live_draggable').liveDraggable({snapMode: value});
			console.log(setting+" "+boolean+" "+value);
			break;	
			
		case 'snaptolerance':
			$('.live_draggable').liveDraggable({snapTolerance: value});
			console.log(setting+" "+boolean+" "+value);
			break;	
			
		case 'delay':
			$('.live_draggable').liveDraggable({delay: value});
			console.log(setting+" "+boolean+" "+value);
			break;
			
	}
	
});  // Setting options varables


function  beautify_level_data(output) {	

	data = output.split('|');
	layers = data[0].split(',');
	resources = data[1].split(',');
	links = data[2].split(',');	
	
	var test = "";
	var length = layers.length;
	for ( var i=0; i<length; ++i ){
		test += layers[i]+",\n";
	}
	
	test = test.slice(0, -2) + '|\n\n';
	
	var length = resources.length;
	for ( var i=0; i<length; ++i ){
		test += resources[i]+",\n";
	}
	
	test = test.slice(0, -2) + '|\n\n';
	
	var length = links.length;
	for ( var i=0; i<length; ++i ){
		test += links[i]+",\n";
	}
	
	test = test.slice(0, -2);
	
	return test;
	
}

function uglify_level_data(output) {
	
	return output.replace(/(\r\n|\n|\r)/gm,"");
	
}

$(document).keydown(function(e){

	//alert(e.keyCode);
	var selected = layer_selected;

	if(selected != 0){
	 
	  switch(e.keyCode){
		case 65: //this is left! (a)aa
		  
			$(selected).css('left',parseInt($(selected).css('left'))-1);
			
		  break;
		case 87: //this is up! (w)
		 
			$(selected).css('top',parseInt($(selected).css('top'))-1);
		  
		  break;
		case 68: //this is right (d)
		
			$(selected).css('left',parseInt($(selected).css('left'))+1);
		  
		  break;
		
		case 83: //this is down! (s)
		
			$(selected).css('top',parseInt($(selected).css('top'))+1);
		 
		  break;
		  
		case 67: //dublicate object
			
			console.log('.'+$("select option:selected").val());
			
			$(selected).clone().appendTo( '#canvas .group#'+$("select option:selected").val() );
		 
		 break;
		 
	  }
	  
	   
	  console.log($(selected).css('left'),(selected).css('top'));
	  
	}

});


function validAuth(){
	if(obj.length == 0){ //Nothing in the google drive that bellongs to this app. Create folder.
		createFolder("obj",null,function(result){
			$("#intro .content").fadeToggle('fast');
			obj = result;
			obj.children = [];
			console.log(result);
		});
	} else {
		getGames(obj);
		$("#intro .content").fadeToggle('fast');
	}
}

function invalidAuth(){
	$('.revalidate').fadeIn("fast");
    //authButton.style.display = 'block';
    $(".revalidate_btn").click(function(e) {
    	e.preventDefault();
        gapi.auth.authorize(
            {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
            handleAuthResult);
    });
}

function getGames(data){

	var index;
	var length = 0;
	//console.log(data);
	if(data.children){
		length = data.children.length;
	}
	$(".list_of_games").html("");  //Clearn;
	for (index = 0; index < length; ++index) {
		$R.find(".game").clone()
			.attr("id",index).html(data.children[index]["title"])
			.attr("title",data.children[index].id.split('0BwoqcQo3Edp3')[1])
			.appendTo(".list_of_games");
	}

}

function getImages(data){

	for (i in data) {
		if( (/image/i).test(data[i].mimeType) ){
			$R.find(".resource").clone()
				.find("img")
					.attr("src",data[i]["webContentLink"])
					.attr("data-img-id",data[i]["id"])
					.attr("data-real-width",data[i]["imageMediaMetadata"]["width"])
					.attr("data-real-height",data[i]["imageMediaMetadata"]["height"])
				.end().appendTo("#resources .content");
		}
	}

}

function getScripts(data){

	for (i in data) {
		if( data[i].fileExtension === "js" ){
			$R.find(".script")
				.clone()
				.prepend(data[i]["title"])
				.attr("data-id",data[i]["id"])
				.appendTo("#code_sidebar ul")
				//.trigger("click");
		}
	}

}

function getScript(data){

	return $R.find(".script")
			.clone()
				.html(data["title"])
				.attr("data-id",data["id"])
			.hide()
			.insertAfter("#code_editor .default")
			.fadeIn("fast");

}

function getImage(data){

	if( (/image/i).test(data.mimeType) ){
		
		getMeta(data.id,function(meta){
			$R.find(".resource").clone()
				.find("img")
					.attr("src",meta["webContentLink"])
					.attr("data-img-id",meta["id"])
					.attr("data-real-width",meta["imageMediaMetadata"]["width"])
					.attr("data-real-height",meta["imageMediaMetadata"]["height"])
				.end()
				.hide()
				.prependTo("#resources .content")
				.fadeIn("fast");
		});

	}
	
}



$(".alist_of_games").on("contextmenu",".game",function(e) {
    e.preventDefault();
    alert(1);
    // create and show menu
});

function inside(events){
temp = "";
var len = events.length;
for (i=0;i<len;i++) {
  var type = "";
  if (events[i].mimeType=="application/vnd.google-apps.folder"){
    type = "folder";
  } else type = "file";

  temp += "<li id='"+events[i].id+"' class='"+type+"' index='"+i+"''>&nbsp;&nbsp;"+events[i].title+ "</li>";
}
return temp;
}

// var timeout;
// var saving = false;
// var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
// 	lineNumbers: true,
// 	matchBrackets: true,
// 	onChange: function(cm){
// 		if(saving) return true;
// 		$('#modified').fadeIn('slow');
// 		clearTimeout(timeout);
// 		timeout = setTimeout(function(){ 
// 			saving = true;
// 			$('#modified').fadeOut('fast', function(){
// 				$.ajax({
// 					type: "POST",
// 					url: "./../save_edited_file.php",
// 					data: { file:"<?php echo $_GET['file']?>" ,data: cm.getValue() }
// 				}).done(function(html) {
// 					console.log(html);
// 					$('#saved').fadeIn('slow').delay(300).fadeOut('fast', function(){saving = false});
// 				});
// 			});
// 		}, 2000);
// 	}
// });



(function ($) { 
	$.fn.getimage = function () {
		image = $(this).css('background-image');
		image = image.split('/');
		return image[image.length-1].slice(0, -1)
	};
}(jQuery));


Array.prototype.getById = function(id) {
	for(i in this) 
		if ( this[i].id == id ) return this[i];
}

Array.prototype.updateById = function(id,data) {
	for(i in this) 
		if ( this[i].id == id ) return this[i]=data;
}

Array.prototype.getByName = function(name) {
	for(i in this) 
		if ( this[i].name == name ) return this[i];
}

Array.prototype.removeById = function(id) {
	for(i in this) 
		if ( this[i].id == id ) return this.splice(i,1);
}

Sprite.prototype.setCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
}

Sprite.prototype.setDimensions = function(width, height) {
    this.width = width;
    this.height = height;
}


$('#dropfile').on('dragleave',function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#dropfile").fadeOut("fast");
    //console.log("dragenter");
});

$('div#dropfile').on('dragover',function(e) { e.preventDefault(); e.stopPropagation(); });
$('div#dropfile').on('dragenter',function(e) { e.preventDefault(); e.stopPropagation(); });

$(document).on('dragover','#body_container',function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#dropfile").fadeIn("fast");
    //console.log("dragenter");
});

$(document).on('dragover','#body_container',function(e) {e.preventDefault(); e.stopPropagation();});

$('div#dropfile').on('drop',function(e){
	$("#dropfile").fadeOut("fast");
	if(e.originalEvent.dataTransfer){
		if(e.originalEvent.dataTransfer.files.length) {
			e.preventDefault();
    		e.stopPropagation();

			var files = e.originalEvent.dataTransfer.files;
			var total = e.originalEvent.dataTransfer.files.length;
			var index = 0; // Store the index
			var store = function() {

				var info = $('#n_info')
					.find("b").html(index+1+"/"+total).end()
					.find("p").html(files[index].name).end();

				if (typeof FileReader !== "undefined" && (/image/i).test(files[index].type)) {
					var img = info.find("img.inf_prev")[0];
					reader = new FileReader();
					reader.onload = (function (theImg) {
							return function (evt) {
								theImg.src = evt.target.result;
							};
						}(img));
					reader.readAsDataURL(files[index]);					
				
				} else { info.find("img.inf_prev")[0].src = ""; }

				info.fadeIn("fast");
				
				insertFile(files[index],game.id,function(result){
				    console.log(result);
					game.children.unshift(result);
					getImage(result);
					index++;
					if(files[index]) store();
					else info.fadeOut("fast");
				});
				
    		};

    		store();

			// insertFile(files[0],function(result){
			// 	console.log(result);
			// });

			// var reader = new FileReader();
			// 	reader.readAsDataURL(files[0]);
   			//console.log(reader);
        }   
    }
});

function load_entities(){

	for(key in fileCache){
		eval(fileCache[key].data);
	}

	var ent_len = (Entities.length);

	$("#enitity_classname").html("");

	for(i=0; i<ent_len; i++){

	  //if( /*typeof window[key] === "function" &&*/ 
	  	//window[key] instanceof Entity){


	  		// $R.find(".entity").clone()
	  		// 	.find(".ent")
	  		// 		.css({
	  		// 			"background":"red",
	  		// 			"width": Entities[i].width,
	  		// 			"height": Entities[i].height,
	  		// 		})
	  		// 	.end()

	  		$R.find('.entity').clone()
				.addClass(Entities[i].name)
				.html(Entities[i].name)
				.attr("value",Entities[i].name)
				.attr("data-id",i)
				.appendTo("#enitity_classname");

	     //console.log(key + " is a function using Entity as its prototype property");
	     //console.log(window[key].x);
	     //console.log(window[key]);
	  //}
	}


}




////////////////////////////////////////// PLUGINS //////////////////////////////////////////////////////
////////////////////////////////////////// PLUGINS //////////////////////////////////////////////////////
////////////////////////////////////////// PLUGINS //////////////////////////////////////////////////////


// thank you who ever live dragalbe elements
/*(function ($) { 
	$.fn.liveDraggable = function (opts) {
		this.live("mouseover", function() {
			//if (!$(this).data("init")) {
				$(this).data("init", true).draggable(opts);
			//}
		});
	return $();
	};
}(jQuery));

(function ($) {  // kinda dedited it my self;
	$.fn.liveResizable = function (opts) {
		this.live("mouseover", function() {
			$(this).resizable(opts);
		});
	return $();
	};
}(jQuery));

/// write this my self :)
(function ($) { 
	$.fn.getimage = function () {
		image = $(this).css('background-image');
		image = image.split('/');
		return image[image.length-1].slice(0, -1)
	};
}(jQuery));




jQuery.fn.flashText = function () {
	
	this.css('color','#7aacff');
	this.fadeOut('fast').fadeIn('slow');
	this.fadeOut('fast').fadeIn('slow').queue(function () {
		$(this).css('color','#808080');
    	$(this).dequeue();
  	});
		
}; */



//(function(a){function f(b,c,d){var e=a.ui.resizable.prototype[b];a.ui.resizable.prototype[b]=function(){if(d)d.apply(this,arguments);e.apply(this,arguments);if(c)c.apply(this,arguments)}}function e(a){return parseInt(a.css("margin-top"),10)||0}function d(a){return parseInt(a.css("margin-left"),10)||0}function c(a){return a.sort(function(a,b){return!a?1:!b?-1:Math.abs(a)-Math.abs(b)})[0]}function b(a,b,c){return Math.abs(a)<c?-a:Math.abs(b)<c?-b:0}a.extend(a.ui.resizable.prototype.options,{snapTolerance:20,snapMode:"both"});a.ui.plugin.add("resizable","snap",{start:function(){var b=a(this),c=b.data("resizable"),f=c.options.snap;c.ow=c.helper.outerWidth()-c.size.width;c.oh=c.helper.outerHeight()-c.size.height;c.lm=d(b);c.tm=e(b);c.coords=[];a(typeof f=="string"?f:":data(resizable)").each(function(){if(this==c.element[0]||this==c.helper[0])return;var b=a(this),f=b.position(),g=f.left+d(b),h=f.top+e(b);c.coords.push({l:g,t:h,r:g+b.outerWidth(),b:h+b.outerHeight()})})},resize:function(){var d=[],e=[],f=[],g=[],h=a(this).data("resizable"),i=h.axis.split(""),j=h.options.snapTolerance,k=h.options.snapMode,l=h.position.left+h.lm,m=l-j,n=h.position.top+h.tm,o=n-j,p=l+h.size.width+h.ow,q=p+j,r=n+h.size.height+h.oh,s=r+j;a.each(h.coords,function(){var c=this,h=Math.min(q,c.r)-Math.max(m,c.l),t=Math.min(s,c.b)-Math.max(o,c.t);if(h<0||t<0)return;a.each(i,function(a,i){if(k=="outer"){switch(i){case"w":case"e":if(h>j*2)return;break;case"n":case"s":if(t>j*2)return}}else if(k=="inner"){switch(i){case"w":case"e":if(h<j*2)return;break;case"n":case"s":if(t<j*2)return}}switch(i){case"w":d.push(b(l-c.l,l-c.r,j));break;case"n":e.push(b(n-c.t,n-c.b,j));break;case"e":f.push(b(p-c.l,p-c.r,j));break;case"s":g.push(b(r-c.t,r-c.b,j))}})});if(g.length)h.size.height+=c(g);if(f.length)h.size.width+=c(f);if(d.length){var t=c(d);h.position.left+=t;h.size.width-=t}if(e.length){var t=c(e);h.position.top+=t;h.size.height-=t}}});f("_mouseStop",null,function(){if(this._helper){this.position={left:parseInt(this.helper.css("left"),10)||.1,top:parseInt(this.helper.css("top"),10)||.1};this.size={width:this.helper.outerWidth(),height:this.helper.outerHeight()}}});f("_mouseStart",function(){if(this._helper){this.size={width:this.size.width-(this.helper.outerWidth()-this.helper.width()),height:this.size.height-(this.helper.outerHeight()-this.helper.height())};this.originalSize={width:this.size.width,height:this.size.height}}});f("_renderProxy",function(){if(this._helper){this.helper.css({left:this.elementOffset.left,top:this.elementOffset.top,width:this.element.outerWidth(),height:this.element.outerHeight()})}});var g=a.ui.resizable.prototype.plugins.resize;a.each(g,function(a,b){if(b[0]=="ghost"){g.splice(a,1);return false}});a.each(a.ui.resizable.prototype.plugins.start,function(b,c){if(c[0]=="ghost"){var d=c[1];c[1]=function(){d.apply(this,arguments);a(this).data("resizable").ghost.css({width:"100%",height:"100%"})};return false}})})(jQuery);

/* Query.fn.outerHTML = function(s) {
	return s
    	? this.before(s).remove()
    	: jQuery("<p>").append(this.eq(0).clone()).html();
};	

$('.live_draggable').liveDraggable({ snap: ".live_draggable", zIndex: 1});
//$('.draggable').dr

$('.live_resizable').liveResizable({ snap: true,  zIndex: 1, 
	start: function(event, ui) { console.log(event,ui); },
	handles: "all"
});*/
