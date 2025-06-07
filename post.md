# Embeddable Mermaid Diagrams

Have you ever wanted to add beautiful, interactive diagrams to your documentation, blog, or app—without wrestling with complex setup? Meet **Mermaid Diagram Embed**: the easiest way to bring [Mermaid.js](https://mermaid.js.org/) diagrams to any project, instantly.

![Mermaid Editor Screenshot](https://trentbrew.pockethost.io/api/files/swvnum16u65or8w/73y6usyvz6qnjdw/image_27_TSLqQ7QXki.png?token=)

## What is it?

Mermaid Diagram Embed is a hosted solution that lets you render and share Mermaid diagrams anywhere using a simple iframe. No installation, no configuration—just copy, paste, and go. It supports all Mermaid diagram types (flowcharts, sequence, class, and more), with interactive zoom, pan, and theme support.

[Try the Demo](https://mermaid.brew.build/)

## Why you'll love it

- **Zero setup:** Just use an iframe—no npm, no build steps.
- **All diagram types:** Flowcharts, sequence, class, ER, Gantt, and more.
- **Interactive:** Pan and zoom (mouse wheel zoom can be disabled for UX!).
- **Responsive & theme-aware:** Looks great everywhere, light or dark.
- **Secure:** Sandboxed iframes keep your content safe.
- **Fast CDN delivery:** Diagrams load instantly, anywhere in the world.

## How to use

Embed any Mermaid diagram with a single iframe:

```html
<iframe
  src="https://mermaid.brew.build/#graph%20TD%0A%20%20A(Broadcasters)%0A%20%20B(Producers)%0A%20%20C(Viewers)%0A%20%20D(Partners%20%26%20Sponsors)%0A%0A%20%20A%20--%3E%7CInvite%2C%20manage%2C%20schedule%7C%20B%0A%20%20B%20--%3E%7CSubmit%20content%20to%7C%20A%0A%20%20A%20--%3E%7CCurate%20content%20for%7C%20C%0A%20%20C%20--%3E%7CWatch%20%26%20engage%20with%7C%20B%0A%20%20C%20--%3E%7CProvide%20feedback%20to%7C%20A%0A%20%20D%20--%3E%7CSupport%20content%20via%20funding%20or%20partnership%7C%20A%0A%20%20D%20--%3E%7CReach%20audience%20through%7C%20C%0A%20%20A%20--%3E%7CReport%20outcomes%20to%7C%20D%0A%20%20B%20--%3E%7CMay%20also%20engage%20with%7C%20D%0A%0A%20%20style%20A%20fill%3A%23E3F2FD%2Cstroke%3A%232196F3%2Cstroke-width%3A2px%0A%20%20style%20B%20fill%3A%23E8F5E9%2Cstroke%3A%234CAF50%2Cstroke-width%3A2px%0A%20%20style%20C%20fill%3A%23FFF3E0%2Cstroke%3A%23FF9800%2Cstroke-width%3A2px%0A%20%20style%20D%20fill%3A%23F3E5F5%2Cstroke%3A%239C27B0%2Cstroke-width%3A2px"
  width="100%"
  height="400px"
  style="border: 1px solid #e5e7eb; border-radius: 0.5rem;"
  allowfullscreen
></iframe>
```

Just URL-encode your Mermaid code and drop it in the `code` parameter. [See the README](https://github.com/your-username/mermaid-editor-v2) for more details and advanced options.

## Self-hosting & API

Want to run it yourself? Clone the repo, install dependencies, and you're set. There's also a simple API for rendering diagrams as SVG/PNG.

## Built with

- [Mermaid.js](https://mermaid.js.org/)
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Star us on GitHub if you find it useful!**

Questions or feedback? [Open an issue](https://github.com/your-username/mermaid-editor-v2) or reach out on the demo page.
