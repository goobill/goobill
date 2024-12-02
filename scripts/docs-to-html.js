import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { promises as fs } from 'fs';
import { join } from 'path';
import { read, write } from 'to-vfile';
import { unified } from 'unified';

function wrapWithDiv() {
  return (tree) => {
    tree.children = [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['container'] },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['header'] },
            children: [
              {
                type: 'element',
                tagName: 'a',
                properties: { href: 'index.html', className: ['search-logo'] },
                children: [
                  {
                    type: 'element',
                    tagName: 'img',
                    properties: { src: 'favicon.ico', alt: 'logo' },
                  },
                ],
              },
              {
                type: 'element',
                tagName: 'a',
                properties: { href: 'index.html', className: ['search-title'] },
                children: [
                  { type: 'element', tagName: 'span', properties: { className: ['blue'] }, children: [{ type: 'text', value: 'G' }] },
                  { type: 'element', tagName: 'span', properties: { className: ['red'] }, children: [{ type: 'text', value: 'o' }] },
                  { type: 'element', tagName: 'span', properties: { className: ['yellow'] }, children: [{ type: 'text', value: 'o' }] },
                  { type: 'element', tagName: 'span', properties: { className: ['blue'] }, children: [{ type: 'text', value: 'b' }] },
                  { type: 'element', tagName: 'span', properties: { className: ['green'] }, children: [{ type: 'text', value: 'i' }] },
                      { type: 'element', tagName: 'span', properties: { className: ['red'] }, children: [{ type: 'text', value: 'l' }] },
                      { type: 'element', tagName: 'span', properties: { className: ['red'] }, children: [{ type: 'text', value: 'l' }] },
                    ],
                  },
                ],
          },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['markdown-blob'] },
            children: [
              {
                type: 'element',
                tagName: 'article',
                properties: { className: ['markdown-body'] },
                children: tree.children,
              },
            ],
          },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['footer'] },
            children: [
              {
                type: 'element',
                tagName: 'marquee',
                children: [
                  {
                    type: 'element',
                    tagName: 'a',
                    properties: { className: ['footer-button'], href: "about.html"},
                    children: [
                      {
                        type: 'text',
                        value: "About",
                      },
                    ],
                  },
                  {
                    type: 'element',
                    tagName: 'a',
                    properties: { className: ['footer-button'], href: "store.html"},
                    children: [
                      {
                        type: 'text',
                        value: "Store",
                      },
                    ],
                  },
                  {
                    type: 'element',
                    tagName: 'a',
                    properties: { className: ['footer-button'], href: "cursed.html"},
                    children: [
                      {
                        type: 'text',
                        value: "Help",
                      },
                    ],
                  },
                ]
              },
            ],
          },
        ],
      }
    ];
  };
}

async function processMarkdownFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    const markdownFiles = files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

    for (const file of markdownFiles) {
      const inputFile = join(directory, file);
      const outputFile = join(directory, file.replace(/\.(md|mdx)$/, '.html'));
      const title = file.replace(/\.(md|mdx)$/, '')

      const docOptions = {
        title: title,
        css: ["style/md.css", "style/results.css"],
        js: [],
        language: "en",
        link: [],
        meta: [
          // {
          //   "name": "viewport",
          //   "content": "width=device-width, initial-scale=1.0"
          // }
        ],
        responsive: true,
        script: [],
        style: [],
      };

      const processedFile = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(wrapWithDiv)
        .use(rehypeDocument, docOptions)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(await read(inputFile));

      processedFile.path = outputFile;
      await write(processedFile);

      console.log(`Processed: ${inputFile} -> ${outputFile}`);
    }
  } catch (error) {
    console.error(`Error processing directory: ${error.message}`);
  }
}

await processMarkdownFiles('./docs');
