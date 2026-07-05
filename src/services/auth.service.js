const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");

const login = async (email, password) => {

    // 1. Find User
    const user = await prisma.users.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    // 2. Compare Password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // 3. Generate JWT
    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            employeeId: user.employeeId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roleId: user.roleId,
        },
    };
};

module.exports = {
    login,
};