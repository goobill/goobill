import rehypeDocument from 'rehype-document';
import rehypeFormat from 'rehype-format';
import remarkGfm from 'remark-gfm'
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
                    properties: { src: 'favicon/favicon.svg', alt: 'logo' },
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
                    properties: { className: ['footer-button'], href: "site-map.html"},
                    children: [
                      {
                        type: 'text',
                        value: "Site Map",
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

async function processMarkdownFiles(directory, configPath) {
  try {
    const configs = await fs.readFile(configPath);

    const files = await fs.readdir(directory);
    const markdownFiles = files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));

    for (const file of markdownFiles) {
      const inputFile = join(directory, file);
      const name = file.replace(/\.(md|mdx)$/, '')
      const outputFile = join(directory, name + '.html');

      const config = configs.filter(c => c.path && c.path.startsWith(name)).values().next().value

      const docOptions = {
        title: config ? config.title : name,
        css: ["style/md.css", "style/results.css"],
        js: [],
        language: "en",
        link: [
          {href: '/favicon/favicon-96x96.png', rel: 'icon', type: "image/png", sizes: '96x96'},
          {href: '/favicon/favicon.svg', rel: 'icon', type: "image/svg+xml", sizes: '96x96'},
          {href: '/favicon/favicon.ico', rel: 'shortcut icon'},
          {href: '/favicon/apple-touch-icon.png', rel: 'apple-touch-icon', type: "image/png", sizes: '180x180'},
          {href: '/favicon/site.webmanifest', rel: 'manifest'},
          {href: 'https://github.com/goobill', rel: 'author'}
          // {href: '', rel: 'canonical'}
        ],
        responsive: true,
        script: [],
        style: [],
      };

      if (config) {
        docOptions["meta"] = [
          // Google
          {
            "name": "description",
            "content": config.description
          },
          {
            "name": "keywords",
            "content": config.tags.concat(config.datetime ? [config.datetime.label] : []).join(', ')
          },
          {
            "name": "author",
            "content": "Goobill"
          },
          {
            "name": "publication_date",
            "content": config.datetime ? config.datetime.value : null
          },

          // Facebook
          {
            "property": "og:url",
            "content": config.path
          },
          {
            "property": "og:image",
            "content": config.splash
          },
          {
            "property": "og:description",
            "content": config.description
          },
          {
            "property": "og:title",
            "content": config.title
          },
          {
            "property": "og:site_name",
            "content": "Goobill"
          },
          {
            "property": "og:see_also",
            "content": "https://goobill.com"
          },

          {
            "name": "apple-mobile-web-app-title",
            "content": config.title
          },
        ]
      }

      const processedFile = await unified()
        .use(remarkParse)
        .use(remarkGfm) // Support GFM (tables, autolinks, tasklists, strikethrough).
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

const mdFileDir = './docs'
const configFile = './search.json'

await processMarkdownFiles(mdFileDir, configFile);
