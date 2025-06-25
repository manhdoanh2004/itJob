"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagePost = void 0;
const imagePost = (req, res) => {
    var _a;
    res.json({
        location: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path
    });
};
exports.imagePost = imagePost;
