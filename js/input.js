
// set up keyboard handlers
fly.m_initKeyboard = function ()
{
    var l_vehicle = this.m_userVehicle;

    // Keydown event listener
    document.addEventListener('keydown', kbdownFunc);

    // Keyup event listener
    document.addEventListener('keyup', kbupFunc);

    function kbdownFunc(event)
    {
        // console.log(event.code);
        switch (event.code)
        {
            case 'KeyZ':                // accelerate
            case 'KeyW':            
                l_vehicle.changeSpeed(0.1);
                fly.m_accelerate = true;
                break;
            case 'KeyS':                // decelerate
                l_vehicle.changeSpeed(-0.1);
                fly.m_decelerate = true;
                break;
            case 'KeyR':
            case 'ArrowUp':
                fly.m_cameraMode = 2;   // hold for rear view camera
                fly.applyCameraMode();
                break;
            case 'ArrowLeft':
                fly.m_cameraMode = 3;   // hold for left camera
                fly.applyCameraMode();
                break;
            case 'ArrowRight':
                fly.m_cameraMode = 4;   // hold for right camera
                fly.applyCameraMode();
                break;
            case 'ArrowDown':
                fly.m_cameraMode = 5;   // hold for underneath camera 
                fly.applyCameraMode();
                break;

        }
    };

    function kbupFunc(event)
    {
        switch (event.code)
        {
            case 'Space':       // Pause travelling
                if (fly.mainMode == fly.FLY || fly.mainMode == fly.DRIVE)
                {
                    fly.m_animationPaused = !fly.m_animationPaused;
                    fly.m_displayMetrics();
                }
                break;
            case 'KeyZ':    // (Z is for AZERTY keyboards)
            case 'KeyW':    // W is for QWERTY)
                fly.m_accelerate = false;
                break;
            case 'KeyS':
                fly.m_decelerate = false;
                break;
            // TODO - use A and D to roll plane
            case 'KeyA':        // turn left - not really used 
                l_vehicle.m_deltaHeading -= 0.1;
                l_vehicle.m_deltaHeading = Math.max(l_vehicle.m_deltaHeading, -1);
                break;

            case 'KeyD':            // turn right - not really used
                l_vehicle.m_deltaHeading += 0.1;
                l_vehicle.m_deltaHeading = Math.min(l_vehicle.m_deltaHeading, 1);
                break;

            case 'ControlLeft':     // emergency stop
            case 'ControlRight':
                l_vehicle.speed = 0;
                fly.m_accelerate = false;
                break;

            case 'KeyM':        // toggle secondary map
                fly.m_dualMaps = !fly.m_dualMaps;
                fly.resizePage();
                break;

            case 'KeyV':    // select next camera mode                
                fly.m_cameraMode = (fly.m_cameraMode + 1) % 6;
                fly.applyCameraMode();
                break;

            case 'KeyR':
            case 'ArrowUp':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowDown':
                fly.m_cameraMode = 0;   // return to default camera
                fly.applyCameraMode();
                break;

            case 'Escape':      // leave drive mode and return to fly mode
                if (fly.mainMode == fly.DRIVE)
                {
                    fly.m_exitDriveMode();
                }
                break;

            case "KeyH":        // show help / intro dialog
                fly.m_animationPaused = true;
                fly.openModal();
                return false;

            case "KeyQ":        // quantum leap
                fly.applyQuantumLeap();
                break;

            case "KeyL":        // toggle 3d map labels
                fly.m_showLabels = !fly.m_showLabels;
                fly.m_earthMap.defaultLabelsDisabled = !fly.m_showLabels;
                break;

            case "KeyB":        // boat mode
                fly.m_boatMode = !fly.m_boatMode;

                fly.m_hideUnusedDriveModel();
                fly.m_updateDriveModel();
                break;

        };
    }

};

// Set up mouse handler
fly.m_initMouse = function ()
{
    var l_earthDiv = eid("earthDiv");
    var l_vehicle = this.m_userVehicle;


    l_earthDiv.addEventListener("mouseout", function (event)
    {
        // auto-level if the earth map loses focus
        if (fly.mainMode == fly.FLY)
        {
            l_vehicle.m_deltaHeading = 0;
            l_vehicle.m_deltaPitch = 0;
            l_vehicle.m_pitch = 0;
        }
    });


    l_earthDiv.addEventListener("mousemove", function (event)
    {
        // Get the cursor's X and Y coordinates
        let x = event.clientX;
        let y = event.clientY - fly.m_earthY;

        if (fly.m_earthWidth > 0 && fly.mainMode == fly.FLY) 
        {
            l_vehicle.m_deltaHeading = 2 * x / fly.m_earthWidth - 1;
            l_vehicle.m_deltaPitch = 2 * y / fly.m_earthHeight - 1;

            // store the horizontal and vertical changes, to be processed in the animation cycle)
            if (l_vehicle.speed <= 1)
            {
                l_vehicle.m_deltaHeading *= 3;
                l_vehicle.m_deltaPitch *= 3;
            }
            else if (l_vehicle.speed == 2)
            {
                l_vehicle.m_deltaHeading *= 2;
                l_vehicle.m_deltaPitch *= 2;
            }

        }
    });

};

