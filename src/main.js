const fragWrap = (str, channelCount) => {
  let channels = "";
  for (let i = 0; i < channelCount; i++) {
    channels += `uniform sampler2D iChannel${i};\n`;
  }
  return `uniform vec3      iResolution;
  uniform float     iTime;
  uniform float     iTimeDelta;
  uniform float     iFrameRate;
  uniform int       iFrame;
  uniform float     iChannelTime[4];
  uniform vec3      iChannelResolution[4];
  uniform vec4      iMouse;
  ${channels}
  ${str}
  void main() {
    vec4 fragColor;
    mainImage(fragColor, gl_FragCoord.xy);
    gl_FragColor = fragColor;
}`;
};

const init = async () => {
  // Set up base material
  let rawMaterial = {
    fragmentShader: "fragmentShader",
    uniforms: {
      iResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
      },
      iTime: { value: 0.0 },
      iTimeDelta: { value: 0.0 },
      iFrameRate: { value: 60.0 }, // Adjust the frame rate as needed
      iFrame: { value: 0 },
      iChannelTime: { value: [0.0, 0.0, 0.0, 0.0] },
      iChannelResolution: {
        value: [
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, 0),
        ],
      },
      iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
      iDate: { value: new THREE.Vector4() },
      iSampleRate: { value: 44100.0 },
    },
  };

  // Load textures and create material
  const textureLoader = new THREE.TextureLoader();
  const channelRes = await fetch("./src/channels.json");
  const channels = JSON.parse(await channelRes.text());
  for (const n of Object.keys(channels)) {
    try {
      rawMaterial.uniforms[n] = textureLoader.load(channels[n]);
    } catch (e) {
      console.error("Error loading texture:", e);
    }
  }

  // Load shader code
  const shaderRes = await fetch("../shader.frag");
  const fragmentShader = fragWrap(
    await shaderRes.text(),
    Object.keys(channels).length
  );
  rawMaterial.fragmentShader = fragmentShader;

  const material = new THREE.ShaderMaterial(rawMaterial);

  // Set up renderer, camera, and scene
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const canvas = document.querySelector("canvas");
  const camera = new THREE.PerspectiveCamera(
    10,
    canvas.width / canvas.height,
    0.1,
    1000
  );
  camera.position.z = 5;

  const geometry = new THREE.PlaneGeometry(2, 2);
  const plane = new THREE.Mesh(geometry, material);

  const scene = new THREE.Scene();
  scene.add(plane);

  // Handle resize event
  const handleResize = () => {
    material.uniforms.iResolution.value.set(
      window.innerWidth,
      window.innerHeight,
      1
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener("resize", handleResize);

  // Start rendering loop
  const render = () => {
    requestAnimationFrame(render);
    material.uniforms.iTime.value += 0.01;
    renderer.render(scene, camera);
  };

  render();
};

// Call the init function
init();
