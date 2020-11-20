




/**
 * Computer plays a round
 * @returns {string}
 */
function computerPlay()
{
    return choose("Rock","Paper","Scissors");
}

function getInput()
{
    let answer = parseInt(prompt("Please enter the number you would like to FizzBuzz up to: "));
    return answer;
}







///----------------------------------------------UTILITY SCRIPTS----------------------------------------------///




/**
 * Returns random pick of inputs
 */
function choose(inputs)
{
    return arguments[irandom_range(0,arguments.length-1)];
}

/**
 * Returns random int - min/max inclusive
 */
function irandom_range(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns random float - min/max inclusive
 */
function random_range(min, max) {
    return Math.random() * (max - min) + min;
  }

 

function show_debug_message(value)
{
    console.log(value);
}

////////////////////

/*var canvas;
var ctx;*/
function gm_init(can){
    canvas = document.getElementById(can)
    ctx = canvas.getContext('2d');
    console.log(ctx)
    console.log(canvas)
}

////////////////////!DATA_STRUCTURE////////////////////
function ds_destroy(id){
    delete id;
}

////////////////////!DS_LIST////////////////////
function ds_list_create(){
    return(new Array());
    
}
function ds_list_set(id, pos, val){
    return(id[pos]=[val]);
}
function ds_list_delete(id, pos){
    id.splice(pos,pos)
}

function ds_list_destroy(id){
    id.length=0;
}

//////////////////////////////////////////////////////!Colour And Blending//////////////////////////////////////////////////////
//draw_set_alpha(alpha);
function draw_set_alpha(alpha){
    ctx.globalAlpha = alpha;
    }
    
    //draw_clear(color);
    function draw_clear(color){
    var temp_color=ctx.fillStyle;
    ctx.fillStyle = color;
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = temp_color;
    }
    //draw_clear_screen();
    function draw_clear_screen(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    //draw_set_color(color)
    function draw_set_color(color){
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    }
    
    //////////////////////////////////////////////////////!Drawing Shapes//////////////////////////////////////////////////////
    //draw_rectangle(x1,y1,x2,y2,outline);
    function draw_rectangle(x1, y1, x2, y2,rot, outline){
        ctx.beginPath();
        if (rot!==undefined){
        ctx.translate( x1+(x2-x1)/(x2-x1)/2, y2-(y2-y1) );
        ctx.rotate(rot)}
        
        if (outline==false){
            if (rot==undefined)
        ctx.fillRect(x1, y1, x2-x1, y2-y1);
        else
        ctx.fillRect(-(x2-x1)/2, -(x2-x1)/2, x2-x1, y2-y1);
        }else{
        ctx.rect(x1+.5, y1+.5, (x2-x1), (y2-y1));    
        ctx.closePath()
        ctx.stroke();
        
    }
    
    }
    //draw_circle(x,y,r,outline);
    function draw_circle(x, y, r, outline){
        ctx.beginPath();
            if (outline==false) {
    
                ctx.arc(x+.5, y+.5, r, 0, 2 * Math.PI);
    
            ctx.fill();
        }else
            {
                ctx.arc(x, y, r, 0, 2 * Math.PI);
            }
            ctx.closePath()
            ctx.stroke();
            
    }
    
    function draw_line(x1, y1, x2, y2 ){
    ctx.beginPath();
    ctx.moveTo(x1, y1+.5);
    ctx.lineTo(x2, y2+.5);
    ctx.stroke();
    }
    
    //////////////////////////////////////////////////////!Drawing Text//////////////////////////////////////////////////////
    //draw_text(x, y, string);
    function draw_text(x, y, string){
        ctx.fillText(string, x, y);
    }
    //draw_set_font(font);
    function draw_set_font(font,size)
    {
        if (size!=undefined)
        {
             ctx.font = "900 "+size+"px "+font;
        }
        else
        {
        ctx.font = font 
        console.log("%c!NO FONT SIZE!","color: #ff0000")
        }
    }
    //////////////////////////////////////////////////////!Drawing Sprites//////////////////////////////////////////////////////
    //draw_sprite(sprite, subimg, x, y);

