//TO DO : 
// Permitir girar la imagen
// Que la opcion de girar o resizear sean opcionales
//  Agregar mas de un watermark
//  Permitir al watermark salirse de foco

;(function($){


	var getCoords = function(element){
		var opt = { x:element.offsetLeft,
			y:element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight,
			opacity: parseInt ( $(element).css("opacity") )
		}
		opt.jsonCoords = JSON.stringify(opt);
		opt.element = element;
		return opt;
	}

	$.watermarker = function(object, options){

		//Initialize
		var options = defineOptions(options);
		var container = $("<div>",{class:options.containerClass});
		container.width(object.width());
		container.height(object.height());
		var watermark = $("<div>",{class:options.watermarkerClass}).css("left",options.offsetLeft).css("top",options.offsetTop);
		var watermarkImage = $("<img>", {src: options.imagePath, class: options.watermarkImageClass});
		var resizer = $("<div>",{class:options.resizerClass});
		container.appendTo($(object).parent());
		object.appendTo(container);
		watermarkImage.appendTo(watermark);
		resizer.appendTo(watermark);
		watermark.appendTo(container);
		watermark.height(checkHeight(watermark.height(), watermark[0]));


		// Methods

		function defineOptions(options){
			var defaults = {
				onChange: function(){},
				onInitialize: function(){},
				onDestroy: function(){},
				imagePath: "images/watermark.png",
				containerClass: "watermarker-wrapper",
				watermarkerClass: "watermarker-container",
				watermarkImageClass: "watermarker-image",
				resizerClass: "resizer",
				draggingClass: "dragging",
				resizingClass: "resizing",
				offsetLeft: 0,
				offsetTop: 0,
				aspectRatio: undefined
			};
			for(attribute in options){
				if(options.hasOwnProperty(attribute)){
					defaults[attribute] = options[attribute];	
				}
			}
			return defaults;
		}


		function resizingClass(){
			return options.resizingClass[0] == "." ? options.resizingClass.substring(1) : options.resizingClass;
		}

		function draggingClass(){
			return options.draggingClass[0] == "." ? options.draggingClass.substring(1) : options.draggingClass;
		}

		var checkPositionX = function(left, element){
			var container = element.parentNode;
			var maxPositionX = positionX(container) + container.offsetWidth;
			if ( parseInt(left) <= 0 ) return "0px";
			if ( parseInt(left) + element.offsetWidth > maxPositionX ) return maxPositionX - element.offsetWidth + "px";
			return left;
		}

		var checkPositionY = function(top, element){
			var container = element.parentNode;
			var maxPositionY = positionY(container) + container.offsetHeight;
			if ( parseInt(top) <= 0 ) return "0px";
			if ( parseInt(top) + element.offsetHeight > maxPositionY ) return maxPositionY - element.offsetHeight + "px";
			return top;
		}


		function checkWidth(width, element){
			var container = element.parentNode;
			var maxWidth =  container.offsetWidth - element.offsetLeft;
			if ( parseInt(width) <= 0 ) return 0 ;
			if ( parseInt(width) > maxWidth ) return maxWidth;
			return width;
		}

		function checkHeight(height, element){
			var container = element.parentNode;
			var maxHeight =  container.offsetHeight - element.offsetTop;
			if (options.aspectRatio != undefined) height = $(element).width() / options.aspectRatio;
			if ( parseInt(height) <= 0 ) return 0 ;
			if ( parseInt(height) > maxHeight ) return maxHeight;
			return height;
		}	

		var drag = function(event){ 
			var element = document.querySelector("." + draggingClass());
			var container = element.parentNode;
			var left = parseInt(event.pageX) + $(element).data("difX") + "px";
			var top = parseInt(event.pageY)  + $(element).data("difY") + "px";
			element.style.left = checkPositionX(left,element);
			element.style.top  = checkPositionY(top,element);
			options.onChange(getCoords(element));
		}

		var drop = function(event){
			$(document).off("mousemove",drag);
			$("." + draggingClass()).removeClass(draggingClass());
		}

		var resize = function(event){
			var element = $( document.querySelector( "." + options.resizerClass) ).parent()[0];
			var width = parseInt(event.pageX) - parseInt(element.style.left.length > 0 ? element.style.left : 0 ) ;
			var height;
			if(options.aspectRatio !== undefined && options.aspectRatio !== null){
				height = width / options.aspectRatio;
			}else{
				height = parseInt(event.pageY)  - parseInt(element.style.top.length > 0 ? element.style.top : 0);	
			}
			$(element).width(checkWidth(width,element));
			$(element).height(checkHeight(height,element));
		}

		var stopResizing = function(event){
			$(document).off("mousemove",resize);
			$("." + resizingClass()).removeClass(resizingClass());
		}

		var dragEvent = function(event){
			$(this).addClass(draggingClass());
			$(this).data("difX", parseInt( $(this).css("left") ) - event.pageX + document.body.scrollTop);
			$(this).data("difY", parseInt( $(this).css("top") ) - event.pageY + document.body.scrollTop);
			$(document).on("mousemove",drag);
			$(document).on("mouseup",drop);
			return false;
		};

		var resizeEvent = function(event){
			$(this).addClass(resizingClass());
			$(this).data("difX", parseInt(this.style.left.length > 0 ? this.style.left : 0) - event.pageX + document.body.scrollTop);
			$(this).data("difY", parseInt(this.style.top.length > 0 ? this.style.top : 0 ) - event.pageY + document.body.scrollTop);
			$(document).on("mousemove",resize);
			$(document).on("mouseup",stopResizing);
			return false;
		};


		var positionX = function(element){
			var target = $(element)[0];
			var posX = target.style.left.length > 0 ? parseInt(target.style.left) : 0;
			return posX;
		}

		var positionY = function(element){
			var target = $(element)[0];
			var posY = target.style.top.length > 0 ? parseInt(target.style.top) : 0;
			return posY;
		}	

		container.on("mousedown","." + options.watermarkerClass, dragEvent);
		container.on("mousedown","." + options.resizerClass, resizeEvent);

		options.container = container;
		options.watermark = watermark;
		options.watermarkImage = watermarkImage;
		options.resizer = resizer;
		options.element = object;

		return options;

	}


	var setOpacity = function(element, opacity){
		$(element).css("opacity", opacity);
	}

	var getOpacity = function(element){
		return $(element).css("opacity");
	}	

	var destroyWatermarker = function(elements,options){
		var $elements = $(elements);
		$elements.each(function(){
			var $self = $(this);
			var $element = $self.data("pluginWatermarker");
			$element.element.appendTo($element.container.parent());
			$element.container.remove();
			$element.watermark.remove();
			$element.watermarkImage.remove();
			$element.resizer.remove();
			$self.removeData("pluginWatermarker");
			$element.onDestroy($element.element, $element);				
		});		
	}

	$.fn.watermarker = function(options){
		var watermarkerArguments = arguments;
		if (typeof options === "string"){
			switch(options){
				case "destroy":
					destroyWatermarker($(this),options);
					break;
				case "opacity":
					if (arguments.length > 1){
						$(this).each(function(){
							var image = $(this).data("pluginWatermarker").watermarkImage;
							var opacity = watermarkerArguments[1];
							setOpacity(image,opacity);
						});							
					}
					if(arguments.length == 1){
						return getOpacity($(this).first());						
					}
					break;
			}

		}
		else{
			return $(this).each(function(){
				var $self = $(this);
				if($self.data("pluginWatermarker") === undefined){
					$self.data("pluginWatermarker",$.watermarker($self, options));									
				}

			});			
		}

		return this;
	}


})(jQuery);

