uniform vec3 color;
varying float vAlpha;

void main() {
    gl_FragColor = vec4(color, 1);
    gl_FragColor.a *= vAlpha;
}
