import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Character {
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.loadModel('/assets/models/4cb4eabb-dda2-48be-a3d5-bf2ba2ec5db5.glb');
  }

  private loadModel(model: string) {
    let loader = new GLTFLoader();
    loader.load(model, (gltf) => {
      this.scene.add(gltf.scene);
    });
  }
}

export default Character;