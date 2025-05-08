import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix paths in HTML content
function fixPaths(content, isRootFile) {
    // Fix image paths
    content = content.replace(/src="\/images\//g, isRootFile ? 'src="images/' : 'src="../images/');

    // Fix CSS paths
    content = content.replace(/href="\/styles\.css"/g, isRootFile ? 'href="styles.css"' : 'href="../styles.css"');

    // Fix navigation links
    content = content.replace(/href="\/index\.html/g, isRootFile ? 'href="index.html' : 'href="../index.html');

    // Fix meta image paths
    content = content.replace(/content="\/images\//g, isRootFile ? 'content="images/' : 'content="../images/');

    // Fix favicon paths
    content = content.replace(/href="\/images\//g, isRootFile ? 'href="images/' : 'href="../images/');

    return content;
}

// Function to process a directory
function processDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            // Recursively process subdirectories
            processDirectory(filePath);
        } else if (file.endsWith('.html')) {
            // Process HTML files
            const isRootFile = directory === 'dist';
            const content = fs.readFileSync(filePath, 'utf8');
            const fixedContent = fixPaths(content, isRootFile);
            fs.writeFileSync(filePath, fixedContent);
            console.log(`Fixed paths in: ${filePath}`);
        }
    });
}

// Start processing from the dist directory
const distDir = path.join(__dirname, 'dist');
processDirectory(distDir);

console.log('Path fixing complete!');
