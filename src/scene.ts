import * as T from 'three'

export function mountScene(host: HTMLElement, fullView: () => boolean) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  const context = canvas.getContext('webgl2', { antialias: true, alpha: false })
  if (!context) return () => {}
  const renderer = new T.WebGLRenderer({ canvas, context })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  const scene = new T.Scene()
  scene.background = new T.Color(0xd4dacd)
  scene.fog = new T.FogExp2(0xd4dacd, .069)
  const camera = new T.PerspectiveCamera(27, 1, .05, 100)
  const robotHeight = 3.5
  let ready = false, disposed = false
  const photo = new T.TextureLoader().load('/media/robot-front.webp', () => {
    if (!disposed) { ready = true; schedule() }
  })
  photo.colorSpace = T.SRGBColorSpace
  const robot = new T.Mesh(new T.PlaneGeometry(robotHeight * 502/1050, robotHeight),
    new T.MeshBasicMaterial({ map: photo, transparent: true, fog: false, depthWrite: false }))
  robot.position.y = robotHeight / 2 + .014
  robot.renderOrder = 2
  scene.add(robot)
  const floor = new T.Mesh(new T.PlaneGeometry(100,100), new T.MeshBasicMaterial({color:0xcdd4c6}))
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)
  const grid = new T.GridHelper(48,48,0xaab5a3,0xb5beaf)
  grid.material.transparent = true
  grid.material.opacity = .38
  grid.position.y = .002
  scene.add(grid)
  // A pitch marking behind the image plane gives the camera a second depth reference.
  const boundary = new T.Line(new T.BufferGeometry().setFromPoints([
    new T.Vector3(-3,.008,1.7),new T.Vector3(-3,.008,-3),
    new T.Vector3(3,.008,-3),new T.Vector3(3,.008,1.7),
  ]),new T.LineBasicMaterial({color:0x9ca893}))
  scene.add(boundary)
  const annotation = host.querySelector<HTMLElement>('.camera-label')
  const head = new T.Vector3()
  const bitmap = document.createElement('canvas')
  bitmap.width = bitmap.height = 128
  const brush = bitmap.getContext('2d')!
  const gradient = brush.createRadialGradient(64,64,1,64,64,64)
  gradient.addColorStop(0,'rgba(43,51,39,.48)')
  gradient.addColorStop(.45,'rgba(43,51,39,.20)')
  gradient.addColorStop(1,'rgba(43,51,39,0)')
  brush.fillStyle = gradient
  brush.fillRect(0,0,128,128)
  const shade = new T.CanvasTexture(bitmap)
  const shadow = new T.Mesh(new T.PlaneGeometry(1.9,.9), new T.MeshBasicMaterial({map:shade,transparent:true,depthWrite:false}))
  shadow.position.y=.007
  shadow.rotation.x=-Math.PI/2
  scene.add(shadow)
  const hero = host.closest('section')!
  let x=0,y=0,dx=0,dy=0,zoom=0,visible=true,frame=0,last=0,elapsed=0
  function move(e:PointerEvent) {
    const rect=hero.getBoundingClientRect()
    dx=T.MathUtils.clamp((e.clientX-rect.left)/rect.width*2-1,-1,1)
    schedule()
    dy=T.MathUtils.clamp(1-(e.clientY-rect.top)/rect.height*2,-1,1)
  }
  function reset(){dx=dy=0; schedule()}
  function schedule(){if(!frame && visible && ready && !disposed && !document.hidden) frame=requestAnimationFrame(draw)}
  function draw(now:number){
    frame=0
    const dt=Math.min((now-last)/1000,.05)
    last=now
    elapsed+=dt
    const damp=(a:number,b:number)=>T.MathUtils.damp(a,b,6,dt)
    x=damp(x,dx); y=damp(y,dy); zoom=damp(zoom,Number(fullView()))
    const aspect=camera.aspect
    const detailHeight=robotHeight*(502/1050)/(.93*aspect)
    const viewHeight=T.MathUtils.lerp(detailHeight,4.12,zoom)
    const scroll=T.MathUtils.clamp(-hero.getBoundingClientRect().top/hero.offsetHeight,0,1)
    const focus=T.MathUtils.lerp(robotHeight-detailHeight*.38,1.73,zoom)-scroll*.09
    const distance=viewHeight/(2*Math.tan(T.MathUtils.degToRad(camera.fov/2)))
    camera.position.set(x*.24,focus+.19+y*.14+scroll*.15,distance+.38*Math.exp(-elapsed*3)+scroll*.42)
    camera.lookAt(x*.038,focus+y*.023,0)
    renderer.render(scene,camera)
    if(!canvas.isConnected) host.append(canvas)
    if(annotation){
      head.set(.01,3.32,0).project(camera)
      annotation.style.left=((head.x+1)*50)+'%'
      annotation.style.top=((1-head.y)*50)+'%'
    }
    if(elapsed<2.5 || Math.abs(x-dx)+Math.abs(y-dy)+Math.abs(zoom-Number(fullView()))>.00015) schedule()
  }
  function resize(){
    camera.aspect=host.clientWidth/Math.max(1,host.clientHeight)
    camera.updateProjectionMatrix()
    renderer.setSize(host.clientWidth,host.clientHeight,false)
    schedule()
  }
  const changes=new MutationObserver(schedule)
  changes.observe(host,{attributes:true,attributeFilter:['class']})
  window.addEventListener('scroll',schedule,{passive:true})
  const size=new ResizeObserver(resize)
  size.observe(host)
  const visibility=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting; if(visible)schedule(); else {cancelAnimationFrame(frame);frame=0}})
  visibility.observe(host)
  hero.addEventListener('pointermove',move)
  hero.addEventListener('pointerleave',reset)
  document.addEventListener('visibilitychange',schedule)
  function dispose(){
    if(disposed)return
    disposed=true
    cancelAnimationFrame(frame)
    size.disconnect();visibility.disconnect();changes.disconnect()
    window.removeEventListener('scroll',schedule)
    hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset)
    document.removeEventListener('visibilitychange',schedule)
    canvas.removeEventListener('webglcontextlost',dispose)
    for(const object of [floor,robot,shadow,grid,boundary]){object.geometry.dispose();object.material.dispose()}
    photo.dispose();shade.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();annotation?.removeAttribute('style')
  }
  canvas.addEventListener('webglcontextlost',dispose)
  resize()
  return dispose
}



