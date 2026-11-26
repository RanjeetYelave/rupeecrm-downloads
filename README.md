# RupeeCRM Official Download Center

Official product introduction, capability showcase, and software distribution website for **RupeeCRM**.

- **Live Website:** [https://ranjeetyelave.github.io/rupeecrm-downloads/](https://ranjeetyelave.github.io/rupeecrm-downloads/)
- **Source Application Repository:** [https://github.com/RanjeetYelave/Simple-Billing](https://github.com/RanjeetYelave/Simple-Billing)
- **Application Releases:** [https://github.com/RanjeetYelave/Simple-Billing/releases](https://github.com/RanjeetYelave/Simple-Billing/releases)

---

## Architecture & Features

- **Emerald SaaS Design System:** Professional commercial theme adhering to canonical RupeeCRM brand colors (`#16845B`), Plus Jakarta Sans typography, and responsive layouts.
- **Dynamic Platform Detection:** Automatically identifies client OS (Windows / macOS) and highlights the corresponding installer card.
- **Automated Releases Sync:** Pre-build script (`scripts/update-releases.py`) queries the GitHub Releases API of `RanjeetYelave/Simple-Billing`, parses desktop installer binaries (`.exe` and `.dmg`), extracts SHA-256 checksums, and generates `data/releases.json`.
- **Zero API Rate-Limit Risk:** The client loads static, pre-rendered release metadata instantly without client-side GitHub API token requirements.
- **Genuine Screenshots & Media:** Includes authentic screenshots of RupeeCRM's Executive Dashboard, GST Billing Workspace, Inventory Forecasting Engine, and Sales Hub.
- **Security & Integrity:** SHA-256 checksums provided for every installer with one-click clipboard copying.
- **Automated Deployment:** Continuous deployment via GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`) on every push and via daily cron.

---

## Directory Structure

```
rupeecrm-downloads/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD workflow
├── assets/
│   ├── css/
│   │   └── style.css           # Emerald SaaS stylesheet
│   ├── js/
│   │   └── main.js             # Client platform detection & interactive UI
│   └── images/
│       ├── logo.png            # Official RupeeCRM Forest Green Logo
│       ├── logo-dark.png       # Dark theme brand logo
│       ├── app-icon.png        # Official RupeeCRM app icon
│       ├── favicon.ico         # Official favicon
│       └── screenshots/        # Verified application screenshots
│           ├── dashboard.png
│           ├── invoice-editor.png
│           ├── inventory-forecast.png
│           └── invoices-list.png
├── data/
│   └── releases.json           # Compiled release metadata, file sizes, and SHA-256 hashes
├── scripts/
│   └── update-releases.py      # Release metadata sync generator
├── index.html                  # Accessible, responsive landing page
├── README.md                   # Documentation
└── .nojekyll                   # GitHub Pages Jekyll bypass flag
```

---

## Local Development & Preview

To preview the website locally without any build dependencies:

```bash
# Python built-in static server
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

---

## License

Copyright © 2026 RupeeCRM. Distributed under the MIT License.
