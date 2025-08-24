// chess.js

// ---------- State ----------
let turn = 'w'; // 'w' or 'b'
let selected = null; // {r,c} or null

let board = [
  ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null],
  ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'],
];

// Castling rights (king/queen side)
let castle = { wk:true, wq:true, bk:true, bq:true };
// En passant target square for current turn (row,col) that can be captured into
let ep = null; // {r,c} or null

// For passing special-move metadata from move-gen to doMove
let moveMeta = new Map();

// ---------- Utils ----------
const inBounds = (r,c) => r>=0 && r<8 && c>=0 && c<8;
const get = (r,c) => board[r][c];
const sideOf = pid => pid ? pid[0] : null;
const typeOf = pid => pid ? pid[1] : null;
const isEmpty = (r,c) => !get(r,c);
const enemyAt = (r,c,color) => get(r,c) && sideOf(get(r,c)) !== color;

function cloneBoard(b=board){ return b.map(row=>row.slice()); }

function findKing(b,color){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=b[r][c]; if(p && p[0]===color && p[1]==='K') return {r,c};
  }
  return null;
}

function squareAttacked(b, r, c, byColor){
  // pawns
  const dir = byColor==='w' ? -1 : 1;
  for(const dc of [-1,1]){
    const rr=r+dir, cc=c+dc;
    if(inBounds(rr,cc) && b[rr][cc]===(byColor+'P')) return true;
  }
  // knights
  const kD=[[ -2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for(const [dr,dc] of kD){
    const rr=r+dr, cc=c+dc;
    if(inBounds(rr,cc) && b[rr][cc]===(byColor+'N')) return true;
  }
  // sliders
  const rays = [
    [1,0],[ -1,0],[0,1],[0,-1], // rook/queen
    [1,1],[1,-1],[-1,1],[-1,-1] // bishop/queen
  ];
  for(let i=0;i<rays.length;i++){
    const [dr,dc]=rays[i];
    let rr=r+dr, cc=c+dc;
    while(inBounds(rr,cc)){
      const q=b[rr][cc];
      if(q){
        const s=q[0], t=q[1];
        if(s===byColor){
          if(i<4 && (t==='R'||t==='Q')) return true;
          if(i>=4 && (t==='B'||t==='Q')) return true;
        }
        break;
      }
      rr+=dr; cc+=dc;
    }
  }
  // king
  const d8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
  for(const [dr,dc] of d8){
    const rr=r+dr, cc=c+dc;
    if(inBounds(rr,cc) && b[rr][cc]===(byColor+'K')) return true;
  }
  return false;
}

function inCheck(b,color){
  const k=findKing(b,color);
  if(!k) return true;
  return squareAttacked(b,k.r,k.c, color==='w'?'b':'w');
}

// ---------- Pseudo-legal Move Gen (includes EP/castling, ignores own check) ----------
function genPseudo(r,c){
  const pid = get(r,c);
  if(!pid) return [];
  const color = sideOf(pid);
  const type = typeOf(pid);
  const out = [];

  const push = (nr,nc,kind='normal',extra=null)=>{
    if(!inBounds(nr,nc)) return;
    if(kind==='normal'){
      if(isEmpty(nr,nc) || enemyAt(nr,nc,color)) out.push({r:nr,c:nc,kind});
    }else{
      out.push({r:nr,c:nc,kind,extra});
    }
  };

  if(type==='P'){
    const dir = color==='w' ? -1 : 1;
    const startRow = color==='w' ? 6 : 1;
    // forward
    if(inBounds(r+dir,c) && isEmpty(r+dir,c)){
      push(r+dir,c);
      if(r===startRow && isEmpty(r+2*dir,c)) push(r+2*dir,c,'double');
    }
    // captures
    for(const dc of [-1,1]){
      const nr=r+dir,nc=c+dc;
      if(!inBounds(nr,nc)) continue;
      if(enemyAt(nr,nc,color)) push(nr,nc);
      // en passant capture
      if(ep && ep.r===nr && ep.c===nc) push(nr,nc,'enpassant',{captR:r, captC:nc});
    }
    return out;
  }

  if(type==='N'){
    const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(const [dr,dc] of deltas){
      const nr=r+dr,nc=c+dc;
      if(!inBounds(nr,nc)) continue;
      if(isEmpty(nr,nc) || enemyAt(nr,nc,color)) out.push({r:nr,c:nc,kind:'normal'});
    }
    return out;
  }

  const slide=(dirs)=>{
    for(const [dr,dc] of dirs){
      let nr=r+dr, nc=c+dc;
      while(inBounds(nr,nc)){
        if(isEmpty(nr,nc)) out.push({r:nr,c:nc,kind:'normal'});
        else { if(enemyAt(nr,nc,color)) out.push({r:nr,c:nc,kind:'normal'}); break; }
        nr+=dr; nc+=dc;
      }
    }
  };

  if(type==='B'){ slide([[1,1],[1,-1],[-1,1],[-1,-1]]); return out; }
  if(type==='R'){ slide([[1,0],[-1,0],[0,1],[0,-1]]); return out; }
  if(type==='Q'){ slide([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]); return out; }

  if(type==='K'){
    const d8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    for(const [dr,dc] of d8){
      const nr=r+dr,nc=c+dc;
      if(!inBounds(nr,nc)) continue;
      if(isEmpty(nr,nc) || enemyAt(nr,nc,color)) out.push({r:nr,c:nc,kind:'normal'});
    }
    // castling
    if(color==='w' && r===7 && c===4 && !inCheck(board,'w')){
      // kingside: f1,g1 empty and not attacked; rook at h1; right wk
      if(castle.wk && isEmpty(7,5) && isEmpty(7,6)
         && !squareAttacked(board,7,5,'b') && !squareAttacked(board,7,6,'b')
         && board[7][7]==='wR'){
        out.push({r:7,c:6,kind:'castle',extra:{rookFrom:[7,7],rookTo:[7,5]}});
      }
      // queenside: b1,c1,d1 empty and not attacked on d1,c1; rook at a1; right wq
      if(castle.wq && isEmpty(7,3) && isEmpty(7,2) && isEmpty(7,1)
         && !squareAttacked(board,7,3,'b') && !squareAttacked(board,7,2,'b')
         && board[7][0]==='wR'){
        out.push({r:7,c:2,kind:'castle',extra:{rookFrom:[7,0],rookTo:[7,3]}});
      }
    }
    if(color==='b' && r===0 && c===4 && !inCheck(board,'b')){
      if(castle.bk && isEmpty(0,5) && isEmpty(0,6)
         && !squareAttacked(board,0,5,'w') && !squareAttacked(board,0,6,'w')
         && board[0][7]==='bR'){
        out.push({r:0,c:6,kind:'castle',extra:{rookFrom:[0,7],rookTo:[0,5]}});
      }
      if(castle.bq && isEmpty(0,3) && isEmpty(0,2) && isEmpty(0,1)
         && !squareAttacked(board,0,3,'w') && !squareAttacked(board,0,2,'w')
         && board[0][0]==='bR'){
        out.push({r:0,c:2,kind:'castle',extra:{rookFrom:[0,0],rookTo:[0,3]}});
      }
    }
    return out;
  }

  return out;
}

// ---------- Legal move filter ----------
function legalMoves(r,c){
  moveMeta.clear();
  const pid = get(r,c);
  if(!pid) return [];
  const color = sideOf(pid);
  const pseudo = genPseudo(r,c);
  const legal = [];

  for(const m of pseudo){
    const b2 = cloneBoard();
    // apply move to b2
    const from = b2[r][c];
    // en passant capture
    if(m.kind==='enpassant' && m.extra){
      b2[m.extra.captR][m.extra.captC] = null;
    }
    // castle rook move
    if(m.kind==='castle' && m.extra){
      const [rf,cf]=m.extra.rookFrom, [rt,ct]=m.extra.rookTo;
      b2[rt][ct] = b2[rf][cf];
      b2[rf][cf] = null;
    }
    b2[m.r][m.c] = from;
    b2[r][c] = null;

    // promotion only affects piece type, but check status same; skip here

    if(!inCheck(b2,color)){
      legal.push([m.r,m.c]);
      moveMeta.set(`${m.r},${m.c}`, m);
    }
  }
  return legal;
}

// ---------- Rendering ----------
const root = document.getElementById('chess-board');

function render(){
  root.innerHTML = '';
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const square = document.createElement('div');
      square.className = `relative flex items-center justify-center ${(r+c)%2===0?'bg-[#52220B]':'bg-[#FCE2B2]'} select-none`;
      square.dataset.row=r; square.dataset.col=c;
      root.appendChild(square);

      const pid = get(r,c);
      if(pid){
        const img = document.createElement('img');
        img.src = `pieces/${pid}.png`;
        img.className = 'pointer-events-none relative bottom-5';
        square.appendChild(img);
      }
    }
  }
  // selection highlight
  if(selected){
    const el = qSquare(selected.r, selected.c);
    el.classList.add('bg-green-400','transition');
  }
  // move dots
  if(selected){
    const moves = legalMoves(selected.r, selected.c);
    for(const [mr,mc] of moves){
      const target = qSquare(mr,mc);
      const meta = moveMeta.get(`${mr},${mc}`);
      const isCapture = (!!get(mr,mc)) || (meta && meta.kind==='enpassant');
      const dot = document.createElement('button');
      dot.type='button';
      dot.className = `absolute w-5 h-5 rounded-full ${isCapture?'bg-red-600 opacity-60':'bg-green-500 opacity-60'}`;
      dot.title = isCapture ? 'Capture' : 'Move';
      dot.addEventListener('click', () => doMove(selected.r, selected.c, mr, mc));
      target.appendChild(dot);
    }
  }
  // click handlers
  attachSquareHandlers();
  // turn banner + status
  drawTurnBadge();
}

