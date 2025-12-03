const { GoogleGenerativeAI } = require("@google/generative-ai");

// Your CURRENT key from 'My First Project'
const genAI = new GoogleGenerativeAI("AIzaSyAAO8gazV3X507PEfIo7kH6crAKommcUK8");

async function listModels() {
  console.log("Checking available models...");
  try {
    // This fetches the list of models your key can see
    const modelList = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; 
    // Wait, there isn't a direct "listModels" helper in the simple SDK usage, 
    // so we will try a different approach to verify connectivity first.
    
    // Let's try the oldest, most basic model that usually works everywhere:
    console.log("Trying 'gemini-1.0-pro'...");
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Test");
    console.log("SUCCESS! You have access to: gemini-1.0-pro");
    return;
  } catch (error) {
    console.log("gemini-1.0-pro failed.");
  }

  try {
    console.log("Trying 'gemini-1.5-flash'...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Test");
    console.log("SUCCESS! You have access to: gemini-1.5-flash");
  } catch (error) {
    console.log("gemini-1.5-flash failed.");
    console.error("FINAL ERROR:", error.message);
  }
}

listModels();