/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Matrix math utilities. These methods operate on OpenGL ES format
 * matrices and vectors stored in float arrays.
 * <p>
 * Matrices are 4 x 4 column-vector matrices stored in column-major
 * order:
 * <pre>
 *  m[offset +  0] m[offset +  4] m[offset +  8] m[offset + 12]
 *  m[offset +  1] m[offset +  5] m[offset +  9] m[offset + 13]
 *  m[offset +  2] m[offset +  6] m[offset + 10] m[offset + 14]
 *  m[offset +  3] m[offset +  7] m[offset + 11] m[offset + 15]</pre>
 *
 * Vectors are 4 x 1 column vectors stored in order:
 * <pre>
 * v[offset + 0]
 * v[offset + 1]
 * v[offset + 2]
 * v[offset + 3]</pre>
 */
export class Matrix {

//   /** Temporary memory for operations that need temporary matrix data. */
//   private static final ThreadLocal<float[]> ThreadTmp = new ThreadLocal() {
//   @Override protected float[] initialValue() {
//     return new float[32];
//   }
// };

  private static ThreadTmp: number[] | Float32Array = new Array(32)

  private static overlap(
    a: number[] | Float32Array, aStart: number, aLength: number, b: number[] | Float32Array, bStart: number, bLength: number): boolean {
    if (a != b) {
      return false;
    }

    if (aStart == bStart) {
      return true;
    }

    const aEnd = aStart + aLength;
    const bEnd = bStart + bLength;

    if (aEnd == bEnd) {
      return true;
    }

    if (aStart < bStart && bStart < aEnd) {
      return true;
    }
    if (aStart < bEnd && bEnd < aEnd) {
      return true;
    }

    if (bStart < aStart && aStart < bEnd) {
      return true;
    }
    if (bStart < aEnd && aEnd < bEnd) {
      return true;
    }

    return false;
  }

  /**
   * Multiplies two 4x4 matrices together and stores the result in a third 4x4
   * matrix. In matrix notation: result = lhs x rhs. Due to the way
   * matrix multiplication works, the result matrix will have the same
   * effect as first multiplying by the rhs matrix, then multiplying by
   * the lhs matrix. This is the opposite of what you might expect.
   * <p>
   * The same float array may be passed for result, lhs, and/or rhs. This
   * operation is expected to do the correct thing if the result elements
   * overlap with either of the lhs or rhs elements.
   *
   * @param result The float array that holds the result.
   * @param resultOffset The offset into the result array where the result is
   *        stored.
   * @param lhs The float array that holds the left-hand-side matrix.
   * @param lhsOffset The offset into the lhs array where the lhs is stored
   * @param rhs The float array that holds the right-hand-side matrix.
   * @param rhsOffset The offset into the rhs array where the rhs is stored.
   *
   * @throws IllegalArgumentException under any of the following conditions:
   * result, lhs, or rhs are null;
   * resultOffset + 16 > result.length
   * or lhsOffset + 16 > lhs.length
   * or rhsOffset + 16 > rhs.length;
   * resultOffset < 0 or lhsOffset < 0 or rhsOffset < 0
   */
  public static multiplyMM(
    result: number[] | Float32Array, resultOffset: number,
    lhs: number[] | Float32Array, lhsOffset: number, rhs: number[] | Float32Array, rhsOffset: number
  ) {
    // error checking
    if (result == null) {
      throw new Error("result == null");
    }
    if (lhs == null) {
      throw new Error("lhs == null");
    }
    if (rhs == null) {
      throw new Error("rhs == null");
    }
    if (resultOffset < 0) {
      throw new Error("resultOffset < 0");
    }
    if (lhsOffset < 0) {
      throw new Error("lhsOffset < 0");
    }
    if (rhsOffset < 0) {
      throw new Error("rhsOffset < 0");
    }
    if (result.length < resultOffset + 16) {
      throw new Error("result.length < resultOffset + 16");
    }
    if (lhs.length < lhsOffset + 16) {
      throw new Error("lhs.length < lhsOffset + 16");
    }
    if (rhs.length < rhsOffset + 16) {
      throw new Error("rhs.length < rhsOffset + 16");
    }

    // Check for overlap between rhs and result or lhs and result
    if (this.overlap(result, resultOffset, 16, lhs, lhsOffset, 16)
      || this.overlap(result, resultOffset, 16, rhs, rhsOffset, 16)) {
      const tmp = this.ThreadTmp;
      for (let i = 0; i < 4; i++) {
        const rhs_i0 = rhs[4 * i + 0 + rhsOffset];
        let ri0 = lhs[0 + lhsOffset] * rhs_i0;
        let ri1 = lhs[1 + lhsOffset] * rhs_i0;
        let ri2 = lhs[2 + lhsOffset] * rhs_i0;
        let ri3 = lhs[3 + lhsOffset] * rhs_i0;
        for (let j = 1; j < 4; j++) {
          const rhs_ij = rhs[4 * i + j + rhsOffset];
          ri0 += lhs[4 * j + 0 + lhsOffset] * rhs_ij;
          ri1 += lhs[4 * j + 1 + lhsOffset] * rhs_ij;
          ri2 += lhs[4 * j + 2 + lhsOffset] * rhs_ij;
          ri3 += lhs[4 * j + 3 + lhsOffset] * rhs_ij;
        }
        tmp[4 * i + 0] = ri0;
        tmp[4 * i + 1] = ri1;
        tmp[4 * i + 2] = ri2;
        tmp[4 * i + 3] = ri3;
      }

      // copy from tmp to result
      for (let i = 0; i < 16; i++) {
        result[i + resultOffset] = tmp[i];
      }

    } else {
      for (let i = 0; i < 4; i++) {
        const rhs_i0 = rhs[4 * i + 0 + rhsOffset];
        let ri0 = lhs[0 + lhsOffset] * rhs_i0;
        let ri1 = lhs[1 + lhsOffset] * rhs_i0;
        let ri2 = lhs[2 + lhsOffset] * rhs_i0;
        let ri3 = lhs[3 + lhsOffset] * rhs_i0;
        for (let j = 1; j < 4; j++) {
          const rhs_ij = rhs[4 * i + j + rhsOffset];
          ri0 += lhs[4 * j + 0 + lhsOffset] * rhs_ij;
          ri1 += lhs[4 * j + 1 + lhsOffset] * rhs_ij;
          ri2 += lhs[4 * j + 2 + lhsOffset] * rhs_ij;
          ri3 += lhs[4 * j + 3 + lhsOffset] * rhs_ij;
        }
        result[4 * i + 0 + resultOffset] = ri0;
        result[4 * i + 1 + resultOffset] = ri1;
        result[4 * i + 2 + resultOffset] = ri2;
        result[4 * i + 3 + resultOffset] = ri3;
      }
    }
  }

