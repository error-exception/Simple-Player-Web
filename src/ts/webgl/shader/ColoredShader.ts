import {Shader} from "../core/Shader";
import {ATTR_COLOR, ATTR_POSITION, UNI_ALPHA, UNI_ORTH, UNI_TRANSFORM} from "./ShaderConstant";
import {Disposable} from "../core/Disposable";
import {Nullable} from "../../type";
import {VertexBufferLayout} from "../core/VertexBufferLayout";

class ColoredShader implements Disposable {

    private vertex = `
        attribute vec2 ${ATTR_POSITION};
        attribute vec4 ${ATTR_COLOR};

        varying mediump vec4 v_color;
        uniform mat4 ${UNI_ORTH};
        uniform mat4 ${UNI_TRANSFORM};
        void main() {
            vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
            gl_Position = position * ${UNI_ORTH};
            v_color = ${ATTR_COLOR};
        }
    `
    private fragment = `
        varying mediump vec4 v_color;
        uniform mediump float ${UNI_ALPHA};
        void main() {
            mediump vec4 color = vec4(v_color);
            color.a = color.a * ${UNI_ALPHA};
            gl_FragColor = color;
        }
    `

    private shader: Nullable<Shader> = null
    private layout: Nullable<VertexBufferLayout> = null

    public getShader(gl: WebGL2RenderingContext): Shader {
        if (this.shader === null) {
            const shader = new Shader(gl, this.vertex, this.fragment)
            const layout = new VertexBufferLayout(gl)
            shader.bind()
            layout.pushFloat(shader.getAttributeLocation(ATTR_POSITION), 2)
            layout.pushFloat(shader.getAttributeLocation(ATTR_COLOR), 4)
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

export default new ColoredShader()