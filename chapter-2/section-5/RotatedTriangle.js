const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_CosB, u_SinB;
  void main() {
    gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;
    gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;
    gl_Position.z = a_Position.z;
    gl_Position.w = 1.0;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

const ANGLE = 120.0

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

  const radian = (Math.PI * ANGLE) / 180
  const sinB = Math.sin(radian)
  const cosB = Math.cos(radian)

  const u_SinB = gl.getUniformLocation(gl.program, "u_SinB")
  const u_CosB = gl.getUniformLocation(gl.program, "u_CosB")

  gl.uniform1f(u_SinB, sinB)
  gl.uniform1f(u_CosB, cosB)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.TRIANGLES, 0, n)
})()
