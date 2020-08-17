var scroll = false;
function initLCD() {
        // Initialzing gauge


        single1 = new steelseries.DisplaySingle('canvasSingleVolt', {
                            width: 120,
                            height: 50,
                            unitString: 'V',
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: 'Voltage'
                            });
        singleW = new steelseries.DisplaySingle('canvasSingleWatt', {
                            width: 120,
                            height: 50,
                            unitString: 'W',
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: 'Power'
                            });
        singleEnergy = new steelseries.DisplaySingle('canvasSingleEnergy', {
                            width: 150,
                            height: 50,
                            unitString: 'kWh',
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: 'Energy'
                            });
        singleAmp = new steelseries.DisplaySingle('canvasSingleAmp', {
                            width: 120,
                            height: 50,
                            unitString: 'A',
                            unitStringVisible: true,
                            headerStringVisible: true,
                            headerString: 'Current'
                            });
        single1.setLcdColor(steelseries.LcdColor.STANDARD);
        singleW.setLcdColor(steelseries.LcdColor.STANDARD);
        singleEnergy.setLcdColor(steelseries.LcdColor.STANDARD);
        singleAmp.setLcdColor(steelseries.LcdColor.STANDARD);

        // Start the random update
        //setInterval(function(){ setRandomValue(single1, 100); setRandomValue(singleW, 100); setRandomValue(singleEnergy, 100);setRandomValue(singleAmp, 100); }, 1500);
   }

function setLastValue(gauge, value) {
        gauge.setValue(value);
}
