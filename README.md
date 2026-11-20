[dreamlog_project_readme.md](https://github.com/user-attachments/files/35166222/dreamlog_project_readme.md)
# 🌙 DreamLog — Sleep & Study Productivity Tracker

**DreamLog** is a lightweight, front-end web application built for students to log nightly sleep metrics alongside daily study sessions, analyze their statistical correlation, and visualize how sleep debt impacts cognitive focus.

---

## ✨ Features

### Core Analytics & Tracking
- **Nightly Sleep Logger:** Tracks bedtime, wake time (with automatic midnight crossover calculation), total sleep duration, and 1–5 star sleep quality ratings.
- **Study Session & Focus Tracker:** Logs daily study hours, subjects studied, and subjective focus ratings (1–5 scale).
- **Sleep–Productivity Correlation Engine:** Computes the Pearson correlation coefficient ($r$) between sleep duration and study focus ratings, complete with a sample-size confidence indicator.
- **Interactive Scatter Plot & OLS Trendline:** Visualizes sleep vs. focus data points using Chart.js with an Ordinary Least Squares (OLS) linear regression trendline.
- **7-Day Sleep Debt Calculator:** Calculates cumulative weekly sleep deficit against an 8.0-hour nightly baseline.
- **Weekly Optimization Insights:** Automatically generates personalized, data-driven insights comparing high-sleep vs. low-sleep study performance.

### Wellness & Planning Tools
- **90-Minute REM Bedtime Recommender:** Suggests optimal bedtimes based on 90-minute sleep cycles to avoid waking up during deep sleep.
- **Caffeine Half-Life Tracker:** Models caffeine decay (5-hour half-life) against your planned bedtime to prevent sleep disruption.
- **Exam Week Sleep Preserver:** Generates a balanced daily timetable that caps study at 8 hours and protects an 8-hour sleep window.
- **Printable Student Wellness Report:** Exports a clean summary report ready to print or save as a PDF.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure and accessible forms
- **CSS3** — Custom dark-mode night theme designed to reduce late-night eye strain
- **Vanilla JavaScript (ES6+)** — Statistical calculations (Pearson $r$ & OLS regression), DOM updates, and `localStorage` persistence
- **Chart.js (CDN)** — Interactive scatter plot and caffeine decay curve

---

## 🚀 Getting Started

No build tools, package managers, or backend servers are required.

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/dreamlog.git
   cd dreamlog
   ```
2. Ensure all three project files are in the same folder:
   ```text
   dreamlog/
   ├── index.html
   ├── style.css
   ├── app.js
   └── README.md
   ```
3. Open `index.html` directly in any modern web browser.

---

## 📊 Demo Dataset

DreamLog comes pre-seeded with **21 days of realistic student sleep and study logs** stored in `localStorage`. You can add new entries, delete individual logs, or click **Reset 21-Day Demo** in the top navigation bar at any time to restore the default dataset.

---

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).
