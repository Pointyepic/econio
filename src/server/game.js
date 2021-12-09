const Constants = require('../shared/constants');
const Player = require('./player');
const Consumer = require('./consumer');
const Resource = require('./resource');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.consumers = [];
    this.resources = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    this.numConsumers=Constants.MAX_CONSUMERS; //current num of consumers in game
    this.curr_consumers = Constants.MAX_CONSUMERS; //current max num of consumer
    this.numResources = Constants.MAX_RESOURCES;
    this.time=0;
    for (let i=0; i<Constants.MAX_CONSUMERS; i++) {
      this.addConsumer();
    }
    for (let i=0; i<Constants.MAX_RESOURCES; i++) {
      this.addResource();
    }
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username, icontype) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);

    this.players[socket.id] = new Player(socket.id, username, icontype, x, y, 0);
  }

  addConsumer() {
    // Generate a position to start this consumer at.
    const x = (Constants.MAP_SIZE-Constants.PLAYER_RADIUS*2) * Math.random()+Constants.PLAYER_RADIUS;
    const y = (Constants.MAP_SIZE-Constants.PLAYER_RADIUS*2) * Math.random()+Constants.PLAYER_RADIUS;
    const newConsumer = new Consumer(x,y);
    this.consumers.push(newConsumer);
  }

  addResource() {
    // Generate a position to start this consumer at.
    const x = (Constants.MAP_SIZE-Constants.PLAYER_RADIUS*2) * Math.random()+Constants.PLAYER_RADIUS;
    const y = (Constants.MAP_SIZE-Constants.PLAYER_RADIUS*2) * Math.random()+Constants.PLAYER_RADIUS;

    console.log("New resource spawned");
    const newResource = new Resource(x,y);
    this.resources.push(newResource);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, spd, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setSpeed(spd);
      this.players[socket.id].setDirection(dir);
    }
  }

  shootBullet(socket, dir) {
    const player = this.players[socket.id];
    const newBullet = player.shoot(dir);
    this.bullets.push(newBullet); 
    //console.log(dir);
  }

  changeOrientation(socket, ori) {
    if (this.players[socket.id]) {
      this.players[socket.id].setOrientation(ori);
    }
  }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;
    //console.log(Math.round(now/1000));

    //AD decreased
    if (Math.round(now/1000)%120 == 0 && this.curr_consumers==20) {
      this.curr_consumers = 5;
      console.log("Number of Pelkeys reduced to 5.");
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        if (!player.dead)
          socket.emit(Constants.MSG_TYPES.REDUCE_PELKEYS);
      });
    }
    //AD increased
    if (Math.round(now/1000)%120 == 60 && this.curr_consumers==20) {
      this.curr_consumers = 40;
      console.log("Number of Pelkeys increased to 40.");
      Object.keys(this.sockets).forEach(playerID => {
          const socket = this.sockets[playerID];
          const player = this.players[playerID];
          if (!player.dead)
            socket.emit(Constants.MSG_TYPES.INCREASE_PELKEYS);
        });
    }
    //normal state
    if (Math.round(now/1000)%60 == 30 && (this.curr_consumers==5 || this.curr_consumers==40)) {
      console.log("Number of Pelkeys back to 20.");
      this.curr_consumers = 20;
      Object.keys(this.sockets).forEach(playerID => {
          const socket = this.sockets[playerID];
          const player = this.players[playerID];
          if (!player.dead)
            socket.emit(Constants.MSG_TYPES.NORMAL_PELKEYS);
      });
    }
    //remove/add consumers
    if (this.numConsumers > this.curr_consumers) {
      this.consumers.splice(this.curr_consumers);
      this.numConsumers=5;
    }
    // Check num of consumers and spawn accordingly
    while (this.numConsumers < this.curr_consumers) {
      this.addConsumer();
      this.numConsumers++;
    }

    //add back resources every minute if less than two available
    if (Math.round(now/1000)%45==0 && this.numResources < 2) {
      while (this.numResources < Constants.MAX_RESOURCES) {
        this.addResource();
        this.numResources++;
      }
    }

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
    
    //Update each resource
    this.resources.forEach(resource => {
      resource.update(dt);
    });
    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      player.update(dt);
    });
    
    //Apply collisions, give players score for hitting bullets
    let destroyedBullets = applyCollisions(
      Object.values(this.players),
      this.bullets,
      "player",
      this.players,
    ); 

    /*destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });*/

    this.bullets = this.bullets.filter(
      bullet => !destroyedBullets.includes(bullet),
    );
    
    //Apply collisions to consumers
    destroyedBullets = applyCollisions(
      this.consumers,
      this.bullets,
      "consumer",
      this.players,
    ); 


    /*destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });*/

    this.bullets = this.bullets.filter(
      bullet => !destroyedBullets.includes(bullet),
    );
    
    //check collisions with resources
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        for (let i = 0; i < this.numResources; i++) {
          const resource = this.resources[i];
          if (
            player.distanceTo(resource) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS 
          ) {
              this.resources.splice(i,1);
              this.numResources--;
              player.score+=200;
              player.hp+=200;
              socket.emit(Constants.MSG_TYPES.GDP_INCREASE);
              break;
          }
        }
      });
    

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0 && !player.dead) {
        //console.log(playerID+ " "+player.hp);
        player.dead=true;
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        
        //this.removePlayer(socket);
      }
    });

    //Check if any consumer are dead
    for (let i=0; i<this.consumers.length; i++) {
      const consumer=this.consumers[i];
      if (consumer.hp <= 0) {
        this.consumers.splice(i,1);
        this.numConsumers--;
        
      }
    }

    // Send a game update to each player every other time
    
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(
          Constants.MSG_TYPES.GAME_UPDATE,
          this.createUpdate(player, leaderboard),
        );
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    let board = Object.values(this.players);
    let index = board.findIndex(player => player.dead==true);
    while (index!=-1) {
        board.splice(index, 1);
        index = board.findIndex(player => player.dead==true);
    }
    return board
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.dead == false && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyConsumers = this.consumers.filter(
      c => c.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyResources = this.resources.filter(
      r => r.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      consumers: nearbyConsumers.map(c => c.serializeForUpdate()),
      resources: nearbyResources.map(r => r.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;

