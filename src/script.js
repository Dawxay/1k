const wrap = document.getElementById('wrap');
const hi = document.getElementById('hi');
const tw = document.getElementById('tw');
/* .append */
hi.textContent = 'Hi there indeed LOL';
hi.append(' or not?');
tw.append(' Or did I? (:');
for (let i = 1; i < 11; i++) {

    let smth = document.createElement('div');
    smth.textContent = `Hi I was created using js! (${i})`;
    smth.classList.add('text-white', 'text-2xl');
    wrap.appendChild(smth);
    let num = Math.round(Math.random() * 10) + 1;
    switch (num) {
    case 1:
        smth.classList.toggle('text-red-500');
        break;
    case 2:
        smth.classList.toggle('text-orange-500');
        break;
    case 3:
        smth.classList.toggle('text-yellow-500');
        break;
    case 4:
        smth.classList.toggle('text-green-500');
        break;
    case 5:
        smth.classList.toggle('text-teal-500');
        break;
    case 6:
        smth.classList.toggle('text-cyan-500');
        break;
    case 7:
        smth.classList.toggle('text-blue-500');
        break;
    case 8:
        smth.classList.toggle('text-purple-500');
        break;
    case 9:
        smth.classList.toggle('text-pink-500');
        break;
    case 10:
        smth.classList.toggle('text-gray-500');
        break;
    default:
        smth.classList.toggle('text-white');
    }
}
