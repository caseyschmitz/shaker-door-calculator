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
    return `${wholeNumber}`;
  }
  if (wholeNumber === 0) {
    return `${remainder}/${bestDenominator}`;
  }
  return `${wholeNumber} ${remainder}/${bestDenominator}`;
}

function showWork() {
  document.getElementById("calculations").style.display = "block";
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

  const totalWidth = openingWidth + 2 * overlay;
  const doorWidth = (totalWidth - (numDoors - 1) * gap) / numDoors;
  const doorHeight = openingHeight + 2 * overlay;
  const stileHeight = doorHeight;
  const railLength = doorWidth - 2 * stileRailWidth + 0.75;
  const grooveDepth = 0.375;
  const panelWidth = doorWidth + 2 * grooveDepth - 2 * stileRailWidth;
  const panelHeight = doorHeight + 2 * grooveDepth - 2 * stileRailWidth;

  document.getElementById("cutlist").innerHTML = `
      <h2 class="heading-2xl">Cut List</h2>
      <p><strong>Stiles:</strong> ${numDoors * 2} pieces, ${nearestFraction(stileRailWidth)}" x ${nearestFraction(stileHeight)}"</p>
      <p><strong>Rails:</strong> ${numDoors * 2} pieces, ${nearestFraction(stileRailWidth)}" x ${nearestFraction(railLength)}"</p>
      <p><strong>Panels:</strong> ${numDoors} pieces, ${nearestFraction(panelWidth)}" x ${nearestFraction(panelHeight)}"</p>
      <h2 class="heading-2xl">Procedures</h2>
      <h3 class="heading-xl">Step 1: Cut Materials</h3>
      <ol class="disc-list">
          <li>Cut <strong>${numDoors * 2} stiles</strong> to <strong>${nearestFraction(stileRailWidth)}" x ${nearestFraction(stileHeight)}"</strong> from ${nearestFraction(stileRailThickness)}" material.</li>
          <li>Cut <strong>${numDoors * 2} rails</strong> to <strong>${nearestFraction(stileRailWidth)}" x ${nearestFraction(railLength)}"</strong> from ${nearestFraction(stileRailThickness)}" material.</li>
          <li>Cut <strong>${numDoors} panels</strong> to <strong>${nearestFraction(panelWidth)}" x ${nearestFraction(panelHeight)}"</strong> from ${nearestFraction(panelThickness)}" material.</li>
      </ol>
      <h3 class="heading-xl">Step 2: Cut the Joinery</h3>
      <h4 class="heading-xl">Grooves for the Panel</h4>
      <ol class="disc-list">
          <li>Use a <strong>router with a ${nearestFraction(panelThickness)}" slot cutter</strong> or a <strong>table saw with a dado blade</strong> to cut a <strong>${nearestFraction(panelThickness)}" wide groove, 3/8" deep</strong> along the inside edges of all stiles and rails.</li>
          <li>The panel will slide into this groove.</li>
      </ol>
      <h4 class="heading-xl">Tenons on the Rails</h4>
      <ol class="disc-list">
          <li>On the <strong>rails</strong>, cut a <strong>tenon (tongue) ${nearestFraction(panelThickness)}" thick and 3/8" long</strong> on each end to fit into the grooves of the stiles.</li>
          <li>You can do this using a table saw with a dado blade or a router.</li>
      </ol>
      <h3 class="heading-xl">Step 3: Dry Fit the Frame</h3>
      <ol class="disc-list">
          <li>Test fit the <strong>stiles, rails, and panel</strong> to ensure a snug fit.</li>
          <li>The panel should fit into the grooves without forcing.</li>
      </ol>
      <h3 class="heading-xl">Step 4: Assemble the Door</h3>
      <ol class="decimal-list">
          <li>Apply glue to the <strong>tenons of the rails</strong> (avoid getting glue in the panel grooves so the panel can expand/contract).</li>
          <li>Insert the <strong>panel</strong> into the grooves.</li>
          <li>Clamp the frame together and <strong>ensure the door is square</strong> by measuring diagonally.</li>
          <li>Let the glue dry for at least <strong>30 minutes to an hour</strong>.</li>
      </ol>
      <h3 class="heading-xl">Step 5: Sand and Finish</h3>
      <ol class="disc-list">
          <li>Sand the assembled doors smooth.</li>
          <li>Slightly round over or chamfer the edges for a softer look.</li>
          <li>Apply primer and paint or stain and seal.</li>
      </ol>
      <button onclick="showWork()" class="btn">Show Calculations</button>
  `;
  document.getElementById("results").style.display = "block";
  document.getElementById("cutlist").style.display = "block";

  document.getElementById("calculations").innerHTML = `
      <h2 class="heading-2xl">Calculations</h2>
      <p>Each door will have a ${nearestFraction(overlay)}" overlay on all outer edges and a ${nearestFraction(gap)}" gap between them.</p>
      <h3 class="heading-xl">Final Door Dimensions:</h3>
      <p><strong>Total width of both doors: </strong>( ${nearestFraction(openingWidth)}" + ${nearestFraction(overlay)}" + ${nearestFraction(overlay)}" = ${nearestFraction(totalWidth)}" )</p>
      <p><strong>Each door width: </strong>( (${nearestFraction(totalWidth)}" - ${nearestFraction(gap)}") / ${numDoors} = ${nearestFraction(doorWidth)}" )</p>
      <p><strong>Each door height: </strong>( ${nearestFraction(openingHeight)}" + ${nearestFraction(overlay)}" + ${nearestFraction(overlay)}" = ${nearestFraction(doorHeight)}" )</p>
      <hr/>
      <h3 class="heading-xl">Stiles (Vertical Pieces) - ${numDoors * 2} Pieces</h3>
      <p><strong>Width: </strong>${nearestFraction(stileRailWidth)}"</p>
      <p><strong>Length: </strong>${nearestFraction(stileHeight)}"</p>
      <h3 class="heading-xl">Rails (Horizontal Pieces) - ${numDoors * 2} Pieces</h3>
      <p><strong>Width: </strong>${nearestFraction(stileRailWidth)}"</p>
      <p><strong>Length: </strong>${nearestFraction(railLength)}"</p>
      <p><strong>Final Rail Length Calculation:</strong></p>
      <p><strong>Frame opening for the panel: </strong>( ${nearestFraction(doorWidth)}" - (2 × ${nearestFraction(stileRailWidth)}") = ${nearestFraction(doorWidth - 2 * stileRailWidth)}" )</p>
      <p>Each tenon extends 3/8" per end, so we add 3/4" to the rail length:</p>
      <p><strong>Final rail length: </strong>${nearestFraction(railLength)}"</p>
      <h3 class="heading-xl">Panels (Plywood) - ${numDoors} Pieces</h3>
      <p><strong>Width: </strong>${nearestFraction(panelWidth)}"</p>
      <p><strong>Height: </strong>${nearestFraction(panelHeight)}"</p>
      <p><strong>Width Calculation:</strong></p>
      <p>The panel fits into a ${nearestFraction(panelThickness)}" wide x 3/8" deep groove on each stile.</p>
      <p>The visible opening for the panel is ( ${nearestFraction(doorWidth - 2 * stileRailWidth)}" ).</p>
      <p>The panel extends 3/8" into each stile’s groove.</p>
      <p><strong>Final panel width: </strong>( ${nearestFraction(doorWidth - 2 * stileRailWidth)}" + (2 × 3/8") = ${nearestFraction(panelWidth)}" ).</p>
      <p><strong>Height Calculation:</strong></p>
      <p>The visible opening for the panel is ( ${nearestFraction(doorHeight)}" - (2 × ${nearestFraction(stileRailWidth)}") = ${nearestFraction(doorHeight - 2 * stileRailWidth)}" ).</p>
      <p>The panel extends 3/8" into each rail’s groove.</p>
      <p><strong>Final panel height: </strong>( ${nearestFraction(doorHeight - 2 * stileRailWidth)}" + (2 × 3/8") = ${nearestFraction(panelHeight)}" ).</p>
  `;
}
