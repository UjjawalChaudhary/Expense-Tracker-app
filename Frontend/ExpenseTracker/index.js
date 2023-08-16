function addNewExpense(e){
    e.preventDefault();

    const expenseDetails = {
        expenseamount: document.getElementById('expenseamount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,

    }
    console.log(expenseDetails)
    const token  = localStorage.getItem('token')
    axios.post('http://localhost:3000/expense/addexpense',expenseDetails,  { headers: {"Authorization" : token} })
        .then((response) => {

        addNewExpensetoUI(response.data.expense);

    }).catch(err => showError(err))

}

function showPremiumuserMessage() {
    document.getElementById('rzp-button1').style.visibility = "hidden"
    document.getElementById('message').innerHTML = "You are a premium user "
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', getexpenses)

async function getexpenses() {
    const parentnode=document.querySelector('#listOfExpenses');
//    const select=localStorage.getItem('select');
   parentnode.innerHTML="";
    const token  = localStorage.getItem('token')
    const select=localStorage.getItem('select');

    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const ispremiumuser = decodeToken.ispremiumuser
    if(ispremiumuser){
        showPremiumuserMessage()
        showLeaderboard()
    }
    axios.get(`http://localhost:3000/expense/getexpenses?limit=${select}`, { headers: {"Authorization" : token} })
    .then(response => {
        if(response.status === 200){
            createpagination(response.data.pages);
            response.data.expense.forEach(exp => {

                addNewExpensetoUI(exp);
            })
        } else {
            throw new Error();
        }
    //})
//});

    }).catch(err => {
        showError(err)
    })
}
function createpagination(pages){
    document.querySelector('#pagination').innerHTML="";
    let childhtml="";
    for(var i=1;i<=pages;i++){
         childhtml+=`<a class="mx-2" id="page=${i}" >${i}</a>`;  
    }
    const parentnode=document.querySelector('#pagination');
    parentnode.innerHTML=parentnode.innerHTML+childhtml;
}
document.querySelector('#pagination').addEventListener('click',getexpensepage);
async function getexpensepage(e){
    //alert(e.target.id)
    const parentnode=document.querySelector('#listOfExpenses');
//    const select=localStorage.getItem('select');
   parentnode.innerHTML="";
    // const limit=`${select}?'&limit='${select}`;
    const token=localStorage.getItem('token');
    try{
    let response=await axios.get(`http://localhost:3000/expense/getexpenses?${e.target.id}`,{headers:{"Authorization":token}})
    for (let i = 0; i < response.data.expense.length; i++){
        addNewExpensetoUI(response.data.expense[i]);
    }   
    }
    catch(err){
        console.log(err)
    }; 
}
document.querySelector('#select').addEventListener('change',(e)=>{
    localStorage.setItem('select',e.target.value);
    getexpenses();
    // getexpensepage();
})
function addNewExpensetoUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `
        <li id=${expenseElemId}>
            ${expense.expenseamount} - ${expense.category} - ${expense.description}
            <button onclick='deleteExpense(event, ${expense.id})'>
                Delete Expense
            </button>
        </li>`
}

function deleteExpense(e, expenseid) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteexpense/${expenseid}`,  { headers: {"Authorization" : token} }).then(() => {

            removeExpensefromUI(expenseid);

    }).catch((err => {
        showError(err);
    }))
}

function showError(err){
    document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
function showLeaderboard(){
    const inputElement = document.createElement("input")
    inputElement.type = "button"
    inputElement.value = 'Show Leaderboard'
    inputElement.onclick = async() => {
        const token = localStorage.getItem('token')
        const userLeaderBoardArray = await axios.get('http://localhost:3000/premium/showLeaderBoard', { headers: {"Authorization" : token} })
        console.log(userLeaderBoardArray)

        var leaderboardElem = document.getElementById('leaderboard')
        leaderboardElem.innerHTML += '<h1> Leader Board </<h1>'
        userLeaderBoardArray.data.forEach((userDetails) => {
            leaderboardElem.innerHTML += `<li>Name - ${userDetails.name} Total Expense - ${userDetails.total_cost || 0} </li>`
        })
    }
    document.getElementById("message").appendChild(inputElement);

}

function removeExpensefromUI(expenseid){
    const expenseElemId = `expense-${expenseid}`;
    document.getElementById(expenseElemId).remove();
}

function download(){
    const token=localStorage.getItem('token');
    axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })

    .then((response) => {
        if(response.data.status == 1){
            console.log(response.data)
            var a = document.createElement("a");
            a.href = response.data.fileurl;
            a.download = 'myexpense.txt';

           a.click();
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => { 
        showError(err)
    });
}



document.getElementById('rzp-button1').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "YAV Technology",

     "order_id": response.data.order.id,// For one time payment
     "prefill": {
        "name": "Yash Prasad",
        "email": "prasadyash2411@gmail.com",
        "contact": "7003442036"
      },
      "theme": {
       "color": "#3399cc"
      },
     // This handler function will handle the success payment
     "handler": async function (response) {
        const res = await axios.post('http://192.168.203.129:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} })
        
        console.log(res)
         alert('You are a Premium User Now')
         document.getElementById('rzp-button1').style.visibility = "hidden"
         document.getElementById('message').innerHTML = "You are a premium user "
         localStorage.setItem('token', res.data.token)
         showLeaderboard()
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
    console.log(response)
    alert('Something went wrong')
 });
}

window.addEventListener('DOMContentLoaded',getrecent);
async function getrecent(){
    const parentnode=document.querySelector('#leaderboard1');
    parentnode.innerHTML="";
    // alert("aaya")
    const token=localStorage.getItem('token');
    try{
    let response=await axios.get('http://localhost:3000/recent-download',{headers:{"Authorization":token}})
    console.log(response.data.data[0]);
    for (let i = 0; i < response.data.data.length; i++){
        
    viewrecent(response.data.data[i]);
    
    
    }   
    }
    catch(err){
        console.log(err)
    };
}

   function viewrecent(data){
    console.log(data);
    const childhtml=`<li id=${data.id}><a href="${data.fileurl}">Download</a> ${data.createdAt}  `;
    
    const parentnode=document.querySelector('#Recentdownload');
    console.log(parentnode);
    parentnode.innerHTML=parentnode.innerHTML+childhtml;
 

}
