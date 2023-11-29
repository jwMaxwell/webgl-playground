void mainImage( out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = (fragCoord * 2. - iResolution.xy) / iResolution.y; 
  vec3 ch0 = texture(iChannel2, fract(uv)).xyz;
  vec3 ch1 = texture(iChannel0, fract(uv)).xyz;
  ch0 *= length(uv) * abs(sin(iTime)) * ch1;
  fragColor = vec4(ch0, 1.);
}