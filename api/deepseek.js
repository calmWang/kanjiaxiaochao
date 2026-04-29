export default async function handler(req, res) {
  // 只允许 POST 请求，防止被乱搞
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 从 Vercel 后台的环境变量里拿出真实的 Key
    const apiKey = process.env.DEEPSEEK_API_KEY;

    // 2. 带着前端的请求内容，去请求 DeepSeek 官方
    const response = await fetch('https://api.deepseek.com/user/balance', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`, // 在这里悄悄带上 Key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // 把前端传过来的对话内容转给 DeepSeek
    });

    const data = await response.json();
    
    // 3. 把 DeepSeek 的回答返回给前端
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}