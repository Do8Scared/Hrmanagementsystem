import fs from 'fs';

const data = JSON.parse(fs.readFileSync('C:/Users/Vincent Piol/.gemini/antigravity-ide/brain/06ae3ca9-694d-435e-909a-d6852088f36f/.system_generated/steps/54/output.txt', 'utf8'));

fs.mkdirSync('src/types', { recursive: true });
fs.writeFileSync('src/types/supabase.ts', data.types);
console.log('Types written successfully.');
