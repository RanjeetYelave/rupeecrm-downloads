#!/usr/bin/env python3
"""
update-releases.py
Build-time release metadata generator for RupeeCRM Official Download Center.
Queries the GitHub Releases API for RanjeetYelave/Simple-Billing, filters out
drafts and prereleases, extracts Windows & macOS installer assets, sizes, and
SHA-256 checksums, and compiles data/releases.json.
"""

import os
import sys
import json
import urllib.request
import urllib.error

API_URL = "https://api.github.com/repos/RanjeetYelave/Simple-Billing/releases?per_page=30"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "releases.json")

def format_size(bytes_num):
    if not bytes_num:
        return "Unknown"
    mb = bytes_num / (1024 * 1024)
    return f"{mb:.1f} MB"

def fetch_checksum(url, headers):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            text = resp.read().decode('utf-8', errors='ignore').strip()
            # Often contains "<hash>  filename" or just "<hash>"
            parts = text.split()
            if parts:
                return parts[0].strip()
    except Exception as e:
        print(f"Warning: Could not fetch checksum from {url}: {e}", file=sys.stderr)
    return None

def main():
    token = os.environ.get("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "RupeeCRM-Release-Updater"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    print(f"Fetching releases from {API_URL}...")
    try:
        req = urllib.request.Request(API_URL, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            releases_raw = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        print(f"Failed to fetch releases from GitHub: {e}", file=sys.stderr)
        if os.path.exists(OUTPUT_FILE):
            print("Preserving existing data/releases.json", file=sys.stderr)
            sys.exit(0)
        else:
            sys.exit(1)

    # Filter out drafts
    valid_releases = [r for r in releases_raw if not r.get("draft")]
    if not valid_releases:
        print("No valid releases found.", file=sys.stderr)
        sys.exit(1)

    # Sort descending by published_at
    valid_releases.sort(key=lambda r: r.get("published_at", ""), reverse=True)

    # Separate stable from prereleases
    stable_releases = [r for r in valid_releases if not r.get("prerelease")]
    latest_stable = stable_releases[0] if stable_releases else valid_releases[0]

    processed_releases = []

    for r in valid_releases[:10]:
        tag = r.get("tag_name")
        version = tag.lstrip("v")
        published_at = r.get("published_at", "")
        name = r.get("name") or f"RupeeCRM {tag}"
        body = r.get("body", "")
        html_url = r.get("html_url")
        assets = r.get("assets", [])

        # Map assets by name
        asset_map = {a.get("name"): a for a in assets}

        # Look for Windows installer
        # Pattern: RupeeCRM-Setup-<version>-x64.exe, RupeeCRM-Setup.exe
        win_asset = None
        for a in assets:
            aname = a.get("name", "")
            if aname.endswith(".exe") and "Setup" in aname:
                if f"-{version}-x64.exe" in aname or f"-{version}.exe" in aname:
                    win_asset = a
                    break
                elif not win_asset:
                    win_asset = a

        # Look for macOS Apple Silicon installer
        mac_arm_asset = None
        for a in assets:
            aname = a.get("name", "")
            if aname.endswith(".dmg"):
                if "arm64" in aname:
                    mac_arm_asset = a
                    break
                elif not mac_arm_asset:
                    mac_arm_asset = a

        # Check for macOS Intel (x64) installer
        mac_intel_asset = None
        for a in assets:
            aname = a.get("name", "")
            if aname.endswith(".dmg") and ("x64" in aname or "intel" in aname.lower()) and "arm64" not in aname:
                mac_intel_asset = a
                break

        # Checksums
        win_sha = None
        if win_asset:
            sha_asset = asset_map.get(f"{win_asset['name']}.sha256")
            if sha_asset:
                win_sha = fetch_checksum(sha_asset["browser_download_url"], headers)

        mac_arm_sha = None
        if mac_arm_asset:
            sha_asset = asset_map.get(f"{mac_arm_asset['name']}.sha256")
            if sha_asset:
                mac_arm_sha = fetch_checksum(sha_asset["browser_download_url"], headers)

        mac_intel_sha = None
        if mac_intel_asset:
            sha_asset = asset_map.get(f"{mac_intel_asset['name']}.sha256")
            if sha_asset:
                mac_intel_sha = fetch_checksum(sha_asset["browser_download_url"], headers)

        release_entry = {
            "tag": tag,
            "version": version,
            "name": name,
            "published_at": published_at,
            "html_url": html_url,
            "body": body,
            "is_latest_stable": (tag == latest_stable.get("tag_name")),
            "is_prerelease": r.get("prerelease", False),
            "downloads": {
                "windows": {
                    "available": win_asset is not None,
                    "filename": win_asset["name"] if win_asset else None,
                    "url": win_asset["browser_download_url"] if win_asset else None,
                    "size": format_size(win_asset["size"]) if win_asset else None,
                    "bytes": win_asset["size"] if win_asset else 0,
                    "arch": "64-bit (x64)",
                    "sha256": win_sha,
                    "type": "Standalone Executable Setup"
                },
                "mac_arm64": {
                    "available": mac_arm_asset is not None,
                    "filename": mac_arm_asset["name"] if mac_arm_asset else None,
                    "url": mac_arm_asset["browser_download_url"] if mac_arm_asset else None,
                    "size": format_size(mac_arm_asset["size"]) if mac_arm_asset else None,
                    "bytes": mac_arm_asset["size"] if mac_arm_asset else 0,
                    "arch": "Apple Silicon (M1 / M2 / M3 / M4)",
                    "sha256": mac_arm_sha,
                    "type": "Apple Disk Image (DMG)"
                },
                "mac_intel": {
                    "available": mac_intel_asset is not None,
                    "filename": mac_intel_asset["name"] if mac_intel_asset else None,
                    "url": mac_intel_asset["browser_download_url"] if mac_intel_asset else None,
                    "size": format_size(mac_intel_asset["size"]) if mac_intel_asset else None,
                    "bytes": mac_intel_asset["size"] if mac_intel_asset else 0,
                    "arch": "Intel (x64)",
                    "sha256": mac_intel_sha,
                    "type": "Apple Disk Image (DMG)"
                }
            }
        }
        processed_releases.append(release_entry)

    latest_downloads = next((r["downloads"] for r in processed_releases if r["is_latest_stable"]), processed_releases[0]["downloads"])

    output_data = {
        "generated_at": valid_releases[0].get("published_at"),
        "latest_version": latest_stable.get("tag_name", "").lstrip("v"),
        "latest_tag": latest_stable.get("tag_name", ""),
        "latest_release_date": latest_stable.get("published_at", ""),
        "latest_release_url": latest_stable.get("html_url", ""),
        "latest_downloads": latest_downloads,
        "releases": processed_releases
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)

    print(f"Successfully generated {OUTPUT_FILE} with latest version {output_data['latest_version']}.")

if __name__ == "__main__":
    main()
