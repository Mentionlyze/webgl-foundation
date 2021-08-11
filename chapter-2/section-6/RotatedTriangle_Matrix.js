const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_xformMatrix;
  void main() {
    gl_Position = u_xformMatrix * a_Position;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

function initVertexBuffers(gl) {
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
  const n = 3

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    return -1
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")
  if (a_Position < 0) {
    return -1
  }

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(a_Position)

  return n
}

const ANGLE = 90

const type = "rotate1"

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

  console.log(n)

  const radian = (Math.PI * ANGLE) / 180
  const cosB = Math.cos(radian),
    sinB = Math.sin(radian)

  const rotateMatrix = new Float32Array([
    cosB,
    sinB,
    0.0,
    0.0,
    -sinB,
    cosB,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.3,
    0.3,
    0.0,
    1.0,
  ])

  const translateMatrix = new Float32Array([
    1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.3, 0.3, 0.0,
    1.0,
  ])

  const scaleMatrix = new Float32Array([
    0.5, 0.0, 0.0, 0.0, 0.0, 1.5, 0.0, 0.0, 0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0,
    1.0,
  ])

  const xformMatrix =
    type === "rotate"
      ? rotateMatrix
      : type === "translate"
      ? translateMatrix
      : scaleMatrix

  const u_xformMatrix = gl.getUniformLocation(gl.program, "u_xformMatrix")
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n)
})()
