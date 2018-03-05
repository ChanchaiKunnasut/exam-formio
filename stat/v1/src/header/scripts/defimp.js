(
    function ()
    {
        var appDef = "../appcnfs/app.json.js";
        
        // Check if we have an URI paramater which specifies
        // a path to the app configuration. If so we'll use it.
        var appRegex = new RegExp("[?&]app(=([^&#]*)|&|#|$)");
        var appDefParam = appRegex.exec(window.location.href);
        if (appDefParam && appDefParam[2])
        {
            var appUriParam = decodeURIComponent(appDefParam[2].replace(/\+/g, " "));
            if (appUriParam === "/")
            {
                appDef = "../appcnfs/app.json.js";
            }
            else
            {
                appDef = "../appcnfs/" + appUriParam + "/app.json.js";
            }
        }
        
        loadScript(appDef, checkAppCofig);
    }
)();

/**
 * Loads script from specified URL by creating a new script element and appending it to the head part of the html.
 * Runs a callback function when the script gets loaded. Runs the errorHandler function if the script fails to load.
 */
function loadScript(url, callback, errorHandler)
{
    var scriptElement = document.createElement("script");
    scriptElement.src = url;
    
    // Bind the event to the callback function.
    // There are several events for cross browser compatibility.
    scriptElement.onreadystatechange = callback;
    scriptElement.onload = callback;
    if (typeof errorHandler === 'undefined')
    {
        scriptElement.onerror = callback;
    }
    else
    {
        scriptElement.onerror = errorHandler;
    }
    
    document.getElementsByTagName('head')[0].appendChild(scriptElement);
}

/**
 * Checks if app config is already defined. If so loads other definitions.
 * Otherwise looks for the app configuration on another hardcoded location.
 */
function checkAppCofig()
{
    var appDefinition = document.getElementById("appdef");
    
    // Check if appObj is defined. If not try with a new hardcoded value
    if (typeof appObj === "undefined")
    {
        loadScript("./defs/app.json.js", loadFormDefinition);
    }
    else
    {
        loadFormDefinition();
    }
}

/**
 * Loads form definition, then loads brand, customization and header definitions
 * and sets up the app once everything is loaded including the document itself.
 */
function loadFormDefinition()
{
    var formDef = "./defs/form.json.js";
    
    // Check if we have an URI paramater which specifies
    // a path to the form definition. If so we'll use it.
    var formRegex = new RegExp("[?&]form(=([^&#]*)|&|#|$)");
    var formDefParam = formRegex.exec(window.location.href);
    var formSet = false;
    if (formDefParam && formDefParam[2])
    {
        var formUriParam = decodeURIComponent(formDefParam[2].replace(/\+/g, " "));
        if (formUriParam === "/")
        {
            formDef = "../forms/form.json.js";
        }
        else if (formUriParam.startsWith("http://") || formUriParam.startsWith("https://"))
        {
            formDef = formUriParam;
        }
        else
        {
            formDef = "../forms/" + formUriParam + "/form.json.js";
        }
        
        formSet = true;
    }
    
    if (typeof appObj !== 'undefined')
    {
        // We have found app.json.js so we will use it to load other definitions
        // If we have form definition already defined in query parameter we will use it
        if (!formSet && appObj["formdefinition"])
        {
            formDef = appObj["formdefinition"];
        }
    }
    
    loadScript(formDef, formObjLoaded, loadDefaultForm);
}

/**
 * Loads brand, customization and header definitions and sets up the app
 * once everything is loaded including the document itself.
 */
