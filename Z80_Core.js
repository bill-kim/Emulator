/**
 * Created by bill on 2017-09-10.
 */
function Z80_Core(memory) {

    //Intel8080 Registers

    this.A = 0;
    this.F = {
        S: 0, //Sign
        Z: 0, //Zero
        H: 0, //Half Carry
        PV: 0, //Parity/Overflow
        N: 0, //Add/Subtract
        C: 0 //Carry
    };
    this.B = 0;
    this.C = 0;
    this.D = 0;
    this.E = 0;
    this.H = 0;
    this.L = 0;
    //this.BC = 0;
    //this.DE = 0;
    //this.HL = 0;


    //New Z80 Registers
    this.alt_A = 0;
    this.alt_F = {
        S: 0, //Sign
        Z: 0, //Zero
        H: 0, //Half Carry
        PV: 0, //Parity/Overflow
        N: 0, //Add/Subtract
        C: 0 //Carry
    };
    this.alt_B = 0;
    this.alt_C = 0;
    this.alt_D = 0;
    this.alt_E = 0;
    this.alt_H = 0;
    this.alt_L = 0;
    //this.BCp = 0;
    //this.DEp = 0;
    //this.HLp = 0;
    this.IX = 0;
    this.IY = 0;
    this.PC = 0;
    this.SP = 0;
    this.I = 0;
    this.R = 0;

    this.memory = memory;

    this.P = [
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0x00 - 0x0F
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0x10 - 0x1F
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0x20 - 0x2F
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0x30 - 0x3F
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0x40 - 0x4F
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0x50 - 0x5F
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0x60 - 0x6F
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0x70 - 0x7F
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0x80 - 0x8F
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0x90 - 0x9F
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0xA0 - 0xAF
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0xB0 - 0xBF
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, //0xC0 - 0xCF
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0xD0 - 0xDF
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, //0xE0 - 0xEF
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1 //0xF0 - 0xFF
    ];
}

Z80_Core.prototype.instructions = []

//NOP
Z80_Core.prototype.instructions[0x00] = function () { };

//LD BC, xx
Z80_Core.prototype.instructions[0x01] = function () {
    this.C = this.memory[++this.PC];
    this.B = this.memory[++this.PC];
}

//LD (BC), A
Z80_Core.prototype.instructions[0x02] = function () {
    this.memory[(this.B << 8) | this.C] = this.A;
}

//INC BC
Z80_Core.prototype.instructions[0x03] = function () {
    var bc = ((this.B << 8) | this.C) + 1;

    this.B = (bc >>> 8) & 0xFF;
    this.C = bc & 0xFF;
}

