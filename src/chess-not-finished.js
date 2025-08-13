function isdark(row, col) {
    return(row + col) % 2 === 0;
}

let CelectedSquare;
const board = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

const boardElements = document.getElementById('chess-board');

for(let row = 0; row < 8; row++){
    for(let col = 0; col < 8; col++){
        let square = document.createElement('div');
        square.classList.add('relative', 'flex', 'items-center', 'justify-center');
        square.classList.add(isdark(row, col) ? 'bg-[#52220B]' : 'bg-[#FCE2B2]');

        
        square.dataset.row = row;
        square.dataset.col = col;
        boardElements.appendChild(square);
            const piece = board[row][col];
    if(piece){
        const img = document.createElement('img')
        img.src = `pieces/${piece}.png`
        img.classList.add('absolute');
        img.style.top = "-40px";
        square.appendChild(img);
        
    }
    }
};