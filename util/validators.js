module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username Must Not Be Empty";
    }
    if (email.trim() === "") {
        errors.email = "Email Must Not Be Empty";
    } else {
        const regex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-.\w]*[0-9a-zA-Z])+[a-zA-Z]{2,9})$/;

        if (!email.match(regex)) {
            errors.email = "Email Must Be A Valid Email Address";
        }
    }
    if (password === "") {
        errors.password = "Password Must Not Be Empty";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords Must Match";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (username, password) => {
    const errors = {};

    if (username.trim() === "") {
        errors.username = "Username Must Not Be Empty";
    }
    if (password === "") {
        errors.password = "Password Must Not Be Empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateCreatePost = (body) => {
    const errors = {};

    if (body.trim() === "") {
        errors.post = "Post Body Must Not Be Empty";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};
