/*///////////////////////////////// ABOUT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*\

  TEXTURE ASSETS

\*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ * /////////////////////////////////////*/

import { SNA, ConsoleStyler } from '@ursys/core';
import * as THREE from 'three';
import { HookGamePhase } from '../game-run.ts';

/// TYPE DECLARATIONS /////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/// CONSTANTS & DECLARATIONS //////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DBG = true;
const LOG = console.log.bind(this);
const PR = ConsoleStyler('visual', 'TagGreen');
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const DEFAULT_PNG = '_datapack/underworld/sprites/default.png';
const TEX_LOADER = new THREE.TextureLoader();
const TEXTURES = {};

/// API METHODS ///////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** return a preloaded texture */
function GetTexture(texPath: string): THREE.Texture {
  return TEXTURES[texPath];
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** async load a texture and return it */
async function LoadTexture(texPath: string): Promise<THREE.Texture> {
  const texture = GetTexture(texPath);
  if (texture) return Promise.resolve(texture);
  // otherwise load it
  return new Promise((resolve, reject) => {
    TEX_LOADER.load(
      texPath,
      texture => {
        TEXTURES[texPath] = texture;
        resolve(texture);
      },
      undefined,
      err => {
        reject(err);
      }
    );
  });
}

/// EXPORTS ///////////////////////////////////////////////////////////////////
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
/** Invoked by HookGamePhase  in SNA_Module declaration */
async function INIT_LoadTextures() {
  const tex = await LoadTexture(DEFAULT_PNG);
}
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export default SNA.DeclareModule('textures', {
  PreHook: () => {
    HookGamePhase('INIT', async () => {
      LOG(...PR('loading default texture(s)'));
      await INIT_LoadTextures();
    });
  }
});
/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export { GetTexture, LoadTexture };
