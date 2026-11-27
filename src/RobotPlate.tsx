import { useEffect, useRef, useState } from 'react'

export function RobotPlate() {
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
      <span className="plate-label mono">Barelang FC / Humanoid</span><span className="camera-label" aria-hidden="true">Head camera</span>
    </div>
    <figcaption><span>No. 4 · {full ? 'Front elevation' : 'Front detail'}</span>
      <button aria-pressed={full} aria-label="Full view" onClick={() => {fullView.current = !full; setFull(!full)}}>{full ? '− Detail' : '+ Full view'}</button></figcaption>
  </figure>
}


