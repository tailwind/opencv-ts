// //////////////////////////////////////////////////////////////////////////////////////
//
//  IMPORTANT: READ BEFORE DOWNLOADING, COPYING, INSTALLING OR USING.
//
//  By downloading, copying, installing or using the software you agree to this license.
//  If you do not agree to this license, do not download, install,
//  copy or use the software.
//
//
//                           License Agreement
//                For Open Source Computer Vision Library
//
// Copyright (C) 2013, OpenCV Foundation, all rights reserved.
// Third party copyrights are property of their respective owners.
//
// Redistribution and use in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
//   * Redistribution's of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//
//   * Redistribution's in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//
//   * The name of the copyright holders may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
//
// This software is provided by the copyright holders and contributors "as is" and
// any express or implied warranties, including, but not limited to, the implied
// warranties of merchantability and fitness for a particular purpose are disclaimed.
// In no event shall the Intel Corporation or contributors be liable for any direct,
// indirect, incidental, special, exemplary, or consequential damages
// (including, but not limited to, procurement of substitute goods or services;
// loss of use, data, or profits; or business interruption) however caused
// and on any theory of liability, whether in contract, strict liability,
// or tort (including negligence or otherwise) arising in any way out of
// the use of this software, even if advised of the possibility of such damage.
//
//

// //////////////////////////////////////////////////////////////////////////////////////
// Author: Sajjad Taheri, University of California, Irvine. sajjadt[at]uci[dot]edu
//
//                             LICENSE AGREEMENT
// Copyright (c) 2015 The Regents of the University of California (Regents)
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
// 2. Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
// 3. Neither the name of the University nor the
//    names of its contributors may be used to endorse or promote products
//    derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
// WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL CONTRIBUTORS BE LIABLE FOR ANY
// DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
// (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
// ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
// SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

import cv from '../../'

QUnit.module('Core', {
  before: cv.loadOpenCV
})

