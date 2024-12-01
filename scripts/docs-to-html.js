const fs = require("fs-extra");
const path = require("path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { MDXProvider, mdx } = require("@mdx-js/react");
const { compileSync } = require("@mdx-js/mdx");

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

        // Compile MDX or MD to JSX (sync compilation)
        const compiledMDX = compileSync(markdownContent, { outputFormat: "function-body" });

        // Create a React component from the compiled content
        const MDXContent = new Function(
          "React",
          "mdx",
          `${compiledMDX}`
        )(React, mdx);

        // Render the component to static HTML
        const htmlContent = renderToStaticMarkup(
          React.createElement(MDXProvider, {}, React.createElement(MDXContent))
        );

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
const inputDir = path.resolve(process.argv[2] || "docs"); // Default to "docs" if not provided
const outputDir = path.resolve(".");   // Root directory for the output

convertMarkdownToHTML(inputDir, outputDir);
