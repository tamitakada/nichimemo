const tabs = document.getElementsByClassName("tab");

const memo = document.getElementsByClassName("memo");
const memoContents = document.getElementsByClassName("memo-content");

const pageContainers = document.getElementsByClassName("page-container");
const pages = document.getElementsByClassName("page");

const memoTabs = document.getElementsByClassName("memo-tab");

let currentTabColor = tabs[0].style.backgroundColor;
let currentTabIndex = 0;

// MEMO TAB CONTROLS ===========================================================

function openNewTab(index) {
    tabs[currentTabIndex].style.backgroundColor = "var(--navy)";
    tabs[currentTabIndex].style.borderColor = currentTabColor;
    tabs[currentTabIndex].style.color = currentTabColor;
    tabs[currentTabIndex].style.boxShadow = "none";

    pages[currentTabIndex].style.width = "0px";

    memo[currentTabIndex].style.transform = "none"; 

    currentTabColor = tabs[index].style.color;

    tabs[index].style.backgroundColor = currentTabColor;
    tabs[index].style.borderColor = "var(--navy)";
    tabs[index].style.color = "var(--navy)";
    tabs[index].style.boxShadow = `0 0 10px ${currentTabColor}`;

    if (window.matchMedia("(max-width: 760px)").matches) {
        pages[index].style.width = "100%";
    } else { pages[index].style.width = "550px"; }

    loadAllDiagramsForMemo(index);

    currentTabIndex = index;

    memoTabs[0].style.backgroundColor = "var(--lightNavy)";
    memoTabs[0].style.color = "white";

    memoTabs[1].style.backgroundColor = "var(--navy)";
    memoTabs[1].style.color = "var(--red)";
}

function addTabs() {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() { openNewTab(i); });
    }
}

function openCitationsTab() {
    memoTabs[0].style.backgroundColor = "var(--navy)";
    memoTabs[0].style.color = "var(--lightNavy)";

    memoTabs[1].style.backgroundColor = "var(--red)";
    memoTabs[1].style.color = "var(--navy)";

    memo[currentTabIndex].style.transform = "translateY(100%)"; 
}

function openMemoTab() {
    memoTabs[0].style.backgroundColor = "var(--lightNavy)";
    memoTabs[0].style.color = "white";

    memoTabs[1].style.backgroundColor = "var(--navy)";
    memoTabs[1].style.color = "var(--red)";

    memo[currentTabIndex].style.transform = "none"; 
}

function adjustPageSize() {
    if (window.matchMedia("(max-width: 760px)").matches) {
        pages[currentTabIndex].style.width = "100%";
    } else { pages[currentTabIndex].style.width = "550px"; }
}

// HIERARCHY DIAGRAM SET UP ===========================================================

let loadedMemos = [];

function loadAllDiagramsForMemo(memoIndex) {
    if (!loadedMemos.includes(memoIndex)) {
        const diagrams = memoContents[memoIndex].getElementsByClassName("hierarchy");
        for (let i = 0; i < diagrams.length; i++) loadDiagram(diagrams[i]);
        loadedMemos.push(memoIndex);
    }
}

function parseHierarchyData(hierarchyDataString) {
    let nodeData = hierarchyDataString.split("+");
    let hierarchyData = [];
    for (let i = 0; i < nodeData.length; i++) {
        console.log(nodeData[i]);
        hierarchyData.push(JSON.parse(nodeData[i]));
    }
    return hierarchyData;
}

function loadDiagram(diagram) {
    const diagramContainer = diagram.getElementsByClassName("diagram")[0];
    const diagramCaption = diagram.getElementsByClassName("diagram-caption")[0];
    const diagramHeading = diagram.getElementsByClassName("diagram-heading")[0];
    const diagramExplanation = diagram.getElementsByClassName("diagram-explanation")[0];

    const hierarchy = new go.Diagram(diagramContainer, { layout: new go.TreeLayout({ 
        angle: 90, 
        layerSpacing: 35, 
        arrangement: go.TreeLayout.ArrangementHorizontal}),
        allowVerticalScroll: false,
        allowHorizontalScroll: false,
        autoScrollRegion: 0,
        "panningTool.isEnabled": false,
        "dragSelectingTool.isEnabled": false,
        initialScale: 1.2
    });

    hierarchy.nodeTemplate = new go.Node("Auto", {
        selectionChanged: function(node) {
            if (node.data.desc) {
                diagramCaption.style.display = "flex";
                diagramExplanation.innerText = node.data.desc;
                diagramHeading.innerText = node.data.name;
            } else { diagramCaption.style.display = "none"; }
        }
    })
        .bind("selectable", "tooltip")
        .add(new go.Shape("RoundedRectangle",
            { strokeWidth: 3, stroke: "black", name: "SHAPE", fill: "#384669" })
            .bind("stroke", "color"))
        .add(new go.Panel("Vertical", { padding: 8 })
            .add(new go.TextBlock("",
                { font: "8px Hina", stroke: "white", name: "RUBY" })
                .bind("text", "furigana")
                .bind("visible", "furigana", function(text) { 
                    console.log(text);
                    return (text.length > 0); 
                }))
            .add(new go.TextBlock("",
                { font: "14px Hina", stroke: "white", wrap: go.TextBlock.WrapBreakAll, maxSize: new go.Size(70, 100), name: "TEXT" })
                .bind("text", "name")));

    hierarchy.linkTemplate = new go.Link({ routing: go.Link.Orthogonal, corner: 5, selectable: false })
        .add(new go.Shape({ strokeWidth: 2, stroke: "white" }))

    hierarchyData = parseHierarchyData(diagram.getAttribute("data-hierarchy"));
    hierarchy.model = new go.TreeModel(hierarchyData);

    hierarchy.isReadOnly = true;
    hierarchy.maxSelectionCount = 1;
    hierarchy.allowZoom = true;
}

window.addEventListener("resize", adjustPageSize, true);

addTabs();
adjustPageSize();
loadAllDiagramsForMemo(0);