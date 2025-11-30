const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // For one-to-one chat messages
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // For group chat messages (optional, for future use)
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
  },
  { timestamps: true }
);

// Ensure either receiver or group is present
chatSchema.pre("save", function (next) {
  if (!this.receiver && !this.group) {
    return next(
      new Error("Chat message must have either a receiver (1–1) or a group.")
    );
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema); // collection: 'chats'

module.exports = Chat;
