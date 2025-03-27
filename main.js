import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import gsap from 'gsap';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// VARIABLES
let theme = 'light';
let lightSwitch = null;
let titleText = null;
let subtitleText = null;
let mixer;
let lampLight = null;
let isMobile = window.matchMedia('(max-width: 992px)').matches;
let canvas = document.querySelector('.experience-canvas');
const loaderWrapper = document.getElementById('loader-wrapper');
let clipNames = [
  'fan_rotation',
  'fan_rotation.001',
  'fan_rotation.002',
  'fan_rotation.003',
  'fan_rotation.004',
];


const audio = new Audio('/music.mp3');
const playPauseBtn = document.getElementById('playPauseBtn');

playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    icon.src = '/pause.png';
  } else {
    audio.pause();
    icon.src = '/play.png';
  }
});

// SCENE & CAMERA
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
let defaultCameraPos = {
  x: 1.009028643133046,
  y: 0.5463638814987481,
  z: 0.4983449671971262,
};
let defaultCamerRot = {
  x: -0.8313297556598935,
  y: 0.9383399492446749,
  z: 0.7240714481613063,
};
camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 0.9;
controls.maxDistance = 1.6;
controls.minAzimuthAngle = 0.2;
controls.maxAzimuthAngle = Math.PI * 0.78;
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI / 2;
controls.update();

// LOAD MODEL & ASSET
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load(
  'models/final_room2.glb',
  function (room) {
    loaderWrapper.style.display = 'none';

    const video = document.createElement('video');
    video.src = 'textures/arcane.mp4';
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.encoding = THREE.sRGBEncoding;

    room.scene.children.forEach((child) => {
      if (child.name !== 'Wall') {
        child.castShadow = true;
      }
      child.receiveShadow = true;

      if (child.name === 'Stand') {
        child.children[0].material = new THREE.MeshBasicMaterial({
          map: videoTexture,
        });
       // Show loading animation.
  var playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.then(_ => {
      // Automatic playback started!
      // Show playing UI.
    })
    .catch(error => {
      // Auto-play was prevented
      // Show paused UI.
    });
  }
      }

      if (child.name === 'CPU') {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0;
        child.children[0].material.color.set(0x999999);
        child.children[0].material.ior = 3;
        child.children[0].material.transmission = 2;
        child.children[0].material.opacity = 0.8;
        child.children[0].material.depthWrite = false;
        child.children[0].material.depthTest = false;
        child.children[1].material = new THREE.MeshPhysicalMaterial();
        child.children[1].material.roughness = 0;
        child.children[1].material.color.set(0x999999);
        child.children[1].material.ior = 3;
        child.children[1].material.transmission = 1;
        child.children[1].material.opacity = 0.8;
        child.children[1].material.depthWrite = false;
        child.children[1].material.depthTest = false;
      }

      if (child.name === 'Gun') {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0.5;
        child.children[0].material.color.set(0x333333);
        child.children[0].material.metalness = 0.9;
        child.children[0].material.transmission = 0;
        child.children[0].material.opacity = 1;
        child.children[1].material = new THREE.MeshPhysicalMaterial();
        child.children[1].material.roughness = 0.5;
        child.children[1].material.color.set(0x333333);
        child.children[1].material.metalness = 0.9;
        child.children[1].material.transmission = 0;
        child.children[1].material.opacity = 1;
      }

      if (child.name === 'CeTable') {
        child.children[0].material = new THREE.MeshPhysicalMaterial();
        child.children[0].material.roughness = 0.3;
        child.children[0].material.color.set(0x4A2F1A);
        child.children[0].material.metalness = 0;
        child.children[0].material.ior = 1.5;
        child.children[0].material.transmission = 0;
        child.children[0].material.opacity = 1;
        child.children[1].material = new THREE.MeshPhysicalMaterial();
        child.children[1].material.roughness = 0.3;
        child.children[1].material.color.set(0x4A2F1A);
        child.children[1].material.metalness = 0;
        child.children[1].material.ior = 1.5;
        child.children[1].material.transmission = 0;
        child.children[1].material.opacity = 1;
      }

      function applyVideoToMesh(object, targetName, videoTexture) {
        if (object.isMesh && object.name === targetName) {
          object.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
          });
        }
        if (object.children) {
          object.children.forEach((child) => {
            applyVideoToMesh(child, targetName, videoTexture);
          });
        }
      }

      if (child.name === 'Sketchfab_model') {
        const root = child.children[0];
        if (root) {
          applyVideoToMesh(root, 'Object_54', videoTexture);
        }
      }

      if (child.name === 'Lamp') {
        const lampX = child.position.x;
        const lampY = child.position.y;
        const lampZ = child.position.z;
        lampLight = new THREE.PointLight(0xffd700, 0.5, 3);
        lampLight.position.set(lampX, lampY, lampZ);
        lampLight.castShadow = true;
        lampLight.shadow.radius = 1;
        lampLight.shadow.mapSize.width = 720;
        lampLight.shadow.mapSize.height = 720;
        lampLight.shadow.bias = -0.002;
        scene.add(lampLight);
      }


      if (child.name === 'SwitchBoard') {
        lightSwitch = child.children[0];
      }
    });

    

    scene.add(room.scene);
    animate();

    mixer = new THREE.AnimationMixer(room.scene);
    const clips = room.animations;
    clipNames.forEach((clipName) => {
      const clip = THREE.AnimationClip.findByName(clips, clipName);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
      }
    });

    loadIntroText();
    logoListener();
    aboutMeListener();
    init3DWorldClickListeners();
    initResponsive(room.scene);
  },
  function (error) {
    console.error(error);
  }
);