  /**
   * Multiplies a 4 element vector by a 4x4 matrix and stores the result in a
   * 4-element column vector. In matrix notation: result = lhs x rhs
   * <p>
   * The same float array may be passed for resultVec, lhsMat, and/or rhsVec.
   * This operation is expected to do the correct thing if the result elements
   * overlap with either of the lhs or rhs elements.
   *
   * @param resultVec The float array that holds the result vector.
   * @param resultVecOffset The offset into the result array where the result
   *        vector is stored.
   * @param lhsMat The float array that holds the left-hand-side matrix.
   * @param lhsMatOffset The offset into the lhs array where the lhs is stored
   * @param rhsVec The float array that holds the right-hand-side vector.
   * @param rhsVecOffset The offset into the rhs vector where the rhs vector
   *        is stored.
   *
   * @throws IllegalArgumentException under any of the following conditions:
   * resultVec, lhsMat, or rhsVec are null;
   * resultVecOffset + 4  > resultVec.length
   * or lhsMatOffset + 16 > lhsMat.length
   * or rhsVecOffset + 4  > rhsVec.length;
   * resultVecOffset < 0 or lhsMatOffset < 0 or rhsVecOffset < 0
   */
  public static multiplyMV(
    resultVec: number[] | Float32Array, resultVecOffset: number,
    lhsMat: number[] | Float32Array, lhsMatOffset: number,
    rhsVec: number[] | Float32Array, rhsVecOffset: number
  ) {
    // error checking
    if (resultVec == null) {
      throw new Error("resultVec == null");
    }
    if (lhsMat == null) {
      throw new Error("lhsMat == null");
    }
    if (rhsVec == null) {
      throw new Error("rhsVec == null");
    }
    if (resultVecOffset < 0) {
      throw new Error("resultVecOffset < 0");
    }
    if (lhsMatOffset < 0) {
      throw new Error("lhsMatOffset < 0");
    }
    if (rhsVecOffset < 0) {
      throw new Error("rhsVecOffset < 0");
    }
    if (resultVec.length < resultVecOffset + 4) {
      throw new Error("resultVec.length < resultVecOffset + 4");
    }
    if (lhsMat.length < lhsMatOffset + 16) {
      throw new Error("lhsMat.length < lhsMatOffset + 16");
    }
    if (rhsVec.length < rhsVecOffset + 4) {
      throw new Error("rhsVec.length < rhsVecOffset + 4");
    }

    const tmp0 = lhsMat[0 + 4 * 0 + lhsMatOffset] * rhsVec[0 + rhsVecOffset] +
      lhsMat[0 + 4 * 1 + lhsMatOffset] * rhsVec[1 + rhsVecOffset] +
      lhsMat[0 + 4 * 2 + lhsMatOffset] * rhsVec[2 + rhsVecOffset] +
      lhsMat[0 + 4 * 3 + lhsMatOffset] * rhsVec[3 + rhsVecOffset];
    const tmp1 = lhsMat[1 + 4 * 0 + lhsMatOffset] * rhsVec[0 + rhsVecOffset] +
      lhsMat[1 + 4 * 1 + lhsMatOffset] * rhsVec[1 + rhsVecOffset] +
      lhsMat[1 + 4 * 2 + lhsMatOffset] * rhsVec[2 + rhsVecOffset] +
      lhsMat[1 + 4 * 3 + lhsMatOffset] * rhsVec[3 + rhsVecOffset];
    const tmp2 = lhsMat[2 + 4 * 0 + lhsMatOffset] * rhsVec[0 + rhsVecOffset] +
      lhsMat[2 + 4 * 1 + lhsMatOffset] * rhsVec[1 + rhsVecOffset] +
      lhsMat[2 + 4 * 2 + lhsMatOffset] * rhsVec[2 + rhsVecOffset] +
      lhsMat[2 + 4 * 3 + lhsMatOffset] * rhsVec[3 + rhsVecOffset];
    const tmp3 = lhsMat[3 + 4 * 0 + lhsMatOffset] * rhsVec[0 + rhsVecOffset] +
      lhsMat[3 + 4 * 1 + lhsMatOffset] * rhsVec[1 + rhsVecOffset] +
      lhsMat[3 + 4 * 2 + lhsMatOffset] * rhsVec[2 + rhsVecOffset] +
      lhsMat[3 + 4 * 3 + lhsMatOffset] * rhsVec[3 + rhsVecOffset];

    resultVec[0 + resultVecOffset] = tmp0;
    resultVec[1 + resultVecOffset] = tmp1;
    resultVec[2 + resultVecOffset] = tmp2;
    resultVec[3 + resultVecOffset] = tmp3;
  }

