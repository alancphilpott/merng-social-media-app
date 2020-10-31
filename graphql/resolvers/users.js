const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
    validateRegisterInput,
    validateLoginInput
} = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );
}

module.exports = {
    Mutation: {
        // Logging In a User
        async login(_, { username, password }) {
            username = username.toLowerCase();

            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User Not Found";
                throw new UserInputError("User Not Found", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong Credentials";
                throw new UserInputError("Wrong Credentials", { errors });
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        // Registering a User
        async register(
            _,
            { registerInput: { username, email, password, confirmPassword } }
        ) {
            username = username.toLowerCase();
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

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
};
