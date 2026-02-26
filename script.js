// Sample accounting data for demonstration
const accountingData = {
  sessions: {
    2024: {
      monthly: [
        { month: "Apr", income: 420000, expenses: 260000 },
        { month: "May", income: 445000, expenses: 275000 },
        { month: "Jun", income: 430000, expenses: 262000 },
        { month: "Jul", income: 460000, expenses: 286000 },
        { month: "Aug", income: 478000, expenses: 295000 },
        { month: "Sep", income: 452000, expenses: 280000 },
        { month: "Oct", income: 465000, expenses: 288000 },
        { month: "Nov", income: 472000, expenses: 291000 },
        { month: "Dec", income: 459000, expenses: 283000 },
        { month: "Jan", income: 448000, expenses: 276000 },
        { month: "Feb", income: 462000, expenses: 289000 },
        { month: "Mar", income: 486000, expenses: 301000 }
      ],
      classCollection: [
        { class: "Primary", billed: 1150000, collected: 1035000 },
        { class: "Middle", billed: 1380000, collected: 1212000 },
        { class: "High", billed: 1690000, collected: 1463000 }
      ]
    },
    2023: {
      monthly: [
        { month: "Apr", income: 382000, expenses: 251000 },
        { month: "May", income: 398000, expenses: 258000 },
        { month: "Jun", income: 394000, expenses: 252000 },
        { month: "Jul", income: 412000, expenses: 267000 },
        { month: "Aug", income: 423000, expenses: 271000 },
        { month: "Sep", income: 417000, expenses: 264000 },
        { month: "Oct", income: 426000, expenses: 269000 },
        { month: "Nov", income: 435000, expenses: 273000 },
        { month: "Dec", income: 429000, expenses: 268000 },
        { month: "Jan", income: 418000, expenses: 262000 },
        { month: "Feb", income: 424000, expenses: 265000 },
        { month: "Mar", income: 437000, expenses: 275000 }
      ],
      classCollection: [
        { class: "Primary", billed: 1080000, collected: 958000 },
        { class: "Middle", billed: 1260000, collected: 1104000 },
        { class: "High", billed: 1590000, collected: 1360000 }
      ]
    }
  },
  studentDues: [
    {
      id: 1,
      name: "Aarav Sharma",
      class: "10",
      roll: "10-21",
      total: 60000,
      paid: 48000,
      lastPayment: "2081-11-10"
    },
    {
      id: 2,
      name: "Priya Verma",
      class: "8",
      roll: "8-14",
      total: 52000,
      paid: 45500,
      lastPayment: "2081-10-25"
    },
    {
      id: 3,
      name: "Rohan Gupta",
      class: "3",
      roll: "3-33",
      total: 42000,
      paid: 39000,
      lastPayment: "2081-10-15"
    },
    {
      id: 4,
      name: "Saanvi Mehta",
      class: "9",
      roll: "9-09",
      total: 60000,
      paid: 54000,
      lastPayment: "2081-11-05"
    },
    {
      id: 5,
      name: "Aditya Singh",
      class: "7",
      roll: "7-27",
      total: 52000,
      paid: 44200,
      lastPayment: "2081-09-30"
    },
    {
      id: 6,
      name: "Kavya Nair",
      class: "2",
      roll: "2-11",
      total: 42000,
      paid: 42000,
      lastPayment: "2081-11-01"
    },
    {
      id: 7,
      name: "Ishaan Roy",
      class: "10",
      roll: "10-32",
      total: 60000,
      paid: 51000,
      lastPayment: "2081-09-20"
    }
  ]
};

