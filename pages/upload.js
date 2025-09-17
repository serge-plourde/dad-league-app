import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function UploadPage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('⚠️ Please select an image first.');
      return;
    }

    // Step 1: Upload to Supabase Storage (bucket "uploads")
    const fileName = `${Date.now()}-${image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(fileName, image);

    if (uploadError) {
      setMessage('❌ Upload failed: ' + uploadError.message);
      return;
    }

    // Step 2: Get public URL
    const { data: publicData } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    const imageUrl = publicData.publicUrl;

    // Step 3: Save record in submissions table
    const { error: dbError } = await supabase.from('submissions').insert([
      {
        user_id: 'test-user', // Replace later with real user auth
        image_url: imageUrl,
      },
    ]);

    if (dbError) {
      setMessage('❌ Failed to save submission: ' + dbError.message);
      return;
    }

    setMessage('✅ Image uploaded and submission saved!');
    setImage(null);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Workbook Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
