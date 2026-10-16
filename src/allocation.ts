export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewTotal = 6;
const startingCrewOnSupplies = 2;
const suppliesPerProducer = 3;
const suppliesPerCrewmember = 1;
let crewOnSupplies = startingCrewOnSupplies;

interface ShiftResult {
  crewOnSupplies: number;
  crewTotal: number;
  suppliesProduced: number;
  suppliesConsumed: number;
  balance: number;
}

interface ReportRow {
  label: string;
  color: string;
  value: (shift: ShiftResult) => number;
}

const reportRows: ReportRow[] = [
  {
    label: "Production",
    color: "#27766b",
    value: (shift) => shift.suppliesProduced,
  },
  {
    label: "Consumption",
    color: "#a44d23",
    value: (shift) => shift.suppliesConsumed,
  },
];

const firstRowY = 102;
const rowSpacing = 52;
const barOffsetY = 8;
const barScale = 14;

function drawReportRows(shift: ShiftResult) {
  reportRows.forEach((row, index) => {
    const labelY = firstRowY + index * rowSpacing;
    const amount = row.value(shift);
    ctx.fillStyle = "#233e43";
    ctx.font = "14px system-ui";
    ctx.fillText(`${row.label}: ${amount}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + barOffsetY, amount * barScale, 20);
  });
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
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(
    `Producers: ${shift.crewOnSupplies} / ${shift.crewTotal}`,
    18,
    76,
  );
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
  drawReportRows(shift);
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
    setCrewOnSupplies(startingCrewOnSupplies);
  };
update();
