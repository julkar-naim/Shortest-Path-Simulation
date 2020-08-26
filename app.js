import Queue from './queue.js';
let canvas = document.getElementById("canvas");
let context = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let border = 1;
let cellSize = 15;
let cellColor = '#00bfa5';
let sourceColor = '#ffff00';
let desColor = '#ff1744';
let found = '#6200ea';
let wallColor = '#212121';
let cellWithBorder = cellSize+border;
let X = 0, Y = 0;
let isDrawing = false;
let source, destination;
let sourceBool = false;
let desBool = false;
let M = Math.floor(width/cellWithBorder);
let N = Math.floor(height/cellWithBorder);
const grid = new Array(M);
const parent = new Array(M)

const getCell = (x, y) => {
    x = Math.floor((x/cellWithBorder));
    y = Math.floor((y/cellWithBorder));
    return {x,y};
}

for(let i = 0 ; i < width; i += cellSize + border){
    let col = Math.floor(i/cellWithBorder);
    grid[col] = new Array(N);
    parent[col] = new Array(N);
    for(let j = 0; j < height; j += cellSize + border){
        context.fillStyle = cellColor;
        context.fillRect(i, j, cellSize, cellSize);
        let row = Math.floor(j/cellWithBorder);
        grid[col][row] = cellColor;
    }
}

const paint = (x, y, color)=>{
    context.beginPath();
    context.fillStyle = color;
    context.fillRect(x*cellWithBorder, y*cellWithBorder, cellSize, cellSize);
}

//
// Drawing Wall 

canvas.addEventListener('mousedown', e => {
    isDrawing = true;
});
canvas.addEventListener('mousemove', e => {
    if(isDrawing){
        let {x, y} = getCell(e.x, e.y);
        paint(x, y, wallColor);
        grid[x][y] = wallColor;
    }
});
window.addEventListener('mouseup', e => {
    if(isDrawing){
        let {x, y} = getCell(e.x, e.y);
        paint(x, y, wallColor);
        grid[x][y] = wallColor;
        isDrawing = false;
    }
});


//  Functionality for source button
//
let src = document.getElementById('source');

let sourceWork = () => {
    if(source){
        paint(source.x, source.y, cellColor);
        grid[source.x][source.y] = cellColor;
    }
    let {x, y} = getCell(event.x, event.y);
    source = { x:x, y:y };
    paint(x, y, sourceColor);
    grid[source.x][source.y] = sourceColor;
    canvas.removeEventListener('click', sourceWork);
    sourceBool = false;
};
src.addEventListener('click', ()=>{
    sourceBool = true;
    canvas.addEventListener('click', sourceWork);
});
// ============================================= 
//
// Funciotnality for destination button
//
let des = document.getElementById('destination');

let desWork = () => {
    if(destination){
        paint(destination.x, destination.y, cellColor);
        grid[destination.x][destination.y] = cellColor;
    }
    let {x, y} = getCell(event.x, event.y);
    destination = {x:x, y:y};
    paint(x, y, desColor);
    grid[destination.x][destination.y] = desColor;
    canvas.removeEventListener('click', desWork);
    desBool = false;
};
des.addEventListener('click', () => {
    desBool = true;
    canvas.addEventListener('click', desWork);
});
/// =============================================== 
//
//
//
//
// ===== Finding path with BFS Alogrithm
//

const dr = [0, 0, -1, +1];
const dc = [-1, +1, 0, 0];

function valid(x, y){
    return x >= 0 && x <= M && y >= 0 && y <= N;
}


function BFS(){
    let q = new Queue();
    q.enque(source);
    paint(source.x, source.y, sourceColor);
    grid[source.x][source.y] = sourceColor;

    function findPath(){
        if(q.isEmpty()) return;
        let u = q.deque();
        for(let i = 0; i < 4; i++){
            let nx = u.x+dr[i];
            let ny = u.y+dc[i];
            if(valid(nx, ny) && grid[nx][ny] !== sourceColor 
                && grid[nx][ny] !== wallColor){

                parent[nx][ny] = {x: u.x, y: u.y};

                if(grid[nx][ny] === desColor){
                    paint(nx, ny, found);
                    printPath();
                    return;
                }
                grid[nx][ny] = sourceColor;
                paint(nx, ny, sourceColor);
                q.enque({x:nx, y:ny});
            }
        }
        requestAnimationFrame(findPath);
    }
    findPath();
}

let printPath = () =>{
    let x = destination.x, y = destination.y;
    while(parent[x][y] !== undefined){
        let u = parent[x][y].x, v = parent[x][y].y;
        paint(u, v, desColor);
        x = u; y = v;
    }
};



let find = document.getElementById('findPath');
find.addEventListener('click', BFS);
document.getElementById('clear').addEventListener('click', () => location.reload());

