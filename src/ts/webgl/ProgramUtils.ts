export function compileShader(gl: WebGL2RenderingContext, type: number, shaderText: string) {
    const shader = gl.createShader(type)
    if (!shader) {
        return null
    }
    gl.shaderSource(shader, shaderText)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `Error compiling ${
                type === gl.VERTEX_SHADER ? "vertex" : "fragment"
            } shader:`
        );
        console.log(gl.getShaderInfoLog(shader));
    }
    return shader
}

export function buildShaderProgram(gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) {
    const program = gl.createProgram();
    if (!program) {
        console.log('create program failed')
        return null
    }
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
    if (!vertex) {
        console.log('compile vertex failed')
        return null
    }
    gl.attachShader(program, vertex)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!fragment) {
        console.log('compile fragment failed')
        return null
    }
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shader program:");
        console.log(gl.getProgramInfoLog(program));
    }
    return program
}
