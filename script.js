const STORAGE_KEY = "dreamlog_entries_v1";
const CAFFEINE_KEY = "dreamlog_caffeine_v1";
const BASELINE_SLEEP_HOURS = 8.0;

// 21-day realistic student dataset demonstrating positive correlation between sleep & focus
const SEED_LOGS = [
  { id: "d01", date: "2026-10-30", bedtime: "01:15", wakeTime: "06:30", sleepHours: 5.25, sleepQuality: 2, studyHours: 6.5, focusRating: 2, subjects: "Algorithms" },
  { id: "d02", date: "2026-10-31", bedtime: "00:45", wakeTime: "06:45", sleepHours: 6.0, sleepQuality: 3, studyHours: 5.5, focusRating: 2, subjects: "Operating Systems" },
  { id: "d03", date: "2026-11-01", bedtime: "23:30", wakeTime: "07:30", sleepHours: 8.0, sleepQuality: 4, studyHours: 4.5, focusRating: 5, subjects: "Algorithms" },
  { id: "d04", date: "2026-11-02", bedtime: "23:15", wakeTime: "07:15", sleepHours: 8.0, sleepQuality: 5, studyHours: 5.0, focusRating: 5, subjects: "Linear Algebra" },
  { id: "d05", date: "2026-11-03", bedtime: "01:30", wakeTime: "06:30", sleepHours: 5.0, sleepQuality: 2, studyHours: 7.0, focusRating: 2, subjects: "Database Systems" },
  { id: "d06", date: "2026-11-04", bedtime: "00:30", wakeTime: "06:30", sleepHours: 6.0, sleepQuality: 3, studyHours: 5.5, focusRating: 3, subjects: "Operating Systems" },
  { id: "d07", date: "2026-11-05", bedtime: "23:45", wakeTime: "07:15", sleepHours: 7.5, sleepQuality: 4, studyHours: 4.5, focusRating: 4, subjects: "Algorithms" },
  { id: "d08", date: "2026-11-06", bedtime: "23:00", wakeTime: "07:30", sleepHours: 8.5, sleepQuality: 5, studyHours: 5.0, focusRating: 5, subjects: "Machine Learning" },
  { id: "d09", date: "2026-11-07", bedtime: "02:00", wakeTime: "07:00", sleepHours: 5.0, sleepQuality: 1, studyHours: 6.0, focusRating: 1, subjects: "Computer Networks" },
  { id: "d10", date: "2026-11-08", bedtime: "00:15", wakeTime: "06:45", sleepHours: 6.5, sleepQuality: 3, studyHours: 4.5, focusRating: 3, subjects: "Linear Algebra" },
  { id: "d11", date: "2026-11-09", bedtime: "23:20", wakeTime: "07:20", sleepHours: 8.0, sleepQuality: 4, studyHours: 4.5, focusRating: 4, subjects: "Database Systems" },
  { id: "d12", date: "2026-11-10", bedtime: "23:40", wakeTime: "07:10", sleepHours: 7.5, sleepQuality: 4, studyHours: 4.0, focusRating: 4, subjects: "Machine Learning" },
  { id: "d13", date: "2026-11-11", bedtime: "01:00", wakeTime: "06:30", sleepHours: 5.5, sleepQuality: 2, studyHours: 6.5, focusRating: 2, subjects: "Computer Networks" },
  { id: "d14", date: "2026-11-12", bedtime: "23:10", wakeTime: "07:10", sleepHours: 8.0, sleepQuality: 5, studyHours: 5.0, focusRating: 5, subjects: "Algorithms" },
  { id: "d15", date: "2026-11-13", bedtime: "00:20", wakeTime: "06:50", sleepHours: 6.5, sleepQuality: 3, studyHours: 5.0, focusRating: 3, subjects: "Operating Systems" },
  { id: "d16", date: "2026-11-14", bedtime: "23:30", wakeTime: "07:00", sleepHours: 7.5, sleepQuality: 4, studyHours: 4.0, focusRating: 4, subjects: "Linear Algebra" },
  { id: "d17", date: "2026-11-15", bedtime: "22:45", wakeTime: "07:15", sleepHours: 8.5, sleepQuality: 5, studyHours: 5.5, focusRating: 5, subjects: "Machine Learning" },
  { id: "d18", date: "2026-11-16", bedtime: "01:10", wakeTime: "06:40", sleepHours: 5.5, sleepQuality: 2, studyHours: 6.0, focusRating: 2, subjects: "Database Systems" },
  { id: "d19", date: "2026-11-17", bedtime: "23:35", wakeTime: "07:05", sleepHours: 7.5, sleepQuality: 4, studyHours: 4.5, focusRating: 4, subjects: "Computer Networks" },
  { id: "d20", date: "2026-11-18", bedtime: "23:00", wakeTime: "07:00", sleepHours: 8.0, sleepQuality: 4, studyHours: 5.0, focusRating: 5, subjects: "Algorithms" },
  { id: "d21", date: "2026-11-19", bedtime: "00:40", wakeTime: "06:40", sleepHours: 6.0, sleepQuality: 3, studyHours: 5.5, focusRating: 3, subjects: "Operating Systems" }
];

