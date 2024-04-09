export function setUserData(data) {
    localStorage.setItem('user', JSON.stringify(data));
}

export function getUserData() {
    return JSON.parse(localStorage.getItem('user'));
}

export function clearUserData() {
    localStorage.removeItem('user');
}

//TODO Add custom validation
export function createSubmitHandler(callback) {
    return function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = [...formData.entries()].map(([k, v]) => [k, v.trim()]);
        console.log(data);
        callback(Object.fromEntries(data), event.target);
    };
}

export function updateNav() {
    const userData = getUserData();

    document.querySelector('#guest').style.display = userData ? 'none' : 'inline-block';
    document.querySelector('#user').style.display = userData ? 'inline-block' : 'none';
}