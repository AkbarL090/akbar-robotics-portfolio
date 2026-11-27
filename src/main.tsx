import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RobotPlate } from './RobotPlate'
import { Filmstrip } from './Filmstrip'
import { work, workUrl, polibatamAward, smorphiResult } from './work'
import './style.css'
import './portfolio.css'

const CaseStudy=lazy(()=>import('./CaseStudy'))
function Header({home}:{home:boolean}){
  const root=home?'':'/'
  return <><a className="skip" href="#content">Skip to notebook</a><header><a className="brand" href={root+'#top'}><i aria-hidden="true"/>Muhammad Akbar Iqvi</a><nav aria-label="Primary">{['Work','Journal','About','Contact'].map(s=><a key={s} href={root+'#'+s.toLowerCase()}>{s}</a>)}</nav></header></>
}
function Hero(){
  return <section className="hero" aria-labelledby="headline"><RobotPlate/><div className="copy">
    <p className="eyebrow"><i className="signal-rule"/>Robotics Developer <b>/</b> Batam, Indonesia</p>
    <h1 id="headline">{['From','perception','to motion'].map((line,i)=><span key={line}><strong>{line}{i===2 && <em>.</em>}</strong>{' '}</span>)}</h1>
    <div className="personal-intro"><p className="intro">I’m Akbar. I study how humanoid robots read the field, find their position and decide when to move.</p><p className="signature">Robotics Engineering · Politeknik Negeri Batam</p></div>
  </div></section>
}

function SelectedWork(){
  return <section id="work"><div className="section-rule"><h2>Selected work</h2><span>Match Notebook / 01—05</span></div>
    <article className="feature-story"><div><p className="kicker">01 / Featured field note</p><h3><a href={workUrl(work[0])}>When should<br/>a goalkeeper move<em>?</em></a></h3><a className="text-link" href={workUrl(work[0])}>Explore the strategy ↗</a></div>
    <div className="story-film"><p className="film-label">Barelang FC · Field recording</p><Filmstrip/><details><summary>Read the field note</summary><p>I use estimated ball distance and head pan and tilt to decide when the keeper should act. These three moments show the robot on the field.</p></details></div></article>
    <div className="work-index">{work.slice(1).map((s,i)=><a key={s.slug} href={workUrl(s)}><small>0{i+2}</small><strong>{s.name}</strong><span>{s.discipline}</span><b aria-hidden="true">↗</b></a>)}</div>
  </section>
}

function Journal(){
  return <section className="journal section-space" id="journal"><div className="section-rule"><h2>Competition journal</h2><span>2026</span></div>
    <div className="journal-spread"><figure><img src="/media/incheon.webp" loading="lazy" width="1080" height="727" alt="Barelang FC team with its banner at RoboCup in Incheon"/><figcaption>Barelang FC · Incheon, South Korea</figcaption></figure><div><p className="kicker">RoboCup / Humanoid Soccer</p><h3>On the field <br/>in Incheon<em>.</em></h3><p>I participated with Barelang FC in the Humanoid Soccer League, Small Division. Our team placed second in the Best Custom Humanoid Robot Award.</p><a className="text-link" href={polibatamAward}>Team result · Polibatam ↗</a>
    <div className="journal-entry"><p className="kicker">RoboRoarZ / Singapore</p><h4>Movement on Smorphi</h4><p>I worked on movement logic with the Polibatam team in the Tertiary League Physical Robotics Challenge.</p><a className="text-link" href="/work/smorphi">Open project note ↗</a></div></div></div>
    <div className="awards"><h2>Achievements</h2><dl>
      <dt>2026 · Team</dt><dd>Second place · Best Custom Humanoid Robot Award, RoboCup</dd>
      <dt>2026 · Team</dt><dd><a href={smorphiResult}>Fifth place · RoboRoarZ Tertiary League Physical Robotics Challenge</a></dd>
      <dt>2026 · PBL Expo</dt><dd>Second place · Manufacturing Fabrication Products and Design Concepts categories</dd>
      <dt>2025 · PBL Expo</dt><dd>Second place · Manufacturing Fabrication Process category</dd>
    </dl></div></section>
}

function About(){
  return <section id="about" className="about section-space"><div className="section-rule"><h2>About me</h2><span>Batam / Indonesia</span></div>
    <div className="bio"><figure><img src="/media/portrait.webp" loading="lazy" width="209" height="270" alt="Portrait of Muhammad Akbar Iqvi"/></figure>
    <div><h3>Muhammad<br/>Akbar Iqvi<em>.</em></h3><p>I started working in robotics in 2024, drawn to the humanoid teams at Politeknik Negeri Batam and their history at RoboCup. Today I study Robotics Engineering and develop humanoid behaviors with Barelang FC.</p></div>
    <div className="expertise"><h2>Technical expertise</h2><dl><dt>Perception & estimation</dt><dd>Computer vision, depth sensing, odometry and particle filters</dd><dt>Software & motion</dt><dd>Python, C++, ROS 2, Ubuntu and inverse kinematics</dd><dt>Embedded platforms</dt><dd>Jetson Xavier, Radxa and ESP32</dd></dl></div></div></section>
}
function Footer(){
  return <footer id="contact"><div><h2>Contact</h2><p className="footer-name">Muhammad Akbar Iqvi</p></div><div className="contacts"><a href="https://www.linkedin.com/in/muhammad-akbar-iqvi-115989355/">LinkedIn ↗</a><a href="https://github.com/AkbarL090">GitHub ↗</a><a href="#top">Back to top ↑</a></div></footer>
}

function App(){
  const path=location.pathname.replace(/\/$/,'')
  const home=path===''
  const study=work.find(s=>workUrl(s)===path)
  return <div className="page" id="top"><Header home={home}/>{home?<main id="content"><Hero/><SelectedWork/><Journal/><About/></main>:study?<Suspense fallback={<p>Opening project…</p>}><CaseStudy study={study}/></Suspense>:<main id="content"><h1>Page not found</h1><a href="/">Return to the notebook</a></main>}<Footer/></div>
}
createRoot(document.getElementById('root')!).render(<App/>)


