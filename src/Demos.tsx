import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'

function Lab({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="lab" aria-label={title}><p className="kicker">Illustrative simulation</p><h2>{title}</h2><p className="lab-intro">{description}</p>{children}</section>
}

function Slider({name, value, min, max, onChange, unit=''}:{name:string; value:number; min:number; max:number; onChange:(n:number)=>void; unit?:string}){
  return <label className="slider"><span>{name} <b>{value}{unit}</b></span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>
}

function Pitch(){
  return <g fill="none" stroke="#899682" strokeWidth="1.25"><rect x="12" y="12" width="456" height="216"/><path d="M240 12v216 M12 57h90v126H12 M468 57h-90v126h90"/><circle cx="240" cy="120" r="39"/><circle cx="240" cy="120" r="2" fill="#899682"/></g>
}

export function KeeperDemo(){
  const [ball,setBall]=useState({x:156,y:97})
  const [keeper,setKeeper]=useState(66)
  const ahead=ball.x-keeper
  const separation=Math.hypot(ahead,ball.y-120)
  const pan=Math.atan2(120-ball.y,ahead)*180/Math.PI
  const tilt=Math.atan2(20,Math.max(.01,separation))*180/Math.PI
  const action=keeper>102?'Retreat into the area':separation<55?'Prepare to save':ahead>0 && keeper<102?'Advance within the area':'Hold position'
  function place(event:PointerEvent<SVGSVGElement>){
    const matrix=event.currentTarget.getScreenCTM()
    if(!matrix)return
    const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse())
    setBall({x:Math.min(468,Math.max(12,Math.round(p.x))),y:Math.min(228,Math.max(12,Math.round(p.y)))})
  }
  return <Lab title="Read the ball" description="Move the ball on the pitch or use the sliders. The model assumes a level field and a fixed camera height. All distances use illustrative field units.">
    <svg className="diagram pitch-control" viewBox="0 0 480 240" role="img" aria-label="Field with a keeper, movable ball and shaded penalty area" onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);place(e)}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))place(e)}}>
      <rect x="12" y="57" width="90" height="126" fill="#c9d5c1"/><Pitch/>
      <path d={`M${keeper} 120 L${ball.x} ${ball.y}`} stroke="#8a4228" strokeDasharray="5 4"/>
      <circle cx={keeper} cy="120" r="8" fill="#1d4235"/><circle cx={ball.x} cy={ball.y} r="7" fill="#d05026" stroke="#63301b" strokeWidth="2"/>
    </svg><div className="legend">Green · Keeper　 Orange · Ball　 Shaded · Penalty area</div>
    <div className="controls"><Slider name="Ball across field" min={12} max={468} value={ball.x} onChange={x=>setBall({...ball,x})}/><Slider name="Ball across goal" min={12} max={228} value={ball.y} onChange={y=>setBall({...ball,y})}/><Slider name="Keeper advance" min={12} max={130} value={keeper} onChange={setKeeper}/></div>
    <p className="readout" aria-live="polite">{action}</p><p className="legend">Distance {separation.toFixed(1)} units · Pan {pan.toFixed(0)}° · Downward tilt {tilt.toFixed(0)}°</p><p className="method">Here the keeper prepares for a save within 55 units and retreats beyond the penalty line at 102. These thresholds belong to this teaching model.</p>
  </Lab>
}

