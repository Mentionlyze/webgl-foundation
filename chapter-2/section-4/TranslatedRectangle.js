const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform vec4 u_Translation;
  void main() {
    gl_Position = a_Position + u_Translation;
    gl_PointSize = 10.0;
  }
`

const FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }
`

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5,
  ])
  const n = 4

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.log("Failed to create buffer")
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    console.log("Failed to get the storage position")
    return -1
  }
  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor")
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)
  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0)

  const Tx = 0.3,
    Ty = 0.3,
    Tz = 0.0
  const u_Translation = gl.getUniformLocation(gl.program, "u_Translation")
  gl.uniform4f(u_Translation, Tx, Ty, Tz, 0.0)

  return n
}

void (function main() {
  const canvas = document.querySelector("#webgl")

  const gl = getWebGLContext(canvas)

  if (!gl) {
    console.log("Failed to get context of webgl")
    return
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to init shaders")
    return
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const n = initVertexBuffers(gl)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n)
})()
