const memoTabs = document.getElementsByClassName("memo-tab");

let currentTabIndex = 0;

const eraColors = {"kodai": "var(--red)", "chusei": "var(--sun)", "kinsei": "var(--lime)", "kindai": "var(--sea)", "gendai": "var(--ice)" };

// MEMO TAB CONTROLS ===========================================================

function openNewTab(index) {
    const tabs = document.getElementsByClassName("tab");
    const pages = document.getElementsByClassName("page");
    const memos = document.getElementsByClassName("memo");

    tabs[currentTabIndex].style.backgroundColor = "var(--navy)";
    tabs[currentTabIndex].style.borderColor = eraColors[currentEra];
    tabs[currentTabIndex].style.color = eraColors[currentEra];
    tabs[currentTabIndex].style.boxShadow = "none";

    pages[currentTabIndex].style["flex"] = "0";
    memos[currentTabIndex].style.transform = "none"; 

    tabs[index].style.backgroundColor = eraColors[currentEra];
    tabs[index].style.borderColor = "var(--navy)";
    tabs[index].style.color = "var(--navy)";
    tabs[index].style.boxShadow = `0 0 10px ${eraColors[currentEra]}`;

    if (window.matchMedia("(max-width: 760px)").matches) {
        pages[index].style["flex"] = "0 0 100%";
    } else { pages[index].style["flex"] = "0 0 550px"; }

    loadAllDiagramsForMemo(index);

    currentTabIndex = index;

    // memoTabs[0].style.backgroundColor = "var(--lightNavy)";
    // memoTabs[0].style.color = "white";

    // memoTabs[1].style.backgroundColor = "var(--navy)";
    // memoTabs[1].style.color = "var(--red)";
}

function addTabs() {
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() { openNewTab(i); });
    }
}

function openCitationsTab() {
    // memoTabs[0].style.backgroundColor = "var(--navy)";
    // memoTabs[0].style.color = "var(--lightNavy)";

    // memoTabs[1].style.backgroundColor = "var(--red)";
    // memoTabs[1].style.color = "var(--navy)";
    const memos = document.getElementsByClassName("memo");
    memos[currentTabIndex].style.transform = "translateY(100%)"; 
}

function openMemoTab() {
    // memoTabs[0].style.backgroundColor = "var(--lightNavy)";
    // memoTabs[0].style.color = "white";

    // memoTabs[1].style.backgroundColor = "var(--navy)";
    // memoTabs[1].style.color = "var(--red)";
    const memos = document.getElementsByClassName("memo");
    memos[currentTabIndex].style.transform = "none"; 
}

function adjustPageSize() {
    const pages = document.getElementsByClassName("page");
    if (pages[currentTabIndex] && window.matchMedia("(max-width: 800px)").matches) {
        pages[currentTabIndex].style["flex"] = "1";
    } else if (pages[currentTabIndex]) { pages[currentTabIndex].style["flex"] = "0 0 550px"; }
}

window.addEventListener("resize", adjustPageSize, true);

addTabs("koda");
adjustPageSize();