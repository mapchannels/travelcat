

fly.m_createMapControls = function ()
{
    const ExportControl = class
    {
        constructor(p_controlDiv)
        {
            // Set CSS for the control border.
            this.m_controlUI = document.createElement("div");

            this.m_controlUI.style.display = "block";

            this.m_controlUI.style.backgroundColor = "#ffffff";
            this.m_controlUI.style.border = "2px solid #ffffff";
            this.m_controlUI.style.borderRadius = "3px";
            this.m_controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
            this.m_controlUI.style.cursor = "pointer";
            this.m_controlUI.style.marginTop = "10px";
            this.m_controlUI.style.marginRight = "8px";

            this.m_controlUI.style.textAlign = "center";
            this.m_controlUI.title = "Export";
            p_controlDiv.appendChild(this.m_controlUI);

            // Set CSS for the control interior.
            this.m_controlText = document.createElement("div");
            this.m_controlText.style.color = "rgb(25,25,25)";
            this.m_controlText.style.fontFamily = "Roboto,Arial,sans-serif";
            this.m_controlText.style.fontSize = "18px";
            this.m_controlText.style.lineHeight = "36px";
            this.m_controlText.style.paddingLeft = "20px";
            this.m_controlText.style.paddingRight = "20px";
            this.m_controlText.innerHTML = "Export";
            this.m_controlUI.appendChild(this.m_controlText);

            this.m_controlUI.addEventListener("click", function (a)
            {
                fly.m_exportKML();

            });
        }
    };

    fly.ExportControl = ExportControl;
}



fly.m_initEarthControls = function () 
{
    function MetricsControl(p_controlDiv) 
    {
        // Set CSS for the control border.
        this.m_controlUI = document.createElement("div");

        this.m_controlUI.style.display = "block";
        this.m_controlUI.style.backgroundColor = "transparent";

        p_controlDiv.appendChild(this.m_controlUI);

        // Set CSS for the control interior.
        this.m_controlText = document.createElement("div");
        this.m_controlText.style.color = "yellow";
        this.m_controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        this.m_controlText.style.fontSize = "18px";
        this.m_controlText.style.lineHeight = "20px";
        this.m_controlText.innerHTML = "";
        this.m_controlText.style.textAlign = "right";
        this.m_controlUI.appendChild(this.m_controlText);
    }

    function MessageControl(p_controlDiv) 
    {
        // Set CSS for the control border.
        this.m_controlUI = document.createElement("div");

        this.m_controlUI.style.display = "block";
        this.m_controlUI.style.backgroundColor = "transparent";

        p_controlDiv.appendChild(this.m_controlUI);

        // Set CSS for the control interior.
        this.m_controlText = document.createElement("div");
        this.m_controlText.style.color = "white";
        this.m_controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        this.m_controlText.style.fontSize = "18px";
        this.m_controlText.style.lineHeight = "20px";
        this.m_controlText.innerHTML = "";
        this.m_controlText.style.textAlign = "center";
        this.m_controlUI.appendChild(this.m_controlText);
    }


    function HeadingControl(p_controlDiv) 
    {
        // Set CSS for the control border.
        this.m_controlUI = document.createElement("div");

        this.m_controlUI.style.display = "block";
        this.m_controlUI.style.backgroundColor = "transparent";

        this.m_controlUI.style.textAlign = "center";
        this.m_controlUI.title = "Play";
        p_controlDiv.appendChild(this.m_controlUI);

        // Set CSS for the control interior.
        this.m_controlText = document.createElement("div");
        this.m_controlText.style.color = "white";
        this.m_controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        this.m_controlText.style.fontSize = "18px";
        this.m_controlText.style.lineHeight = "20px";
        this.m_controlText.innerHTML = "";

        this.m_controlUI.appendChild(this.m_controlText);
    }


    function DistanceControl(p_controlDiv) 
    {
        // Set CSS for the control border.
        this.m_controlUI = document.createElement("div");

        this.m_controlUI.style.display = "block";
        this.m_controlUI.style.backgroundColor = "transparent";
        this.m_controlUI.style.marginTop = "16px";

        p_controlDiv.appendChild(this.m_controlUI);

        // Set CSS for the control interior.
        this.m_controlText = document.createElement("div");
        this.m_controlText.style.color = "red";
        this.m_controlText.style.fontFamily = "Roboto,Arial,sans-serif";
        this.m_controlText.style.fontSize = "24px";
        this.m_controlText.style.lineHeight = "26px";
        this.m_controlText.innerHTML = "";
        this.m_controlText.style.textAlign = "left";
        this.m_controlUI.appendChild(this.m_controlText);
    }

    var l_earthDiv = eid("earthDiv");

    // Add 3d map controls : metrics, heading, message
    var l_metricsDiv = document.createElement("div");
    l_metricsDiv.className = "superTitle";
    l_metricsDiv.style.position = "absolute";
    l_metricsDiv.style.right = "4px";
    l_metricsDiv.style.top = "40px";
    l_metricsDiv.style.zIndex = 1999999;

    this.m_metricsControl = new MetricsControl(l_metricsDiv);
    l_earthDiv.append(l_metricsDiv);


    var l_headingDiv = document.createElement("div");
    l_headingDiv.className = "superTitle";
    l_headingDiv.style.position = "absolute";
    l_headingDiv.style.right = "4px";
    l_headingDiv.style.top = "4px";
    l_headingDiv.style.zIndex = 1999999;

    this.m_headingControl = new HeadingControl(l_headingDiv);
    l_earthDiv.append(l_headingDiv);


    var l_messageDiv = document.createElement("div");
    l_messageDiv.className = "superTitle";
    l_messageDiv.style.position = "absolute";
    l_messageDiv.style.left = "4px";
    l_messageDiv.style.top = "4px";
    l_messageDiv.style.zIndex = 1999999;

    this.m_messageControl = new MessageControl(l_messageDiv);
    l_earthDiv.append(l_messageDiv);

    // Add map controls : export button and distanc text
    var l_exportControlDiv = document.createElement("div");
    this.m_exportControl = new fly.ExportControl(l_exportControlDiv, this.map);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(l_exportControlDiv);


    var l_distanceDiv = document.createElement("div");
    l_distanceDiv.className = "superTitle";
    l_distanceDiv.style.position = "absolute";
    l_distanceDiv.style.left = "4px"; // "50%";
    l_distanceDiv.style.top = "4px";
    l_distanceDiv.style.zIndex = 100;

    this.m_distanceControl = new DistanceControl(l_distanceDiv);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(l_distanceDiv);
};

