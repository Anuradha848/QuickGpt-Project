import imagekit from '../configs/imageKit.js'
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import axios from "axios"
import openai from "../configs/openai.js"


// TEXT MESSAGE CONTROLLER
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id

    // Check credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature"
      })
    }

    const { chatId, prompt } = req.body

    const chat = await Chat.findOne({ userId, _id: chatId })

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" })
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    })

    // Gemini response
    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }]
    })

    const reply = {
      role: "assistant",
      content: choices[0].message.content,
      timestamp: Date.now(),
      isImage: false
    }

    res.json({ success: true, reply })

    chat.messages.push(reply)
    await chat.save()

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })

  } catch (error) {
    console.log("TEXT ERROR:", error)
    res.json({ success: false, message: error.message })
  }
}



// IMAGE MESSAGE CONTROLLER
export const imageMessageController = async (req, res) => {
  try {

    const userId = req.user._id

    // Check credits
    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature"
      })
    }

    const { prompt, chatId, isPublished } = req.body

    const chat = await Chat.findOne({ userId, _id: chatId })

    if (!chat) {
      return res.json({ success: false, message: "Chat not found" })
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false
    })

    const generatedImageUrl = `https://picsum.photos/1024`

    // Fetch image
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer"
    })

    // Convert to base64
    const base64Image =
      "data:image/png;base64," +
      Buffer.from(aiImageResponse.data).toString("base64")

    // Upload to ImageKit
    const upload = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt"
    })

    const reply = {
      role: "assistant",
      content: upload.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished
    }

    res.json({ success: true, reply })

    chat.messages.push(reply)
    await chat.save()

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

  } catch (error) {
    console.log("IMAGE ERROR:", error)
    res.json({ success: false, message: error.message })
  }
}