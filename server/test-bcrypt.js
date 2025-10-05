const bcrypt = require('bcryptjs');

async function testBcrypt() {
  console.log('Testing bcrypt functionality...');
  
  // Test 1: Generate and verify a new hash
  const password = 'password';
  const hash = await bcrypt.hash(password, 10);
  console.log('Generated hash:', hash);
  
  const match = await bcrypt.compare(password, hash);
  console.log('Match test:', match);
  
  // Test 2: Try the original hash with different passwords
  const originalHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const passwords = ['password', 'secret', 'admin', 'demo', '123456'];
  
  for (const pwd of passwords) {
    const result = await bcrypt.compare(pwd, originalHash);
    console.log(`Password "${pwd}" matches:`, result);
  }
}

testBcrypt();
