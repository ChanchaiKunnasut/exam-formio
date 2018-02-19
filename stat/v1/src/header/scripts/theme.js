/**
 * Maps theme key with an object containing
 * all important data about the theme
 */
var themesMap = {};

themesMap['bluemeanie'] =
{
    path: './ress/css/bluemeanie',
    name: 'Bluemeanie',
    color: '#005aa1'
};

themesMap['cerulean'] =
{
    path: './ress/css/cerulean',
    name: 'Cerulean',
    color: '#033c73'
};

themesMap['constru'] =
{
    path: "./ress/css/constru",
    name: "Constru",
    color: "#153d6e"
};

themesMap['cosmo'] =
{
    path: './ress/css/cosmo',
    name: 'Cosmo',
    color: '#2780e3'
};

themesMap['cyborg'] =
{
    path: './ress/css/cyborg',
    name: 'Cyborg',
    color: '#222222'
};

themesMap['darkly'] =
{
    path: './ress/css/darkly',
    name: 'Darkly',
    color: '#00bc8c'
};

themesMap['flatly'] =
{
    path: './ress/css/flatly',
    name: 'Flatly',
    color: '#18bc9c'
};

themesMap['greenie'] =
{
    path: './ress/css/greenie',
    name: 'Greenie',
    color: '#336666'
};

themesMap['journal'] =
{
    path: './ress/css/journal',
    name: 'Journal',
    color: '#eb6864'
};

themesMap['lumen'] =
{
    path: './ress/css/lumen',
    name: 'Lumen',
    color: '#ffffff'
};

themesMap['paper'] =
{
    path: './ress/css/paper',
    name: 'Paper',
    color: '#2196f3'
};

themesMap['readable'] =
{
    path: './ress/css/readable',
    name: 'Readable',
    color: '#ffffff'
};

themesMap['sandstone'] =
{
    path: './ress/css/sandstone',
    name: 'Sandstone',
    color: '#93c54b'
};

themesMap['simplex'] =
{
    path: './ress/css/simplex',
    name: 'Simplex',
    color: '#d9230f'
};

themesMap['slate'] =
{
    path: './ress/css/slate',
    name: 'Slate',
    color: '#7a8288'
};

themesMap['spacelab'] =
{
    path: './ress/css/spacelab',
    name: 'Spacelab',
    color: '#446e9b'
};

themesMap['superhero'] =
{
    path: './ress/css/superhero',
    name: 'Superhero',
    color: '#df691a'
};

themesMap['united'] =
{
    path: './ress/css/united',
    name: 'United',
    color: '#772953'
};

themesMap['yeti'] =
{
    path: './ress/css/yeti',
    name: 'Yeti',
    color: '#008cba'
};

/**
 * Theme selector model
 */
var themeSelector =
{
    currentTheme: 'cosmo',
    selectedTheme: 'cosmo'
};

function setupTheme(theme) {
    if (themesMap[theme]) {
        themeSelector.selectedTheme = theme;
        themeSelector.currentTheme = theme;
        setupStyle(true);
    }
}

/**
 * Reads style settings (bootswatch theme) from brand.json.js and applies it
 */
function setupStyle(overrideBrandTheme)
{
    var bootswatchStyleDE = document.createElement("link");
    bootswatchStyleDE.id = "bodystyle";
    bootswatchStyleDE.rel = "stylesheet";
    
    // We should show the form after new styles has been loaded to prevent FOUC
    bootswatchStyleDE.onload = showContentOnStyleApply();
    if (!overrideBrandTheme)
    {
        // We should check first if the theme is configured in the form object
        if (typeof formObj !== 'undefined' && formObj !== null && formObj.hasOwnProperty("properties")
            && formObj.properties.hasOwnProperty("bootswatchtheme") && themesMap.hasOwnProperty(formObj.properies["bootswatchtheme"]))
        {
            themeSelector.currentTheme = formObj.properies["bootswatchtheme"];
            themeSelector.selectedTheme = themeSelector.currentTheme;
        }
        else if (typeof brandObj !== 'undefined' && brandObj != null && brandObj.hasOwnProperty("bootswatchtheme")
            && themesMap.hasOwnProperty(brandObj["bootswatchtheme"]))
        {
            themeSelector.currentTheme = brandObj["bootswatchtheme"];
            themeSelector.selectedTheme = themeSelector.currentTheme;
        }
    }
    
    setupThemeMenu();
    
    bootswatchStyleDE.href = themesMap[themeSelector.currentTheme].path + "/bootstrap.min.css";
    var layoutStyleNode = document.getElementById("layoutstyle");
    layoutStyleNode.parentNode.insertBefore(bootswatchStyleDE, layoutStyleNode.nextSibling);
    
    var headerStyleDE = document.createElement("link");
    headerStyleDE.id = "themelayoutstyle";
    headerStyleDE.rel = "stylesheet";
    headerStyleDE.href = themesMap[themeSelector.currentTheme].path + "/layout-override.css";
    layoutStyleNode.parentNode.insertBefore(headerStyleDE, layoutStyleNode.nextSibling);
}

/**
 * Generates theme menu
 */