  /**
   * Transposes a 4 x 4 matrix.
   * <p>
   * mTrans and m must not overlap.
   *
   * @param mTrans the array that holds the output transposed matrix
   * @param mTransOffset an offset into mTrans where the transposed matrix is
   *        stored.
   * @param m the input array
   * @param mOffset an offset into m where the input matrix is stored.
   */
  public static transposeM(
    mTrans: number[] | Float32Array, mTransOffset: number, m: number[] | Float32Array,
    mOffset: number
  ) {
    for (let i = 0; i < 4; i++) {
      const mBase = i * 4 + mOffset;
      mTrans[i + mTransOffset] = m[mBase];
      mTrans[i + 4 + mTransOffset] = m[mBase + 1];
      mTrans[i + 8 + mTransOffset] = m[mBase + 2];
      mTrans[i + 12 + mTransOffset] = m[mBase + 3];
    }
  }

  /**
   * Inverts a 4 x 4 matrix.
   * <p>
   * mInv and m must not overlap.
   *
   * @param mInv the array that holds the output inverted matrix
   * @param mInvOffset an offset into mInv where the inverted matrix is
   *        stored.
   * @param m the input array
   * @param mOffset an offset into m where the input matrix is stored.
   * @return true if the matrix could be inverted, false if it could not.
   */
  public static invertM(mInv: number[] | Float32Array, mInvOffset: number, m: number[] | Float32Array,
                        mOffset: number) {
    // Invert a 4 x 4 matrix using Cramer's Rule

    // transpose matrix
    const src0 = m[mOffset + 0];
    const src4 = m[mOffset + 1];
    const src8 = m[mOffset + 2];
    const src12 = m[mOffset + 3];

    const src1 = m[mOffset + 4];
    const src5 = m[mOffset + 5];
    const src9 = m[mOffset + 6];
    const src13 = m[mOffset + 7];

    const src2 = m[mOffset + 8];
    const src6 = m[mOffset + 9];
    const src10 = m[mOffset + 10];
    const src14 = m[mOffset + 11];

    const src3 = m[mOffset + 12];
    const src7 = m[mOffset + 13];
    const src11 = m[mOffset + 14];
    const src15 = m[mOffset + 15];

    // calculate pairs for first 8 elements (cofactors)
    const atmp0 = src10 * src15;
    const atmp1 = src11 * src14;
    const atmp2 = src9 * src15;
    const atmp3 = src11 * src13;
    const atmp4 = src9 * src14;
    const atmp5 = src10 * src13;
    const atmp6 = src8 * src15;
    const atmp7 = src11 * src12;
    const atmp8 = src8 * src14;
    const atmp9 = src10 * src12;
    const atmp10 = src8 * src13;
    const atmp11 = src9 * src12;

    // calculate first 8 elements (cofactors)
    const dst0 = (atmp0 * src5 + atmp3 * src6 + atmp4 * src7)
      - (atmp1 * src5 + atmp2 * src6 + atmp5 * src7);
    const dst1 = (atmp1 * src4 + atmp6 * src6 + atmp9 * src7)
      - (atmp0 * src4 + atmp7 * src6 + atmp8 * src7);
    const dst2 = (atmp2 * src4 + atmp7 * src5 + atmp10 * src7)
      - (atmp3 * src4 + atmp6 * src5 + atmp11 * src7);
    const dst3 = (atmp5 * src4 + atmp8 * src5 + atmp11 * src6)
      - (atmp4 * src4 + atmp9 * src5 + atmp10 * src6);
    const dst4 = (atmp1 * src1 + atmp2 * src2 + atmp5 * src3)
      - (atmp0 * src1 + atmp3 * src2 + atmp4 * src3);
    const dst5 = (atmp0 * src0 + atmp7 * src2 + atmp8 * src3)
      - (atmp1 * src0 + atmp6 * src2 + atmp9 * src3);
    const dst6 = (atmp3 * src0 + atmp6 * src1 + atmp11 * src3)
      - (atmp2 * src0 + atmp7 * src1 + atmp10 * src3);
    const dst7 = (atmp4 * src0 + atmp9 * src1 + atmp10 * src2)
      - (atmp5 * src0 + atmp8 * src1 + atmp11 * src2);

    // calculate pairs for second 8 elements (cofactors)
    const btmp0 = src2 * src7;
    const btmp1 = src3 * src6;
    const btmp2 = src1 * src7;
    const btmp3 = src3 * src5;
    const btmp4 = src1 * src6;
    const btmp5 = src2 * src5;
    const btmp6 = src0 * src7;
    const btmp7 = src3 * src4;
    const btmp8 = src0 * src6;
    const btmp9 = src2 * src4;
    const btmp10 = src0 * src5;
    const btmp11 = src1 * src4;

    // calculate second 8 elements (cofactors)
    const dst8 = (btmp0 * src13 + btmp3 * src14 + btmp4 * src15)
      - (btmp1 * src13 + btmp2 * src14 + btmp5 * src15);
    const dst9 = (btmp1 * src12 + btmp6 * src14 + btmp9 * src15)
      - (btmp0 * src12 + btmp7 * src14 + btmp8 * src15);
    const dst10 = (btmp2 * src12 + btmp7 * src13 + btmp10 * src15)
      - (btmp3 * src12 + btmp6 * src13 + btmp11 * src15);
    const dst11 = (btmp5 * src12 + btmp8 * src13 + btmp11 * src14)
      - (btmp4 * src12 + btmp9 * src13 + btmp10 * src14);
    const dst12 = (btmp2 * src10 + btmp5 * src11 + btmp1 * src9)
      - (btmp4 * src11 + btmp0 * src9 + btmp3 * src10);
    const dst13 = (btmp8 * src11 + btmp0 * src8 + btmp7 * src10)
      - (btmp6 * src10 + btmp9 * src11 + btmp1 * src8);
    const dst14 = (btmp6 * src9 + btmp11 * src11 + btmp3 * src8)
      - (btmp10 * src11 + btmp2 * src8 + btmp7 * src9);
    const dst15 = (btmp10 * src10 + btmp4 * src8 + btmp9 * src9)
      - (btmp8 * src9 + btmp11 * src10 + btmp5 * src8);

    // calculate determinant
    const det =
      src0 * dst0 + src1 * dst1 + src2 * dst2 + src3 * dst3;

    if (det == 0.0) {
      return false;
    }

    // calculate matrix inverse
    const invdet = 1.0 / det;
    mInv[mInvOffset] = dst0 * invdet;
    mInv[1 + mInvOffset] = dst1 * invdet;
    mInv[2 + mInvOffset] = dst2 * invdet;
    mInv[3 + mInvOffset] = dst3 * invdet;

    mInv[4 + mInvOffset] = dst4 * invdet;
    mInv[5 + mInvOffset] = dst5 * invdet;
    mInv[6 + mInvOffset] = dst6 * invdet;
    mInv[7 + mInvOffset] = dst7 * invdet;

    mInv[8 + mInvOffset] = dst8 * invdet;
    mInv[9 + mInvOffset] = dst9 * invdet;
    mInv[10 + mInvOffset] = dst10 * invdet;
    mInv[11 + mInvOffset] = dst11 * invdet;

    mInv[12 + mInvOffset] = dst12 * invdet;
    mInv[13 + mInvOffset] = dst13 * invdet;
    mInv[14 + mInvOffset] = dst14 * invdet;
    mInv[15 + mInvOffset] = dst15 * invdet;

    return true;
  }

