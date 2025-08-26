let div1 = document.getElementById('div1');
let div2 = document.getElementById('div2');
let classes = ['Math', 'PE', ' Alg', 'Calc'];
let NumCl = classes.map(n => ' ' + n + ' ' + '1')

div1.textContent = classes;
div2.textContent = NumCl;