# 📄 PDF to Text MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.0.0-purple.svg)](https://modelcontextprotocol.io/)

> A Model Context Protocol (MCP) server for converting PDF files to text, designed for seamless integration with Cursor IDE and other MCP-compatible applications.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/xxx87/pdf-to-text-mcp.git
cd pdf-to-text-mcp-server

# Install dependencies
yarn install

# Build the project
yarn build

# Test the server
yarn test
```

## ✨ Features

- 📑 **Multi-file Support** - Convert one or multiple PDF files simultaneously
- 🔍 **Text Extraction** - Extract text while preserving document structure
- ⚡ **Fast Processing** - Efficient PDF parsing with `pdf-parse` library
- 🔧 **MCP Protocol** - Full Model Context Protocol compliance
- 🎯 **Cursor Integration** - Designed specifically for Cursor IDE
- 🛡️ **TypeScript** - Fully typed for better development experience
- ✅ **Testing** - Comprehensive test suite included

## 📋 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🛠️ Installation

### Prerequisites

- **Node.js** 18+
- **Yarn** package manager
- **Cursor IDE** (for MCP integration)

### Local Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/xxx87/pdf-to-text-mcp.git
   cd pdf-to-text-mcp-server
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Build the project**

   ```bash
   yarn build
   ```

4. **Verify installation**
   ```bash
   yarn test
   ```

## 🎯 Usage

### Running as Standalone Server

```bash
yarn start
```

### Integration with Cursor IDE

1. **Add to Cursor Configuration**

   Add the following to your Cursor MCP settings:

   ```json
   {
     "mcpServers": {
       "pdf-to-text": {
         "command": "node",
         "args": ["/absolute/path/to/pdf-to-text-mcp-server/dist/index.js"],
         "cwd": "/absolute/path/to/pdf-to-text-mcp-server"
       }
     }
   }
   ```

   > ⚠️ **Important**: Replace `/absolute/path/to/pdf-to-text-mcp-server` with your actual project path.

2. **Using in Cursor**

   - **Add PDFs**: Drag and drop PDF files into Cursor
   - **Convert**: Use the `pdf_to_text` tool for automatic conversion
   - **Analyze**: The extracted text becomes available for AI analysis

### Manual MCP Usage

```javascript
// Example MCP JSON-RPC request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "pdf_to_text",
    "arguments": {
      "file_paths": ["document1.pdf", "document2.pdf"]
    }
  }
}
```

## ⚙️ Configuration

### Environment Variables

| Variable    | Description      | Default      |
| ----------- | ---------------- | ------------ |
| `NODE_ENV`  | Environment mode | `production` |
| `LOG_LEVEL` | Logging level    | `info`       |

### Custom Options

The server automatically handles PDF parsing with optimized settings. For custom configurations, modify the `pdf-parse` options in `src/index.ts`.

## 📚 API Reference

### Tools

#### `pdf_to_text`

Converts PDF files to readable text format.

**Parameters:**

- `file_paths` (string[]): Array of PDF file paths to convert

**Returns:**

```typescript
{
  content: [
    {
      type: "text",
      text: string // Extracted text with file separators
    }
  ];
}
```

**Example Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Successfully converted 2 PDF file(s) to text:\n\n=== document1.pdf ===\nExtracted content here...\n\n=== document2.pdf ===\nMore content here..."
    }
  ]
}
```

## 🏗️ Development

### Project Structure

```
pdf-to-text-mcp-server/
├── src/
│   ├── index.ts              # Main MCP server implementation
│   └── types/
│       └── pdf-parse.d.ts    # Type definitions
├── dist/                     # Compiled JavaScript output
├── test-server.js            # Test utilities
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
├── cursor-config.json        # Example Cursor configuration
└── README.md                 # This file
```

### Available Scripts

| Script       | Description                             |
| ------------ | --------------------------------------- |
| `yarn build` | Compile TypeScript to JavaScript        |
| `yarn start` | Run the compiled server                 |
| `yarn dev`   | Run in development mode with hot reload |
| `yarn test`  | Execute test suite                      |
| `yarn lint`  | Run code linting                        |

### Building from Source

```bash
# Development mode with file watching
yarn dev

# Production build
yarn build

# Run tests
yarn test
```

### Dependencies

| Package                     | Purpose                     | Version   |
| --------------------------- | --------------------------- | --------- |
| `@modelcontextprotocol/sdk` | MCP protocol implementation | `^0.5.0`  |
| `pdf-parse`                 | PDF text extraction         | `^1.1.1`  |
| `zod`                       | Runtime type validation     | `^3.22.4` |
| `typescript`                | TypeScript compiler         | `^5.0.0`  |

## 🐛 Troubleshooting

### Common Issues

| Issue                               | Cause                | Solution                                       |
| ----------------------------------- | -------------------- | ---------------------------------------------- |
| `ENOENT: no such file or directory` | Invalid file path    | Verify PDF file exists and path is correct     |
| `File is not a PDF`                 | Wrong file format    | Ensure file has `.pdf` extension and is valid  |
| Empty text output                   | Image-based PDF      | This tool only extracts text-based content     |
| Build errors                        | Missing dependencies | Run `yarn install` to install all dependencies |

### Debug Mode

Enable verbose logging:

```bash
NODE_ENV=development yarn start
```

### Testing

Run the comprehensive test suite:

```bash
# Run all tests
yarn test

# Test with specific PDF
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "pdf_to_text", "arguments": {"file_paths": ["your-file.pdf"]}}}' | node dist/index.js
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes
5. **Test** thoroughly: `yarn test`
6. **Commit** changes: `git commit -m 'Add amazing feature'`
7. **Push** to branch: `git push origin feature/amazing-feature`
8. **Open** a Pull Request

### Code Style

- Follow existing TypeScript conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Model Context Protocol](https://modelcontextprotocol.io/) for the excellent MCP specification
- [pdf-parse](https://github.com/modesty/pdf-parse) for reliable PDF text extraction
- [Cursor IDE](https://cursor.sh/) for MCP integration support

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/pdf-to-text-mcp-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/pdf-to-text-mcp-server/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/pdf-to-text-mcp-server/wiki)

---

<div align="center">

**Made with ❤️ for the MCP community**

[⭐ Star this repo](https://github.com/your-username/pdf-to-text-mcp-server) • [🐛 Report Bug](https://github.com/your-username/pdf-to-text-mcp-server/issues) • [💡 Request Feature](https://github.com/your-username/pdf-to-text-mcp-server/issues)

</div>