const SEED_CAFFEINE = [
  { mg: 120, time: "14:00", label: "Coffee" }
];

let entries = loadEntries();
let caffeineLogs = loadCaffeine();
let latestEntryId = entries[entries.length - 1]?.id || null;
let scatterChartInstance = null;
let caffeineChartInstance = null;

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...SEED_LOGS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...SEED_LOGS];
  } catch {
    return [...SEED_LOGS];
  }
}

function saveEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadCaffeine() {
  try {
    const raw = localStorage.getItem(CAFFEINE_KEY);
    if (!raw) return [...SEED_CAFFEINE];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...SEED_CAFFEINE];
  } catch {
    return [...SEED_CAFFEINE];
  }
}

function saveCaffeine() {
  localStorage.setItem(CAFFEINE_KEY, JSON.stringify(caffeineLogs));
}

// Handles midnight crossover accurately (e.g., 23:30 to 07:30 = 8.0 hours)
function calculateSleepDurationHours(bedtimeStr, wakeTimeStr) {
  if (!bedtimeStr || !wakeTimeStr) return 0;
  const [bH, bM] = bedtimeStr.split(":").map(Number);
  const [wH, wM] = wakeTimeStr.split(":").map(Number);

  let bedMinutes = bH * 60 + bM;
  let wakeMinutes = wH * 60 + wM;

  if (wakeMinutes <= bedMinutes) {
    wakeMinutes += 24 * 60;
  }
  return Number(((wakeMinutes - bedMinutes) / 60).toFixed(2));
}

function formatHoursToTime(totalMinutes) {
  const wrapped = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Pearson correlation coefficient (r) between sleepHours and focusRating
function computePearsonCorrelation(data) {
  const n = data.length;
  if (n < 2) return null;

  const xs = data.map((d) => d.sleepHours);
  const ys = data.map((d) => d.focusRating);

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) return 0;
  return Number((num / Math.sqrt(denX * denY)).toFixed(2));
}

