const tabs = document.getElementsByClassName("tab");
const memo = document.getElementsByClassName("memo");

let currentTabIndex = 0;

function openNewTab(index) {
    tabs[currentTabIndex].style.backgroundColor = "gold";

    memo[currentTabIndex].style.width = "0px";
    memo[currentTabIndex].style.padding = "20px 0px";

    tabs[index].style.backgroundColor = "green";

    if (window.matchMedia("(max-width: 650px)").matches) {
        memo[index].style.width = "100%";
    } else { memo[index].style.width = "350px"; }

    memo[index].style.padding = "20px";

    currentTabIndex = index;
}

function addTabs() {
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() { openNewTab(i); });
    }
}

window.addEventListener("resize", function() {
    if (window.matchMedia("(max-width: 650px)").matches) {
        memo[currentTabIndex].style.width = "100%";
    } else { memo[currentTabIndex].style.width = "350px"; }
}, true);

addTabs();