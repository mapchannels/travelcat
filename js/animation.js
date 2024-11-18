
fly.startAnimation = function ()
{
    glog("start animation cycle");

    setTimeout("fly.animationCycle()", 50);

    this.m_animationCycleCount = 0;
}

fly.animationCycle = function ()
{
    // glog("animation cycle " + this.m_animationCycleCount + ", main mode = " + this.mainMode + ", paused = " + this.m_animationPaused);
    var l_vehicle = this.m_userVehicle;

    // Get the current time in milliseconds
    var currentTime = Date.now();

    if (!this.m_animationPaused && !this.m_streetViewSearchInProgress)
    {
        switch (this.mainMode)
        {
            case fly.DRIVE:
                if (!this.m_lastStreetViewTime || currentTime - this.m_lastStreetViewTime >= this.m_streetViewInterval)
                {
                    // Update last animation time
                    this.m_lastStreetViewTime = currentTime;

                    fly.m_findNextStreetView();
                }
                break;

            case fly.FLY:
                // apply acceleration / deceleration
                if (this.m_accelerate)
                {
                    l_vehicle.changeSpeed(0.1);
                }
                else if (this.m_decelerate)
                {
                    l_vehicle.changeSpeed(-0.1);
                }

                l_vehicle.positionUpdate();

                // apply appropriate zoom level for speed
                if (this.m_focus != fly.MAP)
                {
                    var z = fly.m_getZoomLevelForSpeed(l_vehicle.speed);
                    this.map.setZoom(z);

                }  

                // extend the track 
                if (this.m_animationCycleCount % 5 == 0)
                {
                    var l_earthCentre = this.m_earthMap.center;
                    this.m_track.addPoint(l_earthCentre.lat, l_earthCentre.lng);
                }

                break;
            
        }
    }

    this.m_displayMetrics();

    this.m_animationCycleCount++;

    // Repeat animation cycle every 20ms
    setTimeout(() => this.animationCycle(), 20);
}
