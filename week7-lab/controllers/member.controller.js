const MemberService = require('../services/member.service');

exports.getAll = async (req, res) => {
    try {
        const members = await MemberService.getAllMembers();
        res.json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const member = await MemberService.getMemberById(req.params.id);
        res.json(member);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

exports.create = async (req, res) => {
    try {
        const newMember = await MemberService.createMember(req.body);
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updatedMember = await MemberService.updateMember(req.params.id, req.body);
        res.json(updatedMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// ลบสมาชิก (Delete Member)
exports.delete = async (req, res) => {
    try {
        await MemberService.deleteMember(req.params.id);
        res.json({ message: 'Member deleted successfully' });
    } catch (error) {
        // ถ้าลบไม่ได้ (เช่น ติด Foreign Key)
        res.status(400).json({ error: error.message });
    }
};