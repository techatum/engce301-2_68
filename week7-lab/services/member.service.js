const MemberDB = require('../database/members.db');

class MemberService {

    static async getAllMembers() {
        return await MemberDB.findAll();
    }

    static async getMemberById(id) {
        const member = await MemberDB.findById(id);
        if (!member) throw new Error('Member not found');
        return member;
    }

    static async createMember(memberData) {
        try {
            return await MemberDB.create(memberData);
        } catch (error) {
            // เช็คว่า Email ซ้ำหรือไม่
            if (error.message.includes('UNIQUE constraint failed')) {
                throw new Error('Email already exists');
            }
            throw error;
        }
    }

    static async updateMember(id, memberData) {
        const member = await MemberDB.findById(id);
        if (!member) throw new Error('Member not found');

        return await MemberDB.update(id, memberData);
    }

    // ลบสมาชิก
    static async deleteMember(id) {
        // เช็คก่อนว่ามีสมาชิกไหม
        const member = await MemberDB.findById(id);
        if (!member) throw new Error('Member not found');

        return await MemberDB.delete(id);
    }
}

module.exports = MemberService;