// Ordinary Least Squares (OLS) linear regression: y = slope * x + intercept
function computeLinearRegression(data) {
  const n = data.length;
  if (n < 2) return null;

  const meanX = data.reduce((sum, d) => sum + d.sleepHours, 0) / n;
  const meanY = data.reduce((sum, d) => sum + d.focusRating, 0) / n;

  let num = 0;
  let den = 0;
  for (const d of data) {
    num += (d.sleepHours - meanX) * (d.focusRating - meanY);
    den += (d.sleepHours - meanX) ** 2;
  }

  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

function describeCorrelation(r) {
  if (r === null) return { label: "Insufficient Data", cls: "neutral" };
  const abs = Math.abs(r);
  const dir = r >= 0 ? "Positive" : "Negative";
  if (abs >= 0.7) return { label: `Strong ${dir} Correlation`, cls: r >= 0 ? "positive" : "warning" };
  if (abs >= 0.4) return { label: `Moderate ${dir} Correlation`, cls: r >= 0 ? "positive" : "amber" };
  if (abs >= 0.2) return { label: `Weak ${dir} Correlation`, cls: "neutral" };
  return { label: "No Linear Correlation", cls: "neutral" };
}

function renderKPIs() {
  const r = computePearsonCorrelation(entries);
  const desc = describeCorrelation(r);

  const pearsonEl = document.getElementById("pearsonValue");
  const badgeEl = document.getElementById("correlationBadge");
  const confEl = document.getElementById("sampleConfidenceText");

  pearsonEl.textContent = r === null ? "N/A" : (r > 0 ? `+${r.toFixed(2)}` : r.toFixed(2));
  badgeEl.textContent = desc.label;
  badgeEl.className = `kpi-badge ${desc.cls}`;

  if (entries.length < 7) {
    confEl.textContent = `Needs at least 7 days of logs for statistical confidence (${entries.length}/7 logged)`;
    confEl.style.color = "#fbbf24";
  } else {
    confEl.textContent = `Statistical sample: ${entries.length} days logged (confident)`;
    confEl.style.color = "";
  }

  // Last 7 days cumulative sleep debt against 8.0h baseline
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const weeklyDebt = last7.reduce((acc, item) => acc + Math.max(0, BASELINE_SLEEP_HOURS - item.sleepHours), 0);
  const avgSleep = entries.length
    ? entries.reduce((acc, item) => acc + item.sleepHours, 0) / entries.length
    : 0;

  const debtEl = document.getElementById("sleepDebtValue");
  const debtBadge = document.getElementById("sleepDebtBadge");
  debtEl.textContent = `${weeklyDebt.toFixed(1)}h`;
  debtBadge.textContent = weeklyDebt <= 2 ? "Low weekly deficit" : weeklyDebt <= 6 ? "Moderate weekly deficit" : "High sleep debt";
  debtBadge.className = `kpi-badge ${weeklyDebt <= 2 ? "positive" : weeklyDebt <= 6 ? "amber" : "warning"}`;
  document.getElementById("avgSleepText").textContent = `Avg sleep: ${avgSleep.toFixed(1)}h / night`;

  // Average focus & study hours
  const avgFocus = entries.length
    ? entries.reduce((acc, item) => acc + item.focusRating, 0) / entries.length
    : 0;
  const avgStudy = entries.length
    ? entries.reduce((acc, item) => acc + item.studyHours, 0) / entries.length
    : 0;

  document.getElementById("avgFocusValue").textContent = `${avgFocus.toFixed(1)} / 5`;
  document.getElementById("avgStudyText").textContent = `Avg study: ${avgStudy.toFixed(1)}h / day`;

  // 7.5h+ sleep focus boost
  const highSleep = entries.filter((d) => d.sleepHours >= 7.5);
  const lowSleep = entries.filter((d) => d.sleepHours < 7.5);
  const highAvg = highSleep.length ? highSleep.reduce((s, d) => s + d.focusRating, 0) / highSleep.length : 0;
  const lowAvg = lowSleep.length ? lowSleep.reduce((s, d) => s + d.focusRating, 0) / lowSleep.length : 0;

  const boostEl = document.getElementById("boostValue");
  if (highSleep.length && lowSleep.length && lowAvg > 0) {
    const pct = Math.round(((highAvg - lowAvg) / lowAvg) * 100);
    boostEl.textContent = `${pct >= 0 ? "+" : ""}${pct}%`;
    document.getElementById("boostDetailText").textContent =
      `7.5h+ avg: ${highAvg.toFixed(1)}/5 vs <7.5h avg: ${lowAvg.toFixed(1)}/5`;
  } else {
    boostEl.textContent = "--%";
    document.getElementById("boostDetailText").textContent = "Log both <7.5h and >=7.5h nights to compare";
  }
}

function renderInsights() {
  const list = document.getElementById("insightsList");
  list.innerHTML = "";

  if (!entries.length) {
    list.innerHTML = "<li>Add sleep and study logs to generate personalized optimization insights.</li>";
    return;
  }

  const highSleep = entries.filter((d) => d.sleepHours >= 7.5);
  const lowSleep = entries.filter((d) => d.sleepHours < 7.5);
  const insights = [];

  if (highSleep.length && lowSleep.length) {
    const highFocus = highSleep.reduce((a, b) => a + b.focusRating, 0) / highSleep.length;
    const lowFocus = lowSleep.reduce((a, b) => a + b.focusRating, 0) / lowSleep.length;
    const diffPct = Math.round(((highFocus - lowFocus) / Math.max(lowFocus, 0.1)) * 100);
    insights.push(
      `Days following 7.5+ hours of sleep saw ${diffPct >= 0 ? `${diffPct}% higher` : `${Math.abs(diffPct)}% lower`} average study focus (${highFocus.toFixed(1)}/5 vs ${lowFocus.toFixed(1)}/5).`
    );
  }

  // Optimal sleep window in dataset
  const buckets = {};
  for (const e of entries) {
    const b = `${Math.floor(e.sleepHours)}h-${Math.floor(e.sleepHours) + 1}h`;
    if (!buckets[b]) buckets[b] = [];
    buckets[b].push(e.focusRating);
  }
  let bestBucket = null;
  let bestAvg = -1;
  for (const [b, vals] of Object.entries(buckets)) {
    const avg = vals.reduce((x, y) => x + y, 0) / vals.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestBucket = b;
    }
  }
  if (bestBucket) {
    insights.push(`Peak focus occurred in the ${bestBucket} sleep bucket with an average rating of ${bestAvg.toFixed(1)}/5.`);
  }

  // Diminishing returns check on long study hours with low sleep
  const longLowSleep = entries.filter((d) => d.studyHours >= 6 && d.sleepHours < 6.5);
  if (longLowSleep.length) {
    const avgF = longLowSleep.reduce((a, b) => a + b.focusRating, 0) / longLowSleep.length;
    insights.push(
      `Marathon study sessions (6h+) paired with <6.5h sleep averaged ${avgF.toFixed(1)}/5 focus—prioritizing 7.5–8h sleep protects retention.`
    );
  }

  const r = computePearsonCorrelation(entries);
  if (r !== null && r >= 0.5) {
    insights.push(
      `Logging 8.0 hours tonight shifts your weekly sleep-focus trend upward (current r = ${r > 0 ? `+${r}` : r}).`
    );
  }

  for (const text of insights.slice(0, 4)) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  }
}

