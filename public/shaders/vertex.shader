attribute float alpha;
varying float vAlpha;

void main() {
    vAlpha = alpha;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * mvPosition;
}
