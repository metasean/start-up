# What is this?

This code generates a custom web browser default page, which can be used as is.
*However*, the code has been modularized to make it easy for people who are learning front end development to replace or customize sections of code.

# Getting Started

Either fork or download the repo.

Edit the files to your heart's content.  See the Customizing Your Start Page section below for details and guidance.  See the Inspiration section below for additional ideas and quotes.

# Use in browsers

The index.html page can be viewed as is in a web browser, but to be used as a default start page there is some configuration necessary.

### Firefox configuration

1. Install https://addons.mozilla.org/en-US/firefox/addon/custom-new-tab/
2. "Window"
3. "Extensions"
4. "Custom New Tab"
5. "Preferences"
6. Set the Redirect URL value to your index.html page
7. Tab out of url field and close pop-up
8. Firefox "Preferences"
9. Set Home Page to your index.html page

### Chrome configuration

1. Install https://chrome.google.com/webstore/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna
2. Either:  
  - After a fresh install, "Set Options"  
  - Access through extensions  
    a. Hamburger  
    b. "Extensions"  
    c. "New Tab Redirect"  
    d. "Options"  
3. Set the Redirect URL value to your index.html page  

# Use from GitLab

You can fork this repo from within GitLab.  

In your forked repo, navigate to Settings -> Variables and add the following two keys with the values you would like:  
 - START_PAGE_USER
 - START_PAGE_ID

Then make your modifications, ensuring the 'master' branch is kept up-to-date.

Each time your GitLab repo is updated, the `.gitlab-ci.yml` script will automatically trigger a rebuild.



# Customizing Your Start Page

