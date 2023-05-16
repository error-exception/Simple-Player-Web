import {Bindable} from "./Bindable";
import {Disposable} from "./Disposable";

export class Shader implements Bindable, Disposable {

    private readonly rendererId: WebGLProgram
    private uniformLocationCache: Record<string, WebGLUniformLocation | null> = {}
    private attributeLocationCache: Record<string, number> = {}

    constructor(
        private gl: WebGL2RenderingContext,
        vertexShader: string,
        fragmentShader: string
    ) {
        this.rendererId = createShader(gl, vertexShader, fragmentShader)
    }

    public bind() {
        this.gl.useProgram(this.rendererId)
    }

    public unbind() {
        this.gl.useProgram(null)
    }

    public dispose() {
        this.gl.deleteProgram(this.rendererId)
    }

    public setUniform1f(name: string, value: number) {
        this.gl.uniform1f(this.getUniformLocation(name), value)
    }

    public setUniform2fv(name: string, value: Float32Array) {
        this.gl.uniform2fv(this.getUniformLocation(name), value)
    }

    public setUniform3fv(name: string, value: Float32Array) {
        this.gl.uniform3fv(this.getUniformLocation(name), value)
    }

    public setUniform4fv(name: string, value: Float32Array) {
        this.gl.uniform4fv(this.getUniformLocation(name), value)
    }

    public setUniform1i(name: string, value: number) {
        this.gl.uniform1i(this.getUniformLocation(name), value)
    }

    public setUniform1iv(name: string, value: Int32List) {
        this.gl.uniform1iv(this.getUniformLocation(name), value)
    }

    public setUniformMatrix4fv(name: string, value: Float32Array) {
        this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value)
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {
        const gl = this.gl
        if (name in this.uniformLocationCache) {
            return this.uniformLocationCache[name]
        }
        const uniformLocation = gl.getUniformLocation(this.rendererId, name);
        if (!uniformLocation) {
            console.log('Warning: uniform', name, 'does not exist!')
        }
        this.uniformLocationCache[name] = uniformLocation
        return uniformLocation
    }

    public getAttributeLocation(name: string): number {
        if (name in this.attributeLocationCache) {
            return this.attributeLocationCache[name]
        }
        const location = this.gl.getAttribLocation(this.rendererId, name)
        if (location === -1) {
            console.log('Warning: attribute', name, 'does not exist!')
        }
        this.attributeLocationCache[name] = location
        return location
    }

}

function createShader(gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
    const program = gl.createProgram()
    if (!program) {
        throw new Error("create program error")
    }
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSrc)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.validateProgram(program)

    gl.deleteShader(vertex)
    gl.deleteShader(fragment)

    return program

}

function compileShader(gl: WebGL2RenderingContext, type: GLenum, source: string): WebGLShader {
    const shader = gl.createShader(type)
    if (!shader) {
        throw new Error("create shader error")
    }
    gl.shaderSource(shader, source)
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
