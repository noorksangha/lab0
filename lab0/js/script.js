//used chatgpt to help code.
import userMessages from '../lang/messages/en/user.js';

class CustomButton {
  constructor(x, y, color, text) {
    this.xPosition = x;
    this.yPosition = y;
    this.buttonColor = color;
    this.buttonText = text;
    this.element = null;
  }

  createButton() {
    this.element = document.createElement("button");
    this.element.style.height = "5em";
    this.element.style.width = "10em";
    this.element.style.backgroundColor = this.buttonColor;
    this.element.innerText = this.buttonText;
    this.element.style.position = "absolute";
    this.element.style.left = `${this.xPosition}px`;
    this.element.style.top = `${this.yPosition}px`;
    document.getElementById("buttonContainer").appendChild(this.element);
  }

  moveButton(newX, newY) {
    this.element.style.left = `${newX}px`;
    this.element.style.top = `${newY}px`;
  }
}

class ButtonGameController {
  constructor() {
    this.buttons = [];
    this.buttonContainer = document.getElementById("buttonContainer");
    this.startButton = document.getElementById("goButton");
    this.numInput = document.getElementById("numButtons");

    this.startButton.addEventListener("click", () => this.createButtons());
  }

  createButtons() {
    const numberOfButtons = parseInt(this.numInput.value);

    if (numberOfButtons >= 3 && numberOfButtons <= 7) {
      this.clearButtons();

      const totalWidth = numberOfButtons * 10 * 16;
      let startingX = (window.innerWidth - totalWidth) / 2;
      startingX = startingX < 0 ? 0 : startingX;

      const startY = 300;

      for (let i = 0; i < numberOfButtons; i++) {
        const button = new CustomButton(
          startingX + i * (10 * 16),
          startY,
          this.getRandomColor(),
          `${i + 1}`
        );
        button.createButton();
        this.buttons.push(button);
      }

      setTimeout(() => this.scatterButtons(numberOfButtons), numberOfButtons * 1000);
    } else {
      alert(userMessages.enterNumber);
    }
  }

  clearButtons() {
    this.buttonContainer.innerHTML = "";
    this.buttons = [];
  }

  scatterButtons(numberOfButtons) {
    let scatterCount = 0;

    const scatterInterval = setInterval(() => {
      const scatterPromises = [];

      for (let i = 0; i < numberOfButtons; i++) {
        const button = this.buttons[i];
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 50);

        const movePromise = new Promise((resolve) => {
          button.moveButton(newX, newY);
          resolve();
        });

        scatterPromises.push(movePromise);
      }

      Promise.all(scatterPromises).then(() => {
        scatterCount++;

        if (scatterCount === numberOfButtons) {
          clearInterval(scatterInterval);
          this.removeButtonText();
          this.enableButtonInteraction();
        }
      });
    }, 2000);
  }

  removeButtonText() {
    this.buttons.forEach(button => button.element.innerText = " ");
  }

  enableButtonInteraction() {
    let clickCount = 0;

    const originalOrder = this.buttons.map(button => button.buttonText);

    this.buttons.forEach((button, index) => {
      button.element.addEventListener('click', () => {
        if (button.buttonText === originalOrder[clickCount]) {
          button.element.innerText = button.buttonText;
          clickCount++;
          if (clickCount === originalOrder.length) {
            setTimeout(() => {
              alert(userMessages.excellentMemory);
            }, 100);
          }
        } else {
          alert(userMessages.wrongOrder);
          this.revealCorrectOrder();
        }
      });
    });
  }

  revealCorrectOrder() {
    this.buttons.forEach(button => {
      button.element.innerText = button.buttonText;
      button.element.disabled = true;
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

const gameController = new ButtonGameController();
