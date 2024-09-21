"use client"
import { useEffect, useRef,useState } from 'react';
import Phaser from 'phaser';
import RetroConversationComponent from '@/components/Converstation';
import Modals from '@/components/modals';
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
    caveExt!: Phaser.Tilemaps.TilemapLayer;
    graveRails!: Phaser.Tilemaps.TilemapLayer;
    graveProps!: Phaser.Tilemaps.TilemapLayer;
    graveSalt!: Phaser.Tilemaps.TilemapLayer; 
    graveBg!: Phaser.Tilemaps.TilemapLayer;
    bouncer1!: Phaser.Tilemaps.TilemapLayer;
    bouncer2!: Phaser.Tilemaps.TilemapLayer;
    zombie!: Phaser.Tilemaps.TilemapLayer;
    satoshi!: Phaser.Tilemaps.TilemapLayer;
    helperguy!: Phaser.Tilemaps.TilemapLayer;
    villain1!: Phaser.Tilemaps.TilemapLayer;
    talktoBouncer!: Phaser.GameObjects.Text;
    talktoSatoshi!: Phaser.GameObjects.Text;
    talktoHelper!: Phaser.GameObjects.Text;
    talktoZombie!: Phaser.GameObjects.Text;
    enterCaveButton!: Phaser.GameObjects.Text;
    wallet:boolean = false;
    isInPub: boolean = false;
    isInGrave: boolean = false;
    mission: number = 0;
  npc2: string = '';
    caveEntrance!: { x: number; y: number; width: number };
    helperEntrance!: { x: number; y: number; width: number };
    zombieEntrance!: { x: number; y: number; width: number };
    pubEntrance!: { x: number; y: number; width: number };
    satoshiEntrance!: { x: number; y: number; width: number };
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
        this.load.image('graveinterior', '/sprites/Graveyard/graveInterior.png');
        this.load.image('logo4', '/sprites/logo4.png');
        this.load.image('bouncer', '/nouns/bouncer.png');
        this.load.image('satoshi', '/nouns/satoshi.png');
        this.load.image('villan1', '/nouns/villan1.png');
        this.load.image('helperguy', '/nouns/helperguy.png');
        this.load.image('zombie', '/nouns/zombie.png');
        this.load.image('caveExt','/sprites/cave/caveExt.png')
        this.load.image('caveInt','/sprites/cave/caveInt.png')
        this.load.tilemapTiledJSON('groundMap', '/sprites/jsons/groundup.json');
        this.load.tilemapTiledJSON('caveInt', '/sprites/jsons/caveInt.json');
        this.load.tilemapTiledJSON('bgL2Map', '/sprites/jsons/bgL2.json');
        this.load.tilemapTiledJSON('pubInteriorMap', '/sprites/jsons/pubinterior.json');
        this.load.tilemapTiledJSON('graveInteriorMap', '/sprites/jsons/graveInterior.json');
        this.load.spritesheet('character', '/nouns/hero_sprite.png', {
            frameWidth: 64, // Adjust this to match your sprite width
            frameHeight: 128 // Adjust this to match your sprite height
          });
          this.load.spritesheet('bullet', '/sprites/fireball.png', {
            frameWidth: 128, // Adjust this to match your sprite width
            frameHeight: 128 // Adjust this to match your sprite height
          });
      }
      create() {
        this.emitState();
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
        const bouncer= groundMap.addTilesetImage('bouncer', 'bouncer');
        const satoshi= groundMap.addTilesetImage('satoshi', 'satoshi');
        const zombie= groundMap.addTilesetImage('zombie', 'zombie');
        this.groundLayer = groundMap.createLayer('Ground', tilesTileset!)!;
        this.propsLayer = groundMap.createLayer('Props', propsTileset!)!;
        this.pubLayer = groundMap.createLayer('Pub', buildingsTileset!)!;
        this.graveRails = groundMap.createLayer('Grave Rails', graveTileset!)!;
        this.graveSalt = groundMap.createLayer('Grave Salt', graveSalt!)!;
        this.graveProps = groundMap.createLayer('Grave Props', graveTileset!)!;
        this.graveBg = groundMap.createLayer('GraveBG', graveBg!)!;
        this.satoshi = groundMap.createLayer('Satoshi', satoshi!)!;
        this.bouncer1 = groundMap.createLayer('Bouncer1', bouncer!)!;
        this.bouncer2 = groundMap.createLayer('Bouncer2', bouncer!)!;
        this.zombie = groundMap.createLayer('Zombie', zombie!)!;

        this.bouncer2.setVisible(false);
        this.time.addEvent({
            delay: 100, // Emit state every 100ms
            callback: this.emitState,
            callbackScope: this,
            loop: true
          });
      
        
        // Create 1inch layer using both 1inch and Props tilesets
        this.inchLayer = groundMap.createLayer('1inch', [inchTileset!, propsTileset!])!;
        this.groundLayer.setCollisionByExclusion([-1], true);
    
        // Set world bounds to match the ground layer size
        this.physics.world.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
    
        // Player
        this.player = this.physics.add.sprite(100, 200, 'character');
        this.player.setCollideWorldBounds(true);
        this.player.body!.setOffset(0, -3);  // Adjust this value as needed
        this.player.body!.setSize(80, 100, false);
        // Collision
        this.physics.add.collider(this.player, this.groundLayer);
    
        // Input
        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('character', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
          });
      
          this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('character', { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
          });
      
          this.anims.create({
            key: 'idle',
            frames: [{ key: 'character', frame: 1 }],
            frameRate: 20
          });
          this.anims.create({
            key: 'bullet_animation',
            frames: this.anims.generateFrameNumbers('bullet', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
          });
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    
        // Camera
        this.cameras.main.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    
        // Bullets
        this.bullets = this.physics.add.group();
    
        // Depth
        background.setDepth(0);
        this.satoshi.setDepth(2);
        this.bgL2Layer.setDepth(1);
        this.groundLayer.setDepth(2);
        this.propsLayer.setDepth(3);
        this.pubLayer.setDepth(4);
        this.inchLayer.setDepth(5);
        this.graveSalt.setDepth(5);
        this.graveProps.setDepth(5);
        this.graveBg.setDepth(1);
        this.graveRails.setDepth(6);
        this.bouncer1.setDepth(5);
        this.zombie.setDepth(7);
        this.bouncer2.setDepth(5);
        this.player.setDepth(7);
        // Player properties
        this.player.setData('canJump', true);
        this.player.setData('lastShootTime', 0);
    
        // Set pub entrance coordinates (adjust these to match your map)
        this.caveEntrance = { x: 760, y: 370, width: 100 }; // Assuming the pub entrance is 64 pixels wide
        this.pubEntrance = { x: 400, y: 400, width: 64 }; // Assuming the pub entrance is 64 pixels wide
        this.satoshiEntrance= { x: 150, y: 380, width: 64 };
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
          this.enterCaveButton = this.add.text(0, 0, 'Enter Cave', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
          this.talktoZombie = this.add.text(0, 0, 'Interact', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
          this.talktoHelper = this.add.text(0, 0, 'Interact', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
          this.talktoSatoshi = this.add.text(0, 0, 'Interact', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
          this.talktoBouncer = this.add.text(0, 0, 'Interact', { 
            fontSize: '24px', 
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 },
          });
        this.enterCaveButton.setInteractive();
        this.enterCaveButton.on('pointerdown', this.enterCave, this);
        this.enterCaveButton.setVisible(false);
        this.enterCaveButton.setDepth(7);
        this.talktoZombie.setInteractive();
        this.talktoZombie.on('pointerdown', this.enterPub, this);
        this.talktoZombie.setVisible(false);
        this.talktoZombie.setDepth(7);
        this.talktoHelper.setInteractive();
        this.talktoHelper.on('pointerdown', this.enterPub, this);
        this.talktoHelper.setVisible(false);
        this.talktoHelper.setDepth(7);
        this.talktoBouncer.setInteractive();
        this.talktoBouncer.on('pointerdown', this.enterPub, this);
        this.talktoBouncer.setVisible(false);
        this.talktoBouncer.setDepth(7);
        this.talktoSatoshi.setInteractive();
        this.talktoSatoshi.on('pointerdown', this.enterPub, this);
        this.talktoSatoshi.setVisible(false);
        this.talktoSatoshi.setDepth(7);
        this.enterButton.setInteractive();
        this.enterButton.on('pointerdown', this.enterPub, this);
        this.enterButton.setVisible(false);
        this.enterButton.setDepth(7);
        this.helperEntrance = { x: 100, y: 400, width: 64 };
        this.zombieEntrance = { x: 1000, y: 400, width: 64 };
        this.graveEntrance = { x: 1100, y: 400, width: 64 };
        this.exitButton.setInteractive();
        this.exitButton.on('pointerdown', this.exitPub, this);
        this.exitButton.setVisible(false);
        this.exitButton.setDepth(7);
        this.pubExit = { x: 50, y: 400, width: 64 }; // Assuming the pub entrance is 64 pixels wide
        // Create enter button (initially hidden)
        this.enterGraveButton = this.add.text(0, 0, 'Enter Grave', { 
          fontSize: '24px', 
          backgroundColor: '#000000',
          padding: { x: 10, y: 5 },
        });
        this.enterGraveButton.setInteractive();
        this.enterGraveButton.on('pointerdown', this.enterGrave, this);
        this.enterGraveButton.setVisible(false);
        this.enterGraveButton.setDepth(7);
    
        // Debug info
        console.log('bgL2 Layer:', this.bgL2Layer);
        console.log('Ground Layer:', this.groundLayer);
        console.log('Props Layer:', this.propsLayer);
        console.log('Pub Layer:', this.pubLayer);
        console.log('1inch Layer:', this.inchLayer);
      }
      emitState = () => {
        this.game.events.emit('gameStateUpdate', {
          mission: this.mission,
          npc2: this.npc2
        });
      }
      update() {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('walk_left', true);
          } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('walk_right', true);
          } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle', true);
          }
          if(this.mission==2&&!this.isInGrave&&!this.isInPub){
            this.bouncer2.setVisible(true);
            this.bouncer1.setVisible(false);
          }
    
        // Jumping
        if (this.cursors.up.isDown && (this.player.body as Phaser.Physics.Arcade.Body).onFloor()) {
          this.player.setVelocityY(-330);
        }
    
        if (this.cursors.left.isDown) {
            this.player.setData('lastDirection', 'left');
          } else if (this.cursors.right.isDown) {
            this.player.setData('lastDirection', 'right');
          }
      
          // Modify the shooting logic in the update method
          if (this.spaceKey.isDown && this.time.now - (this.player.getData('lastShootTime') as number) > 500) {
            const bulletX = this.player.getData('lastDirection') === 'left' ? this.player.x - 20 : this.player.x + 20;
            const bullet = this.bullets.create(bulletX, this.player.y, 'bullet') as Phaser.Physics.Arcade.Sprite;
            bullet.setDisplaySize(64, 64);
            bullet.setDepth(7);
            if (bullet.body) {
              (bullet.body as Phaser.Physics.Arcade.Body).allowGravity = false;
            }
            
            const direction = this.player.getData('lastDirection') === 'left' ? -1 : 1;
            const velocity = 400 * direction;
            bullet.setVelocity(velocity, 0);
      
            // Play the bullet animation
            bullet.play('bullet_animation');
      
            // Flip the bullet sprite if shooting right
            bullet.flipX = this.player.getData('lastDirection') === 'right';
      
            this.time.delayedCall(1500, () => {
              bullet.destroy();
            });
      
            this.player.setData('lastShootTime', this.time.now);
          }
        
        
        // Check if player is near pub entrance
        if(this.mission==1){
            this.checkBouncerProximity();
            
        }
        if(this.wallet==false&&!this.isInPub&&!this.isInGrave){
            this.checkSatoshiProximity();
        }
        if (!this.isInPub&&!this.isInGrave) {
        }
        if(this.isInPub){
            this.checkHelperProximity();
        }
        if (!this.isInPub&&this.mission!=1) {
        this.checkPubProximity();
        this.checkGraveProximity();
            this.checkZombieProximity();
    }   if(this.isInGrave){
        this.checkCaveProximity();
    }
        if(this.isInPub){
          this.checkPubExitProximity();
        }
    }
    checkCaveProximity() {
        const playerIsInFrontOfCave = 
          this.player.x >= this.caveEntrance.x &&
          this.player.x <= this.caveEntrance.x + this.caveEntrance.width &&
          Math.abs(this.player.y - this.caveEntrance.y) < 20; // Allow some vertical tolerance
    
        if (playerIsInFrontOfCave) {
          this.enterCaveButton.setVisible(true);
          this.enterCaveButton.setPosition(
            this.player.x,
            this.player.y - 50
          );
        } else {
          this.enterCaveButton.setVisible(false);}
    }
    checkZombieProximity() {
        const playerIsInFrontOfZombie = 
          this.player.x >= this.zombieEntrance.x &&
          this.player.x <= this.zombieEntrance.x + this.zombieEntrance.width &&
          Math.abs(this.player.y - this.zombieEntrance.y) < 20;
    
        if (playerIsInFrontOfZombie) {
          this.talktoZombie.setVisible(true);
          this.talktoZombie.setPosition(this.player.x, this.player.y - 50);
          this.npc2 = 'Zombie';
        } else if (this.npc2 === 'Zombie') {
          this.talktoZombie.setVisible(false);
          this.npc2 = '';
        }
      }
    checkHelperProximity() {
        const playerIsInFrontOfHelper = 
          this.player.x >= this.helperEntrance.x &&
          this.player.x <= this.helperEntrance.x + this.helperEntrance.width &&
          Math.abs(this.player.y - this.helperEntrance.y) < 20; // Allow some vertical tolerance
    
        if (playerIsInFrontOfHelper) {
          this.talktoHelper.setVisible(true);
          this.talktoHelper.setPosition(
            this.player.x,
            this.player.y - 50
          );
          this.npc2 = 'helperguy';
        } else {
          this.talktoHelper.setVisible(false);
            this.npc2 = '';
        }
      }
    checkSatoshiProximity() {
        const playerIsInFrontOfSatoshi = 
          this.player.x >= this.satoshiEntrance.x &&
          this.player.x <= this.satoshiEntrance.x + this.satoshiEntrance.width &&
          Math.abs(this.player.y - this.satoshiEntrance.y) < 20; // Allow some vertical tolerance
    
        if (playerIsInFrontOfSatoshi) {
          this.talktoSatoshi.setVisible(true);
          this.talktoSatoshi.setPosition(
            this.player.x,
            this.player.y - 50
          );
          this.npc2 = 'Satoshi';
        } else {
          this.talktoSatoshi.setVisible(false);
          this.npc2 = '';
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
  checkBouncerProximity() {
    const playerIsInFrontOfPub = 
      this.player.x >= this.pubEntrance.x &&
      this.player.x <= this.pubEntrance.x + this.pubEntrance.width &&
      Math.abs(this.player.y - this.pubEntrance.y) < 20; // Allow some vertical tolerance

    if (playerIsInFrontOfPub) {
      this.talktoBouncer.setVisible(true);
      this.talktoBouncer.setPosition(
        this.player.x,
        this.player.y - 50
      );
      this.npc2 = 'Bouncer';
    } else {
      this.talktoBouncer.setVisible(false);
      this.npc2 = '';
    }
  }
  checkPubExitProximity() {
    const playerIsInFrontOfPub = 
      this.player.x >= this.pubExit.x &&
      this.player.x <= this.pubExit.x + this.pubExit.width &&
      Math.abs(this.player.y - this.pubExit.y) < 20; // Allow some vertical tolerance

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
    const helperguy = pubInteriorMap.addTilesetImage('helperguy', 'helperguy');
    const villan1 = pubInteriorMap.addTilesetImage('villan1', 'villan1');

    if (!tilesetInterior) {
      console.error("Failed to load pub interior tileset");
      return;
    }

    // Clear existing layers
    this.satoshi.destroy();
    this.bgL2Logo.setVisible(false);
    this.groundLayer.destroy();
    this.propsLayer.destroy();
    this.pubLayer.destroy();
    this.inchLayer.destroy();
    this.bouncer1.destroy();
    this.bouncer2.destroy();
    // this.bgL2Layer.destroy();
    this.graveRails.destroy();
    this.graveSalt.destroy();
    this.graveProps.destroy();
    this.graveBg.destroy();

    // Create new layers for pub interior
    this.groundLayer = pubInteriorMap.createLayer('ground', tilesetInterior)!;
    this.propsLayer = pubInteriorMap.createLayer('background', tilesetInterior)!;
    if (villan1) {
      this.villain1 = pubInteriorMap.createLayer('Villan', villan1)!;
    } else {
      console.error("Failed to load villan1 tileset");
    }
    if (helperguy) {
      this.helperguy = pubInteriorMap.createLayer('helperguy', helperguy)!;
    } else {
      console.error("Failed to load helperguy tileset");
    }
    this.villain1.setDepth(2);
    this.helperguy.setDepth(2);
    this.groundLayer.setDepth(2);
    this.propsLayer.setDepth(1);    
    this.villain1.setCollisionByExclusion([-1], true);
    if (!this.groundLayer || !this.propsLayer) {
      console.error("Failed to create pub interior layers");
      return;
    }

    // Adjust world bounds and camera
    this.physics.world.setBounds(0, 0, pubInteriorMap.widthInPixels, pubInteriorMap.heightInPixels);
    this.cameras.main.setBounds(0, 0, pubInteriorMap.widthInPixels, pubInteriorMap.heightInPixels);

    // Set player position inside pub
    this.player.setPosition(10, pubInteriorMap.heightInPixels/3);

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
  enterCave() {
    this.isInPub = true;
    
    // Create new tilemap for pub interior
    const caveIntMap = this.make.tilemap({ key: 'caveInt' });
    const tilesetInterior = caveIntMap.addTilesetImage('caveInt', 'caveInt');

    if (!tilesetInterior) {
      console.error("Failed to load pub interior tileset");
      return;
    }
    this.groundLayer.destroy();
    this.propsLayer.destroy();
    this.caveExt.destroy();
    this.groundLayer = caveIntMap.createLayer('ground', tilesetInterior)!;
    this.propsLayer = caveIntMap.createLayer('bg', tilesetInterior)!;
    this.groundLayer.setDepth(2);
    this.propsLayer.setDepth(1);    
    if (!this.groundLayer || !this.propsLayer) {
      console.error("Failed to create pub interior layers");
      return;
    }
    // Adjust world bounds and camera
    this.physics.world.setBounds(0, 0, caveIntMap.widthInPixels, caveIntMap.heightInPixels);
    this.cameras.main.setBounds(0, 0, caveIntMap.widthInPixels, caveIntMap.heightInPixels);

    // Set player position inside pub
    this.player.setPosition(10, caveIntMap.heightInPixels/3);

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
    console.log("Exiting pub...");
    this.isInPub = false;
    this.exitButton.setVisible(false);
    // Remove existing colliders
    this.physics.world.colliders.destroy();
    this.bgL2Logo.setVisible(true);
  
    // Destroy pub layers
    if (this.groundLayer) this.groundLayer.destroy();
    if (this.propsLayer) this.propsLayer.destroy();
    if(this.villain1) this.villain1.destroy();
    if(this.helperguy) this.helperguy.destroy();
  
    // Recreate main scene layers
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setDisplaySize(this.sys.game.config.width as number, this.sys.game.config.height as number);
    background.setScrollFactor(0);
    background.setDepth(0);
  
    // Recreate ground tilemap
    const groundMap = this.make.tilemap({ key: 'groundMap' });
    if (!groundMap) {
      console.error("Failed to create groundMap");
      return;
    }
    
    // Add tilesets
    const tilesTileset = groundMap.addTilesetImage('Tiles', 'Tiles');
    const propsTileset = groundMap.addTilesetImage('Props-01', 'Props');
    const buildingsTileset = groundMap.addTilesetImage('Buildings', 'Buildings');
    const inchTileset = groundMap.addTilesetImage('1inch_color_black', '1inch');
    const graveTileset = groundMap.addTilesetImage('graveTiles', 'GraveTiles');
    const graveSalt = groundMap.addTilesetImage('Salt', 'Salt');
    const graveBg = groundMap.addTilesetImage('Grass_background_2', 'Grass_background_2');
    const bouncer= groundMap.addTilesetImage('bouncer', 'bouncer'); 
    const satoshi= groundMap.addTilesetImage('satoshi', 'satoshi');

  
    if (!tilesTileset || !propsTileset || !buildingsTileset || !inchTileset || !graveTileset || !graveSalt || !graveBg) {
      console.error("Failed to load one or more tilesets");
      return;
    }
    // Recreate layers
    this.bouncer1 = groundMap.createLayer('Bouncer1', bouncer!)!;
    this.bouncer2 = groundMap.createLayer('Bouncer2', bouncer!)!;
    this.bouncer2.setVisible(false);
    this.groundLayer = groundMap.createLayer('Ground', tilesTileset)!;
    this.propsLayer = groundMap.createLayer('Props', propsTileset)!;
    this.pubLayer = groundMap.createLayer('Pub', buildingsTileset)!;
    this.graveRails = groundMap.createLayer('Grave Rails', graveTileset)!;
    this.graveSalt = groundMap.createLayer('Grave Salt', graveSalt)!;
    this.graveProps = groundMap.createLayer('Grave Props', graveTileset)!;
    this.graveBg = groundMap.createLayer('GraveBG', graveBg)!;
    this.satoshi = groundMap.createLayer('Satoshi', satoshi!)!;
    this.inchLayer = groundMap.createLayer('1inch', [inchTileset, propsTileset])!;
  
    if (!this.groundLayer) {
      console.error("Failed to create ground layer");
      return;
    }
  
    // Set world bounds
    this.physics.world.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
  
    // Reset camera
    this.cameras.main.setBounds(0, 0, groundMap.widthInPixels, groundMap.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  
    // Set depths
    if (this.groundLayer) this.groundLayer.setDepth(2);
    if (this.propsLayer) this.propsLayer.setDepth(3);
    if (this.pubLayer) this.pubLayer.setDepth(4);
    if (this.inchLayer) this.inchLayer.setDepth(5);
    if (this.graveSalt) this.graveSalt.setDepth(5);
    if (this.graveProps) this.graveProps.setDepth(5);
    if (this.graveBg) this.graveBg.setDepth(1);
    if(this.bouncer1) this.bouncer1.setDepth(5);
    if(this.bouncer2) this.bouncer2.setDepth(5);
    if (this.graveRails) this.graveRails.setDepth(6);
    this.player.setDepth(7);
  
    this.player.setPosition(400, 100);  // Example position, adjust as needed
  
    if (this.enterButton) this.enterButton.setVisible(true);
    if (this.enterGraveButton) this.enterGraveButton.setVisible(true);
      console.log("Setting up collisions...");
        this.groundLayer.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.groundLayer);
        console.log("Collisions set up successfully.");
    if (this.groundLayer && this.groundLayer.tilemap) {
        console.log("Setting up collisions...");
        this.groundLayer.setCollisionByExclusion([-1], true);
        this.physics.add.collider(this.player, this.groundLayer);
        console.log("Collisions set up successfully.");
      } else {
        console.error("Ground layer or its properties are undefined. Cannot set up collisions.");
      }
    console.log("Exited pub. Main scene recreated.");
  
    // Emit an event to notify that we've exited the pub
    this.events.emit('exitedPub');
  }

  enterGrave() {
    this.isInGrave = true;
    
    // Create new tilemap for grave interior
    const graveInteriorMap = this.make.tilemap({ key: 'graveInteriorMap' });
    const tilesetInterior = graveInteriorMap.addTilesetImage('graveInterior', 'graveinterior');
    const caveExt = graveInteriorMap.addTilesetImage('caveExt', 'caveExt');

    if (!tilesetInterior) {
      console.error("Failed to load grave interior tileset");
      return;
    }
    if (!caveExt) {
      console.error("Failed to load caveExt tileset");
      return;
    }

    // Clear existing layers
    this.bgL2Logo.setVisible(false);
    this.groundLayer.destroy();
    this.propsLayer.destroy();
    this.pubLayer.destroy();
    this.inchLayer.destroy();
    this.bouncer1.destroy();
    this.bouncer2.destroy();
    this.satoshi.destroy();
    // this.bgL2Layer.destroy();
    this.graveRails.destroy();
    this.graveSalt.destroy();
    this.graveProps.destroy();
    this.graveBg.destroy();

    // Create new layers for grave interior
    this.groundLayer = graveInteriorMap.createLayer('ground', tilesetInterior)!;
    this.propsLayer = graveInteriorMap.createLayer('bg', tilesetInterior)!;
    this.caveExt = graveInteriorMap.createLayer('caveExt', caveExt!)!;
    this.caveExt.setDepth(2);
    this.groundLayer.setDepth(2);
    this.propsLayer.setDepth(1);    
    if (!this.groundLayer || !this.propsLayer) {
      console.error("Failed to create grave interior layers");
      return;
    }

    // Adjust world bounds and camera
    this.physics.world.setBounds(0, 0, graveInteriorMap.widthInPixels, graveInteriorMap.heightInPixels);
    this.cameras.main.setBounds(0, 0, graveInteriorMap.widthInPixels, graveInteriorMap.heightInPixels);

    // Set player position inside pub
    this.player.setPosition(10, graveInteriorMap.heightInPixels/3);

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
}
const GameComponent: React.FC = () => {
    const gameRef = useRef<Phaser.Game | null>(null);
    const [gameState, setGameState] = useState({ mission: 2, npc2: '' });
    const setmission= (mission: number) => {
        setGameState({ mission, npc2: gameState.npc2 });
      }
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
  
      const handleGameStateUpdate = (state: { mission: number, npc2: string }) => {
        setGameState(state);
      };
  
      if (gameRef.current) {
        gameRef.current.events.on('gameStateUpdate', handleGameStateUpdate);
      }
  
      return () => {
        if (gameRef.current) {
          gameRef.current.events.off('gameStateUpdate', handleGameStateUpdate);
          gameRef.current.destroy(true);
        }
      };
    }, []);
  
    useEffect(() => {
      console.log('Game state updated:', gameState);
    }, [gameState]);
  
    return (
      <div className='flex justify-center items-center'>
        <div className='flex flex-col justify-center items-center w-[640px]'>
          <div id="phaser-game" className='border-2 border-gray-600 border-b-0'/>
          <RetroConversationComponent mission={gameState.mission} npc2={gameState.npc2}/>
          <div>Mission: {gameState.mission}</div>
          <div>NPC2: {gameState.npc2}</div>
          <Modals option={gameState.mission} setOption={setmission} />
        </div>
      </div>
    );
  };
  
  
  export default GameComponent;