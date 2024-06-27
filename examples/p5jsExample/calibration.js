const srcCorners = [
  { x: 120, y: 100 },
  { x: 480, y: 100 },
  { x: 500, y: 500 },
  { x: 100, y: 500 }
];

const dstCorners = [
  { x: 50, y: 50 },
  { x: 750, y: 50},
  { x: 750, y: 750 },
  { x: 50, y: 750}
];

let H;

//const point = { x: 200, y: 150 };
//const transformedPoint = applyTransformationMatrix(point, H);

function setUpCalibration() {
  H = computeTransformationMatrix(srcCorners, dstCorners);
  console.log(H);
}

function gridHelper() {

  // Display the webcam feed
  image(video, 0, 0, width, height);

  // Draw a blue grid
  stroke(0, 0, 255);
  strokeWeight(0.5);
  for (let x = 0; x < width; x += 10) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
  strokeWeight(1.5);
  // draw source 
  fill(255,255,0);
  text("Source ", srcCorners[0].x, srcCorners[0].y);
  stroke(255,255,0);
  noFill();
  for(let i = 0; i<srcCorners.length; i++) {
    line(srcCorners[i].x, srcCorners[i].y, srcCorners[(i+1)%srcCorners.length].x, srcCorners[(i+1)%srcCorners.length].y)
  } 

  // draw Goal 
  noStroke();
  fill(255,0,255);
  text("Goal  ", dstCorners[0].x, dstCorners[0].y);
  stroke(255,0,255);
  noFill();
  for(let i = 0; i<dstCorners.length; i++) {
    line(dstCorners[i].x, dstCorners[i].y, dstCorners[(i+1)%dstCorners.length].x, dstCorners[(i+1)%dstCorners.length].y)
  }

}


function computeTransformationMatrix(src, dst) {
  const A = [];
  for (let i = 0; i < 4; i++) {
    A.push([src[i].x, src[i].y, 1, 0, 0, 0, -src[i].x * dst[i].x, -src[i].y * dst[i].x]);
    A.push([0, 0, 0, src[i].x, src[i].y, 1, -src[i].x * dst[i].y, -src[i].y * dst[i].y]);
  }
  const B = [];
  for (let i = 0; i < 4; i++) {
    B.push(dst[i].x);
    B.push(dst[i].y);
  }

  const A_mat = math.matrix(A);
  const B_mat = math.matrix(B);
  const h = math.lusolve(A_mat, B_mat)._data.flat();
  const H = [
    [h[0], h[1], h[2]],
    [h[3], h[4], h[5]],
    [h[6], h[7], 1]
  ];

  return H;
}

function applyTransformationMatrix(point, H) {
  const x = point.x, y = point.y;
  const newX = (H[0][0] * x + H[0][1] * y + H[0][2]) / (H[2][0] * x + H[2][1] * y + H[2][2]);
  const newY = (H[1][0] * x + H[1][1] * y + H[1][2]) / (H[2][0] * x + H[2][1] * y + H[2][2]);
  return { x: newX, y: newY };
}