  /**
   * Computes an orthographic projection matrix.
   *
   * @param m returns the result
   * @param mOffset
   * @param left
   * @param right
   * @param bottom
   * @param top
   * @param near
   * @param far
   */
  public static orthoM(
    m: number[] | Float32Array, mOffset: number,
    left: number, right: number, bottom: number, top: number,
    near: number, far: number
  ) {
    if (left == right) {
      throw new Error("left == right");
    }
    if (bottom == top) {
      throw new Error("bottom == top");
    }
    if (near == far) {
      throw new Error("near == far");
    }

    const r_width = 1.0 / (right - left);
    const r_height = 1.0 / (top - bottom);
    const r_depth = 1.0 / (far - near);
    const x = 2.0 * (r_width);
    const y = 2.0 * (r_height);
    const z = -2.0 * (r_depth);
    const tx = -(right + left) * r_width;
    const ty = -(top + bottom) * r_height;
    const tz = -(far + near) * r_depth;
    m[mOffset + 0] = x;
    m[mOffset + 5] = y;
    m[mOffset + 10] = z;
    m[mOffset + 12] = tx;
    m[mOffset + 13] = ty;
    m[mOffset + 14] = tz;
    m[mOffset + 15] = 1.0;
    m[mOffset + 1] = 0.0;
    m[mOffset + 2] = 0.0;
    m[mOffset + 3] = 0.0;
    m[mOffset + 4] = 0.0;
    m[mOffset + 6] = 0.0;
    m[mOffset + 7] = 0.0;
    m[mOffset + 8] = 0.0;
    m[mOffset + 9] = 0.0;
    m[mOffset + 11] = 0.0;
  }