QUnit.test('test_mat_creation', function(assert) {
  // Mat constructors.
  // Mat::Mat(int rows, int cols, int type)
  {
    const mat = new cv.Mat(10, 20, cv.CV_8UC3)

    assert.strictEqual(mat.type(), cv.CV_8UC3)
    assert.strictEqual(mat.depth(), cv.CV_8U)
    assert.strictEqual(mat.channels(), 3)
    assert.false(mat.empty())

    const size = mat.size()
    assert.strictEqual(size.height, 10)
    assert.strictEqual(size.width, 20)

    mat.delete()
    assert.true(mat.isDeleted())
  }

  // Mat::Mat(const Mat &)
  {
    // Copy from another Mat
    const mat1 = new cv.Mat(10, 20, cv.CV_8UC3)
    const mat2 = new cv.Mat(mat1)

    assert.strictEqual(mat2.type(), mat1.type())
    assert.strictEqual(mat2.depth(), mat1.depth())
    assert.strictEqual(mat2.channels(), mat1.channels())
    assert.strictEqual(mat2.empty(), mat1.empty())

    const size2 = mat2.size()
    const size1 = mat1.size()
    assert.strictEqual(size2.width, size1.width)
    assert.strictEqual(size2.width, size1.width)

    mat1.delete()
    mat2.delete()
  }

  // Mat::Mat(int rows, int cols, int type, void *data, size_t step=AUTO_STEP)
  {
    // 10 * 10 and one channel
    const data = cv._malloc(10 * 10 * 1)
    const mat = new cv.Mat(10, 10, cv.CV_8UC1, data, 0)

    assert.strictEqual(mat.type(), cv.CV_8UC1)
    assert.strictEqual(mat.depth(), cv.CV_8U)
    assert.strictEqual(mat.channels(), 1)
    assert.false(mat.empty())

    const size = mat.size()
    assert.strictEqual(size.height, 10)
    assert.strictEqual(size.width, 10)

    mat.delete()
  }

  // Mat::Mat(int rows, int cols, int type, const Scalar& scalar)
  {
    // 2 * 2 8UC4 mat
    const mat = new cv.Mat(2, 2, cv.CV_8UC4, [0, 1, 2, 3])

    for (let r = 0; r < mat.rows; r++) {
      for (let c = 0; c < mat.cols; c++) {
        const element = mat.ptr(r, c)
        assert.strictEqual(element[0], 0)
        assert.strictEqual(element[1], 1)
        assert.strictEqual(element[2], 2)
        assert.strictEqual(element[3], 3)
      }
    }

    mat.delete()
  }

  //  Mat::create(int, int, int)
  {
    const mat = new cv.Mat()
    mat.create(10, 5, cv.CV_8UC3)
    const size = mat.size()

    assert.strictEqual(mat.type(), cv.CV_8UC3)
    assert.strictEqual(size.height, 10)
    assert.strictEqual(size.width, 5)
    assert.strictEqual(mat.channels(), 3)

    mat.delete()
  }
  //  Mat::create(Size, int)
  {
    const mat = new cv.Mat()
    mat.create({height: 10, width: 5}, cv.CV_8UC4)
    const size = mat.size()

    assert.strictEqual(mat.type(), cv.CV_8UC4)
    assert.strictEqual(size.height, 10)
    assert.strictEqual(size.width, 5)
    assert.strictEqual(mat.channels(), 4)

    mat.delete()
  }
  //   clone
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC1)
    const mat2 = mat.clone()

    assert.strictEqual(mat.channels, mat2.channels)
    assert.strictEqual(mat.size().height, mat2.size().height)
    assert.strictEqual(mat.size().width, mat2.size().width)

    assert.deepEqual(mat.data, mat2.data)

    mat.delete()
    mat2.delete()
  }
  // copyTo
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC1)
    const mat2 = new cv.Mat()
    mat.copyTo(mat2)

    assert.strictEqual(mat.channels, mat2.channels)
    assert.strictEqual(mat.size().height, mat2.size().height)
    assert.strictEqual(mat.size().width, mat2.size().width)

    assert.deepEqual(mat.data, mat2.data)


    mat.delete()
    mat2.delete()
  }
  // copyTo1
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC1)
    const mat2 = new cv.Mat()
    const mask = new cv.Mat(5, 5, cv.CV_8UC1, new cv.Scalar(1))
    mat.copyTo(mat2, mask)

    assert.strictEqual(mat.channels, mat2.channels)
    assert.strictEqual(mat.size().height, mat2.size().height)
    assert.strictEqual(mat.size().width, mat2.size().width)

    assert.deepEqual(mat.data, mat2.data)


    mat.delete()
    mat2.delete()
    mask.delete()
  }

  // matFromArray
  {
    const arrayC1 = [0, -1, 2, -3]
    const arrayC2 = [0, -1, 2, -3, 4, -5, 6, -7]
    const arrayC3 = [0, -1, 2, -3, 4, -5, 6, -7, 9, -9, 10, -11]
    const arrayC4 = [0, -1, 2, -3, 4, -5, 6, -7, 8, -9, 10, -11, 12, 13, 14, 15]

    const mat8UC1 = cv.matFromArray(2, 2, cv.CV_8UC1, arrayC1)
    const mat8UC2 = cv.matFromArray(2, 2, cv.CV_8UC2, arrayC2)
    const mat8UC3 = cv.matFromArray(2, 2, cv.CV_8UC3, arrayC3)
    const mat8UC4 = cv.matFromArray(2, 2, cv.CV_8UC4, arrayC4)

    const mat8SC1 = cv.matFromArray(2, 2, cv.CV_8SC1, arrayC1)
    const mat8SC2 = cv.matFromArray(2, 2, cv.CV_8SC2, arrayC2)
    const mat8SC3 = cv.matFromArray(2, 2, cv.CV_8SC3, arrayC3)
    const mat8SC4 = cv.matFromArray(2, 2, cv.CV_8SC4, arrayC4)

    const mat16UC1 = cv.matFromArray(2, 2, cv.CV_16UC1, arrayC1)
    const mat16UC2 = cv.matFromArray(2, 2, cv.CV_16UC2, arrayC2)
    const mat16UC3 = cv.matFromArray(2, 2, cv.CV_16UC3, arrayC3)
    const mat16UC4 = cv.matFromArray(2, 2, cv.CV_16UC4, arrayC4)

    const mat16SC1 = cv.matFromArray(2, 2, cv.CV_16SC1, arrayC1)
    const mat16SC2 = cv.matFromArray(2, 2, cv.CV_16SC2, arrayC2)
    const mat16SC3 = cv.matFromArray(2, 2, cv.CV_16SC3, arrayC3)
    const mat16SC4 = cv.matFromArray(2, 2, cv.CV_16SC4, arrayC4)

    const mat32SC1 = cv.matFromArray(2, 2, cv.CV_32SC1, arrayC1)
    const mat32SC2 = cv.matFromArray(2, 2, cv.CV_32SC2, arrayC2)
    const mat32SC3 = cv.matFromArray(2, 2, cv.CV_32SC3, arrayC3)
    const mat32SC4 = cv.matFromArray(2, 2, cv.CV_32SC4, arrayC4)

    const mat32FC1 = cv.matFromArray(2, 2, cv.CV_32FC1, arrayC1)
    const mat32FC2 = cv.matFromArray(2, 2, cv.CV_32FC2, arrayC2)
    const mat32FC3 = cv.matFromArray(2, 2, cv.CV_32FC3, arrayC3)
    const mat32FC4 = cv.matFromArray(2, 2, cv.CV_32FC4, arrayC4)

    const mat64FC1 = cv.matFromArray(2, 2, cv.CV_64FC1, arrayC1)
    const mat64FC2 = cv.matFromArray(2, 2, cv.CV_64FC2, arrayC2)
    const mat64FC3 = cv.matFromArray(2, 2, cv.CV_64FC3, arrayC3)
    const mat64FC4 = cv.matFromArray(2, 2, cv.CV_64FC4, arrayC4)

    assert.deepEqual(mat8UC1.data, new Uint8Array(arrayC1))
    assert.deepEqual(mat8UC2.data, new Uint8Array(arrayC2))
    assert.deepEqual(mat8UC3.data, new Uint8Array(arrayC3))
    assert.deepEqual(mat8UC4.data, new Uint8Array(arrayC4))

    assert.deepEqual(mat8SC1.data8S, new Int8Array(arrayC1))
    assert.deepEqual(mat8SC2.data8S, new Int8Array(arrayC2))
    assert.deepEqual(mat8SC3.data8S, new Int8Array(arrayC3))
    assert.deepEqual(mat8SC4.data8S, new Int8Array(arrayC4))

    assert.deepEqual(mat16UC1.data16U, new Uint16Array(arrayC1))
    assert.deepEqual(mat16UC2.data16U, new Uint16Array(arrayC2))
    assert.deepEqual(mat16UC3.data16U, new Uint16Array(arrayC3))
    assert.deepEqual(mat16UC4.data16U, new Uint16Array(arrayC4))

    assert.deepEqual(mat16SC1.data16S, new Int16Array(arrayC1))
    assert.deepEqual(mat16SC2.data16S, new Int16Array(arrayC2))
    assert.deepEqual(mat16SC3.data16S, new Int16Array(arrayC3))
    assert.deepEqual(mat16SC4.data16S, new Int16Array(arrayC4))

    assert.deepEqual(mat32SC1.data32S, new Int32Array(arrayC1))
    assert.deepEqual(mat32SC2.data32S, new Int32Array(arrayC2))
    assert.deepEqual(mat32SC3.data32S, new Int32Array(arrayC3))
    assert.deepEqual(mat32SC4.data32S, new Int32Array(arrayC4))

    assert.deepEqual(mat32FC1.data32F, new Float32Array(arrayC1))
    assert.deepEqual(mat32FC2.data32F, new Float32Array(arrayC2))
    assert.deepEqual(mat32FC3.data32F, new Float32Array(arrayC3))
    assert.deepEqual(mat32FC4.data32F, new Float32Array(arrayC4))

    assert.deepEqual(mat64FC1.data64F, new Float64Array(arrayC1))
    assert.deepEqual(mat64FC2.data64F, new Float64Array(arrayC2))
    assert.deepEqual(mat64FC3.data64F, new Float64Array(arrayC3))
    assert.deepEqual(mat64FC4.data64F, new Float64Array(arrayC4))

    mat8UC1.delete()
    mat8UC2.delete()
    mat8UC3.delete()
    mat8UC4.delete()
    mat8SC1.delete()
    mat8SC2.delete()
    mat8SC3.delete()
    mat8SC4.delete()
    mat16UC1.delete()
    mat16UC2.delete()
    mat16UC3.delete()
    mat16UC4.delete()
    mat16SC1.delete()
    mat16SC2.delete()
    mat16SC3.delete()
    mat16SC4.delete()
    mat32SC1.delete()
    mat32SC2.delete()
    mat32SC3.delete()
    mat32SC4.delete()
    mat32FC1.delete()
    mat32FC2.delete()
    mat32FC3.delete()
    mat32FC4.delete()
    mat64FC1.delete()
    mat64FC2.delete()
    mat64FC3.delete()
    mat64FC4.delete()
  }

  // matFromImageData
  {
    // Only test in browser
    if (typeof window === 'undefined') {
      return
    }
    const canvas = window.document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle='#FF0000'
    ctx.fillRect(0, 0, 1, 1)
    ctx.fillRect(1, 1, 1, 1)

    const imageData = ctx.getImageData(0, 0, 2, 2)
    const mat = cv.matFromImageData(imageData)

    assert.deepEqual(mat.data, new Uint8Array(imageData.data))

    mat.delete()
  }

  // Mat(mat)
  {
    const mat = new cv.Mat(2, 2, cv.CV_8UC4, new cv.Scalar(1, 0, 1, 0))
    const mat1 = new cv.Mat(mat)
    const mat2 = mat

    assert.strictEqual(mat.rows, mat1.rows)
    assert.strictEqual(mat.cols, mat1.cols)
    assert.strictEqual(mat.type(), mat1.type())
    assert.deepEqual(mat.data, mat1.data)

    mat.delete()

    assert.strictEqual(mat1.isDeleted(), false)
    assert.strictEqual(mat2.isDeleted(), true)

    mat1.delete()
  }

  // mat.setTo
  {
    const mat = new cv.Mat(2, 2, cv.CV_8UC4)
    const s = [0, 1, 2, 3]

    mat.setTo(s)

    assert.deepEqual(mat.ptr(0, 0), new Uint8Array(s))
    assert.deepEqual(mat.ptr(0, 1), new Uint8Array(s))
    assert.deepEqual(mat.ptr(1, 0), new Uint8Array(s))
    assert.deepEqual(mat.ptr(1, 1), new Uint8Array(s))

    const s1 = [0, 0, 0, 0]
    mat.setTo(s1)
    const mask = cv.matFromArray(2, 2, cv.CV_8UC1, [0, 1, 0, 1])
    mat.setTo(s, mask)

    assert.deepEqual(mat.ptr(0, 0), new Uint8Array(s1))
    assert.deepEqual(mat.ptr(0, 1), new Uint8Array(s))
    assert.deepEqual(mat.ptr(1, 0), new Uint8Array(s1))
    assert.deepEqual(mat.ptr(1, 1), new Uint8Array(s))

    mat.delete()
    mask.delete()
  }
})