const termFilter = document.getElementById("termFilter");
const classFilter = document.getElementById("classFilter");
const searchStudent = document.getElementById("searchStudent");
const schoolIdInput = document.getElementById("schoolIdInput");
const schoolPinInput = document.getElementById("schoolPinInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authStatus = document.getElementById("authStatus");
const studentNameInput = document.getElementById("studentName");
const studentClassInput = document.getElementById("studentClass");
const studentRollInput = document.getElementById("studentRoll");
const studentTotalInput = document.getElementById("studentTotal");
const studentPaidInput = document.getElementById("studentPaid");
const studentDateInput = document.getElementById("studentDate");
const addStudentBtn = document.getElementById("addStudentBtn");
const guardianQueryInput = document.getElementById("guardianQuery");
const guardianFindBtn = document.getElementById("guardianFindBtn");
const guardianCard = document.getElementById("guardianCard");
const sidebarNavButtons = document.querySelectorAll(".nav-item[data-target]");

const kpiBilled = document.getElementById("kpiBilled");
const kpiBilledChange = document.getElementById("kpiBilledChange");
const kpiCollected = document.getElementById("kpiCollected");
const kpiCollectionRate = document.getElementById("kpiCollectionRate");
const kpiOutstanding = document.getElementById("kpiOutstanding");
const kpiOutstandingShare = document.getElementById("kpiOutstandingShare");
const kpiNetBalance = document.getElementById("kpiNetBalance");
const kpiNetTrend = document.getElementById("kpiNetTrend");

const duesTableBody = document.getElementById("duesTableBody");

let cashflowChart;
let classCollectionChart;
let nextStudentId = accountingData.studentDues.length + 1;
let currentSchoolId = null;

const STORAGE_KEY = "schoolAccountingApp_accounts";
const LAST_ACCOUNT_KEY = "schoolAccountingApp_lastAccount";

function loadAccounts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function persistCurrentAccount() {
  if (!currentSchoolId) return;
  const accounts = loadAccounts();
  accounts[currentSchoolId] = accounts[currentSchoolId] || {};
  accounts[currentSchoolId].pin = accounts[currentSchoolId].pin || "";
  accounts[currentSchoolId].studentDues = accountingData.studentDues;
  saveAccounts(accounts);
}

function switchToAccount(schoolId, pin, createIfMissing = false) {
  const accounts = loadAccounts();
  const existing = accounts[schoolId];

  if (existing) {
    if (existing.pin && existing.pin !== pin) {
      alert("Incorrect PIN for this School ID.");
      return false;
    }
    accountingData.studentDues = existing.studentDues || [];
  } else if (createIfMissing) {
    accounts[schoolId] = { pin, studentDues: [] };
    saveAccounts(accounts);
    accountingData.studentDues = [];
  } else {
    alert("No data found for this School ID. Enter a PIN to create a new account.");
    return false;
  }

  currentSchoolId = schoolId;
  nextStudentId =
    (accountingData.studentDues.reduce((max, s) => Math.max(max, s.id || 0), 0) || 0) + 1;

  authStatus.textContent = `School: ${schoolId}`;
  loginBtn.hidden = true;
  logoutBtn.hidden = false;
  schoolIdInput.value = "";
  schoolPinInput.value = "";

  localStorage.setItem(LAST_ACCOUNT_KEY, schoolId);

  renderStudentDues();
  return true;
}

function handleLogin() {
  const schoolIdRaw = schoolIdInput.value.trim();
  const pin = schoolPinInput.value.trim();

  if (!schoolIdRaw) {
    alert("Please enter a School ID.");
    return;
  }

  const schoolId = schoolIdRaw.toUpperCase();
  const accounts = loadAccounts();
  const exists = !!accounts[schoolId];

  if (!exists && !pin) {
    alert("New account: please set a PIN to create this School ID.");
    return;
  }

  switchToAccount(schoolId, pin, !exists);
}

function handleLogout() {
  currentSchoolId = null;
  authStatus.textContent = "Guest mode";
  loginBtn.hidden = false;
  logoutBtn.hidden = true;
  // keep current data in memory, but no further auto-saving until login
}

function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function computeSessionTotals(sessionKey) {
  const current = accountingData.sessions[sessionKey];
  const previousKey = sessionKey === "2024" ? "2023" : null;
  const previous = previousKey ? accountingData.sessions[previousKey] : null;

  const currentBilled = current.classCollection.reduce((sum, c) => sum + c.billed, 0);
  const currentCollected = current.classCollection.reduce((sum, c) => sum + c.collected, 0);
  const currentOutstanding = currentBilled - currentCollected;
  const currentExpenses = current.monthly.reduce((sum, m) => sum + m.expenses, 0);
  const currentNet = currentCollected - currentExpenses;

  let billedChangePct = 0;
  let netTrendLabel = "Stable";

  if (previous) {
    const prevBilled = previous.classCollection.reduce((sum, c) => sum + c.billed, 0);
    billedChangePct = prevBilled ? ((currentBilled - prevBilled) / prevBilled) * 100 : 0;

    const prevExpenses = previous.monthly.reduce((sum, m) => sum + m.expenses, 0);
    const prevCollected = previous.classCollection.reduce((sum, c) => sum + c.collected, 0);
    const prevNet = prevCollected - prevExpenses;
    const diffNet = currentNet - prevNet;
    if (diffNet > 0) netTrendLabel = "Improved vs last session";
    else if (diffNet < 0) netTrendLabel = "Lower vs last session";
  }

  return {
    billed: currentBilled,
    collected: currentCollected,
    outstanding: currentOutstanding,
    expenses: currentExpenses,
    net: currentNet,
    billedChangePct,
    collectionRate: currentBilled ? (currentCollected / currentBilled) * 100 : 0,
    outstandingShare: currentBilled ? (currentOutstanding / currentBilled) * 100 : 0,
    netTrendLabel
  };
}

function updateKpis() {
  const term = termFilter.value === "all" ? "2024" : termFilter.value;
  const totals = computeSessionTotals(term);

  kpiBilled.textContent = formatCurrency(totals.billed);
  const changeSymbol = totals.billedChangePct >= 0 ? "↑" : "↓";
  kpiBilledChange.textContent = `${changeSymbol} ${Math.abs(totals.billedChangePct).toFixed(
    1
  )}% vs last session`;

  kpiCollected.textContent = formatCurrency(totals.collected);
  kpiCollectionRate.textContent = `${totals.collectionRate.toFixed(1)}% collection rate`;

  kpiOutstanding.textContent = formatCurrency(totals.outstanding);
  kpiOutstandingShare.textContent = `${totals.outstandingShare.toFixed(
    1
  )}% of total fees outstanding`;

  kpiNetBalance.textContent = formatCurrency(totals.net);
  kpiNetTrend.textContent = totals.netTrendLabel;
}

function buildCashflowChart(range = "current") {
  const ctx = document.getElementById("cashflowChart").getContext("2d");
  const sessionKey = range === "current" ? "2024" : "2023";
  const data = accountingData.sessions[sessionKey].monthly;

  const labels = data.map((d) => d.month);
  const income = data.map((d) => d.income);
  const expenses = data.map((d) => d.expenses);

  if (cashflowChart) {
    cashflowChart.data.labels = labels;
    cashflowChart.data.datasets[0].data = income;
    cashflowChart.data.datasets[1].data = expenses;
    cashflowChart.update();
    return;
  }

  cashflowChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Income",
          data: income,
          borderColor: "#4ade80",
          backgroundColor: "rgba(74, 222, 128, 0.16)",
          tension: 0.35,
          fill: true,
          borderWidth: 2.2,
          pointRadius: 2.6,
          pointBackgroundColor: "#4ade80"
        },
        {
          label: "Expenses",
          data: expenses,
          borderColor: "#f97316",
          backgroundColor: "rgba(249, 115, 22, 0.14)",
          tension: 0.35,
          fill: true,
          borderWidth: 2.1,
          pointRadius: 2.6,
          pointBackgroundColor: "#f97316"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#9ca3af",
            font: { size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 }
          },
          grid: {
            color: "rgba(31, 41, 55, 0.7)"
          }
        },
        y: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 },
            callback(value) {
              return "₹" + (value / 1000).toFixed(0) + "k";
            }
          },
          grid: {
            color: "rgba(31, 41, 55, 0.7)"
          }
        }
      }
    }
  });
}

