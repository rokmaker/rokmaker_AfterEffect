//UI Setting

(function CustomPanel(thisObj) {
    // UI
    function buildUI(thisObj) {
        var pal = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Custom Panel", undefined, {resizeable:true});
        if (pal !== null) {
            var bgp = pal.add("group", undefined, "bgp");
                bgp.orientation = "row";
                bgp.alignChildren = ["fill", "fill"];
            var bt1 = bgp.add("button", undefined, "shapelayer_adj");
            var bt2 = bgp.add("button", undefined, "open_file");
            var bt3 = bgp.add("button", undefined, "open_folder");
            var bt4 = bgp.add("button", undefined, "LO>camera");
            var bt5 = bgp.add("button", undefined, "guidelayer_on");
            var bt6 = bgp.add("button", undefined, "guidelayer_off");
                bt1.onClick = shapelayeradj;
                bt2.onClick = openFile;
                bt3.onClick = openfilefolder;
                bt4.onClick = LOtoCamera;
                bt5.onClick = guidelayeron;
                bt6.onClick = guidelayeroff;
        }
        return pal;
    }

    //function
    function shapelayeradj() {
        var actItem = app.project.activeItem;
        if (actItem !== null && actItem instanceof CompItem) {
            if (actItem.selectedLayers.length > 0) {
                var selLayer = actItem.selectedLayers[0];
                var selindex = selLayer.index;
            }
            var shapelayer = actItem.layers.addShape();
            for (i = 1; i <= actItem.numLayers; i++) {
                if (actItem.layer(i).name == "Effect Layer") {
                    shapelayer.name = "Effect layer"+ " " + i;
                } else {
                    shapelayer.name = "Effect Layer";
                }
            }
            shapelayer.moveBefore(actItem.layer(selindex + 1));
            shapelayer.property("ADBE Transform Group").property("ADBE Position").setValue([actItem.width / 2, actItem.height / 2]);
            shapelayer.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width / 2, thisComp.height / 2]";
            shapelayer.adjustmentLayer = true;
            var rect = shapelayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
            rect.name = "Rectangle";
            var rectSize = [actItem.width, actItem.height];
            rect.property("ADBE Vector Rect Size").setValue(rectSize);
            rect.property("ADBE Vector Rect Size").expression = "[thisComp.width, thisComp.height]";
            var fill = shapelayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
            fill.name = "Fill";
            fill.property("ADBE Vector Fill Color").setValue([1, 1, 1, 1]);
        }
    }

    function openfilefolder() {
        var actItem = app.project.activeItem;
        var selLayer = actItem.selectedLayers[0];
        if (actItem.selectedLayers.length > 0) {
            if (selLayer.source instanceof FootageItem) {
                var filePath = selLayer.source.file.fsName;
                var folderPath = filePath.substring(0, filePath.lastIndexOf("\\") + 1);
                if (folderPath) {
                    system.callSystem("explorer \"" + folderPath + "\"");
                }
            }
        } else {
            alert("Select a layer");
        }
    }

    function openFile() {
        var actItem = app.project.activeItem;
        var selLayer = actItem.selectedLayers[0];
        if (actItem.selectedLayers.length > 0) {
            if (selLayer.source instanceof FootageItem) {
                var filePath = selLayer.source.file.fsName;
                if (filePath) {
                    system.callSystem("explorer \"" + filePath + "\"");
                }
            }
        } else {
            alert("Select a layer");
        }
    }

    function LOtoCamera() {
        var actItem = app.project.activeItem;
        var selLayer = actItem.selectedLayers[0];
        if (selLayer.source instanceof FootageItem) {
            for (i = 1; i <= actItem.numLayers; i++) {
                var camera = actItem.layer(i);
                if (camera.name == "camera" && camera.source instanceof FootageItem) {
                    if (camera.source.width == selLayer.source.width || camera.source.height == selLayer.source.height) {
                        selLayer.parent = null;
                        var cameraPos = camera.property("ADBE Transform Group").property("ADBE Position").value;
                        var cameraRot = camera.property("ADBE Transform Group").property("ADBE Rotate Z").value;
                        var cameraScale = camera.property("ADBE Transform Group").property("ADBE Scale").value;
                        selLayer.property("ADBE Transform Group").property("ADBE Position").setValue(cameraPos);
                        selLayer.property("ADBE Transform Group").property("ADBE Rotate Z").setValue(cameraRot);
                        selLayer.property("ADBE Transform Group").property("ADBE Scale").setValue(cameraScale);
                        selLayer.parent = camera;
                        break;
                    } else {
                        selLayer.parent = null;
                        var cameraWidth = camera.source.width;
                        var cameraHeight = camera.source.height;
                        var selLayerWidth = selLayer.source.width;
                        var selLayerHeight = selLayer.source.height;
                        var scaleX = (cameraWidth / selLayerWidth) * 100;
                        var scaleY = (cameraHeight / selLayerHeight) * 100;
                        var cameraPos = camera.property("ADBE Transform Group").property("ADBE Position").value;
                        var cameraRot = camera.property("ADBE Transform Group").property("ADBE Rotate Z").value;
                        selLayer.property("ADBE Transform Group").property("ADBE Position").setValue(cameraPos);
                        selLayer.property("ADBE Transform Group").property("ADBE Rotate Z").setValue(cameraRot);
                        selLayer.property("ADBE Transform Group").property("ADBE Scale").setValue([scaleX, scaleY]);
                        selLayer.parent = camera;
                        break;
                    }
                }else{
                    alert("not found camera layer");
                }
            }
        } else {
            alert("is not animatic file")
        }
    }
    
    function guidelayeron() {
        var actItem = app.project.activeItem;
        var selLayer = actItem.selectedLayers[0];
        if (actItem.selectedLayers.length > 1) {
            for (i = 0; i < actItem.selectedLayers.length; i++) {
                selLayer = actItem.selectedLayers[i];
                selLayer.guideLayer = true;
            }
        } else {
            selLayer.guideLayer = true;
        }
    }

    function guidelayeroff() {
        var actItem = app.project.activeItem;
        var selLayer = actItem.selectedLayers[0];
        if (actItem.selectedLayers.length > 1) {
            for (i = 0; i < actItem.selectedLayers.length; i++) {
                selLayer = actItem.selectedLayers[i];
                selLayer.guideLayer = false;
            }
        } else {
            selLayer.guideLayer = false;
        }
    }
    
    // show UI
    var myPanel = buildUI(thisObj);
    if (myPanel !== null) {
        myPanel.onclose = function() {
            app.settings.saveSetting("rokmaker_custom_panel", "Custom_Panel", myPanel);
        }
        if (myPanel instanceof Window) {
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
        }
    }
}
)(this);