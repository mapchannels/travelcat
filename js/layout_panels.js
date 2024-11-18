
// Create Map and Earth (3D Map) panels
fly.m_createPanelClasses = function ()
{
    const MapPanel = class
    {
        constructor()
        {
            this.m_div = null;
            this.m_visible = true;
        };

        m_initialize(p_container)
        {
            this.m_div = document.createElement("div");

            this.m_div.id = "mapDiv";
            this.m_div.style.position = "absolute";
            this.m_div.style.display = "none";

            this.m_div.onmouseover = function () { fly.m_setFocus(fly.MAP); }
            this.m_div.onmouseout = function () { fly.m_setFocus(0); }

            p_container.appendChild(this.m_div);
        };

    };

    const EarthPanel = class
    {
        constructor()
        {
            this.m_div = null;
            this.m_visible = true;
        };

        m_initialize(p_container)
        {
            this.m_div = document.createElement("div");

            this.m_div.id = "earthDiv";
            this.m_div.style.position = "absolute";
            this.m_div.style.display = "none";

            this.m_div.onmouseover = function () { fly.m_setFocus(fly.EARTH); }
            this.m_div.onmouseout = function () { fly.m_setFocus(0); }

            p_container.appendChild(this.m_div);
        };

    };


    this.MapPanel = MapPanel;
    this.EarthPanel = EarthPanel;

    glog("created panel classes ok");
}
