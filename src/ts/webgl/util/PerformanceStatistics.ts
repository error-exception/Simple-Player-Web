
interface PerformanceResult {
  frameTime: number;
  frameCountPerSec: number;
  drawCallsPerFrame: number;
}

export class PerformanceStatistics {

  /**
   * The time it took to render the last frame in milliseconds.
   */
  private static frameTime = 0;

  /**
   * The number of frames rendered per second.
   */
  private static frameCountPerSec = 0;

  /**
   * The number of draw calls per frame.
   */
  private static drawCallsPerFrame = 0;

  private static performanceResult: PerformanceResult = {
    drawCallsPerFrame: 0,
    frameCountPerSec: 0,
    frameTime: 0
  };

  public static getPerformanceResult(): PerformanceResult {
    return this.performanceResult;
  }

  public static recordGLDrawCall() {
    this.drawCallsPerFrame++;
  }

  private static beginFrameTime = 0;

  public static beginFrame() {
    this.beginFrameTime = performance.now();
  }

  public static endFrame() {
    const endFrameTime = performance.now();
    const frameTime = endFrameTime - this.beginFrameTime;
    this.frameTime = frameTime;
    this.frameCountPerSec = 1000 / frameTime;
    this.performanceResult.drawCallsPerFrame = this.drawCallsPerFrame;
    this.performanceResult.frameCountPerSec = this.frameCountPerSec;
    this.performanceResult.frameTime = this.frameTime;
    this.drawCallsPerFrame = 0;
  }

}