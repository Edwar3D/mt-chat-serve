const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  telephone:{
    type: String,
    required: true,
    unique: true,
  },
  photo: String,
  old: Number,
  prioritiy: String,
  problem: String,
  curp: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: [ mongoose.Types.ObjectId],
  online: Boolean
})

UserSchema.pre('save', async function (next) {
  try {
    
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.encryptPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

const User = mongoose.model('user', UserSchema)
module.exports = User
