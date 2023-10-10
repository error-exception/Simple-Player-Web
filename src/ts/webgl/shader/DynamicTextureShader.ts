import {Disposable} from "../core/Disposable";
import {
    ATTR_ALPHA,
    ATTR_POSITION,
    ATTR_TEXCOORD,
    UNI_ORTH,
    UNI_SAMPLER,
    UNI_TRANSFORM
} from "./ShaderConstant";
import {Nullable} from "../../type";
import {Shader} from "../core/Shader";
import {VertexBufferLayout} from "../core/VertexBufferLayout";

class DynamicTextureShader implements Disposable {
    private vertex = `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
        attribute float ${ATTR_ALPHA};
    
        varying mediump vec2 v_tex_coord;
        varying mediump float v_alpha;
        uniform mat4 ${UNI_ORTH};
        uniform mat4 ${UNI_TRANSFORM};
        void main() {
            vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
            gl_Position = position * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
            v_alpha = ${ATTR_ALPHA};
        }
    `
    private fragment = `
        varying mediump float v_alpha;
        varying mediump vec2 v_tex_coord;
        uniform sampler2D ${UNI_SAMPLER};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.a = texelColor.a * v_alpha;
            gl_FragColor = texelColor;
        }
    `

    private shader: Nullable<Shader> = null
    private layout: Nullable<VertexBufferLayout> = null

    public getShader(gl: WebGL2RenderingContext) {
        if (this.shader === null) {
            const shader = new Shader(gl, this.vertex, this.fragment)
            const layout = new VertexBufferLayout(gl)
            shader.bind()
            layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
            layout.pushFloat(shader.getAttributeLocation(ATTR_TEXCOORD), 2)
            layout.pushFloat(shader.getAttributeLocation(ATTR_ALPHA), 1)
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

export default new DynamicTextureShader()