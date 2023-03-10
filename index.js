import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();

const table = new URL('../assets/scene.gltf', import.meta.url);


const loader = new GLTFLoader();
loader.load('assets/scene.gltf', function(gltf){
    const model = gltf.scene;
    //model.scale.set(0.01,0.01,0.01);
    scene.add(model);
});


// const loadertwo = new GLTFLoader();
// loader.load('item/scene.gltf', function(gltf){
//     const car = gltf.scene;
//     car.scale.set(0.006,0.006,0.006);
//     car.position.set(-1.5,0,0);
//     scene.add(car);
// });

const light = new THREE.DirectionalLight(0xfffffff,1);
light.position.set(2,2,5);
scene.add(light);



//Boilerplate code
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1 , 100);

camera.position.set(0,1,2);
scene.add(camera);



const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setClearColor(0xA3A3A3);

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
const controls = new OrbitControls( camera, renderer.domElement );


// function animate(){
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
// }
// animate();
const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(table.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

}, undefined, function(error) {
    console.error(error);
});

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// var action = mixer.clipAction(gltf.animations[0]);
// action.setLoop( THREE.LoopOnce );
// action.play();


window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

