import {Shader} from "../core/Shader";
import {ATTR_POSITION, ATTR_TEXCOORD, UNI_ALPHA, UNI_ORTH, UNI_SAMPLER, UNI_TRANSFORM} from "./ShaderConstant";
import {Disposable} from "../core/Disposable";
import {Nullable} from "../../type";
import {VertexBufferLayout} from "../core/VertexBufferLayout";
import {BaseShader} from "./BaseShader";

class StaticTextureShader extends BaseShader implements Disposable {

    protected vertex = `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 ${UNI_ORTH};
        uniform mat4 ${UNI_TRANSFORM};
        void main() {
            vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
            gl_Position = position * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
        }
    `
    protected fragment = `
        varying mediump vec2 v_tex_coord;
        uniform mediump float ${UNI_ALPHA};
        uniform sampler2D ${UNI_SAMPLER};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.a = texelColor.a * ${UNI_ALPHA};
            gl_FragColor = texelColor;
        }
    `

    protected shader: Nullable<Shader> = null
    protected layout: Nullable<VertexBufferLayout> = null

    public newShader(gl: WebGL2RenderingContext) {
        return new Shader(gl, this.vertex, this.fragment)
    }

    public getShader(gl: WebGL2RenderingContext) {
        if (this.shader === null) {
            const shader = new Shader(gl, this.vertex, this.fragment)
            const layout = new VertexBufferLayout(gl)
            shader.bind()
            layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
            layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
            shader.unbind()
            this.shader = shader
            this.layout = layout
        }
        return this.shader
    }

    public getLayout(): VertexBufferLayout {
        return this.layout!
    }

    public dispose() {
        this.shader?.dispose()
        this.shader = null
        this.layout = null
    }

}

export default new StaticTextureShader()