  /**
   * Defines a projection matrix in terms of six clip planes.
   *
   * @param m the float array that holds the output perspective matrix
   * @param offset the offset into float array m where the perspective
   *        matrix data is written
   * @param left
   * @param right
   * @param bottom
   * @param top
   * @param near
   * @param far
   */
  public static frustumM(
    m: number[] | Float32Array, offset: number,
    left: number, right: number, bottom: number, top: number,
    near: number, far: number
  ) {
    if (left == right) {
      throw new Error("left == right");
    }
    if (top == bottom) {
      throw new Error("top == bottom");
    }
    if (near == far) {
      throw new Error("near == far");
    }
    if (near <= 0.0) {
      throw new Error("near <= 0.0f");
    }
    if (far <= 0.0) {
      throw new Error("far <= 0.0f");
    }
    const r_width = 1.0 / (right - left);
    const r_height = 1.0 / (top - bottom);
    const r_depth = 1.0 / (near - far);
    const x = 2.0 * (near * r_width);
    const y = 2.0 * (near * r_height);
    const A = (right + left) * r_width;
    const B = (top + bottom) * r_height;
    const C = (far + near) * r_depth;
    const D = 2.0 * (far * near * r_depth);
    m[offset + 0] = x;
    m[offset + 5] = y;
    m[offset + 8] = A;
    m[offset + 9] = B;
    m[offset + 10] = C;
    m[offset + 14] = D;
    m[offset + 11] = -1.0;
    m[offset + 1] = 0.0;
    m[offset + 2] = 0.0;
    m[offset + 3] = 0.0;
    m[offset + 4] = 0.0;
    m[offset + 6] = 0.0;
    m[offset + 7] = 0.0;
    m[offset + 12] = 0.0;
    m[offset + 13] = 0.0;
    m[offset + 15] = 0.0;
  }

  /**
   * Defines a projection matrix in terms of a field of view angle, an
   * aspect ratio, and z clip planes.
   *
   * @param m the float array that holds the perspective matrix
   * @param offset the offset into float array m where the perspective
   *        matrix data is written
   * @param fovy field of view in y direction, in degrees
   * @param aspect width to height aspect ratio of the viewport
   * @param zNear
   * @param zFar
   */
  public static perspectiveM(
    m: number[] | Float32Array, offset: number,
    fovy: number, aspect: number, zNear: number, zFar: number
  ) {
    let f = 1.0 / Math.tan(fovy * (Math.PI / 360.0));
    let rangeReciprocal = 1.0 / (zNear - zFar);

    m[offset + 0] = f / aspect;
    m[offset + 1] = 0.0;
    m[offset + 2] = 0.0;
    m[offset + 3] = 0.0;

    m[offset + 4] = 0.0;
    m[offset + 5] = f;
    m[offset + 6] = 0.0;
    m[offset + 7] = 0.0;

    m[offset + 8] = 0.0;
    m[offset + 9] = 0.0;
    m[offset + 10] = (zFar + zNear) * rangeReciprocal;
    m[offset + 11] = -1.0;

    m[offset + 12] = 0.0;
    m[offset + 13] = 0.0;
    m[offset + 14] = 2.0 * zFar * zNear * rangeReciprocal;
    m[offset + 15] = 0.0;
  }

  /**
   * Computes the length of a vector.
   *
   * @param x x coordinate of a vector
   * @param y y coordinate of a vector
   * @param z z coordinate of a vector
   * @return the length of a vector
   */
  public static vLength(x: number, y: number, z: number) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  /**
   * Sets matrix m to the identity matrix.
   *
   * @param sm returns the result
   * @param smOffset index into sm where the result matrix starts
   */
  public static setIdentityM(sm: number[] | Float32Array, smOffset: number) {
    for (let i = 0; i < 16; i++) {
      sm[smOffset + i] = 0;
    }
    for (let i = 0; i < 16; i += 5) {
      sm[smOffset + i] = 1.0;
    }
  }