function renderScatterChart() {
  const ctx = document.getElementById("sleepFocusChart").getContext("2d");
  const reg = computeLinearRegression(entries);
  const eqEl = document.getElementById("regressionEquation");
  document.getElementById("chartPointCount").textContent = `${entries.length} Logs`;

  const points = entries.map((d) => ({
    x: d.sleepHours,
    y: d.focusRating,
    date: d.date,
    subjects: d.subjects,
    studyHours: d.studyHours,
    isLatest: d.id === latestEntryId
  }));

  let trendlineData = [];
  if (reg && entries.length >= 2) {
    const minX = Math.max(3, Math.min(...entries.map((d) => d.sleepHours)) - 0.5);
    const maxX = Math.min(11, Math.max(...entries.map((d) => d.sleepHours)) + 0.5);
    const y1 = Number((reg.slope * minX + reg.intercept).toFixed(2));
    const y2 = Number((reg.slope * maxX + reg.intercept).toFixed(2));
    trendlineData = [
      { x: minX, y: y1 },
      { x: maxX, y: y2 }
    ];
    const sign = reg.intercept >= 0 ? "+" : "-";
    eqEl.textContent = `OLS Trendline: Focus = ${reg.slope.toFixed(2)}(Sleep) ${sign} ${Math.abs(reg.intercept).toFixed(2)} • Highlighted ring = Latest/Selected log`;
  } else {
    eqEl.textContent = "Add at least 2 logs to plot linear regression trendline";
  }

  if (scatterChartInstance) {
    scatterChartInstance.destroy();
  }

  scatterChartInstance = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Sleep vs. Focus Logs",
          data: points,
          backgroundColor: points.map((p) => (p.isLatest ? "#fbbf24" : "rgba(56, 189, 248, 0.75)")),
          borderColor: points.map((p) => (p.isLatest ? "#fef08a" : "#38bdf8")),
          borderWidth: points.map((p) => (p.isLatest ? 3 : 1.5)),
          pointRadius: points.map((p) => (p.isLatest ? 8 : 6)),
          pointHoverRadius: 9
        },
        {
          label: "OLS Trendline",
          type: "line",
          data: trendlineData,
          borderColor: "#34d399",
          borderWidth: 2,
          borderDash: [6, 5],
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: { display: true, text: "Sleep Duration (Hours)", color: "#94a3b8" },
          ticks: { color: "#94a3b8" },
          grid: { color: "rgba(148, 163, 184, 0.1)" }
        },
        y: {
          title: { display: true, text: "Study Focus Rating (1–5)", color: "#94a3b8" },
          min: 0.5,
          max: 5.5,
          ticks: { stepSize: 1, color: "#94a3b8" },
          grid: { color: "rgba(148, 163, 184, 0.1)" }
        }
      },
      plugins: {
        legend: { labels: { color: "#e2e8f0" } },
        tooltip: {
          callbacks: {
            label: (context) => {
              const raw = context.raw;
              if (context.dataset.label === "OLS Trendline") {
                return `Trend: ${raw.y} focus at ${raw.x.toFixed(1)}h sleep`;
              }
              return `${raw.date}: ${raw.x}h sleep → ${raw.y}/5 focus (${raw.studyHours}h ${raw.subjects})`;
            }
          }
        }
      }
    }
  });
}

