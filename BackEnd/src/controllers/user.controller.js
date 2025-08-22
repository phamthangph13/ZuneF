const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Get all users with pagination
const GetAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role && role !== 'all') {
            query.role = role;
        }

        // Get users with pagination
        const users = await User.find(query)
            .select('-password -token')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await User.countDocuments(query);
        const totalPages = Math.ceil(total / limitNum);

        return res.status(200).json({
            success: true,
            message: "Lấy danh sách người dùng thành công!",
            data: users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi lấy danh sách người dùng: ${error.message}`
        });
    }
};

// Get user by ID
const GetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password -token');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy thông tin người dùng thành công!",
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi lấy thông tin người dùng: ${error.message}`
        });
    }
};

// Update user
const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, isVerified } = req.body;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng!"
            });
        }

        // Check if email already exists (exclude current user)
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email đã được sử dụng bởi người dùng khác!"
                });
            }
        }

        // Update user data
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (typeof isVerified === 'boolean') updateData.isVerified = isVerified;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password -token');

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin người dùng thành công!",
            data: updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi cập nhật người dùng: ${error.message}`
        });
    }
};

// Delete user
const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng!"
            });
        }

        // Prevent deleting admin users (optional security measure)
        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Không thể xóa tài khoản admin!"
            });
        }

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Xóa người dùng thành công!",
            data: { _id: id }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi xóa người dùng: ${error.message}`
        });
    }
};

// Update user password
const UpdateUserPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự!"
            });
        }

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng!"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        return res.status(200).json({
            success: true,
            message: "Cập nhật mật khẩu thành công!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Lỗi khi cập nhật mật khẩu: ${error.message}`
        });
    }
};

module.exports = {
    GetAllUsers,
    GetUserById,
    UpdateUser,
    DeleteUser,
    UpdateUserPassword
};