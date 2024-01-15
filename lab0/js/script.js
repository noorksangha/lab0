//used chatgpt 
import messages from '../lang/messages/en/user.js';
class Button {
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

class ButtonGame {
  constructor() {
    this.buttons = [];
    this.buttonContainer = document.getElementById("buttonContainer");
    this.goButton = document.getElementById("goButton");
    this.numInput = document.getElementById("numButtons");

    this.goButton.addEventListener("click", () => this.createButtons());
  
  }


  createButtons() {
    const num = parseInt(this.numInput.value);

    if (num >= 3 && num <= 7) {
      this.clearButtons();

      const totalWidth = num * 10 * 16; 
      let startingX = (window.innerWidth - totalWidth) / 2; 
      startingX = startingX < 0 ? 0 : startingX; 

      const startY = 300; 

      for (let i = 0; i < num; i++) {
        const button = new Button(
            startingX + i * (10 * 16), 
            startY, 
            this.getRandomColor(),
            `${i + 1}`
        );
        button.createButton();
        this.buttons.push(button);
      }

      
      setTimeout(() => this.scatterButtons(num), num * 1000);
    } else {
      alert(messages.enterNumber);
    }
  }



  clearButtons() {
    this.buttonContainer.innerHTML = "";
    this.buttons = [];
  }

  scatterButtons(num) {
    let scatterCount = 0; 

    const scatterInterval = setInterval(() => {
      const scatterPromises = [];

  
      for (let i = 0; i < num; i++) {
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

        if (scatterCount === num) {
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

    const originalOrder = this.buttons.map(button => button.text);

    this.buttons.forEach((button,index) => {
      button.element.addEventListener('click',() => {
        if(button.text === originalOrder[clickCount]) {
          button.element.innerText = button.text; 
          clickCount++;
          if (clickCount === originalOrder.length) {
            setTimeout(() => {
              alert(messages.excellentMemory)
            }, 100);
          }
        } else {
          alert(messages.wrongOrder);
          this.revealCorrectOrder();
        }
      })
    })
  }

  revealCorrectOrder() {
    this.buttons.forEach(button => {
      button.element.innerText = button.text;
      button.element.disabled = true; 
    })
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

const game = new ButtonGame(); 
