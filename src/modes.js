const btn = document.getElementById('theme');
const html = document.getElementById('html');
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const mode = document.querySelectorAll('.mode')
const agree = document.getElementById('Abtn')
const disagree = document.getElementById('Dbtn')

function modes(){
    btn.classList.toggle('hover:bg-gray-200')
    btn.classList.toggle('hover:bg-gray-900')
    html.classList.toggle('dark')
    sun.classList.toggle('hidden')
    moon.classList.toggle('hidden')
    let isDark = html.classList.contains('dark');
    mode.forEach(el => {
        isDark ? el.textContent = el.textContent.replace(/light/g, 'dark') : el.textContent = el.textContent.replace(/dark/g, 'light');
    })

        mode.forEach(el => {
        isDark ? el.textContent = el.textContent.replace(/Light/g, 'Dark') : el.textContent = el.textContent.replace(/Dark/g, 'Light');
    })
    html.classList.contains('dark') ? localStorage.setItem('theme', 'dark') : localStorage.removeItem('theme')
};



localStorage.getItem('theme') ? modes() : html.classList.remove('dark')

btn.addEventListener('click', modes);

agree.addEventListener('click', function() {
    agree.textContent = 'Ok.'
    agree.classList.remove('bg-blue-500', 'transition', 'shadow-blue-300', 'transform', 'hover:scale-110', 'cursor-pointer', 'shadow-xl', 'dark:shadow-blue-800')
    });
disagree.addEventListener('click', function() {
    disagree.textContent = 'Then change it.'
    disagree.classList.remove('bg-red-500', 'transition', 'shadow-red-300', 'transform', 'hover:scale-110', 'cursor-pointer', 'shadow-xl', 'dark:shadow-red-800')
    });