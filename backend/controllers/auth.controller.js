const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
    const { id, name, nationalId, professionalId, department, password, role } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ id }, { nationalId }] });
        if (userExists) {
            return res.status(400).json({ message: 'รหัสพนักงานหรือเลขบัตรประชาชนนี้มีอยู่แล้วในระบบ' });
        }

        const newUser = await User.create({
            id,
            name,
            nationalId,
            professionalId,
            department,
            password,
            role: role || 'พนักงานปฏิบัติการ',
            avatar: `https://picsum.photos/seed/${id}/200`,
        });

        res.status(201).json({
            message: 'สมัครสมาชิกสำเร็จ',
            user: {
                id: newUser.id,
                name: newUser.name,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await User.findOne({ id: userId }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // remove password from user object before sending
        const userObj = user.toObject();
        delete userObj.password;

        res.json({
            token: generateToken(user._id),
            user: userObj,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getUserByLineId = async (req, res) => {
    try {
        const user = await User.findOne({ lineUserId: req.params.lineUserId });
        if (user) {
             const userObj = user.toObject();
             res.json({
                exists: true,
                token: generateToken(user._id),
                user: userObj,
            });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.lineRegister = async (req, res) => {
    const { id, name, nationalId, professionalId, department, lineUserId } = req.body;
    try {
        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ id }, { nationalId }] });
        if (userExists) {
            return res.status(400).json({ message: 'รหัสพนักงานหรือเลขบัตรประชาชนนี้มีอยู่แล้วในระบบ' });
        }

        const newUser = await User.create({
            id,
            name,
            nationalId,
            professionalId,
            department,
            lineUserId,
            password: 'password_placeholder_line_login', // Set a default or random password
            role: 'พนักงานปฏิบัติการ',
            avatar: `https://picsum.photos/seed/${id}/200`,
        });

        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({
            token: generateToken(newUser._id),
            user: userObj
        });

    } catch (error) {
         res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
