const bufferToBase64 = (buffer) => {
  const base64 = buffer.toString('base64');
  return `data:image/png;base64,${base64}`;
};

const generateAction = async (req, res) => {
  const input = JSON.parse(req.body).input;
  const response = await fetch(
    `https://api-inference.huggingface.co/models/katanawolf/eric-ai`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        "Content-Type": "application/json",
        'x-use-cache': 'false'
      },
      method: "POST",
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    res.status(200).json({
      image: bufferToBase64(Buffer.from(buffer)),
    });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;