QUnit.test('test_mat_ptr', function(assert) {
  const RValue = 3
  const GValue = 7
  const BValue = 197

  // cv.CV_8UC1 + Mat::ptr(int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_8UC1)
    let view = mat.data

    // Alter matrix[2, 1].
    const step = 10
    view[2 * step + 1] = RValue

    // Access matrix[2, 1].
    view = mat.ptr(2)

    assert.strictEqual(view[1], RValue)

    mat.delete()
  }

  // cv.CV_8UC3 + Mat::ptr(int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_8UC3)
    let view = mat.data

    // Alter matrix[2, 1].
    const step = 3 * 10
    view[2 * step + 3] = RValue
    view[2 * step + 3 + 1] = GValue
    view[2 * step + 3 + 2] = BValue

    // Access matrix[2, 1].
    view = mat.ptr(2)

    assert.strictEqual(view[3], RValue)
    assert.strictEqual(view[3 + 1], GValue)
    assert.strictEqual(view[3 + 2], BValue)

    mat.delete()
  }

  // cv.CV_8UC3 + Mat::ptr(int, int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_8UC3)
    let view = mat.data

    // Alter matrix[2, 1].
    const step = 3 * 10
    view[2 * step + 3] = RValue
    view[2 * step + 3 + 1] = GValue
    view[2 * step + 3 + 2] = BValue

    // Access matrix[2, 1].
    view = mat.ptr(2, 1)

    assert.strictEqual(view[0], RValue)
    assert.strictEqual(view[1], GValue)
    assert.strictEqual(view[2], BValue)

    mat.delete()
  }

  const RValueF32 = 3.3
  const GValueF32 = 7.3
  const BValueF32 = 197.3
  const EPSILON = 0.001

  // cv.CV_32FC1 + Mat::ptr(int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_32FC1)
    let view = mat.data32F

    // Alter matrix[2, 1].
    const step = 10
    view[2 * step + 1] = RValueF32

    // Access matrix[2, 1].
    view = mat.floatPtr(2)

    assert.true(Math.abs(view[1] - RValueF32) < EPSILON)

    mat.delete()
  }

  // cv.CV_32FC3 + Mat::ptr(int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_32FC3)
    let view = mat.data32F

    // Alter matrix[2, 1].
    const step = mat.step1(0)
    view[2 * step + 3] = RValueF32
    view[2 * step + 3 + 1] = GValueF32
    view[2 * step + 3 + 2] = BValueF32

    // Access matrix[2, 1].
    view = mat.floatPtr(2)

    assert.true(Math.abs(view[3] - RValueF32) < EPSILON)
    assert.true(Math.abs(view[3 + 1] - GValueF32) < EPSILON)
    assert.true(Math.abs(view[3 + 2] - BValueF32) < EPSILON)

    mat.delete()
  }

  // cv.CV_32FC3 + Mat::ptr(int, int).
  {
    const mat = new cv.Mat(10, 10, cv.CV_32FC3)
    let view = mat.data32F

    // Alter matrix[2, 1].
    const step = mat.step1(0)
    view[2 * step + 3] = RValueF32
    view[2 * step + 3 + 1] = GValueF32
    view[2 * step + 3 + 2] = BValueF32

    // Access matrix[2, 1].
    view = mat.floatPtr(2, 1)

    assert.true(Math.abs(view[0] - RValueF32) < EPSILON)
    assert.true(Math.abs(view[1] - GValueF32) < EPSILON)
    assert.true(Math.abs(view[2] - BValueF32) < EPSILON)

    mat.delete()
  }
})

