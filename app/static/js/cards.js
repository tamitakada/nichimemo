const tabs = document.getElementsByClassName("tab");
const memo = document.getElementsByClassName("memo");
const pageContainers = document.getElementsByClassName("page-container");
const pages = document.getElementsByClassName("page");

const memoTabs = document.getElementsByClassName("memo-tab");

let currentTabColor = tabs[0].style.backgroundColor;
let currentTabIndex = 0;

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

window.addEventListener("resize", adjustPageSize, true);

addTabs();
adjustPageSize();