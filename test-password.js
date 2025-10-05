const bcrypt = require('bcryptjs');

async function testPassword() {
  const storedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const password = 'password';
  
  console.log('Testing password hash...');
  console.log('Stored hash:', storedHash);
  console.log('Password to test:', password);
  
  const isMatch = await bcrypt.compare(password, storedHash);
  console.log('Password match:', isMatch);
  
  // Let's also generate a new hash for 'password'
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash for "password":', newHash);
  
  const newMatch = await bcrypt.compare(password, newHash);
  console.log('New hash match:', newMatch);
}

testPassword();
