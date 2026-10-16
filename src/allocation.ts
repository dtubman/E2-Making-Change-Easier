export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewTotal = 6;
const startingcrewOnSupplies = 2;
const suppliesPerProducer = 3;
const suppliesPerCrewmember = 1;
let crewOnSupplies = startingcrewOnSupplies;

interface ShiftResult {
  crewOnSupplies: number;
  crewTotal: number;
  suppliesProduced: number;
  suppliesConsumed: number;
  balance: number;
}

function calculateShift(crewOnSupplies: number): ShiftResult {
  const suppliesProduced = crewOnSupplies * suppliesPerProducer;
  const suppliesConsumed = crewTotal * suppliesPerCrewmember;
  return {
    crewOnSupplies,
    crewTotal,
    suppliesProduced,
    suppliesConsumed,
    balance: suppliesProduced - suppliesConsumed,
  };
}

function formatBalance(balance: number): string {
  return `${balance > 0 ? "+" : ""}${balance}`;
}

function drawCrewRoster(shift: ShiftResult) {
  for (let i = 0; i < shift.crewTotal; i++) {
    const onSupplies = i < shift.crewOnSupplies;
    ctx.fillStyle = onSupplies ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = onSupplies ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawProductionRow(shift: ShiftResult) {
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${shift.crewOnSupplies} / ${shift.crewTotal}`,
    18,
    76,
  );
  ctx.fillText(`Production: ${shift.suppliesProduced}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shift.suppliesProduced * 14, 20);
}

function drawConsumptionRow(shift: ShiftResult) {
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shift.suppliesConsumed}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shift.suppliesConsumed * 14, 20);
}

function renderText(shift: ShiftResult) {
  readout.textContent =
    `Assigned: ${shift.crewOnSupplies}/${shift.crewTotal} · Production: ${shift.suppliesProduced} · Consumption: ${shift.suppliesConsumed} · Balance: ${
      formatBalance(shift.balance)
    }`;
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const shift = calculateShift(crewOnSupplies);
  drawCrewRoster(shift);
  drawProductionRow(shift);
  drawConsumptionRow(shift);
  renderText(shift);
}

function setCrewOnSupplies(next: number) {
  crewOnSupplies = Math.min(crewTotal, Math.max(0, next));
  update();
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  setCrewOnSupplies(crewOnSupplies - 1);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  setCrewOnSupplies(crewOnSupplies + 1);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    setCrewOnSupplies(startingcrewOnSupplies);
  };
update();
