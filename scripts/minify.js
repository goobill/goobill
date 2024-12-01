const fs = require('fs');
const path = require('path');
const Minimize = require('minimize');

const minimize = new Minimize();

// Function to minimize HTML content
function minimizeHtmlContent(content, callback) {
    minimize.parse(content, (err, minified) => {
        if (err) {
            console.error(`Error minimizing HTML content:`, err);
            callback(err);
        } else {
            callback(null, minified);
        }
    });
}

// Function to process all .html files in a specified directory
function processHtmlFilesInDirectory(directory) {
    // Read all files in the directory
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${directory}:`, err);
            return;
        }

        // Filter for .html files
        const htmlFiles = files.filter(file => path.extname(file).toLowerCase() === '.html');

        if (htmlFiles.length === 0) {
            console.log('No HTML files found in the specified directory.');
            return;
        }

        // Process each .html file
        htmlFiles.forEach(file => {
            const filePath = path.join(directory, file);

            // Read the file content
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    console.error(`Error reading file ${filePath}:`, readErr);
                    return;
                }

                // Minimize the HTML content
                minimizeHtmlContent(data, (minErr, minified) => {
                    if (minErr) {
                        console.error(`Error minimizing file ${filePath}:`, minErr);
                        return;
                    }

                    // Write the minified content back to the same file
                    fs.writeFile(filePath, minified, writeErr => {
                        if (writeErr) {
                            console.error(`Error writing file ${filePath}:`, writeErr);
                        } else {
                            console.log(`Minified ${filePath}`);
                        }
                    });
                });
            });
        });
    });
}

// Get directory from command-line arguments
const directory = process.argv[2] || process.cwd();

// Start processing
processHtmlFilesInDirectory(directory);
