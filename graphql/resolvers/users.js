const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput } = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

module.exports = {
    Mutation: {
        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } }
        ) {
            // Validate User Data
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            // Check If User Exists
            const user = await User.findOne({ username });
            if (user)
                throw new UserInputError("Username Is Taken", {
                    errors: {
                        username: "This Username Is Taken"
                    }
                });
            // Hash User Password
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign(
                {
                    id: res.id,
                    email: res.email,
                    username: res.username
                },
                SECRET_KEY,
                { expiresIn: "1h" }
            );

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
