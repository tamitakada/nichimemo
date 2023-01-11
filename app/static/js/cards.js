const tabs = document.getElementsByClassName("tab");
const memo = document.getElementsByClassName("memo");

let currentTabColor = tabs[0].style.backgroundColor;
let currentTabIndex = 0;

function openNewTab(index) {
    tabs[currentTabIndex].style.backgroundColor = "var(--navy)";
    tabs[currentTabIndex].style.borderColor = currentTabColor;
    tabs[currentTabIndex].style.color = currentTabColor;
    tabs[currentTabIndex].style.boxShadow = "none";

    memo[currentTabIndex].style.width = "0px";
    memo[currentTabIndex].style.padding = "20px 0px";

    currentTabColor = tabs[index].style.color;

    tabs[index].style.backgroundColor = currentTabColor;
    tabs[index].style.borderColor = "var(--navy)";
    tabs[index].style.color = "var(--navy)";
    tabs[index].style.boxShadow = `0 0 10px ${currentTabColor}`;

    if (window.matchMedia("(max-width: 760px)").matches) {
        memo[index].style.width = "100%";
    } else { memo[index].style.width = "450px"; }

    memo[index].style.padding = "20px";

    currentTabIndex = index;
}

function addTabs() {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() { openNewTab(i); });
    }
}

window.addEventListener("resize", function() {
    if (window.matchMedia("(max-width: 760px)").matches) {
        memo[currentTabIndex].style.width = "100%";
    } else { memo[currentTabIndex].style.width = "450px"; }
}, true);

addTabs();