function buildClassCollectionChart() {
  const ctx = document.getElementById("classCollectionChart").getContext("2d");
  const term = termFilter.value === "all" ? "2024" : termFilter.value;
  const data = accountingData.sessions[term].classCollection;

  const labels = data.map((d) => d.class);
  const billed = data.map((d) => d.billed);
  const collected = data.map((d) => d.collected);

  if (classCollectionChart) {
    classCollectionChart.data.labels = labels;
    classCollectionChart.data.datasets[0].data = billed;
    classCollectionChart.data.datasets[1].data = collected;
    classCollectionChart.update();
    return;
  }

  classCollectionChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Billed",
          data: billed,
          backgroundColor: "rgba(129, 140, 248, 0.6)",
          borderRadius: 9,
          maxBarThickness: 40
        },
        {
          label: "Collected",
          data: collected,
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderRadius: 9,
          maxBarThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#9ca3af",
            font: { size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 }
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: "#6b7280",
            font: { size: 10 },
            callback(value) {
              return "₹" + (value / 1000).toFixed(0) + "k";
            }
          },
          grid: {
            color: "rgba(31, 41, 55, 0.7)"
          }
        }
      }
    }
  });
}

function renderStudentDues() {
  const classFilterValue = classFilter.value;
  const query = searchStudent.value.trim().toLowerCase();

  let rows = accountingData.studentDues.map((s) => ({
    ...s,
    outstanding: s.total - s.paid
  }));

  if (classFilterValue !== "all") {
    rows = rows.filter((r) => r.class === classFilterValue);
  }

  if (query) {
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.class.toLowerCase().includes(query) ||
        r.roll.toLowerCase().includes(query)
    );
  }

  rows.sort((a, b) => b.outstanding - a.outstanding);

  duesTableBody.innerHTML = "";

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    const outstandingClass = r.outstanding > 6000 ? "badge-outstanding" : "badge-outstanding badge-low";

    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.class}</td>
      <td>${r.roll}</td>
      <td class="amount">${formatCurrency(r.total)}</td>
      <td class="amount amount-paid">${formatCurrency(r.paid)}</td>
      <td><span class="${outstandingClass}">${formatCurrency(r.outstanding)}</span></td>
      <td>${r.lastPayment}</td>
      <td><button class="icon-button icon-button-danger delete-student" data-id="${r.id}">Delete</button></td>
    `;

    duesTableBody.appendChild(tr);
  });
}

function setRangeButtons(range) {
  document.querySelectorAll(".chip[data-range]").forEach((btn) => {
    btn.classList.toggle("chip-active", btn.dataset.range === range);
  });
}

function handleAddStudent() {
  const name = studentNameInput.value.trim();
  const cls = studentClassInput.value;
  const roll = studentRollInput.value.trim();
  const total = Number(studentTotalInput.value);
  const paid = Number(studentPaidInput.value);
  const date = studentDateInput.value.trim();

  if (!name || !cls || !roll || !Number.isFinite(total) || !Number.isFinite(paid)) {
    alert("Please fill name, class, roll, total fees and paid amount.");
    return;
  }

  const newStudent = {
    id: nextStudentId++,
    name,
    class: cls,
    roll,
    total,
    paid,
    lastPayment: date || "2081-01-01"
  };

  accountingData.studentDues.push(newStudent);

  studentNameInput.value = "";
  studentClassInput.value = "";
  studentRollInput.value = "";
  studentTotalInput.value = "";
  studentPaidInput.value = "";
  studentDateInput.value = "";

  renderStudentDues();
  persistCurrentAccount();
}

function handleDeleteStudent(event) {
  const target = event.target;
  if (!target.classList.contains("delete-student")) return;

  const id = Number(target.dataset.id);
  const index = accountingData.studentDues.findIndex((s) => s.id === id);
  if (index !== -1) {
    accountingData.studentDues.splice(index, 1);
    renderStudentDues();
    persistCurrentAccount();
  }
}

function renderGuardianCard(student) {
  if (!student) {
    guardianCard.textContent = "No student found.";
    return;
  }

  const outstanding = student.total - student.paid;
  guardianCard.innerHTML = `
    <div><strong>${student.name}</strong> (${student.class}, Roll ${student.roll})</div>
    <div>Total: ${formatCurrency(student.total)} &nbsp; | &nbsp;
      Paid: <span class="amount-paid">${formatCurrency(student.paid)}</span> &nbsp; | &nbsp;
      Due: <span class="amount-outstanding">${formatCurrency(outstanding)}</span>
    </div>
    <div>Last payment (NP): ${student.lastPayment || "—"}</div>
  `;
}

function handleGuardianFind() {
  const q = guardianQueryInput.value.trim().toLowerCase();
  if (!q) {
    guardianCard.textContent = "Type a roll no. or name to search.";
    return;
  }

  const match =
    accountingData.studentDues.find(
      (s) =>
        (s.roll && s.roll.toLowerCase() === q) ||
        (s.name && s.name.toLowerCase().includes(q))
    ) || null;

  renderGuardianCard(match);
}

function initEventListeners() {
  termFilter.addEventListener("change", () => {
    updateKpis();
    buildCashflowChart(document.querySelector(".chip-active").dataset.range);
    buildClassCollectionChart();
    renderStudentDues();
  });

  classFilter.addEventListener("change", () => {
    renderStudentDues();
  });

  searchStudent.addEventListener("input", () => {
    renderStudentDues();
  });

  document.querySelectorAll(".chip[data-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const range = btn.dataset.range;
      setRangeButtons(range);
      buildCashflowChart(range);
    });
  });

  if (addStudentBtn) {
    addStudentBtn.addEventListener("click", handleAddStudent);
  }

  duesTableBody.addEventListener("click", handleDeleteStudent);

  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  if (guardianFindBtn) {
    guardianFindBtn.addEventListener("click", handleGuardianFind);
  }
  if (guardianQueryInput) {
    guardianQueryInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleGuardianFind();
      }
    });
  }

  sidebarNavButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;

      sidebarNavButtons.forEach((b) => b.classList.remove("nav-item-active"));
      btn.classList.add("nav-item-active");

      let sectionElement = null;
      if (target === "overview") {
        sectionElement = document.getElementById("overviewSection");
      } else if (target === "fees") {
        sectionElement = document.getElementById("feesSection");
      } else if (target === "expenses") {
        sectionElement = document.getElementById("expensesSection");
      }

      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target === "reports") {
        alert("Reports section will come in a future version. For now, use charts and table above.");
      }
    });
  });
}

function initDashboard() {
  updateKpis();
  buildCashflowChart("current");
  buildClassCollectionChart();
  renderStudentDues();
  initEventListeners();

  // Auto-login last account if available
  const last = localStorage.getItem(LAST_ACCOUNT_KEY);
  if (last) {
    const accounts = loadAccounts();
    if (accounts[last]) {
      switchToAccount(last, accounts[last].pin || "", false);
    }
  } else {
    authStatus.textContent = "Guest mode";
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);

