import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(-7, 2, 10).normalize();
light.rotation.y = -.7;
//light.intensity = 0.5;
scene.add(light);

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

// todo maybe create some way to set cords to which it should go
// and use analyticka geometrie

let destination = cords[0];
let pos_vector;
let fragment = 0.005;
let rotation;

function animate() {
    if (camera.position.distanceTo(destination) < 0.0001) {
        destination = cords[Math.floor(Math.random() * cords.length)];
        // BAHAHAHAAH ANALYTICKA GEOMETRIE ZMRDI
        pos_vector = new THREE.Vector3(
            destination.x - camera.position.x,
            destination.y - camera.position.y,
            destination.z - camera.position.z,
        );
        rotation = pos_vector.angleTo(new THREE.Vector3(0, 0, -1));
        return;
    }

    camera.position.x += pos_vector.x * fragment;
    camera.position.y += pos_vector.y * fragment;
    camera.position.z += pos_vector.z * fragment;
    camera.rotation.y += rotation * fragment; 

    renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );
