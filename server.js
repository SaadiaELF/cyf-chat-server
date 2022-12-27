const express = require("express");
const cors = require("cors");
const path = require("path");
const uuid = require("uuid");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());

// create application/x-www-form-urlencoded parser - middlleware function
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

// Static file
app.use(express.static(path.join(__dirname, "public")));

// Get all messages
app.get("/messages", function (request, response) {
  response.status(200).json(messages);
});

// Get one message by id
app.get("/messages/:id", function (request, response) {
  let message = messages.find((msg) => msg.id == request.params.id);
  if (message) {
    response.status(200).json(message);
  } else {
    response
      .status(400)
      .json({ msg: "No character with this Id: " + request.params.id });
  }
});

// Create new message
app.post("/messages", urlencodedParser, function (request, response) {
  const newMessage = {
    id: uuid.v4(),
    from: request.body.from,
    text: request.body.text,
  };

  messages.push(newMessage);
  response.send(messages);
});

// Delete one message by id
app.delete("/messages/:id", function (request, response) {
  let message = messages.find((msg) => msg.id == request.params.id);
  if (message) {
    response.status(200).json({
      msg: "Message deleted",
      messages: messages.filter(({ id }) => id != request.params.id),
    });
  } else {
    response
      .status(400)
      .json({ msg: "No character with this Id: " + request.params.id });
  }
});

app.listen(PORT, () => console.log(`Listening on port : ${PORT}`));
