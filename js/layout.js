
// get size of browser page
fly.m_getWindowSize = function ()
{
    var l_isIE = true;
    if (typeof (window.innerHeight) == "number")
    {
        l_isIE = false;
    }

    if (l_isIE)
    {
        this.m_windowWidth = parseInt(document.documentElement.clientWidth);
        this.m_windowHeight = parseInt(document.documentElement.clientHeight);
    }
    else
    {
        this.m_windowWidth = parseInt(window.innerWidth);
        this.m_windowHeight = parseInt(window.innerHeight);
    }
}

// ressize a div 
fly.m_resizePanel = function (p_panel, p_visible, x, y, wd, ht)
{
    if (p_panel)
    {
        var l_div = p_panel.m_div;

        if (l_div)
        {
            if (x >= 0 && y >= 0)
            {
                l_div.style.left = x + "px";
                l_div.style.top = y + "px";
            }

            if (wd >= 0 && ht >= 0)
            {
                l_div.style.width = wd + "px";
                l_div.style.height = ht + "px";

                l_div.style.display = p_visible ? "block" : "none";
            }
        }

        p_panel.m_height = ht;
    }
}

fly.m_setFocus = function (a)
{
    // one of : MAP or EARTH (or zero if none)
    this.m_focus = a;
}

// create the UI
fly.m_initLayout = function ()
{
    var l_container = eid("flydiv");
    if (!l_container) return;

    l_container.innerHTML = "";         // clear the loading message

    this.m_mapPanel = new fly.MapPanel();
    this.m_earthPanel = new fly.EarthPanel();

    this.m_mapPanel.m_initialize(l_container);
    this.m_earthPanel.m_initialize(l_container);

    this.resizePage();
}

function flyResize()
{
    fly.resizePage();
}

// Whenever window size changes
fly.resizePage = function ()
{
    var l_containerDiv = eid("flydiv");
    if (!l_containerDiv) return;

    this.m_windowWidth = l_containerDiv.clientWidth;
    this.m_windowHeight = l_containerDiv.clientHeight;

    if (!eid("mapDiv"))
    {
        // no map yet
        return;
    }

    var x = Math.floor(this.m_windowWidth / 2);

    // set panel layout
    switch (this.mainMode)
    {
        case fly.DRIVE:
            if (this.m_dualMaps)
            {
                this.m_resizePanel(this.m_mapPanel, true, 0, 0, x, this.m_windowHeight);
                this.m_resizePanel(this.m_earthPanel, true, x, 0, this.m_windowWidth - x, this.m_windowHeight);

                this.m_earthWidth = x;
            }
            else
            {
                this.m_resizePanel(this.m_mapPanel, true, 0, 0, this.m_windowWidth, this.m_windowHeight);
                this.m_resizePanel(this.m_earthPanel, false, x, 0, 0, 0);

                this.m_earthWidth = this.m_windowWidth;
            }
            break;
        default:
            if (this.m_dualMaps)
            {
                this.m_resizePanel(this.m_earthPanel, true, 0, 0, x, this.m_windowHeight);
                this.m_resizePanel(this.m_mapPanel, true, x, 0, this.m_windowWidth - x, this.m_windowHeight);

                this.m_earthWidth = x;
            }
            else
            {
                this.m_resizePanel(this.m_earthPanel, true, 0, 0, this.m_windowWidth, this.m_windowHeight);
                this.m_resizePanel(this.m_mapPanel, false, x, 0, 0, 0);

                this.m_earthWidth = this.m_windowWidth;
            }
            break;
    }

    this.m_earthHeight = this.m_windowHeight;

    // trigger resize events for map and panorama
    if (this.map)
    {
        google.maps.event.trigger(this.map, "resize");
    }
    
};


