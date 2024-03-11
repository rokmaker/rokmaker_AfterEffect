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
            //var bt2 = bgp.add("button", undefined, "Button 2");
            //var bt3 = bgp.add("button", undefined, "Button 3");
            //var bt4 = bgp.add("button", undefined, "Button 4");
                bt1.onClick = shapelayeradj;
        }

        return pal;
    }

    //function

    function shapelayeradj() {
        var actItem = app.project.activeItem;
        if ((actItem !== null) && (actItem instanceof CompItem)) {
            // 새로운 Adjustment Layer 추가
            var shapelayer = actItem.layers.addShape();
            for (i = 1; i <= actItem.numLayers; i++) {
                if (actItem.layer(i).name == "Effect Layer") {
                    shapelayer.name = "Effect layer"+ " " + i;
                } else {
                    shapelayer.name = "Effect Layer";
                }
            }
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