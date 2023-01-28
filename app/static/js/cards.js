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
let selectedNode = null;

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
        hierarchyData.push(JSON.parse(nodeData[i]));
    }
    return hierarchyData;
}

function loadDiagram(diagram) {
    const diagramContainer = diagram.getElementsByClassName("hierarchy-diagram")[0];
    const nodeCaption = diagram.getElementsByClassName("node-caption")[0];
    const nodeCaptionHeading = diagram.getElementsByClassName("node-caption-heading")[0];
    const nodeCaptionText = diagram.getElementsByClassName("node-caption-text")[0];

    const data = parseHierarchyData(diagram.getAttribute("data-hierarchy"));
    
    for (let i = 0; i < data.length; i++) {
        var svg = d3.select(diagramContainer)
            .append("svg")
            .attr("width", "" + (100 * data[i]["width"]) + "%")
            .attr("height", data[i]["height"])
            .attr("viewBox", function() {
                let width = parseInt(d3.select(this).style("width"));
                let height = parseInt(d3.select(this).style("height"));
                return "0 0 " + width + " " + height;
            }),
            g = svg.append("g")
                .attr("transform", "translate(0,70)");

        let width = svg.node().getBoundingClientRect().width;

        var tree = d3.tree()
            .size([width, data[i]["height"] - 120])

        let root = d3.hierarchy(data[i]["nodeData"]);
        tree(root);

        let link = g.selectAll(".link")
            .data(root.descendants().slice(1))
            .enter().append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
                });

        let node = g.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
                .attr("class", function(d) {
                    return "node" + (d.children ? " node--internal" : " node--leaf");
                })
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

        let text = node.append("text")
            .text(function(d) { return d.data.name; })
            .attr("dy", ".35em")
            .attr("y", function(d) {
                return d.children ? -20 : 20;
            })
            .style("text-anchor", "middle")
            .style("stroke", "white");

        let rect = node.insert("rect", "text")
            .attr("x", function(d) {
                return d3.select(this.parentNode).select("text").node().getBBox().x - 10;
            })
            .attr("y", function(d) {
                if (d.data.ruby) {
                    return d3.select(this.parentNode).select("text").node().getBBox().y - 15;
                }
                return d3.select(this.parentNode).select("text").node().getBBox().y - 10;
            })
            .attr("width", function(d) {
                return d3.select(this.parentNode).select("text").node().getBBox().width + 20;
            })
            .attr("height", function(d) {
                if (d.data.ruby) {
                    return d3.select(this.parentNode).select("text").node().getBBox().height + 25;
                }
                return d3.select(this.parentNode).select("text").node().getBBox().height + 20;
            })
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", "node-text")
            .style("fill", "var(--lightNavy)")
            .style("stroke", "white")
            .style("stroke-width", 2)
        
        let ruby = node.append("text")
            .text(function(d) { return d.data.ruby; })
            .attr("y", function(d) {
                return d3.select(this.parentNode).select("text").node().getBBox().y;
            })
            .attr("class", "node-ruby")
            .style("text-anchor", "middle")
            .style("stroke", "white");

        node.on("click", function(d) {
            if (d.data.tooltip) {
                if (selectedNode) {
                    d3.select(selectedNode).select("rect").transition()
                        .duration(200)
                        .style("stroke", "white");
                }
                
                selectedNode = this;
                d3.select(this).select("rect").transition()
                    .duration(200)
                    .style("stroke", "var(--sea)");

                nodeCaption.style.display = "block";
                nodeCaptionHeading.innerText = d.data.name;
                nodeCaptionText.innerText = d.data.tooltip;
            }
        });
    }
}

window.addEventListener("resize", adjustPageSize, true);

addTabs();
adjustPageSize();
loadAllDiagramsForMemo(0);