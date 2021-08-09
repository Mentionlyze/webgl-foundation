const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
    gl_Position = a_Position;
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

const g_points = []
const g_colors = []

const canvasClickEvent = (event, gl, canvas, a_Position, u_FragColor) => {
  let x = event.clientX
  let y = event.clientY
  const rect = event.target.getBoundingClientRect()

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2)
  y = (canvas.height / 2 - y - rect.top) / (canvas.height / 2)

  g_points.push({ x, y })

  if (x >= 0 && y >= 0) {
    g_colors.push([1.0, 0.0, 0.0, 1.0])
  } else if (x < 0 && y < 0) {
    g_colors.push([0.0, 1.0, 0.0, 1.0])
  } else {
    g_colors.push([1.0, 1.0, 1.0, 1.0])
  }

  gl.clear(gl.COLOR_BUFFER_BIT)

  for (let i = 0; i < g_points.length; i++) {
    const { x, y } = g_points[i]
    const [r, g, b, a] = g_colors[i]
    gl.vertexAttrib3f(a_Position, x, y, 0.0)
    gl.uniform4f(u_FragColor, r, g, b, a)
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

  const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor")

  if (a_Position < 0) {
    console.log("Failed to get the storage location of a_Position")
    return
  }

  canvas.addEventListener("click", (event) =>
    canvasClickEvent(event, gl, canvas, a_Position, u_FragColor)
  )

  // gl.vertexAttrib1f(a_Position, 0.5)

  // gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  gl.clear(gl.COLOR_BUFFER_BIT)

  // gl.drawArrays(gl.POINTS, 0, 1)
})()
