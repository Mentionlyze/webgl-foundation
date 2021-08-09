const VSHADER_SOURCE = `
  void main() {
    gl_Position = vec4(0.5, 0.0, 0.0, 1.0);
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

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.drawArrays(gl.POINTS, 0, 1)
})()
