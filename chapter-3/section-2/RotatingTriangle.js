const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  void main() {
    gl_Position = u_ModelMatrix * a_Position;
  }
`
const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`
function initVertexBuffers(gl) {
  const n = 3
  const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5])
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

const ANGLE = 45.0
let g_last = Date.now()

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
  modelMatrix.setRotate(currentAngle, 0, 0, 1)
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, n)
}

function animate(angle) {
  const now = Date.now()
  const elapsed = now - g_last
  g_last = now

  const newAngle = angle + (ANGLE * elapsed) / 1000.0
  return newAngle % 360
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
  const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix")
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  let currentAngle = 0.0
  const modelMatrix = new Matrix4()

  const tick = () => {
    currentAngle = animate(currentAngle)
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
    requestAnimationFrame(tick)
  }
  tick()
})()
