const User = require('../models/users');
const Expense = require('../models/expenses');
const sequelize = require('../util/database');
const e = require('express');

// const getUserLeaderBoard = async (req, res) => {
//     try{
//         const leaderboardofusers = await User.findAll({
//             attributes: ['id', 'name',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
//             include: [
//                 {
//                     model: Expense,
//                     attributes: []
//                 }
//             ],
//             group:['user.id'],
//             order:[['total_cost', 'DESC']]

//         })
       
//         res.status(200).json(leaderboardofusers)
    
// } catch (err){
//     console.log(err)
//     res.status(500).json(err)
// }
// }

// module.exports = {
//     getUserLeaderBoard
// }


const leadership=async (req,res)=>{
    try{
        const userleaderboard=await User.findAll({
            attributes:[
                'id',
                'name',
                [sequelize.fn('sum',sequelize.col('exps.expenseamount')),'total']
            ],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
            group:['userrr.id'],
            order:[['total','desc']]
        });
        res.status(200).json(userleaderboard);
    
    }catch(err){
        console.log(err);
        res.status(403).json({message:'something Really went wrong',error:err});
    }
    }
    
    
    
    module.exports={
        leadership
     
    }
    