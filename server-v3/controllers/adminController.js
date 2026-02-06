const Admin = require("../models/adminModel");
const catchAsync = require("../utils/catchAsync");

exports.updateAdmin = catchAsync(async (req, res, next) => {
    console.log("request for update received");
    console.log(req.body);
    try {
        const adminId = req.body.id;
        const updation = await Admin.findByIdAndUpdate(adminId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updation) {
            return next(new AppError("No admin found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: {
                admin: updation,
            },
        });
    } catch (err) {
        console.log("Error during admin update:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "An error occurred while updating the admin profile.",
        });
    }
});
