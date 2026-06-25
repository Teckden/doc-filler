import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

const codeClass = 'rounded bg-base-200 px-1.5 py-0.5 font-mono text-sm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 text-center">
      <div className="relative">
        <img
          src={heroImg}
          className="relative z-0 mx-auto w-[170px]"
          width="170"
          height="179"
          alt=""
        />
        <img
          src={reactLogo}
          className="absolute inset-x-0 top-[34px] z-[1] mx-auto h-7"
          alt="React logo"
        />
        <img
          src={viteLogo}
          className="absolute inset-x-0 top-[107px] z-0 mx-auto h-[26px] w-auto"
          alt="Vite logo"
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-5xl font-medium tracking-tight max-lg:text-4xl">Get started</h1>
        <p className="text-base-content/70">
          Edit <code className={codeClass}>src/App.tsx</code> and save to test{' '}
          <code className={codeClass}>HMR</code>
        </p>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => setCount((c) => c + 1)}
      >
        Count is {count}
      </button>
    </section>
  )
}

export default App
