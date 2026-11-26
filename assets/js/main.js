/**
 * RupeeCRM Official Download Center — Client Application
 * Dynamic platform detection, release metadata loader, and interactive UI logic.
 */

(function () {
  'use strict';

  // State
  let releasesData = null;

  // DOM Elements
  const winCard = document.getElementById('win-download-card');
  const macCard = document.getElementById('mac-download-card');
  const winBtn = document.getElementById('win-download-btn');
  const macBtn = document.getElementById('mac-download-btn');
  const winVersionSpan = document.getElementById('win-version');
  const macVersionSpan = document.getElementById('mac-version');
  const winSizeSpan = document.getElementById('win-size');
  const macSizeSpan = document.getElementById('mac-size');
  const winDateSpan = document.getElementById('win-date');
  const macDateSpan = document.getElementById('mac-date');
  const winHashSpan = document.getElementById('win-sha256');
  const macHashSpan = document.getElementById('mac-sha256');
  const heroVersionBadge = document.getElementById('hero-version-badge');
  const heroDownloadBtn = document.getElementById('hero-download-btn');
  const toast = document.getElementById('toast');

  // Detect Platform
  function detectPlatform() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('win')) return 'windows';
    if (ua.includes('mac')) return 'mac';
    return 'other';
  }

  // Format Date (e.g. November 25, 2026)
  function formatDate(isoStr) {
    if (!isoStr) return 'Recent';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoStr;
    }
  }

  // Show Toast
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Safe markdown text renderer for release notes
  function renderSafeMarkdown(md) {
    if (!md) return '';
    const lines = md.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) { html += '</ul>'; inList = false; }
        return;
      }
      if (trimmed.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h4 style="font-size:15px; font-weight:700; margin:12px 0 6px;">${escapeHtml(trimmed.slice(4))}</h4>`;
      } else if (trimmed.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3 style="font-size:16px; font-weight:700; margin:16px 0 8px; color:var(--brand-primary);">${escapeHtml(trimmed.slice(3))}</h3>`;
      } else if (trimmed.startsWith('# ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2 style="font-size:18px; font-weight:800; margin:20px 0 10px;">${escapeHtml(trimmed.slice(2))}</h2>`;
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) { html += '<ul style="padding-left:20px; margin:8px 0;">'; inList = true; }
        html += `<li style="margin-bottom:4px;">${formatInlineCode(escapeHtml(trimmed.slice(2)))}</li>`;
      } else if (trimmed.startsWith('---')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr style="border:none; border-top:1px solid var(--border-subtle); margin:16px 0;">';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p style="margin-bottom:8px;">${formatInlineCode(escapeHtml(trimmed))}</p>`;
      }
    });

    if (inList) html += '</ul>';
    return html;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatInlineCode(str) {
    return str.replace(/`([^`]+)`/g, '<code style="background:var(--bg-card-subtle); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); font-size:12px; border:1px solid var(--border-light);">$1</code>');
  }

  // Populate Release Data into UI
  function applyReleaseData(data) {
    releasesData = data;
    const latest = data.latest_downloads;
    const version = data.latest_version;
    const dateFormatted = formatDate(data.latest_release_date);

    // Hero badge
    if (heroVersionBadge) {
      heroVersionBadge.textContent = `v${version}`;
    }

    // Windows
    if (latest.windows && latest.windows.available) {
      if (winVersionSpan) winVersionSpan.textContent = `v${version}`;
      if (winSizeSpan) winSizeSpan.textContent = latest.windows.size || '323.6 MB';
      if (winDateSpan) winDateSpan.textContent = dateFormatted;
      if (winBtn) {
        winBtn.href = latest.windows.url;
        winBtn.classList.remove('disabled');
      }
      if (winHashSpan && latest.windows.sha256) {
        winHashSpan.textContent = latest.windows.sha256;
      }
    }

    // macOS Apple Silicon
    if (latest.mac_arm64 && latest.mac_arm64.available) {
      if (macVersionSpan) macVersionSpan.textContent = `v${version}`;
      if (macSizeSpan) macSizeSpan.textContent = latest.mac_arm64.size || '368.4 MB';
      if (macDateSpan) macDateSpan.textContent = dateFormatted;
      if (macBtn) {
        macBtn.href = latest.mac_arm64.url;
        macBtn.classList.remove('disabled');
      }
      if (macHashSpan && latest.mac_arm64.sha256) {
        macHashSpan.textContent = latest.mac_arm64.sha256;
      }
    }

    // Hero primary action target
    const currentOS = detectPlatform();
    if (heroDownloadBtn) {
      if (currentOS === 'windows' && latest.windows?.available) {
        heroDownloadBtn.href = latest.windows.url;
        heroDownloadBtn.innerHTML = `<span>Download for Windows (v${version})</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;
      } else if (currentOS === 'mac' && latest.mac_arm64?.available) {
        heroDownloadBtn.href = latest.mac_arm64.url;
        heroDownloadBtn.innerHTML = `<span>Download for macOS (v${version})</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;
      } else {
        heroDownloadBtn.href = '#downloads';
      }
    }

    // Highlight card based on OS
    if (currentOS === 'windows' && winCard) {
      winCard.classList.add('highlight');
    } else if (currentOS === 'mac' && macCard) {
      macCard.classList.add('highlight');
    }

    // Render Release Notes
    renderReleaseNotes(data.releases);
  }

  function renderReleaseNotes(releases) {
    const container = document.getElementById('release-notes-container');
    if (!container || !releases || releases.length === 0) return;

    container.innerHTML = '';
    releases.forEach((rel, index) => {
      const card = document.createElement('div');
      card.className = 'release-card';

      const tag = rel.tag || `v${rel.version}`;
      const pubDate = formatDate(rel.published_at);
      const isLatest = rel.is_latest_stable;

      card.innerHTML = `
        <div class="release-header">
          <div class="release-tag-group">
            <span class="release-version">${escapeHtml(rel.name || `RupeeCRM ${tag}`)}</span>
            ${isLatest ? '<span class="card-badge">Latest Stable</span>' : ''}
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <span class="release-date">${pubDate}</span>
            <a href="${escapeHtml(rel.html_url)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">GitHub Release ↗</a>
          </div>
        </div>
        <div class="release-body">
          ${renderSafeMarkdown(rel.body)}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Clipboard copy handler
  function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const targetElem = document.getElementById(targetId);
        if (!targetElem) return;
        const text = targetElem.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          showToast('SHA-256 Checksum copied to clipboard!');
        }).catch(() => {
          showToast('Could not copy to clipboard.');
        });
      });
    });
  }

  // Interactive Tabs (Installation Guide)
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPane = document.getElementById(`tab-${targetTab}`);
        if (targetPane) targetPane.classList.add('active');
      });
    });

    // Auto-select tab matching current OS
    const os = detectPlatform();
    if (os === 'mac') {
      const macTabBtn = document.querySelector('.tab-btn[data-tab="mac"]');
      if (macTabBtn) macTabBtn.click();
    }
  }

  // Screenshot Gallery Navigation & Lightbox
  function initGallery() {
    const galleryBtns = document.querySelectorAll('.gallery-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalClose = document.getElementById('lightbox-close');

    galleryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        galleryBtns.forEach(b => b.classList.remove('active'));
        galleryItems.forEach(i => i.classList.remove('active'));
        btn.classList.add('active');
        const activeItem = document.getElementById(`gallery-${target}`);
        if (activeItem) activeItem.classList.add('active');
      });
    });

    // Lightbox triggers
    document.querySelectorAll('.gallery-item img, .preview-img').forEach(img => {
      img.addEventListener('click', () => {
        if (!modal || !modalImg) return;
        modalImg.src = img.src;
        modal.classList.add('active');
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  }

  // Mobile Nav Toggle
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });

    document.querySelectorAll('.nav-link').forEach(l => {
      l.addEventListener('click', () => {
        links.classList.remove('mobile-open');
      });
    });
  }

  // Load Releases JSON
  function loadReleaseMetadata() {
    fetch('data/releases.json')
      .then(res => {
        if (!res.ok) throw new Error('data/releases.json not found');
        return res.json();
      })
      .then(data => {
        applyReleaseData(data);
      })
      .catch(err => {
        console.warn('Using fallback release metadata:', err);
      });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    initCopyButtons();
    initTabs();
    initGallery();
    initMobileNav();
    loadReleaseMetadata();
  });
})();
