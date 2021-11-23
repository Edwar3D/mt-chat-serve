const createError = require('http-errors')
const User = require('../Models/User.model')

var jwt = require("jsonwebtoken");

module.exports = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.query;
      if (!id ) throw createError.Conflict(`${id}  ,User id not send!`)

      const user = await User.findOne({ _id: id })

        res.status(200).send({
          dataUser : user
        });

    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('ERROR'))
      next(error)
    }
  },

}
