import { Button } from './button'


export async function getStaticPaths() {
  return ['/']
}

export async function Root({ url }: { url: URL }) {

  async function RootContent() {
    if (url.pathname === '/') {
      return (
        <div>
          hello world!
        </div>
      )
    }

    if (!!module) {
      const Component = (module as any).default
      return <Component />
    }

    // TODO: how to 404?
    return <p>Not found</p>
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RSC MDX SSG</title>
      </head>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <a href="/">RSC + MDX + SSG</a>
          </h1>
          <Button />
          <span data-testid="timestamp">
            Rendered at {new Date().toISOString()}
          </span>
        </header>
        <main>
          <RootContent />
        </main>
      </body>
    </html>
  )
}
