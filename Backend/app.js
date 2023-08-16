const path = require('path');
const fs = require('fs');


const express = require('express');
var cors = require('cors')

const dotenv = require('dotenv');
 
// get config vars
dotenv.config();
const app = express();


const sequelize = require('./util/database');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const DownloadData = require('./models/downloaddata')
//const helmet = require('helmet');
const compression = require('compression');
//const morgan = require('morgan');


const userRoutes = require('./routes/user')
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const resetPasswordRoutes = require('./routes/resetpassword')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    {flags: 'a'}
    );


// app.use(helmet());
// app.use(compression());
// app.use(morgan('combined', {stream: accessLogStream}));


app.use(cors());

app.use(express.json());  //for handling jsons

app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/password', resetPasswordRoutes)

app.use('/premium', premiumFeatureRoutes)

app.use((req, res)=>{
console.log('urlll', req.url);
res.sendFile(path.join(__dirname, `../ExpenseTrackeFrontend-main/${req.url}`));

})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(DownloadData);
DownloadData.belongsTo(User);

sequelize.sync()
    .then(() => {
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err);
    })
 