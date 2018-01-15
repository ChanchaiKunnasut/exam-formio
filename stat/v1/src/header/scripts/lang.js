/**
 * Maps language-country abbrevation with language (country) name.
 * The language component follows 2-letter codes as defined in ISO 639-1,
 * and the country component follows 2-letter codes as defined in ISO 3166-1 alpha-2.
 */
var languagesMap = {};
languagesMap['BG-BG'] = 'български (България)';
languagesMap['CS-CZ'] = 'čeština (Česká&nbsp;republika)';
languagesMap['DE-AT'] = 'Deutsch (Österreich)';
languagesMap['ET-EE'] = 'eesti (Eesti)';
languagesMap['EN-GB'] = 'English (International)';
languagesMap['HR-HR'] = 'hrvatski (Hrvatska)';
languagesMap['HU-HU'] = 'magyar (Magyarország)';
languagesMap['KK-KZ'] = 'Қазақ (Қазақстан)';
languagesMap['LT-LT'] = 'lietuvių (Lietuva)';
languagesMap['PL-PL'] = 'polski (Polska)';
languagesMap['RO-RO'] = 'română (România)';
languagesMap['SR-LATN-CS'] = 'srpski (Srbija)';
languagesMap['RU-RU'] = 'русский (Россия)';
languagesMap['SL-SI'] = 'slovenščina (Slovenija)';
languagesMap['SK-SK'] = 'slovenčina (Slovenská&nbsp;republika)';
languagesMap['TR-TR'] = 'Türkçe (Türkiye)';
languagesMap['UK-UA'] = 'українська (Україна)';

/**
 * Language selector model
 */
var languageSelector =
{
    currentLanguage: 'EN-GB',
    selectedLanguage: 'EN-GB'
};

function setupLanguageMenu()
{
    setLanguageSettings(languageSelector.currentLanguage);
    $.each(languagesMap, function(code, name)
    {
        var languageItem = '<div class="ltz-itm-container"><button class="ltz-itm-selector" onclick="selectLanguage(this,\''
            + code + '\')"><span id="langCheck' + code + '" class="ms-Icon ms-Icon--check ltz-itm-selector-check"'
            + (code === languageSelector.currentLanguage ? ' style="visibility: visible;"' : '') 
            + '></span><div class="ltz-itm-content"><div class="ltz-itm-wrapper"><span>'
            + name + '&lrm;</span></div></div></button></div>';
        $('#langarr').append(languageItem);
    });
}

/**
 * Sets a language setting to a new value
 */
function setLanguageSettings(lang)
{
    $('#languageName1').html(languagesMap[lang]);
    $('#languageName2').html(languagesMap[lang]);
}

/**
 * Updates selected language in language setting card
 */
function selectLanguage(languageButton, lang)
{
    languageSelector.selectedLanguage = lang;
    setLanguageSettings(lang);
    $('#langarr').find('.ltz-itm-selector-check').css('visibility', 'hidden');
    $(languageButton).find('.ltz-itm-selector-check').css('visibility', 'visible');
    $('#languages').hide();
}

/**
 * Updates current user language settings and translates the page
 * Should be used when setting a language based on received data from an API call
 * Shouldn't be used when setting a language from the GUI
 */
function setupPredefinedLanguage()
{
    applyTranslation();
    setLanguageSettings(languageSelector.currentLanguage);
    $(".ltz-itm-selector-check").css('visibility', 'hidden');
    $("#langCheck" + languageSelector.currentLanguage).css('visibility', 'visible');
}

/**
 * Translates a page to currently set language
 */
function applyTranslation()
{
    var oldLanguage = languageSelector.currentLanguage;
    languageSelector.currentLanguage = languageSelector.selectedLanguage;
    setLanguage(languageSelector.selectedLanguage);
    $("[lang-tran]").translate();
    changeLanguageForThemeSettings(oldLanguage, languageSelector.currentLanguage);
}

/**
 * Applies translation to selected elements
 */
(function($)
{
    $.fn.translate = function()
    {
        return this.each(function()
        {
            $this = $(this);
            if ($this.attr("lang-tran") !== undefined && langLayoutObj.hasOwnProperty(languageSelector.selectedLanguage)
                && langLayoutObj[languageSelector.selectedLanguage][$this.attr("lang-tran")] !== undefined)
            {
                $this.html(langLayoutObj[languageSelector.selectedLanguage][$this.attr("lang-tran")]);
            } else if ($this.attr("lang-tran") !== undefined && langObj.i18n.resources.hasOwnProperty(languageSelector.selectedLanguage)
                && langObj.i18n.resources[languageSelector.selectedLanguage].translation[$this.attr("lang-tran")] !== undefined)
            {
                $this.html(langObj.i18n.resources[languageSelector.selectedLanguage].translation[$this.attr("lang-tran")]);
            }
        });
    };
}(jQuery));

/**
 * Translates a page to selected langauge
 */
function setChosenLanguage()
{
    var languageChanged = (languageSelector.selectedLanguage === languageSelector.currentLanguage);
    applyTranslation();
    
    return languageChanged;
}

/**
 * Clears language selection
 */
function resetLanguage()
{
    languageSelector.selectedLanguage = languageSelector.currentLanguage;
    setLanguageSettings(languageSelector.currentLanguage);
}

/**
 * Converts locale received from MS graph API to supported locales in our app
 */
function convertGraphLanguage(graphLanguage)
{
    var languageUC = graphLanguage.toUpperCase();
    if (languagesMap.hasOwnProperty(languageUC))
    {
        return languageUC;
    }
    
    switch (languageUC)
    {
        case "DE-CH":
        case "DE-DE":
        case "DE-LI":
        case "DE-LU":
            return "DE-AT";
        case "HR-BA":
            return "HR-HR";
        case "RO-MD":
            return "RO-RO";
        case "SR-CYRL-CS":
        case "SR-CYRL-BA":
            return "SR-LATN-CS";
        default:
            return "EN-GB";
    }
}