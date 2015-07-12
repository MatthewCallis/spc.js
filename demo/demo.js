// - Controls
  var play  = document.querySelector("#play");
  var prev  = document.querySelector("#prev");
  var next  = document.querySelector("#next");
  var stop  = document.querySelector("#stop");

// - Time
  var elapsedTime   = document.querySelector("#elapsedtime");
  var totalTime     = document.querySelector("#totaltime");
  var progressBar   = document.querySelector("#progressbar");
  var audioControls = document.querySelector("#controls");

// - UI elements
  var audio       = document.querySelector("#mytrack");
  var tracks      = document.querySelector("#tracks");
  var artwork     = document.querySelector("#artwork");
  var background  = document.querySelector("#background");

// - Interval
  var timer;

// - Volume
  var volume = audio.volume = 0.4;

// - Theme
  var colorTheme = "orange";
      colorTheme += "/";

// - Project root
  var projectDir = "http://michaelmammoliti.com/_projects/audioJS/";

// - Project folders
  var tracksDir       = projectDir + "songs/";
  var artworksFolder  = projectDir + "artworks/";
  var iconsFolder     = projectDir + "icons/" + colorTheme;

// - Tracks
  var defaultTrack    = 1;
  var currentTrack    = defaultTrack;
  var playlist       	= [];

// - Audio
  var duration;
  var audioState      = "pause";

// - Auto
  var autoPlay        = false;
  var autoRepeat      = true;


// - Audio Controls
  function playAudio()
  {

    // If no track loaded
    if(audio.getAttribute("src") === "")
    {
      audio.src = tracksDir + addZero(defaultTrack + 1, 2) + ".mp3";
    }

    // Play
    audio.play();
    audioState = "play";
    changeBackgroundImage(play, iconsFolder + "pause.png");

    // Update the time
    timer = setInterval(
      function()
      {
        updateTime();
      },
      100
    );

  }


// - Control's functions
  function pauseAudio()
  {
    audio.pause();
    audioState = "pause";

    changeBackgroundImage(play, projectDir + "icons/darkblue/play.png");

    clearInterval(timer);
  }

  function stopAudio()
  {
    audio.currentTime = 0;

    clearInterval(timer);
  }


// - Update DOM elements

  // Activate the track
  function updateActiveTrack(num)
  {
    tracks.children[num-1].classList.add("active");
  }

  // Chamge audio tag song
  function changeSong(num)
  {
    // Set new song
    currentTrack = parseInt(num);

    // Delete CSS classes to all tracks
    for(var i = 0; i < playlist.length; i++)
    {
      tracks.children[i].removeAttribute("class");
    }
    // CSS Highlight activated track
    updateActiveTrack(currentTrack);

    // Change track
    audio.src = tracksDir + addZero(currentTrack, 2) + ".mp3";

    // Update image
    var artworkSrc = artworksFolder + addZero(currentTrack,2) + ".jpg";

    artwork.src = artworkSrc;
    changeBackgroundImage(artwork, artworkSrc);
    changeBackgroundImage(document.body, artworkSrc);

    // Check if the audio is playing and then play it
    if(audioState === "play")
    {
      playAudio();
    }
  }


// - TIME
  function getAudioSeconds(string)
  {
    var seconds = string % 60;
        seconds = addZero(Math.floor(seconds), 2);

    if(seconds < 60)
    {
      return seconds;
    }
      else
      {
        return "00";
      }
  }

  function getAudioMinutes(string)
  {
    var minutes = (string / 60);
        minutes = addZero(Math.floor(minutes), 2);

    if(minutes < 60)
    {
      return minutes;
    }
      else
      {
        return "00";
      }
  }

// - FIX ZERO - Nice functions i made, i think sharing will helps

  // Add howManyZero to from the begin
  function addZero(word, howManyZero)
  {
    word = String(word);

    while(word.length < howManyZero)
    {
      word = "0" + word;
    }

    return word;
  }

  // - Remove howManyZero from the begin
  function removeZero(word, howManyZero)
  {
    word = String(word);

    var i = 0;

    while(i < howManyZero)
    {
      if(word[0] === "0")
      {
        word = word.substr(1, word.length);
      }
        else { break; }

      i++;
    }

    return word;
  }

