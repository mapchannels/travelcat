/*
 * Travel Cat
 * Copyright (c) 2024 Map Channels (https://www.mapchannels.com)
 * Released on TripGeo (https://tripgeo.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this code except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This notice and the above license must be retained in all derivative works.
 */

// main namespace
var fly = fly || {};

// panel constants
fly.MAP = 1;
fly.EARTH = 2;
fly.STREET = 3;

// mainmode constants
fly.INTRO = 1;
fly.FLY = 2;
fly.DRIVE = 3;
fly.JUMP = 4;

fly.mainMode = fly.INTRO;

fly.m_animationPaused = false;

fly.m_earthY = 0;
fly.m_earthWidth = 0;
fly.m_earthHeight = 0;

fly.m_accelerate = false;
fly.m_decelerate = false;

fly.m_lastStreetViewTime = null;
fly.m_streetViewSearchInProgress = false;
fly.m_streetViewInterval = 2500;
fly.m_groundAltitude = 0;

fly.m_carModel = null;
fly.m_planeModel = null;
fly.m_boatModel = null;
fly.m_carScale = 10;
fly.m_planeScale = 10;
fly.m_boatScale = 10;

// model locations - require CORS to be set
fly.m_carModelURI = "https://s3.tripgeo.com/model/catcar.glb";
fly.m_planeModelURI = "https://s3.tripgeo.com/model/catplane.glb";
fly.m_boatModelURI = "https://s3.tripgeo.com/model/catboat.glb";


fly.m_cameraMode = 0;     
fly.m_dualMaps = true;  
fly.m_showLabels = true;
fly.m_boatMode = false;

fly.m_CameraModeNames = [ "Default", "Virtual Cockpit", "Rear View", "Left View", "Right View", "Below" ];

// Show help dialog
fly.openModal = function ()
{
    fly.overlay.style.display = "block";
    fly.modal.style.display = "block";
}

// Close help dialog
fly.closeModal = function ()
{
    fly.overlay.style.display = "none";
    fly.modal.style.display = "none";

    if (fly.mainMode == fly.INTRO)
    {
        // Start flying!
        fly.m_applyFlyMode();
    }
}

fly.switchTab = function (tabId)
{
    // Remove active class from all tabs
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // Add active class to clicked tab and content
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

fly.initModal = function ()
{
    this.overlay = eid("overlay");
    this.modal = eid("modal");

    this.closeBtn = document.querySelector('.close-btn');
    this.overlay.addEventListener('click', fly.closeModal);

    this.openModal();
}

fly.setMainMode = function (m)
{
    this.mainMode = m;
}

// Start up
fly.Initialize = async function (apikey, lat, lng, alt, hdg)
{
    this.m_initialLat = parseFloat(lat);
    this.m_initialLng = parseFloat(lng);
    this.m_initialAltitude = parseFloat(alt);
    this.m_initialHeading = parseFloat(hdg);

    await this.m_loadGoogleMapsAPI(apikey);

    this.m_createPanelClasses();
    this.m_initLayout();

    this.m_initMap();
    this.m_initStreetView();

    this.CreateTrackClass();

    this.m_track = new fly.Track(this.map);

    await this.m_initEarthMap();
    this.m_createMapControls();
    this.m_initEarthControls();


    this.m_createVehicleClass();
    this.m_initVehicle();

    this.m_initPlaneModel();
    this.m_initCarModel();
    this.m_initBoatModel();

    // show intro/help dialog
    this.initModal();

    this.m_initKeyboard();
    this.m_initMouse();

    window.onresize = flyResize;
    this.resizePage();

    this.m_displayMetrics();
    this.startAnimation();
}


fly.m_loadGoogleMapsAPI = function (p_apiKey)
{
    return new Promise((resolve, reject) =>
    {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?v=alpha&loading=async&libraries=maps3d,places,geometry,marker&callback=initGoogleMaps";
        script.src += "&key=" + p_apiKey;
        script.async = true;
        script.defer = true;
        window.initGoogleMaps = () =>
        {
            resolve();
        };
        script.onerror = (error) =>
        {
            reject(error);
        };
        document.head.appendChild(script);
    });
};
