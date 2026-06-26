function authenticate(req, res, next) {

    const token = req.headers.authorization;

    if (!token) {

        return res.status(401).json({

            success: false,

            message: "Access denied."

        });

    }

    next();

}

module.exports = authenticate;
