const createError = require('http-errors')
const User = require('../Models/User.model')

var jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) throw createError.BadRequest()
     

      const doesExist = await User.findOne({ email: email })
      if (doesExist)
        throw createError.Conflict(`${email}  ,Email is already in use!`)

      const user = new User(req.body)
      user.save()
      res.send({ message: "User was registered successfully!",succes:true });
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw createError.BadRequest();

      const user = await User.findOne({ email: email })
      if (!user) throw createError.BadRequest('Email Not Found')
      const isMatch = await user.encryptPassword(password)
      if (!isMatch)
        throw createError.Unauthorized('Password not valid');

        var token = jwt.sign({ id: user.id }, 'MyChatprueba1', {
          expiresIn: 86400 // 1dia
        });

        res.status(200).send({
         dataUser: user,
          accessToken: token
        });

    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
      next(error)
    }
  },

}
