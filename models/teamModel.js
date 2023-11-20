const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
  }],
});

module.exports = mongoose.model('Team', teamSchema);


