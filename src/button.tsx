'use client'

// import load from './framework/loader'

const load = (await import('./framework/loader')).default

export function Button() {

  return (
    <button onClick={()=> load("/test.rsc")}>Press me to preload rsc</button>
  )
}
