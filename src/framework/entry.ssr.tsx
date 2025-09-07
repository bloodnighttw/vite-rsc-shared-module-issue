import { createFromReadableStream } from '@vitejs/plugin-rsc/ssr'
import React, { Suspense } from 'react'
import { renderToReadableStream } from 'react-dom/server.edge'
import { prerender } from 'react-dom/static.edge'
import { injectRSCPayload } from 'rsc-html-stream/server'
import type { RscPayload } from './shared'

export async function renderHtml(
  rscStream: ReadableStream<Uint8Array>,
  options?: {
    ssg?: boolean
  },
) {
  const [rscStream1, rscStream2] = rscStream.tee()

  let payload: Promise<RscPayload>
  function SsrRoot() {
    payload ??= createFromReadableStream<RscPayload>(rscStream1)
    console.log("before use")
    const root = React.use(payload).root
    
    console.log("this place can be reached", root)
    return root

  }

  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent('index')

  
  let htmlStream: ReadableStream<Uint8Array>
  if (options?.ssg) {
    // error happens here, prerender() will throw undefined, but if you call prerender() twice(by catch undefined and retry), it works...
    const prerenderResult = await prerender(<SsrRoot />, {
      bootstrapScriptContent,
    })
    htmlStream = prerenderResult.prelude
  } else {
    // error also happens here, renderToReadableStream() will throw undefined, but if you call it twice(by catch undefined and retry), it works...
    htmlStream = await renderToReadableStream(<SsrRoot />, {
      bootstrapScriptContent,
    })
  }

  let responseStream: ReadableStream<Uint8Array> = htmlStream
  responseStream = responseStream.pipeThrough(injectRSCPayload(rscStream2))
  return responseStream
}
