// Cyrus Amalan
// camalan@ucsc.edu

class Triangle{
    constructor() {
        this.geometryType = "vertex";
        this.coordinates = [0.0, 0.0, 0.0];
        this.fillColor = [1.0, 1.0, 1.0, 1.0];
        this.dimension = 5;
    }

    render(){
        const [x, y] = this.coordinates;
        const [r, g, b, a] = this.fillColor;
        const scale = this.dimension / 200.0; // Calculate vertex offset

        // Set the color and size of the triangle in the WebGL context
        gl.uniform4f(u_FragColor, r, g, b, a);
        gl.uniform1f(u_Size, this.dimension);

        // Define vertices based on the position and calculated scale
        const vertices = [
            x, y,
            x + scale, y,
            x, y + scale
        ];

        // Call the function to draw the triangle with the defined vertices
        drawTriangle(vertices);
    }
}

class CustomTriangle{
    constructor(){
        this.type = "point";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5;
        this.vertices = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    }

    render(){
        var rgba = this.color;
        var size = this.size;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);
        drawTriangle(this.vertices);
    }
}

function drawTriangle3D(vertices) {
    const vertexCount = 3; // Number of vertices for a triangle

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}