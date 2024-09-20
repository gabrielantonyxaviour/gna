"use client"
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
class GameScene extends Phaser.Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    spaceKey!: Phaser.Input.Keyboard.Key;
    bullets!: Phaser.Physics.Arcade.Group;
    groundLayer!: Phaser.Tilemaps.TilemapLayer;
    propsLayer!: Phaser.Tilemaps.TilemapLayer;
    pubLayer!: Phaser.Tilemaps.TilemapLayer;
    inchLayer!: Phaser.Tilemaps.TilemapLayer;
    bgL2Layer!: Phaser.Tilemaps.TilemapLayer;
    enterButton!: Phaser.GameObjects.Text;
    enterGraveButton!: Phaser.GameObjects.Text;
    graveRails!: Phaser.Tilemaps.TilemapLayer;
    graveProps!: Phaser.Tilemaps.TilemapLayer;
    graveSalt!: Phaser.Tilemaps.TilemapLayer; 
    graveBg!: Phaser.Tilemaps.TilemapLayer;
    pubEntrance!: { x: number; y: number; width: number };
    graveEntrance!: { x: number; y: number; width: number };
  
    constructor() {
      super('GameScene');
    }
}