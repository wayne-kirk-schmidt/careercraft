
let dataBatches = [];
let currentBatch = 1;
let totalBatches = 1;
const rowsPerPage = 9;

function splitIntoBatches(data, size) {
  const batches = [];
  for (let i = 0; i < data.length; i += size) {
    batches.push(data.slice(i, i + size));
  }
  return batches;
}

function renderBatch(batchNum) {
  if (!dataBatches.length) return;
  totalBatches = dataBatches.length;
  currentBatch = Math.max(1, Math.min(batchNum, totalBatches));
  const rows = dataBatches[currentBatch - 1];

  const tableBody = document.getElementById("results-table-body");
  const pageDisplay = document.getElementById("pagination-page");

  tableBody.innerHTML = "";
  rows.forEach((item, index) => {
    const key = item.uniqueKey || `${item.businessName}-${item.location}-${item.positionName}-${item.seniority}-${item.positionUrl}`;
    const row = document.createElement("tr");
    row.id = key;
    row.innerHTML = `
      <td class="border px-2 py-1">${(currentBatch - 1) * rowsPerPage + index + 1}</td>
      <td class="border px-2 py-1">${item.businessName}</td>
      <td class="border px-2 py-1">${item.positionName}</td>
      <td class="border px-2 py-1">${item.seniority}</td>
      <td class="border px-2 py-1">${item.location}</td>
      <td class="border px-2 py-1"><a href="${item.positionUrl}" class="text-blue-600 underline" target="_blank">Link</a></td>
    `;
    tableBody.appendChild(row);
  });

  if (pageDisplay) {
    pageDisplay.textContent = `Page ${currentBatch} of ${totalBatches}`;
  }
}

function goToFirstBatch() {
  renderBatch(1);
}
function goToPrevBatch() {
  renderBatch(currentBatch - 1);
}
function goToNextBatch() {
  renderBatch(currentBatch + 1);
}
function goToFinalBatch() {
  renderBatch(totalBatches);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/positions.sample.json")
    .then(res => res.json())
    .then(data => {
      const enriched = data.map(item => {
        if (!item.uniqueKey) {
          item.uniqueKey = `${item.businessName}-${item.location}-${item.positionName}-${item.seniority}-${item.positionUrl}`;
        }
        return item;
      });
      dataBatches = splitIntoBatches(enriched, rowsPerPage);
      renderBatch(1);

      document.getElementById("btn-first").addEventListener("click", goToFirstBatch);
      document.getElementById("btn-prev").addEventListener("click", goToPrevBatch);
      document.getElementById("btn-next").addEventListener("click", goToNextBatch);
      document.getElementById("btn-last").addEventListener("click", goToFinalBatch);
    })
    .catch(err => console.error("Failed to load data:", err));
});