// Update the displayed metrics every animation frame
fly.m_displayMetrics = function ()
{
    if (this.mainMode == fly.INTRO)
    {
        this.m_metricsControl.m_controlText.innerHTML = "";
        this.m_headingControl.m_controlText.innerHTML = "";

        return;
    }

    var l_vehicle = this.m_userVehicle;
    var l_altitude = 0;

    if (l_vehicle)
    {
        l_altitude = parseInt(l_vehicle.pt.altitude);
    }

    var l_metricsText = "";

    if (this.mainMode == fly.JUMP)
    {
        l_metricsText += "Quantum Leap<br/>";
    }
    else if (this.mainMode == fly.DRIVE)
    {
        l_metricsText += "Driving<br/>";
    }
    else if (this.mainMode == fly.FLY)
    {
        l_metricsText += l_altitude + " m<br/>";
        l_metricsText += (Math.round(l_vehicle.speed * 50)) + " km/h";
    }

    if (this.m_animationPaused)
    {
        l_metricsText += " <br/>PAUSED";
    }

    var l_heading = this.m_formatHeading(this.m_earthMap.heading);

    this.m_metricsControl.m_controlText.innerHTML = l_metricsText;
    this.m_headingControl.m_controlText.innerHTML = parseInt(l_heading) + "&deg;";
};

// Show message text for 5 seconds
fly.m_displayMessage = function (message)
{
    this.m_messageControl.m_controlText.innerHTML = message;

    setTimeout(() => { fly.m_messageControl.m_controlText.innerHTML = ""; }, 5000);
};

