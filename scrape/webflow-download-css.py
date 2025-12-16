import os
import re
import shutil
import logging
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ---------- Config ----------
SUBDOMAIN   = os.getenv("WEBFLOW_SUBDOMAIN", "genskins-hml1")
LOCALDOMAIN = os.getenv("LOCALDOMAIN", "genskins")
THEMEFOLDER = os.getenv("THEMEFOLDER", "genskins-hml1")

WEBFLOW_URL = f"https://{SUBDOMAIN}.webflow.io"
COPY_DIR    = Path(f"/Users/adrianosg/Local Sites/{LOCALDOMAIN}/shopify/{THEMEFOLDER}/assets")
COPY_DIR.mkdir(parents=True, exist_ok=True)

OUT_DIR     = Path("css_files")
HISTORY_DIR = OUT_DIR / "history" / datetime.now().strftime("%Y%m%d_%H%M%S")
HISTORY_DIR.mkdir(parents=True, exist_ok=True)

SIMPLIFIED_PATH = OUT_DIR / f"{SUBDOMAIN}.webflow.scrape.css"
FINAL_THEME_PATH = COPY_DIR / f"{SUBDOMAIN}.css"  # subdomain-based filename

# ---------- Logging ----------
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

# ---------- Fetch HTML ----------
session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (compatible; CSSSync/1.0; +https://example.com/bot)"
})
resp = session.get(WEBFLOW_URL, timeout=15)
resp.raise_for_status()

soup = BeautifulSoup(resp.text, "html.parser")

# ---------- Collect CSS HREFs ----------
css_links = []
for link in soup.find_all("link", rel=lambda v: v and "stylesheet" in v):
    href = link.get("href")
    if not href:
        continue
    # accept .css with optional query string
    if not re.search(r"\.css(\?.*)?$", href, re.IGNORECASE):
        continue
    full_url = urljoin(WEBFLOW_URL, href)
    # normalize protocol-relative URLs //...
    if full_url.startswith("//"):
        full_url = "https:" + full_url
    css_links.append(full_url)

# Deduplicate but keep order
seen = set()
ordered_css_urls = []
for u in css_links:
    if u not in seen:
        seen.add(u)
        ordered_css_urls.append(u)

if not ordered_css_urls:
    logging.warning("No stylesheet links found.")
else:
    logging.info(f"Found {len(ordered_css_urls)} CSS file(s).")

# ---------- Download & concatenate ----------
parts = []
for url in ordered_css_urls:
    try:
        r = session.get(url, timeout=20)
        r.raise_for_status()
        filename = Path(urlparse(url).path).name or "style.css"

        # Save original into history
        hist_path = HISTORY_DIR / filename
        hist_path.write_bytes(r.content)

        kb = len(r.content) / 1024
        logging.info(f"Downloaded {filename} ({kb:.1f} KB)")

        # Keep for concatenation
        parts.append(f"/* --- BEGIN {filename} --- */\n{r.text}\n/* --- END {filename} --- */\n")
    except Exception as e:
        logging.error(f"Failed {url}: {e}")

# Write simplified (concatenated) file
if parts:
    SIMPLIFIED_PATH.write_text("\n".join(parts), encoding="utf-8")
    # Copy to theme with a stable name
    shutil.copy2(SIMPLIFIED_PATH, FINAL_THEME_PATH)
    logging.info(f"Wrote concatenated CSS to {SIMPLIFIED_PATH}")
    logging.info(f"Copied to theme as {FINAL_THEME_PATH}")
else:
    logging.warning("No CSS content written.")