function loadConfigurations()
{
    var brandDef;
    var customizationDef;
    var headerConfig;
    
    // Check if we have an URI paramater which specifies
    // a path to the brand definition. If so we'll use it.
    var brandRegex = new RegExp("[?&]brand(=([^&#]*)|&|#|$)")
    var brandDefParam = brandRegex.exec(window.location.href);
    var brandSet = false;
    if (brandDefParam && brandDefParam[2])
    {
        var brandUriParam = decodeURIComponent(brandDefParam[2].replace(/\+/g, " "));
        if (brandUriParam === "/")
        {
            brandDef = "../brands/brand.json.js";
        }
        else
        {
            brandDef = "../brands/" + brandUriParam + "/brand.json.js";
        }
        
        brandSet = true;
    }
    
    // Check if we have an URI paramater which specifies
    // a path to the customization definition. If so we'll use it.
    var cstmzRegex = new RegExp("[?&]cstmz(=([^&#]*)|&|#|$)")
    var cstmzDefParam = cstmzRegex.exec(window.location.href);
    var cstmzSet = false;
    if (cstmzDefParam && cstmzDefParam[2])
    {
        var cstmzUriParam = decodeURIComponent(cstmzDefParam[2].replace(/\+/g, " "));
        if (cstmzUriParam === "/")
        {
            customizationDef = "../cstmzs/customization.json.js";
        }
        else
        {
            customizationDef = "../cstmzs/" + cstmzUriParam + "/customization.json.js";
        }
        
        cstmzSet = true;
    }
            
    // Check if we have an URI paramater which specifies
    // a path to the header configuration. If so we'll use it.
    var hdrcnfRegex = new RegExp("[?&]hdrcnf(=([^&#]*)|&|#|$)")
    var hdrcnfDefParam = hdrcnfRegex.exec(window.location.href);
    var hdrcnfSet = false;
    if (hdrcnfDefParam && hdrcnfDefParam[2])
    {
        var hdrcnfUriParam = decodeURIComponent(hdrcnfDefParam[2].replace(/\+/g, " "));
        if (hdrcnfUriParam === "/")
        {
            headerConfig = "../hdrcnfs/header.json.js";
        }
        else
        {
            headerConfig = "../hdrcnfs/" + hdrcnfUriParam + "/header.json.js";
        }
        
        hdrcnfSet = true;
    }
    
    if (typeof formObj !== 'undefined' && formObj != null && formObj.hasOwnProperty("properties"))
    {
        // We have a form defition loaded so we will use it to get paths for other definition files
        // If we have brand definition already defined in query parameter we will use it
        if (!brandSet && formObj.properties["branddefinition"])
        {
            brandDef = formObj.properties["branddefinition"];
            brandSet = true;
        }
        
        // If we have customization definition already defined in query parameter we will use it
        if (!cstmzSet && formObj.properties["customizationdefinition"])
        {
            customizationDef = formObj.properties["customizationdefinition"];
            cstmzSet = true;
        }
        
        // If we have header definition already defined in query parameter we will use it
        if (!hdrcnfSet && formObj.properties["headerconfiguration"])
        {
            headerConfig = formObj.properties["headerconfiguration"];
            hdrcnfSet = true;
        }
    }
    
    if (typeof appObj !== 'undefined')
    {
        // We have found app.json.js so we will use it to load other definitions
        // If we have brand definition already defined in query parameter or in form definition
        // we will use it. Otherwise we use the value from the app.json.js
        if (!brandSet && appObj["branddefinition"])
        {
            brandDef = appObj["branddefinition"];
        }
        
        // If we have customization definition already defined in query parameter or in form
        // definition we will use it. Otherwise we use the value from the app.json.js
        if (!cstmzSet && appObj["customizationdefinition"])
        {
            customizationDef = appObj["customizationdefinition"];
        }
        
        // If we have header configuration already defined in query parameter or in form definition
        // we will use it. Otherwise we use the value from the app.json.js
        if (!hdrcnfSet && appObj["headerconfiguration"])
        {
            headerConfig = appObj["headerconfiguration"];
        }
    }
    
    if (brandDef)
    {
        loadScript(brandDef, checkForAppSetup, loadDefaultBrand);
    }
    else 
    {
        loadDefaultBrand();
    }
    
    if (customizationDef)
    {
        loadScript(customizationDef, checkForAppSetup, loadDefaultCustomization);
    }
    else
    {
        loadDefaultCustomization();
    }
    
    if (headerConfig)
    {
        loadScript(headerConfig, checkForAppSetup, loadDefaultHeader);
    }
    else
    {
        loadDefaultHeader();
    }
}

function loadDefaultForm()
{
    var formDef = "./defs/form.json.js";
    loadScript(formDef, loadConfigurations);
}

function loadDefaultBrand()
{
    var brandDef = "./defs/brand.json.js";
    loadScript(brandDef, checkForAppSetup);
}

function loadDefaultCustomization()
{
    var customizationDef = "./defs/customization.json.js";
    loadScript(customizationDef, checkForAppSetup);
}

function loadDefaultHeader()
{
    var headerDef = "./defs/header.json.js";
    loadScript(headerDef, checkForAppSetup);
}

/**
 * Callback executed when themes.json.js has been loaded
 */
function themesLoaded() {
    // Update the themesMap to override the hardcoded values
    themesMap = themesObj;
    
    // Check if anything else should be loaded
    checkForAppSetup();
}

/**
 * Callback executed when themes.json.js can't be loaded
 */
function loadDefaultThemes()
{
    // We haven't found themes.json.js so we will use the hardcoded themes list
    // defined in the themesMap global variable. We still need to define the
    // themesObj as a global variable because we check if it is defined in the
    // checkForAppSetup function when we want to know if the themes are initialized
    window.themesObj = themesMap;
    
    // Check if anything else should be loaded
    checkForAppSetup();
}

/**
 * Flag which indicates if the themes definition (themes.json.js) loading has been started
 */
var themeLoadStarted = false;

/**
 * Checks if all definition files has been loaded.
 * If so adds the app setup function as listener for the window load event
 * or runs the app setup if the window load event is already fired.
 */
function checkForAppSetup()
{
    // Check if the themes.json.js should be loaded
    if (!themeLoadStarted && typeof headerObj !== 'undefined' && headerObj != null && typeof formObj !== 'undefined' && formObj != null)
    {
        // If the themes definition path has been specified in the form definition we will use it
        if (formObj.hasOwnProperty("properties") && formObj.properties["themes"])
        {
            loadScript(formObj.properties["themes"], themesLoaded, loadDefaultThemes);
        }
        // Otherwise we use the path from the header configuration
        else if (headerObj["themes"])
        {
            loadScript(headerObj["themes"], themesLoaded, loadDefaultThemes);
        }
        
        themeLoadStarted = true;
    }
    
    if (typeof headerObj !== 'undefined' && typeof customizationObj !== 'undefined' && typeof brandObj !== 'undefined' && typeof formObj !== 'undefined'
        && (typeof themesObj !== 'undefined' || (typeof headerObj !== 'undefined' && headerObj != null && !(headerObj["themes"])
            && typeof formObj !== 'undefined' && formObj != null && (!formObj.hasOwnProperty("properties") || !(formObj.properties["themes"])))))
    {
        if (document.readyState === 'complete')
        {
            setupApp();
        }
        else
        {
            if(window.addEventListener)
            {
                window.addEventListener('load', setupApp);
            }
            else
            {
                window.attachEvent('onload', setupApp);
            }
        }
    }
}

/**
 * Runs when the form definition has been loaded to perform tasks that should be performed immidiately
 * and then starts to load all other definition files.
 */
function formObjLoaded()
{
    if (formObj && formObj.hasOwnProperty("properties") && formObj.properties.hasOwnProperty("formtitle"))
    {
        document.title = formObj.properties.formtitle;
    }
    else
    {
        document.title = "Tog Formviewer";
    }
    
    loadConfigurations();
}