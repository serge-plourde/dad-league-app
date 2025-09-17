import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image first.');
      return;
    }

    // Step 1: Upload image to Supabase storage
    const fileName = `${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, image);

    if (error) {
      setMessage(`Upload failed: ${error.message}`);
      return;
    }

    // Step 2: Get a public URL
    const { data: publicUrlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Step 3: Save submission in database
    const { error: dbError } = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'test-user', // later this will come from auth
        image_url: imageUrl,
      }),
    });

    if (dbError) {
      setMessage(`Database save failed: ${dbError.message}`);
      return;
    }

    setMessage('Upload successful! ✅');
    setImage(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Upload your daily page</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
