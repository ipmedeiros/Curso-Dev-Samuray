const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const mouse = { x: 0, y: 0 };
const gapX = 10;
let animationId;

const field = {
  w: window.innerWidth * 0.9,
  h: window.innerHeight * 0.8,
  draw() {
    ctx.fillStyle = "#286047";
    ctx.fillRect(0, 0, this.w, this.h);
  }
};

const line = {
  w: 15,
  h: field.h,
  draw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h);
  }
};

const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 150,
  move() {
    this.y = mouse.y - this.h / 2;
  },
  draw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.move();
  }
};

const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 150,
  speed: 3.5,
  move() {
    const middlePaddle = this.y + this.h / 2;
    if (middlePaddle < ball.y - 35) {
      this.y += this.speed;
    } else if (middlePaddle > ball.y + 35) {
      this.y -= this.speed;
    }
  },
  speedUp() {
    this.speed += 0.5;
  },
  draw() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    this.move();
  }
};

const score = {
  human: 0,
  computer: 0,
  draw() {
    ctx.font = "bold 60px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#01341D";
    ctx.fillText(this.human, field.w / 4, 50);
    ctx.fillText(this.computer, (field.w / 4) * 3, 50);
  }
};

const ball = {
  x: field.w / 2,
  y: field.h / 2,
  r: 15,
  speed: 6,
  directionX: 1,
  directionY: 1,
  reset() {
    this.x = field.w / 2;
    this.y = field.h / 2;
    this.speed = 6;
    this.directionX *= -1;
    rightPaddle.speed = 3.5;
  },
  reverseX() {
    this.directionX *= -1;
  },
  reverseY() {
    this.directionY *= -1;
  },
  move() {
    this.x += this.directionX * this.speed;
    this.y += this.directionY * this.speed;
  },
  checkCollisions() {
    if (this.x + this.r > rightPaddle.x && this.y > rightPaddle.y && this.y < rightPaddle.y + rightPaddle.h) {
      this.reverseX();
    } else if (this.x - this.r < leftPaddle.x + leftPaddle.w && this.y > leftPaddle.y && this.y < leftPaddle.y + leftPaddle.h) {
      this.reverseX();
    } else if (this.x + this.r > field.w) {
      score.human++;
      this.reset();
    } else if (this.x - this.r < 0) {
      score.computer++;
      this.reset();
    }

    if ((this.y - this.r < 0 && this.directionY < 0) || (this.y + this.r > field.h && this.directionY > 0)) {
      this.reverseY();
    }
  },
  draw() {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    ctx.fill();
    this.checkCollisions();
    this.move();
  }
};

function setup() {
  canvas.width = field.w;
  canvas.height = field.h;
}

function draw() {
  field.draw();
  line.draw();
  leftPaddle.draw();
  rightPaddle.draw();
  score.draw();
  ball.draw();

  if (score.human === 5 || score.computer === 5) {
    cancelAnimationFrame(animationId);
    endGame(score.human === 5 ? "Você venceu! 🏆" : "A máquina venceu 😢");
  } else {
    animationId = requestAnimationFrame(draw);
  }
}

function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  canvas.style.display = "block";
  setup();
  animationId = requestAnimationFrame(draw);
}

function restartGame() {
  document.getElementById("game-over").classList.add("hidden");
  canvas.style.display = "block";
  score.human = 0;
  score.computer = 0;
  ball.reset();
  setup();
  animationId = requestAnimationFrame(draw);
}

function endGame(winnerMessage) {
  document.getElementById("winner-text").innerText = winnerMessage;
  document.getElementById("game-over").classList.remove("hidden");
  canvas.style.display = "none";
}

canvas.addEventListener("mousemove", (e) => {
  mouse.y = e.clientY - canvas.getBoundingClientRect().top;
});
