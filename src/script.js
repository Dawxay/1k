let d1 = document.getElementById('div1');
let d2 = document.getElementById('div2');
let d3 = document.getElementById('div3');
let d4 = document.getElementById('div4');
let d5 = document.getElementById('div5');
let d6 = document.getElementById('div6');
let d7 = document.getElementById('div7');
let d8 = document.getElementById('div8');
let d9 = document.getElementById('div9');
let d10 = document.getElementById('div10');
let d11 = document.getElementById('div11');
let d12 = document.getElementById('div12');
let d13 = document.getElementById('div13');
let d14 = document.getElementById('div14');
let d15 = document.getElementById('div15');
let d16 = document.getElementById('div16');
let d17 = document.getElementById('div17');
let d18 = document.getElementById('div18');
let d19 = document.getElementById('div19');

let classes = ['Math', 'PE', ' Alg', 'Calc'];
let NumCl = classes.map(n => ' ' + n + ' ' + '1')
d1.textContent = classes;
d2.textContent = NumCl;
let fclass = classes.filter(n => {
    if(n[n.length-1] == 'E'){
        return true;
    }
    else{
        return false;
    }
})
d3.textContent = fclass;

const nums = [1, 5, 6, 2, 1, 2, 67, 3, 2, 4, 5, 1, 42, 2, 2, 6, 4, 3, 1, 4, 8, 9]
d4.textContent = nums.map(n => ' ' + n);

d5.textContent = nums.sort()
d6.textContent = classes.sort().map(n => ' ' + n)
d7.textContent = nums.reduce((a, b) => a + b)
d7.textContent = fetch()
