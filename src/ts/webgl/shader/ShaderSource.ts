import {
  ATTR_ALPHA,
  ATTR_COLOR,
  ATTR_POSITION,
  ATTR_TEXCOORD,
  UNI_ALPHA, UNI_BRIGHTNESS,
  UNI_COLOR,
  UNI_ORTH,
  UNI_SAMPLER,
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
      void main() {
          vec4 position = vec4(a_position, 0.0, 1.0) * ${UNI_ORTH};
          gl_Position = position;
          v_texcoord = ${ATTR_TEXCOORD};
      }
    `,
    fragment: `
      varying highp vec2 v_texcoord;
    
      uniform sampler2D ${UNI_SAMPLER};
      uniform mediump vec4 ${UNI_COLOR};
    
      void main() {
          mediump vec4 tex_color = texture2D(${UNI_SAMPLER}, v_texcoord);
          mediump vec4 out_color = vec4(tex_color.rgb / tex_color.a, tex_color.a) * ${UNI_COLOR};
          // out_color = out_color.rgba * ${UNI_COLOR}.rgba;
          gl_FragColor = out_color;
      }
    `
  }

  static StoryDefault: Source = {
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
    fragment: this.Default.fragment

  }

  /**
   * todo: 修复竖屏下的位置异常问题
   */
  static RoundClip: Source = {
    fragment: `
      varying mediump vec4 v_color;
      uniform mediump vec3 u_circle;
      uniform mediump vec2 u_resolution;
      uniform mediump float u_light;
      void main() {
          mediump float minLength = min(u_resolution.x, u_resolution.y);
          mediump vec2 coord = gl_FragCoord.xy / minLength;
          coord = vec2(coord.x, 1.0 - coord.y);
          mediump float dist = distance(u_circle.xy, coord);
          if (dist < u_circle.z) {
              lowp vec4 color = vec4(0.0);
              color.rgb = min(v_color.rgb + u_light, 1.0);
              color.a = v_color.a;
              gl_FragColor = color;
          } else {
              discard;
          }
      }
    `,
    vertex: `
      attribute vec2 ${ATTR_POSITION};
      attribute vec4 ${ATTR_COLOR};
      
      varying mediump vec4 v_color;
      
      uniform mat4 ${UNI_ORTH};
      // uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0);
          gl_Position = position * ${UNI_ORTH};
          v_color = ${ATTR_COLOR};
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
      // uniform mat4 ${UNI_TRANSFORM};
      void main() {
          vec4 position = vec4(${ATTR_POSITION}, 0.0, 1.0);
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

  static LegacyVisualizer: Source = {
    vertex: `
      attribute vec2 a_vertexPosition;
      attribute vec2 a_tex_coord;
      attribute float a_sampler_flag;
      
      varying lowp float v_sampler_flag;
      varying mediump vec2 v_tex_coord;
      
      uniform mat4 u_orth;
      
      void main() {
          vec4 coord = vec4(a_vertexPosition, 0.0, 1.0);
          v_sampler_flag = a_sampler_flag;
          v_tex_coord = a_tex_coord;
          gl_Position = coord * u_orth;
      }
    `,
    fragment: `
      uniform lowp float u_alpha;
      uniform sampler2D u_sampler_4;
      uniform sampler2D u_sampler_5;
      
      varying mediump vec2 v_tex_coord;
      varying lowp float v_sampler_flag;
      
      void main() {
          mediump vec4 texelColor = vec4(0.0);
          if (v_sampler_flag > 0.5) {
              texelColor = texture2D(u_sampler_4, v_tex_coord);
          } else {
              texelColor = texture2D(u_sampler_5, v_tex_coord);
          }
          
          texelColor.a = texelColor.a * u_alpha;
//          gl_FragColor = vec4(1.0, 1.0, 1.0, u_alpha);
          gl_FragColor = texelColor;
      }
    `
  }

  static BrightnessTexture: Source = {
    vertex: `
        attribute vec2 ${ATTR_POSITION};
        attribute vec2 ${ATTR_TEXCOORD};
    
        varying mediump vec2 v_tex_coord;
        uniform mat4 ${UNI_ORTH};
        void main() {
            gl_Position = vec4(${ATTR_POSITION}, 0.0, 1.0) * ${UNI_ORTH};
            v_tex_coord = ${ATTR_TEXCOORD};
        }
    `,
    fragment: `
        varying mediump vec2 v_tex_coord;
        uniform mediump float ${UNI_ALPHA};
        uniform sampler2D ${UNI_SAMPLER};
        uniform mediump float ${UNI_BRIGHTNESS};
    
        void main() {
            mediump vec4 texelColor = texture2D(${UNI_SAMPLER}, v_tex_coord);
            texelColor.rgb = min(texelColor.rgb * (1.0 + ${UNI_BRIGHTNESS}), 1.0);
            texelColor.a = texelColor.a * ${UNI_ALPHA};
            gl_FragColor = texelColor;
        }
    `
  }

}