const stages=['Starting pose','Predict motion','Weight the observation','Resample poses']
const explanations=['Nearby poses describe the initial uncertainty.','The odometry step moves the estimate forward and spreads the candidate poses.','A synthetic field observation gives more weight to poses near the observed position.','The next set concentrates around poses that agreed with the observation.']
const particles=Array.from({length:96},(_,i)=>({angle:i*2.39996,r:Math.sqrt((i+.5)/96)}))
export function LocalizationDemo(){
  const [step,setStep]=useState(0)
  const [playing,setPlaying]=useState(false)
  useEffect(()=>{
    if(!playing)return
    const timer=window.setTimeout(()=>{if(step<3)setStep(step+1);else setPlaying(false)},1000)
    return ()=>clearTimeout(timer)
  },[step,playing])
  const cx=[156,247,247,259][step],cy=[148,108,108,100][step]
  const positions=particles.map(({r,angle})=>({x:cx+r*Math.cos(angle)*[28,65,65,24][step],y:cy+r*Math.sin(angle)*[20,42,42,16][step]}))
  const weights=positions.map(({x,y})=>step===2?Math.exp(-((x-259)**2+(y-100)**2)/340):1)
  const sum=weights.reduce((a,b)=>a+b,0)
  const mean=positions.reduce((p,v,i)=>({x:p.x+v.x*weights[i]/sum,y:p.y+v.y*weights[i]/sum}),{x:0,y:0})
  return <Lab title="Follow a pose estimate" description="Step through a synthetic field observation. Each dot is a possible robot position. The ring marks their weighted mean.">
    <svg className="diagram" viewBox="0 0 480 240" role="img" aria-label={stages[step]+' particle distribution'}><Pitch/><path d={step?'M75 180L156 148L247 108':'M75 180L156 148'} fill="none" stroke="#a84e2e" strokeWidth="3" strokeDasharray="5 3"/>{positions.map((v,i)=><circle key={i} cx={v.x} cy={v.y} r={2+weights[i]} opacity={.2+.55*weights[i]} fill="#1e5141"/>)}<circle cx={mean.x} cy={mean.y} r="8" fill="none" stroke="#953c20" strokeWidth="3"/></svg>
    <div className="stage-tabs">{stages.map((s,i)=><button key={s} aria-pressed={i===step} onClick={()=>{setStep(i);setPlaying(false)}}>{s}</button>)}</div><p className="method" aria-live="polite">{explanations[step]}</p>
    <button className="action" onClick={()=>{if(!playing)setStep(0);setPlaying(!playing)}}>{playing?'Pause sequence':'Play sequence'}</button>
  </Lab>
}

const passes=['Raw returns','Voxel sample','Plane fit']
export function DepthDemo(){
  const [angle,setAngle]=useState(24),[pass,setPass]=useState(2)
  const rad=angle*Math.PI/180
  const project=(x:number,y:number,z:number)=>[240+x*.94+z*.48,148-y*.93+z*.45]
  const surface=(x:number,z:number)=>project(x*Math.cos(rad),x*Math.sin(rad),z)
  const corners=[[-115,-65],[115,-65],[115,65],[-115,65]].map(([x,z])=>surface(x,z).join(',')).join(' ')
  const [nx,ny]=project(-85*Math.sin(rad),85*Math.cos(rad),0)
  const dots=[]
  const stride=pass===0?8:20
  for(let x=-110;x<=110;x+=stride)for(let z=-60;z<=60;z+=stride){
    const [px,py]=surface(x,z)
    dots.push(<circle key={x+','+z} cx={px} cy={py+Math.sin(x*1.5+z)*2} r={pass===0?1.6:2.4} fill="#2c5749"/>)
  }
  return <Lab title="Measure a slope" description="Tilt a synthetic surface and trace the stages from depth returns to a plane normal. The dashed line is the reference vertical.">
    <svg className="diagram" viewBox="0 0 480 265" role="img" aria-label={`Synthetic point cloud at ${angle} degrees, ${passes[pass]}`}>
      <path d="M240 148V44" stroke="#536453" strokeDasharray="4 4"/>{pass===2 && <polygon points={corners} fill="#b2c9b5" stroke="#577663"/>}{dots}
      {pass<2 && Array.from({length:13},(_,i)=><circle key={i} cx={123+i*18} cy={53+(i*47)%132} r="2.4" fill="#8c6655"/>)}
      {pass===2 && <g stroke="#9c3c1e" fill="#9c3c1e"><path d={`M240 148L${nx} ${ny}`} strokeWidth="3"/><circle cx={nx} cy={ny} r="4"/><text x={nx-8} y={ny-10} stroke="none" fontSize="13">n</text></g>}
    </svg><div className="stage-tabs">{passes.map((label,i)=><button key={label} aria-pressed={pass===i} onClick={()=>setPass(i)}>{label}</button>)}</div>
    <Slider name="Surface angle" min={0} max={55} value={angle} unit="°" onChange={setAngle}/>
    <p className="readout">Inclination {angle}°</p><p className="method">{['Dense returns include points away from the dominant surface.','A voxel grid groups nearby points and keeps a representative sample. The sparser drawing illustrates that reduction.','RANSAC tests candidate planes against point support. This diagram draws the known synthetic plane and its normal. The angle between the normal and vertical gives the inclination.'][pass]}</p>
  </Lab>
}

