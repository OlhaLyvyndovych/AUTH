const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    username: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String }
});


//Fire a function before doc is saved to db
userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    console.log(`Salt is ${salt}`);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`This is a password with salt ${this.password}`);
    next();
});

module.exports = model('User', userSchema);