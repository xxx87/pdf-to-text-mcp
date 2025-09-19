# Example Usage

## Basic Usage

```bash
# Start the server
yarn start

# Or test with the test script
yarn test
```

## MCP JSON-RPC Example

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "pdf_to_text",
    "arguments": {
      "file_paths": ["document.pdf"]
    }
  }
}
```

## Response Format

```json
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Successfully converted 1 PDF file(s) to text:\n\n=== document.pdf ===\n\nExtracted text content here..."
      }
    ]
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

## Multiple Files

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "pdf_to_text",
    "arguments": {
      "file_paths": ["doc1.pdf", "doc2.pdf", "doc3.pdf"]
    }
  }
}
```
