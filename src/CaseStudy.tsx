import {Filmstrip} from './Filmstrip'
import {useEffect,useRef,useState} from 'react'
import { KeeperDemo, LocalizationDemo, DepthDemo } from './Demos'
import { frames, smorphiResult, work, workUrl, type Study } from './work'

function Recording(){
  const ref=useRef<HTMLVideoElement>(null)
  const [cue,setCue]=useState<number|null>(()=>{const n=Number(new URLSearchParams(location.search).get('t'));return frames.some(f=>f.time===n)?n:null})
  function seek(n:number){
    setCue(n)
    if(ref.current){ref.current.currentTime=n;ref.current.pause()}
  }
  return <figure className="recording"><video ref={ref} controls playsInline preload={cue===null?'none':'metadata'} poster="/media/field-04.webp" src="/media/keeper.mp4" aria-label="Silent goalkeeper field recording" onLoadedMetadata={()=>{if(cue!==null && ref.current)ref.current.currentTime=cue}} onTimeUpdate={()=>{if(ref.current && cue!==null && Math.abs(ref.current.currentTime-cue)>.4)setCue(null)}}/>
    <figcaption>Field recording · 35.4 s · Silent review copy</figcaption><Filmstrip onSelect={seek} selected={cue??undefined}/></figure>
}

function Evidence({slug}:{slug:Study['slug']}){
  if(slug==='goalkeeper')return <Recording/>
  if(slug==='humanoid-motion')return <div className="routine-list">{['Get-up','Kicking','Diving','Archery'].map((name,i)=><div key={name}><span>{name}</span><small>{['Recovery','Soccer','Soccer','FIRA'][i]}</small></div>)}</div>
  const sources=slug==='surface-inclination'?[['depth-input','Depth input · sensor view'],['depth-plane','Plane fit · surface and normal']]:slug==='localization'?[['localization','Field view · original localization capture']]:[['singapore','Politeknik Negeri Batam at RoboRoarZ Singapore']]
  return <div className={'evidence-images '+slug}>{sources.map(([file,label])=><figure key={file}><img src={'/media/'+file+'.webp'} alt={label}/><figcaption>{label}</figcaption></figure>)}</div>
}

export default function CaseStudy({study}:{study:Study}){
  const index=work.indexOf(study), next=work[(index+1)%work.length]
  useEffect(()=>{document.title=study.name+' — Muhammad Akbar Iqvi'},[study])
  return <main id="content" className="case-page">
    <a className="return-link" href="/#work">← Selected work</a>
    <div className="case-heading"><p className="kicker">{study.discipline} / {String(index+1).padStart(2,'0')}</p><h1>{study.title}</h1><p className="case-name">{study.name}</p></div>
    <div className="case-lead"><Evidence slug={study.slug}/><div><h2>The problem</h2><p className="lead">{study.problem}</p><h2>My contribution</h2><p>{study.contribution}</p></div></div>
    <div className="case-text">{[['Technical approach',study.approach],['System behavior',study.behavior],['Evidence & results',study.evidence]].map(([label,text])=><section key={label}><h2>{label}</h2><p>{text}</p></section>)}</div>
    {study.slug==='smorphi' && <a className="source-link" href={smorphiResult}>Read the Polibatam competition report ↗</a>}
    {study.slug==='goalkeeper' && <KeeperDemo/>}{study.slug==='localization' && <LocalizationDemo/>}{study.slug==='surface-inclination' && <DepthDemo/>}
    {index<3 && <p className="lab-credit">Browser teaching model · Synthetic inputs. Original controller code and experimental data are unavailable.</p>}
    <a href={workUrl(next)} className="next-study"><span>Next study</span><strong>{next.name}</strong><b aria-hidden="true">↗</b></a>
  </main>
}