  /**
   * Scales matrix m by x, y, and z, putting the result in sm.
   * <p>
   * m and sm must not overlap.
   *
   * @param sm returns the result
   * @param smOffset index into sm where the result matrix starts
   * @param m source matrix
   * @param mOffset index into m where the source matrix starts
   * @param x scale factor x
   * @param y scale factor y
   * @param z scale factor z
   */
  public static scaleM(
    sm: number[] | Float32Array, smOffset: number,
    m: number[] | Float32Array, mOffset: number,
    x: number, y: number, z: number
  ) {
    for (let i = 0; i < 4; i++) {
      const smi = smOffset + i;
      const mi = mOffset + i;
      sm[smi] = m[mi] * x;
      sm[4 + smi] = m[4 + mi] * y;
      sm[8 + smi] = m[8 + mi] * z;
      sm[12 + smi] = m[12 + mi];
    }
  }

  /**
   * Scales matrix m in place by sx, sy, and sz.
   *
   * @param m matrix to scale
   * @param mOffset index into m where the matrix starts
   * @param x scale factor x
   * @param y scale factor y
   * @param z scale factor z
   */
  public static scaleMSelf(
    m: number[] | Float32Array, mOffset: number,
    x: number, y: number, z: number
  ) {
    for (let i = 0; i < 4; i++) {
      const mi = mOffset + i;
      m[mi] *= x;
      m[4 + mi] *= y;
      m[8 + mi] *= z;
    }
  }

  /**
   * Translates matrix m by x, y, and z, putting the result in tm.
   * <p>
   * m and tm must not overlap.
   *
   * @param tm returns the result
   * @param tmOffset index into sm where the result matrix starts
   * @param m source matrix
   * @param mOffset index into m where the source matrix starts
   * @param x translation factor x
   * @param y translation factor y
   * @param z translation factor z
   */
  public static translateM(
    tm: number[] | Float32Array, tmOffset: number,
    m: number[] | Float32Array, mOffset: number,
    x: number, y: number, z: number
  ) {
    for (let i = 0; i < 12; i++) {
      tm[tmOffset + i] = m[mOffset + i];
    }
    for (let i = 0; i < 4; i++) {
      const tmi = tmOffset + i;
      const mi = mOffset + i;
      tm[12 + tmi] = m[mi] * x + m[4 + mi] * y + m[8 + mi] * z +
        m[12 + mi];
    }
  }

  /**
   * Translates matrix m by x, y, and z in place.
   *
   * @param m matrix
   * @param mOffset index into m where the matrix starts
   * @param x translation factor x
   * @param y translation factor y
   * @param z translation factor z
   */
  public static translateMSelf(
    m: number[] | Float32Array, mOffset: number,
    x: number, y: number, z: number
  ) {
    for (let i = 0; i < 4; i++) {
      const mi = mOffset + i;
      m[12 + mi] += m[mi] * x + m[4 + mi] * y + m[8 + mi] * z;
    }
  }

  /**
   * Rotates matrix m by angle a (in degrees) around the axis (x, y, z).
   * <p>
   * m and rm must not overlap.
   *
   * @param rm returns the result
   * @param rmOffset index into rm where the result matrix starts
   * @param m source matrix
   * @param mOffset index into m where the source matrix starts
   * @param a angle to rotate in degrees
   * @param x X axis component
   * @param y Y axis component
   * @param z Z axis component
   */
  public static rotateM(
    rm: number[] | Float32Array, rmOffset: number,
    m: number[] | Float32Array, mOffset: number,
    a: number, x: number, y: number, z: number
  ) {
    const tmp = this.ThreadTmp;
    this.setRotateM(tmp, 16, a, x, y, z);
    this.multiplyMM(rm, rmOffset, m, mOffset, tmp, 16);
  }

  /**
   * Rotates matrix m in place by angle a (in degrees)
   * around the axis (x, y, z).
   *
   * @param m source matrix
   * @param mOffset index into m where the matrix starts
   * @param a angle to rotate in degrees
   * @param x X axis component
   * @param y Y axis component
   * @param z Z axis component
   */
  public static rotateMSelf(
    m: number[] | Float32Array, mOffset: number,
    a: number, x: number, y: number, z: number
  ) {
    this.rotateM(m, mOffset, m, mOffset, a, x, y, z);
  }

