import { useState } from 'react';

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
    const formData = new FormData();
    formData.append('file', image);

    const { data: storageData, error: storageError } = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    }).then(res => res.json());

    if (storageError) {
      setMessage('Upload failed: ' + storageError.message);
      return;
    }

    // Step 2: Save submission record to Supabase via our API
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'demo-user',  // replace later with real user auth
        image_url: storageData.publicUrl,
      }),
    });

    if (res.ok) {
      setMessage('Submission saved successfully!');
    } else {
      setMessage('Error saving submission.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Your Daily Actions</h1>
      <form onSubmit={handleSubmit}>
        <input 
  type="file" 
  accept="image/*" 
  capture="environment" 
  onChange={handleFileChange} 
/>

        <button type="submit">Submit</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
