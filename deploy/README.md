# eScriptJS Deployment Guide

## 1. Download
GitHub public link: [https://github.com/repo-nio/escriptjs/tree/main/deploy](https://github.com/repo-nio/escriptjs/tree/main/deploy)

### Prerequisites
- **Git**: Installed and available in your `PATH` (version 2.25.0 or newer to support `sparse-checkout`). You can check your version with `git --version`.

### Download via PowerShell (pwsh)
Use Git's sparse checkout feature to download only the `deploy` folder instead of the entire repository:

```powershell
# Clone the repository with sparse checkout enabled, omitting blobs
git clone --depth 1 --filter=blob:none --sparse https://github.com/repo-nio/escriptjs.git

# Navigate into the cloned folder
cd escriptjs

# Checkout only the deploy directory
git sparse-checkout set deploy

# Enter the deploy folder
cd deploy
```

---

## 2. Backup Existing Configuration
Before copying any files, make a backup copy of the following files in your target `[eScriptX directory]`:
- `[eScriptX directory]\web.config`
- `[eScriptX directory]\Script\Nixxis\Nixxis_eScript.js`
- `[eScriptX directory]\Nixxis\nixxis.config.json` (if it exists)

---

## 3. Configuration & File Modification
Perform the following edits directly in the downloaded `deploy` folder before copying:

### A. Web Configuration (`web_[eScript version].config`)
1. Identify the running eScript version from your **eScript editor**.
2. Locate the matching `web_[eScript version].config` file in the downloaded folder (delete or ignore any other unused `web_*.config` files).
3. Compare it with your backed-up `web.config` and transfer any custom settings:
   - **Important**: Verify and set `Authorized_referrer` and `requireSSL`.
4. Rename `web_[eScript version].config` to **`web.config`**.

### B. Nixxis Configuration (`Nixxis\nixxis.config.json`)
Compare with your existing `nixxis.config.json` (if present) and adjust the following parameters:
- `"appURI"`: `"[NixxisAppServer[:8088]]"`
- `"dataURI"`: `"http[s]://[NixxisAppServer[:8088]]/data"`
- `"host"`: `"[NixxisAppServer]"`

**API Key Alignment:**
- Locate the configured key in `[Nixxis folder]\CrAppServer\Http.config`:
  ```xml
  <add key="XXXX" role="eScript" />
  ```
- Set the matching value in `Nixxis\nixxis.config.json`:
  ```json
  "apiKeys": "XXXX"
  ```

---

## 4. Deployment
1. Copy all files and folders from the downloaded `deploy\` folder into your target `[eScriptX directory]\` (preserving folder structure and overwriting when prompted).
2. **Restart IIS** (Recommended) to apply configuration changes.
3. Refresh clients:
   - Restart NCS client applications, **or**
   - Press <kbd>Ctrl</kbd> + <kbd>F5</kbd> on the script web page to clear the cache.
