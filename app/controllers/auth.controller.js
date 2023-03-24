const db = require("../models");
const config = require("../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async(req, res) => {
    // Save User to Database
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            const result = user.setRoles(roles);
            if (result) res.send({ message: "User registered successfully!" });
        } else {
            // user has role = 1
            const result = user.setRoles([1]);
            if (result) res.send({ message: "User registered successfully!" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const signin = (req, res) => {
    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(async(user) => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtExpiration
            });

            let refreshToken = await RefreshToken.createToken(user);

            let authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }

                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                });
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

const refreshToken = async(req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        console.log(refreshToken)

        if (!refreshToken) {
            res.status(403).json({ message: "Refresh token is not in database!" });
            return;
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.destroy({ where: { id: refreshToken.id } });

            res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
            return;
        }

        const user = await refreshToken.getUser();
        let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

const signout = async(req, res) => {
    try {
        req.session = null;
        return res.status(200).send({
            message: "You've been signed out!"
        });
    } catch (err) {
        this.next(err);
    }
};

module.exports = {
    signup,
    signin,
    refreshToken,
    signout,
};