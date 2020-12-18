var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("trex10.png","trex20.png","trex30.png");
  trex_collided = loadAnimation("trex_Collided0.png");
  
  groundImage = loadImage("ground0.png");
  
  cloudImage = loadImage("cloud0.png");
  
  obstacle1 = loadImage("obs10.png");
  obstacle2 = loadImage("obs20.png");
  obstacle3 = loadImage("obs30.png");
  obstacle4 = loadImage("obs40.png");
  obstacle5 = loadImage("obs50.png");
  obstacle6 = loadImage("obs60.png");
  
  gameOverImg = loadImage("gameover0.png");
  restartImg = loadImage("restart0.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(100,123,10,10);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.1;
  //trex.setCollider(30,30,30,10)
   trex.setCollider("rectangle",0,-50,600,400);

 
  gameOver = createSprite(camera.position.x+10,camera.position.y);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(camera.position.x+200,camera.position.y+30);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,200,400,10);
  invisibleGround.visible = false;
  
  ground = createSprite(camera.position.x,camera.position.y-210,400,20);
  ground.addImage(groundImage);
  ground.x = ground.width /2 - 1100;
  ground.velocityX = -(6 + 3*score/100);
  

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  trex.debug = true;
  background("lightblue");
  
  push() 
  textFont('Georgia');
  textStyle(BOLD);
  textSize(20);
  text("Score: "+ score, camera.position.x+300,camera.position.y-200);
  pop()
  

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    camera.position.x = trex.x;
    camera.position.y = trex.y 
  
    if(keyDown("space") && trex.y >= 123) {
      trex.velocityY = -12;
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < camera.position.x){
      ground.x = 300;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
   

    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,10);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.debug = true;
    obstacle.setCollider("rectangle",10,10,20,20);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}