function setupThemeMenu()
{
    setThemeValue();
    $.each(themesMap, function(code, value)
    {
        var languageItem = '<a id="' +code + '" class="theme-card'
            + (code === themeSelector.currentTheme ? (' selected-theme" title="' + langLayoutObj[languageSelector.currentLanguage]["Selected theme"])
                : ('" title="' + langLayoutObj[languageSelector.currentLanguage]["Apply theme"])) + value.name + '" onclick="selectTheme(\'' + code + '\')">'
            + '<div class="theme-image-wrapper" title="'
            + (code === themeSelector.currentTheme ? (langLayoutObj[languageSelector.currentLanguage]["Selected theme"])
                : (langLayoutObj[languageSelector.currentLanguage]["Apply theme"])) + value.name + '" style="background-color: ' + value.color + '">'
            + '<img class="theme-image"/></div></a>';
        $('#themeList').append(languageItem);
    });
}

/**
 * Changes theme selection in theme menu to themeSelector.selectedTheme
 */
function setThemeSettings()
{
    var oldThemeTitle = $('.selected-theme').attr("title");
    $('.selected-theme').attr("title", langLayoutObj[languageSelector.currentLanguage]["Apply theme"] + oldThemeTitle.substring(langLayoutObj[languageSelector.currentLanguage]["Selected theme"].length));
    $('.selected-theme').find('div').attr("title", langLayoutObj[languageSelector.currentLanguage]["Apply theme"] + oldThemeTitle.substring(langLayoutObj[languageSelector.currentLanguage]["Selected theme"].length));
    $('.selected-theme').removeClass('selected-theme');
    var newThemeTitle = $('#' + themeSelector.selectedTheme).attr("title");
    $('#' + themeSelector.selectedTheme).attr("title", langLayoutObj[languageSelector.currentLanguage]["Selected theme"] + newThemeTitle.substring(langLayoutObj[languageSelector.currentLanguage]["Apply theme"].length));
    $('#' + themeSelector.selectedTheme).find('div').attr("title", langLayoutObj[languageSelector.currentLanguage]["Selected theme"] + newThemeTitle.substring(langLayoutObj[languageSelector.currentLanguage]["Apply theme"].length));
    $('#' + themeSelector.selectedTheme).addClass('selected-theme');
}

/**
 * Sets theme value in the theme manu to themeSelector.currentTheme
 */
function setThemeValue()
{
    $('#themeValue').html('<a tabindex="0" title="' + langLayoutObj[languageSelector.currentLanguage]["Selected theme"] + themesMap[themeSelector.currentTheme].name
        + '"><div class="current-theme-image-wrapper" title="' + langLayoutObj[languageSelector.currentLanguage]["Selected theme"] + themesMap[themeSelector.currentTheme].name
        + '" style="background-color: ' + themesMap[themeSelector.currentTheme].color + '"><img class="current-theme-image"/></div></a><span class="current-theme-setting">'
        + themesMap[themeSelector.currentTheme].name + '</span>');
}

/**
 * Selects chosen theme
 */
function selectTheme(theme)
{
    themeSelector.selectedTheme = theme;
    setThemeSettings();
}

/**
 * Applies currently selected theme
 */
function applyTheme()
{
    $('.content-wrapper').hide();
    themeSelector.currentTheme = themeSelector.selectedTheme;
    setThemeValue();
    document.getElementById('themelayoutstyle').href = themesMap[themeSelector.currentTheme].path + "/layout-override.css";
    document.getElementById('bodystyle').href = themesMap[themeSelector.currentTheme].path + "/bootstrap.min.css";
    
    // We should show the form after new styles has been loaded to prevent FOUC
    document.getElementById('bodystyle').onload = showContentOnStyleApply();
    
    // Update user's property extensions
    if (isUseUserPropertyExtensions() && userPropertyExtensionsAvailable  && isSignedInUser()) {
        updateThemePropertyExtension(themeSelector.currentTheme);
    }
}

/**
 * Clears theme selection
 */
function resetTheme()
{
    themeSelector.selectedTheme = themeSelector.currentTheme;
    setThemeSettings();
}

/**
 * Shows content when bootstrap or bootswatch style is loaded and applied to the content
 */
function showContentOnStyleApply()
{
    // We added btn class to this element and it will have text-align
    // set to center once bootswatch has been rendered
    if ($("#renderIndicator").css("text-align") !== "right" && $("#headerRenderIndicator").css("text-align") === "right")
    {
        $('.header-border').show();
        $('.content-wrapper').show();
    }
    else
    {
        setTimeout(showContentOnStyleApply, 50);
    }
}

/**
 * Translates titles in the theme settings menu
 */
function changeLanguageForThemeSettings(oldLanguage, newLanguage)
{
    setThemeValue();
    $.each(themesMap, function(code, value)
    {
        $('#' + code).attr('title', (code === themeSelector.currentTheme ? langLayoutObj[languageSelector.currentLanguage]["Selected theme"]
            : langLayoutObj[languageSelector.currentLanguage]["Apply theme"]) + value.name);
        $('#' + code).find('.theme-image-wrapper').attr('title', (code === themeSelector.currentTheme ? langLayoutObj[languageSelector.currentLanguage]["Selected theme"]
            : langLayoutObj[languageSelector.currentLanguage]["Apply theme"]) + value.name);
    });
}