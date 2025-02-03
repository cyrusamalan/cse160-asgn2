// Cyrus Amalan
// camalan@ucsc.edu

class Tube {
    constructor(radius = 1, height = 1, segments = 36) {
        this.radius = radius;
        this.height = height;
        this.segments = segments;
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        const color = this.color;
    
        // Set shader uniform values
        gl.uniform4f(u_FragColor, ...color);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        // Render different parts of the shape
        this.renderCaps();
        this.renderSideWalls();
    }
    

    renderCaps() {
        const angleStep = (2 * Math.PI) / this.segments;
        const halfHeight = this.height / 2;
    
        // Render top cap
        for (let i = 0; i < this.segments; i++) {
            const x1 = this.radius * Math.cos(i * angleStep);
            const y1 = this.radius * Math.sin(i * angleStep);
            const x2 = this.radius * Math.cos((i + 1) * angleStep);
            const y2 = this.radius * Math.sin((i + 1) * angleStep);
    
            drawTriangle3D([
                0, 0, halfHeight, // Center of the top cap
                x2, y2, halfHeight, // Next vertex
                x1, y1, halfHeight  // Current vertex
            ]);
        }
    
        // Render bottom cap
        for (let i = 0; i < this.segments; i++) {
            const x1 = this.radius * Math.cos(i * angleStep);
            const y1 = this.radius * Math.sin(i * angleStep);
            const x2 = this.radius * Math.cos((i + 1) * angleStep);
            const y2 = this.radius * Math.sin((i + 1) * angleStep);
    
            drawTriangle3D([
                0, 0, -halfHeight, // Center of the bottom cap
                x1, y1, -halfHeight, // Current vertex
                x2, y2, -halfHeight  // Next vertex
            ]);
        }
    }
    

    renderSideWalls() {
        const angleStep = (2 * Math.PI) / this.segments;
        const halfHeight = this.height / 2;
    
        for (let i = 0; i < this.segments; i++) {
            // Compute the coordinates of the current and next segment points
            const x0 = this.radius * Math.cos(i * angleStep);
            const y0 = this.radius * Math.sin(i * angleStep);
            const x1 = this.radius * Math.cos((i + 1) * angleStep);
            const y1 = this.radius * Math.sin((i + 1) * angleStep);
    
            // Draw the first triangle for the side wall
            drawTriangle3D([
                x0, y0, halfHeight,    // Top-left
                x1, y1, halfHeight,    // Top-right
                x0, y0, -halfHeight    // Bottom-left
            ]);
    
            // Draw the second triangle for the side wall
            drawTriangle3D([
                x1, y1, halfHeight,    // Top-right
                x1, y1, -halfHeight,   // Bottom-right
                x0, y0, -halfHeight    // Bottom-left
            ]);
        }
    }
}    
