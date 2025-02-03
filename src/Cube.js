class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        const [r, g, b, a] = this.color;

        // Apply transformation matrix
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Define cube faces with the colors
        this.drawFace([0, 0, 0, 1, 1, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0, 1, 1, 0], r, g, b, a); // Front
        this.drawFace([0, 0, 1, 1, 1, 1, 1, 0, 1], [0, 0, 1, 0, 1, 1, 1, 1, 1], r * 0.9, g * 0.9, b * 0.9, a); // Back
        this.drawFace([0, 1, 0, 1, 1, 0, 1, 1, 1], [0, 1, 1, 0, 1, 0, 1, 1, 1], r * 0.8, g * 0.8, b * 0.8, a); // Top
        this.drawFace([0, 0, 0, 0, 0, 1, 1, 0, 0], [1, 0, 0, 1, 0, 1, 0, 0, 1], r, g, b, a); // Bottom
        this.drawFace([0, 0, 0, 0, 1, 0, 0, 1, 1], [0, 1, 1, 0, 0, 0, 0, 0, 1], r, g, b, a); // Left
        this.drawFace([1, 0, 0, 1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 0, 0, 1, 0, 1], r, g, b, a); // Right
    }

    drawFace(triangle1, triangle2, r, g, b, a) {
        gl.uniform4f(u_FragColor, r, g, b, a);
        drawTriangle3D(triangle1);
        drawTriangle3D(triangle2);
    }
}
