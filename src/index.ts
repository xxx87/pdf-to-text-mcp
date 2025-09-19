#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  CallToolResult,
  TextContent
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

// Create require for loading CommonJS modules
const require = createRequire(import.meta.url);

const PDF_TO_TEXT_TOOL: Tool = {
  name: "pdf_to_text",
  description: "Convert PDF file(s) to text for analysis and understanding",
  inputSchema: {
    type: "object",
    properties: {
      file_paths: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Array of PDF file paths to convert to text"
      }
    },
    required: ["file_paths"]
  }
};

const PDF_TO_TEXT_SCHEMA = z.object({
  file_paths: z.array(z.string())
});

class PDFToTextServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "pdf-to-text-server",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [PDF_TO_TEXT_TOOL]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "pdf_to_text") {
        return this.handlePDFToText(request.params.arguments);
      }
      throw new Error(`Unknown tool: ${request.params.name}`);
    });
  }

  private async handlePDFToText(args: unknown): Promise<CallToolResult> {
    try {
      const { file_paths } = PDF_TO_TEXT_SCHEMA.parse(args);
      const results = [];

      for (const filePath of file_paths) {
        const result = await this.convertPDFToText(filePath);
        results.push(result);
      }

      const combinedText = results
        .map((result, index) => {
          const fileName = path.basename(file_paths[index]);
          return `=== ${fileName} ===\n${result.text}\n`;
        })
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: `Successfully converted ${file_paths.length} PDF file(s) to text:\n\n${combinedText}`
          } as TextContent
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error converting PDF to text: ${error instanceof Error ? error.message : String(error)}`
          } as TextContent
        ],
        isError: true
      };
    }
  }

  private async convertPDFToText(filePath: string): Promise<{ text: string; pages: number }> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    if (fileExtension !== ".pdf") {
      throw new Error(`File is not a PDF: ${filePath}`);
    }

    try {
      // Use require to load pdf-parse
      const pdfParse = require("pdf-parse");

      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer, {
        // Options for better text extraction
        max: 0 // Process all pages
      });

      return {
        text: data.text,
        pages: data.numpages
      };
    } catch (error) {
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("PDF to Text MCP server running on stdio");
  }
}

const server = new PDFToTextServer();
server.run().catch(console.error);
