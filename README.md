#Watermarker

Add watermarks to your images!
 
###Installation

If you want to use this in your project, you only need to add the following scripts

```HTML
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<link rel="StyleSheet" href="watermarker.css" type="text/css">
<script type="text/javascript" src="watermarker.js"></script>
```


###How to use

In the HTML of our project, create the required image. For example:

```HTML
<html>
    <head>
        <script src="jquery-1.9.1.min.js"></script>
        <link rel="StyleSheet" href="watermarker.css" type="text/css">
    </head>
    <body>
        <div class= "image" style="width:800; height:600; display:inline-block;position: relative;left: 25px;top: 30px;" >
            <img src="images/picture.jpg" id="image" style="width:100%;height:100%;" >
        </div>
    </body>
    <script src="watermarker.js" type="text/javascript"></script>
    <script src="demo.js" type="text/javascript"></script>
</html>
```

To initialize the watermarker you should do:

```javascript
    
    // $(selector).watermarker(options);
    // Example
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
```

and that's it!

When you initialize the plugin, the image will be wrapped in a `<div class= "watermarker-wrapper">`

The wartermark will be wrapped in `<div class= "watermarker-container">`

In this example, when the position of the watermark changes the new coordinates will be sent to the `updateCoords` method.

```javascript
    function updateCoords(coords){
        $("#posx").val(coords.x);
        $("#posy").val(coords.y);
        $("#width").val(coords.width);
        $("#height").val(coords.height);
        $("#opacity").val(coords.opacity);      
    }
```

###Watermark coordinates

The `coords` object that is sent to the `onChange` and `onInitialize` callback has the following properties:


     Attribute        | Value
     ---------------  | ---------------------
     `x`              | `watermark position x`
     `y`              | `watermark position y`                 
     `width`          | `watermark width`                 
     `height`         | `watermark height`     
     `opacity`        | `watermark opacity`                 
     `element`        | `<div> watermark container`                 


With this coordinates you can process the image on the server side to add the watermark in place!

###Options

When you initialize a watermark you can configure the following options

     Attribute         | Value               | Default
     ---------------   |:---------------------------|:--------------------
     `removeIconPath`  | `Close icon path`  | `'images/close-icon.png'`
     `imagePath`       | `Watermark image route`  | `'images/watermark.png'`
     `containerClass`  | `Classes for the image wrapper`                   | `watermarker-wrapper`
    `watermarkerClass`       | `Classes for the watermark wrapper`  | `watermarker-container`
    `watermarkImageClass`       | `Classes for the watermark`  | `watermark-image`
    `offsetLeft`       | `Watermark Left Offset`  | `0`
    `offsetTop`       | `Watermark Top Offset`  | `0`
    `allowRemove`       | `Boolean. If it's true, an icon is added to the watermark to remove it`  | `true`
    `aspectRatio`       | `Aspect ratio of the watermark`  | `undefined`
    `data`       | `Receives an object with the attributes and values to add the corresponding data to the watermark container`  | `{}`
    `onInitialize`       | `Callback executed when the watermark is initialized`  | `function(){}`
    `onChange`       | `Callback executed when the watermark is modified`  | `function(){}`
    `onRemove`       | `Callback executed when the watermark is removed`  | `function(){}`
    `onDestroy`       | `Callback executed when the watermark is destroyed, meaning after the last watermark of the image is removed`  | `function(){}`

Also, the plugin allows you to set some classes

     Attribute         | Value                  | Default
     ---------------   |:-----------------------|:--------------------
     `removeClass`     | `Class of the element that allows you to remove the watermark` | `watermarker-remove-item`
     `resizerClass`    | `Class of the element that allows you to resize the watermark`     | `resizer`
     `draggingClass`   | `Class added to the container of the watermark when it's being moved`     | `dragging`
     `resizingClass`   | `Class added to the element when it's being resized`     | `resizing`

However this las options only accept one class. Do not use a space separated class name like `myResizer otherResizer` because it's not supported yet (In practice, it'll never be necessary to change this options)

###Multiple Watermarks

The plugin supports multiple watermarks for a single image. To do it you just have to re-call it:

```javascript
    
    //Add first watermark to the image
    $("#image").watermarker({
        imagePath: "images/watermark.png",
    });

    //Add second watermark to the image
    $("#image").watermarker({
        imagePath: "images/watermark2.png",
    });

```

and voila!
