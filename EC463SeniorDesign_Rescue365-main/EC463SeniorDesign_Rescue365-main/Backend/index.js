const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Supabase client with URL and Service Role key
const supabaseUrl = 'https://rzzmcluceplcovvixock.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY; // Securely fetch the key from .env
const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Upload a file to Supabase Storage
const uploadFile = async () => {
  const filePath = './test-file.txt'; // Ensure this file exists in the Backend directory
  const file = require('fs').readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from('rescue') // Replace with your bucket name
    .upload('test-file.txt', file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading file:', error);
  } else {
    console.log('File uploaded successfully:', data);
  }
};

uploadFile();
