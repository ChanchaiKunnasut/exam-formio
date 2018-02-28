/**
 * Maps language-country abbrevation with language (country) name.
 * The language component follows 2-letter codes as defined in ISO 639-1,
 * and the country component follows 2-letter codes as defined in ISO 3166-1 alpha-2.
 */
var languagesMap = {};
languagesMap['BG-BG'] = 'български (България&nbsp;-&nbsp;BG)';
languagesMap['CS-CZ'] = 'čeština (Česká&nbsp;republika&nbsp;-&nbsp;CZ)';
languagesMap['DE-AT'] = 'Deutsch (Österreich&nbsp;-&nbsp;AT)';
languagesMap['ET-EE'] = 'eesti (Eesti&nbsp;-&nbsp;EE)';
languagesMap['EN-GB'] = 'English (United&nbsp;Kingdom&nbsp;-&nbsp;GB)';
languagesMap['HR-HR'] = 'hrvatski (Hrvatska&nbsp;-&nbsp;HR)';
languagesMap['HU-HU'] = 'magyar (Magyarország&nbsp;-&nbsp;HU)';
languagesMap['KK-KZ'] = 'Қазақ (Қазақстан&nbsp;-&nbsp;KZ)';
languagesMap['LT-LT'] = 'lietuvių (Lietuva&nbsp;-&nbsp;LT)';
languagesMap['PL-PL'] = 'polski (Polska&nbsp;-&nbsp;PL)';
languagesMap['RO-RO'] = 'română (România&nbsp;-&nbsp;RO)';
languagesMap['SR-LATN-CS'] = 'srpski (Srbija&nbsp;-&nbsp;RS)';
languagesMap['RU-RU'] = 'русский (Россия&nbsp;-&nbsp;RU)';
languagesMap['SL-SI'] = 'slovenščina (Slovenija&nbsp;-&nbsp;SI)';
languagesMap['SK-SK'] = 'slovenčina (Slovensko&nbsp;-&nbsp;SK)';
languagesMap['TR-TR'] = 'Türkçe (Türkiye&nbsp;-&nbsp;TR)';
languagesMap['UK-UA'] = 'українська (Україна&nbsp;-&nbsp;UA)';

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
    $('#langarr').find('.ltz-itm-selector-check').css('visibility', 'hidden');
    $("#langCheck" + languageSelector.currentLanguage).css('visibility', 'visible');
}

/**
 * Translates a page to currently set language
 */
function applyTranslation()
{
    var oldLanguage = languageSelector.currentLanguage;
    languageSelector.currentLanguage = languageSelector.selectedLanguage;
    if (typeof phraseAppSelection === 'undefined' || !phraseAppSelection.phraseAppSwitched)
    {
        setLanguage(languageSelector.selectedLanguage);
    }
    
    $("[lang-tran],[lang-tran-placeholder]").translate();
    changeLanguageForThemeSettings(oldLanguage, languageSelector.currentLanguage);
    if (typeof phraseAppSelection !== 'undefined' && phraseAppSelection.phraseAppSwitched)
    {
        $("#divHelp").prepareTranslation();
    }
}

/**
 * Prepares body (form) strings for the Phrase APP in-context editor
 */
function prepareBodyForTranslations()
{
    setLanguage("DEFAULT");
    $("#divHelp").prepareTranslation();
}

/**
 * Resets string after Phrase APP in-context editor has been switched off
 */
function resetBodyTranslation()
{
    setLanguage(languageSelector.currentLanguage);
    $("#divHelp").translate();
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
                // This case may occur when we need to populate help menu with some texts defined in the form
                $this.html(langObj.i18n.resources[languageSelector.selectedLanguage].translation[$this.attr("lang-tran")]);
            }
            
            if ($this.attr("lang-tran-placeholder") !== undefined && langLayoutObj.hasOwnProperty(languageSelector.selectedLanguage)
                && langLayoutObj[languageSelector.selectedLanguage][$this.attr("lang-tran-placeholder")] !== undefined)
            {
                $this.attr("placeholder", langLayoutObj[languageSelector.selectedLanguage][$this.attr("lang-tran-placeholder")]);
            }
        });
    };
}(jQuery));

/**
 * Prepares selected elements for the Phrase APP in-context editor
 */
(function($)
{
    $.fn.prepareTranslation = function()
    {
        return this.each(function()
        {
            $this = $(this);
            if ($this.attr("lang-form") !== undefined)
            {
                $this.html($this.attr("lang-tran"));
            }    
        });
    };
}(jQuery));

/**
 * Translates a page to selected langauge
 */
function setChosenLanguage()
{
    var languageChanged = (languageSelector.selectedLanguage !== languageSelector.currentLanguage);
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