const wrap = document.getElementById('wrap');
const hi = document.getElementById('hi');
const tw = document.getElementById('tw');
/* .append */
hi.textContent = 'Hi there indeed LOL';
hi.append(' or not?');
tw.append(' Or did I? (:');
for (let i = 1; i < 11; i++) {
    setInterval(function() {
    let smth = document.createElement('div');
    smth.textContent = `Hi I was created using js! (${i})`;
    smth.classList.add('text-white', 'text-2xl');
    wrap.appendChild(smth);
    }, 2000)
}