// - Manage DOM Nodes
  function insertDOMElement(parent, htmlString)
  {
    parent.insertAdjacentHTML("beforeend", htmlString);
  }

  function createTrackItem(trackNum, trackTitle, trackArtist, trackImage)
  {
    var div = "";

    div += "<artwork style='background-image: url(\"" + trackImage + "\")'></artwork>";
    div += "<span>" + trackNum + ". " + trackArtist + " - " + trackTitle + "</span>";

    return div;
  }

  function populateTrack()
  {
    for(var i = 0; i < tracks.children.length; i++)
    {

      var trackName = tracks.children[i].getAttribute("trackname");
      var trackArtist = tracks.children[i].getAttribute("trackartist");
      var trackartwork = tracks.children[i].getAttribute("trackartwork");

      playlist.push({title: trackName, artist: trackArtist, artwork: trackartwork});

      insertDOMElement(
        tracks.children[i],
        createTrackItem(addZero( (i+1) ,2),
        playlist[i].title,
        playlist[i].artist,
        artworksFolder + playlist[i].artwork)
      );

      tracks.children[i].removeAttribute("trackname");
      tracks.children[i].removeAttribute("trackartist");
      tracks.children[i].removeAttribute("trackartwork");

      tracks.children[i].setAttribute("tracknum", i+1);
    }
  }

// - DOM Animation / Styles / Updates
  function changeBackgroundImage(element, image)
  {
    element.style.backgroundImage = "url('" + image + "')";
  }

  function updateProgressBarPosition()
  {
    var percentage = audio.currentTime * 100 / duration;

    progressBar.children[0].style.width = percentage + "%";
  }

  function updateTime()
  {
    var audioTime = getAudioMinutes(audio.currentTime) + ":" + getAudioSeconds(audio.currentTime);

    updateProgressBarPosition();
    elapsedTime.innerHTML = audioTime;

    if(audio.ended)
    {

      if(currentTrack === (playlist.length))
      {
        currentTrack = defaultTrack;
        changeSong(currentTrack);
      }
        else
        {
          currentTrack = currentTrack + 1;
          changeSong(currentTrack);
        }

      if(autoRepeat === true)
      {
        playAudio();
      }

    }
  }

// - POPULATE HTML
  populateTrack();

// - EVENTS
  window.onload = function()
  {
    changeSong(defaultTrack);
  };

  audio.addEventListener(
    'loadedmetadata',
    function()
    {
      duration = audio.duration;
      totalTime.innerHTML = getAudioMinutes(duration) + ":" + getAudioSeconds(duration);
    }
  );

  play.addEventListener(
    "click",
    function()
    {
      if(audioState === "pause")
      {
        playAudio();
        updateActiveTrack(currentTrack);
      }
        else if(audioState === "play")
        {
          pauseAudio();
        }
    }
  );

  stop.addEventListener(
    "click",
    function()
    {
      stopAudio();
      pauseAudio();
      updateTime();
    }
  );

  prev.addEventListener(
    "click",
    function()
    {
      if(currentTrack > 1)
      {
        stopAudio();
        changeSong(currentTrack - 1);
      }
        else if(currentTrack === 1)
        {
          stopAudio();
          changeSong(currentTrack);
        }
    }
  );

  next.addEventListener(
    "click",
    function()
    {
      if(currentTrack < playlist.length)
      {
        stopAudio();
        updateTime();
        changeSong(currentTrack + 1);
      }
        else
        {
          currentTrack = 1;
          changeSong(currentTrack);
        }
    }
  );

  progressBar.addEventListener(
    "click",
    function(e)
    {
      var mouse,
          percentage,
          newTime;

      if(e.offsetX){ mouseX = e.offsetX; }
      if(mouseX == undefined && e.layerX){ mouseX = e.layerX; }

      percentage  = mouseX / progressBar.offsetWidth;
      newTime     = audio.duration * percentage;

      audio.currentTime = newTime;
    }
  );

  // - Add events to all tracks
    for(var i = 0; i < playlist.length; i++)
    {

      tracks.children[i].addEventListener(
        "click",
        function()
        {
          if(this.classList[0] !== "active")
          {
            tracks.children[1].removeAttribute("class");
            this.classList.add("active");

            changeSong(parseInt(this.getAttribute("tracknum")));
          }
        }
      );

    }

  // - Add events to all audioControls
    for(var i = 0; i < audioControls.children.length; i++)
    {

      audioControls.children[i].addEventListener(
        "mousedown",
        function()
        {
          if(this.classList[0] !== "shadow")
          {
            for(var x = 0; x < audioControls.children.length; x++)
            {
              audioControls.children[x].classList.remove("shadow");
            }

            this.classList.add("shadow");
          }

        }
      );

      audioControls.children[i].addEventListener(
        "mousedown",
        function()
        {

          changeBackgroundImage(this, iconsFolder + this.id + ".png");

          if(this.classList[0] !== "shadow")
          {
            for(var x = 0; x < audioControls.children.length; x++)
            {
              audioControls.children[x].classList.remove("shadow");
            }
            this.classList.add("shadow");
          }
        }
      );

      audioControls.children[i].addEventListener(
        "mouseup",
        function()
        {
          changeBackgroundImage(this, projectDir + "icons/darkblue/" + this.id + ".png");
          this.classList.remove("shadow");
        }
      );

    }
