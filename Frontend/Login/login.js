// function login(e) {
//     e.preventDefault();
//     console.log(e.target.name);

//     const loginDetails = {
//         email: e.target.email.value,
//         password: e.target.password.value

//     }
//     console.log(loginDetails)
//     axios.post('http://localhost:3000/user/login',loginDetails).then(response => {
//             alert(response.data.message)
//             console.log(response.data)
//             localStorage.setItem('token', response.data.token)
//             window.location.href = "../ExpenseTracker/index.html"
//     }).catch(err => {
//         console.log(JSON.stringify(err))
//         document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
//     })
// }
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MjcwNTE3MX0.wDC7ABZuczLS4Zqv8Yzquqi2bGwX5J_pWqamP7gXS4I














function login(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const loginDetails = {
        email: form.get("email"),
        password: form.get("password")

    }
    console.log(loginDetails)
    axios.post('http://localhost:3000/user/login',loginDetails).then(response => {
        if(response.status === 200){
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userDetails', JSON.stringify(response.data.user))
            window.location.href = "../ExpenseTracker/index.html" // change the page on successful login
        } else {
            throw new Error('Failed to login')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}

function forgotpassword() {
    window.location.href = "../ForgotPassword/index.html"
}



