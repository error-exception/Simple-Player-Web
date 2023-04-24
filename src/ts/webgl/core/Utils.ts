export function glCall(gl: WebGL2RenderingContext, func: () => void) {
    while (gl.getError() != gl.NO_ERROR) {}
    let error: GLenum
    func()
    while ((error = gl.getError()) != gl.NO_ERROR) {
        console.log("[WebGL Error] (", error, "):", func)
        return false
    }
    return true
}

export function isUndef(v: any | undefined): v is undefined {
    return typeof v === 'undefined'
}