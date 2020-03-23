import { Game } from "./Game";

export class DialogueBox {

    text : string[] = [];
    textLength : number;
    width : number;
    height : number;
    xPosDraw : number;
    yPosDraw : number;
    padding : number = 10;

    renderIndex : number = 0;

    reset(game:Game){
        if(game.canvas.width > 300){
            this.width = 256;
        }
        else if(game.canvas.width > 200){
            this.width = 192;
        }
        else {
            this.width = 128;
        }

        this.height = Math.floor(game.canvas.height/4);
        
        this.xPosDraw = Math.round(game.canvas.width/2 - this.width/2);
        this.yPosDraw = Math.round(game.canvas.height - this.height - this.padding*2);
    }

    setText(game:Game,text:string){
        this.renderIndex = 0;
        this.textLength = text.length;
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

    dialogueGradient(ctx:CanvasRenderingContext2D,color:string):CanvasGradient{
        let gradient:CanvasGradient;

        gradient = ctx.createLinearGradient(0,this.yPosDraw,0,this.yPosDraw+this.height);

        // gradient.addColorStop(0,color);
        gradient.addColorStop(0,'#ffffff');
        gradient.addColorStop(1,color);

        return gradient;
    }

    draw(game:Game){
        game.ctx.fillStyle = this.dialogueGradient(game.ctx,"#ccffff");
        game.level.drawRoundRect(game.ctx,this.xPosDraw,this.yPosDraw,this.width,this.height,8);
        game.ctx.fill();
        game.ctx.lineWidth = 2;
        game.ctx.strokeStyle = "#336666"
        game.ctx.stroke();

        let thisBox = this;

        let renderedLines:string[] = [];
        let renderIndexTemp = this.renderIndex;

        if(this.renderIndex < this.textLength){
            this.text.forEach(function(line){
                if(renderIndexTemp > 0){
                    if(renderIndexTemp < line.length){
                        renderedLines.push(line.substr(0,renderIndexTemp));
                        renderIndexTemp = 0;
                    }
                    else {
                        renderedLines.push(line);
                        renderIndexTemp = renderIndexTemp - line.length;
                    }
                }
            });
        }
        else {
            renderedLines = this.text;
        }
        

        game.ctx.fillStyle = "#000000";
        game.ctx.font = "16px Determination";
        game.ctx.textAlign = "left";
        renderedLines.forEach(function(line,index){
            game.ctx.fillText(line,Math.floor(thisBox.xPosDraw + thisBox.padding),Math.floor(thisBox.yPosDraw - 4 + 16 * (index+1) + thisBox.padding));
        });

        if(this.renderIndex < this.textLength) this.renderIndex += 1/2;
    }
}