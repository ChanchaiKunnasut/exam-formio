(function() {
    var appDefinition = document.getElementById("appdef");
    
    // Check if appObj is defined. If not try with a new hardcoded value
    if (typeof appObj === "undefined")
    {
        var appDSE = document.createElement("script");
        appDSE.src = "./defs/app.json.js";
        appDefinition.parentNode.insertBefore(appDSE, appDefinition.nextSibling);
    }
    
    var defsSE = document.createElement("script");
    defsSE.src = "./scripts/defimp.js";
    appDefinition.parentNode.insertBefore(defsSE, appDefinition.nextSibling);
})();