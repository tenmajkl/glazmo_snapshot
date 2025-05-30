import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

var light = new THREE.SpotLight(0xffffff);
light.castShadow = true;
light.position.set(-6, 2, 8).normalize();
light.rotation.y = -.7;
scene.add(light);
scene.add(light.target);

const cords = [
    new THREE.Vector3(-6, 2, 8),
    new THREE.Vector3(1, 2, -4),
    new THREE.Vector3(4, 2, -7),
    new THREE.Vector3(3.4, 2, -6),
];

camera.position.z = 8;
camera.position.y = 2;
camera.position.x = -6;
camera.rotation.y = -0.7;

const loader = new GLTFLoader();

loader.load("cave.glb", function(gltf) {
    scene.add(gltf.scene);
}, undefined, function(e) {
    console.error(e);
});

let destination = cords[0];
let pos_vector;
let rotation;

// todo doladit neco jako map ve wiringu?
function createFragmentFunction(steps) {
    let sum = 0;
    for (let i = 0; i < steps; i++) {
        sum += Math.sin((i*Math.PI)/steps);
    }

    return (x) => (1/sum) * Math.sin((Math.PI*x)/steps);
}

let steps = 200;
let getFragment = createFragmentFunction(steps);

let i = steps + 1;

function animate() {
//    if (camera.position.distanceTo(destination) < 0.1) {
      if (i > steps) {
        destination = cords[Math.floor(Math.random() * cords.length)];
        // BAHAHAHAAH ANALYTICKA GEOMETRIE ZMRDI
        pos_vector = new THREE.Vector3(
            destination.x - camera.position.x,
            destination.y - camera.position.y,
            destination.z - camera.position.z,
        );
        let direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        // rotace jsou divny
        rotation = pos_vector.angleTo(direction);
        steps = pos_vector.length() * 10;
        getFragment = createFragmentFunction(steps);

        i = 0;
    }

    let fragment = getFragment(i);
    i++;
    camera.position.x += pos_vector.x * fragment;
    camera.position.y += pos_vector.y * fragment;
    camera.position.z += pos_vector.z * fragment;
    camera.rotation.y += rotation * fragment; 

    light.position.copy(camera.position)
    let direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    light.target.position.copy(light.position.clone().add(direction));

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
