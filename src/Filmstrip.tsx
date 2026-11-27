import {frames} from './work'

export function Filmstrip({onSelect,selected}:{onSelect?:(n:number)=>void;selected?:number}){
  return <div className="filmstrip">{frames.map(f=>{
    const stamp='00:'+String(f.time).padStart(2,'0')
    const content=<><img width="420" height="246" src={f.src} loading="lazy" alt={f.alt}/><span>{stamp}</span></>
    return onSelect?<button key={stamp} aria-label={'Seek to '+stamp} aria-pressed={selected===f.time} onClick={()=>onSelect(f.time)}>{content}</button>:<a key={stamp} href={'/work/goalkeeper?t='+f.time} aria-label={'Open recording at '+stamp}>{content}</a>
  })}</div>
}


