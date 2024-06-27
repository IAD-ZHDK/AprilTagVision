let tags = {}; // Object to store tag data

function addTagIfDoesntExist(data) {
  // if tag doesn't already exist 
  if (!tags[data.tagid]) {
    tags[data.tagid] = new TuioTag(data.tagid, data.xpos, data.ypos, data.ang);

    // Display the tag
    tags[data.tagid].display();
  }
}

function moveTag(data) {
  if (tags[data.tagid]) {
    tags[data.tagid].update(data.xpos, data.ypos, data.ang);
  }
}

function handleTuioEvent(data) {
  if (data.change === 'appeared') {
    console.log(data.tagid + " APPEARED");
    addTagIfDoesntExist(data);
  }

  if (data.change === 'moved') {
    moveTag(data);
  }

  if (data.change === 'disappeared') {
    console.log(data.tagid + " DISAPPEARED");
    delete tags[data.tagid];
  }
}


function connectWebSocket() {
  let socket = new WebSocket("ws://localhost:8765");

  socket.onopen = function (e) {
    console.log("[open] Connection established");
  };

  socket.onmessage = function (event) {
    handleTuioEvent(JSON.parse(event.data));
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[close] Connection died');
    }
    setTimeout(connectWebSocket, 2000); // Retry after 2 seconds
  };

  socket.onerror = function (error) {
    console.log(`[error]`);
  };
}
