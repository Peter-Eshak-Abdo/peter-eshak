async function generateCode(task, fileTree, existingFiles, projectContext) {
  const prompt = buildPrompt(task, fileTree, existingFiles, projectContext);

  const models = [
    { name: "Gemini 2.5 Flash", fn: () => callGemini("gemini-2.5-flash", prompt) },
    { name: "Gemini 2.0 Flash", fn: () => callGemini("gemini-2.0-flash", prompt) },
    { name: "Groq Llama 3.3", fn: () => callGroq(prompt) },
  ];

  for (const model of models) {
    try {
      const raw = await model.fn();
      const result = smartParseJSON(raw);
      if (!result.files?.length) throw new Error("No files in response");
      return result;
    } catch (err) {
      const fallback =
        err.message.startsWith("FALLBACK") ||
        err.message.includes("No JSON") ||
        err.message.includes("JSON parse") ||
        err.message.includes("No files") ||
        err.message.includes("quota");
      if (fallback) continue; // try the next model
      if (err.message === "NO_GROQ_KEY") break;
      throw err; // unexpected → fail loudly
    }
  }
  throw new Error("All AI models failed. Try again later.");
}
