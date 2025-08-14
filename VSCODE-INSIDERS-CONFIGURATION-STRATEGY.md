# VS Code Insiders Configuration Transfer Strategy 🔄

## Current Situation Assessment

### ✅ What WILL Transfer Automatically:

- **Workspace settings** (`.vscode/settings.json`) - ✅ Already optimized
- **Workspace extensions.json** - ✅ Your 39 extension recommendations
- **Project-specific configurations** - ✅ All your wedding website settings

### ❓ What MIGHT NOT Transfer Automatically:

- **Global user settings** (without Settings Sync)
- **Installed extensions** (39 perfectly configured extensions)
- **Extension-specific settings** (TailwindCSS, Copilot, etc.)

## 🎯 Recommended Setup Strategy

### Option 1: Enable Settings Sync (Recommended)

This will sync **everything** between VS Code Stable and Insiders:

1. **In VS Code Stable:**
   - `Ctrl+Shift+P` → "Settings Sync: Turn On"
   - Sign in with Microsoft/GitHub account
   - Enable all sync options (Settings, Extensions, Keybindings, etc.)

2. **In VS Code Insiders:**
   - `Ctrl+Shift+P` → "Settings Sync: Turn On"
   - Sign in with **same account**
   - Your 39 extensions will automatically install
   - All settings will transfer

### Option 2: Manual Extension Transfer (If Sync Fails)

#### Step 1: Create Extension Backup

```powershell
# In regular VS Code terminal
code --list-extensions > extensions-backup.txt
```

#### Step 2: Install Extensions in Insiders

```powershell
# Install each extension in Insiders
$extensions = Get-Content extensions-backup.txt
foreach ($ext in $extensions) {
    & "C:\Users\Austin\AppData\Local\Programs\Microsoft VS Code Insiders\Code - Insiders.exe" --install-extension $ext
}
```

### Option 3: Quick Setup Script

Here's a PowerShell script to handle everything:

```powershell
# VS Code Insiders Setup Script
$insidersPath = "C:\Users\Austin\AppData\Local\Programs\Microsoft VS Code Insiders\Code - Insiders.exe"

# Get current extensions
Write-Host "Backing up current extensions..."
$extensions = & code --list-extensions

# Install each extension in Insiders
Write-Host "Installing extensions in VS Code Insiders..."
foreach ($ext in $extensions) {
    Write-Host "Installing: $ext"
    & $insidersPath --install-extension $ext
}

Write-Host "✅ Extension transfer complete!"
```

## 🔧 What You Need to Know

### Workspace Settings (.vscode/settings.json)

**Status:** ✅ **Already Perfect - No Action Needed**

Your workspace settings include:

- 39 extension configurations
- TailwindCSS optimization
- ESLint/Prettier setup
- GitHub Copilot settings
- Wedding-specific customizations

These will work **identically** in both VS Code versions.

### Extensions That Need Installation

Your 39 perfectly configured extensions:

1. TypeScript Next
2. Prettier
3. ESLint
4. SonarLint
5. TailwindCSS IntelliSense
6. Auto Rename Tag
7. Path IntelliSense
8. npm IntelliSense
9. HTML CSS Class Completion
10. ES7+ React Snippets
11. Next.js Snippets
12. CSS Peek
13. Code Spell Checker
14. Error Lens
15. Pretty TypeScript Errors
16. Import Cost
17. Playwright Test
18. JavaScript Debugger
19. GitLens
20. Git Graph
21. GitHub Pull Requests
22. GitHub Actions
23. GitHub Copilot
24. GitHub Copilot Chat
25. Google Gemini Code Assist
26. Roo Cline
27. Bookmarks
28. Todo Tree
29. Indent Rainbow
30. Peacock
31. Gutter Preview
32. Markdown All in One
33. Markdown Preview Mermaid
34. Word Count
35. Version Lens
36. YAML
37. PowerShell
38. axe Accessibility Linter
39. [Additional CSS/HTML tools]

## 🚀 Recommended Action Plan

### Immediate Steps:

1. **Launch VS Code Insiders** from Start Menu
2. **Open your wedding website workspace**
3. **Enable Settings Sync** in Insiders (same account as Stable)
4. **Wait for automatic extension installation**
5. **Verify all 39 extensions are installed**

### If Settings Sync Doesn't Work:

1. **Use the manual extension transfer script above**
2. **Copy any missing global settings**
3. **Verify workspace settings are working**

### Verification Checklist:

- [ ] All 39 extensions installed
- [ ] TailwindCSS IntelliSense working
- [ ] ESLint auto-fixing enabled
- [ ] Prettier formatting on save
- [ ] GitHub Copilot active
- [ ] Wedding-themed customizations (Peacock, Todo Tree)
- [ ] Agent mode available in Copilot Edits

## 💡 Pro Tips

### Settings Sync Benefits:

- **Automatic synchronization** between Stable and Insiders
- **One-time setup** - all future changes sync automatically
- **Backup in cloud** - settings preserved if reinstalling
- **Cross-machine sync** - same setup on multiple computers

### Workspace Independence:

- **Your .vscode/settings.json remains the same** regardless of VS Code version
- **Project-specific settings are preserved**
- **No need to reconfigure workspace settings**

## Expected Result

After proper setup, you'll have:

- **VS Code Stable**: Your production environment (39 extensions, perfect config)
- **VS Code Insiders**: Identical environment + Agent mode + GPT-5 + daily updates

**Both versions will be functionally identical** except Insiders has the cutting-edge features!

---

## Quick Start Command

Run this in PowerShell to check current status:

```powershell
Write-Host "VS Code Stable Extensions:" -ForegroundColor Green
code --list-extensions | Measure-Object | Select-Object Count

Write-Host "VS Code Insiders Extensions:" -ForegroundColor Yellow
& "C:\Users\Austin\AppData\Local\Programs\Microsoft VS Code Insiders\Code - Insiders.exe" --list-extensions | Measure-Object | Select-Object Count
```
