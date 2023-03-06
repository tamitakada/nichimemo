const eraContainer = document.getElementById("era-container");
let currentEra = "kodai";

// JS ELEMENT CREATION HELPERS ===========================================================

function createTextElement(textTag, text) {
    const newElement = document.createElement(textTag);
    newElement.appendChild(document.createTextNode(text));
    return newElement;
}

function createClassElement(classnames) {
    const newElement = document.createElement("div");
    for (let i = 0; i < classnames.length; i++) {
        newElement.classList.add(classnames[i]);
    }
    return newElement;
}

// ERA BUTTONS ===========================================================

const eraButtons = document.getElementsByClassName("era-button");
for (let i = 0; i < eraButtons.length; i++) {
    eraButtons[i].addEventListener("click", () => { 
        requestEraData(eraButtons[i].id);
    });
}

// PAGE & TAB UI MANAGEMENT ===========================================================

const tabContainer = document.getElementsByClassName("tab-container")[0];
const eraPageContainer = document.getElementsByClassName("era-page-container")[0];

function clearTabsAndPages() {
    const currentPages = eraPageContainer.querySelectorAll(".page");
    for (let i = currentPages.length - 1; i >= 0; i--) {
        eraPageContainer.removeChild(currentPages[i]);
    }

    const currentTabs = tabContainer.querySelectorAll(".tab");
    for (let i = currentPages.length - 1; i >= 0; i--) {
        tabContainer.removeChild(currentTabs[i]);
    }
}

const constructionMessage = document.getElementById("construction-message");
function displayConstructionPage() {
    eraPageContainer.style.display = "none";
    tabContainer.style.display = "none";
    constructionMessage.style.display = "flex";
}

function loadEraPages(era) {
    eraPageContainer.style.display = "flex";
    tabContainer.style.display = "flex";
    constructionMessage.style.display = "none";

    for (let i = 0; i < eraMemoData[era].length; i++) {
        const newPage = createClassElement(["page"]);
        if (i == 0) {
            newPage.style["flex"] = window.matchMedia("(max-width: 800px)").matches ? "1" : "0 0 550px"; 
        }

        const newMemo = createClassElement(["memo"]);
        newMemo.innerHTML = eraMemoData[era][i]["content"];
        newPage.appendChild(newMemo);

        const newCitation = createClassElement(["citation"]);

        const citationHeader = createTextElement("h2", "参考文献");
        citationHeader.style = "margin-bottom: 20px; color: var(--navy);";
        newCitation.appendChild(citationHeader);

        const citationList = document.createElement("ul");
        for (let j = 0; j < eraMemoData[era][i]["citations"].length; j++) {
            const newCitationItem = document.createElement("li");
            newCitationItem.style = "color: var(--navy); font-family: Hina;";
            newCitationItem.innerHTML = eraMemoData[era][i]["citations"][j];
            citationList.appendChild(newCitationItem);
        }
        newCitation.appendChild(citationList);
        newPage.appendChild(newCitation);

        eraPageContainer.appendChild(newPage);

        const newTab = createClassElement(["tab"]);
        if (i == 0) {
            newTab.style.color = "var(--navy)";
            newTab.style.borderColor = "var(--navy)";
            newTab.style.backgroundColor = eraColors[era];
            newTab.style.boxShadow = `0 0 10px ${eraColors[era]}`;
        } else {
            newTab.style.color = eraMemoData[era][i]["era_color"];
            newTab.style.borderColor = eraMemoData[era][i]["era_color"];
        }
        newTab.appendChild(createTextElement("h3", eraMemoData[era][i]["title"]));
        tabContainer.appendChild(newTab);
    }

    addTabs();
    currentEra = era;
}

// AJAX REQUEST ===========================================================

function requestEraData(era) {
    clearTabsAndPages();
    eraContainer.style.borderColor = eraColors[era];

    if (!(era in eraMemoData) || eraMemoData[era].length == 0) { 
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    const newEraMemoData = JSON.parse(httpRequest.responseText);
                    if (newEraMemoData["memos"].length == 0) { displayConstructionPage(); }
                    else { 
                        eraMemoData[era] = newEraMemoData["memos"];
                        loadEraPages(era); 
                    }
                } else {
                    console.log("Error loading stuff");
                }
            } else {
                // Loading
            }
        }
        httpRequest.open("GET", `/api/${era}`, true);
        httpRequest.send();
    } else { loadEraPages(era); }
}

let currentTabIndex = 0;
const eraColors = {"kodai": "var(--red)", "chusei": "var(--sun)", "kinsei": "var(--lime)", "kindai": "var(--sea)", "gendai": "var(--ice)" };

// MEMO TAB ORGANIZATION ===========================================================

const memoButton = document.getElementById("memo-button");
let isMemoOpen = true;
memoButton.addEventListener("click", switchPageTab);

function switchPageTab() {
    isMemoOpen = !isMemoOpen;
    const memos = document.getElementsByClassName("memo");
    memos[currentTabIndex].style.transform = isMemoOpen ? "none" : "translateY(100%)";
}

// PAGE TAB ORGANIZATION ===========================================================

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
    isMemoOpen = true;
}

function addTabs() {
    const tabs = document.getElementsByClassName("tab");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].addEventListener("click", function() { openNewTab(i); });
    }
}

// RESPONSIVE PAGE ===========================================================

function adjustPageSize() {
    const pages = document.getElementsByClassName("page");
    if (pages[currentTabIndex] && window.matchMedia("(max-width: 800px)").matches) {
        pages[currentTabIndex].style["flex"] = "1";
    } else if (pages[currentTabIndex]) { pages[currentTabIndex].style["flex"] = "0 0 550px"; }
}

window.addEventListener("resize", adjustPageSize, true);

addTabs();
adjustPageSize();