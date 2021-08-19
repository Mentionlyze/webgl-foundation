const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 u_ViewMatrix;
  varying vec4 v_Color;
  void main() {
    gl_Position = u_ViewMatrix * a_Position;
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

  const FSIZE = verticesColors.BYTES_PER_ELEMENT

  const vertexColorBuffer = gl.createBuffer()
  if (!vertexColorBuffer) {
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")
  const a_Color = gl.getAttribLocation(gl.program, "a_Color")
  if (a_Position < 0) {
    return -1
  }

  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0)
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3)

  gl.enableVertexAttribArray(a_Position)
  gl.enableVertexAttribArray(a_Color)

  return n
}

let g_eyeX = 0.2,
  g_eyeY = 0.25,
  g_eyeZ = 0.25

function keydown(ev, gl, n, u_ViewMatrix, viewMatrix) {
  if (ev.keyCode === 39) {
    g_eyeX += 0.01
  } else if (ev.keyCode === 37) {
    g_eyeX -= 0.01
  } else {
    return
  }
  draw(gl, n, u_ViewMatrix, viewMatrix)
}

function draw(gl, n, u_ViewMatrix, viewMatrix) {
  viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

void (function main() {
  const canvas = document.querySelector("#webgl")
  const gl = getWebGLContext(canvas)
  if (!gl) {
    return
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return
  }
  const n = initVertexBuffers(gl)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  const u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix")
  const viewMatrix = new Matrix4()

  document.addEventListener("keydown", (ev) =>
    keydown(ev, gl, n, u_ViewMatrix, viewMatrix)
  )
})()
