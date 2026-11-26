# RupeeCRM Official Download Center

Official product introduction, business workflow showcase, and software distribution website for **RupeeCRM**.

- **Live Website:** [https://ranjeetyelave.github.io/rupeecrm-downloads/](https://ranjeetyelave.github.io/rupeecrm-downloads/)
- **Author & Developer:** [Ranjeet Yelave](https://github.com/RanjeetYelave)
- **Source Application Repository:** [https://github.com/RanjeetYelave/Simple-Billing](https://github.com/RanjeetYelave/Simple-Billing)
- **Production Releases:** [https://github.com/RanjeetYelave/Simple-Billing/releases](https://github.com/RanjeetYelave/Simple-Billing/releases)

---

## Key Highlights

- **Direct Binary Downloads:** Primary download buttons directly download actual installer binaries (`RupeeCRM-Setup-1.0.400-x64.exe` and `RupeeCRM-1.0.400-arm64.dmg`) without navigating through GitHub release HTML pages.
- **Customer-Facing Business Language:** Tailored for Indian retailers, wholesalers, distributors, and traders. Zero developer jargon; clear explanations of GST invoicing, customer Khata, stock control, purchase orders, and demand forecasting.
- **Comprehensive Product Showcase:** Explores all 9 core business workflows with 19 genuine application screenshots captured directly from the live desktop application running synthetic demo trade data.
- **Developer Attribution:** Prominently acknowledges creator **Ranjeet Yelave** with direct links to his GitHub profile across the header, about section, and footer.
- **Emerald SaaS Visual Design:** Professional commercial styling with canonical RupeeCRM brand colors (`#16845B`), Plus Jakarta Sans typography, glassmorphism, responsive mobile layouts, and high-contrast readability.
- **Dynamic Platform Detection:** Automatically identifies client OS (Windows / macOS) and highlights the corresponding installer.
- **Automated Releases Sync:** Pre-build script (`scripts/update-releases.py`) queries the GitHub Releases API of `RanjeetYelave/Simple-Billing`, parses desktop installer binaries (`.exe` and `.dmg`), extracts SHA-256 checksums, and compiles `data/releases.json`.
- **Zero API Rate-Limit Risk:** Static pre-compiled release metadata eliminates client-side token requirements.
- **Security & Integrity:** Accessible collapsible SHA-256 checksums for every installer package with one-click clipboard copying.
- **Automated CI/CD:** Deployed automatically via GitHub Actions to GitHub Pages (`.github/workflows/deploy.yml`) on every push and daily schedule.

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
│   │   └── main.js             # Client platform detection, gallery filtering & UI logic
│   └── images/
│       ├── logo.png            # Official RupeeCRM Forest Green Logo
│       ├── logo-dark.png       # Dark theme brand logo
│       ├── app-icon.png        # Official RupeeCRM app icon
│       ├── favicon.ico         # Official favicon
│       └── screenshots/        # 19 genuine application screenshots
│           ├── dashboard.png
│           ├── invoice-editor.png
│           ├── invoices-list.png
│           ├── quotations.png
│           ├── product-catalog.png
│           ├── product-bulk-edit.png
│           ├── stock-movements.png
│           ├── demand-forecasting.png
│           ├── replenishment-queue.png
│           ├── customers-directory.png
│           ├── customer-ledger.png
│           ├── purchase-orders.png
│           ├── suppliers-ledger.png
│           ├── financial-reports.png
│           ├── staff-attendance.png
│           ├── planner-tasks.png
│           ├── omnisearch.png
│           ├── multi-firm-switcher.png
│           └── backup-restore.png
├── data/
│   └── releases.json           # Compiled release metadata, file sizes, and SHA-256 hashes
├── scripts/
│   └── update-releases.py      # Release metadata sync generator
├── index.html                  # Accessible, responsive product showcase & download center
├── README.md                   # Documentation
└── .nojekyll                   # GitHub Pages Jekyll bypass flag
```

---

## Local Development & Preview

To preview the website locally:

```bash
# Static test server
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

---

## License

Copyright © 2026 RupeeCRM. Designed & Developed by [Ranjeet Yelave](https://github.com/RanjeetYelave).
Distributed under the MIT License.