function renderTable() {
  const tbody = document.getElementById("logsTableBody");
  document.getElementById("totalEntriesLabel").textContent = `${entries.length} entries`;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  tbody.innerHTML = sorted
    .map((entry) => {
      const debt = Math.max(0, BASELINE_SLEEP_HOURS - entry.sleepHours).toFixed(1);
      const stars = "★".repeat(entry.sleepQuality) + "☆".repeat(5 - entry.sleepQuality);
      return `
        <tr>
          <td>${entry.date}</td>
          <td><strong>${entry.sleepHours.toFixed(1)}h</strong> <small style="color:#64748b">(${entry.bedtime}–${entry.wakeTime})</small></td>
          <td style="color:#fbbf24">${stars}</td>
          <td>${debt > 0 ? `<span style="color:#fb7185">-${debt}h</span>` : `<span style="color:#34d399">0.0h</span>`}</td>
          <td>${entry.studyHours.toFixed(1)}h</td>
          <td><strong>${entry.focusRating}/5</strong></td>
          <td>${escapeHtml(entry.subjects)}</td>
          <td><button type="button" class="delete-btn" data-id="${entry.id}">Delete</button></td>
        </tr>
      `;
    })
    .join("");

  tbody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      entries = entries.filter((e) => e.id !== id);
      if (latestEntryId === id) latestEntryId = entries[entries.length - 1]?.id || null;
      saveEntries();
      refreshAll();
    });
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Stretch Feature 1: 90-minute sleep cycles bedtime recommender
function renderBedtimeRecommendations() {
  const wakeStr = document.getElementById("targetWakeTime").value || "07:00";
  const wakeMins = timeToMinutes(wakeStr);
  const latencyMins = 15; // typical time to fall asleep
  const container = document.getElementById("bedtimeRecommendations");

  // 6 cycles (9h), 5 cycles (7.5h), 4 cycles (6h)
  const cycleOptions = [
    { cycles: 6, label: "6 Cycles (9.0h)", tag: "Full Recovery" },
    { cycles: 5, label: "5 Cycles (7.5h)", tag: "Recommended" },
    { cycles: 4, label: "4 Cycles (6.0h)", tag: "Minimum Backup" }
  ];

  container.innerHTML = cycleOptions
    .map((opt) => {
      const bedMins = wakeMins - opt.cycles * 90 - latencyMins;
      return `
        <div class="cycle-chip">
          <strong>${formatHoursToTime(bedMins)}</strong>
          <span>${opt.label} • ${opt.tag}</span>
        </div>
      `;
    })
    .join("");
}

