const form = document.querySelector('form');
const fb = document.getElementById('feedback')
const RandNum = Math.round(Math.random() * 100)



form.addEventListener('submit', function(event){
    event.preventDefault();
    
    const UserInput = document.getElementById('inp').value
    if (UserInput > RandNum){
        fb.textContent = 'TOO HIGH'
    }
    else if (UserInput < RandNum) {
        fb.textContent = 'TOO LOW'
    }
    else {
        fb.textContent = 'You did it!'
    }
});