function draw(cabinet = new Cabinet()) {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    canvas.style.width = "100%";
    canvas.style.height = "30* 590 /rem";
    canvas.width = canvas.offsetWidth;

    const faceframeDim = 2; // arbitrary 2in face frame
    const boxWidth = 2 * faceframeDim + cabinet.openingWidth;
    const boxHeight = 2 * faceframeDim + cabinet.openingHeight;

    const norm_factor = ctx.canvas.width / boxWidth; // normalize measurements

    canvas.height = boxHeight * norm_factor; // set canvas height based on norm_factor
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const gap = cabinet.gap * norm_factor;
    const stileRailWidth = cabinet.stileRailWidth * norm_factor;

    const outerChamferWidth = 0.5 * norm_factor; // 1/2" chamfer detail
    const innerChamferWidth = 0.25 * norm_factor; // 1/4" chamfer detail

    let xpos = 0;
    let ypos = 0;
    ctx.fillRect(xpos, ypos, boxWidth * norm_factor, boxHeight * norm_factor); // draw cabinet box, add face frame for visual effect

    xpos += faceframeDim * norm_factor - cabinet.overlay * norm_factor; // move x position to account for overlay
    ypos += faceframeDim * norm_factor - cabinet.overlay * norm_factor; // move y position to account for overlay

    cabinet.doors.forEach((door) => {
      const doorWidth = door.width * norm_factor;
      const doorHeight = door.height * norm_factor;
      const panelWidth = doorWidth - 2 * stileRailWidth;
      const panelHeight = doorHeight - 2 * stileRailWidth;

      // create gradient for chamfer detail
      const xposDoorCenter = xpos + doorWidth * 0.5;
      const yposDoorCenter = ypos + doorHeight * 0.5;
      const innerRad = doorWidth * 0.25;
      const outerRad = doorWidth;
      const innerGrad = ctx.createRadialGradient(
        xposDoorCenter,
        yposDoorCenter,
        innerRad,
        xposDoorCenter,
        yposDoorCenter,
        outerRad,
      );
      innerGrad.addColorStop(0, "white");
      innerGrad.addColorStop(1, "darkgray");
      ctx.fillStyle = innerGrad;
      ctx.fillRect(xpos, ypos, doorWidth, doorHeight); // draw door with chamfer detail gradient

      ctx.clearRect(
        xpos + outerChamferWidth,
        ypos + outerChamferWidth,
        doorWidth - 2 * outerChamferWidth,
        doorHeight - 2 * outerChamferWidth,
      ); // draw clear inside chamfer

      const outerGrad = ctx.createRadialGradient(
        xposDoorCenter,
        yposDoorCenter,
        innerRad,
        xposDoorCenter,
        yposDoorCenter,
        outerRad,
      );
      outerGrad.addColorStop(0, "white");
      outerGrad.addColorStop(1, "darkgray");
      ctx.fillStyle = outerGrad;
      ctx.fillRect(
        xpos + stileRailWidth,
        ypos + stileRailWidth,
        panelWidth,
        panelHeight,
      ); // draw panel with chamfer detail gradient
      ctx.clearRect(
        xpos + stileRailWidth + innerChamferWidth,
        ypos + stileRailWidth + innerChamferWidth,
        panelWidth - 2 * innerChamferWidth,
        panelHeight - 2 * innerChamferWidth,
      ); // draw clear inside panel chamfer

      // draw knobs
      let xposKnobCenter = 0;
      const yposKnobCenter = ypos + doorHeight - stileRailWidth * 0.5;
      const knobRad = stileRailWidth / 4; // arbitrary radius
      if (door.id % 2 == 0) {
        // draw knob in lower right corner of door
        xposKnobCenter = xpos + doorWidth - stileRailWidth * 0.5;
      } else {
        xposKnobCenter = xpos + stileRailWidth * 0.5;
      }
      const knobGrad = ctx.createRadialGradient(
        xposKnobCenter,
        yposKnobCenter,
        0,
        xposKnobCenter,
        yposKnobCenter,
        knobRad,
      );
      knobGrad.addColorStop(0, "white");
      knobGrad.addColorStop(1, "black");
      ctx.fillStyle = knobGrad;
      ctx.beginPath();
      ctx.arc(xposKnobCenter, yposKnobCenter, knobRad, 0, 2 * Math.PI);
      ctx.fill();

      xpos += doorWidth + gap; // move position to account for door width and gap between doors
    });
  }
}

function nearestFraction(decimal) {
  const allowedDenominators = [1, 2, 4, 8, 16];
  let bestNumerator = 0;
  let bestDenominator = 1;
  let minDifference = Infinity;

  for (let denominator of allowedDenominators) {
    let numerator = Math.round(decimal * denominator);
    let fraction = numerator / denominator;
    let difference = Math.abs(fraction - decimal);

    if (difference < minDifference) {
      bestNumerator = numerator;
      bestDenominator = denominator;
      minDifference = difference;
    }
  }

  let wholeNumber = Math.floor(bestNumerator / bestDenominator);
  let remainder = bestNumerator % bestDenominator;

  if (remainder === 0) {
    return `${wholeNumber}`; // Return whole number if no remainder
  }
  if (wholeNumber === 0) {
    return `${remainder}/${bestDenominator}`; // Return fraction only if no whole number part
  }
  return `${wholeNumber} ${remainder}/${bestDenominator}`; // Return mixed number
}

