# Mermaid Diagram Embed

Easily embed interactive Mermaid.js diagrams in your projects using simple iframes. No installation or configuration required - just use our hosted solution to render beautiful diagrams anywhere on the web.

![Mermaid Editor Screenshot](https://trentbrew.pockethost.io/api/files/swvnum16u65or8w/73y6usyvz6qnjdw/image_27_TSLqQ7QXki.png?token=)

## Features

- 🖼️ Easy iframe embedding for any Mermaid diagram
- 🎨 Supports all Mermaid diagram types (flowcharts, sequence, class, etc.)
- 🔍 Interactive diagrams with zoom and pan
- 🌓 Automatic theme detection (light/dark)
- ⚡ Fast, globally distributed CDN delivery
- 🔒 Secure sandboxed iframes
- 📱 Fully responsive designs
- 🎯 Zero configuration required

## Quick Start

Embed any Mermaid diagram with a simple iframe:

```html
<iframe
  src="https://your-app-url.com/embed?code=YOUR_ENCODED_MERMAID_CODE"
  width="100%"
  height="500px"
  style="border: 1px solid #e5e7eb; border-radius: 0.5rem;"
  allowfullscreen
>
</iframe>
```

## URL Encoding Mermaid Syntax

To properly include your Mermaid diagram in the URL, you'll need to URL-encode your Mermaid code. Here's how:

1. **Start with your Mermaid code**:

   ```mermaid
   graph TD
     A[Start] --> B{Is it?}
     B -->|Yes| C[OK]
     C --> D[Rethink]
     D --> B
     B ---->|No| E[End]
   ```

2. **Remove indentation and newlines** (optional but recommended):

   ```
   graph TD A[Start] --> B{Is it?} B -->|Yes| C[OK] C --> D[Rethink] D --> B B ---->|No| E[End]
   ```

3. **URL-encode the string** (JavaScript example):

   ```javascript
   const mermaidCode =
     'graph TD A[Start] --> B{Is it?} B -->|Yes| C[OK] C --> D[Rethink] D --> B B ---->|No| E[End]';
   const encoded = encodeURIComponent(mermaidCode);
   const url = `https://your-app-url.com/embed?code=${encoded}`;
   ```

4. **Resulting URL**:
   ```
   https://your-app-url.com/embed?code=graph%20TD%20A%5BStart%5D%20--%3E%20B%7BIs%20it%3F%7D%20B%20--%3E%7CYes%7C%20C%5BOK%5D%20C%20--%3E%20D%5BRethink%5D%20D%20--%3E%20B%20B%20---%3E%7CNo%7C%20E%5BEnd%5D
   ```

### URL Parameters

- `code`: (Required) URL-encoded Mermaid diagram code
- `theme`: (Optional) Force light/dark theme (`light` or `dark`)
- `width`: (Optional) Iframe width (e.g., `800px` or `100%`)
- `height`: (Optional) Iframe height (e.g., `600px` or `100%`)

Example with all parameters:

```
https://your-app-url.com/embed?code=graph%20TD%20A%5BStart%5D%20--%3E%20B%5BEnd%5D&theme=dark&width=100%25&height=500px
```

## Advanced Usage

### Self-hosting

If you prefer to host this yourself:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/mermaid-editor-v2.git
   cd mermaid-editor-v2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

### API Endpoints

- `GET /embed` - Main iframe endpoint
- `GET /api/diagram` - Raw diagram rendering API (returns SVG/PNG)
- `POST /api/diagram` - Generate diagram from code (for server-side rendering)

## Built With

- [Mermaid.js](https://mermaid.js.org/) - Powerful diagramming and charting
- [Next.js](https://nextjs.org/) - React Framework for server-side rendering
- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on our [GitHub repository](https://github.com/your-username/mermaid-editor-v2).

## Security

All diagrams are rendered client-side in the user's browser. Your diagram code is never stored on our servers.

## Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) for the amazing diagramming library
- [Next.js](https://nextjs.org/) for the awesome framework
- All our contributors who help improve this project

## Star History

If you find this project useful, please consider giving it a ⭐️ on GitHub!
