//TO DO : 
// Permitir girar la imagen
// Que la opcion de girar o resizear sean opcionales
//  Permitir al watermark salirse de foco

;(function($){

	var isPreservedAttribute = function(attribute){
		preserverdAttributes = ["containerClass", "watermarkerClass", "watermarkImageClass"];
		return ($.inArray(attribute, preserverdAttributes) > -1);
	}

	var getClassForAttribute = function(attributeName, attributeValue, defaultValue){
		return isPreservedAttribute(attributeName) && (attributeValue !== undefined && attributeValue !== null ) ? (defaultValue + " " + attributeValue) : defaultValue;
	}

	var getCoords = function(element){
		if(element !== undefined && element !== null){
			var opt = { x:element.offsetLeft,
				y:element.offsetTop,
				width: element.offsetWidth,
				height: element.offsetHeight,
				opacity: parseFloat ( $(element).find("img").css("opacity") ).toFixed(2)
			}
			opt.jsonCoords = JSON.stringify(opt);
			opt.element = element;
			return opt;
		}
	}

	var isFirstWatermark = function(data){
		return data === undefined || data === null || data.length == 0;
	}

	var jQueryClassName = function(className){
		if(className !== undefined && className !== null && className.length > 0){
			return className[0] == "." ? className : "." + className;
		}
	}

	var getClassName = function(className){
		if(className !== undefined && className !== null && className.length > 0){
			return className[0] == "." ? className.substring(1) : className;
		}
	}

	var setOpacity = function(element, opacity){
		$(element).css("opacity", opacity);
	}

	var getOpacity = function(element){
		return $(element).css("opacity");
	}	

	var destroyWatermarker = function(elements){
		var $elements = $(elements);
		$elements.each(function(){
			var $self = $(this);
			var data = $self.data("pluginWatermarker");
			$.each(data,function(){
				var element = this;
				//element.element.appendTo(element.container.parent());
				//element.container.remove();
				element.onRemove(element.watermark,element);
				element.watermark.remove();
				//element.watermarkImage.remove();
				//element.resizer.remove();
				
			});
			if (data.length > 0){
				var firstWatermark = data[0];
				$(firstWatermark.element).appendTo($(firstWatermark.container).parent());
				$(firstWatermark.container).remove();
				$(document).off("mousedown", jQueryClassName(data[0].eventTriggerClass) + " " + jQueryClassName(data[0].watermarkerClass));
				$(document).off("mousedown", jQueryClassName(data[0].eventTriggerClass) + " " + jQueryClassName(data[0].resizerClass));			
				data[0].onDestroy(data[0].element, data[0]);
			}
			$self.removeData("pluginWatermarker");
		});		
	}

	var removeWatermark = function(watermarkImageContainer, element){
		
		var $element = $(element);
		var data = $element.data("pluginWatermarker");
		var dataToRemove;
		if (data.length > 1){
			for (var index = 0; index < data.length; index++ ){
				if( (data[index].watermark !== undefined && watermarkImageContainer !== undefined ) && (data[index].watermark[0] === watermarkImageContainer[0]) ){
					dataToRemove = data[index];
					data.splice(index,1);
					break;
				}
			}
			$element.data("pluginWatermarker", data);
			dataToRemove.onRemove(dataToRemove.watermark,dataToRemove);
			watermarkImageContainer.remove();
		}
		else{
			destroyWatermarker(element);
		}

		//sacar del array
		//volar el watermarker
		//si era el unico watermark que habia, hacer destroy
	}

	var addWatermark = function(element, options){
		var $self = $(element);
		var data = $self.data("pluginWatermarker");
		if( data !== undefined && data !== null){
			data.push($.watermarker($self, options));
		}
		else{
			data = [];
			data.push($.watermarker($self, options));	
		}
		$self.data("pluginWatermarker",data);		
	}

	$.watermarker = function(object, userOptions){

		//Initialize
		var options = defineOptions(userOptions);
		var containerClassName = getClassForAttribute("containerClass",userOptions.containerClass, options.containerClass);
		var watermarkerClassName = getClassForAttribute("watermarkerClass",userOptions.watermarkerClass, options.watermarkerClass);
		var watermarkImageClassName = getClassForAttribute("watermarkImageClass",userOptions.watermarkImageClass, options.watermarkImageClass);		
		var container = $("<div>",{"class":containerClassName});
		container.width(object.width());
		container.height(object.height());
		var watermark = $("<div>",{"class":watermarkerClassName, "data": userOptions.data}).css("left",options.offsetLeft).css("top",options.offsetTop);
		var watermarkImage = $("<img>", {src: options.imagePath, "class": watermarkImageClassName});
		var resizer = $("<div>",{"class":options.resizerClass});
		var data = $(object).data("pluginWatermarker");
		if(isFirstWatermark(data)){
			container.appendTo($(object).parent());
			object.appendTo(container);			
		}
		else{
			container = $(object).parent();
		}
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
				onRemove: function(){},
				imagePath: "images/watermark.png",
				removeIconPath: "images/close-icon.png",
				eventTriggerClass: "watermarker-wrapper",
				containerClass: "watermarker-wrapper",
				watermarkerClass: "watermarker-container",
				watermarkImageClass: "watermarker-image",
				removeClass: "watermarker-remove-item",
				resizerClass: "resizer",
				draggingClass: "dragging",
				resizingClass: "resizing",
				offsetLeft: 0,
				offsetTop: 0,
				allowRemove: true,
				aspectRatio: undefined
			};
			for(var attribute in options){
				if(options.hasOwnProperty(attribute) && !isPreservedAttribute(attribute) && attribute != "data"){
					defaults[attribute] = options[attribute];	
				}
			}
			return defaults;
		}

		function getClassName(className){
			if(className === undefined || className === null){return;}
			return className[0] == "." ? className.substring(1) : className;
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

		var dragEvent = function(event){
			$(this).addClass(draggingClass());
			var cssLeft = parseInt($(this).css("left"));
			var leftDifference = event.pageX - cssLeft;
			var cssTop = parseInt($(this).css("top"));
			var topDifference = event.pageY - cssTop;
			//$(this).data("difX", parseInt( $(this).css("left") ) - event.pageX + document.body.scrollTop);
			$(this).data("difX", leftDifference);
			$(this).data("difY", topDifference);
			//$(this).data("difY", parseInt( $(this).css("top") ) - event.pageY + document.body.scrollTop);
			$(document).on("mousemove",drag);
			$(document).on("mouseup",drop);
			return false;
		};

		var resizeEvent = function(event){
			var resizer = $(this);
			var watermarkToResize = resizer.closest("." + options.watermarkerClass);
			options.resizer = resizer;
			resizer.addClass(resizingClass());
			resizer.data("startPositionX", event.pageX);
			resizer.data("startPositionY", event.pageY);
			resizer.data("startWidth", watermarkToResize.width());
			resizer.data("startHeight", watermarkToResize.height());
			$(document).on("mousemove",resize);
			$(document).on("mouseup",stopResizing);
			return false;
		};


		var drag = function(event){
			var element = document.querySelector("." + draggingClass());
			if (element === undefined || element === null){return;}
			var container = element.parentNode;
			//var left = parseInt(event.pageX) + $(element).data("difX") + "px";
			var left = parseInt(event.pageX) - $(element).data("difX") + "px";
			//var top = parseInt(event.pageY)  + $(element).data("difY") + "px";
			var top = parseInt(event.pageY)  - $(element).data("difY") + "px";
			element.style.left = checkPositionX(left,element);
			element.style.top  = checkPositionY(top,element);
			options.onChange(getCoords(element));
		}

		var drop = function(event){
			$(document).off("mousemove",drag);
			$("." + draggingClass()).removeClass(draggingClass());
		}

		var resize = function(event){
			var resizerElement = $(options.resizer );
			var element = resizerElement.parent()[0];
			//var width = parseInt(event.pageX) /*- $(options.container).offset().left */- parseInt(element.style.left.length > 0 ? element.style.left : 0 ) ;
			var width = resizerElement.data("startWidth") + event.pageX -  resizerElement.data("startPositionX");
			//var width = parseInt(event.pageX) - $(options.container).offset().left - $(element).position().left ;
			var height;
			if(options.aspectRatio !== undefined && options.aspectRatio !== null){
				height = width / options.aspectRatio;
			}else{
				//height = parseInt(event.pageY) /*- $(options.container).offset().top*/ - parseInt(element.style.top.length > 0 ? element.style.top : 0);	
				height = resizerElement.data("startHeight") + event.pageY -  resizerElement.data("startPositionY");
			}
			$(element).width(checkWidth(width,element));
			$(element).height(checkHeight(height,element));
			options.onChange(getCoords(element));
		}

		var stopResizing = function(event){
			$(document).off("mousemove",resize);
			$(document).off("mouseup",stopResizing);
			var resizerElement = $(options.resizer);
			resizerElement.removeClass(resizingClass());
			resizerElement.removeData("startPositionX");
			resizerElement.removeData("startPositionY");
			resizerElement.removeData("startWidth");
			resizerElement.removeData("startHeight");			
			options.resizer = undefined;
		}

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

		if (isFirstWatermark(data)){
			$(document).on("mousedown", jQueryClassName(options.eventTriggerClass) + " " + jQueryClassName(options.watermarkerClass), dragEvent);
			$(document).on("mousedown", jQueryClassName(options.eventTriggerClass) + " " + jQueryClassName(options.resizerClass), resizeEvent);			
		}

		if(options.allowRemove){
			var $removeContainer = $("<div>",{"class": options.removeClass});
			var $img = $("<img>", {src: options.removeIconPath});
			$removeContainer.append($img);
			$(watermark).append($removeContainer);
			$(watermark).on("click", "." + getClassName(options.removeClass), function(event){
				removeWatermark($(this).closest("." + getClassName(options.watermarkerClass)), options.element);
			});
		}

		options.container = container;
		options.watermark = watermark;
		options.watermarkImage = watermarkImage;
		options.resizer = resizer;
		options.element = object;
		options.onInitialize(getCoords(options.watermark[0]));
		return options;

	}

	$.fn.watermarker = function(options){
		var watermarkerArguments = arguments;
		if (typeof options === "string"){
			switch(options){
				case "destroy":
					destroyWatermarker($(this),options);
					break;
				case "opacity":
					var opacityNumber;
					switch(watermarkerArguments.length){
						case 1:
							opacityNumber = getOpacity($(this).first());	
							break;
						case 2:
							opacityNumber = getOpacity(watermarkerArguments[1])
							break;
						case 3:
							var data = $(this).data("pluginWatermarker")[0];
							var argument = $(watermarkerArguments[1]); 
							var elementToChange = ( argument.hasClass(getClassName(data.watermarkImageClass)) ? argument : argument.find(jQueryClassName(data.watermarkImageClass)) );
							opacityNumber = setOpacity(elementToChange, watermarkerArguments[2]);
					}
					return opacityNumber;
					break;
				case "remove":
					if(watermarkerArguments.length > 1 && $(this).length == 1){
						removeWatermark(watermarkerArguments[1], this,options);
					}
					break;
			}

		}
		else{
			return $(this).each(function(){
				
				addWatermark(this, options)

			});			
		}

		return this;
	}


})(jQuery);