function showWork() {
  // Output calculations
  document.getElementById("calculations").style.display = "block";
}

class Measurement extends Number {
  constructor(num) {
    super(num);
    this.mixed = nearestFraction(num);
  }

  toString() {
    return `${this.mixed}"`;
  }
}
class StileRail {
  constructor(width, length) {
    this.width = new Measurement(width);
    this.length = new Measurement(length);
  }
}

class Panel {
  constructor(height, width, thickness) {
    this.height = new Measurement(height);
    this.width = new Measurement(width);
    this.thickness = new Measurement(thickness);
  }
}

class Door {
  constructor(id, height, width, stile, rail, panel) {
    this.id = id;
    this.height = new Measurement(height);
    this.width = new Measurement(width);
    this.stile = stile;
    this.rail = rail;
    this.panel = panel;
  }
}

class Cabinet {
  constructor(
    openingHeight,
    openingWidth,
    overlay,
    gap,
    numDoors,
    stileRailWidth,
    stileRailThickness,
    panelThickness,
  ) {
    this.openingHeight = new Measurement(openingHeight);
    this.openingWidth = new Measurement(openingWidth);
    this.overlay = new Measurement(overlay);
    this.gap = new Measurement(gap);
    this.numDoors = numDoors;
    this.doors = [];
    this.stileRailWidth = new Measurement(stileRailWidth);
    this.stileRailCount = this.numDoors * 2;
    this.stileRailThickness = new Measurement(stileRailThickness);
    this.panelThickness = new Measurement(panelThickness);

    this.totalHeight = new Measurement(this.openingHeight + 2 * this.overlay);
    this.totalWidth = new Measurement(this.openingWidth + 2 * this.overlay);
    this.doorHeight = this.totalHeight;
    this.doorWidth = new Measurement((this.totalWidth - (this.numDoors - 1) * this.gap) / this.numDoors);

    this.stileHeight = new Measurement(this.doorHeight);
    const stile = new StileRail(this.stileRailWidth, this.stileHeight);
    this.railLength = new Measurement(this.doorWidth - 2 * stileRailWidth + 0.75); // add tenon length
    const rail = new StileRail(this.stileRailWidth, this.railLength);

    const grooveDepth = 0.375; // 3/8"
    this.panelOpeningHeight = new Measurement(this.doorHeight - (2 * this.stileRailWidth));
    this.panelOpeningWidth = new Measurement(this.doorWidth - (2 * this.stileRailWidth));
    this.panelHeight = new Measurement(
      this.doorHeight + 2 * grooveDepth - 2 * this.stileRailWidth,
    );
    this.panelWidth = new Measurement(
      this.doorWidth + 2 * grooveDepth - 2 * this.stileRailWidth,
    );
    const panel = new Panel(
      this.panelHeight,
      this.panelWidth,
      this.panelThickness,
    );

    // build each Door
    for (let i = 0; i < numDoors; i++) {
      let newDoor = new Door(i, this.doorHeight, this.doorWidth, stile, rail, panel);
      this.doors.push(newDoor);
    }
  }

  description() {
    return `The cabinet opening is ${this.openingHeight} H x ${this.openingWidth} W.`;
  }
}

function calculateCutList() {
  const numDoors = parseInt(document.getElementById("numDoors").value);
  const openingWidth = parseFloat(
    document.getElementById("openingWidth").value,
  );
  const openingHeight = parseFloat(
    document.getElementById("openingHeight").value,
  );
  const stileRailWidth = parseFloat(
    document.getElementById("stileRailWidth").value,
  );
  const overlay = parseFloat(document.getElementById("overlay").value);
  const gap =
    numDoors > 1 ? parseFloat(document.getElementById("gap").value) : 0;
  const stileRailThickness = parseFloat(
    document.getElementById("stileRailThickness").value,
  );
  const panelThickness = parseFloat(
    document.getElementById("panelThickness").value,
  );

  const newCabinet = new Cabinet(
    openingHeight,
    openingWidth,
    overlay,
    gap,
    numDoors,
    stileRailWidth,
    stileRailThickness,
    panelThickness,
  );

  const cabinetAttributes = Object.keys(newCabinet);
  for (field of cabinetAttributes) {
    let templateField = document.getElementsByClassName(field);
    for (const element of templateField){
      element.innerHTML = newCabinet[field];
    }
  }

  document.getElementById("results").style.display = "block";
  document.getElementById("cutlist").style.display = "block";
  draw(newCabinet);
}
