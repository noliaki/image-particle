import * as Three from 'three'
import ThreeBase from './ThreeBase'
import { TweenLite, Power0 } from 'gsap/all'
import ImageParticle from './ImageParticle'
import { loadTexture } from './helper'

const threeBase = new ThreeBase()
// const light = new Three.PointLight(0xffffff, 2, 50, 1.0)
// const light2 = new Three.DirectionalLight(0xffffff)
let imageParticle: ImageParticle
// light.position.x = 1000
// light.position.y = -1000
// light.position.z = 1000

// light2.position.x = 1000
// light2.position.y = -1000
// light2.position.z = -1000

if (process.env.NODE_ENV === 'development') {
  const axes = new Three.AxesHelper(1000)
  threeBase.addToScene(axes)
}

// threeBase.addToScene(light)
// threeBase.addToScene(light2)

const timeline = {
  progress: 0
}
let forwards: boolean = false

function loop() {
  threeBase.tick()
  imageParticle.time += 1
  requestAnimationFrame(loop)
}

function onTap(event): void {
  event.preventDefault()

  if (forwards) {
    reverseProgress()
  } else {
    forwardsProgress()
  }

  forwards = !forwards
}

function forwardsProgress(duration: number = 3): Promise<void> {
  return new Promise((resolve: () => void): void => {
    TweenLite.to(timeline, duration, {
      progress: 1,
      ease: Power0.easeNone,
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      }
    })
  })
}

function reverseProgress(duration: number = 3): Promise<void> {
  return new Promise((resolve: () => void): void => {
    TweenLite.to(timeline, duration, {
      progress: 0,
      ease: Power0.easeNone,
      onUpdate(): void {
        updateParticleProgress()
      },
      onComplete(): void {
        resolve()
      }
    })
  })
}

function updateParticleProgress(): void {
  imageParticle.progress = timeline.progress
}

;(async (): Promise<void> => {
  const texture1: Three.Texture = await loadTexture('cat.jpg')

  imageParticle = new ImageParticle(texture1)
  threeBase.addToScene(imageParticle)
  ;(document.getElementById(
    'start-animation'
  ) as HTMLButtonElement).addEventListener('click', onTap, false)

  loop()
})()
