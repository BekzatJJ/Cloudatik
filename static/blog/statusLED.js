function setLED(led, on){
    led1 = new steelseries.Led(led, {
                            width: 25,
                            height: 25
                                });
    if(on){
        led1.setLedColor(steelseries.LedColor.GREEN_LED);
    }else{
        led1.setLedColor(steelseries.LedColor.RED_LED);
    }

                led1.setLedOnOff(on);

}
