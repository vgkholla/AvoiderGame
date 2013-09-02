var avatar = new Image();
var enemy = new Image();

var avatarX;
var avatarY;

var enemyXPositions = new Array();
var enemyYPositions = new Array();
var enemySpeeds = new Array();

var intervalId;
var defaultWidth = 600;

var ticks = 0;
var level = 1;
var maxLevel = 10;
var levelThresholds = [0, 500, 700, 900, 1100, 1700, 2400, 3200, 4100, 5500];

avatar.src = "img/avatar.png";
enemy.src = "img/enemy.png";

var gamePaused = -1;

var Key = {
	SPACE : 32
};

initKeyboardControl()

function initKeyboardControl() {
	console.log("adding event listener");
	document.addEventListener("keydown", listenForSpace, false);
}

function listenForSpace(event) {
	if(event.keyCode != Key.SPACE)
		return;
	if(gamePaused == 0) //game is playing right now
		pauseGame();
	else if(gamePaused == 1) //game is paused
		resumeGame();
}

function pauseGame() {
	stopTicking();
}

function resumeGame() {
	startTicking();
}

function stopTicking() {
	clearInterval(intervalId);
	gamePaused = 1;
}

function startTicking() {
	intervalId = setInterval(handleTick, 25);
	gamePaused =0;
}

function initGame() {
	//default all variables
	var gameCanvas = document.getElementById("gameCanvas");

	avatarX = gameCanvas.width/2;
	avatarY = gameCanvas.height -30;

	enemyXPositions = [];
	enemyYPositions=[];
	enemySpeeds=[]

	ticks = 0;
	level =1;
	
	refreshCanvas();
	//gameCanvas.getContext("2d").drawImage(avatar, avatarX, avatarY)

	gameCanvas.addEventListener("mousemove", repositionAvatar);
	startTicking();
}

function refreshCanvas() {
	gameCanvas.width = defaultWidth;
}
function repositionAvatar(mouseEvent)
{
	var gameCanvas = document.getElementById("gameCanvas");
	avatarX = mouseEvent.offsetX;
	if(avatarX > gameCanvas.width - 30)
		avatarX = gameCanvas.width - 30;
	avatarY = mouseEvent.offsetY;
}

function redrawAvatar() {
	var gameCanvas = document.getElementById("gameCanvas");

	gameCanvas.getContext("2d").drawImage(avatar, avatarX, avatarY);
}

function redrawEnemies() {
	enemyXPositions.forEach(drawEnemy)
}

function drawEnemy(enemyX, index, array) {
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.getContext("2d").drawImage(enemy, enemyX, enemyYPositions[index]);	
}

function handleTick() {
	var gameCanvas = document.getElementById("gameCanvas");
	
	enemyYPositions.forEach(moveEnemy)
	//console.log(enemyXPositions[0]);
	//console.log(enemyYPositions[0]);

	refreshCanvas(); //to erase our canvas

	ticks++;
	if(level < maxLevel && ticks >= levelThresholds[level]) {
		level++;
	}
	console.log("level is " + level)

	if(Math.random() < (1/50) * level)
		makeNewEnemy();

	redrawEnemies()
	redrawAvatar()
	rewriteText();

	for (var i =0; i < enemyXPositions.length; i++) {
		if(hasCollided(i)) {
			gameOver();
		}
	}
}

function rewriteText() {
	var gameCanvas = document.getElementById("gameCanvas");
	gameCanvas.getContext("2d").font = "18px Iceland";
	gameCanvas.getContext("2d").textBaseline = "top"
	gameCanvas.getContext("2d").fillText("Score: " + Math.floor(ticks/10), 5, 5);
	gameCanvas.getContext("2d").fillText("Level: " + level, 5, 25)
}

function makeNewEnemy() {

	var gameCanvas = document.getElementById("gameCanvas");
	x = Math.random() * gameCanvas.width;
	while(x < 30 || x > gameCanvas.width -30)
		x = Math.random() * gameCanvas.width;
	enemyXPositions.push(x);
	enemyYPositions.push(-30);
	speed = Math.random() * 4;
	if(speed < 1){
		speed = 1;
	}
	enemySpeeds.push(speed);
	//console.log(enemyXPositions[0]);
	//console.log(enemyYPositions[0]);
}

function moveEnemy(pos, index, array) {
	var gameCanvas = document.getElementById("gameCanvas");
	array[index] += enemySpeeds[index];
	if(array[index] > gameCanvas.height) {
		//console.log("array size was " + array.length);
		enemyYPositions.splice(index,1);
		enemyXPositions.splice(index,1);
		enemySpeeds.splice(index,1);
		//console.log("array size is " + array.length);
	}
}

function hasCollided(enemyIndex) {
	if ( ( (avatarX < enemyXPositions[enemyIndex] && enemyXPositions[enemyIndex] < avatarX + 30) 
		|| (enemyXPositions[enemyIndex] < avatarX && avatarX < enemyXPositions[enemyIndex] + 30) ) 
			&& ( (avatarY < enemyYPositions[enemyIndex] && enemyYPositions[enemyIndex] < avatarY + 30) 
				|| (enemyYPositions[enemyIndex] < avatarY && avatarY < enemyYPositions[enemyIndex] + 30) ) ) {
		return true;
	}
	return false;
}

function gameOver() {
	var gameCanvas = document.getElementById("gameCanvas");
	var fontSize = 30;
	gameCanvas.getContext("2d").font = fontSize + "px Iceland";
	gameCanvas.getContext("2d").fillStyle = "blue";
	gameCanvas.getContext("2d").textBaseline = "top"
	gameCanvas.getContext("2d").fillText("Sorry! A grump hit you! :(", gameCanvas.width/2 - 160, gameCanvas.height/2 - 50);
	gameCanvas.getContext("2d").fillText("Your Score: " + Math.floor(ticks/10), gameCanvas.width/2 -90, gameCanvas.height/2 -50 + fontSize);
	gameCanvas.getContext("2d").fillText("Click to play again!", gameCanvas.width/2 -120, gameCanvas.height/2 -50 + fontSize * 2);
	stopTicking();
	gamePaused = -1;
}