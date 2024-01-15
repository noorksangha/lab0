//chatGPT was used to help with code.
import messages from '../lang/messages/en/user.js';

class ColoredButton {
  constructor(x, y, color, text) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
    this.element = null;
  }

  createButton() {
    this.element = document.createElement("button");
    this.element.style.height = "5em";
    this.element.style.width = "10em";
    this.element.style.backgroundColor = this.color;
    this.element.innerText = this.text;
    this.element.style.position = "absolute";
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    document.getElementById("buttonContainer").appendChild(this.element);
  }

  moveButton(newX, newY) {
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }
}

class ColorButtonGame {
  constructor() {
    this.coloredButtons = [];
    this.buttonContainer = document.getElementById("buttonContainer");
    this.startButton = document.getElementById("startButton");
    this.numInput = document.getElementById("numButtons");

    this.startButton.addEventListener("click", () => this.createColoredButtons());
  }

  createColoredButtons() {
    const num = parseInt(this.numInput.value);

    if (num >= 3 && num <= 7) {
      this.clearColoredButtons();

      const totalWidth = num * 10 * 16;
      let startingX = (window.innerWidth - totalWidth) / 2;
      startingX = startingX < 0 ? 0 : startingX;

      const startY = 300;

      for (let i = 0; i < num; i++) {
        const coloredButton = new ColoredButton(
          startingX + i * (10 * 16),
          startY,
          this.getRandomColor(),
          `${i + 1}`
        );
        coloredButton.createButton();
        this.coloredButtons.push(coloredButton);
      }

      setTimeout(() => this.scatterColoredButtons(num), num * 1000);
    } else {
      alert(messages.enterNumber);
    }
  }

  clearColoredButtons() {
    this.buttonContainer.innerHTML = "";
    this.coloredButtons = [];
  }

  scatterColoredButtons(num) {
    let scatterCount = 0;

    const scatterInterval = setInterval(() => {
      const scatterPromises = [];

      for (let i = 0; i < num; i++) {
        const coloredButton = this.coloredButtons[i];
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 50);

        const movePromise = new Promise((resolve) => {
          coloredButton.moveButton(newX, newY);
          resolve();
        });

        scatterPromises.push(movePromise);
      }

      Promise.all(scatterPromises).then(() => {
        scatterCount++;

        if (scatterCount === num) {
          clearInterval(scatterInterval);
          this.removeButtonText();
          this.enableButtonInteraction();
        }
      });
    }, 2000);
  }

  removeButtonText() {
    this.coloredButtons.forEach((coloredButton) => (coloredButton.element.innerText = " "));
  }

  enableButtonInteraction() {
    let clickCount = 0;

    const originalOrder = this.coloredButtons.map((coloredButton) => coloredButton.text);

    this.coloredButtons.forEach((coloredButton, index) => {
      coloredButton.element.addEventListener("click", () => {
        if (coloredButton.text === originalOrder[clickCount]) {
          coloredButton.element.innerText = coloredButton.text;
          clickCount++;
          if (clickCount === originalOrder.length) {
            setTimeout(() => {
              alert(messages.excellentMemory);
            }, 100);
          }
        } else {
          alert(messages.wrongOrder);
          this.revealCorrectOrder();
        }
      });
    });
  }

  revealCorrectOrder() {
    this.coloredButtons.forEach((coloredButton) => {
      coloredButton.element.innerText = coloredButton.text;
      coloredButton.element.disabled = true;
    });
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

const game = new ColorButtonGame();
