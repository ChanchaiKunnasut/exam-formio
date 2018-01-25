/**
 * Maps time zone alias with time zone display name in Windows time zone format. This map contains supported time zones for the current user.
 */
var supportedTimeZonesMap = {};

/**
 * Time zone selector model
 */
var timeZoneSelector =
{
    currentTimeZone: 'UTC',
    selectedTimeZone: 'UTC',
    timeZoneInitialized: false,
    supportedTimeZonesSet: false
};

/**
 * Sets time zone when retrieved from Microsoft Graph API
 */
function setInitialTimeZone(timeZone)
{
    timeZoneSelector.currentTimeZone = timeZone;
    timeZoneSelector.selectedTimeZone = timeZone;
    
    // Update GUI components with the time zone information
    if (timeZoneSelector.supportedTimeZonesSet)
    {
        $('#timeZoneName').html(supportedTimeZonesMap[timeZone]);
        $('#tzarr').find('.ltz-itm-selector-check').css('visibility', 'hidden');
        document.getElementById('tzCheck' + timeZone).style.visibility = "visible";
    }
    
    timeZoneSelector.timeZoneInitialized = true;
}

/**
 * Sets time zone choices when retrieved from Microsoft Graph API
 */
function setSupportedTimeZones(values)
{
    if (values && values.length > 0)
    {
        // Add all time zones to our map and update choices in the header menu
        for (var timeZoneIndex = 0; timeZoneIndex < values.length; timeZoneIndex++)
        {
            supportedTimeZonesMap[values[timeZoneIndex]["alias"]] = values[timeZoneIndex]["displayName"];
            var timeZoneItem = '<div class="ltz-itm-container"><button class="ltz-itm-selector" onclick="selectTimeZone(this,\''
                + values[timeZoneIndex]["alias"] + '\')"><span id="tzCheck' + values[timeZoneIndex]["alias"] + '" class="ms-Icon ms-Icon--check ltz-itm-selector-check"'
                + (values[timeZoneIndex]["alias"] === timeZoneSelector.currentTimeZone ? ' style="visibility: visible;"' : 'style="visibility: hidden;"') 
                + '></span><div class="ltz-itm-content"><div class="ltz-itm-wrapper"><span>'
                + values[timeZoneIndex]["displayName"] + '&lrm;</span></div></div></button></div>';
            $('#tzarr').append(timeZoneItem);
        }
        
        timeZoneSelector.supportedTimeZonesSet = true;
        $('#timeZoneWrapper').show();
        
        // If user's time zone is already retrieved we need to update GUI now,
        // because we couldn't do that when we didn't have time zone choices
        if (timeZoneSelector.timeZoneInitialized)
        {
            $('#timeZoneName').html(supportedTimeZonesMap[timeZoneSelector.currentTimeZone]);
            $('#tzarr').find('.ltz-itm-selector-check').css('visibility', 'hidden');
            document.getElementById('tzCheck' + timeZoneSelector.currentTimeZone).style.visibility = "visible";
        }
        
    }
}

/**
 * Updates selected time zone in time zone setting card
 */
function selectTimeZone(timeZoneButton, timeZone)
{
    timeZoneSelector.selectedTimeZone = timeZone;
    $('#timeZoneName').html(supportedTimeZonesMap[timeZone]);
    $('#tzarr').find('.ltz-itm-selector-check').css('visibility', 'hidden');
    $(timeZoneButton).find('.ltz-itm-selector-check').css('visibility', 'visible');
    $('#timeZones').hide();
}

/**
 * Sets selected time zone
 */
function setChosenTimeZone()
{
    var timeZoneChanged = (timeZoneSelector.currentTimeZone === timeZoneSelector.selectedTimeZone);
    timeZoneSelector.currentTimeZone = timeZoneSelector.selectedTimeZone;
    
    return timeZoneChanged;
}

/**
 * Clears time zone selection
 */
function resetTimeZone()
{
    timeZoneSelector.selectedTimeZone = timeZoneSelector.currentTimeZone;
    $('#timeZoneName').html(supportedTimeZonesMap[timeZoneSelector.currentTimeZone]);
}