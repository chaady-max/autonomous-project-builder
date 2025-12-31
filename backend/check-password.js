// Quick script to test or generate password hashes
const bcrypt = require('bcryptjs');

const currentHash = "$2b$10$qK6YCJn6pGpOapNw.c8t3ukesRxHr6W8tCiGI3FlhA0eoUp4Cldoe";

// Common default passwords to test
const commonPasswords = [
  'admin',
  'password',
  'admin123',
  '123456',
  'apb',
  'apb123',
  'demo',
  'test',
];

console.log('🔍 Testing common passwords against current hash...\n');

async function testPasswords() {
  for (const pwd of commonPasswords) {
    const isMatch = await bcrypt.compare(pwd, currentHash);
    if (isMatch) {
      console.log(`✅ MATCH FOUND! The password is: "${pwd}"`);
      console.log(`\nYou can now login with password: ${pwd}\n`);
      return;
    }
  }

  console.log('❌ No match found among common passwords.');
  console.log('\n📝 To set a new password, run:');
  console.log('   node set-password.js YOUR_NEW_PASSWORD\n');
}

testPasswords();
