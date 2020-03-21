import { Game } from "./Game";

export class DialogueBox {

    text : string[] = [];
    width : number;
    height : number;
    xPosDraw : number;
    yPosDraw : number;
    padding : number = 10;

    reset(game:Game){
        this.width = 200;
        this.height = game.canvas.height/4;
        
        this.xPosDraw = game.canvas.width/2 - this.width/2;
        this.yPosDraw = game.canvas.height - this.height - this.padding*2;
    }

    setText(game:Game,text:string){
        this.text = this.getLines(game.ctx,text);
    }

    resetText(){
        this.text = [];
    }

    getLines(ctx:CanvasRenderingContext2D, text:string):string[] {
        var words = text.split(" ");
        var lines = [];
        var currentLine = words[0];
    
        for (var i = 1; i < words.length; i++) {
            var word = words[i];
            var width = ctx.measureText(currentLine + " " + word).width;
            if (width < this.width - this.padding) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    draw(game:Game){
        game.ctx.fillStyle = "#ffffff";
        game.ctx.fillRect(
            this.xPosDraw,
            this.yPosDraw,
            this.width,this.height
        );

        let thisBox = this;

        game.ctx.fillStyle = "#000000";
        game.ctx.font = "12px Arial, Helvetica, sans-serif";
        this.text.forEach(function(line,index){
            game.ctx.fillText(line,thisBox.xPosDraw + thisBox.padding,thisBox.yPosDraw + 12 * (index+1) + thisBox.padding);
        });
    }
}