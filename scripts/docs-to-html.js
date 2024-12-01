import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { compile } from "@mdx-js/mdx";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Utility to resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertMarkdownToHTML(inputDir, outputDir) {
  try {
    // Ensure the output directory exists (in this case, the project root)
    await fs.ensureDir(outputDir);

    // Read all files from the input directory
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      const ext = path.extname(file);
      if (ext === ".mdx" || ext === ".md") {
        const filePath = path.join(inputDir, file);
        const markdownContent = await fs.readFile(filePath, "utf-8");

        // Compile MDX or MD to JSX
        const compiledMDX = await compile(markdownContent, {});

        // Render the JSX to static HTML
        const MDXContent = new Function(
          "React",
          `return (${compiledMDX})`
        )(React);

        const htmlContent = renderToStaticMarkup(React.createElement(MDXContent));

        // Write the HTML to the output directory (root)
        const outputFilePath = path.join(outputDir, `${path.basename(file, ext)}.html`);
        await fs.writeFile(outputFilePath, `<!DOCTYPE html>\n<html>\n<body>\n${htmlContent}\n</body>\n</html>`);
        console.log(`Converted: ${file} -> ${outputFilePath}`);
      }
    }
  } catch (error) {
    console.error("Error during conversion:", error);
  }
}

// Get the input directory from command line arguments
const inputDir = path.resolve(process.argv[2] || path.join(__dirname, "docs")); // Default to "docs" if not provided
const outputDir = path.resolve(".");   // Root directory for the output

convertMarkdownToHTML(inputDir, outputDir);
