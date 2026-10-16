export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewTotal = 6;
const startingCrewWorking = 2;
const suppliesPerProducer = 3;
const suppliesPerCrewmember = 1;
let crewWorking = startingCrewWorking;

function calculateSuppliesProduced(): number {
  return crewWorking * suppliesPerProducer;
}

function calculateSuppliesConsumed(): number {
  return crewTotal * suppliesPerCrewmember;
}

function formatBalance(balance: number): string {
  return `${balance > 0 ? "+" : ""}${balance}`;
}

function drawCrewRoster() {
  for (let i = 0; i < crewTotal; i++) {
    const onSupplies = i < crewWorking;
    ctx.fillStyle = onSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = onSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawProductionRow(production: number) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${crewWorking} / ${crewTotal}`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
}

function drawConsumptionRow(consumption: number) {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
}

function renderText(production: number, consumption: number, balance: number) {
  readout.textContent =
    `Assigned: ${crewWorking}/crewTotal · Production: ${production} · Consumption: ${consumption} · Balance: ${
      formatBalance(balance)
    }`;
}

function update() {
  const suppliesProduced = calculateSuppliesProduced();
  const suppliesConsumed = calculateSuppliesConsumed();
  const balance = suppliesProduced - suppliesConsumed;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewRoster();
  drawProductionRow(suppliesProduced);
  drawConsumptionRow(suppliesConsumed);
  renderText(suppliesProduced, suppliesConsumed, balance);
}

function setProducersWorking(next: number) {
  crewWorking = Math.min(crewTotal, Math.max(0, next));
  update();
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  setProducersWorking(crewWorking - 1);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  setProducersWorking(crewWorking + 1);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    setProducersWorking(startingCrewWorking);
  };
update();
