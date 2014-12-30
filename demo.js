;(function(){

	function updateCoords (coords){
		debugger;
		$("#posx").val(coords.x);
		$("#posy").val(coords.y);
		$("#width").val(coords.width);
		$("#height").val(coords.height);
		$("#opacity").val(coords.opacity);		
	}

	$("#image").watermarker({
		imagePath: "assets/watermark.png",
		offsetLeft:30,
		offsetTop: 40,
		onChange: updateCoords,
		onInitialize: updateCoords,
		onRemove: function(){
			debugger;
			console.log("Removing...");
		},
		onDestroy: function(){
			console.log("Destroying...");
		}
	});

})();
