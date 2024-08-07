import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Snake,Terrain,Pomme } from '../snake.js';



describe("Serpent",()=>{
    var terrain;
    var snake;
    var pomme;

    beforeEach(()=>{
        
        terrain= new Terrain();
        snake= new Snake();
        pomme = new Pomme(terrain.getCanvas());
        
        


    });
    
    it("initialisation du serpent en (300,0)",()=>{
        expect(snake.getHead).toBeDefined();
        expect(snake.getHead()).toEqual([300,0]);
    })

    it("Direction Down par défaut",()=>{
        expect(snake.getDirection).toBeDefined();
        expect(snake.getDirection()).toEqual("Down");
    })

    it("Serpent de taille 1",()=>{
        expect(snake.getBody).toBeDefined();
        expect(snake.getBody().length).toEqual(1);
    })

    it("Dessiner le serpent ",()=>{
        expect(snake.dessin).toBeDefined();
        // Déclaration de variables contenant le canvas et le context du terrain.
        const terrain_canvas=terrain.getCanvas();
        const terrain_canvas_ctx=terrain.getCtx();
        // Variable de test.
        var test=false;
        // Création d'un canvas vierge.
        const canvas_test=document.createElement("canvas");
        canvas_test.width=625;
        canvas_test.height=625;
        const canvas_test_ctx= canvas_test.getContext("2d");
        snake.dessin(terrain_canvas);
        // Données des pixels du tableau vierge.
        const imageData1= canvas_test_ctx.getImageData(0, 0, canvas_test.width, canvas_test.height).data;
        // Données des pixels du tableau contenant le serpent.
        const imageData2= terrain_canvas_ctx.getImageData(0, 0, terrain_canvas.width, terrain_canvas.height).data;
        
        
        // Compare la taille des deux tableaux.
        if (imageData1.length !== imageData2.length) {
            throw new Error("Les canvas n'ont pas la même taille.");
          }


        // Compare les valeurs RGBA des pixels du tableau vierge avec ceux du tableau du terrain.
        for (let i = 0; i < imageData1.length; i++) {
            if (imageData1[i] !== imageData2[i]) {
                test=true;
            }}
        
        if (test !== true){
            throw new Error("Le terrain est vide.")
        }
    }) 


    it("Mouvement du serpent", ()=>{
        expect(snake.Move).toBeDefined();
        expect(snake.setDirection).toBeDefined();
        snake.Move();
        expect(snake.getHead()).toEqual([300,25]);
        snake.setDirection("Right");
        snake.Move();
        expect(snake.getHead()).toEqual([325,25]);
        snake.setDirection("Down");
        snake.Move();
        snake.Move();
        expect(snake.getHead()).toEqual([325,75]);
        snake.setDirection("Left");
        snake.Move();
        expect(snake.getHead()).toEqual([300,75]);
        snake.setDirection("Up");
        snake.Move();
        expect(snake.getHead()).toEqual([300,50]);

    })

    it("Manger pomme",()=>{

        if(pomme.getPosition()[0] === snake.getHead()[0] && pomme.getPosition()[1] === snake.getHead()[1]){
            expect(snake.Manger).toBeDefined();
            const spyManger=vi.spyOn(snake,'Manger');
            snake.Manger(pomme);
            expect(spyManger).toHaveBeenCalled();
            const Arg= spyManger.mock.calls[0][0];
            expect(Arg).toBeInstanceOf(Pomme);
            spyManger.mockRestore();
            expect(snake.Manger(pomme)).toBe(true);
            
        }
        
   
    })
})

describe("Pomme",()=>{
    var terrain;
    var pomme;

    beforeEach(()=>{
        
        terrain= new Terrain();
        pomme = new Pomme(terrain.getCanvas());
        
        


    });

    it("Initialisation de la Pomme",()=>{
        expect(pomme.getPosition).toBeDefined();
        expect(pomme.getPosition()).toBeInstanceOf(Array);
        expect(pomme.getPosition()[0]).toBeTypeOf("number");
        expect(pomme.getPosition()[1]).toBeTypeOf("number");
        expect(pomme.getPosition()[0]).toBeGreaterThanOrEqual(0);
        expect(pomme.getPosition()[1]).toBeGreaterThanOrEqual(0);
        
    })

    it("Déplacer la Pomme",()=>{
        const canvas=document.createElement("Canvas");
        canvas.width=625;
        canvas.height=625;
        const canvas_ctx=canvas.getContext("2d");
        expect(pomme.getPosition).toBeDefined();
        expect(pomme.deplacer).toBeDefined();
        const init_pos=pomme.getPosition();
        const spyDeplacer=vi.spyOn(pomme,"deplacer");
        pomme.deplacer(terrain.getCanvas());
        expect(spyDeplacer.mock.calls[0][0].getContext("2d")).toBeInstanceOf(canvas_ctx.constructor);
        const new_pos=pomme.getPosition();
        expect(init_pos).not.toEqual(new_pos);
        console.log(init_pos);
        console.log(new_pos,"new pos");
        
    })
})