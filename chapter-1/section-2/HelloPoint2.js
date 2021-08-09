const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
  }
`

const FSHADER_SOURCE = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`

void (function () {
  const canvas = document.querySelector("#webgl")

  const gl = canvas.getContext("webgl")

  console.log(gl)

  if (!gl) {
    console.log("Failed to get the rendering context for webgl")
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to init shaders")
    return
  }

  const a_Position = gl.getAttribLocation(gl.program, "a_Position")

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position")
    return
  }

  // gl.vertexAttrib3f(a_Position, 0.5, 0.0, 0.0)

  gl.vertexAttrib1f(a_Position, 0.5)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 1)
})()
