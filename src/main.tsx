import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'

function RobotPlate() {
  const host = useRef<HTMLDivElement>(null)
  const fullView = useRef(false)
  const [full, setFull] = useState(false)
  useEffect(() => {
    const element = host.current!
    const controller = new AbortController()
    const preference = matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)')
    let dispose: (() => void) | undefined
    let generation = 0
    async function initialize() {
      const turn = ++generation
      dispose?.()
      if (preference.matches || (navigator.maxTouchPoints > 0 && matchMedia("(max-width: 700px)").matches)) return
      try {
        const { mountScene } = await import('./scene')
        if (!controller.signal.aborted && generation === turn)
          dispose = mountScene(element, () => fullView.current)
      } catch { /* The photograph is present before WebGL initialization. */ }
    }
    initialize()
    preference.addEventListener('change', initialize)
    return () => { controller.abort(); dispose?.(); preference.removeEventListener('change', initialize) }
  }, [])
  return <figure className="plate">
    <div className={'viewport ' + (full ? 'full' : '')} ref={host}>
      <img className="still" src="/media/robot-front.webp" alt="Barelang FC humanoid number 4 photographed from the front, mounted on its metal stand." />
      <span className="plate-label mono">Barelang FC</span>
    </div>
    <figcaption><span>No. 4 · {full ? 'Front elevation' : 'Front detail'}</span>
      <button aria-pressed={full} aria-label="Full view" onClick={() => {fullView.current = !full; setFull(!full)}}>{full ? '− Detail' : '+ Full view'}</button></figcaption>
  </figure>
}

const frames = [
  ['04','The ball lies between the humanoid and a person standing on the field.'],
  ['09','The humanoid stands near the ball.'],
  ['14','The humanoid is down on the left side of the field.']
]
function SelectedWork() {
  return <section id="work" aria-labelledby="work-title">
    <div className="striphead"><h2 id="work-title">Selected work <b>/</b> Humanoid goalkeeper strategy</h2><span>Field recording · 35.4 s</span></div>
    <div className="frames">{frames.map(([time,alt]) => <figure key={time}><img src={'/media/field-'+time+'.webp'} alt={alt}/><figcaption>00:{time}</figcaption></figure>)}</div>
    <details><summary>Read the field note</summary><p>I use estimated ball distance and head pan and tilt to decide when the goalkeeper should act. The strategy lets it advance within an allowed range and retreat after it leaves the penalty area. These frames document the robot on the field. The recording does not include the controller’s decision log.</p></details>
  </section>
}

function App() {
  return <div className="page" id="top"><a className="skip" href="#journal">Skip to notebook</a>
    <header><a className="brand" href="#top"><i aria-hidden="true"/>Muhammad Akbar Iqvi</a><nav aria-label="Primary"><a href="#work">Work</a><a href="#journal">Journal</a><a href="#about">About</a><a href="https://www.linkedin.com/in/muhammad-akbar-iqvi-115989355/">Contact</a></nav></header>
    <main><section id="journal" className="hero" aria-labelledby="question"><RobotPlate/>
      <div className="copy"><p className="eyebrow">From perception to motion <b>/</b> The engineering journal</p>
      <h1 id="question">{['When should','a goalkeeper','move'].map((line,i)=><span key={line}><strong>{line}{i===2 && <em>?</em>}</strong>{' '}</span>)}</h1>
      <p className="intro">My work on goalkeeper decisions uses estimated ball distance and head pan and tilt to help determine when the robot should act.</p>
      <p className="signature">Muhammad Akbar Iqvi · <span>Robotics Developer, </span>Barelang FC</p></div>
    </section><SelectedWork/></main>
    <footer id="about"><div><h2>About the author</h2><p>I’m Muhammad Akbar Iqvi, a Robotics Engineering student at Politeknik Negeri Batam and a member of Barelang FC.</p></div><a href="#top">Back to top ↑</a></footer>
  </div>
}
createRoot(document.getElementById('root')!).render(<App/>)