QUnit.test('test_mat_zeros', function(assert) {
  const zeros = new Uint8Array(10*10).fill(0)
  // Mat::zeros(int, int, int)
  {
    const mat = cv.Mat.zeros(10, 10, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, zeros)

    mat.delete()
  }

  // Mat::zeros(Size, int)
  {
    const mat = cv.Mat.zeros({height: 10, width: 10}, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, zeros)

    mat.delete()
  }
})

QUnit.test('test_mat_ones', function(assert) {
  const ones = new Uint8Array(10*10).fill(1)
  // Mat::ones(int, int, int)
  {
    const mat = cv.Mat.ones(10, 10, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, ones)
  }
  // Mat::ones(Size, int)
  {
    const mat = cv.Mat.ones({height: 10, width: 10}, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, ones)
  }
})

QUnit.test('test_mat_eye', function(assert) {
  const eye4by4 = new Uint8Array([1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1])
  // Mat::eye(int, int, int)
  {
    const mat = cv.Mat.eye(4, 4, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, eye4by4)
  }

  // Mat::eye(Size, int)
  {
    const mat = cv.Mat.eye({height: 4, width: 4}, cv.CV_8UC1)
    const view = mat.data

    assert.deepEqual(view, eye4by4)
  }
})

QUnit.test('test_mat_miscs', function(assert) {
  // Mat::col(int)
  {
    const mat = cv.matFromArray(2, 2, cv.CV_8UC2, [1, 2, 3, 4, 5, 6, 7, 8])
    const col = mat.col(1)

    assert.strictEqual(col.isContinuous(), false)
    assert.strictEqual(col.ptr(0, 0)[0], 3)
    assert.strictEqual(col.ptr(0, 0)[1], 4)
    assert.strictEqual(col.ptr(1, 0)[0], 7)
    assert.strictEqual(col.ptr(1, 0)[1], 8)

    col.delete()
    mat.delete()
  }

  // Mat::row(int)
  {
    const mat = cv.Mat.zeros(5, 5, cv.CV_8UC2)
    const row = mat.row(1)
    const view = row.data
    assert.strictEqual(view[0], 0)
    assert.strictEqual(view[4], 0)

    row.delete()
    mat.delete()
  }

  // Mat::convertTo(Mat, int, double, double)
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC3)
    const grayMat = cv.Mat.zeros(5, 5, cv.CV_8UC1)

    mat.convertTo(grayMat, cv.CV_8U, 2, 1)
    // dest = 2 * source(x, y) + 1.
    const view = grayMat.data
    assert.strictEqual(view[0], (1 * 2) + 1)

    mat.convertTo(grayMat, cv.CV_8U)
    // dest = 1 * source(x, y) + 0.
    assert.strictEqual(view[0], 1)

    mat.convertTo(grayMat, cv.CV_8U, 2)
    // dest = 2 * source(x, y) + 0.
    assert.strictEqual(view[0], 2)

    grayMat.delete()
    mat.delete()
  }

  // split
  {
    const R =7
    const G =13
    const B =29

    const mat = cv.Mat.ones(5, 5, cv.CV_8UC3)
    let view = mat.data
    view[0] = R
    view[1] = G
    view[2] = B

    const bgrPlanes = new cv.MatVector()
    cv.split(mat, bgrPlanes)
    assert.strictEqual(bgrPlanes.size(), 3)

    const rMat = bgrPlanes.get(0)
    view = rMat.data
    assert.strictEqual(view[0], R)

    const gMat = bgrPlanes.get(1)
    view = gMat.data
    assert.strictEqual(view[0], G)

    const bMat = bgrPlanes.get(2)
    view = bMat.data
    assert.strictEqual(view[0], B)

    mat.delete()
    rMat.delete()
    gMat.delete()
    bgrPlanes.delete()
    bMat.delete()
  }

  // elemSize
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC3)
    assert.strictEqual(mat.elemSize(), 3)
    assert.strictEqual(mat.elemSize1(), 1)

    const mat2 = cv.Mat.zeros(5, 5, cv.CV_8UC1)
    assert.strictEqual(mat2.elemSize(), 1)
    assert.strictEqual(mat2.elemSize1(), 1)

    const mat3 = cv.Mat.eye(5, 5, cv.CV_16UC3)
    assert.strictEqual(mat3.elemSize(), 2 * 3)
    assert.strictEqual(mat3.elemSize1(), 2)

    mat.delete()
    mat2.delete()
    mat3.delete()
  }

  // step
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC3)
    assert.strictEqual(mat.step[0], 15)
    assert.strictEqual(mat.step[1], 3)

    const mat2 = cv.Mat.zeros(5, 5, cv.CV_8UC1)
    assert.strictEqual(mat2.step[0], 5)
    assert.strictEqual(mat2.step[1], 1)

    const mat3 = cv.Mat.eye(5, 5, cv.CV_16UC3)
    assert.strictEqual(mat3.step[0], 30)
    assert.strictEqual(mat3.step[1], 6)

    mat.delete()
    mat2.delete()
    mat3.delete()
  }

  // dot
  {
    const mat = cv.Mat.ones(5, 5, cv.CV_8UC1)
    const mat2 = cv.Mat.eye(5, 5, cv.CV_8UC1)

    assert.strictEqual(mat.dot(mat), 25)
    assert.strictEqual(mat.dot(mat2), 5)
    assert.strictEqual(mat2.dot(mat2), 5)

    mat.delete()
    mat2.delete()
  }

  // mul
  {
    const FACTOR = 5
    const mat = cv.Mat.ones(4, 4, cv.CV_8UC1)
    const mat2 = cv.Mat.eye(4, 4, cv.CV_8UC1)

    const expected = new Uint8Array([FACTOR, 0, 0, 0,
      0, FACTOR, 0, 0,
      0, 0, FACTOR, 0,
      0, 0, 0, FACTOR])
    const mat3 = mat.mul(mat2, FACTOR)

    assert.deepEqual(mat3.data, expected)

    mat.delete()
    mat2.delete()
    mat3.delete()
  }
})


