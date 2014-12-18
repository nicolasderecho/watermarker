;(function(){

	$("#image").watermarker({
		offsetLeft: 30,
		offsetTop: 40,
		aspectRatio: (16/9),
		onChange: function(coords){
			$("#posx").val(coords.x);
			$("#posy").val(coords.y);
			$("#width").val(coords.width);
			$("#height").val(coords.height);
			$("#opacity").val(coords.opacity);
		}
	});

})();
