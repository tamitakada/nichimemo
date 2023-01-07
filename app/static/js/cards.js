const tabs = document.getElementsByClassName("tab");
const memo = document.getElementsByClassName("memo");

let currentTabIndex = 0;

function openNewTab(index) {
    tabs[currentTabIndex].style.backgroundColor = "#F2F2F2";
    tabs[currentTabIndex].style.borderColor = "#E1E1E1";

    memo[currentTabIndex].style.width = "0px";
    memo[currentTabIndex].style.padding = "20px 0px";

    tabs[index].style.backgroundColor = "var(--green)";
    tabs[index].style.borderColor = "#4CB39A";

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