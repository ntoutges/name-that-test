var radioEn = null;

export function makeButton(text, color="green") {
  const button = document.createElement("div");
  const textEl = document.createElement("div");
  
  const buttonTop = document.createElement("div");
  const buttonBottom = document.createElement("div");
  
  textEl.innerText = text;
  button.classList.add("buttons");
  buttonTop.classList.add("button-tops");
  buttonBottom.classList.add("button-bottoms");
  
  buttonTop.style.backgroundColor = color;
  buttonBottom.style.backgroundColor = color;
  
  button.appendChild(buttonBottom);
  button.appendChild(buttonTop);
  buttonTop.appendChild(textEl);
  
  button.addEventListener("set", function() { this.classList.add("actives"); })
  button.addEventListener("reset", function() { this.classList.remove("actives"); })
  
  return button;
}

export function makePress(text, color, height=-1) {
  const pressButton = makeButton(text,color);
  
  if (height != -1) {
    const graphics = pressButton.children;
    pressButton.style.height = `${height+10}px`;
    graphics[0].style.height = `${height}px`;
    graphics[1].style.height = `${height}px`;
  }
  
  pressButton.addEventListener("mousedown", function() { this.classList.add("actives"); } );
  pressButton.addEventListener("mouseup", function() { this.classList.remove("actives"); } );
  pressButton.addEventListener("mouseleave", function() { this.classList.remove("actives"); } );
  return pressButton;
}

export function makeSwitch(text, color) {
  const toggleButton = makeButton(text, color);
  toggleButton.addEventListener("click", function() { this.classList.toggle("actives"); });
  return toggleButton;
}

export function makeRadio(text, color) {
  const radio = makeButton(text, color);
  radio.classList.add("radios")
  
  radio.addEventListener("click", function() {
    if (radioEn != null) { radioEn.classList.remove("actives"); }
    this.classList.add("actives");
    radioEn = radio;
  });
  
  return radio;
}

export function resetRadios() {
  if (radioEn != null) {
    radioEn.classList.remove("actives");
    radioEn = null;
  }
}