const ibtn = document.getElementById('btn1');
const ibtn10 = document.getElementById('btn2');
const ibtn100 = document.getElementById('btn3');
const ibtn2 = document.getElementById('btn4');
const ibtn4 = document.getElementById('btn5');
const dbtn = document.getElementById('btn6');
const dbtn2 = document.getElementById('btn7');
const rbtn = document.getElementById('btn8');
const clabel = document.getElementById('number');

let count = 0;

ibtn.onclick = function(){
    count++;
    clabel.textContent = count;
};
ibtn10.onclick = function(){
    count += 10;
    clabel.textContent = count;
};
ibtn100.onclick = function(){
    count += 100;
    clabel.textContent = count;
};
ibtn2.onclick = function(){
    count *= 2;
    clabel.textContent = count;
};
ibtn4.onclick = function(){
    count *= 4;
    clabel.textContent = count;
};
dbtn.onclick = function(){
    count--;
    clabel.textContent = count;
};
dbtn2.onclick = function(){
    count /= 2;
    clabel.textContent = count;
}
rbtn.onclick = function(){
    count = 0;
    clabel.textContent = count;
}