  /**
   * Creates a matrix for rotation by angle a (in degrees)
   * around the axis (x, y, z).
   * <p>
   * An optimized path will be used for rotation about a major axis
   * (e.g. x=1.0f y=0.0f z=0.0f).
   *
   * @param rm returns the result
   * @param rmOffset index into rm where the result matrix starts
   * @param a angle to rotate in degrees
   * @param x X axis component
   * @param y Y axis component
   * @param z Z axis component
   */
  public static setRotateM(
    rm: number[] | Float32Array, rmOffset: number,
    a: number, x: number, y: number, z: number
  ) {
    rm[rmOffset + 3] = 0;
    rm[rmOffset + 7] = 0;
    rm[rmOffset + 11] = 0;
    rm[rmOffset + 12] = 0;
    rm[rmOffset + 13] = 0;
    rm[rmOffset + 14] = 0;
    rm[rmOffset + 15] = 1;
    a *= (Math.PI / 180.0);
    let s = Math.sin(a);
    let c = Math.cos(a);
    if (1.0 == x && 0.0 == y && 0.0 == z) {
      rm[rmOffset + 5] = c;
      rm[rmOffset + 10] = c;
      rm[rmOffset + 6] = s;
      rm[rmOffset + 9] = -s;
      rm[rmOffset + 1] = 0;
      rm[rmOffset + 2] = 0;
      rm[rmOffset + 4] = 0;
      rm[rmOffset + 8] = 0;
      rm[rmOffset + 0] = 1;
    } else if (0.0 == x && 1.0 == y && 0.0 == z) {
      rm[rmOffset + 0] = c;
      rm[rmOffset + 10] = c;
      rm[rmOffset + 8] = s;
      rm[rmOffset + 2] = -s;
      rm[rmOffset + 1] = 0;
      rm[rmOffset + 4] = 0;
      rm[rmOffset + 6] = 0;
      rm[rmOffset + 9] = 0;
      rm[rmOffset + 5] = 1;
    } else if (0.0 == x && 0.0 == y && 1.0 == z) {
      rm[rmOffset + 0] = c;
      rm[rmOffset + 5] = c;
      rm[rmOffset + 1] = s;
      rm[rmOffset + 4] = -s;
      rm[rmOffset + 2] = 0;
      rm[rmOffset + 6] = 0;
      rm[rmOffset + 8] = 0;
      rm[rmOffset + 9] = 0;
      rm[rmOffset + 10] = 1;
    } else {
      const len = this.vLength(x, y, z);
      if (1.0 != len) {
        const recipLen = 1.0 / len;
        x *= recipLen;
        y *= recipLen;
        z *= recipLen;
      }
      const nc = 1.0 - c;
      const xy = x * y;
      const yz = y * z;
      const zx = z * x;
      const xs = x * s;
      const ys = y * s;
      const zs = z * s;
      rm[rmOffset + 0] = x * x * nc + c;
      rm[rmOffset + 4] = xy * nc - zs;
      rm[rmOffset + 8] = zx * nc + ys;
      rm[rmOffset + 1] = xy * nc + zs;
      rm[rmOffset + 5] = y * y * nc + c;
      rm[rmOffset + 9] = yz * nc - xs;
      rm[rmOffset + 2] = zx * nc - ys;
      rm[rmOffset + 6] = yz * nc + xs;
      rm[rmOffset + 10] = z * z * nc + c;
    }
  }

  /**
   * Converts Euler angles to a rotation matrix.
   *
   * @param rm returns the result
   * @param rmOffset index into rm where the result matrix starts
   * @param x angle of rotation, in degrees
   * @param y is broken, do not use
   * @param z angle of rotation, in degrees
   *
   * @deprecated This method is incorrect around the y axis. This method is
   *             deprecated and replaced (below) by setRotateEulerM2 which
   *             behaves correctly
   */
// @Deprecated
// public static void setRotateEulerM(float[] rm, int rmOffset,
//   float x, float y, float z) {
//   x *= (float) (Math.PI / 180.0f);
//   y *= (float) (Math.PI / 180.0f);
//   z *= (float) (Math.PI / 180.0f);
//   float cx = (float) Math.cos(x);
//   float sx = (float) Math.sin(x);
//   float cy = (float) Math.cos(y);
//   float sy = (float) Math.sin(y);
//   float cz = (float) Math.cos(z);
//   float sz = (float) Math.sin(z);
//   float cxsy = cx * sy;
//   float sxsy = sx * sy;
//
//   rm[rmOffset + 0]  =   cy * cz;
//   rm[rmOffset + 1]  =  -cy * sz;
//   rm[rmOffset + 2]  =   sy;
//   rm[rmOffset + 3]  =  0.0f;
//
//   rm[rmOffset + 4]  =  cxsy * cz + cx * sz;
//   rm[rmOffset + 5]  = -cxsy * sz + cx * cz;
//   rm[rmOffset + 6]  =  -sx * cy;
//   rm[rmOffset + 7]  =  0.0f;
//
//   rm[rmOffset + 8]  = -sxsy * cz + sx * sz;
//   rm[rmOffset + 9]  =  sxsy * sz + sx * cz;
//   rm[rmOffset + 10] =  cx * cy;
//   rm[rmOffset + 11] =  0.0f;
//
//   rm[rmOffset + 12] =  0.0f;
//   rm[rmOffset + 13] =  0.0f;
//   rm[rmOffset + 14] =  0.0f;
//   rm[rmOffset + 15] =  1.0f;
// }

