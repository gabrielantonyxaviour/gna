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
    preload() {
        this.load.image('background', '/sprites/Background/BaseColor.png');
        this.load.image('Tiles', '/sprites/Assets/Tiles.png');
        this.load.image('Props', '/sprites/Assets/Props-01.png');
        this.load.image('Buildings', '/sprites/Assets/Buildings.png');
        this.load.image('BackgroundProps', '/sprites/Background/BackgroundProps.png');
        this.load.image('1inch', '/sprites/Social/1inch_color_black.png');
        this.load.image('GraveTiles', '/sprites/Graveyard/graveTiles.png');
        this.load.image('Salt', '/sprites/Graveyard/Salt.png');
        this.load.image('Grass_background_2', '/sprites/Graveyard/Grass_background_2.png');
        this.load.image('pubinterior', '/sprites/pubInterior/pubinterior.png');
        this.load.image('logo1', '/sprites/logo1.png');
        this.load.tilemapTiledJSON('groundMap', '/sprites/jsons/groundup.json');
        this.load.tilemapTiledJSON('bgL2Map', '/sprites/jsons/bgL2.json');
        this.load.tilemapTiledJSON('pubInteriorMap', '/sprites/jsons/pubinterior.json');
        
      }
}