QUnit.test('test mat access', function(assert) {
  // test memory view
  {
    const data = new Uint8Array([0, 0, 0, 255, 0, 1, 2, 3])
    const dataPtr = cv._malloc(8)

    const dataHeap = new Uint8Array(cv.HEAPU8.buffer, dataPtr, 8)
    dataHeap.set(new Uint8Array(data.buffer))

    const mat = new cv.Mat(8, 1, cv.CV_8UC1, dataPtr, 0)


    const unsignedCharView = new Uint8Array(data.buffer)
    const charView = new Int8Array(data.buffer)
    const shortView = new Int16Array(data.buffer)
    const unsignedShortView = new Uint16Array(data.buffer)
    const intView = new Int32Array(data.buffer)
    const float32View = new Float32Array(data.buffer)
    const float64View = new Float64Array(data.buffer)


    assert.deepEqual(unsignedCharView, mat.data)
    assert.deepEqual(charView, mat.data8S)
    assert.deepEqual(shortView, mat.data16S)
    assert.deepEqual(unsignedShortView, mat.data16U)
    assert.deepEqual(intView, mat.data32S)
    assert.deepEqual(float32View, mat.data32F)
    assert.deepEqual(float64View, mat.data64F)
  }

  // test ucharAt(i)
  {
    const data = new Uint8Array([0, 0, 0, 255, 0, 1, 2, 3])
    const dataPtr = cv._malloc(8)

    const dataHeap = new Uint8Array(cv.HEAPU8.buffer, dataPtr, 8)
    dataHeap.set(new Uint8Array(data.buffer))

    const mat = new cv.Mat(8, 1, cv.CV_8UC1, dataPtr, 0)

    assert.strictEqual(mat.ucharAt(0), 0)
    assert.strictEqual(mat.ucharAt(1), 0)
    assert.strictEqual(mat.ucharAt(2), 0)
    assert.strictEqual(mat.ucharAt(3), 255)
    assert.strictEqual(mat.ucharAt(4), 0)
    assert.strictEqual(mat.ucharAt(5), 1)
    assert.strictEqual(mat.ucharAt(6), 2)
    assert.strictEqual(mat.ucharAt(7), 3)
  }

  // test ushortAt(i)
  {
    const data = new Uint16Array([0, 1000, 65000, 255, 0, 1, 2, 3])
    const dataPtr = cv._malloc(16)

    const dataHeap = new Uint16Array(cv.HEAPU8.buffer, dataPtr, 8)
    dataHeap.set(new Uint16Array(data.buffer))

    const mat = new cv.Mat(8, 1, cv.CV_16SC1, dataPtr, 0)

    assert.strictEqual(mat.ushortAt(0), 0)
    assert.strictEqual(mat.ushortAt(1), 1000)
    assert.strictEqual(mat.ushortAt(2), 65000)
    assert.strictEqual(mat.ushortAt(3), 255)
    assert.strictEqual(mat.ushortAt(4), 0)
    assert.strictEqual(mat.ushortAt(5), 1)
    assert.strictEqual(mat.ushortAt(6), 2)
    assert.strictEqual(mat.ushortAt(7), 3)
  }

  // test intAt(i)
  {
    const data = new Int32Array([0, -1000, 65000, 255, -2000000, -1, 2, 3])
    const dataPtr = cv._malloc(32)

    const dataHeap = new Int32Array(cv.HEAPU32.buffer, dataPtr, 8)
    dataHeap.set(new Int32Array(data.buffer))

    const mat = new cv.Mat(8, 1, cv.CV_32SC1, dataPtr, 0)

    assert.strictEqual(mat.intAt(0), 0)
    assert.strictEqual(mat.intAt(1), -1000)
    assert.strictEqual(mat.intAt(2), 65000)
    assert.strictEqual(mat.intAt(3), 255)
    assert.strictEqual(mat.intAt(4), -2000000)
    assert.strictEqual(mat.intAt(5), -1)
    assert.strictEqual(mat.intAt(6), 2)
    assert.strictEqual(mat.intAt(7), 3)
  }

  // test floatAt(i)
  {
    const EPSILON = 0.001
    const data = new Float32Array([0, -10.5, 650.001, 255, -20.1, -1.2, 2, 3.5])
    const dataPtr = cv._malloc(32)

    const dataHeap = new Float32Array(cv.HEAPU32.buffer, dataPtr, 8)
    dataHeap.set(new Float32Array(data.buffer))

    const mat = new cv.Mat(8, 1, cv.CV_32FC1, dataPtr, 0)

    assert.strictEqual(Math.abs(mat.floatAt(0)-0) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(1)+10.5) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(2)-650.001) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(3)-255) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(4)+20.1) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(5)+1.2) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(6)-2) < EPSILON, true)
    assert.strictEqual(Math.abs(mat.floatAt(7)-3.5) < EPSILON, true)
  }

  // test intAt(i,j)
  {
    const mat = cv.Mat.eye({height: 3, width: 3}, cv.CV_32SC1)

    assert.strictEqual(mat.intAt(0, 0), 1)
    assert.strictEqual(mat.intAt(0, 1), 0)
    assert.strictEqual(mat.intAt(0, 2), 0)
    assert.strictEqual(mat.intAt(1, 0), 0)
    assert.strictEqual(mat.intAt(1, 1), 1)
    assert.strictEqual(mat.intAt(1, 2), 0)
    assert.strictEqual(mat.intAt(2, 0), 0)
    assert.strictEqual(mat.intAt(2, 1), 0)
    assert.strictEqual(mat.intAt(2, 2), 1)

    mat.delete()
  }
})

