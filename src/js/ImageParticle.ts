import * as Three from 'three'
import * as Bas from 'three-bas'

import vertexParameters from './glsl/vertexParameters.vert'
import vertexInit from './glsl//vertexInit.vert'
import vertexPosition from './glsl/vertexPosition.vert'
import noise3D from './glsl/noise3D.vert'

const PI: number = Math.PI

export default class ImageParticle extends Three.Mesh {
  public material: Three.Material
  public geometry: Three.Geometry

  constructor(texture: Three.Texture) {
    const image: any = texture.image
    const width: number = image.width
    const height: number = image.height

    const duration: number = 0.6
    const maxPrefabDelay: number = 0.4
    const splitRatio: number = 4

    const plane: Three.PlaneGeometry = new Three.PlaneGeometry(
      width,
      height,
      width / splitRatio,
      height / splitRatio
    )

    Bas.Utils.separateFaces(plane)

    const geometry: any = new Bas.ModelBufferGeometry(plane, {
      localizeFaces: true,
      computeCentroids: true
    })
    geometry.bufferUvs()

    geometry.createAttribute('aStaggerTime', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloat(20, 200),
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(0, 0.5)
      ).toArray(data)
    })

    geometry.createAttribute('aScale', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloat(1, 20),
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(10, 200),
        Math.random()
      ).toArray(data)
    })

    geometry.createAttribute('aRotate', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloat(0, 1),
        Three.Math.randFloat(0, 1),
        Three.Math.randFloat(0, 1),
        Three.Math.randFloat(0, 360)
      ).toArray(data)
    })

    geometry.createAttribute('aStagger', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(10, 200),
        Three.Math.randFloat(1000, 2000)
      ).toArray(data)
    })

    geometry.createAttribute('aStartPosition', 4, (data): void => {
      const vec3: Three.Vector3 = getRandomPointOnSphere(
        Three.Math.randFloat(0, 10000)
      )
      new Three.Vector4(
        vec3.x,
        vec3.y,
        vec3.z,
        Three.Math.randFloatSpread(2)
      ).toArray(data)
    })

    geometry.createAttribute('aEndPosition', 4, (data, index): void => {
      const centroid = geometry.centroids[index]
      new Three.Vector4(centroid.x, centroid.y, centroid.z, 0).toArray(data)
    })

    geometry.createAttribute('aControl0', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloatSpread(2000),
        Three.Math.randFloatSpread(2000),
        Three.Math.randFloat(0, -1000),
        Math.random() * -2 + 1
      ).toArray(data)
    })

    geometry.createAttribute('aControl1', 4, (data): void => {
      new Three.Vector4(
        Three.Math.randFloatSpread(2000),
        Three.Math.randFloatSpread(2000),
        Three.Math.randFloat(0, -1000),
        Math.random() * -2 + 1
      ).toArray(data)
    })

    const innerDelay: number = 0.02
    const aDelayDuration = geometry.createAttribute('aDelayDuration', 2)
    const widthFaces: number = width * (2 / splitRatio)
    const heightFaces: number = height * (2 / splitRatio)

    for (let i: number = 0, len: number = geometry.vertexCount; i < len; i++) {
      const delayX: number =
        Math.abs(((i % widthFaces) * 2 - widthFaces) / widthFaces) *
        (maxPrefabDelay - innerDelay)

      const delayY: number =
        Math.abs((Math.floor(i / widthFaces) * 4 - heightFaces) / heightFaces) *
        (maxPrefabDelay - innerDelay)

      for (let j: number = 0; j < 6; j += 2) {
        const index: number = i * 6 + j

        aDelayDuration.array[index + 0] =
          (delayX + delayY) / 2 + Math.random() * innerDelay
        aDelayDuration.array[index + 1] = duration
      }
    }

    texture.minFilter = Three.LinearFilter

    const material = new Bas.BasicAnimationMaterial({
      side: Three.DoubleSide,
      vertexColors: Three.VertexColors,
      uniforms: {
        uTime: { type: 'f', value: 0 },
        uProgress: { type: 'f', value: 0 },
        uSize: { type: 'vf2', value: [width, height] },
        map: { type: 't', value: texture }
      },
      vertexFunctions: [
        Bas.ShaderChunk.cubic_bezier,
        Bas.ShaderChunk.ease_cubic_in_out,
        Bas.ShaderChunk.quaternion_rotation
      ],
      vertexParameters: [vertexParameters, noise3D],
      vertexInit,
      vertexPosition,
      vertexColor: ['vColor = vec3(texelColor);']
    })
    material.uniforms.map.value.needsUpdate = true

    super(geometry, material)
    this.frustumCulled = false

    this.material = material
    this.geometry = geometry
  }

  get progress(): number {
    return (this.material as any).uniforms.uProgress.value
  }

  set progress(progress: number) {
    ;(this.material as any).uniforms.uProgress.value = progress
  }

  get time(): number {
    return (this.material as any).uniforms.uTime.value
  }

  set time(time: number) {
    ;(this.material as any).uniforms.uTime.value = time
  }
}

function getRandomPointOnSphere(r: number): Three.Vector3 {
  const u: number = Three.Math.randFloat(0, 1)
  const v: number = Three.Math.randFloat(0, 1)
  const theta: number = 2 * PI * u
  const phi: number = Math.acos(2 * v - 1)

  return new Three.Vector3(
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta) * Math.sin(phi),
    r * Math.cos(phi)
  )
}
