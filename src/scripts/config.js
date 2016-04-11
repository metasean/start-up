var config = {
  /* 
  The `config` object holds configuration variables.
  - `clockTimeout` is an initial refresh rate for the clock.js script, which
    is overwritten once the date and time have been established.
  - `user` is the name to show in the To Do List header and as part of your gun key
  - `uniqueid` is an additional variable to ensure your gun key is less likely to collide with someone else's key
  - `title` is the page title and will show up on the browser tab
  */
  clockTimeout: 10,
  user: "Example User",
  uniqueid: "unique-id-of-some-sort-or-another",
  title: " ~ Seize the day! ~ "
};

config.ask = function() {
  /*
      config.ask is a function that allows a viewer to update the config.user and config.uniqueid variables, and then trigger the `toDo` function to update its corresponding values 
      - it uses a very basic `window.prompt` to gather the info from the viewer
      - it defaults to using the existing user and uniqueid values
  */
  /* TODO: save custom config to localStorage */
  this.user = window.prompt('\nUSER NAME\nPlease enter your desired user name, otherwise it will be:', this.user) || this.user;
  // NOTE: Currently only saving to localStorage, so user key isn't particularly useful for demo purposes.  
  //this.uniqueid = window.prompt('\nUSER KEY\nPlease enter your existing key or enter a new key\nensuring that it is fairly distinct, otherwise your key will be:', this.uniqueid) || this.uniqueid;

  toDo(); // update the variables already in use
};

/* 
    Uncomment the following line to ask the viewer for a user (name) and uniqueid on every page load. 
*/
//config.ask();