  /**
   * Converts Euler angles to a rotation matrix.
   *
   * @param rm returns the result
   * @param rmOffset index into rm where the result matrix starts
   * @param x angle of rotation, in degrees
   * @param y angle of rotation, in degrees
   * @param z angle of rotation, in degrees
   *
   * @throws IllegalArgumentException if rm is null;
   * or if rmOffset + 16 > rm.length;
   * rmOffset < 0
   */
  public static setRotateEulerM2(
    rm: number[] | Float32Array, rmOffset: number,
    x: number, y: number, z: number
  ) {
    if (rm == null) {
      throw new Error("rm == null");
    }
    if (rmOffset < 0) {
      throw new Error("rmOffset < 0");
    }
    if (rm.length < rmOffset + 16) {
      throw new Error("rm.length < rmOffset + 16");
    }

    x *= (Math.PI / 180.0);
    y *= (Math.PI / 180.0);
    z *= (Math.PI / 180.0);
    const cx = Math.cos(x);
    const sx = Math.sin(x);
    const cy = Math.cos(y);
    const sy = Math.sin(y);
    const cz = Math.cos(z);
    const sz = Math.sin(z);
    const cxsy = cx * sy;
    const sxsy = sx * sy;

    rm[rmOffset + 0] = cy * cz;
    rm[rmOffset + 1] = -cy * sz;
    rm[rmOffset + 2] = sy;
    rm[rmOffset + 3] = 0.0;

    rm[rmOffset + 4] = sxsy * cz + cx * sz;
    rm[rmOffset + 5] = -sxsy * sz + cx * cz;
    rm[rmOffset + 6] = -sx * cy;
    rm[rmOffset + 7] = 0.0;

    rm[rmOffset + 8] = -cxsy * cz + sx * sz;
    rm[rmOffset + 9] = cxsy * sz + sx * cz;
    rm[rmOffset + 10] = cx * cy;
    rm[rmOffset + 11] = 0.0;

    rm[rmOffset + 12] = 0.0;
    rm[rmOffset + 13] = 0.0;
    rm[rmOffset + 14] = 0.0;
    rm[rmOffset + 15] = 1.0;
  }

  /**
   * Defines a viewing transformation in terms of an eye point, a center of
   * view, and an up vector.
   *
   * @param rm returns the result
   * @param rmOffset index into rm where the result matrix starts
   * @param eyeX eye point X
   * @param eyeY eye point Y
   * @param eyeZ eye point Z
   * @param centerX center of view X
   * @param centerY center of view Y
   * @param centerZ center of view Z
   * @param upX up vector X
   * @param upY up vector Y
   * @param upZ up vector Z
   */
  public static setLookAtM(
    rm: number[] | Float32Array, rmOffset: number,
    eyeX: number, eyeY: number, eyeZ: number,
    centerX: number, centerY: number, centerZ: number,
    upX: number, upY: number, upZ: number
  ) {

    // See the OpenGL GLUT documentation for gluLookAt for a description
    // of the algorithm. We implement it in a straightforward way:

    let fx = centerX - eyeX;
    let fy = centerY - eyeY;
    let fz = centerZ - eyeZ;

    // Normalize f
    const rlf = 1.0 / Matrix.vLength(fx, fy, fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf;

    // compute s = f x up (x means "cross product")
    let sx = fy * upZ - fz * upY;
    let sy = fz * upX - fx * upZ;
    let sz = fx * upY - fy * upX;

    // and normalize s
    const rls = 1.0 / Matrix.vLength(sx, sy, sz);
    sx *= rls;
    sy *= rls;
    sz *= rls;

    // compute u = s x f
    const ux = sy * fz - sz * fy;
    const uy = sz * fx - sx * fz;
    const uz = sx * fy - sy * fx;

    rm[rmOffset + 0] = sx;
    rm[rmOffset + 1] = ux;
    rm[rmOffset + 2] = -fx;
    rm[rmOffset + 3] = 0.0;

    rm[rmOffset + 4] = sy;
    rm[rmOffset + 5] = uy;
    rm[rmOffset + 6] = -fy;
    rm[rmOffset + 7] = 0.0;

    rm[rmOffset + 8] = sz;
    rm[rmOffset + 9] = uz;
    rm[rmOffset + 10] = -fz;
    rm[rmOffset + 11] = 0.0;

    rm[rmOffset + 12] = 0.0;
    rm[rmOffset + 13] = 0.0;
    rm[rmOffset + 14] = 0.0;
    rm[rmOffset + 15] = 1.0;

    this.translateMSelf(rm, rmOffset, -eyeX, -eyeY, -eyeZ);
  }
}
