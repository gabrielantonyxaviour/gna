"use client"
import { useEffect, useRef,useState } from 'react';
import Phaser from 'phaser';
import RetroConversationComponent from '@/components/Converstation';
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
    bgL2Logo!: Phaser.Tilemaps.TilemapLayer;
    enterButton!: Phaser.GameObjects.Text;
    exitButton!: Phaser.GameObjects.Text;

    enterGraveButton!: Phaser.GameObjects.Text;
    graveRails!: Phaser.Tilemaps.TilemapLayer;
    graveProps!: Phaser.Tilemaps.TilemapLayer;
    graveSalt!: Phaser.Tilemaps.TilemapLayer; 
    graveBg!: Phaser.Tilemaps.TilemapLayer;
    isInPub: boolean = false;

    pubEntrance!: { x: number; y: number; width: number };
    pubExit!: { x: number; y: number; width: number };

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
        this.load.image('logo4', '/sprites/logo4.png');
        this.load.tilemapTiledJSON('groundMap', '/sprites/jsons/groundup.json');
        this.load.tilemapTiledJSON('bgL2Map', '/sprites/jsons/bgL2.json');
        this.load.tilemapTiledJSON('pubInteriorMap', '/sprites/jsons/pubinterior.json');
        
      }
      create() {
        const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        background.setDisplaySize(this.sys.game.config.width as number, this.sys.game.config.height as number);
        background.setScrollFactor(0);
    
        // Create bgL2 tilemap
        const bgL2Map = this.make.tilemap({ key: 'bgL2Map' });
        const backgroundPropsTileset = bgL2Map.addTilesetImage('BackgroundProps', 'BackgroundProps');
        const logo1Tileset= bgL2Map.addTilesetImage('logo4', 'logo4'); 
        this.bgL2Layer = bgL2Map.createLayer('bglayer', backgroundPropsTileset!)!;
        this.bgL2Logo = bgL2Map.createLayer('logo', logo1Tileset!)!;
        this.bgL2Logo.setDepth(2);
        this.bgL2Layer.setDepth(1);
        this.bgL2Layer.setScrollFactor(0.5); // Parallax effect
    
        // Create ground tilemap
        const groundMap = this.make.tilemap({ key: 'groundMap' });
        
        // Add tilesets
        const tilesTileset = groundMap.addTilesetImage('Tiles', 'Tiles');
        const propsTileset = groundMap.addTilesetImage('Props-01', 'Props');
        const buildingsTileset = groundMap.addTilesetImage('Buildings', 'Buildings');
        const inchTileset = groundMap.addTilesetImage('1inch_color_black', '1inch');
        const graveTileset = groundMap.addTilesetImage('graveTiles', 'GraveTiles');
        const graveSalt = groundMap.addTilesetImage('Salt', 'Salt'); 
        const graveBg = groundMap.addTilesetImage('Grass_background_2', 'Grass_background_2'); 
        const pubTileset= groundMap.addTilesetImage('pubinterior', 'pubinterior'); 
        this.groundLayer = groundMap.createLayer('Ground', tilesTileset!)!;
        this.propsLayer = groundMap.createLayer('Props', propsTileset!)!;
        this.pubLayer = groundMap.createLayer('Pub', buildingsTileset!)!;
        this.graveRails = groundMap.createLayer('Grave Rails', graveTileset!)!;
        this.graveSalt = groundMap.createLayer('Grave Salt', graveSalt!)!;
        this.graveProps = groundMap.createLayer('Grave Props', graveTileset!)!;
        this.graveBg = groundMap.createLayer('GraveBG', graveBg!)!;
    
        
        // Create 1inch layer using both 1inch and Props tilesets
        this.inchLayer = groundMap.createLayer('1inch', [inchTileset!, propsTileset!])!;
        this.groundLayer.setCollisionByExclusion([-1], true);
    
        // Set world bounds to match the ground layer size
        this.physics.world.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
    
        // Player
        this.player = this.physics.add.sprite(100, 200, 'player');
        this.player.setCircle(16);
        this.player.setTint(0x0000ff);
        this.player.setCollideWorldBounds(true);
    
        // Collision
        this.physics.add.collider(this.player, this.groundLayer);
    
        // Input
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Camera
        this.cameras.main.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    
        // Bullets
        this.bullets = this.physics.add.group();
    
        // Depth
        background.setDepth(0);
        this.bgL2Layer.setDepth(1);
        this.groundLayer.setDepth(2);
        this.propsLayer.setDepth(3);
        this.pubLayer.setDepth(4);
        this.inchLayer.setDepth(5);
        this.graveSalt.setDepth(5);
        this.graveProps.setDepth(5);
        this.graveBg.setDepth(1);
        this.graveRails.setDepth(6);
        this.player.setDepth(7);
        
        // Player properties
        this.player.setData('canJump', true);
        this.player.setData('lastShootTime', 0);
    
        // Set pub entrance coordinates (adjust these to match your map)
        this.pubEntrance = { x: 400, y: 400, width: 64 }; // Assuming the pub entrance is 64 pixels wide
    
        // Create enter button (initially hidden)
        this.enterButton = this.add.text(0, 0, 'Enter Pub', { 
          fontSize: '24px', 
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
        });
        this.exitButton = this.add.text(0, 0, 'Exit', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
        this.enterButton.setInteractive();
        this.enterButton.on('pointerdown', this.enterPub, this);
        this.enterButton.setVisible(false);
        this.enterButton.setDepth(7);
    
        this.graveEntrance = { x: 1100, y: 400, width: 64 };
        this.exitButton.setInteractive();
        this.exitButton.on('pointerdown', this.enterPub, this);
        this.exitButton.setVisible(false);
        this.exitButton.setDepth(7);
        this.pubExit = { x: 400, y: 400, width: 64 }; // Assuming the pub entrance is 64 pixels wide
        // Create enter button (initially hidden)
        this.enterGraveButton = this.add.text(0, 0, 'Enter Grave', { 
          fontSize: '24px', 
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
        });
        this.enterGraveButton.setInteractive();
        this.enterGraveButton.on('pointerdown', this.enterPub, this);
        this.enterGraveButton.setVisible(false);
        this.enterGraveButton.setDepth(7);
    
        // Debug info
        console.log('bgL2 Layer:', this.bgL2Layer);
        console.log('Ground Layer:', this.groundLayer);
        console.log('Props Layer:', this.propsLayer);
        console.log('Pub Layer:', this.pubLayer);
        console.log('1inch Layer:', this.inchLayer);
      }
      update() {
        // Player movement
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
          this.player.setVelocityX(160);
        } else {
          this.player.setVelocityX(0);
        }
    
        // Jumping
        if (this.cursors.up.isDown && (this.player.body as Phaser.Physics.Arcade.Body).onFloor()) {
          this.player.setVelocityY(-330);
        }
    
        // Shooting
        if (this.spaceKey.isDown && this.time.now - (this.player.getData('lastShootTime') as number) > 500) {
          const bullet = this.bullets.create(this.player.x, this.player.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
          bullet.setCircle(4);
          bullet.setTint(0xff0000);
          bullet.setDepth(7);
          if (bullet.body) {
            (bullet.body as Phaser.Physics.Arcade.Body).allowGravity = false;
          }
          
          const velocity = (this.player.body as Phaser.Physics.Arcade.Body).velocity.x > 0 ? 400 : -400;
          bullet.setVelocity(velocity, 0);
    
          this.time.delayedCall(1500, () => {
            bullet.destroy();
          });
    
          this.player.setData('lastShootTime', this.time.now);
        }
    
        // Check if player is near pub entrance
        if (!this.isInPub) {
        this.checkPubProximity();
        this.checkGraveProximity();}
        if(this.isInPub){
          this.checkPubExitProximity();
        }
    }

  checkPubProximity() {
    const playerIsInFrontOfPub = 
      this.player.x >= this.pubEntrance.x &&
      this.player.x <= this.pubEntrance.x + this.pubEntrance.width &&
      Math.abs(this.player.y - this.pubEntrance.y) < 20; // Allow some vertical tolerance

    if (playerIsInFrontOfPub) {
      this.enterButton.setVisible(true);
      this.enterButton.setPosition(
        this.player.x,
        this.player.y - 50
      );
    } else {
      this.enterButton.setVisible(false);
    }
  }
  checkPubExitProximity() {
    const playerIsInFrontOfPub = 
      this.player.x >= this.pubEntrance.x &&
      this.player.x <= this.pubEntrance.x + this.pubEntrance.width &&
      Math.abs(this.player.y - this.pubEntrance.y) < 20; // Allow some vertical tolerance

    if (playerIsInFrontOfPub) {
      this.exitButton.setVisible(true);
      this.exitButton.setPosition(
        this.player.x,
        this.player.y - 50
      );
    } else {
      this.exitButton.setVisible(false);
    }
  }
  checkGraveProximity() {
    const playerIsInFrontOfGrave = 
      this.player.x >= this.graveEntrance.x &&
      this.player.x <= this.graveEntrance.x + this.graveEntrance.width &&
      Math.abs(this.player.y - this.graveEntrance.y) < 20; // Allow some vertical tolerance

    if (playerIsInFrontOfGrave) {
      this.enterGraveButton.setVisible(true);
      this.enterGraveButton.setPosition(
        this.player.x,
        this.player.y - 50
      );
    } else {
      this.enterGraveButton.setVisible(false);
    }
  }
  enterPub() {
    this.isInPub = true;
    
    // Create new tilemap for pub interior
    const pubInteriorMap = this.make.tilemap({ key: 'pubInteriorMap' });
    const tilesetInterior = pubInteriorMap.addTilesetImage('pubInterior', 'pubinterior');

    if (!tilesetInterior) {
      console.error("Failed to load pub interior tileset");
      return;
    }

    // Clear existing layers
    this.bgL2Logo.destroy();
    this.groundLayer.destroy();
    this.propsLayer.destroy();
    this.pubLayer.destroy();
    this.inchLayer.destroy();
    this.bgL2Layer.destroy();
    this.graveRails.destroy();
    this.graveSalt.destroy();
    this.graveProps.destroy();
    this.graveBg.destroy();

    // Create new layers for pub interior
    this.groundLayer = pubInteriorMap.createLayer('ground', tilesetInterior)!;
    this.propsLayer = pubInteriorMap.createLayer('background', tilesetInterior)!;

    if (!this.groundLayer || !this.propsLayer) {
      console.error("Failed to create pub interior layers");
      return;
    }

    // Adjust world bounds and camera
    this.physics.world.setBounds(0, 0, pubInteriorMap.widthInPixels, pubInteriorMap.heightInPixels);
    this.cameras.main.setBounds(0, 0, pubInteriorMap.widthInPixels, pubInteriorMap.heightInPixels);

    // Set player position inside pub
    this.player.setPosition(10, pubInteriorMap.heightInPixels - 50);

    // Hide enter button
    this.enterButton.setVisible(false);

    // Set collision for ground layer
    this.groundLayer.setCollisionByExclusion([-1], true);

    // Remove existing colliders
    this.physics.world.colliders.destroy();

    // Add new collider
    this.physics.add.collider(this.player, this.groundLayer);

    console.log("Entered pub. Ground layer:", this.groundLayer);

    // Emit an event to notify that we've entered the pub
    this.events.emit('enteredPub');
  }

  exitPub() {
    this.isInPub = false;
    // Logic to exit the pub and return to the main scene
    // This would involve recreating the main scene layers and resetting the player position
    // You'll need to implement this based on your game's structure
  }
}
const GameComponent: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
  
    useEffect(() => {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 100, y: 700 },
            debug: false
          }
        },
        scene: GameScene,
        parent: 'phaser-game'
      };
  
      gameRef.current = new Phaser.Game(config);
  
      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
        }
      };
    }, []);
  
    return (<div className='flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center w-[640px]'>
      {/* <DynamicWidget variant='dropdown' /> */}
  
        <div id="phaser-game" className='border-2 border-gray-600 border-b-0'/>
  
        <RetroConversationComponent />
      </div>
    </div>);
  };
  
  export default GameComponent;