// Stretch Feature 2: Caffeine half-life (5 hours) visualization vs planned bedtime
function renderCaffeineChart() {
  const bedtimeStr = document.getElementById("caffeineBedtime").value || "23:30";
  const bedMins = timeToMinutes(bedtimeStr);
  const halfLifeHours = 5.0;

  // Sample hourly timeline from 12:00 to next day 02:00 (15 points)
  const labels = [];
  const remainingMg = [];

  for (let offset = 0; offset <= 14; offset++) {
    const mins = 12 * 60 + offset * 60;
    labels.push(formatHoursToTime(mins));

    let totalAtHour = 0;
    for (const item of caffeineLogs) {
      let cMins = timeToMinutes(item.time);
      if (cMins < 6 * 60) cMins += 24 * 60;
      const evalMins = mins < 6 * 60 ? mins + 24 * 60 : mins;
      const hoursElapsed = (evalMins - cMins) / 60;
      if (hoursElapsed >= 0) {
        totalAtHour += item.mg * Math.pow(0.5, hoursElapsed / halfLifeHours);
      }
    }
    remainingMg.push(Number(totalAtHour.toFixed(1)));
  }

  // Estimate caffeine at planned bedtime
  let mgAtBed = 0;
  for (const item of caffeineLogs) {
    let cMins = timeToMinutes(item.time);
    if (cMins < 6 * 60) cMins += 24 * 60;
    let bAdj = bedMins < 6 * 60 ? bedMins + 24 * 60 : bedMins;
    const elapsed = (bAdj - cMins) / 60;
    if (elapsed >= 0) {
      mgAtBed += item.mg * Math.pow(0.5, elapsed / halfLifeHours);
    }
  }

  const statusEl = document.getElementById("caffeineStatus");
  const lastLog = caffeineLogs[caffeineLogs.length - 1];
  const severityColor = mgAtBed > 50 ? "#fb7185" : mgAtBed > 25 ? "#fbbf24" : "#34d399";
  statusEl.innerHTML = `
    Latest: <strong>${lastLog ? `${lastLog.label} (${lastLog.mg}mg at ${lastLog.time})` : "None"}</strong> •
    Estimated active at ${formatHoursToTime(bedMins)}: <strong style="color:${severityColor}">${mgAtBed.toFixed(0)} mg</strong>
    ${mgAtBed > 50 ? "(May fragment deep sleep)" : "(Low sleep interference)"}
  `;

  const ctx = document.getElementById("caffeineChart").getContext("2d");
  if (caffeineChartInstance) caffeineChartInstance.destroy();

  caffeineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Remaining Caffeine (mg)",
          data: remainingMg,
          borderColor: "#fbbf24",
          backgroundColor: "rgba(251, 191, 36, 0.16)",
          fill: true,
          tension: 0.35,
          pointRadius: 2.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#94a3b8", maxTicksLimit: 6 }, grid: { color: "rgba(148, 163, 184, 0.08)" } },
        y: { beginAtZero: true, ticks: { color: "#94a3b8" }, grid: { color: "rgba(148, 163, 184, 0.1)" } }
      },
      plugins: {
        legend: { labels: { color: "#e2e8f0", boxWidth: 12 } }
      }
    }
  });
}

// Stretch Feature 3: Exam Week Sleep Preserver (max 8h study, min 7.5h-8h sleep)
function renderExamTimetable() {
  const rawSubjects = document.getElementById("examSubjects").value || "Core Topics";
  const topics = rawSubjects
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const wakeMins = timeToMinutes(document.getElementById("examWake").value || "07:00");
  const out = document.getElementById("timetableOutput");

  const blocks = [
    { offsetMin: 60, durMin: 120, label: `Deep Block 1: ${topics[0] || "Topic A"} (2h)` },
    { offsetMin: 195, durMin: 120, label: `Deep Block 2: ${topics[1] || topics[0] || "Topic B"} (2h)` },
    { offsetMin: 420, durMin: 120, label: `Active Recall: ${topics[2] || topics[0] || "Practice Problems"} (2h)` },
    { offsetMin: 555, durMin: 120, label: `Review & Summary (Capped at 8h total study)` },
    { offsetMin: 900, durMin: 480, label: "Protected Sleep Window (8.0h guaranteed)" }
  ];

  out.innerHTML = blocks
    .map(
      (b) => `
      <div class="timetable-item">
        <span>${escapeHtml(b.label)}</span>
        <span class="time-tag">${formatHoursToTime(wakeMins + b.offsetMin)} – ${formatHoursToTime(wakeMins + b.offsetMin + b.durMin)}</span>
      </div>
    `
    )
    .join("");
}

// Stretch Feature 4: Printable Wellness Report
function openWellnessReport() {
  const r = computePearsonCorrelation(entries);
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const last7 = sorted.slice(-7);
  const debt7 = last7.reduce((s, d) => s + Math.max(0, BASELINE_SLEEP_HOURS - d.sleepHours), 0);
  const avgSleep = entries.length ? entries.reduce((s, d) => s + d.sleepHours, 0) / entries.length : 0;
  const avgFocus = entries.length ? entries.reduce((s, d) => s + d.focusRating, 0) / entries.length : 0;

  const insightsHtml = Array.from(document.querySelectorAll("#insightsList li"))
    .map((li) => `<li>${li.textContent}</li>`)
    .join("");

  document.getElementById("reportBody").innerHTML = `
    <p>Generated on <strong>${new Date().toLocaleDateString()}</strong> • Total Logged Days: <strong>${entries.length}</strong></p>
    <div class="report-summary-grid">
      <div class="report-box">
        <small>Pearson Correlation (r)</small>
        <div><strong>${r === null ? "N/A" : r}</strong> (${describeCorrelation(r).label})</div>
      </div>
      <div class="report-box">
        <small>7-Day Sleep Debt (8h Target)</small>
        <div><strong>${debt7.toFixed(1)} hours</strong> (Avg sleep: ${avgSleep.toFixed(1)}h)</div>
      </div>
      <div class="report-box">
        <small>Mean Study Focus</small>
        <div><strong>${avgFocus.toFixed(2)} / 5.00</strong></div>
      </div>
    </div>
    <h3>Key Empirical Findings</h3>
    <ul>${insightsHtml}</ul>
    <h3>Advisor Recommendation</h3>
    <p>Maintaining consistent sleep duration (&ge;7.5 hours) supports sustained cognitive focus and reduces late-night cramming inefficiency during high-load academic weeks.</p>
  `;

  document.getElementById("reportModal").classList.remove("hidden");
}

