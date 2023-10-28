

const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth ;
canvas.height = window.innerHeight ;


const c = canvas.getContext("2d");

const drawingHistory = [];
let pathCount = 0;

function drawLine(p1, p2, color = "blue", thickness = 2) {
    c.beginPath();
    c.strokeStyle = color ;
    c.lineWidth = thickness; 
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);
    c.stroke();
    c.closePath();
}   

let options = {
    isFreeHandDrawing: true,
    isRectangleDrawing: false,
}


let drawingColor = "blue";
let previousPosition = null ;

function enableRectDrawing() {
    options = {
        isFreeHandDrawing: false,
        isRectangleDrawing: true,
    }
    console.log(options);
}

let intialCount;


function onMouseDown(e) {
    previousPosition = [ e.clientX , e.clientY];
    c.strokeStyle = drawingColor;
    c.lineWidth = 2; 
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp); 
}

function onMouseMove(e){ 
    // for the first time inside this  
    let currentPosition = [ e.clientX , e.clientY ];
    // draw line from previous position to current position ;
    c.beginPath();
    c.moveTo(...previousPosition);
    c.lineTo(...currentPosition);
    c.stroke();
    c.closePath();
    previousPosition = currentPosition ;
}


if (options.isRectangleDrawing) {
    drawRectangle(currentPosition);
}

function drawRectangle(currentPosition) {
    if (intialCount !== pathCount) {
        c.putImageData(drawingHistory[intialCount - 1], 0, 0);
        pathCount = intialCount;
    }

    let width = currentPosition[0] - previousPosition[0];
    let height = currentPosition[1] - previousPosition[1];
    c.strokeRect(previousPosition[0], previousPosition[1], width, height);
    drawingHistory.push(c.getImageData(0, 0, canvas.width, canvas.height));
    pathCount++;
}

function onMouseUp(e){ 
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mouseup", onMouseUp);
    drawingHistory.push(c.getImageData(0, 0, canvas.width, canvas.height));
    pathCount++;
}

const undo = document.getElementById("undo")
const redo = document.getElementById("redo")

function onUndo(){
    if(pathCount) {
        drawingHistory.pop();
        pathCount -- ;
        if(pathCount === 0) {
            c.clearRect(0, 0, canvas.width, canvas.height);
        }
        else {
            c.putImageData(drawingHistory[pathCount - 1], 0, 0)
        }
    }
}

undo.addEventListener("click",onUndo)