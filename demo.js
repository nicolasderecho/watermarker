;(function(){

	function updateCoords (coords){
		$("#posx").val(coords.x);
		$("#posy").val(coords.y);
		$("#width").val(coords.width);
		$("#height").val(coords.height);
		$("#opacity").val(coords.opacity);		
	}

	$("#image").watermarker({
		imagePath: "images/watermark.png",
		offsetLeft:30,
		offsetTop: 40,
		onChange: updateCoords,
		onInitialize: updateCoords,
		containerClass: "myContainer container",
		watermarkImageClass: "myImage superImage",		
		watermarkerClass: "js-watermark-1 js-watermark",
		data: {id: 1, "class": "superclass", pepe: "pepe"},		
		onRemove: function(){
			if(typeof console !== "undefined" && typeof console.log !== "undefined"){
				console.log("Removing...");
			}
		},
		onDestroy: function(){
			if(typeof console !== "undefined" && typeof console.log !== "undefined"){
				console.log("Destroying...");	
			}
		}
	});


	$(document).on("mousemove",function(event){
		$("#mousex").val(event.pageX);
		$("#mousey").val(event.pageY);
	});

})();