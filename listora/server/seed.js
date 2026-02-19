const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then(async()=>{
await User.deleteMany();
await User.create([
{ name:'Admin', email:'admin@listora.com', password:await bcrypt.hash('123',10), role:'ADMIN' },
{ name:'Provider', email:'provider@listora.com', password:await bcrypt.hash('123',10), role:'PROVIDER' },
{ name:'User', email:'user@listora.com', password:await bcrypt.hash('123',10), role:'USER' }
]);
console.log('Seeded');
process.exit();
});