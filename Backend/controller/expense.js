// const Expense = require('../models/expenses');
// //const { BlobServiceClient } = require('@azure/storage-blob');
// const { v1: uuidv1} = require('uuid');

// const addexpense = (req, res) => {
//     const { expenseamount, description, category } = req.body;

//     if(expenseamount == undefined || expenseamount.length === 0 ){
//         return res.status(400).json({success: false, message: 'Parameters missing'})
//     }
    
//     Expense.create({ expenseamount, description, category, userrrId: req.user.id}).then(expense => {
//         return res.status(201).json({expense, success: true } );
//     }).catch(err => {
//         return res.status(500).json({success : false, error: err})
//     })
// }

// const getexpenses = (req, res)=> {
//     console.log(req.user)

//     //const limit=(req.query.limit) ? parseInt(req.query.limit) : 2;
//     const page=(req.query.page) //? parseInt(req.query.page) : 1;
//     // console.log(limit);
//     // console.log(page);
//     // Expense.findAndCountAll()
//     // .then((data) => {
//     //     // let page = req.params.page;      // page number
//     //     var pages = Math.ceil(data.count / limit);
         
   
//    Expense.findAll({
//         where:{userrrId:req.user.id}})   
//         .then((expense)=>{

//               res.json({expense});
//          }).catch(err=>console.log(err));
// }


    
// //     Expense.findAll({ where : { userrrId: req.user.id}}).then(expenses => {
// //         return res.status(200).json({expenses, success: true})
// //     })
// //     .catch(err => {
// //         console.log(err)
// //         return res.status(500).json({ error: err, success: false})
// //     })
// // }


// const deleteexpense = (req, res) => {
//     const expenseid = req.params.expenseid;
//     if(expenseid == undefined || expenseid.length === 0){
//         return res.status(400).json({success: false, })
//     }
//     Expense.destroy({where: { id: expenseid, userId: req.user.id }}).then((noofrows) => {
//         if(noofrows === 0){
//             return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
//         }
//         return res.status(200).json({ success: true, message: "Deleted Successfuly"})
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({ success: true, message: "Failed"})
//     })
// }

// module.exports = {
//     deleteexpense,
//     getexpenses,
//     addexpense
// }


const Expense = require('../models/expenses');
//const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1} = require('uuid');

const addexpense = (req, res) => {
    const { expenseamount, description, category } = req.body;

    if(expenseamount == undefined || expenseamount.length === 0 ){
        return res.status(400).json({success: false, message: 'Parameters missing'})
    }
    
    Expense.create({ expenseamount, description, category, userrrId: req.user.id}).then(expense => {
        return res.status(201).json({expense, success: true } );
    }).catch(err => {
        return res.status(500).json({success : false, error: err})
    })
}

const getexpenses = (req, res)=> {

    const limit=(req.query.limit) ? parseInt(req.query.limit) : 2;
    const page=(req.query.page) ? parseInt(req.query.page) : 1;
    // console.log(limit);
    // console.log(page);
    Expense.findAndCountAll()
    .then((data) => {
        // let page = req.params.page;      // page number
        var pages = Math.ceil(data.count / limit);
         
   
    Expense.findAll({
            offset:(page-1)*limit,
            limit:limit
                 },{where:{userrrId:req.user.id}})   
                .then((expense)=>{
    
                      res.json({expense,pages:pages});
                 }).catch(err=>console.log(err));
     })
    .catch(err=>console.log(err));
}

    
//     Expense.findAll({ where : { userrrId: req.user.id}}).then(expenses => {
//         return res.status(200).json({expenses, success: true})
//     })
//     .catch(err => {
//         console.log(err)
//         return res.status(500).json({ error: err, success: false})
//     })
// }


const deleteexpense = (req, res) => {
    const expenseid = req.params.expenseid;
    if(expenseid == undefined || expenseid.length === 0){
        return res.status(400).json({success: false, })
    }
    Expense.destroy({where: { id: expenseid, userrrId: req.user.id }}).then((noofrows) => {
        if(noofrows === 0){
            return res.status(404).json({success: false, message: 'Expense doenst belong to the user'})
        }
        return res.status(200).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ success: true, message: "Failed"})
    })
}

module.exports = {
    deleteexpense,
    getexpenses,
    addexpense
}