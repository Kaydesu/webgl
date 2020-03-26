function Point4() {
    this.create = function (x, y, z, w) {
        var p = new Float32Array(4);
        p[0] = 0;
        p[1] = 0;
        p[2] = 0;
        p[3] = 1;
        if (arguments.length >= 1) p[0] = x;
        if (arguments.length >= 2) p[1] = y;
        if (arguments.length >= 3) p[2] = z;
        if (arguments.length >= 4) p[3] = w;
        return p;
    };

    /** ---------------------------------------------------------------------
     * @return Float32Array A new 4-component point that has the same values as the input argument
     */
    this.createFrom = function (from) {
        var p = new Float32Array(4);
        p[0] = from[0];
        p[1] = from[1];
        p[2] = from[2];
        p[3] = from[3];
        return p;
    };

    /** ---------------------------------------------------------------------
     * to = from (copy the 2nd argument point to the first argument)
     */
    this.copy = function (to, from) {
        to[0] = from[0];
        to[1] = from[1];
        to[2] = from[2];
        to[3] = from[3];
    };

    /** ---------------------------------------------------------------------
     * @return Number The distance between 2 points
     */
    this.distanceBetween = function (p1, p2) {
        var dx = p1[0] - p2[0];
        var dy = p1[1] - p2[1];
        var dz = p1[2] - p2[2];
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    /** ---------------------------------------------------------------------
     * Normalize the point by dividing by its homogeneous coordinate w
     */
    this.normalize = function (p) {
        if (p[3] !== 0) {
            p[0] = p[0] / p[3];
            p[1] = p[1] / p[3];
            p[2] = p[2] / p[3];
            p[3] = 1;
        }
    };

    /** ---------------------------------------------------------------------
     * Print the vector on the console.
     */
    this.print = function (name, p) {
        var maximum = Math.max(p[0], p[1], p[2], p[3]);
        var order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
        var digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

        console.log("Point4: " + name + ": "
            + p[0].toFixed(digits) + " "
            + p[1].toFixed(digits) + " "
            + p[2].toFixed(digits) + " "
            + p[3].toFixed(digits));
    };
}

function Vector3() {
    /** ---------------------------------------------------------------------
   * Create a new 3-component vector.
   * @param dx Number The change in x of the vector.
   * @param dy Number The change in y of the vector.
   * @param dz Number The change in z of the vector.
   * @return Float32Array A new 3-component vector
   */
    this.create = function (dx, dy, dz) {
        var v = new Float32Array(3);
        v[0] = 0;
        v[1] = 0;
        v[2] = 0;
        if (arguments.length >= 1) { v[0] = dx; }
        if (arguments.length >= 2) { v[1] = dy; }
        if (arguments.length >= 3) { v[2] = dz; }
        return v;
    };

    /** ---------------------------------------------------------------------
     * Create a new 3-component vector and set its components equal to an existing vector.
     * @param from Float32Array An existing vector.
     * @return Float32Array A new 3-component vector with the same values as "from"
     */
    this.createFrom = function (from) {
        var v = new Float32Array(3);
        v[0] = from[0];
        v[1] = from[1];
        v[2] = from[2];
        return v;
    };

    /** ---------------------------------------------------------------------
     * Create a vector using two existing points.
     * @param tail Float32Array A 3-component point.
     * @param head Float32Array A 3-component point.
     * @return Float32Array A new 3-component vector defined by 2 points
     */
    this.createFrom2Points = function (tail, head) {
        var v = new Float32Array(3);
        this.subtract(v, head, tail);
        return v;
    };

    /** ---------------------------------------------------------------------
     * Copy a 3-component vector into another 3-component vector
     * @param to Float32Array A 3-component vector that you want changed.
     * @param from Float32Array A 3-component vector that is the source of data
     * @returns Float32Array The "to" 3-component vector
     */
    this.copy = function (to, from) {
        to[0] = from[0];
        to[1] = from[1];
        to[2] = from[2];
        return to;
    };

    /** ---------------------------------------------------------------------
     * Set the components of a 3-component vector.
     * @param v Float32Array The vector to change.
     * @param dx Number The change in x of the vector.
     * @param dy Number The change in y of the vector.
     * @param dz Number The change in z of the vector.
     */
    this.set = function (v, dx, dy, dz) {
        v[0] = dx;
        v[1] = dy;
        v[2] = dz;
    };

    /** ---------------------------------------------------------------------
     * Calculate the length of a vector.
     * @param v Float32Array A 3-component vector.
     * @return Number The length of a vector
     */
    this.length = function (v) {
        return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    };

    /** ---------------------------------------------------------------------
     * Make a vector have a length of 1.
     * @param v Float32Array A 3-component vector.
     * @return Float32Array The input vector normalized to unit length. Or null if the vector is zero length.
     */
    this.normalize = function (v) {
        var length, percent;

        length = this.length(v);
        if (Math.abs(length) < 0.0000001) {
            return null; // Invalid vector
        }

        percent = 1.0 / length;
        v[0] = v[0] * percent;
        v[1] = v[1] * percent;
        v[2] = v[2] * percent;
        return v;
    };

    /** ---------------------------------------------------------------------
     * Add two vectors:  result = V0 + v1
     * @param result Float32Array A 3-component vector.
     * @param v0 Float32Array A 3-component vector.
     * @param v1 Float32Array A 3-component vector.
     */
    this.add = function (result, v0, v1) {
        result[0] = v0[0] + v1[0];
        result[1] = v0[1] + v1[1];
        result[2] = v0[2] + v1[2];
    };

    /** ---------------------------------------------------------------------
     * Subtract two vectors:  result = v0 - v1
     * @param result Float32Array A 3-component vector.
     * @param v0 Float32Array A 3-component vector.
     * @param v1 Float32Array A 3-component vector.
     */
    this.subtract = function (result, v0, v1) {
        result[0] = v0[0] - v1[0];
        result[1] = v0[1] - v1[1];
        result[2] = v0[2] - v1[2];
    };

    /** ---------------------------------------------------------------------
     * Scale a vector:  result = s * v0
     * @param result Float32Array A 3-component vector.
     * @param v0 Float32Array A 3-component vector.
     * @param s Number A scale factor.
     */
    this.scale = function (result, v0, s) {
        result[0] = v0[0] * s;
        result[1] = v0[1] * s;
        result[2] = v0[2] * s;
    };

    /** ---------------------------------------------------------------------
     * Calculate the cross product of 2 vectors: result = v0 x v1 (order matters)
     * @param result Float32Array A 3-component vector.
     * @param v0 Float32Array A 3-component vector.
     * @param v1 Float32Array A 3-component vector.
     */
    this.crossProduct = function (result, v0, v1) {
        result[0] = v0[1] * v1[2] - v0[2] * v1[1];
        result[1] = v0[2] * v1[0] - v0[0] * v1[2];
        result[2] = v0[0] * v1[1] - v0[1] * v1[0];
    };

    /** ---------------------------------------------------------------------
     * Calculate the dot product of 2 vectors
     * @param v0 Float32Array A 3-component vector.
     * @param v1 Float32Array A 3-component vector.
     * @return Number Float32Array The dot product of v0 and v1
     */
    this.dotProduct = function (v0, v1) {
        return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
    };

    /** ---------------------------------------------------------------------
     * Print a vector on the console.
     * @param name String A description of the vector to be printed.
     * @param v Float32Array A 3-component vector.
     */
    this.print = function (name, v) {
        var maximum, order, digits;

        maximum = Math.max(v[0], v[1], v[2]);
        order = Math.floor(Math.log(maximum) / Math.LN10 + 0.000000001);
        digits = (order <= 0) ? 5 : (order > 5) ? 0 : (5 - order);

        console.log("Vector3: " + name + ": " + v[0].toFixed(digits) + " "
            + v[1].toFixed(digits) + " "
            + v[2].toFixed(digits));
    };
}

function Matrix4() {
    /** -----------------------------------------------------------------
   * @return Float32Array returns an uninitialized matrix.
   */
    this.create = function () {
        return new Float32Array(16);
    };

    // Temporary matrices and vectors for calculations. They are reused to
    // prevent new objects from being constantly re-created and then garbage
    // collected.
    var T1, T2, V, v3, P, p4, axis_of_rotation, u, v, n, center, eye, up;

    T1 = this.create();
    T2 = this.create();
    V = new Vector3();
    v3 = V.create();
    P = new Point4();
    p4 = P.create();
    axis_of_rotation = V.create();
    u = V.create();
    v = V.create();
    n = V.create();
    center = V.create();
    eye = V.create();
    up = V.create();

    /** -----------------------------------------------------------------
     * M = I (identity Matrix)
     */
    this.setIdentity = function (M) {
        M[0] = 1; M[4] = 0; M[8] = 0; M[12] = 0;
        M[1] = 0; M[5] = 1; M[9] = 0; M[13] = 0;
        M[2] = 0; M[6] = 0; M[10] = 1; M[14] = 0;
        M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;
    };

    /** -----------------------------------------------------------------
     * @return number Convert the input angle in degrees to radians
     */
    this.toRadians = function (angleInDegrees) {
        return angleInDegrees * 0.017453292519943295;  // Math.PI / 180
    };

    /** -----------------------------------------------------------------
     * @return number Convert the input angle in radians to degrees
     */
    this.toDegrees = function (angleInRadians) {
        return angleInRadians * 57.29577951308232;  // 180 / Math.PI
    };

    /** -----------------------------------------------------------------
     * To = From (an element-by-element copy)
     * @return To (a 16 element Float32Array)
     */
    this.copy = function (To, From) {
        var j;
        for (j = 0; j < 16; j += 1) {
            To[j] = From[j];
        }
        return To;
    };

    /** -----------------------------------------------------------------
     * R = A * B (Matrix Multiplication); NOTE: order matters!
     */
    this.multiply = function (R, A, B) {

        // A and B can't change during the operation.
        // If R is the same as A and/or B, Make copies of A and B
        // The comparison must use ==, not ===. We are comparing for identical
        // objects, not if two objects might have the same values.
        if (A == R) {
            A = this.copy(T1, A);
        }
        if (B == R) {
            B = this.copy(T2, B);
        }

        R[0] = A[0] * B[0] + A[4] * B[1] + A[8] * B[2] + A[12] * B[3];
        R[1] = A[1] * B[0] + A[5] * B[1] + A[9] * B[2] + A[13] * B[3];
        R[2] = A[2] * B[0] + A[6] * B[1] + A[10] * B[2] + A[14] * B[3];
        R[3] = A[3] * B[0] + A[7] * B[1] + A[11] * B[2] + A[15] * B[3];

        R[4] = A[0] * B[4] + A[4] * B[5] + A[8] * B[6] + A[12] * B[7];
        R[5] = A[1] * B[4] + A[5] * B[5] + A[9] * B[6] + A[13] * B[7];
        R[6] = A[2] * B[4] + A[6] * B[5] + A[10] * B[6] + A[14] * B[7];
        R[7] = A[3] * B[4] + A[7] * B[5] + A[11] * B[6] + A[15] * B[7];

        R[8] = A[0] * B[8] + A[4] * B[9] + A[8] * B[10] + A[12] * B[11];
        R[9] = A[1] * B[8] + A[5] * B[9] + A[9] * B[10] + A[13] * B[11];
        R[10] = A[2] * B[8] + A[6] * B[9] + A[10] * B[10] + A[14] * B[11];
        R[11] = A[3] * B[8] + A[7] * B[9] + A[11] * B[10] + A[15] * B[11];

        R[12] = A[0] * B[12] + A[4] * B[13] + A[8] * B[14] + A[12] * B[15];
        R[13] = A[1] * B[12] + A[5] * B[13] + A[9] * B[14] + A[13] * B[15];
        R[14] = A[2] * B[12] + A[6] * B[13] + A[10] * B[14] + A[14] * B[15];
        R[15] = A[3] * B[12] + A[7] * B[13] + A[11] * B[14] + A[15] * B[15];
    };

    /** -----------------------------------------------------------------
     * R = A * B * C * D ... (Matrix Multiplication); NOTE: order matters!
     */
    this.multiplySeries = function () {
        if (arguments.length >= 3) {
            this.multiply(arguments[0], arguments[1], arguments[2]);
            var j;
            for (j = 3; j < arguments.length; j += 1) {
                this.multiply(arguments[0], arguments[0], arguments[j]);
            }
        }
    };

    /** -----------------------------------------------------------------
     * r = M * v (M is a 4x4 matrix, v is a 3-component vector)
     */
    this.multiplyV3 = function (r, M, v) {

        // v can't change during the operation. If r and v are the same, make a copy of v
        if (r == v) {
            v = V.copy(v3, v);
        }

        r[0] = M[0] * v[0] + M[4] * v[1] + M[8] * v[2];
        r[1] = M[1] * v[0] + M[5] * v[1] + M[9] * v[2];
        r[2] = M[2] * v[0] + M[6] * v[1] + M[10] * v[2];
    };

    /** -----------------------------------------------------------------
     * r = M * p (M is a 4x4 matrix, p is a 4-component point)
     */
    this.multiplyP4 = function (r, M, p) {

        // p can't change during the operation, so make a copy of p.
        P.copy(p4, p);

        r[0] = M[0] * p4[0] + M[4] * p4[1] + M[8] * p4[2] + M[12] * p4[3];
        r[1] = M[1] * p4[0] + M[5] * p4[1] + M[9] * p4[2] + M[13] * p4[3];
        r[2] = M[2] * p4[0] + M[6] * p4[1] + M[10] * p4[2] + M[14] * p4[3];
        r[3] = M[3] * p4[0] + M[7] * p4[1] + M[11] * p4[2] + M[15] * p4[3];
    };

    /** -----------------------------------------------------------------
     * Console.log(name, M)
     */
    this.print = function (name, M) {
        var fieldSize = 11;
        var numText;
        var row, offset, rowText, number;
        console.log(name + ":");
        for (row = 0; row < 4; row += 1) {
            rowText = "";
            for (offset = 0; offset < 16; offset += 4) {
                number = Number(M[row + offset]);
                numText = number.toFixed(4);
                rowText += new Array(fieldSize - numText.length).join(" ") + numText;
            }
            console.log(rowText);
        }
    };

    /** -----------------------------------------------------------------
     * M = M' (transpose the matrix)
     */
    this.transpose = function (M) {
        var t;

        // The diagonal values don't move; 6 non-diagonal elements are swapped.
        t = M[1]; M[1] = M[4]; M[4] = t;
        t = M[2]; M[2] = M[8]; M[8] = t;
        t = M[3]; M[3] = M[12]; M[12] = t;
        t = M[6]; M[6] = M[9]; M[9] = t;
        t = M[7]; M[7] = M[13]; M[13] = t;
        t = M[11]; M[11] = M[14]; M[14] = t;
    };

    /** -----------------------------------------------------------------
     * Inv = M(-1) (Inv is set to the inverse of M)
     *
     */
    this.inverse = function (Inv, M) {
        /* Structure of matrix
    
             0   1   2   3
            ______________
         0 | 0   4   8  12
         1 | 1   5   9  13
         2 | 2   6  10  14
         3 | 3   7  11  15
        */

        // Factored out common terms
        var t9_14_13_10 = M[9] * M[14] - M[13] * M[10];
        var t13_6_5_14 = M[13] * M[6] - M[5] * M[14];
        var t5_10_9_6 = M[5] * M[10] - M[9] * M[6];
        var t12_10_8_14 = M[12] * M[10] - M[8] * M[14];
        var t4_14_12_6 = M[4] * M[14] - M[12] * M[6];
        var t8_6_4_10 = M[8] * M[6] - M[4] * M[10];
        var t8_13_12_9 = M[8] * M[13] - M[12] * M[9];
        var t12_5_4_13 = M[12] * M[5] - M[4] * M[13];
        var t4_9_8_5 = M[4] * M[9] - M[8] * M[5];
        var t1_14_13_2 = M[1] * M[14] - M[13] * M[2];
        var t9_2_1_10 = M[9] * M[2] - M[1] * M[10];
        var t12_2_0_14 = M[12] * M[2] - M[0] * M[14];
        var t0_10_8_2 = M[0] * M[10] - M[8] * M[2];
        var t0_13_12_1 = M[0] * M[13] - M[12] * M[1];
        var t8_1_0_9 = M[8] * M[1] - M[0] * M[9];
        var t1_6_5_2 = M[1] * M[6] - M[5] * M[2];
        var t4_2_0_6 = M[4] * M[2] - M[0] * M[6];
        var t0_5_4_1 = M[0] * M[5] - M[4] * M[1];

        Inv[0] = M[7] * t9_14_13_10 + M[11] * t13_6_5_14 + M[15] * t5_10_9_6;
        Inv[4] = M[7] * t12_10_8_14 + M[11] * t4_14_12_6 + M[15] * t8_6_4_10;
        Inv[8] = M[7] * t8_13_12_9 + M[11] * t12_5_4_13 + M[15] * t4_9_8_5;
        Inv[12] = M[6] * -t8_13_12_9 + M[10] * -t12_5_4_13 + M[14] * -t4_9_8_5;
        Inv[1] = M[3] * -t9_14_13_10 + M[11] * t1_14_13_2 + M[15] * t9_2_1_10;
        Inv[5] = M[3] * -t12_10_8_14 + M[11] * t12_2_0_14 + M[15] * t0_10_8_2;
        Inv[9] = M[3] * -t8_13_12_9 + M[11] * t0_13_12_1 + M[15] * t8_1_0_9;
        Inv[13] = M[2] * t8_13_12_9 + M[10] * -t0_13_12_1 + M[14] * -t8_1_0_9;
        Inv[2] = M[3] * -t13_6_5_14 + M[7] * -t1_14_13_2 + M[15] * t1_6_5_2;
        Inv[6] = M[3] * -t4_14_12_6 + M[7] * -t12_2_0_14 + M[15] * t4_2_0_6;
        Inv[10] = M[3] * -t12_5_4_13 + M[7] * -t0_13_12_1 + M[15] * t0_5_4_1;
        Inv[14] = M[2] * t12_5_4_13 + M[6] * t0_13_12_1 + M[14] * -t0_5_4_1;
        Inv[3] = M[3] * -t5_10_9_6 + M[7] * -t9_2_1_10 + M[11] * -t1_6_5_2;
        Inv[7] = M[3] * -t8_6_4_10 + M[7] * -t0_10_8_2 + M[11] * -t4_2_0_6;
        Inv[11] = M[3] * -t4_9_8_5 + M[7] * -t8_1_0_9 + M[11] * -t0_5_4_1;
        Inv[15] = M[2] * t4_9_8_5 + M[6] * t8_1_0_9 + M[10] * t0_5_4_1;

        var det;
        det =
            M[3] * (M[6] * -t8_13_12_9 + M[10] * -t12_5_4_13 + M[14] * -t4_9_8_5) +
            M[7] * (M[2] * t8_13_12_9 + M[10] * -t0_13_12_1 + M[14] * -t8_1_0_9) +
            M[11] * (M[2] * t12_5_4_13 + M[6] * t0_13_12_1 + M[14] * -t0_5_4_1) +
            M[15] * (M[2] * t4_9_8_5 + M[6] * t8_1_0_9 + M[10] * t0_5_4_1);

        if (det !== 0) {
            var j;
            var scale = 1 / det;
            for (j = 0; j < 16; j += 1) {
                Inv[j] = Inv[j] * scale;
            }
        }
    };

    this.scale = function (M, sx, sy, sz) {
        M[0] = sx; M[4] = 0; M[8] = 0; M[12] = 0;
        M[1] = 0; M[5] = sy; M[9] = 0; M[13] = 0;
        M[2] = 0; M[6] = 0; M[10] = sz; M[14] = 0;
        M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;
    };

    this.translate = function (M, dx, dy, dz) {
        M[0] = 1; M[4] = 0; M[8] = 0; M[12] = dx;
        M[1] = 0; M[5] = 1; M[9] = 0; M[13] = dy;
        M[2] = 0; M[6] = 0; M[10] = 1; M[14] = dz;
        M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;
    };

    this.rotate = function (M, angle, x_axis, y_axis, z_axis) {
        var s, c, c1, xy, yz, zx, xs, ys, zs, ux, uy, uz;

        angle = this.toRadians(angle);

        s = Math.sin(angle);
        c = Math.cos(angle);

        if (x_axis !== 0 && y_axis === 0 && z_axis === 0) {
            // Rotation around the X axis
            if (x_axis < 0) {
                s = -s;
            }

            M[0] = 1; M[4] = 0; M[8] = 0; M[12] = 0;
            M[1] = 0; M[5] = c; M[9] = -s; M[13] = 0;
            M[2] = 0; M[6] = s; M[10] = c; M[14] = 0;
            M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;

        } else if (x_axis === 0 && y_axis !== 0 && z_axis === 0) {
            // Rotation around Y axis
            if (y_axis < 0) {
                s = -s;
            }

            M[0] = c; M[4] = 0; M[8] = s; M[12] = 0;
            M[1] = 0; M[5] = 1; M[9] = 0; M[13] = 0;
            M[2] = -s; M[6] = 0; M[10] = c; M[14] = 0;
            M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;

        } else if (x_axis === 0 && y_axis === 0 && z_axis !== 0) {
            // Rotation around Z axis
            if (z_axis < 0) {
                s = -s;
            }

            M[0] = c; M[4] = -s; M[8] = 0; M[12] = 0;
            M[1] = s; M[5] = c; M[9] = 0; M[13] = 0;
            M[2] = 0; M[6] = 0; M[10] = 1; M[14] = 0;
            M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;

        } else {
            // Rotation around any arbitrary axis
            axis_of_rotation[0] = x_axis;
            axis_of_rotation[1] = y_axis;
            axis_of_rotation[2] = z_axis;
            V.normalize(axis_of_rotation);
            ux = axis_of_rotation[0];
            uy = axis_of_rotation[1];
            uz = axis_of_rotation[2];

            c1 = 1 - c;

            M[0] = c + ux * ux * c1;
            M[1] = uy * ux * c1 + uz * s;
            M[2] = uz * ux * c1 - uy * s;
            M[3] = 0;

            M[4] = ux * uy * c1 - uz * s;
            M[5] = c + uy * uy * c1;
            M[6] = uz * uy * c1 + ux * s;
            M[7] = 0;

            M[8] = ux * uz * c1 + uy * s;
            M[9] = uy * uz * c1 - ux * s;
            M[10] = c + uz * uz * c1;
            M[11] = 0;

            M[12] = 0;
            M[13] = 0;
            M[14] = 0;
            M[15] = 1;
        }
    };
    this.createOrthographic = function (left, right, bottom, top, near, far) {
        var M = this.create();

        // Make sure there is no division by zero
        if (left === right || bottom === top || near === far) {
            console.log("Invalid createOrthographic parameters");
            this.setIdentity(M);
            return M;
        }

        var widthRatio = 1.0 / (right - left);
        var heightRatio = 1.0 / (top - bottom);
        var depthRatio = 1.0 / (far - near);

        var sx = 2 * widthRatio;
        var sy = 2 * heightRatio;
        var sz = -2 * depthRatio;

        var tx = -(right + left) * widthRatio;
        var ty = -(top + bottom) * heightRatio;
        var tz = -(far + near) * depthRatio;

        M[0] = sx; M[4] = 0; M[8] = 0; M[12] = tx;
        M[1] = 0; M[5] = sy; M[9] = 0; M[13] = ty;
        M[2] = 0; M[6] = 0; M[10] = sz; M[14] = tz;
        M[3] = 0; M[7] = 0; M[11] = 0; M[15] = 1;

        return M;
    }
    this.createPerspective = function (fovy, aspect, near, far) {

        var M;

        if (fovy <= 0 || fovy >= 180 || aspect <= 0 || near >= far || near <= 0) {
            console.log('Invalid parameters to createPerspective');
            self.setIdentity(M);
        } else {
            var half_fovy = this.toRadians(fovy) / 2;

            var top = near * Math.tan(half_fovy);
            var bottom = -top;
            var right = top * aspect;
            var left = -right;

            M = this.createFrustum(left, right, bottom, top, near, far);
        }

        return M;
    }

    this.createFrustum = function (left, right, bottom, top, near, far) {

        var M = this.create();

        // Make sure there is no division by zero
        if (left === right || bottom === top || near === far) {
            console.log("Invalid createFrustum parameters");
            self.setIdentity(M);
        }
        if (near <= 0 || far <= 0) {
            console.log('For a perspective projection, the near and far distances must be positive');
            self.setIdentity(M);
        } else {

            var sx = 2 * near / (right - left);
            var sy = 2 * near / (top - bottom);

            var c2 = - (far + near) / (far - near);
            var c1 = 2 * near * far / (near - far);

            var tx = -near * (left + right) / (right - left);
            var ty = -near * (bottom + top) / (top - bottom);

            M[0] = sx; M[4] = 0; M[8] = 0; M[12] = tx;
            M[1] = 0; M[5] = sy; M[9] = 0; M[13] = ty;
            M[2] = 0; M[6] = 0; M[10] = c2; M[14] = c1;
            M[3] = 0; M[7] = 0; M[11] = -1; M[15] = 0;
        }

        return M;
    };

}

window.point4 = new Point4();
window.vec3 = new Vector3();
window.mat4 = new Matrix4();