import os
import re
import requests
import shutil
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Configure Chrome options for headless mode
chrome_options = Options()
chrome_options.add_argument("--headless")  # Remove comment to run headless

# Set your Webflow subdomain, local domain, and theme folder
subdomain = "genskins-hml1"
localdomain = "genskins"

# Folder where the CSS file will be copied
copy_folder = f"/Users/adrianosg/Local Sites/{localdomain}/shopify/genskins-hml1/assets"

# Make sure copy folder exists
os.makedirs(copy_folder, exist_ok=True)

# Construct the Webflow.io project URL
webflow_url = f"https://{subdomain}.webflow.io"

# Create the webdriver instance (uses chromedriver from PATH automatically)
driver = webdriver.Chrome(options=chrome_options)

# Open the Webflow.io project URL
driver.get(webflow_url)

# Get the page source
page_source = driver.page_source

# Find CSS file URLs
css_urls = re.findall(r'<link href="([^"]+\.css)"', page_source)

# Create folder for CSS downloads history
history_dir = os.path.join("css_files", "history", datetime.now().strftime("%Y%m%d_%H%M%S"))
os.makedirs(history_dir, exist_ok=True)

# Path for the simplified CSS file
simplified_file_path = os.path.join("css_files", f"{subdomain}.webflow.scrape.css")

# Download each CSS file
for url in css_urls:
    response = requests.get(url)
    filename = url.split("/")[-1]
    file_path = os.path.join(history_dir, filename)

    # Save timestamped copy
    with open(file_path, "wb") as file:
        file.write(response.content)

    # Save simplified copy and copy to theme folder
    if filename.endswith(".css"):
        if os.path.exists(simplified_file_path):
            os.remove(simplified_file_path)

        with open(simplified_file_path, "wb") as file:
            file.write(response.content)

        shutil.copy(simplified_file_path, copy_folder)

        file_size_kb = os.path.getsize(file_path) / 1024
        print(f"Downloaded: {filename} ({file_size_kb:.2f} KB)")

# Quit the driver
driver.quit()