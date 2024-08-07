var id_Interval;
var gameOver = false;
var snake;
var pomme;
var dessin;
var canvas;

// Classe Terrain.

export class Terrain {
    canvas;
    ctx;
    constructor(){
        const body= document.querySelector("body");
        const canvas=document.createElement("canvas");
        canvas.width=625;
        canvas.height=625;
        body.appendChild(canvas);
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        console.log(canvas.getContext("2d"));

        
    }

    getCtx(){
        return this.ctx;
    }
    getCanvas(){
        return this.canvas;
    }

    clear(){
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
    }

}
const terrain=new Terrain();

// Classe abstraite Dessin
class Dessin{
    
    constructor(){
        if(new.target === Dessin){
            throw new TypeError("Dessin ne peut pas être directement instancié.")
            
        }
        
    }

    dessin(){
        //Dessiner le dessin.
    }
}

// Classe permettant d'instancier le serpent.
export class Snake extends Dessin {
    body;
    direction;
    nextDirection;

    constructor() {
        super();
        this.body = [[300, 0]];  // Tableau comportant la position des blocks constituant le serpent.
        this.direction = "Down"; // Direction courante du serpent.
        this.nextDirection = "";
        
    }

    setDirection(direction) {
        this.nextDirection = direction; 
    }

    getDirection() {
        return this.direction;
    }

    getBody() {
        return this.body;
    }

    getHead() {
        return this.body[this.body.length - 1];
    }

    // Function qui permet de dessiner le serpent.
    dessin(canvas) {
        const ctx=canvas.getContext("2d");
        if (!ctx) {
            throw new TypeError("Contexte du canvas non défini");
        }
        // Supprime le contenue du canva avant de dessiner le serpent.
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        for (var i = 0; i < this.body.length; i++) {
            var x = this.body[i][0];
            var y = this.body[i][1];
            ctx.fillStyle = "red";
            ctx.fillRect(x, y, 25, 25);
        }
        ctx.restore();
        return true;
    }

    // Function faisant bouger le serpent.
    Move() {
        if (gameOver) return;
        var body = this.body;
        var head = body[body.length - 1];
        var tail = body[0];
        var old_position;
        var pos;

        // Mettre à jour la direction actuelle à partir de nextDirection.
        if ((this.nextDirection === "Right" && this.direction !== "Left") ||
            (this.nextDirection === "Down" && this.direction !== "Up") ||
            (this.nextDirection === "Left" && this.direction !== "Right") ||
            (this.nextDirection === "Up" && this.direction !== "Down")) {
            this.direction = this.nextDirection;
        }
        
        // Mettre à jour la position de chacun des blocks constituant le body.
        for (var i = body.length - 1; i >= 0; i--) {
            if (i != body.length - 1) {   // Dans le cas où le block courant n'est pas la tête du serpent.
                // Affectation de la position du block situé avant le block courant.
                pos = old_position;
                // Affectation de la position du block courant.                         
                old_position = [body[i][0], body[i][1]];
                // Affecte au block courant l'ancienne position du block positionné avant lui.
                body[i] = pos;
            } else {
                old_position = [body[i][0], body[i][1]];
                // Modification de la position de la tête selon la direction du serpent.
                switch (this.direction) {
                    case "Right":
                        body[i][0] += 25;
                        break;
                    case "Down":
                        body[i][1] += 25;
                        break;
                    case "Left":
                        body[i][0] -= 25;
                        break;
                    case "Up":
                        body[i][1] -= 25;
                        break;
                }
            }
        }
        console.log(snake.getHead());    
        
        // Appel de la fonction gérant les collisions.
        collision();
        
        
    }

    Manger(pomme) {
        var pommePos = pomme.position;
        var tail = this.body[0];
        var head = this.body[this.body.length - 1];
        if ((head[0]+25) === (pommePos[0]+25) && (head[1]+25) === (pommePos[1]+25)) {
            console.log("manger");
            this.body.unshift([]);
            return true;
            
        }
        return false;
    }
}


export class Pomme extends Dessin {
    constructor(canvas) {
        super();
        this.position = [Math.floor(Math.random() * (canvas.width / 25)) * 25, Math.floor(Math.random() * (canvas.height/ 25)) * 25];
        
    }

    getPosition() {
        return this.position;
    }

    deplacer(canvas) {
        this.position = [Math.floor(Math.random() * (canvas.width/ 25)) * 25, Math.floor(Math.random() * (canvas.height/ 25)) * 25];
    }

    dessin(ctx) {
        var x = this.position[0];
        var y = this.position[1];
        ctx.save();
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(x + 12.5, y + 12.5, 12.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}



function dessinerCanvas() {
    terrain.clear();
    snake.dessin(terrain.getCanvas());
    pomme.dessin(terrain.getCtx());
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowDown":
            if (snake.getDirection() != "Down" && snake.getDirection() != "Up") {
                snake.setDirection("Down");
            }
            break;
        case "ArrowRight":
            if (snake.getDirection() != "Right" && snake.getDirection() != "Left") {
                snake.setDirection("Right");
            }
            break;
        case "ArrowLeft":
            if (snake.getDirection() != "Left" && snake.getDirection() != "Right") {
                snake.setDirection("Left");
            }
            break;
        case "ArrowUp":
            if (snake.getDirection() != "Up" && snake.getDirection() != "Down") {
                snake.setDirection("Up");
            }
            break;
    }
});



// Function permettant de initialiser la partie. 
 function init(){
    gameOver=false;
    snake = new Snake();
    pomme = new Pomme(terrain.getCanvas());
    canvas=terrain.getCanvas();
    dessin=setInterval(dessinerCanvas, 50);
    setInterval(() => {
        if (snake.Manger(pomme)) {
            pomme.deplacer(canvas);
        }
    }, 10);

    id_Interval = setInterval(snake.Move.bind(snake), 55);
}

function collision(){
    var snakeBody=snake.getBody();
    const head=snake.getHead();

    // Met fin à la partie en cas de collision entre le serpent est le terrain de jeu.
    if ((snake.getHead()[0]+25)> canvas.width || (snake.getHead()[0]) < 0 || (snake.getHead()[1]+25)> canvas.height || (snake.getHead()[1]) < 0 ) {
        // Arrêt du déplacement du serpent.
        clearInterval(id_Interval);
        // Arrêt de la mis à jour de la position du serpent.
        clearInterval(dessin);
        // Marque le jeu comme terminé.
        gameOver = true; 
        
    }  


    snakeBody.forEach((block)=>{
        // Met fin à la partie en cas de collision entre la tête du serpent et son coprs.
        if((head[0]+25 === block[0]+25 && head[1]+25 === block[1]+25) && block != head){
            console.log("collision");
            gameOver=true;
        }
    })
}

setInterval(()=>{if(gameOver){
    init();
}});
init();