class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  preload() {
    // Carga todos los assets aquí
    this.load.image('xwing',     'assets/images/xwing.png');
    this.load.image('tie',       'assets/images/tie.png');
    this.load.image('laser',     'assets/images/laser.png');
    this.load.image('deathstar', 'assets/images/deathstar.png');
    this.load.image('explosion', 'assets/images/explosion.png');
    this.load.image('bg',        'assets/images/stars.png');
    this.load.audio('laserSnd',  'assets/sounds/laser.wav');
    this.load.audio('explodeSnd','assets/sounds/explosion.wav');
    this.load.audio('music',     'assets/sounds/theme.mp3');
  }

  create() {
    this.add.image(400, 300, 'bg');          // fondo estrellado
    this.add.image(400, 150, 'xwing');       // imagen decorativa

    this.add.text(400, 280, 'STAR WARS', {
      fontSize: '48px', fill: '#FFE81F',
      fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(400, 340, 'X-Wing vs Tie Fighter', {
      fontSize: '20px', fill: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    // Texto parpadeante "Presiona ENTER"
    const start = this.add.text(400, 430, 'Presiona ENTER para iniciar', {
      fontSize: '18px', fill: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: start, alpha: 0,
      duration: 600, yoyo: true, repeat: -1
    });

    // Música de fondo
    this.sound.play('music', { loop: true, volume: 0.4 });

    this.input.keyboard.on('keydown-ENTER', () => {
      this.sound.stopAll();
      this.scene.start('GameScene', { players: 1 }); // cambia a 2 para 2 jugadores
    });

    // Tecla P para 2 jugadores (bonus)
    this.add.text(400, 470, 'P = 2 Jugadores', {
      fontSize: '14px', fill: '#888888', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-P', () => {
      this.sound.stopAll();
      this.scene.start('GameScene', { players: 2 });
    });
  }
}