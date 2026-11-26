import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const origin=process.env.PREVIEW_URL || 'http://127.0.0.1:4173'
const local=path.resolve('.local/browser')
await mkdir(local,{recursive:true})
await mkdir('review',{recursive:true})
const browser=await chromium.launchPersistentContext(local,{
  channel:process.env.BROWSER_CHANNEL || 'msedge', headless:true,
  viewport:{width:1440,height:900},deviceScaleFactor:1,
  args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-crash-reporter','--disable-breakpad']
})
const errors=[], checks=[]
function observe(page){
  page.on('pageerror',e=>errors.push(e.message))
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())})
  page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+' '+r.status())})
  page.on('requestfailed',r=>{if(r.failure()?.errorText!=='net::ERR_ABORTED')errors.push(r.url()+' '+r.failure()?.errorText)})
}
function passed(s){checks.push(s);console.log(s)}
try{
  const page=browser.pages()[0]
  observe(page)
  await page.goto(origin)
  await page.evaluate(()=>document.fonts.ready)
  const canvas=page.locator('canvas')
  await canvas.waitFor()
  const hero=await page.locator('.hero').boundingBox()
  const sleep=()=>page.waitForTimeout(1200)
  const shot=name=>page.screenshot({path:'review/'+name+'.png',animations:'allow'})
  for(const [name,x,y] of [['center',.5,.5],['left',.03,.3],['right',.97,.7]]){
    await page.mouse.move(hero.x+hero.width*x,hero.y+hero.height*y)
    await sleep();await shot(name)
  }
  await page.mouse.move(1,1);await sleep();await shot('reset')
  passed('WebGL2 canvas, pointer sequence and pointer leave recorded')
  await page.getByRole('button',{name:'Full view'}).click()
  await sleep();await shot('full-view')
  assert.equal(await page.getByRole('button',{name:'Full view'}).getAttribute('aria-pressed'),'true')
  await page.getByRole('button',{name:'Full view'}).click()
  await page.mouse.move(1,1)
  await page.mouse.wheel(0,240);await sleep()
  assert.ok(await page.evaluate(()=>scrollY)>0);await shot('scroll')
  passed('Native scroll with scene visible')
  await page.goto(origin);await page.keyboard.press('Tab')
  assert.equal(await page.locator(':focus').innerText(),'Skip to notebook')
  await page.keyboard.press('Enter')
  await page.getByText('Read the field note',{exact:true}).focus()
  await page.keyboard.press('Enter');assert.ok(await page.locator('details').evaluate(d=>d.open))
  passed('Keyboard skip link and field note activation')
  for(const width of [360,390,768,1280,1440,1920]){
    await page.setViewportSize({width,height:width<700?844:900})
    await page.goto(origin);await page.evaluate(()=>document.fonts.ready);await canvas.waitFor();await sleep()
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth))
    await shot('width-'+width)
    passed('Layout without horizontal overflow at '+width+' px')
  }
  await page.emulateMedia({reducedMotion:'reduce'})
  await canvas.waitFor({state:'detached'})
  assert.ok(await page.locator('.still').evaluate(i=>i.complete && i.naturalWidth>0))
  assert.equal(await page.locator('h1 strong').first().evaluate(e=>getComputedStyle(e).animationName),'none')
  passed('Live reduced-motion preference restores photograph and removes headline animation')
  await page.emulateMedia({reducedMotion:'no-preference'})
  await canvas.waitFor()
  await canvas.evaluate(c=>c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext())
  await canvas.waitFor({state:'detached'})
  passed('Context loss returns to photograph')
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext=function(type,...args){
      return type.startsWith('webgl')?null:original.call(this,type,...args)
    }
  })
  await page.reload();await sleep()
  assert.equal(await canvas.count(),0)
  assert.ok(await page.locator('.still').evaluate(i=>i.complete && i.naturalWidth>0))
  passed('WebGL disabled at startup retains image and text')
  const touchBrowser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'msedge',headless:true})
  const mobile=await touchBrowser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,deviceScaleFactor:1})
  const phone=await mobile.newPage();observe(phone);await phone.goto(origin);await phone.evaluate(()=>document.fonts.ready);await phone.waitForTimeout(900)
  await phone.screenshot({path:'review/mobile-390.png',fullPage:true})
  assert.equal(await phone.locator('canvas').count(),0)
  await phone.getByRole('button',{name:'Full view'}).tap()
  assert.ok(await phone.locator('.viewport.full').count())
  await phone.getByRole('link',{name:'Work',exact:true}).tap()
  assert.equal(new URL(phone.url()).hash,'#work')
  await touchBrowser.close()
  passed('Touch photo control and Work navigation at 390 px')
  assert.deepEqual(errors,[])
  passed('No page errors, console errors or failed asset requests observed')
  await writeFile('review/results.json',JSON.stringify({browser:browser.browser().version(),checks,errors},null,2))
} finally {await browser.close()}

