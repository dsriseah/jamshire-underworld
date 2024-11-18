/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  RENDERER draws the game world's 3D and 2D elements. There are multiple
  "render passes" that draw different layers of the game. Uses the THREE
  ViewPort class to manage a WebGL renderer and camera.

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

import * as THREE from 'three';
import { SNA, ConsoleStyler } from '@ursys/core';
import { HookGamePhase } from '../game-run.ts';
import Viewport from './visual/class-viewport.ts';

/// TYPE DECLARATIONS /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
type RP_Name = 'bg' | 'fx0' | 'world' | 'fx1' | 'over' | 'hud';
type RP_Dictionary = { [key in RP_Name]?: THREE.Scene };

/// CONSTANTS & DECLARATIONS //////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DBG = true;
const LOG = console.log.bind(this);
const PR = ConsoleStyler('render', 'TagGreen');
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const RSTATE = {
  renderer: null,
  main: null,
  scene: null,
  cube: null,
  camera: null
};
const RP_DICT: RP_Dictionary = {};

/// HELPER METHODS ////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Init() {
  const renderer = new THREE.WebGLRenderer();
  const main = document.getElementById('main');
  main.appendChild(renderer.domElement);
  renderer.setSize(main.clientWidth, main.clientHeight);
  RSTATE.renderer = renderer;
  RSTATE.main = main;
  LOG(...PR('Renderer initialized'));
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function SetupScene() {
  const { renderer, main } = RSTATE;
  const camera = new THREE.PerspectiveCamera(
    75,
    main.clientWidth / main.clientHeight,
    0.1,
    1000
  );
  RSTATE.camera = camera;

  const scene = new THREE.Scene();
  RSTATE.scene = scene;

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  RSTATE.cube = cube;
  scene.add(cube);

  camera.position.z = 5;
  LOG(...PR('Scene setup complete'));
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
function Render() {
  const { renderer, scene, cube, camera } = RSTATE;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

/// API METHODS ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export default SNA.DeclareModule('renderer', {
  PreHook: () => {
    HookGamePhase('INIT', () => {
      LOG(...PR('Hooked into UWORLD/INIT'));
      Init();
      SetupScene();
    });
    HookGamePhase('DRAW_WORLD', () => {
      Render();
    });
  }
});
