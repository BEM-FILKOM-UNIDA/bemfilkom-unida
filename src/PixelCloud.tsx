import { useCallback, useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

import './PixelCloud.css'

// Fullscreen triangle straight from gl_VertexID - no buffers, no matrices,
// no 3D engine. ponytail: three.js only drew a PlaneGeometry here.
const vertexShader = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
`

// Domain-warped billow noise, asymmetric dome-top/flat-base envelope and
// self-shadowing toward the sun, then pixelated: fragCoord is snapped to a
// chunky grid before any sampling, and both the density field and its
// self-shadow occlusion are quantized into flat steps - together that turns
// soft photographic clouds into flat-shaded, blocky pixel-art ones while
// keeping the original silhouettes and drift.
const fragmentShader = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uCount;
uniform vec3 uCloudColor;
uniform vec3 uSkyTopColor;
uniform vec3 uSkyBottomColor;
uniform float uPixelSize;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one cloud and blends it over the current color - quantized into
// flat density/occlusion steps so the shading reads as posterized bands.
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  d = floor(d / 0.1) * 0.1;
  if (d < 0.02) return color;

  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);
  occl = floor(occl * 3.0) / 3.0;

  vec3 lit = uCloudColor * 1.04;
  vec3 shadow = mix(uCloudColor * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);

  float alpha = step(0.02, d);
  cloudCol = mix(cloudCol, sky, dist * 0.35);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist) {
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}

void main() {
  // Snap to a chunky pixel grid FIRST so every downstream sample stays
  // blocky - this is what turns smooth clouds into pixel art instead of
  // soft photographic ones.
  vec2 pixelCoord = floor(gl_FragCoord.xy / uPixelSize) * uPixelSize;
  vec2 uv = pixelCoord / uResolution;

  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime;

  vec3 sky = mix(uSkyBottomColor, uSkyTopColor, uv.y);
  vec3 color = sky;

  // faint haze band near the horizon
  color = mix(color, uSkyBottomColor * 1.06, smoothstep(0.35, 0.0, uv.y) * 0.5);

  // far layer: small, high, slow
  if (uCount > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  }
  if (uCount > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  }

  // middle layer
  if (uCount > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  }
  if (uCount > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  }

  // near layer: big, low, fast
  if (uCount > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);

  fragColor = vec4(color, 1.0);
}
`

function hexToVec3(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  }
  return shader
}

function applyProps(
  gl: WebGL2RenderingContext,
  u: Record<string, WebGLUniformLocation | null>,
  p: { count: number; cloudColor: string; skyTopColor: string; skyBottomColor: string }
) {
  gl.uniform1f(u.uCount, p.count)
  gl.uniform3fv(u.uCloudColor, hexToVec3(p.cloudColor))
  gl.uniform3fv(u.uSkyTopColor, hexToVec3(p.skyTopColor))
  gl.uniform3fv(u.uSkyBottomColor, hexToVec3(p.skyBottomColor))
}

export default function PixelCloud({
  cloudColor = '#fbf8f2',
  skyTopColor = '#3876ba',
  skyBottomColor = '#8cbfe8',
  speed = 1,
  count = 6,
  pixelSize = 6,
  className = '',
  style = {},
}: {
  cloudColor?: string
  skyTopColor?: string
  skyBottomColor?: string
  speed?: number
  count?: number
  pixelSize?: number
  className?: string
  style?: CSSProperties
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const glRef = useRef<WebGL2RenderingContext | null>(null)
  const uRef = useRef<Record<string, WebGLUniformLocation | null>>({})
  const rafRef = useRef(0)
  const resizeTimerRef = useRef(0)
  const visibleRef = useRef(true)
  const speedRef = useRef(speed)
  const pixelSizeRef = useRef(pixelSize)
  speedRef.current = speed
  pixelSizeRef.current = pixelSize

  // ponytail: uResolution is the drawing-buffer size (device px) so the
  // aspect ratio is right on retina, and uPixelSize scales with dpr so a
  // "6px" pixel is 6 CSS px on every screen.
  const handleResize = useCallback(() => {
    const gl = glRef.current
    const container = containerRef.current
    if (!gl || !container) return

    // ponytail: dpr di-cap 1.5, bukan 2. Shader ini 6 lapis noise 5-oktaf
    // per piksel; di layar 1440p retina dpr 2 = 5,2 juta fragmen per frame
    // dan itu{frame rate} utama kita. Karena efeknya memang pixel-art blok,
    // 1.5 hampir tak terlihat tapi memotong ~44% beban GPU.
    // Naikkan ke 2 kalau tepi blok terlihat terlalu lembut di layar retina.
    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const w = Math.round(container.clientWidth * dpr)
    const h = Math.round(container.clientHeight * dpr)
    if (!w || !h) return

    // setting width/height reallocates + clears the buffer, so only do it on
    // an actual size change - uniforms are cheap to re-send
    if (w !== gl.canvas.width || h !== gl.canvas.height) {
      gl.canvas.width = w
      gl.canvas.height = h
      gl.viewport(0, 0, w, h)
    }
    gl.uniform2f(uRef.current.uResolution, w, h)
    gl.uniform1f(uRef.current.uPixelSize, pixelSizeRef.current * dpr)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    container.appendChild(canvas)
    canvasRef.current = canvas

    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    if (!gl) return
    glRef.current = gl

    const program = gl.createProgram()!
    gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader))
    gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader))
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
    }
    gl.useProgram(program)

    const u = uRef.current
    for (const name of [
      'uResolution',
      'uTime',
      'uCount',
      'uCloudColor',
      'uSkyTopColor',
      'uSkyBottomColor',
      'uPixelSize',
    ]) {
      u[name] = gl.getUniformLocation(program, name)
    }

    const visible = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0 }
    )
    visible.observe(container)

    const resize = () => {
      clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = window.setTimeout(handleResize, 100)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    // a11y basics: reduced motion gets one static frame, not a live loop
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startTime = performance.now()
    const render = () => {
      gl.uniform1f(u.uTime, ((performance.now() - startTime) * 0.001) * speedRef.current)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      if (visibleRef.current) render()
    }
    handleResize()
    // seed colors before the first frame - see note on applyProps
    applyProps(gl, u, { count, cloudColor, skyTopColor, skyBottomColor })
    if (still) render()
    else animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeTimerRef.current)
      visible.disconnect()
      resizeObserver.disconnect()
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
      glRef.current = null
      canvasRef.current = null
    }
  }, [handleResize])

  // ponytail: satu tempat menulis uniform warna/count. Effect setup memanggilnya
  // SEBELUM frame pertama digambar; kalau cuma di effect terpisah, frame pertama
  // (jalur reduced-motion) masih pakai uniform default alias hitam.

  useEffect(() => {
    const gl = glRef.current
    if (!gl) return
    applyProps(gl, uRef.current, { count, cloudColor, skyTopColor, skyBottomColor })
    handleResize()
  }, [count, cloudColor, skyTopColor, skyBottomColor, handleResize])

  return <div ref={containerRef} className={`pixel-cloud-container ${className}`} style={style} />
}
