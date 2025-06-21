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

loader.load("podmostem.glb", function(gltf) {
    gltf.scene.position.set(-4.5, 0, 12)
    gltf.scene.scale.set(2, 2, 2)
    scene.add(gltf.scene);
}, undefined, function(e) {
    console.error(e);
});


const listener = new THREE.AudioListener();
camera.add( listener );

function loadAudio(audioLoader, sound) {
    audioLoader.load("drones/" + (Math.floor(Math.random() * 11) + 1) + ".mp3", function( buffer ) {
        sound.setBuffer(buffer);
        sound.setRefDistance(0.5);
        sound.onEnded = () => { sound.stop(); loadAudio(audioLoader, sound) };
        sound.play();
    });
}


// get cords for the sounds
for (let cord in cords) {
    const sound = new THREE.PositionalAudio( listener );
    const audioLoader = new THREE.AudioLoader();

    loadAudio(audioLoader, sound);

    const sphere = new THREE.BoxGeometry(0, 0, 0);
    const mesh = new THREE.Mesh(sphere);
    
    mesh.add( sound ); 

    mesh.position.copy(cords[cord])

    scene.add(mesh);

    // finally add the sound to the mesh
}


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

let steps = 100000;
let getFragment = createFragmentFunction(steps);

let i = steps + 1;

function animate() {
//    if (camera.position.distanceTo(destination) < 0.1) {
      if (i > steps) {
        do {
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
            steps = pos_vector.length() * 100;
        } while (steps < 1 || steps == NaN);

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

const banks = [
    3,
    2,
    5,
    3, 
    11,
    3,
    7,
    16,
]

let timeout = false;
let strobing = false;
const glazmo = document.getElementById("GLAZMO");

function onMIDIMessage(event) {
    if (timeout || event.data[1] == 1) {
        return;
    }

    const bank = event.data[1] - 35;
    const sample = Math.floor(Math.random() * banks[bank - 1]);
    const audio = new Audio('impakts/' + bank + '-' + sample + '.mp3');
    let interval = setInterval(function() {
        glazmo.style.display = strobing ? "block" : "none";
        strobing = !strobing;
    }, 10);
    audio.volume = 0.5;
    audio.play();
    audio.onended = () => { clearInterval(interval); glazmo.style.display = "none"; };
    timeout = true;
    setTimeout(() => timeout = false, 250);


    // UZ JENOM STROBOSKOPY A MAME HOTOVO
    // a mozna jeste jeden scan
}

function onMIDISuccess(midi) {
  console.log("MIDI ready!");
  for (const entry of midi.inputs) {
    const i = entry[1];
    if (i.name == "LPD8:LPD8 MIDI 1 20:0") {
        i.onmidimessage = onMIDIMessage;
        console.log(entry)
        break;
    }
  }
}



function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);


