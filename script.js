/// PiCO Transistor Logic (12/2022)

import categories from "./categories.js";
import { makeSwitch, makeRadio, makePress, resetRadios } from "./buttons.js"
import { getNewQuestion, hint } from "./data.js"

const copyright = "Copyright Delgrande Industries, in conjunction with PiCO Transistor Logic";

constructCategories();
function constructCategories() {
  document.body.innerHTML = "<div id=\"copyright-info\"></div><div id=\"category-holder\"></div><div id=\"start-holder\"></div>";
  document.getElementById("copyright-info").innerHTML = copyright;
  
  for (let category in categories) {
    const color = categories[category][0];
    const categoryEl = document.createElement("div");
    const header = document.createElement("div");
    const backer = document.createElement("div");
    const all = makePress("Select All", color, 30);
    
    categoryEl.classList.add("categories");
    header.classList.add("category-headers");
    backer.classList.add("category-backers");
    
    header.innerText = category;
    backer.style.backgroundColor = color;
    
    categoryEl.appendChild(backer);
    categoryEl.appendChild(header);
    document.getElementById("category-holder").appendChild(categoryEl);
    
    const switches = [];
    for (let i = 1; i < categories[category].length; i++) {
      const type = categories[category][i];
      const toggleButton = makeSwitch(type, color);
      categoryEl.appendChild(toggleButton);
      switches.push(toggleButton)
    }
    
    all.addEventListener("mousedown", () => {
      let event = "reset";
      for (let button of switches) {
        if (!button.classList.contains("actives")) {
          event = "set";
          break;
        }
      }
      for (let button of switches) { button.dispatchEvent(new Event(event)); }
    });
    
    all.classList.add("bottoms");
    categoryEl.appendChild(all);
  }
  
  const start = makePress("START", "#2e9b91");
  document.getElementById("start-holder").appendChild(start);
  start.addEventListener("click", startTester);
}

var types = null;
function startTester() {
  // get selected
  const categoriesEl = document.getElementById("category-holder");
  let selectedCategories = {};
  let selectedTypes = {};
  for (let category of categoriesEl.children) {
    const categoryName = category.querySelector(".category-headers").innerText;
    
    const buttons = category.querySelectorAll(".buttons:not(.bottoms)");
    let selected = false;
    for (let button of buttons) {
      if (button.classList.contains("actives")) {
        selectedTypes[categoryName + "-" + button.children[1].children[0].innerText] = true;
        selected = true;
      }
    }
    if (selected) {
      const header = category.querySelector(".category-headers").innerText;
      selectedCategories[header] = categories[header];
    }
  }
  if (Object.keys(selectedTypes).length == 0) return; // waste of time to test on nothing
  
  types = selectedTypes;
  
  document.body.classList.add("fade");
  setTimeout(() => {
    document.body.innerHTML = "";
    buildTester(selectedCategories);
    document.body.classList.remove("fade");
  }, 200);
}

function buildTester(categories) {
  document.body.innerHTML = "<div id=\"answers-holder\"></div><div id=\"next-holder\"></div><div id=\"back-holder\"></div><div id=\"question-holder\"></div><div id=\"hint\"></div>";
  
  const nextButton = makePress("Next", "green", 50);
  document.getElementById("next-holder").appendChild(nextButton);
  nextButton.addEventListener("click", () => { loadNewQuestion(); })
  
  const backButton = makePress("Back", "#ed8484", 50);
  document.getElementById("back-holder").appendChild(backButton);
  backButton.addEventListener("click", () => {
    document.body.classList.add("fade");
    setTimeout(() => {
      constructCategories();
      document.body.classList.remove("fade");
    }, 200)
  });
  
  for (let category in categories) {
    const color = categories[category][0];
    
    const categoryEl = document.createElement("div");
    const categoryElBack = document.createElement("div");
    categoryEl.classList.add("answers-container");
    categoryEl.setAttribute("id", category)
    categoryElBack.classList.add("answers-container-back");
    categoryElBack.style.backgroundColor = color;
    
    categoryEl.appendChild(categoryElBack);
    
    for (let type of categories[category]) {
      if ((category + "-" + type) in types) {
        const answer = makeRadio(type, color);
        categoryEl.appendChild(answer);
        answer.addEventListener("click", checkAnswer.bind(this, category + "-" + type));
      }
    }
    
    const label = document.createElement("div");
    label.classList.add("answer-labels");
    label.innerText = category;
    categoryEl.appendChild(label);
    
    document.getElementById("answers-holder").appendChild(categoryEl)
  }
  if ("Chi^2 Tests" in categories && "Predictions" in categories) {
    document.getElementById("Chi^2 Tests").style.width = "calc(80vw - 10px)";
    document.getElementById("Chi^2 Tests").children[0].style.width = "calc(80vw)";
    document.getElementById("Chi^2 Tests").style.float = "left";
    document.getElementById("Predictions").style.width = "calc(20vw - 10px)";
    document.getElementById("Predictions").children[0].style.width = "calc(20vw)";
  }
  
  loadNewQuestion();
}

var correctAnswer = null;
function loadNewQuestion() {
  document.getElementById("next-holder").classList.add("inactive");
  resetRadios();
  
  const questionData = getNewQuestion(types);
  correctAnswer = questionData[1];
  
  const questionDiv = document.createElement("div");
  questionDiv.setAttribute("id", "question-div");
  questionDiv.innerText = questionData[0];
  document.getElementById("question-holder").innerHTML = "";
  document.getElementById("question-holder").appendChild(questionDiv);
}

function checkAnswer(test) {
  if (correctAnswer == test) {
    document.getElementById("hint").innerText = "";
    document.getElementById("next-holder").classList.remove("inactive");
  }
  else {
    document.getElementById("hint").innerText = hint(correctAnswer, test)
    document.getElementById("next-holder").classList.add("inactive");
  }
}