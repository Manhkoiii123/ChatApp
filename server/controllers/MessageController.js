import Message from "../models/MessageModel.js";
export const getMessages = async (req, res) => {
  try {
    const userOne = req.userId;
    const userTwo = req.body.id;
    if (!userOne || !userTwo) {
      return res.status(400).json({ message: "User id is required" });
    }
    const messages = await Message.find({
      $or: [
        { sender: userOne, recipient: userTwo },
        { sender: userTwo, recipient: userOne },
      ],
    }).sort({ timestamps: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
