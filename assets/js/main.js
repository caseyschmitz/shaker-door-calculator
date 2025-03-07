function draw(cabinet = new Cabinet()) {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    canvas.style.width = "100%";
    canvas.style.height = "30* 590 /rem";
    canvas.width = canvas.offsetWidth;

    let faceframeDim;
    if (cabinet.unit == "imperial"){
      faceframeDim = 2; // arbitrary 2in face frame
    } else {
      faceframeDim = 4; // arbitrary 4cm face frame
    }
    const boxWidth = 2 * faceframeDim + cabinet.openingWidth;
    const boxHeight = 2 * faceframeDim + cabinet.openingHeight;

    const norm_factor = ctx.canvas.width / boxWidth; // normalize measurements

    canvas.height = boxHeight * norm_factor; // set canvas height based on norm_factor
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const gap = cabinet.gap * norm_factor;
    const stileRailWidth = cabinet.stileRailWidth * norm_factor;

    let outerChamferWidth, innerChamferWidth;
    if (cabinet.unit == "imperial") {
      outerChamferWidth = 0.5 * norm_factor; // arbitrary 1/2" chamfer detail
      innerChamferWidth = 0.25 * norm_factor; // arbitrary 1/4" chamfer detail
  
    } else {
      outerChamferWidth = 1.3 * norm_factor; // arbitrary 1/2" chamfer detail
      innerChamferWidth = 0.6 * norm_factor; // arbitrary 1/4" chamfer detail
    }

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
      let knobRad;
      if (cabinet.unit == "imperial") {
        knobRad = 0.5 * norm_factor; // arbitrary 1in knobs
      } else {
        knobRad = 1.3 * norm_factor; // arbitrary 2.6cm knobs
      }
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
  constructor(unit, num) {
    super(num);
    this.unit = unit;
    if (this.unit == "imperial") {
      this.value = nearestFraction(num);
    } else {
      this.value = Math.round(num * 10) / 10;
    }
  }

  toString() {
    if (this.unit == "imperial") {
      return `${this.value}"`;
    } else {
      return `${this.value} cm`
    }
  }
}
class StileRail {
  constructor(unit, width, length) {
    this.unit = unit;
    this.width = new Measurement(this.unit, width);
    this.length = new Measurement(this.unit, length);
  }
}

class Panel {
  constructor(unit, height, width, thickness) {
    this.unit = unit;
    this.height = new Measurement(this.unit, height);
    this.width = new Measurement(this.unit, width);
    this.thickness = new Measurement(this.unit, thickness);
  }
}

class Door {
  constructor(id, unit, height, width, stile, rail, panel) {
    this.id = id;
    this.unit = unit;
    this.height = new Measurement(this.unit, height);
    this.width = new Measurement(this.unit, width);
    this.stile = stile;
    this.rail = rail;
    this.panel = panel;
  }
}

class Cabinet {
  constructor(
    unit,
    openingHeight,
    openingWidth,
    overlay,
    gap,
    numDoors,
    stileRailWidth,
    stileRailThickness,
    panelThickness,
  ) {
    this.unit = unit;
    this.openingHeight = new Measurement(this.unit, openingHeight);
    this.openingWidth = new Measurement(this.unit, openingWidth);
    this.overlay = new Measurement(this.unit, overlay);
    this.gap = new Measurement(this.unit, gap);
    this.numDoors = numDoors;
    this.doors = [];
    this.stileRailWidth = new Measurement(this.unit, stileRailWidth);
    this.stileRailCount = this.numDoors * 2;
    this.stileRailThickness = new Measurement(this.unit, stileRailThickness);
    this.panelThickness = new Measurement(this.unit, panelThickness);

    this.totalHeight = new Measurement(this.unit, this.openingHeight + 2 * this.overlay);
    this.totalWidth = new Measurement(this.unit, this.openingWidth + 2 * this.overlay);
    this.doorHeight = this.totalHeight;
    this.doorWidth = new Measurement(this.unit, (this.totalWidth - (this.numDoors - 1) * this.gap) / this.numDoors);

    if (this.unit == 'imperial') {
      this.tenonLength = new Measurement(this.unit, 0.375);
      this.grooveDepth = new Measurement(this.unit, 0.375);
    } else {
      this.tenonLength = new Measurement(this.unit, 1);
      this.grooveDepth = new Measurement(this.unit, 1);
    }

    this.stileHeight = new Measurement(this.unit, this.doorHeight);
    const stile = new StileRail(this.unit, this.stileRailWidth, this.stileHeight);
    this.railLength = new Measurement(this.unit, this.doorWidth - (2 * stileRailWidth) + (2 * this.tenonLength)); // add tenon length
    const rail = new StileRail(this.unit, this.stileRailWidth, this.railLength);

    this.panelOpeningHeight = new Measurement(this.unit, this.doorHeight - (2 * this.stileRailWidth));
    this.panelOpeningWidth = new Measurement(this.unit, this.doorWidth - (2 * this.stileRailWidth));
    this.panelHeight = new Measurement(this.unit, 
      this.doorHeight + 2 * this.grooveDepth - 2 * this.stileRailWidth,
    );
    this.panelWidth = new Measurement(this.unit, 
      this.doorWidth + 2 * this.grooveDepth - 2 * this.stileRailWidth,
    );
    const panel = new Panel(
      this.unit,
      this.panelHeight,
      this.panelWidth,
      this.panelThickness,
    );

    // build each Door
    for (let i = 0; i < numDoors; i++) {
      let newDoor = new Door(i, this.unit, this.doorHeight, this.doorWidth, stile, rail, panel);
      this.doors.push(newDoor);
    }
  }

  description() {
    return `The cabinet opening is ${this.openingHeight} H x ${this.openingWidth} W.`;
  }
}

function calculateCutList() {
  const unit = document.getElementById("unit").value;
  let form;
  if (unit == "imperial"){
    form = document.getElementById("imperialForm").children;
  } else {
    form = document.getElementById("metricForm").children;
  }

  const numDoors = parseInt(form.namedItem("numDoors").value);
  const openingWidth = parseFloat(form.namedItem('openingWidth').value);
  const openingHeight = parseFloat(form.namedItem("openingHeight").value);
  const stileRailWidth = parseFloat(form.namedItem("stileRailWidth").value);
  const overlay = parseFloat(form.namedItem("overlay").value);
  const gap = numDoors > 1 ? parseFloat(form.namedItem("gap").value) : 0;
  const stileRailThickness = parseFloat(form.namedItem("stileRailThickness").value);
  const panelThickness = parseFloat(form.namedItem("panelThickness").value);

  const newCabinet = new Cabinet(
    unit,
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

function initUnit(){
  const unit = document.getElementById("unit").value;
  console.log(unit);
  if (unit == "imperial"){
    document.getElementById("metricForm").style.display = "none";
    document.getElementById("imperialForm").style.display = "block";
  } else {
    document.getElementById("imperialForm").style.display = "none";
    document.getElementById("metricForm").style.display = "block";
  }
}