function qSquare(r,c){ return root.querySelector(`[data-row="${r}"][data-col="${c}"]`); }

function attachSquareHandlers(){
  root.querySelectorAll('[data-row]').forEach(sq=>{
    sq.onclick = () => {
      const r = +sq.dataset.row, c=+sq.dataset.col;
      const pid = get(r,c);
      if(pid && sideOf(pid)===turn){
        selected = {r,c};
        render();
      }
    };
  });
}

function drawTurnBadge(){
  let badge = document.getElementById('turn-badge');
  if(!badge){
    badge = document.createElement('div');
    badge.id = 'turn-badge';
    root.parentElement.appendChild(badge);
  }
  const status = gameStatus();
  badge.textContent = status.text;
}

// ---------- Moves ----------
function doMove(r1,c1,r2,c2){
  const pid = get(r1,c1);
  const color = sideOf(pid);
  if(color !== turn) return;

  // validate via current legal set
  const legal = legalMoves(r1,c1).some(([rr,cc]) => rr===r2 && cc===c2);
  if(!legal) return;

  const meta = moveMeta.get(`${r2},${c2}`) || {kind:'normal'};

  // handle en passant capture
  if(meta.kind==='enpassant' && meta.extra){
    board[meta.extra.captR][meta.extra.captC] = null;
  }

  // move rook for castling
  if(meta.kind==='castle' && meta.extra){
    const [rf,cf]=meta.extra.rookFrom, [rt,ct]=meta.extra.rookTo;
    board[rt][ct] = board[rf][cf];
    board[rf][cf] = null;
  }

  // move piece
  board[r2][c2] = pid;
  board[r1][c1] = null;

  // promotion to queen
  if(typeOf(pid)==='P'){
    if((color==='w' && r2===0) || (color==='b' && r2===7)){
      board[r2][c2] = color+'Q';
    }
  }

  // update castling rights
  if(pid===color+'K'){
    if(color==='w'){ castle.wk=false; castle.wq=false; }
    else { castle.bk=false; castle.bq=false; }
  }
  if(pid===color+'R'){
    if(color==='w' && r1===7 && c1===0) castle.wq=false;
    if(color==='w' && r1===7 && c1===7) castle.wk=false;
    if(color==='b' && r1===0 && c1===0) castle.bq=false;
    if(color==='b' && r1===0 && c1===7) castle.bk=false;
  }
  // if a rook was moved by castling, rights already irrelevant; no extra update needed

  // set en passant target for next player
  ep = null;
  if(typeOf(pid)==='P' && meta.kind==='double'){
    const dir = color==='w' ? -1 : 1;
    ep = { r: r2 - dir, c: c2 }; // square passed over
  }

  // next turn
  selected = null;
  turn = turn==='w' ? 'b' : 'w';
  render();
}

