const JWTR = require('jwt-redis').default;
const jwtr = new JWTR(global.redisClient);

const UserModel = require('../models/user')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        const decoded = await jwtr.verify(token, process.env.JWT_KEY);

        const { id } = decoded;

        const userData = await UserModel.findOne({ _id: id });

        if (userData === null || userData === undefined || !userData) {
            return res.status(401).json({
                message: 'Authentification failed. Please try again.',
            })
        }
        req.userData = userData;

        next()
    } catch (err) {
        return res.status(401).json({
            message: 'Authentification failed. Please try again.',
        })
    }
};