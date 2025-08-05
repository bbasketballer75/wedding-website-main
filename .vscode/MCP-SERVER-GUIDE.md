# MCP Server Configuration Guide

## Currently Active MCP Servers (Optimized for Wedding Website)

### ✅ Working Out of the Box (No API Keys Required)

- **Memory Server**: Knowledge graph storage and retrieval
- **Git Server**: Version control operations
- **Filesystem Server**: File operations within workspace
- **Fetch Server**: HTTP requests and web content fetching (FIXED - now using Python uvx)
- **Time Server**: Timezone conversion and time utilities
- **Sequential Thinking Server**: Multi-step problem-solving
- **Puppeteer Server**: Web automation and browser control

### ✅ Working with API Keys (Currently Active)

- **Brave Search Server**: Web search capabilities (API key configured)

## Removed Servers

### ❌ Everart Server (Removed - Not Needed)

**Reason for Removal**: Wedding websites benefit from real, personal photos rather than AI-generated images. The Everart server was adding unnecessary complexity without clear value for this specific project type.

**Alternative**: For any graphic design needs, you can:

- Use existing design tools (Canva, Photoshop, etc.)
- Leverage the real photo galleries already implemented
- Use Puppeteer server for automated screenshots/testing instead

## How to Configure API Keys

### Brave Search Server

1. Sign up at [Brave Search API](https://api.search.brave.com/)
2. Get your API key
3. Add to your environment or update `.vscode/mcp.json`:
   ```json
   "brave-search": {
     "env": {
       "BRAVE_API_KEY": "your-api-key-here"
     }
   }
   ```

### Everart Server

1. Sign up at [Everart](https://everart.ai/)
2. Get your API key
3. Add to your environment or update `.vscode/mcp.json`:
   ```json
   "everart": {
     "env": {
       "EVERART_API_KEY": "your-api-key-here"
     }
   }
   ```

## Temporarily Disabling Servers

Since VS Code MCP doesn't support a "disabled" property, you can:

1. **Comment out the server** (requires manual JSON editing):
   - Temporarily remove the server block from `.vscode/mcp.json`

2. **Remove from tasks.json**:
   - Comment out or remove the corresponding task in `.vscode/tasks.json`

3. **Set invalid command** (not recommended):
   - Change the command to something invalid like `"echo"`

## Current Status

All servers without API key requirements are working properly. The Brave Search and Everart servers will show connection errors until their respective API keys are configured.

## Server Usage Examples

### Memory Server

```javascript
// Store project information
mcp_memory_create_entities([
  {
    name: 'Wedding Website Feature',
    entityType: 'Project Component',
    observations: ['Photo gallery implemented', 'Uses Google Cloud Storage'],
  },
]);
```

### Filesystem Server

```javascript
// List directory contents
mcp_filesystem_list_directory('./src');
```

### Fetch Server

```javascript
// Fetch web content
mcp_fetch_fetch('https://example.com');
```

### Sequential Thinking Server

```javascript
// Multi-step problem solving
mcp_sequentialthi_sequentialthinking({
  thought: 'Analyzing the best approach for implementing the photo gallery',
  thoughtNumber: 1,
  totalThoughts: 3,
  nextThoughtNeeded: true,
});
```

For servers requiring API keys, obtain the keys from the respective services and update the environment variables in `.vscode/mcp.json` or your system environment.
