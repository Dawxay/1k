const wrap = document.getElementById('wrap');
const hi = document.getElementById('hi');
const tw = document.getElementById('tw');
/* .append */
hi.textContent = 'Hi there indeed LOL';
hi.append(' or not?');
tw.append(' Or did I? (:');
for (let i = 1; i < 11; i++) {
    let smth = document.createElement('div'); 
    let randnum = Math.round(Math.random() * 9 + 1)
    smth.textContent = `Hi I was created using js! (${i}) (${randnum})`;
    smth.classList.add('text-white', 'text-2xl');
    switch (randnum) {
        case 1: smth.style.color = '#FF0000'; break; // Red
        case 2: smth.style.color = '#00FF00'; break; // Lime
        case 3: smth.style.color = '#0000FF'; break; // Blue
        case 4: smth.style.color = '#FFFF00'; break; // Yellow
        case 5: smth.style.color = '#00FFFF'; break; // Cyan
        case 6: smth.style.color = '#FF00FF'; break; // Magenta
        case 7: smth.style.color = '#C0C0C0'; break; // Silver
        case 8: smth.style.color = '#800000'; break; // Maroon
        case 9: smth.style.color = '#808000'; break; // Olive
        case 10: smth.style.color = '#008000'; break; // Green 
    }
    wrap.appendChild(smth);
}


