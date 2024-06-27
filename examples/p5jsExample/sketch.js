let video;


function setup() {
    createCanvas(800, 800);
    connectWebSocket(); // Start WebSocket connection
   // video = createCapture(VIDEO);


    navigator.mediaDevices.enumerateDevices().then(gotDevices);

    setUpCalibration();
}


const devices = [];

function gotDevices(deviceInfos) {
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    if (deviceInfo.kind == 'videoinput') {
      devices.push({
        label: deviceInfo.label,
        id: deviceInfo.deviceId
      });
    }
  }
  console.log(devices);
  let supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  console.log(supportedConstraints);
  var constraints = {
    video: {
      deviceId: {
        exact: devices[1].id
      },
    },
    audio: false
  };
  video = createCapture(constraints);
  video.size(width, height);
  video.hide(); // Hide the video feed
}

function draw() {

    gridHelper();
    for (let tagid in tags) {
        let tag = tags[tagid];
        tag.display();
    }
}



class TuioTag {
    constructor(id, x, y, angle) {
        this.id = id;
        this.x = x * width;
        this.y = y * height;
        this.angle = angle;
        this.xAverage = this.x;
        this.yAverage = this.y;
        this.angleAverage = this.angle;
        this.displayAngle = this.angle;
        this.visible = true;
        this.smoothingFactor = 0.1
    }

    update(xpos, ypos, newAngle) {
        this.x = xpos * width;
        this.y = ypos * height;
        this.angle = newAngle;
        this.smoothAngle();
        /*
         let delta = (TWO_PI - (this.angle - newAngle)) % TWO_PI;

            if (delta > PI) {
                delta = TWO_PI - delta;
                this.angle = this.angle - delta;
            } else {
                delta = TWO_PI + delta;
                this.angle = this.angle + delta;
            }
            */

    }

    setVisible(set) {
        this.visible = set;
    }


    smoothAngle() {
        let delta = this.angle - this.angleAverage;
        delta = (delta + PI) % TWO_PI - PI; // Normalize the difference to be within -180 to 180
        this.angleAverage = this.angleAverage + delta * this.smoothingFactor;
      }

    display() {
        if (this.visible) {
  
            // Smooth out position 
            let factor = 0.7;
            this.xAverage = this.xAverage * factor;
            this.xAverage += this.x * (1.0 - factor);

            this.yAverage = this.yAverage * factor;
            this.yAverage += this.y * (1.0 - factor);

   
            let corrected = applyTransformationMatrix({x:this.xAverage, y:this.yAverage}, H)


            push();
            noStroke();
            translate(this.xAverage, this.yAverage);
            fill(0, 255, 255, 255);
            stroke(255,0,0);
            text("angle: " + round(this.angleAverage, 4), 30, -10);
            text("x: " + round(this.xAverage / width, 4), 30, 0);
            text("y: " + round(this.yAverage / height, 4), 30, 10);
            text("Cx: " + round(corrected.x, 4), 30, 20);
            text("Cy: " + round(corrected.y, 4), 30, 30);

            rotate(this.angleAverage);
            fill(255, 255, 0);
            ellipse(0, 0, 40, 40);
            stroke(255,0,0)
            line(0,0,0,40)
            fill(0);
            textAlign(CENTER, CENTER);
            text(this.id, 0, 0);
            pop();


            // find new maped position based on linear regression model
           // let correctedX = this.xAverage;
           // let correctedY = this.yAverage;
      
         
            // Draw corrected points in blue
            fill(0, 0, 255);
                ellipse(corrected.x, corrected.y, 10, 10);
        }
    }
}

