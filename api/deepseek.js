// api/deepseek.js

// 从 Vercel 的环境变量中读取 Key (安全，用户看不到)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// DeepSeek 的官方接口地址
const CHAT_URL = 'https://api.deepseek.com/chat/completions';
const BALANCE_URL = 'https://api.deepseek.com/dashboard/billing/credit_grants'; // 假设这是查余额的地址，具体需参考DeepSeek文档

export default async function handler(req, res) {
  // 只允许 POST 请求，保证安全
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 获取前端传来的“动作指令”
  const { action } = req.body;

  try {
    // --- 逻辑分支 1：调用对话模型 ---
    if (action === 'chat') {
      const { messages } = req.body; // 获取对话历史

      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: messages
        })
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    // --- 逻辑分支 2：查询余额 ---
    else if (action === 'balance') {
      const response = await fetch(BALANCE_URL, {
        method: 'GET', // 查余额通常是 GET 请求
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
        }
      });

      const data = await response.json();
      return res.status(200).json(data);
    }

    // --- 未知指令 ---
    else {
      return res.status(400).json({ message: 'Invalid action' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}