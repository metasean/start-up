/* NOTES:
   The typography.css styling hides the todo list item bullets.  For debugging, you may want to show the bullets.

   The detailed introduction to html, css, javascript, jquery and gun:
   http://gun.js.org/think.html

   Conceptual Overview:
   Among other things, GUN is a distributed, offline-first, graph-database.  

   The first thing this means is that all our data will automatically be 
   stored to the localStorage, and can easily be saved and shared with other 
   gun peers.  We're also going to connect to a hosted peer to provide easy 
   synchronization between browsers.

   The next thing this means is that our data is stored as a graph.  At it's
   heart, this is a mathematical arrangement of data, that allows you to 
   organize your data pretty much any way you want to.  For our purposes, 
   you'll navigate to a single node (i.e. your personal todo node) and it will
   contain an unordered set of other nodes, each of which represent one of your
   todo items.

   The last thing this means is that you can't ever "delete" data (it's a constraint, for better or worse, of all truly distributed data systems.) So, instead of deleting a node, you `null` out it's data.
*/

/* GUN assumes all data is submitted as objects; there is no array support in 
   gun.  So, we're going to add todo items to a single object using randomly 
   generated keys.  We'll do this by adding a method to gun's prototype chain 
*/
Gun.chain.set = function (value, cb, opt) {
  // create a random string
  var random_key = Gun.text.random();

  // put the todo value on that random path
  return this.path(random_key).put(value, cb, opt);
};


/* The toDo function controls all aspects of the To Do list's functionality */
function toDo() {
  var username = config.user

  /* Instead of using a hard-coded name for the heading, 
     let's use your startUp.config.user name */
  $('span.todos h1').text(username + "'s To Do List");
  
  /* We can use the default localStorage  to store your todo items 
     in the browser's localStorage ONLY, by using
     `var gun = Gun()` 
     OR, we can store your todo items in the browser's localStorage 
     and in a cloud based location, which allows you to access your items
     across browsers (e.g. your laptop and your phone) 
  */
  // NOTE: Currently this demo is not connected to a gun server, so data is only being saved locally.
  var gun = Gun()//('https://gunjs.herokuapp.com/gun')
            /* GUN uses a chaining api, so once we've set up our initial 
               Gun peer, we'll want to `.get()` data from a specific key.
               If you're only using localStorage, then you can use a 
               simple key, such as `.get('todo')`.
               HOWEVER, if you're using the 'https://gunjs.herokuapp.com/gun'
               cloud location it is an open location. To avoid using the same
               key as someone else, you'll want to ensure your key is unique.
            */
            .get('cloud/hosted/todo/app/for/' + username + config.uniqueid)
            /* The `.set()` command will not be needed in gun version 0.3.0,
               but for versions prior to 0.3.0 (including the packaged 0.2.5),
               it is necessary to explicitly tell gun what to do if there is 
               no initial data at the specified key location.  `set()` tells 
               gun to initial an empty value.
            */
            //.set(); 

  /* We're going to keep constant watch for any submissions 
     (e.g. 'on' events) to the 'todos' form 
  */
  $('span.todos form').on('submit', function(event){
    /* Unlike a traditional form, we do NOT want to refresh the page,
       so we need to prevent the default event behavior */
    event.preventDefault();
    /* We need to take the input value and add it (e.g. set) to our gun node 
    */
    gun.set($('span.todos input[type="text"]').val());
    /* Once the input value is saved, we need to reset the input field 
    */
    $('span.todos input[type="text"]').val("");
  });
  
  /* We're also going to keep constant watch on our gun node.
     Whenever there is a change, we're going to iterate over all sub-nodes
     (e.g. map over their vals) and process them 
  */
  gun.map().val(function(thought, id){
    /*  Using jquery, we're going to get *or* create a list item node for each
        node
    */
    var li = $('span.todos #' + id).get(0) || $('<li>')
             /* We're going to add the corresponding gun node's id as the list
                item's id
             */
             .attr('id', id)
             /* We're going to add the list item to the end of 
                (e.g. append it to) the unordered list of to do items 
             */
             .appendTo('.todos ul');
    /* We're also going to use jquery to create a checkbox for each to do item
    */
    var checkbox = $('<input type="checkbox">')
                   /* And we're going to add the corresponding gun node's id as the checkbox's id, just like we did for the list item 
                   */
                   .attr('id', id)
                   /* Finally, we're going to add a change event to the 
                      checkbox.  This way, when the checkbox is clicked, the 
                      hideCheckbox function is called.
                   */
                   .change(function () {
                     hideCheckbox(this);
                   });

    /* The hideCheckbox function takes the checkbox event data */
    var hideCheckbox = function(cbox) {
      /* If the the checkbox has been checked */
      if (cbox.checked) {
        /* it will null out the value of the corresponding node */
        gun.path(cbox.id).put(null);
        /* it then hides the list item */
        $(cbox).parents('li').hide();
      }
    }

    /* if a node's thought is not empty or null */
    if(thought){
      /* we'll append the previously created checkbox to the list item */
      $(li).append(checkbox); // add a checkbox
      /* and we'll also append a label that it */ 
      $(li).append($('<label>')
           /* with a 'for' attribute that ties it to the checkbox based on id */
           .attr('for', id)
           /* and which display's the text of the todo item */
           .text(thought)); // label the checkbox
      /* ⇓↓⇓↓⇓ alternatively, we could simply make the label clickable ⇓↓⇓↓⇓ */
      // $(li).append($('<label>').text(thought).prepend('<input type="checkbox">'));
    /* if the node's value is empty, null, or otherwise non-existent */
    } else {  
      /* then we won't show the list item at all */
      $(li).hide();
    }
  });
}

/* of course, we have to call, or otherwise invoke, the toDo function ;-) */
toDo();