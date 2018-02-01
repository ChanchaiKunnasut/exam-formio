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
        loadScript("./defs/app.json.js", loadDefinitions);
    }
    else
    {
        loadDefinitions();
    }
}

/**
 * Loads form, brand, customization and header definitions and sets up the app
 * once everything is loaded including the document itself.
 */
function loadDefinitions()
{
    var formDef = "./defs/form.json.js";
    var brandDef;
    var customizationDef;
    var headerConfig;
    
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
        else
        {
            formDef = "../forms/" + formUriParam + "/form.json.js";
        }
        
        formSet = true;
    }
    
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
    
    if (typeof appObj !== 'undefined')
    {
        // We have found app.json.js so we will use it to load other definitions
        // If we have form definition already defined in query parameter we will use it
        if (!formSet && appObj["formdefinition"])
        {
            formDef = appObj["formdefinition"];
        }
        
        // If we have brand definition already defined in query parameter we will use it
        if (!brandSet && appObj["branddefinition"])
        {
            brandDef = appObj["branddefinition"];
        }
        
        // If we have customization definition already defined in query parameter we will use it
        if (!cstmzSet && appObj["customizationdefinition"])
        {
            customizationDef = appObj["customizationdefinition"];
        }
        
        // If we have header configuration already defined in query parameter we will use it
        if (!hdrcnfSet && appObj["headerconfiguration"])
        {
            headerConfig = appObj["headerconfiguration"];
        }
    }
    
    loadScript(formDef, formObjLoaded, loadDefaultForm);
    
    if (brandDef)
    {
        loadScript(brandDef, checkForAppSetup, loadDefaultBrand);
    }
    
    if (customizationDef)
    {
        loadScript(customizationDef, checkForAppSetup, loadDefaultCustomization);
    }
    
    if (headerConfig)
    {
        loadScript(headerConfig, checkForAppSetup, loadDefaultHeader);
    }
}

function loadDefaultForm()
{
    var formDef = "./defs/form.json.js";
    loadScript(formDef, checkForAppSetup);
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
 * Checks if all definition files has been loaded.
 * If so adds the app setup function as listener for the window load event
 * or runs the app setup if the window load event is already fired.
 */
function checkForAppSetup()
{
    if (typeof headerObj !== 'undefined' && typeof customizationObj !== 'undefined' && typeof brandObj !== 'undefined' && typeof formObj !== 'undefined')
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
 * and then checks if all definition files has been loaded.
 */
function formObjLoaded()
{
    if (formObj && formObj.hasOwnProperty("properties") && formObj.properties.hasOwnProperty("formtitle"))
    {
        document.title = formObj.properties.formtitle;
    }
    else
    {
        document.title = "Layout";
    }
    
    checkForAppSetup();
}