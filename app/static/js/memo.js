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

// ALERT DISPLAYS ===========================================================

const messageDiv = document.getElementById("message");
const messageText = document.getElementById("message-body");
const messageFace = document.getElementById("message-face");
const loadingSpinner = document.getElementById("loading-spinner");

function displayMessage() {
    eraPageContainer.style.display = "none";
    tabContainer.style.display = "none";
    messageDiv.style.display = "flex";
    messageFace.style.display = "block";
    messageText.style.display = "block";
}

function displayConstructionMessage() {
    loadingSpinner.style.display = "none";
    messageFace.innerHTML = "“く(-へ-)";
    messageText.innerHTML = "現在準備中です";
    displayMessage();
}

function displayErrorMessage() {
    loadingSpinner.style.display = "none";
    messageFace.innerHTML = "(⚆Д⚆)";
    messageText.innerHTML = "データの取得に失敗しました";
    displayMessage();
}

function displayLoadingMessage() {
    displayMessage();
    loadingSpinner.style.display = "block";
    messageFace.style.display = "none";
    messageText.style.display = "none";
}

// MEMO TAB ORGANIZATION ===========================================================

const memoButton = document.getElementById("memo-button");
let isMemoOpen = true;
memoButton.addEventListener("click", switchPageTab);

function switchPageTab() {
    isMemoOpen = !isMemoOpen;
    const memos = document.getElementsByClassName("memo");
    memos[currentTabIndex].style.transform = isMemoOpen ? "none" : "translateY(100%)";
}

// PAGE & TAB UI MANAGEMENT ===========================================================

const tabContainer = document.getElementsByClassName("tab-container")[0];
const eraPageContainer = document.getElementsByClassName("era-page-container")[0];

function clearTabsAndPages() {
    currentTabIndex = 0;
    isMemoOpen = true;
    loadedMemos = [];

    const currentPages = eraPageContainer.querySelectorAll(".page");
    for (let i = currentPages.length - 1; i >= 0; i--) {
        eraPageContainer.removeChild(currentPages[i]);
    }

    const currentTabs = tabContainer.querySelectorAll(".tab");
    for (let i = currentPages.length - 1; i >= 0; i--) {
        tabContainer.removeChild(currentTabs[i]);
    }
}

function loadEraPages(era) {
    eraPageContainer.style.display = "flex";
    tabContainer.style.display = "flex";
    messageDiv.style.display = "none";

    if (eraMemoData[era].length == 0) { 
        memoButton.style.display = "none";
        displayMessage(); 
    } else {
        memoButton.style.display = "flex";
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
        loadAllDiagramsForMemo(0);
    }

    currentEra = era;
}

// AJAX REQUEST ===========================================================

function loadEraDataForQuery(era) {
    clearTabsAndPages();
    eraContainer.style.borderColor = eraColors[era];
    loadEraPages(era);
}

function requestEraData(era) {
    clearTabsAndPages();
    eraContainer.style.borderColor = eraColors[era];

    if (!(era in eraMemoData) || eraMemoData[era].length == 0) { 
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    const newEraMemoData = JSON.parse(httpRequest.responseText);
                    if (newEraMemoData["memos"].length == 0) { 
                        memoButton.style.display = "none";
                        displayConstructionMessage();
                    } else { 
                        eraMemoData[era] = newEraMemoData["memos"];
                        loadEraPages(era); 
                    }
                } else { displayErrorMessage(); }
            } else { displayLoadingMessage(); }
        }
        httpRequest.open("GET", `/api/${era}`, true);
        httpRequest.send();
    } else { loadEraPages(era); }
}

let currentTabIndex = 0;
const eraColors = {"kodai": "var(--red)", "chusei": "var(--sun)", "kinsei": "var(--lime)", "kindai": "var(--sea)", "gendai": "var(--ice)" };

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