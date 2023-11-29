vec3 palette(float t, vec3 z) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1., 1., 1.);
  vec3 d = vec3(0.263, 0.416, 0.557);
  return z * (a + b * cos(6.28318 * (c * t + d)));
}

float distanceField(vec3 position) {
  vec3 newPosition = position * 2. + iTime;
  return length(position) * log(length(position) + 1.) +
    sin(newPosition.x + sin(newPosition.z + sin(newPosition.y))) * 0.5 - 1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord * 2. - iResolution.xy) / iResolution.y * 0.7;
  vec2 sample0 = texture(iChannel0, uv * 0.1).xy;
  float dist = length(uv);
  vec3 accColor = vec3(0.);
  float offset = 2.5;

  for (int i = 0; i < 10; i++) {
    vec3 uv0 = vec3(0., 0., 5.) + normalize(vec3(uv, -1.)) * offset;
    float dist0 = distanceField(uv0);
    accColor = (accColor + smoothstep(2., 0., dist0)) * 
      (vec3(0.2, 0.3, 0.4) + vec3(5., 2., 3.) 
      * clamp((dist0 - distanceField(uv0 + 0.1)) / 2., -0.1, 1.));

    offset += min(dist0, 1.);
  }

  fragColor = vec4(palette(dist, accColor), 1.);
}