import bcrypt from 'bcryptjs';

const password = process.argv[2] || '6666';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nAdd this to your .env file:');
  console.log(`APP_PASSWORD_HASH="${hash}"`);
});
