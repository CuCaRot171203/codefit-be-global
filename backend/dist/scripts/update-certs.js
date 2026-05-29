"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const certs = await prisma.certificate.findMany({
        include: { user: true, course: true }
    });
    console.log(`Found ${certs.length} certificates`);
    for (const cert of certs) {
        const updated = await prisma.certificate.update({
            where: { id: cert.id },
            data: {
                courseTitle: cert.course?.title || 'Khóa học',
                userName: cert.user?.fullName || cert.user?.username || 'Học viên',
            }
        });
        console.log('Updated:', updated.id, '->', updated.courseTitle, '/', updated.userName);
    }
}
main()
    .then(() => { console.log('Done'); process.exit(0); })
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=update-certs.js.map