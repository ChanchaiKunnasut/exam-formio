(function() {
    var appDefinition = document.getElementById("appdef");
    
    // Check if appObj is defined. If not try with a new hardcoded value
    if (typeof appObj === "undefined")
    {
        appDefinition.src = "./defs/app.json.js";
    }
    
    var defsSE = document.createElement("script");
    defsSE.src = "./scripts/defimp.js";
    appDefinition.parentNode.insertBefore(defsSE, appDefinition.nextSibling);
})();