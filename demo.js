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
		watermarkImageClass: "myImage image",		
		watermarkerClass: "js-watermark-1 js-watermark",
		resizerClass: "myResizer",		
		onRemove: function(){
			console.log("Removing...");
		},
		onDestroy: function(){
			console.log("Destroying...");
		}
	});

})();
