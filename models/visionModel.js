const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeImageBufferWithPrompt = async (imageBuffer, prompt) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imageBase64 = imageBuffer.toString('base64');

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: 'image/png', // or 'image/jpeg'
        data: imageBase64,
      },
    },
  ]);

  const response = await result.response;
  return response.text();
};

module.exports = { analyzeImageBufferWithPrompt };
