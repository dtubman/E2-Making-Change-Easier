export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;

const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

const pending: Command[] = [];
const pendingList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

function renderPending() {
  pendingList.replaceChildren();
  for (const command of pending) {
    const item = document.createElement("li");
    item.textContent = command.label;
    pendingList.append(item);
  }
  runButton.disabled = false;
  clearButton.disabled = false;
  queueStatus.textContent = pending.length === 0
    ? "Empty"
    : `${pending.length} pending`;
}

function enqueue(command: Command) {
  pending.push(command);
  renderPending();
}

function runPending() {
  while (pending.length > 0) pending.shift()!.execute();
  renderPending();
}

function clearPending() {
  pending.length = 0;
  renderPending();
}

runButton.onclick = runPending;
clearButton.onclick = clearPending;

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

const gridSize = 5;
let x = 2;
let y = 2;
let directionIndex = 0;

function clamp(value: number): number {
  return Math.min(gridSize - 1, Math.max(0, value));
}

function moveForward() {
  const heading = directions[directionIndex];
  x = clamp(x + heading.dx);
  y = clamp(y + heading.dy);
  drawRover();
}

function turnRight() {
  directionIndex = (directionIndex + 1) % directions.length;
  drawRover();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < gridSize; row++) {
    for (let column = 0; column < gridSize; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[directionIndex].name
  }`;
}

interface Command {
  label: string;
  execute(): void;
}

const forwardCommand: Command = { label: "Forward", execute: moveForward };
const rightCommand: Command = { label: "Right", execute: turnRight };

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueue(forwardCommand);
};

document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueue(rightCommand);
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  drawRover();
  clearPending();
};
drawRover();
renderPending();
