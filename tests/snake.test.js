import { describe, it, expect, beforeEach } from 'vitest';
import { Snake,Terrain,Pomme } from '../snake.js';


describe("Serpent",()=>{
    var terrain;
    var snake;
    
    beforeEach(()=>{
        
        terrain= new Terrain();
        snake= new Snake();
        document.body.appendChild(terrain.getCanvas());
        console.log("test context");
        console.log(terrain.getCtx());
        


    });
    
    it("initialisation du serpent en (300,0)",()=>{
        expect(snake.getHead()).toEqual([300,0]);
    })

    it("Direction Down par défaut",()=>{
        expect(snake.getDirection()).toEqual("Down");
    })

    it("Serpent de taille 1",()=>{
        expect(snake.getBody().length).toEqual(1);
    })

    it("Dessiner le serpent ",()=>{
        var ctx=terrain.getCtx();
        expect(snake.dessin(terrain.getCanvas())).toBe(true);
    }) 

})