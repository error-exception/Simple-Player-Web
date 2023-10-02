import {Shader} from "./core/Shader";

interface ShaderSource {
    vertex: string,
    fragment: string
}

const coloredShaderSource: ShaderSource = {
    vertex: `
        attribute vec2 a_position;
        attribute vec4 a_color;

        varying mediump vec4 v_color;
        uniform mat4 u_orth;
        uniform mat4 u_transform;
        void main() {
            vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
            gl_Position = position * u_orth;
            v_color = a_color;
        }
    `,
    fragment: `
        varying mediump vec4 v_color;
        uniform mediump float u_alpha;
        void main() {
            mediump vec4 color = vec4(v_color);
            color.a = color.a * u_alpha;
            gl_FragColor = color;
        }
    `
}

const textureShaderSource: ShaderSource = {
    vertex: `
        attribute vec2 a_position;
        attribute vec2 a_tex_coord;
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 u_orth;
        uniform mat4 u_transform;
        void main() {
            vec4 position = vec4(a_position, 0.0, 1.0) * u_transform;
            gl_Position = position * u_orth;
            v_tex_coord = a_tex_coord;
        }
    `,
    fragment: `
        varying mediump vec2 v_tex_coord;
        uniform mediump float u_alpha;
        uniform sampler2D u_sampler;
    
        void main() {
            mediump vec4 texelColor = texture2D(u_sampler, v_tex_coord);
            texelColor.a = texelColor.a * u_alpha;
            gl_FragColor = texelColor;
        }
    `
}

class ShaderManager {

    
    private gl: WebGL2RenderingContext | null = null


    public init(gl: WebGL2RenderingContext) {
        this.gl = gl;
        // this.simpleShader = new Shader(
        //     gl,
        //     shaderSource.simple.vertex,
        //     shaderSource.simple.fragment
        // )
        // this.simpleTextureShader = new Shader(
        //     gl,
        //     shaderSource.normalTexture.vertex,
        //     shaderSource.normalTexture.fragment
        // )
        // this.normalTextureShader = new Shader(
        //     gl,
        //     shaderSource.normalTexture.vertex,
        //     shaderSource.normalTexture.fragment
        // )
        // this.normalShader = new Shader(
        //     gl,
        //     shaderSource.normal.vertex,
        //     shaderSource.normal.fragment
        // )
    }

    public newColoredShader() {
        return new Shader(this.gl!, coloredShaderSource.vertex, coloredShaderSource.fragment)
    }

    public newTextureShader() {
        return new Shader(this.gl!, textureShaderSource.vertex, textureShaderSource.fragment)
    }
}

export default new ShaderManager()