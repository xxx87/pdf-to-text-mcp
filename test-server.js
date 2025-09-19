#!/usr/bin/env node

import { spawn } from "child_process";

// Testing MCP server
async function testServer() {
  console.log("🧪 Testing PDF to Text MCP server...\n");

  const server = spawn("node", ["dist/index.js"], {
    stdio: ["pipe", "pipe", "pipe"]
  });

  // Test 1: List tools
  console.log("1️⃣ Testing tools list...");
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list",
    params: {}
  };

  server.stdin.write(JSON.stringify(listToolsRequest) + "\n");

  let stdoutBuffer = "";
  server.stdout.on("data", (data) => {
    stdoutBuffer += data.toString();
    const lines = stdoutBuffer.split("\n");
    stdoutBuffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          if (response.result && response.result.tools) {
            console.log(
              "✅ Tools found:",
              response.result.tools.map((t) => t.name)
            );
          }
          if (response.result && response.result.content) {
            const text = response.result.content[0].text;
            console.log("✅ PDF successfully converted!");
            console.log("📄 Extracted text length:", text.length, "characters");
            console.log("📄 First 200 characters:", text.substring(0, 200) + "...");
          }
        } catch (e) {
          // Ignore non-JSON lines
        }
      }
    }
  });

  // Test 2: PDF conversion
  setTimeout(() => {
    console.log("\n2️⃣ Testing PDF conversion...");
    const convertRequest = {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "pdf_to_text",
        arguments: {
          file_paths: ["Lorem_ipsum.pdf"]
        }
      }
    };

    server.stdin.write(JSON.stringify(convertRequest) + "\n");
  }, 1000);

  server.stderr.on("data", (data) => {
    // Ignore font warnings
    if (!data.toString().includes("Warning: Found Type3 font")) {
      console.log("Server stderr:", data.toString());
    }
  });

  // Finish testing
  setTimeout(() => {
    console.log("\n🎉 Testing completed!");
    server.kill();
    process.exit(0);
  }, 5000);
}

testServer().catch(console.error);
