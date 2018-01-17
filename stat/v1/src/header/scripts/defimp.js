(function() {
    var formDef = "./defs/form.json.js";
    var brandDef;
    var customizationDef;
    var headerConfig;
    
    // Check if we have an URI paramater which specifies
    // a path to the form definition. If so we'll use it.
    var formRegex = new RegExp("[?&]form(=([^&#]*)|&|#|$)")
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
    
    var formDSE = document.createElement("script");
    formDSE.src = formDef;
    var currentNode = document.getElementById("appConfImport");
    currentNode.parentNode.insertBefore(formDSE, currentNode.nextSibling);
    
    if (brandDef)
    {
        var brandDSE = document.createElement("script");
        brandDSE.src = brandDef;
        currentNode.parentNode.insertBefore(brandDSE, currentNode.nextSibling);
    }
    
    if (customizationDef)
    {
        var customizationDSE = document.createElement("script");
        customizationDSE.src = customizationDef;
        currentNode.parentNode.insertBefore(customizationDSE, currentNode.nextSibling);
    }
    
    if (headerConfig)
    {
        var headerCSE = document.createElement("script");
        headerCSE.src = headerConfig;
        currentNode.parentNode.insertBefore(headerCSE, currentNode.nextSibling);
    }
})();