// ---------- Status ----------
function allLegalMoves(color){
  const moves=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p=get(r,c);
    if(p && sideOf(p)===color){
      // reuse legalMoves but it uses global moveMeta; avoid clobber by calling gen/filter inline
      const pseudo = genPseudo(r,c);
      for(const m of pseudo){
        const b2=cloneBoard();
        if(m.kind==='enpassant'&&m.extra){ b2[m.extra.captR][m.extra.captC]=null; }
        if(m.kind==='castle'&&m.extra){
          const [rf,cf]=m.extra.rookFrom,[rt,ct]=m.extra.rookTo;
          b2[rt][ct]=b2[rf][cf]; b2[rf][cf]=null;
        }
        b2[m.r][m.c]=b2[r][c]; b2[r][c]=null;
        if(!inCheck(b2,color)) moves.push(1);
      }
    }
  }
  return moves.length;
}

function gameStatus(){
  const chk = inCheck(board, turn);
  const moves = allLegalMoves(turn);
  if(moves===0 && chk) return {text: (turn==='w'?'White':'Black')+"'s turn — CHECKMATE"};
  if(moves===0) return {text: (turn==='w'?'White':'Black')+"'s turn — STALEMATE"};
  if(chk) return {text: (turn==='w'?'White':'Black')+"'s turn - UNDER CHECK"};
  return {text: turn==='w' ? "White's turn" : "Black's turn"};
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', render);
