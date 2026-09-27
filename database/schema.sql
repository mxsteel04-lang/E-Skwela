:root {
  --navy: #0d2c5d;
  --navy-2: #153f7a;
  --primary: #1e73c7;
  --primary-soft: #eaf3ff;
  --text: #13263d;
  --muted: #7290ae;
  --bg: #f4f8fd;
  --white: #ffffff;
  --line: #e8eef7;
  --success: #1d9a68;
  --warning: #e7b142;
  --danger: #d14a4a;
}

* { box-sizing: border-box; }

html, body, #root {
  margin: 0;
  min-height: 100%;
  font-family: Inter, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
}

button, input, textarea, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, var(--navy), var(--navy-2));
  color: #dfeaf7;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 18px;
}

.center-brand {
  justify-content: center;
  margin-bottom: 18px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #f7d770;
  color: var(--navy);
  font-weight: 800;
  font-size: 22px;
}

.brand-title {
  font-size: 1.06rem;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 0.74rem;
  color: #b8cef2;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 10px;
  border: none;
  background: transparent;
  color: #d2def6;
  border-radius: 10px;
  text-align: left;
  font-weight: 600;
}

.nav-btn.active,
.nav-btn:hover {
  background: rgba(255,255,255,0.09);
  color: var(--white);
}

.logout-btn {
  margin-top: auto;
  background: rgba(255,255,255,0.08);
  color: var(--white);
  border: none;
  border-radius: 10px;
  padding: 12px 14px;
  font-weight: 600;
}

.main-area {
  flex: 1;
  padding: 30px 36px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--muted);
  font-weight: 700;
}

h1 { margin: 8px 0 0; font-size: clamp(2rem, 2.4vw, 2.4rem); }
h2 { margin: 0 0 8px; font-size: 1.8rem; }
h3 { margin: 0 0 12px; font-size: 1.1rem; }

.user-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.9);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 8px 26px rgba(17, 39, 69, 0.08);
}

.user-pill strong { display: block; }
.user-pill small { color: var(--muted); }

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1abf7f;
  display: inline-block;
}

.hero-panel,
.panel {
  background: var(--white);
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(18, 41, 75, 0.08);
  padding: 24px;
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(120deg, #0e386e, #1d69b8);
  color: var(--white);
  margin-bottom: 22px;
}

.hero-panel p {
  margin: 0;
  color: #dfeaf7;
}

.primary-btn {
  background: #f6ca60;
  color: var(--navy);
  font-weight: 700;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
}

.cards-grid {
  display: grid;
  gap: 18px;
  margin-bottom: 20px;
}

.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }

.id-card-mini {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #dfeeff;
  color: var(--primary);
  font-weight: 800;
}

.avatar-circle.large {
  width: 82px;
  height: 82px;
  font-size: 1.5rem;
}

.ledger-amount {
  font-size: 2.3rem;
  font-weight: 800;
  margin: 12px 0;
}

.meter {
  height: 8px;
  background: #edf2f8;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.meter span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2fb06d, #86d2a8);
  border-radius: 10px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0 22px;
}

.quick-actions button {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(18, 41, 75, 0.04);
  min-height: 90px;
  font-weight: 700;
  color: var(--text);
}

.two-panel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.list-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-top: 1px solid var(--line);
  padding: 12px 0;
}

.list-row strong,
.list-row small,
.announcement-item strong,
.announcement-item small,
.announcement-item p {
  display: block;
}

.list-row small, .announcement-item small, .muted {
  color: var(--muted);
}

.right-align {
  text-align: right;
}

.announcement-item {
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.alert {
  padding: 12px 16px;
  border-radius: 10px;
  margin: 12px 0;
}

.alert.success { background: #eafaf3; color: #0f7c52; }
.alert.error { background: #fff1f1; color: #b72d2d; }

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.profile-grid > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-grid small {
  color: var(--muted);
  font-size: 0.72rem;
}

.profile-grid strong {
  font-size: 1rem;
}

.wide-field {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

input, textarea, select {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 12px 14px;
  background: #fdfefe;
}

textarea { min-height: 110px; }

.subject-list {
  display: grid;
  gap: 12px;
  margin: 18px 0;
}

.subject-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  border-top: 1px solid var(--line);
  padding-top: 12px;
}

.subject-row input {
  width: auto;
  margin-top: 2px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-box {
  background: #f5f9ff;
  border: 1px solid #ebf2ff;
  border-radius: 14px;
  padding: 16px;
}

.stat-box small {
  color: var(--muted);
  display: block;
  margin-bottom: 8px;
}

.stat-box strong {
  font-size: 1.4rem;
}

.identity-card {
  max-width: 420px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0f2d5d, #1f6bb0);
  border-radius: 18px;
  color: var(--white);
  padding: 22px;
}

.identity-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.identity-meta {
  padding: 18px 0 8px;
  border-top: 1px solid rgba(255,255,255,0.2);
  margin-top: 18px;
}

.qr-box {
  background: rgba(255,255,255,0.96);
  width: fit-content;
  padding: 10px;
  border-radius: 12px;
  margin-top: 12px;
}

.login-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, #0b2657, #e9f3ff);
}

.login-card {
  width: min(460px, 92vw);
  background: var(--white);
  border-radius: 18px;
  padding: 32px 28px;
  box-shadow: 0 20px 50px rgba(8, 24, 47, 0.18);
}

.login-card h2 {
  margin-top: 20px;
}

.login-card p {
  color: var(--muted);
}

.login-form {
  display: grid;
  gap: 16px;
  margin-top: 22px;
}

.login-form label {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-weight: 600;
}

.loading-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: var(--muted);
  font-weight: 700;
}

@media (max-width: 960px) {
  .app-shell { display: block; }
  .sidebar { width: 100%; padding: 18px; }
  .nav-items { flex-direction: row; flex-wrap: wrap; }
  .nav-btn { flex: 1 1 160px; }
  .main-area { padding: 22px 18px 40px; }
  .two-col, .two-panel-grid, .stat-grid { grid-template-columns: 1fr; }
  .quick-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 560px) {
  .profile-grid { grid-template-columns: 1fr; }
  .quick-actions { grid-template-columns: 1fr; }
  .topbar { display: block; }
  .user-pill { margin-top: 12px; }
  .hero-panel { display: block; }
  .hero-panel .primary-btn { margin-top: 16px; }
}