//INC B
Z80_Core.prototype.instructions[0x04] = function () {
    this.B = (this.B + 1) & 0xFF;

    this.F.S = (this.B & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.B & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.B & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.B & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC B
Z80_Core.prototype.instructions[0x05] = function () {
    this.B = (this.B - 1) & 0xFF;

    this.F.S = (this.B & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.B & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.B & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.B & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD B, x
Z80_Core.prototype.instructions[0x06] = function () {
    this.B = this.memory[++this.PC];
}

//RLCA
Z80_Core.prototype.instructions[0x07] = function () {

    this.F.H = 0;
    this.F.N = 0;

    var bit7 = (this.A & 0x80) >>> 7;

    this.F.C = bit7;

    this.A = ((this.A << 1) | bit7) & 0xFF;
}

//EX AF, AF'
Z80_Core.prototype.instructions[0x08] = function () {
    var tempA = this.A;
    var tempF = this.F;

    this.A = this.alt_A;
    this.F = this.alt_F;

    this.alt_A = tempA;
    this.alt_F = tempF;
}

//ADD HL, BC
Z80_Core.prototype.instructions[0x09] = function () {
    var old_hl = (this.H << 8) | (this.L);
    var bc = (this.B << 8) | (this.C);

    var sum = old_hl + bc;

    this.H = (sum >>> 8) & 0xFF;
    this.L = sum & 0xFF;

    this.F.H = ((old_hl & 0x0FFF) + (bc & 0x0FFF)) > 0xFFF ? 1 : 0;
    this.F.C = sum > 0xFFFF ? 1 : 0;
}

//LD A, (BC)
Z80_Core.prototype.instructions[0x0A] = function () {
    this.A = this.memory[(this.B << 8) | this.C];
}

//DEC BC
Z80_Core.prototype.instructions[0x0B] = function () {
    var bc = ((this.B << 8) | this.C) - 1;

    this.B = (bc >>> 8) & 0xFF;
    this.C = bc & 0xFF;
}

//INC C
Z80_Core.prototype.instructions[0x0C] = function () {
    this.C = (this.C + 1) & 0xFF;

    this.F.S = (this.C & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.C & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.C & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.C & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC C
Z80_Core.prototype.instructions[0x0D] = function () {
    this.C = (this.C - 1) & 0xFF;

    this.F.S = (this.C & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.C & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.C & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.C & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD C, x
Z80_Core.prototype.instructions[0x0E] = function () {
    this.C = this.memory[++this.PC];
}

//RRCA
Z80_Core.prototype.instructions[0x0F] = function () {
    this.F.H = 0;
    this.F.N = 0;

    var bit0 = this.A & 0x01;

    this.F.C = bit0;

    this.A = ((this.A >>> 1) | (bit0 << 7));
}

//DJNZ x
Z80_Core.prototype.instructions[0x10] = function () {
    this.B = (this.B - 1) & 0xFF;
    var x = this.memory[++this.PC];

    this.PC = this.B ? this.PC + x - 1 : this.PC;
}

//LD DE, xx
Z80_Core.prototype.instructions[0x11] = function () {
    this.E = this.memory[++this.PC];
    this.D = this.memory[++this.PC];
}

//LD (DE), A
Z80_Core.prototype.instructions[0x12] = function () {
    this.memory[(this.D << 8) | this.E] = this.A;
}

//INC DE
Z80_Core.prototype.instructions[0x13] = function () {
    var de = ((this.D << 8) | this.E) + 1;

    this.D = (de >>> 8) & 0xFF;
    this.E = de & 0xFF;
}

//INC D
Z80_Core.prototype.instructions[0x14] = function () {
    this.D = (this.D + 1) & 0xFF;

    this.F.S = (this.D & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.D & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.D & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.D & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC D
Z80_Core.prototype.instructions[0x15] = function () {
    this.D = (this.D - 1) & 0xFF;

    this.F.S = (this.D & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.D & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.D & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.D & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD D, x
Z80_Core.prototype.instructions[0x16] = function () {
    this.D = this.memory[++this.PC];
}

//RLA
Z80_Core.prototype.instructions[0x17] = function () {

    this.F.H = 0;
    this.F.N = 0;

    var bit7 = (this.A & 0x80) >>> 7;

    this.A = ((this.A << 1) | this.F.C) & 0xFF;

    this.F.C = bit7;
}

//JR x
Z80_Core.prototype.instructions[0x18] = function () {
    this.PC += this.memory[++this.PC];
}

//ADD HL, DE
Z80_Core.prototype.instructions[0x19] = function () {
    var old_hl = (this.H << 8) | (this.L);
    var de = (this.D << 8) | (this.E);

    var sum = old_hl + de;

    this.H = (sum >>> 8) & 0xFF;
    this.L = sum & 0xFF;

    this.F.H = ((old_hl & 0x0FFF) + (de & 0x0FFF)) > 0xFFF ? 1 : 0;
    this.F.C = sum > 0xFFFF ? 1 : 0;
}

//LD A, (DE)
Z80_Core.prototype.instructions[0x1A] = function () {
    this.A = this.memory[(this.D << 8) | this.E];
}

//DEC DE
Z80_Core.prototype.instructions[0x1B] = function () {
    var de = ((this.D << 8) | this.E) - 1;

    this.D = (de >>> 8) & 0xFF;
    this.E = de & 0xFF;
}

//INC E
Z80_Core.prototype.instructions[0x1C] = function () {
    this.E = (this.E + 1) & 0xFF;

    this.F.S = (this.E & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.E & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.E & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.E & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC E
Z80_Core.prototype.instructions[0x1D] = function () {
    this.E = (this.E - 1) & 0xFF;

    this.F.S = (this.E & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.E & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.E & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.E & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD E, x
Z80_Core.prototype.instructions[0x1E] = function () {
    this.E = this.memory[++this.PC];
}

//RRA
Z80_Core.prototype.instructions[0x1F] = function () {
    this.F.H = 0;
    this.F.N = 0;

    var bit0 = this.A & 0x01;

    this.A = ((this.A >>> 1) | (this.F.C << 7));

    this.F.C = bit0;
}

//JR NZ x
Z80_Core.prototype.instructions[0x20] = function () {
    var x = this.memory[++this.PC];

    this.PC = this.F.Z ? this.PC : this.PC + x - 1;
}

//LD HL, xx
Z80_Core.prototype.instructions[0x21] = function () {
    this.L = this.memory[++this.PC];
    this.H = this.memory[++this.PC];
}

//LD (xx), HL
Z80_Core.prototype.instructions[0x22] = function () {
    var xx = this.memory[++this.PC] | (this.memory[++this.PC] << 8);

    this.memory[xx] = this.L;
    this.memory[xx + 1] = this.H;
}

//INC HL
Z80_Core.prototype.instructions[0x23] = function () {
    var hl = ((this.H << 8) | this.L) + 1;

    this.H = (hl >>> 8) & 0xFF;
    this.L = hl & 0xFF;
}

//INC H
Z80_Core.prototype.instructions[0x24] = function () {
    this.H = (this.H + 1) & 0xFF;

    this.F.Z = (this.H & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.H & 0x0F) === 0x00 ? 1 : 0;
    this.F.S = (this.H & 0x80) === 0x80 ? 1 : 0;
    this.F.PV = (this.H & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC H
Z80_Core.prototype.instructions[0x25] = function () {
    this.H = (this.H - 1) & 0xFF;

    this.F.S = (this.H & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.H & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.H & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.H & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD H, x
Z80_Core.prototype.instructions[0x26] = function () {
    this.H = this.memory[++this.PC];
}

//DAA
Z80_Core.prototype.instructions[0x27] = function () {

}

//JR Z, x
Z80_Core.prototype.instructions[0x28] = function () {
    this.PC = this.Z ? this.PC + this.memory[++this.PC] : this.PC;
}

//ADD HL, HL
Z80_Core.prototype.instructions[0x29] = function () {
    var old_hl = (this.H << 8) | (this.L);

    var sum = old_hl * 2;

    this.H = (sum >>> 8) & 0xFF;
    this.L = sum & 0xFF;

    this.F.H = old_hl & 0x0800 ? 1 : 0;
    this.F.C = sum > 0xFFFF ? 1 : 0;
}

//LD HL, (xx)
Z80_Core.prototype.instructions[0x2A] = function () {
    var xx = (this.memory[++this.PC] << 8) | this.memory[++this.PC];

    this.L = this.memory[xx];
    this.H = this.memory[xx + 1];
}

//DEC HL
Z80_Core.prototype.instructions[0x2B] = function () {
    var de = ((this.D << H) | this.L) - 1;

    this.H = (de >>> 8) & 0xFF;
    this.L = de & 0xFF;
}

//INC L
Z80_Core.prototype.instructions[0x2C] = function () {
    this.L = (this.L + 1) & 0xFF;

    this.F.S = (this.L & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.L & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.L & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.L & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC L
Z80_Core.prototype.instructions[0x2D] = function () {
    this.L = (this.L - 1) & 0xFF;

    this.F.S = (this.L & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.L & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.L & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.L & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD L, x
Z80_Core.prototype.instructions[0x2E] = function () {
    this.L = this.memory[++this.PC];
}

//CPL
Z80_Core.prototype.instructions[0x2F] = function () {
    this.A = (~this.A) && 0xFF;

    this.H = 1;
    this.N = 1;
}

//JR NC x
Z80_Core.prototype.instructions[0x30] = function () {
    var x = this.memory[++this.PC];

    this.PC = this.F.C ? this.PC : this.PC + x - 1;
}

//LD SP, xx
Z80_Core.prototype.instructions[0x31] = function () {
    this.SP = (this.memory[++this.PC] << 8) | this.memory[++this.PC];
}

//LD (xx), A
Z80_Core.prototype.instructions[0x32] = function () {
    var xx = this.memory[++this.PC] | (this.memory[++this.PC] << 8);

    this.memory[xx] = this.A;
}

//INC SP
Z80_Core.prototype.instructions[0x33] = function () {
    this.SP = (this.SP + 1) & 0xFFFF;
}

//INC (HL)
Z80_Core.prototype.instructions[0x34] = function () {
    var new_hl = (((this.H << 8) | this.L) + 1) && 0xFFFF;

    this.L = new_hl & 0xFF;
    this.H = (new_hl >> 8) & 0xFF;

    this.F.S = new_hl & 0x8000 ? 1 : 0;
    this.F.Z = new_hl ? 0 : 1;
    this.F.H = new_hl & 0x000F ? 0 : 1;
    this.F.PV = new_hl === 0x8000 ? 1 : 0;
    this.F.N = 0;
}

//DEC (HL)
Z80_Core.prototype.instructions[0x35] = function () {
    var new_hl = (((this.H << 8) | this.L) - 1) && 0xFFFF;

    this.L = new_hl & 0xFF;
    this.H = (new_hl >> 8) & 0xFF;

    this.F.S = new_hl & 0x8000 ? 1 : 0;
    this.F.Z = new_hl ? 0 : 1;
    this.F.H = (new_hl & 0x000F) === 0x000F ? 1 : 0;
    this.F.PV = new_hl === 0x07FF ? 1 : 0;
    this.F.N = 1;
}

//LD (HL), x
Z80_Core.prototype.instructions[0x36] = function () {
    this.memory[(this.H << 8) | this.L] = this.memory[++this.PC];
}

//SCF
Z80_Core.prototype.instructions[0x37] = function () {
    this.F.H = 0;
    this.F.N = 0;
    this.F.C = 1;
}

//JR C, x
Z80_Core.prototype.instructions[0x38] = function () {
    this.PC = this.C ? this.PC + this.memory[++this.PC] : this.PC;
}

//ADD HL, SP
Z80_Core.prototype.instructions[0x39] = function () {
    var old_hl = (this.H << 8) | (this.L);

    var sum = old_hl + this.SP;

    this.H = (sum >>> 8) & 0xFF;
    this.L = sum & 0xFF;

    this.F.H = ((old_hl & 0x0FFF) + (this.SP & 0x0FFF)) > 0xFFF ? 1 : 0;
    this.F.C = sum > 0xFFFF ? 1 : 0;
}

//LD A, (xx)
Z80_Core.prototype.instructions[0x3A] = function () {
    var xx = (this.memory[++this.PC] << 8) | this.memory[++this.PC];

    this.A = this.memory[xx];
}

//DEC SP
Z80_Core.prototype.instructions[0x3B] = function () {
    this.SP = (this.SP - 1) & 0xFFFF;
}

//INC A
Z80_Core.prototype.instructions[0x3C] = function () {
    this.A = (this.A + 1) & 0xFF;

    this.F.S = (this.A & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.A & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.A & 0x0F) === 0x00 ? 1 : 0;
    this.F.PV = (this.A & 0xFF) === 0x80 ? 1 : 0;
    this.F.N = 0;
}

//DEC A
Z80_Core.prototype.instructions[0x3D] = function () {
    this.A = (this.A - 1) & 0xFF;

    this.F.S = (this.A & 0x80) === 0x80 ? 1 : 0;
    this.F.Z = (this.A & 0xFF) === 0x00 ? 1 : 0;
    this.F.H = (this.A & 0x0F) === 0x0F ? 1 : 0;
    this.F.PV = (this.A & 0xFF) === 0x7F ? 1 : 0;
    this.F.N = 1;
}

//LD A, x
Z80_Core.prototype.instructions[0x3E] = function () {
    this.A = this.memory[++this.PC];
}

//CCF
Z80_Core.prototype.instructions[0x3F] = function () {
    this.F.C = [1, 0][this.F.C];
}

//LD B, B
Z80_Core.prototype.instructions[0x40] = function () {
}

//LD B, C
Z80_Core.prototype.instructions[0x41] = function () {
    this.B = this.C;
}

//LD B, D
Z80_Core.prototype.instructions[0x42] = function () {
    this.B = this.D;
}

//LD B, E
Z80_Core.prototype.instructions[0x43] = function () {
    this.B = this.E;
}

//LD B, H
Z80_Core.prototype.instructions[0x44] = function () {
    this.B = this.H;
}

//LD B, L
Z80_Core.prototype.instructions[0x45] = function () {
    this.B = this.L;
}

//LD B, (HL)
Z80_Core.prototype.instructions[0x46] = function () {
    this.B = this.memory[(this.H << 8) | this.L];
}

//LD B, A
Z80_Core.prototype.instructions[0x47] = function () {
    this.B = this.A;
}

//LD C, B
Z80_Core.prototype.instructions[0x48] = function () {
    this.C = this.B;
}

//LD C, C
Z80_Core.prototype.instructions[0x49] = function () {
}

//LD C, D
Z80_Core.prototype.instructions[0x4A] = function () {
    this.C = this.D;
}

//LD C, E
Z80_Core.prototype.instructions[0x4B] = function () {
    this.C = this.E;
}

//LD C, H
Z80_Core.prototype.instructions[0x4C] = function () {
    this.C = this.H;
}

//LD C, L
Z80_Core.prototype.instructions[0x4D] = function () {
    this.C = this.L;
}

//LD C, (HL)
Z80_Core.prototype.instructions[0x4E] = function () {
    this.C = this.memory[(this.H << 8) | this.L];
}

//LD C, A
Z80_Core.prototype.instructions[0x4F] = function () {
    this.C = this.A;
}

//LD D, B
Z80_Core.prototype.instructions[0x50] = function () {
    this.D = this.B;
}

//LD D, C
Z80_Core.prototype.instructions[0x51] = function () {
    this.D = this.C;
}

//LD D, D
Z80_Core.prototype.instructions[0x52] = function () {
}

//LD D, E
Z80_Core.prototype.instructions[0x53] = function () {
    this.D = this.E;
}

//LD D, H
Z80_Core.prototype.instructions[0x54] = function () {
    this.D = this.H;
}

//LD D, L
Z80_Core.prototype.instructions[0x55] = function () {
    this.D = this.L;
}

//LD D, (HL)
Z80_Core.prototype.instructions[0x56] = function () {
    this.D = this.memory[(this.H << 8) | this.L];
}

//LD D, A
Z80_Core.prototype.instructions[0x57] = function () {
    this.D = this.A;
}

//LD E, B
Z80_Core.prototype.instructions[0x58] = function () {
    this.E = this.B;
}

//LD E, C
Z80_Core.prototype.instructions[0x59] = function () {
    this.E = this.C;
}

//LD E, D
Z80_Core.prototype.instructions[0x5A] = function () {
    this.E = this.D;
}

//LD E, E
Z80_Core.prototype.instructions[0x5B] = function () {
}

//LD E, H
Z80_Core.prototype.instructions[0x5C] = function () {
    this.E = this.H;
}

//LD E, L
Z80_Core.prototype.instructions[0x5D] = function () {
    this.E = this.L;
}

//LD E, (HL)
Z80_Core.prototype.instructions[0x5E] = function () {
    this.E = this.memory[(this.H << 8) | this.L];
}

//LD E, A
Z80_Core.prototype.instructions[0x5F] = function () {
    this.E = this.A;
}

//LD H, B
Z80_Core.prototype.instructions[0x60] = function () {
    this.H = this.B;
}

//LD H, C
Z80_Core.prototype.instructions[0x61] = function () {
    this.H = this.C;
}

//LD H, D
Z80_Core.prototype.instructions[0x62] = function () {
    this.H = this.D;
}

//LD H, E
Z80_Core.prototype.instructions[0x63] = function () {
    this.H = this.E;
}

//LD H, H
Z80_Core.prototype.instructions[0x64] = function () {
}

//LD H, L
Z80_Core.prototype.instructions[0x65] = function () {
    this.H = this.L;
}

//LD H, (HL)
Z80_Core.prototype.instructions[0x66] = function () {
    this.H = this.memory[(this.H << 8) | this.L];
}

//LD H, A
Z80_Core.prototype.instructions[0x67] = function () {
    this.H = this.A;
}

//LD L, B
Z80_Core.prototype.instructions[0x68] = function () {
    this.L = this.B;
}

//LD L, C
Z80_Core.prototype.instructions[0x69] = function () {
    this.L = this.C;
}

//LD L, D
Z80_Core.prototype.instructions[0x6A] = function () {
    this.L = this.D;
}

//LD L, E
Z80_Core.prototype.instructions[0x6B] = function () {
    this.L = this.E;
}

//LD L, H
Z80_Core.prototype.instructions[0x6C] = function () {
    this.L = this.H;
}

//LD L, L
Z80_Core.prototype.instructions[0x6D] = function () {
}

//LD L, (HL)
Z80_Core.prototype.instructions[0x6E] = function () {
    this.L = this.memory[(this.H << 8) | this.L];
}

//LD L, A
Z80_Core.prototype.instructions[0x6F] = function () {
    this.L = this.A;
}

//LD (HL), B
Z80_Core.prototype.instructions[0x70] = function () {
    this.memory[(this.H << 8) | this.L] = this.B;
}

//LD (HL), C
Z80_Core.prototype.instructions[0x71] = function () {
    this.memory[(this.H << 8) | this.L] = this.C;
}

//LD (HL), D
Z80_Core.prototype.instructions[0x72] = function () {
    this.memory[(this.H << 8) | this.L] = this.D;
}

//LD (HL), E
Z80_Core.prototype.instructions[0x73] = function () {
    this.memory[(this.H << 8) | this.L] = this.E;
}

//LD (HL), H
Z80_Core.prototype.instructions[0x74] = function () {
    this.memory[(this.H << 8) | this.L] = this.H;
}

//LD (HL), L
Z80_Core.prototype.instructions[0x75] = function () {
    this.memory[(this.H << 8) | this.L] = this.L;
}

//HALT
Z80_Core.prototype.instructions[0x76] = function () {
}

//LD (HL), A
Z80_Core.prototype.instructions[0x77] = function () {
    this.memory[(this.H << 8) | this.L] = this.A;
}

//LD A, B
Z80_Core.prototype.instructions[0x78] = function () {
    this.A = this.B;
}

//LD A, C
Z80_Core.prototype.instructions[0x79] = function () {
    this.A = this.C;
}

//LD A, D
Z80_Core.prototype.instructions[0x7A] = function () {
    this.A = this.D;
}

//LD A, E
Z80_Core.prototype.instructions[0x7B] = function () {
    this.A = this.E;
}

//LD A, H
Z80_Core.prototype.instructions[0x7C] = function () {
    this.A = this.H;
}

//LD A, L
Z80_Core.prototype.instructions[0x7D] = function () {
    this.A = this.L;
}

//LD A, (HL)
Z80_Core.prototype.instructions[0x7E] = function () {
    this.A = this.memory[(this.H << 8) | this.L];
}

//LD A, A
Z80_Core.prototype.instructions[0x7F] = function () {
}

//ADD A, B
Z80_Core.prototype.instructions[0x80] = function () {
    var sum = this.A + this.B;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.B & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.B & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, C
Z80_Core.prototype.instructions[0x81] = function () {
    var sum = this.A + this.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.C & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.C & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, D
Z80_Core.prototype.instructions[0x82] = function () {
    var sum = this.A + this.D;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.D & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.D & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, E
Z80_Core.prototype.instructions[0x83] = function () {
    var sum = this.A + this.E;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.E & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.E & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, H
Z80_Core.prototype.instructions[0x84] = function () {
    var sum = this.A + this.H;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.H & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.H & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, L
Z80_Core.prototype.instructions[0x85] = function () {
    var sum = this.A + this.L;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.L & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.L & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, (HL)
Z80_Core.prototype.instructions[0x86] = function () {
    var hl = this.memory[(this.H << 8) | this.L];
    var sum = this.A + hl;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (hl & 0x0F)) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (hl & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADD A, A
Z80_Core.prototype.instructions[0x87] = function () {
    var sum = this.A * 2;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = this.A & 0x08 ? 1 : 0;
    this.F.PV = (this.A & 0x80) !== (sum & 0x80) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, B
Z80_Core.prototype.instructions[0x88] = function () {
    var sum = this.A + this.B + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.B & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.B & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, C
Z80_Core.prototype.instructions[0x89] = function () {
    var sum = this.A + this.C + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.C & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.C & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, D
Z80_Core.prototype.instructions[0x8A] = function () {
    var sum = this.A + this.D + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.D & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.D & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, E
Z80_Core.prototype.instructions[0x8B] = function () {
    var sum = this.A + this.E + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.E & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.E & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, H
Z80_Core.prototype.instructions[0x8C] = function () {
    var sum = this.A + this.H + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.H & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.H & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, L
Z80_Core.prototype.instructions[0x8D] = function () {
    var sum = this.A + this.L + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (this.L & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (this.L & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, (HL)
Z80_Core.prototype.instructions[0x8E] = function () {
    var hl = this.memory[(this.H << 8) | this.L];
    var sum = this.A + hl + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = ((this.A & 0x0F) + (hl & 0x0F) + this.F.C) > 0x0F ? 1 : 0;
    this.F.PV = ((this.A & 0x80) === (hl & 0x80)) && ((this.A & 0x80) !== (sum & 0x80)) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//ADC A, A
Z80_Core.prototype.instructions[0x8F] = function () {
    var sum = this.A * 2 + this.F.C;

    this.F.S = sum & 0x80 ? 1 : 0;
    this.F.Z = sum ? 0 : 1;
    this.F.H = this.A & 0x08 ? 1 : 0;
    this.F.PV = (this.A & 0x80) !== (sum & 0x80) ? 1 : 0;
    this.F.N = 0;
    this.F.C = sum > 0xFF ? 1 : 0;

    this.A = sum & 0xFF;
}

//SUB A, B
Z80_Core.prototype.instructions[0x90] = function () {
    var dif = this.A - this.B;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.B & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.B & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, B
Z80_Core.prototype.instructions[0x90] = function () {
    var dif = this.A - this.B;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.B & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.B & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, C
Z80_Core.prototype.instructions[0x91] = function () {
    var dif = this.A - this.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.C & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.C & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, D
Z80_Core.prototype.instructions[0x92] = function () {
    var dif = this.A - this.D;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.D & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.F & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, E
Z80_Core.prototype.instructions[0x93] = function () {
    var dif = this.A - this.E;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.E & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.E & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, H
Z80_Core.prototype.instructions[0x94] = function () {
    var dif = this.A - this.H;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.H & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.H & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, L
Z80_Core.prototype.instructions[0x95] = function () {
    var dif = this.A - this.L;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.L & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.L & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, (HL)
Z80_Core.prototype.instructions[0x96] = function () {
    var hl = this.memory[(this.H << 8) | this.L];
    var dif = this.A - hl;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (hl & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (hl & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SUB A, A
Z80_Core.prototype.instructions[0x97] = function () {
    this.A = 0;

    this.F.S = 0;
    this.F.Z = 1;
    this.F.H = 0;
    this.F.PV = 0;
    this.F.N = 1;
    this.F.C = 0;
}

//SBC A, B
Z80_Core.prototype.instructions[0x98] = function () {
    var dif = this.A - this.B - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.B & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.B & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, C
Z80_Core.prototype.instructions[0x99] = function () {
    var dif = this.A - this.C - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.C & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.C & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, D
Z80_Core.prototype.instructions[0x9A] = function () {
    var dif = this.A - this.D - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.D & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.F & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, E
Z80_Core.prototype.instructions[0x9B] = function () {
    var dif = this.A - this.E - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.E & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.E & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, H
Z80_Core.prototype.instructions[0x9C] = function () {
    var dif = this.A - this.H - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.H & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.H & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, L
Z80_Core.prototype.instructions[0x9D] = function () {
    var dif = this.A - this.L - this.F.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (this.L & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.L & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, (HL)
Z80_Core.prototype.instructions[0x9E] = function () {
    var hl = this.memory[(this.H << 8) | this.L] - this.F.C;
    var dif = this.A - hl;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = ((this.A & 0x0F) - (hl & 0x0F) - this.F.C) & 0x10 ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (hl & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;

    this.A = dif & 0xFF;
}

//SBC A, A
Z80_Core.prototype.instructions[0x9F] = function () {
    this.A = -this.F.C;

    this.F.S = this.F.C ? 1 : 0;
    this.F.Z = this.F.C ? 0 : 1;
    this.F.H = 1;
    this.F.PV = 0;
    this.F.N = 1;
    this.F.C = 1;
}

//AND B
Z80_Core.prototype.instructions[0xA0] = function () {
    this.A &= this.B;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND C
Z80_Core.prototype.instructions[0xA1] = function () {
    this.A &= this.C;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND D
Z80_Core.prototype.instructions[0xA2] = function () {
    this.A &= this.D;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND E
Z80_Core.prototype.instructions[0xA3] = function () {
    this.A &= this.E;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND H
Z80_Core.prototype.instructions[0xA4] = function () {
    this.A &= this.H;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND L
Z80_Core.prototype.instructions[0xA5] = function () {
    this.A &= this.L;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND (HL)
Z80_Core.prototype.instructions[0xA6] = function () {
    this.A &= this.memory[(this.H << 8) | this.L];

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//AND A
Z80_Core.prototype.instructions[0xA7] = function () {
    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR B
Z80_Core.prototype.instructions[0xA8] = function () {
    this.A ^= this.B;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR C
Z80_Core.prototype.instructions[0xA9] = function () {
    this.A ^= this.C;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR D
Z80_Core.prototype.instructions[0xAA] = function () {
    this.A ^= this.D;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR E
Z80_Core.prototype.instructions[0xAB] = function () {
    this.A ^= this.E;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR H
Z80_Core.prototype.instructions[0xAC] = function () {
    this.A ^= this.H;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR L
Z80_Core.prototype.instructions[0xAD] = function () {
    this.A ^= this.L;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR (HL)
Z80_Core.prototype.instructions[0xAE] = function () {
    this.A ^= this.memory[(this.H << 8) | this.L];

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 1;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//XOR A
Z80_Core.prototype.instructions[0xAF] = function () {
    this.A = 0;

    this.F.S = 0;
    this.F.Z = 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR B
Z80_Core.prototype.instructions[0xB0] = function () {
    this.A |= this.B;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR C
Z80_Core.prototype.instructions[0xB1] = function () {
    this.A |= this.C;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR D
Z80_Core.prototype.instructions[0xB2] = function () {
    this.A |= this.D;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR E
Z80_Core.prototype.instructions[0xB3] = function () {
    this.A |= this.E;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR H
Z80_Core.prototype.instructions[0xB4] = function () {
    this.A |= this.H;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR L
Z80_Core.prototype.instructions[0xB5] = function () {
    this.A |= this.L;

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR (HL)
Z80_Core.prototype.instructions[0xB6] = function () {
    this.A |= this.memory[(this.H << 8) | this.L];

    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//OR A
Z80_Core.prototype.instructions[0xB7] = function () {
    this.F.S = this.A & 0x80 ? 1 : 0;
    this.F.Z = this.A ? 0 : 1;
    this.H = 0;
    this.PV = this.P[this.A];
    this.N = 0;
    this.C = 0;
}

//CP B
Z80_Core.prototype.instructions[0xB8] = function () {
    var dif = this.A - this.B;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.B & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.B & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP C
Z80_Core.prototype.instructions[0xB9] = function () {
    var dif = this.A - this.C;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.C & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.C & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP D
Z80_Core.prototype.instructions[0xBA] = function () {
    var dif = this.A - this.D;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.D & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.D & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP E
Z80_Core.prototype.instructions[0xBB] = function () {
    var dif = this.A - this.E;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.E & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.E & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP H
Z80_Core.prototype.instructions[0xBC] = function () {
    var dif = this.A - this.H;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.H & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.H & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP L
Z80_Core.prototype.instructions[0xBD] = function () {
    var dif = this.A - this.L;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (this.L & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (this.L & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP (HL)
Z80_Core.prototype.instructions[0xBE] = function () {
    var hl = this.memory[(this.H << 8) | this.L];
    var dif = this.A - hl;

    this.F.S = dif & 0x80 ? 1 : 0;
    this.F.Z = dif ? 0 : 1;
    this.F.H = (this.A & 0x0F) < (hl & 0x0F) ? 1 : 0;
    this.F.PV = ((this.A & 0x80) !== (hl & 0x80)) && ((this.A & 0x80) !== (dif & 0x80)) ? 1 : 0;
    this.F.N = 1;
    this.F.C = dif & 0x100 ? 1 : 0;
}

//CP A
Z80_Core.prototype.instructions[0xBF] = function () {
    this.F.S = 0;
    this.F.Z = 1;
    this.F.H = 0;
    this.F.PV = 0;
    this.F.N = 1;
    this.F.C = 0;
}

//RET NZ
Z80_Core.prototype.instructions[0xC0] = function () {
    if (!this.F.Z) {
        this.PC = this.memory[this.SP];
        this.PC |= this.memory[++this.SP] << 8;
    }
}

//POP BC
Z80_Core.prototype.instructions[0xC1] = function () {
    this.BC = this.memory[this.SP];
    this.BC |= this.memory[++this.SP] << 8;
}

//JP NZ, xx
Z80_Core.prototype.instructions[0xC2] = function () {
    if (!this.F.Z) {
        var new_PC = this.memory[++this.PC];
        new_PC |= this.memory[++this.PC] << 8;
        this.PC = new_PC;
    }
}

//JP xx
Z80_Core.prototype.instructions[0xC3] = function () {
    var new_PC = this.memory[++this.PC];
    new_PC |= this.memory[++this.PC] << 8;
    this.PC = new_PC;
}

//CALL NZ, xx
Z80_Core.prototype.instructions[0xC4] = function () {
    if (!this.F.C) {
        this.memory[--this.SP] = this.PC >>> 8;
        this.memory[--this.SP] = this.PC & 0xFF;
        var new_PC = this.memory[++this.PC];
        new_PC |= this.memory[++this.PC];
        this.PC = new_PC;
    }
}

//PUSH BC
Z80_Core.prototype.instructions[0xC5] = function () {
    this.memory[--this.SP] = this.BC >>> 8;
    this.memory[--this.SP] = this.BC & 0xFF;
}

//ADD A, x
Z80_Core.prototype.instructions[0xC6] = function () {
    this.A = this.A + this.memory[++this.PC]; //   FLAGS
}

//RST 00h
Z80_Core.prototype.instructions[0xC7] = function () {
    this.memory[--this.SP] = this.PC >>> 8;
    this.memory[--this.SP] = this.PC & 0xFF;
    this.PC = 0x0000;
}

//RET Z
Z80_Core.prototype.instructions[0xC8] = function () {
    if (this.F.Z) {
        this.PC = this.memory[this.SP];
        this.PC |= this.memory[++this.SP] << 8;
    }
}

//RET
Z80_Core.prototype.instructions[0xC9] = function () {
    this.PC = this.memory[this.SP];
    this.PC |= this.memory[++this.SP] << 8;
}

//JP Z, xx
Z80_Core.prototype.instructions[0xCA] = function () {
    if (this.F.Z) {
        var new_PC = this.memory[++this.PC];
        new_PC |= this.memory[++this.PC] << 8;
        this.PC = new_PC;
    }
}

//CALL Z, xx
Z80_Core.prototype.instructions[0xCC] = function () {
    if (this.F.C) {
        this.memory[--this.SP] = this.PC >>> 8;
        this.memory[--this.SP] = this.PC & 0xFF;
        var new_PC = this.memory[++this.PC];
        new_PC |= this.memory[++this.PC];
        this.PC = new_PC;
    }
}

//CALL xx
Z80_Core.prototype.instructions[0xCD] = function () {
    this.memory[--this.SP] = this.PC >>> 8;
    this.memory[--this.SP] = this.PC & 0xFF;
    var new_PC = this.memory[++this.PC];
    new_PC |= this.memory[++this.PC];
    this.PC = new_PC;
}
