let points = [
  { original: { x: 0.5, y: 0.5 }, corrected: { x: 0.5, y: 0.5 } },
  { original: { x: 0.2, y: 0.2 }, corrected: { x: 0.0, y: 0.0 } },
  { original: { x: 0.8, y: 0.8 }, corrected: { x: 1.0, y: 1.0 } },
  { original: { x: 0.8, y: 0.2 }, corrected: { x: 1.0, y: 0.0 } },
  { original: { x: 0.2, y: 0.8 }, corrected: { x: 0.0, y: 1.0 } }
];

let modelX, modelY;
function setUpCalibration() {

  runCalibration();
}

function gridHelper() {

  // Display the webcam feed
  image(video, 0, 0, width, height);

  // Draw a blue grid
  stroke(0, 0, 255);
  strokeWeight(1);
  for (let x = 0; x < width; x += 10) {
    line(x, 0, x, height);
  }
  for (let y = 0; y < height; y += 10) {
    line(0, y, width, y);
  }
}

function runCalibration() {

  let originalX = [];
  let originalY = [];
  let correctedX = [];
  let correctedY = [];

  for (let pt of points) {
    originalX.push(pt.original.x);
    originalY.push(pt.original.y);
    correctedX.push(pt.corrected.x);
    correctedY.push(pt.corrected.y);
  }


  // Train the polynomial regression model for X and Y separately
  modelX = polynomialRegression(originalX, correctedX, 2); // Degree 2 polynomial
  modelY = polynomialRegression(originalY, correctedY, 2); // Degree 2 polynomial

}


// Polynomial regression function
function polynomialRegression(x, y, degree) {
  let xMatrix = [];
  for (let i = 0; i < x.length; i++) {
    let row = [];
    for (let j = 0; j <= degree; j++) {
      row.push(Math.pow(x[i], j));
    }
    xMatrix.push(row);
  }

  let xMatrixT = math.transpose(xMatrix);
  let xTx = math.multiply(xMatrixT, xMatrix);
  let xTy = math.multiply(xMatrixT, y);
  let coeffs = math.lusolve(xTx, xTy);

  return {
    predict: function (value) {
      let result = 0;
      for (let i = 0; i < coeffs.length; i++) {
        result += coeffs[i][0] * Math.pow(value, i);
      }
      return result;
    }
  };
}

