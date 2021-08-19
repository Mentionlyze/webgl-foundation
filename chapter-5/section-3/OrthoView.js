const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ProjMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ProjMatrix * a_Position;
    v_Color = a_Color;
  }
`
const FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_Color;
  void main() {
    gl_FragColor = v_Color;
  }
`

function initVertexBuffers(gl) {
  const verticesColors = new Float32Array([
    0.0, 0.5, -0.4, 0.4, 1.0, 0.4, -0.5, -0.5, -0.4, 0.4, 1.0, 0.4, 0.5, -0.5,
    -0.4, 1.0, 0.4, 0.4,

    0.5, 0.4, -0.2, 1.0, 0.4, 0.4, -0.5, 0.4, -0.2, 1.0, 1.0, 0.4, 0, -0.6,
    -0.2, 1.0, 1.0, 0.4,

    0.0, 0.5, 0.0, 0.4, 0.4, 1.0, -0.5, -0.5, 0.0, 0.4, 0.4, 1.0, 0.5, -0.5,
    0.0, 1.0, 0.4, 0.4,
  ])
  const n = verticesColors.length / 6

  const vertexColorBuffer = gl.createBuffer()
  if (!vertexColorBuffer) {
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  const FSIZE = verticesColors.BYTES_PER_ELEMENT

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    return -1
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_Color = gl.getAttribLocation(gl.program, "a_Color")
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)
  gl.enableVertexAttribArray(a_Color)

  return n
}

let g_near = 0.0,
  g_far = 0.5

function keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf) {
  switch (ev.keyCode) {
    case 39:
      g_near += 0.01
      break
    case 37:
      g_near -= 0.01
      break
    case 38:
      g_far += 0.01
      break
    case 40:
      g_far -= 0.01
      break
    default:
      return
  }

  draw(gl, n, u_ProjMatrix, projMatrix, nf)
}

function draw(gl, n, u_ProjMatrix, projMatrix, nf) {
  projMatrix.setOrtho(-1, 1, -1, 1, g_near, g_far)
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)
  nf.innerHTML = `near: ${Math.round(g_near * 100) / 100}, far: ${
    Math.round(g_far * 100) / 100
  }`

  gl.drawArrays(gl.TRIANGLES, 0, n)
}

void (function main() {
  const canvas = document.querySelector("#webgl")
  const nf = document.querySelector("#nearFar")
  console.log(nf)
  const gl = getWebGLContext(canvas)
  if (!gl) {
    return
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return
  }

  const n = initVertexBuffers(gl)

  const u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix")
  const projMatrix = new Matrix4()

  window.addEventListener("keydown", (ev) =>
    keydown(ev, gl, n, u_ProjMatrix, projMatrix, nf)
  )

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
})()
