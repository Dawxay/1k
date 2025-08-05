let age;

document.getElementById('btn').onclick = function () {
    age = document.getElementById('number').value;
    if(age >= 0) {
        document.getElementById('h').textContent = "Enter your age god damn it"
    }
    else if (age < 13) {
        document.getElementById('h').textContent = "I wonder what life choices you made to get to this site so young" 
    }
    else if (age == 16) {
        document.getElementById('h').textContent = "Ay Im also 16" 
    }
    else if (age > 13 && age < 18) {
        document.getElementById('h').textContent = "I wonder how you discovered this website at " + age
    }
    else {
        document.getElementById('h').textContent = "Hire me. (unless by the time you are seing this I am a founder XD)"
    }
};