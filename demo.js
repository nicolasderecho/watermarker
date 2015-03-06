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
		data: {id: 1, "class": "superclass", pepe: "pepe"},		
		onRemove: function(){
			console.log("Removing...");
		},
		onDestroy: function(){
			console.log("Destroying...");
		}
	});


	$(document).on("mousemove",function(event){
		$("#mousex").val(event.pageX);
		$("#mousey").val(event.pageY);
	});

})();

/*
Hola! Mi nombre es Nicolas. Estaba buscando alojamiento para pasar alguno de los proximos feriados largos con mi novia (el de marzo o el de abril). En ambos casos mi idea era llegar a la mañana del primer dia y permanecer hasta el 4to dia a la tarde/noche. queria saber:

Tienen disponibilidad para alguna de esas fechas? cual seria el precio?
Hay proveeduria cercana a las cabañas para ir a pie?
*/