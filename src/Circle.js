// Cyrus Amalan
// camalan@ucsc.edu

class Circle {
    constructor() {
        this.type = 'circle'; // Type identifier for the shape
        this.position = [0.0, 0.0]; // Center
        this.color = [1.0, 1.0, 1.0, 1.0]; // Default
        this.size = 5.0; // Default
        this.segments = 12; // Default
    }

    render() {
        const [centerX, centerY] = this.position; // Center of the circle
        const color = this.color; // RGBA color of the circle
        const radius = this.size / 200.0; // Compute radius based on size
    
        // Set shader color
        gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
    
        const angleIncrement = 360 / this.segments; // Angle step for each segment
    
        // Generate and draw triangles
        for (let angle = 0; angle < 360; angle += angleIncrement) {
            const radianStart = (angle * Math.PI) / 180; // Convert start angle to radians
            const radianEnd = ((angle + angleIncrement) * Math.PI) / 180; // Convert end angle to radians
    
            // Compute triangle
            const vertexA = [
                centerX + Math.cos(radianStart) * radius,
                centerY + Math.sin(radianStart) * radius
            ];
            const vertexB = [
                centerX + Math.cos(radianEnd) * radius,
                centerY + Math.sin(radianEnd) * radius
            ];
    
            // Draw triangle
            drawTriangle([
                centerX, centerY, // Center vertex
                vertexA[0], vertexA[1], // First outer vertex
                vertexB[0], vertexB[1] // Second outer vertex
            ]);
        }
    }
}