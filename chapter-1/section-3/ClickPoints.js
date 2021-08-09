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

const g_points = []

const canvasClickEvent = (event, gl, canvas, a_Position) => {
  let x = event.clientX
  let y = event.clientY
  const rect = event.target.getBoundingClientRect()
  console.log(x, y)

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - y - rect.top) / (canvas.height / 2)

  g_points.push({ x, y })

  gl.clear(gl.COLOR_BUFFER_BIT)

  for (const point of g_points) {
    console.log(point)
    gl.vertexAttrib3f(a_Position, point.x, point.y, 0.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
}

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

  canvas.addEventListener("click", (event) =>
    canvasClickEvent(event, gl, canvas, a_Position)
  )

  // gl.vertexAttrib1f(a_Position, 0.5)

  // gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  // gl.drawArrays(gl.POINTS, 0, 1)
})()
