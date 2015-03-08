#Watermarker

Add watermarks to your images!
 
###Installation

If you want to use this in your project, you only need to add the following scripts

```HTML
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
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

Y ya tendremos un watermark en nuestra imagen! 

Al inicializar el plugin, se envolvera la imagen en un ```<div class= "watermarker-wrapper" >``` 

El watermark estara envuelto en un ```<div class= "watermarker-container"> ```

En este ejemplo, al inicializar el watermark y cada vez que su posicion cambie se enviaran las nuevas coordenadas al metodo updateCoords.

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

El objecto coords que se envia a los metodos ejecutados en los callbacks onChange y onInitialize tiene las siguientes propiedades:

```javascript
     Attribute        | Value
     ---------------  |:-----------------------
     `x`              | `watermark position x`
     `y`              | `watermark position y`                 
     `width`          | `watermark width`                 
     `height`         | `watermark height`     
     `opacity`        | `watermark opacity`                 
     `element`        | `<div> watermark container`                 
```

Estas coordenadas te permitiran procesar la imagen en el servidor para agregarle el watermark!

###Options

Cuando se inicializa un watermark se le pueden setear las siguientes opciones

     Attribute         | Value               | Default
     ---------------   |:---------------------------|:--------------------
     `imagePath`       | `Ruta de la imagen del watermark`  | `images/watermark.png`
     `containerClass`  | `Clases que se le quieran agregar al wrapper de la imagen`                   | `watermarker-wrapper`
    `watermarkerClass`       | `Clases que se le quieran agregar al wrapper del watermark`  | `watermarker-container`
    `watermarkImageClass`       | `Clases que se le quieran agregar al watermark`  | `watermark-image`
    `offsetLeft`       | `Watermark Left Offset`  | `0`
    `offsetTop`       | `Watermark Top Offset`  | `0`
    `allowRemove`       | `Booleano. Si esta en True agrega un icono al watermark para permitir removerlo`  | `true`
    `aspectRatio`       | `Aspect ratio del watermark`  | `undefined`
    `data`       | `Recibe un object con los attributos y valores para agregarle al data del container del watermark`  | `{}`
    `onInitialize`       | `Callback ejecutado al inicializar un watermark`  | `function(){}`
    `onChange`       | `Callback ejecutado al modificar un watermark`  | `function(){}`
    `onRemove`       | `Callback ejecutado al remover un watermark`  | `function(){}`
    `onDestroy`       | `Callback ejecutado al destruir el watermar, es decir, luego de haber removido el ultimo watermark que tenia la imagen`  | `function(){}`

Adicionalmente el plugin permite setear algunas clases
 
     Attribute         | Value                  | Default
     ---------------   |:-----------------------|:--------------------
     `removeClass`     | `Clase del elemento que permite remover el watermark` | `watermarker-remove-item`
     `resizerClass`    | `Clase del elemento que permite resizear el watermark`     | `resizer`
     `draggingClass`   | `Clase que se le agrega al container del watermark mientras se lo esta moviendo`     | `dragging`
     `resizingClass`   | `Clase que se le agrega al elemento resizer cuando se esta resizeando el watermark`     | `resizing`

Sin embargo estas ultimas opciones solo aceptan una clase. No utilices algo como "myResizer otherResizer" porque no funcionara. (Realmente nunca deberia ser necesario modificar estas opciones. Hazlo bajo tu propia responsabilidad)

###Multiple Watermarks

El plugin soporta agregarle varios watermarks a una imagen. para hacerlo solo debes volver a llamarlo

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

y voila! ya tienes 2 watermarks en la imagen