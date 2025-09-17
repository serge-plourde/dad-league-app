import { supabase } from '../../supabaseClient';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { user_id, image_url } = req.body;

      const { data, error } = await supabase
        .from('submissions')
        .insert([{ user_id, image_url }]);

      if (error) throw error;
      return res.status(200).json({ message: 'Submission saved!', data });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json(data);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

