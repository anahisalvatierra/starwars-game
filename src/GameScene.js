class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  init(data) {
    this.numPlayers = data.players || 1;
  }

  create() {
    // Fondo
    this.bg = this.add.tileSprite(400, 300, 800, 600, 'bg');

    // Jugador 1 (X-Wing) — controles: flechas + Z para disparar
    this.player1 = this.physics.add.sprite(200, 300, 'xwing').setScale(0.5);
    this.player1.hp = 3;
    this.cursors = this.input.keyboard.createCursorKeys();
    this.fireKey1 = this.input.keyboard.addKey('Z');

    // Jugador 2 (Tie Fighter controlado) — solo si numPlayers == 2
    if (this.numPlayers === 2) {
      this.player2 = this.physics.add.sprite(600, 300, 'tie').setScale(0.5);
      this.player2.hp = 3;
      this.wasd = this.input.keyboard.addKeys({ up:'W', down:'S', left:'A', right:'D' });
      this.fireKey2 = this.input.keyboard.addKey('SPACE');
    }

    // Grupos de disparos
    this.lasers1 = this.physics.add.group();
    this.lasers2 = this.physics.add.group();

    // Enemigos Tie Fighter (CPU)
    this.enemies = this.physics.add.group();
    this.spawnTimer = this.time.addEvent({
      delay: 1800, callback: this.spawnEnemy, callbackScope: this, loop: true
    });

    // Estrella de la Muerte (al fondo derecha)
    this.deathStar = this.physics.add.image(760, 300, 'deathstar').setScale(0.4);
    this.deathStar.setVelocityX(-20); // avanza lentamente

    // Barra de vida jugador 1
    this.hpBar1 = this.add.graphics();
    this.drawHP(this.hpBar1, 10, 10, this.player1.hp, 0x00ff00);

    // Barra de vida jugador 2 (si existe)
    if (this.numPlayers === 2) {
      this.hpBar2 = this.add.graphics();
      this.drawHP(this.hpBar2, 650, 10, this.player2.hp, 0xff4400);
    }

    // Puntaje
    this.score = 0;
    this.scoreTxt = this.add.text(16, 40, 'Puntaje: 0', {
      fontSize: '16px', fill: '#fff', fontFamily: 'monospace'
    });

    // Colisiones
    this.physics.add.overlap(this.lasers1, this.enemies, this.hitEnemy, null, this);
    this.physics.add.overlap(this.enemies, this.player1, this.enemyHitsPlayer, null, this);

    if (this.numPlayers === 2) {
      this.physics.add.overlap(this.lasers2, this.enemies, this.hitEnemy, null, this);
    }
  }

  update() {
    // Scroll del fondo (efecto parallax)
    this.bg.tilePositionX += 2;

    // Mover jugador 1
    this.player1.setVelocity(0);
    if (this.cursors.up.isDown)    this.player1.setVelocityY(-200);
    if (this.cursors.down.isDown)  this.player1.setVelocityY(200);
    if (this.cursors.left.isDown)  this.player1.setVelocityX(-200);
    if (this.cursors.right.isDown) this.player1.setVelocityX(200);

    // Disparar jugador 1
    if (Phaser.Input.Keyboard.JustDown(this.fireKey1)) this.shoot(this.player1, this.lasers1, 1);

    // Jugador 2
    if (this.numPlayers === 2 && this.player2 && this.player2.active) {
      this.player2.setVelocity(0);
      if (this.wasd.up.isDown)    this.player2.setVelocityY(-200);
      if (this.wasd.down.isDown)  this.player2.setVelocityY(200);
      if (this.wasd.left.isDown)  this.player2.setVelocityX(-200);
      if (this.wasd.right.isDown) this.player2.setVelocityX(200);
      if (Phaser.Input.Keyboard.JustDown(this.fireKey2)) this.shoot(this.player2, this.lasers2, 2);
    }

    // Verificar si X-Wing llega a la Estrella de la Muerte
    if (this.deathStar.x < 100) {
      this.endGame('lose'); // X-Wing no la destruyó a tiempo
    }
  }

  shoot(player, group, playerNum) {
    const laser = group.create(player.x + 30, player.y, 'laser');
    laser.setVelocityX(playerNum === 2 ? -400 : 400);
    laser.setScale(0.5);
    this.sound.play('laserSnd', { volume: 0.3 });
    this.time.delayedCall(2000, () => { if (laser.active) laser.destroy(); });
  }

  spawnEnemy() {
    const y = Phaser.Math.Between(50, 550);
    const enemy = this.enemies.create(820, y, 'tie').setScale(0.5);
    enemy.setVelocityX(-120);
    enemy.hp = 1;
  }

  hitEnemy(laser, enemy) {
    laser.destroy();
    enemy.hp -= 1;
    if (enemy.hp <= 0) {
      this.sound.play('explodeSnd', { volume: 0.5 });
      enemy.destroy();
      this.score += 100;
      this.scoreTxt.setText('Puntaje: ' + this.score);
      // Bonus: si destruye suficientes, termina la partida con victoria
      if (this.score >= 1000) this.endGame('win');
    }
  }

  enemyHitsPlayer(enemy, player) {
    enemy.destroy();
    player.hp -= 1;
    this.drawHP(this.hpBar1, 10, 10, this.player1.hp, 0x00ff00);
    this.sound.play('explodeSnd', { volume: 0.3 });
    if (player.hp <= 0) this.endGame('lose');
  }

  drawHP(graphics, x, y, hp, color) {
    graphics.clear();
    graphics.fillStyle(0x333333).fillRect(x, y, 90, 12);
    graphics.fillStyle(color).fillRect(x, y, hp * 30, 12);
  }

  endGame(result) {
    this.scene.start('GameOver', { result, score: this.score });
  }
}