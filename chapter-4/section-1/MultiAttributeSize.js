const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute float a_PointSize;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function initVertexBuffers(gl) {
  const verticesSizes = new Float32Array([
    0.0, 0.5, 10.0, -0.5, -0.5, 20.0, 0.5, -0.5, 30.0,
  ])
  const n = 3

  const vertexSizeBuffer = gl.createBuffer()

  if (!vertexSizeBuffer) {
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW)

  const FSIZE = verticesSizes.BYTES_PER_ELEMENT

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    return -1
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0)
  gl.enableVertexAttribArray(a_Position)

  const a_PointSize = gl.getAttribLocation(gl.program, "a_PointSize")
  if (a_PointSize < 0) {
    return -1
  }

  gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2)
  gl.enableVertexAttribArray(a_PointSize)

  return n
}
void (function main() {
  const canvas = document.querySelector("#webgl")
  const gl = getWebGLContext(canvas)

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    return
  }

  const n = initVertexBuffers(gl)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.POINT, 0, n)
})()
