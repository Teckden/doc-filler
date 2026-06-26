// docx-templates ships two entries: a Node build (`lib/index.js`, which
// `require`s the Node-only `vm` module) and a self-contained, polyfilled browser
// bundle (`lib/browser.js`, with `vm`/`Buffer` bundled in). We import the browser
// bundle at runtime but borrow the package's real types, since no `browser.d.ts`
// is shipped.
declare module 'docx-templates/lib/browser.js' {
  export * from 'docx-templates'
}