// ADD LIGHT
const ambientLight = new THREE.AmbientLight(0xfff8e1, 0.6);
scene.add(ambientLight);
const roomLight = new THREE.PointLight(0xfff8e1, 2.5, 10);
roomLight.position.set(0.3, 2, 0.5);
roomLight.castShadow = true;
roomLight.shadow.radius = 5;
roomLight.shadow.mapSize.width = 2048;
roomLight.shadow.mapSize.height = 2048;
roomLight.shadow.camera.far = 2.5;
roomLight.shadow.bias = -0.002;
scene.add(roomLight);

const fanLight1 = new THREE.PointLight(0xff0000, 30, 0.2);
const fanLight2 = new THREE.PointLight(0x00ff00, 30, 0.12);
const fanLight3 = new THREE.PointLight(0x00ff00, 30, 0.2);
const fanLight4 = new THREE.PointLight(0x00ff00, 30, 0.2);
const fanLight5 = new THREE.PointLight(0x00ff00, 30, 0.05);
fanLight1.position.set(0, 0.29, -0.29);
fanLight2.position.set(-0.15, 0.29, -0.29);
fanLight3.position.set(0.21, 0.29, -0.29);
fanLight4.position.set(0.21, 0.19, -0.29);
fanLight5.position.set(0.21, 0.08, -0.29);
scene.add(fanLight1);
scene.add(fanLight2);
scene.add(fanLight3);
scene.add(fanLight4);
scene.add(fanLight5);

const pointLight1 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight2 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight3 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight4 = new THREE.PointLight(0xff0000, 0, 1.1);
const pointLight5 = new THREE.PointLight(0xff0000, 0, 1.1);
pointLight1.position.set(-0.2, 0.6, 0.24);
pointLight2.position.set(-0.2, 0.6, 0.42);
pointLight3.position.set(-0.2, 0.6, 0.01);
pointLight4.position.set(-0.2, 0.6, -0.14);
pointLight5.position.set(1.2, 1, -0.14);


// ... (everything up to the last line I wrote: scene.add(pointLight5);) ...

scene.add(pointLight1);
scene.add(pointLight2);
scene.add(pointLight3);
scene.add(pointLight4);
scene.add(pointLight5);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

function loadIntroText() {
  const loader = new FontLoader();
  loader.load('fonts/unione.json', function (font) {
    const textMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ];
    const titleGeo = new TextGeometry('ITS LAKSH', {
      font: font,
      size: 0.08,
      height: 0.01,
    });
    titleText = new THREE.Mesh(titleGeo, textMaterials);
    titleText.rotation.y = Math.PI * 0.5;
    titleText.position.set(-0.27, 0.55, 0.5);
    scene.add(titleText);
  });

  loader.load('fonts/helvatica.json', function (font) {
    const textMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0xffffff }),
    ];
    const subTitleGeo = new TextGeometry(
      'Web Designer / Developer / AI Expert',
      {
        font: font,
        size: 0.018,
        height: 0,
      }
    );
    subtitleText = new THREE.Mesh(subTitleGeo, textMaterials);
    subtitleText.rotation.y = Math.PI * 0.5;
    subtitleText.position.set(-0.255, 0.5, 0.5);
    scene.add(subtitleText);
  });
}