## High Level Overview

 - index.html - The core page that links everything together (I don't recommend deleting this).  To some degree, the ordering and layout is effected by the organization of the content on this page.  More details are embedded in the actual page.
 NOTE: Make sure you change the startUp.config variables to your liking.

 - layout.css - This Cascading Style Sheet (css) handles the majority of the positioning using flexbox.  Some positioning is related to fonts and is therefore managed through the typography.css file.  More details are embedded in the actual file.

 - colors.css - This css sets colors for the page.   More details are embedded in the actual page.  More details are embedded in the actual file.

 - typography.css - This css sets all but color values for the various text on the page, as well as related spacing.  More details are embedded in the actual file.

 - clock.js - This JavaScript (js) file gets the local time, sets it to related variables, and set the corresponding text values within index.html page.  More details are embedded in the actual file and in the clock.js section below.

 - toDo.js - This js file uses gun (http://gun.js.org/) to provide localStorage and cloud-based storage of toDo items and jquery to process them for display.  More details are embedded in the actual file and in the toDo.js section below.

## clock.js

There are many ways to generate values for a date and time display.  The one below is *more* customized than most people will want, but it should also give you an idea of what is possible.

1. There needs to be a renderClock function to encapsulate related functionality  
2. Get the date/time from the local machine (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)  
3. Break the date/time into its constituent parts and assign each part to a variable  
4. If the Month, Date, hour, or minute is less than 10, prepend a 0 this ensures each value is two characters in length, which in turn ensures the values aren't visually 'jumping' (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#Long_literal_strings)  
5. Use vanilla js to get and set the date element to your desired format (https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)  
6. Use vanilla js to get and set the clock element to your desired format  
7. The startUp.config.clockTimeout was initially set to 10ms, but once the time is initially shown, there's no need to run so frequently, so go ahead and reduce the update frequency.  
8. Use setTimout and the startUp.config.clockTimeout to run renderClock again at the appropriate time (https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)  
9. Don't forget to invoke the renderClock function ;-)  


## toDo.js

A more detailed introduction to html, css, javascript, jquery and gun which walks you step-by-step through building a simple to-do webpage is available at
http://gun.js.org/think.html

### Conceptual Overview

Among other things, GUN is a distributed, offline-first, graph-database.

The first thing this means is that all our data will automatically be stored to the localStorage, and can easily be saved and shared with other gun peers.  We're also going to connect to a hosted peer to provide easy synchronization between browsers.

The next thing this means is that our data is stored as a graph.  At it's heart, this is a mathematical arrangement of data, that allows you to organize your data pretty much any way you want to.  For our purposes, you'll navigate to a single node (i.e. your personal todo node) and it will contain an unordered set of other nodes, each of which represent one of your todo items.

The last thing this means is that you can't ever "delete" data (it's a constraint, for better or worse, of all truly distributed data systems.) So, instead of deleting a node, you `null` out it's data.

### Making it so

1. There needs to be a toDo function to encapsulate related functionality.
2. The startUp.config.user name will be used several times, so assign it to a variable
3. The toDo function needs:  
   a. a connection to a Gun peer (https://github.com/amark/gun/wiki/JS-API#gun)  
   b. a connection to a specific node on that peer (https://github.com/amark/gun/wiki/JS-API#get)  
   c. an empty set if there isn't already data on that node (https://github.com/amark/gun/wiki/JS-API#set)  
  See also: http://gun.js.org/think.html
4. The 'span.todos form' needs to be watched for 'on' events.  When the form is submitted:  
  a. You do NOT want to refresh the page, so prevent the default event behavior (http://api.jquery.com/event.preventDefault/)  
  b. Take the input value and add it (e.g. set) to our gun node (http://api.jquery.com/val/ & https://github.com/amark/gun/wiki/JS-API#set)  
  c. Reset the input's value (http://api.jquery.com/val/)
5. Keep constant watch on your gun node. Whenever there is a change, iterate over all sub-nodes and process them (https://github.com/amark/gun/wiki/JS-API#map & https://github.com/amark/gun/wiki/JS-API#val).  For each change:  
  a. Use jquery to get *or* create a list item node for each of the gun todo nodes   
    1. Give it the id of the corresponding gun node (http://api.jquery.com/attr/)  
    2. Add the list item to the end of the unordered list (http://api.jquery.com/appendTo/)  
  b. Also create a checkbox for each of the gun todo nodes   
    1. Give it the id of the corresponding gun node  
    2. When the checkbox is changed, have it trigger a 'hideCheckbox' function which takes the checkbox's event data (http://api.jquery.com/change/)  
  C. Create the hideCheckbox function  
    1. If the checkbox was checked  
      a. Set the corresponding gun node's value to `null` (https://github.com/amark/gun/wiki/JS-API#put)  
      b. Hide the entire list item (http://api.jquery.com/hide/)  
  d. If a gun node's value exists  
    1. Append the previously created checkbox to the previously created list item  
    2. Append a label to the checkbox  
      a. Set its 'for' attribute to the node's id  
      b. Set its 'text' to the node's value (http://api.jquery.com/text/)  
  e. If the gun node's value does not exist  
    1. Hide the entire list item  
6. Don't forget to invoke the toDo function ;-)






# Inspiration

## Start Page Ideas

 - http://lifehacker.com/tag/desktops

 - http://lifehacker.com/5731409/the-sands-of-time-desktop / http://k3ttc4r.deviantart.com/art/startpage-rwrt-upd8-2011-04-18-105703135

 - Chrome's 
   - Momentum - https://chrome.google.com/webstore/detail/momentum/laookkfknpbbblfpciffpaejjkokdgca

   - Start - https://chrome.google.com/webstore/detail/start-a-better-new-tab/kgifkabikplflflabkllnpidlbjjpgbp


## Images

https://unsplash.com/ - Free (do whatever you want) high-resolution photos.
10 new photos every 10 days.

Some that Sean is considering:
 - https://unsplash.com/photos/Sfn8f32ZIj0

 - https://unsplash.com/photos/awnHOXjsdT4
 - https://unsplash.com/photos/E9CrQou9K0Y

 - https://unsplash.com/photos/jLwVAUtLOAQ

 - https://unsplash.com/photos/p62O--o1x-U
 - https://unsplash.com/photos/uivWDK2Ifrg
 - https://unsplash.com/photos/NbUokuw0BQI

 - https://unsplash.com/photos/cVEfUcl6xCo
 - https://unsplash.com/photos/CNzh2A9_jwE
 - https://unsplash.com/photos/Ki0dpxd3LGc
 - https://unsplash.com/photos/xorjaMB8W70
 - https://unsplash.com/photos/eOpewngf68w
 - https://unsplash.com/photos/CoD2Q92UaEg
 - https://unsplash.com/photos/OWwK_0_EnxY
 - https://unsplash.com/photos/6LkxufmApSk
 - https://unsplash.com/photos/lpjb_UMOyx8

## Quotes

There are moments when one has to choose between living one's own life, fully, entirely, completely-or dragging out some false, shallow, degrading existence that the world in its hypocrisy demands.  
Oscar Wilde, Lady Windermere's Fan 

Your best teacher is your last mistake.  
Ralph Nader

Always bear in mind that your own resolution to succeed is more important than any other.  
Abraham Lincoln

Success isn't a result of spontaneous combustion. You must set yourself on fire.  
Arnold H. Glasow

Have no fear of perfection - you'll never reach it.  
Salvador Dalí

Success is blocked by concentrating on it and planning for it... Success is shy - it won't come out while you're watching.  
Tennessee Williams

Many of life's failures are people who did not realize how close they were to success when they gave up.  
Thomas A. Edison

We are what we repeatedly do. Excellence, therefore, is not an act, but a habit.  
Aristotle

I'm a success today because I had a friend who believed in me and I didn't have the heart to let him down.  
Abraham Lincoln

The most exciting phrase to hear in science, the one that heralds the most discoveries, is not "Eureka!" (I found it!) but "That's funny..."  
Isaac Asimov

Only those who dare to fail greatly can ever achieve greatly.  
Robert F. Kennedy

Success consists of getting up just one more time than you fall.  
Oliver Goldsmith

If you try and take a cat apart to see how it works, the first thing you have on your hands is a non-working cat.  
Douglas Adams

Do not judge me by my successes, judge me by how many times I fell down and got back up again.  
Nelson Mandela

To know even one life has breathed easier because you have lived. This is to have succeeded.  
Bessie Anderson Stanley

No one who achieves success does so without acknowledging the help of others. The wise and confident acknowledge this help with gratitude.  
Alfred North Whitehead

No one can make you feel inferior without your consent.  
Eleanor Roosevelt, This is My Story

An expert is a person who has made all the mistakes that can be made in a very narrow field.  
Niels Bohr

For me, I am driven by two main philosophies: know more today about the world than I knew yesterday and lessen the suffering of others. You'd be surprised how far that gets you.  
Neil deGrasse Tyson

If we wait until we're ready, we'll be waiting for the rest of our lives.  
Lemony Snicket

Do the best you know how. When you know better, do better.  
Maya Angelou

The reward of a thing well done is to have done it.  
Ralph Waldo Emerson 

Innovation comes only from readily and seamlessly sharing information rather than hoarding it.  
Tom Peters

Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.  
Brian W. Kernighan