class GameOver extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) {
    this.result = data.result;
    this.score  = data.score;
  }

  create() {
    this.add.image(400, 300, 'bg');

    const msg = this.result === 'win' ? '¡VICTORIA! La Fuerza está contigo' : 'DERROTA... El Imperio gana';
    const color = this.result === 'win' ? '#FFE81F' : '#FF4444';

    this.add.text(400, 220, msg, {
      fontSize: '26px', fill: color, fontFamily: 'monospace',
      wordWrap: { width: 700 }, align: 'center'
    }).setOrigin(0.5);

    this.add.text(400, 300, `Puntaje final: ${this.score}`, {
      fontSize: '22px', fill: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(400, 380, 'Presiona ENTER para volver al menú', {
      fontSize: '16px', fill: '#aaaaaa', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });
  }
}