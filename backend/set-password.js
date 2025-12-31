// Script to set a new password
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const newPassword = process.argv[2];

if (!newPassword) {
  console.error('❌ Error: Please provide a password');
  console.log('\nUsage: node set-password.js YOUR_PASSWORD');
  console.log('Example: node set-password.js mySecretPassword123\n');
  process.exit(1);
}

async function setPassword() {
  console.log('🔐 Generating password hash...');

  // Generate hash
  const hash = await bcrypt.hash(newPassword, 10);

  console.log('\n✅ New password hash generated!');
  console.log(`\nHash: ${hash}`);

  // Update .env file
  const envPath = path.join(__dirname, '.env');
  let envContent = fs.readFileSync(envPath, 'utf-8');

  // Replace the password hash line
  const passwordHashRegex = /APP_PASSWORD_HASH=".*"/;
  if (passwordHashRegex.test(envContent)) {
    envContent = envContent.replace(passwordHashRegex, `APP_PASSWORD_HASH="${hash}"`);
  } else {
    envContent += `\nAPP_PASSWORD_HASH="${hash}"\n`;
  }

  fs.writeFileSync(envPath, envContent, 'utf-8');

  console.log('\n✅ Updated .env file successfully!');
  console.log(`\n🎉 Your new password is: ${newPassword}`);
  console.log('\n⚠️  IMPORTANT: Restart the backend server for changes to take effect:');
  console.log('   npm run dev\n');
}

setPassword();
