import {
  ATTR_ALPHA,
  ATTR_COLOR,
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_ALPHA,
  UNI_CIRCLE, UNI_COLOR,
  UNI_ORTH, UNI_SAMPLER,
  UNI_TRANSFORM
} from "./ShaderConstant";

interface Source {
  vertex: string
  fragment: string
}

export class ShaderSource {

  static Default: Source = {
    vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec2 ${ATTR_TEXCOORD};
      
      varying vec2 v_texcoord;
      
      uniform mat4 ${UNI_ORTH};
      uniform mat4 ${UNI_TRANSFORM};
      
      void main() {
          vec4 position = vec4(a_position, 0.0, 1.0) * ${UNI_TRANSFORM};
          gl_Position = position * ${UNI_ORTH};
          v_texcoord = ${ATTR_TEXCOORD};
      }
    `,
    fragment: `
      varying highp vec2 v_texcoord;
    
      uniform sampler2D ${UNI_SAMPLER};
      uniform mediump vec4 ${UNI_COLOR};
    
      void main() {
          mediump vec4 tex_color = texture2D(${UNI_SAMPLER}, v_texcoord);
          mediump vec4 out_color = vec4(tex_color.rgba * ${UNI_COLOR}.rgba);
          gl_FragColor = out_color;
      }
    `
  }

  static RoundClip: Source = {
    vertex: `
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
    `,
    fragment: `
      varying mediump vec4 v_color;
      uniform mediump vec3 ${UNI_CIRCLE};
      uniform mediump float u_light;
      void main() {
          lowp float dist = distance(${UNI_CIRCLE}.xy, gl_FragCoord.xy);
          if (dist < ${UNI_CIRCLE}.z) {
              mediump vec4 color = vec4(0.0);
              color.rgb = min(v_color.rgb + u_light, 1.0);
              color.a = v_color.a;
              gl_FragColor = color;
          } else {
              discard;
          }
      }
    `
  }

  static Simple: Source = {
    vertex: `
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
    `,
    fragment: `
      varying mediump vec4 v_color;
      uniform mediump float ${UNI_ALPHA};
      void main() {
          mediump vec4 color = vec4(v_color);
          color.a = color.a * ${UNI_ALPHA};
          gl_FragColor = color;
      }
    `
  }

  static White: Source = {
    vertex: `
      attribute vec2 ${ATTR_POSITION};
      uniform mat4 ${UNI_ORTH};
      uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 coord = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_TRANSFORM};
          gl_Position = coord * ${UNI_ORTH};
      }
    `,
    fragment: `
      uniform lowp float ${UNI_ALPHA};
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, ${UNI_ALPHA});
      }
    `
  }

  static AlphaTexture: Source = {
    vertex: `
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
    `,
    fragment: `
      varying mediump float v_alpha;
      varying mediump vec2 v_tex_coord;
      uniform sampler2D ${UNI_SAMPLER};
  
      void main() {
          mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
          texelColor.a = texelColor.a * v_alpha;
          gl_FragColor = texelColor;
      }
    `
  }

}