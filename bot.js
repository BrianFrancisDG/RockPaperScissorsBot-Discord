var keys = require('./keys');
const eris = require('eris');

// Create a Client instance with our bot token.
const bot = new eris.Client(keys.RPSBotClientKey);

const PREFIX = 'rps!';

const choicesArray = [
    'rock',
    'paper',
    'scissors'
];

bot.on('ready', () => {
    console.log('Connected and ready.');
 });

const commandHandlerForCommandName = {};
commandHandlerForCommandName['play'] = (msg, args) => {
  const handThrown = args[0];
  //const amount = parseFloat(args[1]);

  // TODO: Handle invalid command arguments, such as:
  // 1. No mention or invalid mention.
  // 2. No amount or invalid amount.
  // 3. Two players to play with @mention
  // 4. Clean win/lose logic

  let randomIndex = Math.floor(Math.random() * choicesArray.length); 
  let botHandThrown = choicesArray[randomIndex];
  let didYouWin = false;
  let isItTied = false;

  if(handThrown == botHandThrown){
      isItTied = true;
  }
  else if(handThrown == 'rock' && botHandThrown == 'scissors'){
      didYouWin = true;
  }
  else if(handThrown == 'rock' && botHandThrown == 'paper'){
      didYouWin = false;
  }
  else if(handThrown == 'paper' && botHandThrown == 'rock'){
      didYouWin = true;
  }
  else if(handThrown == 'paper' && botHandThrown == 'scissors'){
      didYouWin = false;
  }
  else if(handThrown == 'scissors' && botHandThrown == 'rock'){
      didYouWin = false;
  }
  else if(handThrown == 'scissors' && botHandThrown == 'paper'){
      didYouWin = true;
  }
  
  var message = ``;
  if(isItTied){
      message = `You played ${handThrown}. The bot played ${botHandThrown}. It's a tie.`
  }
  else if(didYouWin){
      message = `You played ${handThrown}. The bot played ${botHandThrown}. You win!`
  }
  else if(!didYouWin){
      message = `You played ${handThrown}. The bot played ${botHandThrown}. You lose.`
  }
  
  return msg.channel.createMessage(message);
};

bot.on('messageCreate', async (msg) => {
  const content = msg.content;

  // Ignore any messages sent as direct messages.
  // The bot will only accept commands issued in
  // a guild.
  if (!msg.channel.guild) {
    return;
  }

  // Ignore any message that doesn't start with the correct prefix.
  if (!content.startsWith(PREFIX)) {
      return;
  }

  // Extract the parts of the command and the command name
  const parts = content.split(' ').map(s => s.trim()).filter(s => s);
  const commandName = parts[0].substr(PREFIX.length);

  // Get the appropriate handler for the command, if there is one.
  const commandHandler = commandHandlerForCommandName[commandName];
  if (!commandHandler) {
      return;
  }

  // Separate the command arguments from the command prefix and command name.
  const args = parts.slice(1);

  try {
      // Execute the command.
      await commandHandler(msg, args);
  } catch (err) {
      console.warn('Error handling command');
      console.warn(err);
  }
});

bot.on('error', err => {
  console.warn(err);
});

bot.connect();