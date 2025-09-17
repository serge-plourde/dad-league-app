import { supabase } from '../../supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Insert a new submission
    const { user_id, image_url } = req.body;

    const { data, error } = await supabase
      .from('submissions')
      .insert([{ user_id, image_url }]);

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({ message: 'Submission saved!', data });
  }

  if (req.method === 'GET') {
    // Get all submissions
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['POST', 'GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
