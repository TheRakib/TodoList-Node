const mongoose = require("mongoose");
const todoTaskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "",
  },
});

const Todo = mongoose.model("TodoTask", todoTaskSchema);
module.exports = Todo;
