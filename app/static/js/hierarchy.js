const diagrams = document.getElementsByClassName("diagram");
const diagramHeadings = document.getElementsByClassName("diagram-heading");
const diagramExplanations = document.getElementsByClassName("diagram-explanation");
const diagramCaptions = document.getElementsByClassName("diagram-caption");

function parseHierarchyData(hierarchyDataString) {
    let nodeData = hierarchyDataString.split(",");
    let hierarchyData = [];
    for (let i = 0; i < nodeData.length; i++) {
        hierarchyData.add(JSON.parse(nodeData[i]));
    }
    return hierarchyData;
}

class CustomZoomingTool extends go.ZoomingTool {
    doMouseMove() {
      if (!this.isActive) return;
      var diagram = this.diagram;
      if (diagram === null) return;
      var last = diagram.lastInput.documentPoint;
      var now = diagram.firstInput.documentPoint;
      var dx = now.x - last.x;
      var dy = now.y - last.y;
      diagram.position = new go.Point(diagram.position.x + dx, diagram.position.y + dy);
      diagram.updateAllTargetBindings();
    }
  }
  

function loadDiagram(index, hierarchyDataString) {
    const hierarchy = new go.Diagram(diagrams[index], { layout: new go.TreeLayout({ 
        angle: 90, 
        layerSpacing: 35, 
        arrangement: go.TreeLayout.ArrangementHorizontal,
        allowVerticalScroll: false,
        autoScrollRegion: 0,
        "panningTool.isEnabled": false,
        "dragSelectingTool.isEnabled": false
    })});

    hierarchy.nodeTemplate = new go.Node("Auto", {
        selectionChanged: function(node) {
            if (node.data.desc) {
                diagramExplanations[index].innerText = node.data.desc;
                diagramHeadings[index].innerText = node.data.name;
            }
        }
    })
        .bind("selectable", "tooltip")
        .add(new go.Shape("RoundedRectangle",
            { strokeWidth: 3, stroke: "black", name: "SHAPE" })
            .bind("stroke", "color"))
        .add(new go.Panel("Vertical", { padding: 8 })
            .add(new go.TextBlock("",
                { font: "8px Hina", stroke: "black", name: "RUBY" })
                .bind("text", "furigana")
                .bind("visible", "furigana", function(text) { 
                    console.log(text);
                    return (text.length > 0); 
                }))
            .add(new go.TextBlock("Default Text",
                { font: "14px Hina", stroke: "black", wrap: go.TextBlock.WrapBreakAll, maxSize: new go.Size(70, 100), name: "TEXT" })
                .bind("text", "name")));

    hierarchy.linkTemplate = new go.Link({ routing: go.Link.Orthogonal, corner: 5, selectable: false })
        .add(new go.Shape({ strokeWidth: 2, stroke: "white" }))

    hierarchyData = parseHierarchyData(hierarchyDataString);
    hierarchy.model = new go.TreeModel(hierarchyData);

    hierarchy.isReadOnly = true;
    hierarchy.maxSelectionCount = 1;
    hierarchy.allowZoom = false;

    hierarchy.toolManager.panningTool.isEnabled = false;
    hierarchy.toolManager.panningTool.mouseButton = 0;

    hierarchy.toolManager.mouseMoveTools.clear();
    hierarchy.toolManager.mouseWheelTools.clear();

    hierarchy.toolManager.mouseWheelTools.add(new CustomZoomingTool());
    hierarchy.toolManager.mouseMoveTools.remove(go.PanningTool);

    hierarchy.isPanningEnabled = false;

}