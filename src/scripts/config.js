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
  user: typeof START_PAGE_USER !== 'undefined' ? START_PAGE_USER : "Example User",
  uniqueid: typeof START_PAGE_ID !== 'undefined' ? START_PAGE_ID : "unique-id-of-some-sort",
  title: "Think Less ~ Do More"
};