QUnit.test('test_mat_operations', function(assert) {
  // test minMaxLoc
  {
    const src = cv.Mat.ones(4, 4, cv.CV_8UC1)

    src.data[2] = 0
    src.data[5] = 2

    const result = cv.minMaxLoc(src)

    assert.strictEqual(result.minVal, 0)
    assert.strictEqual(result.maxVal, 2)
    assert.deepEqual(result.minLoc, {x: 2, y: 0})
    assert.deepEqual(result.maxLoc, {x: 1, y: 1})

    src.delete()
  }
})

QUnit.test('test_mat_roi', function(assert) {
  // test minMaxLoc
  {
    const mat = cv.matFromArray(2, 2, cv.CV_8UC1, [0, 1, 2, 3])
    const roi = mat.roi(new cv.Rect(1, 1, 1, 1))

    assert.strictEqual(roi.rows, 1)
    assert.strictEqual(roi.cols, 1)
    assert.deepEqual(roi.data, new Uint8Array([mat.ucharAt(1, 1)]))

    mat.delete()
    roi.delete()
  }
})


QUnit.test('test_mat_range', function(assert) {
  {
    const src = cv.matFromArray(2, 2, cv.CV_8UC1, [0, 1, 2, 3])
    let mat = src.colRange(0, 1)

    assert.strictEqual(mat.isContinuous(), false)
    assert.strictEqual(mat.rows, 2)
    assert.strictEqual(mat.cols, 1)
    assert.strictEqual(mat.ucharAt(0), 0)
    assert.strictEqual(mat.ucharAt(1), 2)

    mat.delete()

    mat = src.colRange({start: 0, end: 1})

    assert.strictEqual(mat.isContinuous(), false)
    assert.strictEqual(mat.rows, 2)
    assert.strictEqual(mat.cols, 1)
    assert.strictEqual(mat.ucharAt(0), 0)
    assert.strictEqual(mat.ucharAt(1), 2)

    mat.delete()

    mat = src.rowRange(1, 2)

    assert.strictEqual(mat.rows, 1)
    assert.strictEqual(mat.cols, 2)
    assert.deepEqual(mat.data, new Uint8Array([2, 3]))

    mat.delete()

    mat = src.rowRange({start: 1, end: 2})

    assert.strictEqual(mat.rows, 1)
    assert.strictEqual(mat.cols, 2)
    assert.deepEqual(mat.data, new Uint8Array([2, 3]))

    mat.delete()

    src.delete()
  }
})

QUnit.test('test_mat_diag', function(assert) {
  // test diag
  {
    const mat = cv.matFromArray(3, 3, cv.CV_8UC1, [0, 1, 2, 3, 4, 5, 6, 7, 8])
    const d = mat.diag()
    const d1 = mat.diag(1)
    const d2 = mat.diag(-1)

    assert.strictEqual(mat.isContinuous(), true)
    assert.strictEqual(d.isContinuous(), false)
    assert.strictEqual(d1.isContinuous(), false)
    assert.strictEqual(d2.isContinuous(), false)

    assert.strictEqual(d.ucharAt(0), 0)
    assert.strictEqual(d.ucharAt(1), 4)
    assert.strictEqual(d.ucharAt(2), 8)

    assert.strictEqual(d1.ucharAt(0), 1)
    assert.strictEqual(d1.ucharAt(1), 5)

    assert.strictEqual(d2.ucharAt(0), 3)
    assert.strictEqual(d2.ucharAt(1), 7)

    mat.delete()
    d.delete()
    d1.delete()
    d2.delete()
  }
})