function switchTheme(themeType) {
  if (themeType === 'dark') {
    lightSwitch.rotation.z = Math.PI / 7;
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');

    gsap.to(roomLight.color, {
      r: 0.27254901960784313,
      g: 0.23137254901960785,
      b: 0.6862745098039216,
    });
    gsap.to(ambientLight.color, {
      r: 0.17254901960784313,
      g: 0.23137254901960785,
      b: 0.6862745098039216,
    });
    gsap.to(roomLight, { intensity: 1.5 });
    gsap.to(ambientLight, { intensity: 0.3 });

    gsap.to(fanLight5, { distance: 0.07 });

    gsap.to(titleText.material[0].color, { r: 8, g: 8, b: 8, duration: 0 });
    gsap.to(titleText.material[1].color, { r: 5, g: 5, b: 5, duration: 0 });
    gsap.to(subtitleText.material[0].color, { r: 8, g: 8, b: 8, duration: 0 });
    gsap.to(subtitleText.material[1].color, { r: 5, g: 5, b: 5, duration: 0 });

    gsap.to(pointLight1, { intensity: 0.6 });
    gsap.to(pointLight2, { intensity: 0.6 });
    gsap.to(pointLight3, { intensity: 0.6 });
    gsap.to(pointLight4, { intensity: 0.6 });
  } else {
    lightSwitch.rotation.z = 0;
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');

    gsap.to(roomLight.color, { r: 1, g: 1, b: 1 });
    gsap.to(ambientLight.color, { r: 1, g: 1, b: 1 });
    gsap.to(roomLight, { intensity: 2.5 });
    gsap.to(ambientLight, { intensity: 0.6 });

    gsap.to(fanLight5, { distance: 0.05 });

    gsap.to(titleText.material[0].color, {
      r: 0.09019607843137255,
      g: 0.12156862745098039,
      b: 0.15294117647058825,
      duration: 0,
    });
    gsap.to(titleText.material[1].color, { r: 1, g: 1, b: 1, duration: 0 });
    gsap.to(subtitleText.material[0].color, {
      r: 0.09019607843137255,
      g: 0.12156862745098039,
      b: 0.15294117647058825,
      duration: 0,
    });
    gsap.to(subtitleText.material[1].color, { r: 1, g: 1, b: 1, duration: 0 });

    gsap.to(pointLight1, { intensity: 0 });
    gsap.to(pointLight2, { intensity: 0 });
    gsap.to(pointLight3, { intensity: 0 });
    gsap.to(pointLight4, { intensity: 0 });
  }
}

function enableOrbitControls() {
  controls.enabled = true;
}

function disableOrbitControls() {
  controls.enabled = false;
}

function enableCloseBtn() {
  document.getElementById('close-btn').style.display = 'block';
}

function disableCloseBtn() {
  document.getElementById('close-btn').style.display = 'none';
}



function resetCamera() {
  disableCloseBtn();
  socialMeshes.forEach((mesh) => (mesh.visible = false)); // Hide icons
  gsap.to(camera.position, {
    ...defaultCameraPos,
    duration: 1.5,
  });
  gsap.to(camera.rotation, {
    ...defaultCamerRot,
    duration: 1.5,
  });
  gsap.delayedCall(1.5, enableOrbitControls);

  if (theme !== 'dark') {
    gsap.to(roomLight, { intensity: 2.5, duration: 1.5 });
  }
}


function logoListener() {
  document.getElementById('logo').addEventListener('click', function (e) {
    e.preventDefault();
    resetCamera();
  });
}



function init3DWorldClickListeners() {
  const mousePosition = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let intersects;

  window.addEventListener('click', function (e) {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    const closeBtn = document.getElementById('close-btn');
    const projectsBtn = document.getElementById('projects-menu');
    if (
      e.target === closeBtn ||
      closeBtn.contains(e.target) ||
      e.target === projectsBtn ||
      projectsBtn.contains(e.target)
    ) {
      return false;
    }

    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mousePosition, camera);
    intersects = raycaster.intersectObjects(scene.children);
    intersects.forEach((intersect) => {
      if (intersect.object.name === 'project') {
        intersect.object.userData.url && window.open(intersect.object.userData.url);
      }
      if (intersect.object.name === 'linkedin' || 
          intersect.object.name === 'instagram' || 
          intersect.object.name === 'discord') {
        window.open(intersect.object.userData.url, '_blank');
      }
      if (intersect.object.name === 'SwitchBoard' || intersect.object.name === 'Switch') {
        theme = newTheme;
        switchTheme(theme);
      }
    });
  });
}

function initResponsive(roomScene) {
  if (isMobile) {
    roomScene.scale.set(0.95, 0.95, 0.95);
    aboutCameraPos = { x: 0.09, y: 0.23, z: 0.51 };
    aboutCameraRot = { x: -1.57, y: 0, z: 1.57 };
    projectsCameraPos = { x: 1.1, y: 0.82, z: 0.5 };
    projectsCameraRot = { x: 0, y: 0, z: 1.55 };
    projects.forEach((project, i) => {
      project.mesh.position.z = -1.13;
    });
    controls.maxDistance = 1.5;
    controls.maxAzimuthAngle = Math.PI * 0.75;
  }
}

document.getElementById('close-btn').addEventListener('click', (e) => {
  e.preventDefault();
  resetCamera();
});

document.getElementById('contact-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.contact-menu__dropdown').classList.toggle('contact-menu__dropdown--open');
});

document.addEventListener('mouseup', (e) => {
  const container = document.querySelector('.contact-menu');
  if (!container.contains(e.target)) {
    container.querySelector('.contact-menu__dropdown').classList.remove('contact-menu__dropdown--open');
  }
});


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});