function updateSleepPreview() {
  const bed = document.getElementById("bedtime").value;
  const wake = document.getElementById("wakeTime").value;
  const hrs = calculateSleepDurationHours(bed, wake);
  document.getElementById("previewSleepDuration").textContent = `${hrs.toFixed(1)} hrs`;
}

function setupStarPicker() {
  const buttons = document.querySelectorAll(".star-btn");
  const hiddenInput = document.getElementById("sleepQuality");

  function setStars(val) {
    hiddenInput.value = val;
    buttons.forEach((btn) => {
      const btnVal = Number(btn.getAttribute("data-value"));
      btn.classList.toggle("active", btnVal <= val);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setStars(Number(btn.getAttribute("data-value"))));
  });
}

function bindEvents() {
  document.getElementById("logDate").value = new Date().toISOString().slice(0, 10);
  document.getElementById("bedtime").addEventListener("change", updateSleepPreview);
  document.getElementById("wakeTime").addEventListener("change", updateSleepPreview);
  setupStarPicker();
  updateSleepPreview();

  document.getElementById("logForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("logDate").value;
    const bedtime = document.getElementById("bedtime").value;
    const wakeTime = document.getElementById("wakeTime").value;
    const sleepHours = calculateSleepDurationHours(bedtime, wakeTime);
    const sleepQuality = Number(document.getElementById("sleepQuality").value);
    const studyHours = Number(document.getElementById("studyHours").value);
    const focusRating = Number(document.getElementById("focusRating").value);
    const subjects = document.getElementById("subjects").value.trim() || "General Study";

    const newEntry = {
      id: `log_${Date.now()}`,
      date,
      bedtime,
      wakeTime,
      sleepHours,
      sleepQuality,
      studyHours,
      focusRating,
      subjects
    };

    entries.push(newEntry);
    latestEntryId = newEntry.id;
    saveEntries();
    refreshAll();
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    entries = [...SEED_LOGS];
    caffeineLogs = [...SEED_CAFFEINE];
    latestEntryId = entries[entries.length - 1].id;
    saveEntries();
    saveCaffeine();
    refreshAll();
  });

  document.getElementById("calcBedtimeBtn").addEventListener("click", renderBedtimeRecommendations);
  document.getElementById("targetWakeTime").addEventListener("change", renderBedtimeRecommendations);

  document.getElementById("addCaffeineBtn").addEventListener("click", () => {
    const select = document.getElementById("caffeineType");
    const mg = Number(select.value);
    const label = select.options[select.selectedIndex].text.split(" (")[0];
    const time = document.getElementById("caffeineTime").value || "14:00";
    caffeineLogs.push({ mg, time, label });
    saveCaffeine();
    renderCaffeineChart();
  });

  document.getElementById("caffeineBedtime").addEventListener("change", renderCaffeineChart);
  document.getElementById("generateTimetableBtn").addEventListener("click", renderExamTimetable);

  document.getElementById("exportPdfBtn").addEventListener("click", openWellnessReport);
  document.getElementById("closeReportBtn").addEventListener("click", () => {
    document.getElementById("reportModal").classList.add("hidden");
  });
  document.getElementById("printReportBtn").addEventListener("click", () => window.print());
}

function refreshAll() {
  renderKPIs();
  renderInsights();
  renderScatterChart();
  renderTable();
  renderBedtimeRecommendations();
  renderCaffeineChart();
  renderExamTimetable();
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  refreshAll();
});
