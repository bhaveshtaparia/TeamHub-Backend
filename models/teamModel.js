const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true,
  },
  users: [{
    userId:{
      type: Number,
    }
  }],
});

module.exports = mongoose.model('Team', teamSchema);


