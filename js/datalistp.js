/*
* Datalist polyfill - https://github.com/mfranzke/datalist-polyfill
* @license Copyright(c) 2017 by Maximilian Franzke
* Supported by Christian, Johannes, @mitchhentges, @mertenhanisch, @ailintom, @Kravimir, @mischah, @hryamzik, @ottoville, @IceCreamYou, @wlekin, @eddr, @beebee1987 and @mricherzhagen - many thanks for that !
*/
/*
* A minimal and dependency-free vanilla JavaScript datalist polyfill.
* Supports all standard's functionality as well as mimics other browsers behavior.
* Tests for native support of an inputs elements datalist functionality.
* Elsewhere the functionality gets emulated by a select element.
*/
!function(){"use strict";
// Performance: Set local variables
var u=window.document,e=window.navigator.userAgent,
// Feature detection
t="list"in u.createElement("input")&&Boolean(u.createElement("datalist")&&window.HTMLDataListElement),
// IE & EDGE browser detection via UserAgent
// TODO: obviously ugly. But sadly necessary until Microsoft enhances the UX within EDGE (compare to https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/9573654/)
// adapted out of https://gist.github.com/gaboratorium/25f08b76eb82b1e7b91b01a0448f8b1d :
s=Boolean(-1!==e.indexOf("Trident/")||-1!==e.indexOf("Edge/"));
// Let's break here, if it's even already supported ... and not IE11+ or EDGE
if(t&&!s)return;
// .matches polyfill
// TODO: probably needs enhancement on the expected to be supported browsers
Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector);
// Define some global settings and configurations
var d=!1,
// Speaking variables for the different keycodes
p=13,c=27,v=38,y=40,
// Defining the text / value seperator for displaying the value and text values ...
g=" / ",
// ... and defining the different input types that are supported by this polyfill
l=["text","email","number","search","tel","url"],
// Classes for elements
r="polyfilled",f="polyfilling",
// Defining a most likely unique polyfill string
i="###[P0LYFlLLed]###";
// Differentiate for touch interactions, adapted by https://medium.com/@david.gilbertson/the-only-way-to-detect-touch-with-javascript-7791a3346685
window.addEventListener("touchstart",function e(){d=!0,window.removeEventListener("touchstart",e)});
// For observing any changes to the option elements within the datalist elements, define MutationObserver initially
var a=window.MutationObserver||window.WebKitMutationObserver,m;
// Define a new observer
void 0!==a&&(m=new a(function(e){var a=!1;
// Look through all mutations that just occured
if(e.forEach(function(e){
// Look through all added nodes of this mutation
for(var t=0;t<e.addedNodes.length;++t)"datalist"===e.target.tagName.toLowerCase()&&(a=e.target)}),a){var t=u.querySelector('input[list="'+a.id+'"]');""!==t.value&&
// Prepare the options and toggle the visiblity afterwards
T(C(a,t).length,a.getElementsByClassName(f)[0])}}));
// Function regarding the inputs interactions on keyup event
var o=function(e){var t=e.target,a=t.list,i=e.keyCode===v||e.keyCode===y;
// Check for whether the events target was an input and still check for an existing instance of the datalist and polyfilling select
if("input"===t.tagName.toLowerCase()&&null!==a)
// Handling IE11+ & EDGE
if(s)
// On keypress check for value
""===t.value||i||e.keyCode===p||e.keyCode===c||(b(t,a),
// TODO: Check whether this update is necessary depending on the options values
t.focus());else{var n=!1,
// Creating the select if there's no instance so far (e.g. because of that it hasn't been handled or it has been dynamically inserted)
r=a.getElementsByClassName(f)[0]||L(t,a);
// On an ESC or ENTER key press within the input, let's break here and afterwards hide the datalist select, but if the input contains a value or one of the opening keys have been pressed ...
if(e.keyCode!==c&&e.keyCode!==p&&(""!==t.value||i)&&void 0!==r){
// ... prepare the options
0<C(a,t).length&&(n=!0);var o=0,l=r.options.length-1;
// ... preselect best fitting index
d?r.selectedIndex=0:i&&"number"!==t.getAttribute("type")&&(r.selectedIndex=e.keyCode===v?l:0,
// ... and on arrow up or down keys, focus the select
r.focus())}
// Toggle the visibility of the datalist select according to previous checks
T(n,r)}},b=function(a,e){
// Loop through the options
Array.prototype.slice.call(e.options,0).forEach(function(e){var t=e.dataset.originalvalue||e.value;
// In case of that the original value hasn't been saved as data so far, do that now
e.dataset.originalvalue||(e.dataset.originalvalue=t),
// As we'd manipulate the value in the next step, we'd like to put in that value as either a label or text if none of those exist
e.label||e.text||(e.label=t)
/*
			Check for whether the current option is a valid suggestion and replace its value by
				- the current input string, as IE11+ and EDGE don't do substring, but only prefix matching
				- followed by a unique string that should prevent any interferance
				- and the original string, that is still necessary e.g. for sorting within the suggestions list
			As the value is being inserted on users selection, we'll replace that one within the upfollowing inputInputListIE function
			*/,e.value=w(e,a.value)?a.value+i+t.toLowerCase():t})},h=function(e){var t=e.target,a=t.list;if(t.matches("input[list]")&&t.matches("."+r)&&a){
// Query for related option - and escaping the value as doublequotes wouldn't work
var i=a.querySelector('option[value="'+t.value.replace(/\\([\s\S])|(")/g,"\\$1$2")+'"]');i&&i.dataset.originalvalue&&(t.value=i.dataset.originalvalue)}},w=function(e,t){var a=e.value.toLowerCase(),i=t.toLowerCase(),n=e.getAttribute("label"),r=e.text.toLowerCase();
/*
		"Each option element that is a descendant of the datalist element, that is not disabled, and whose value is a string that isn't the empty string, represents a suggestion. Each suggestion has a value and a label."
		"If appropriate, the user agent should use the suggestion's label and value to identify the suggestion to the user."
		*/return Boolean(!1===e.disabled&&(""!==a&&-1!==a.indexOf(i)||n&&-1!==n.toLowerCase().indexOf(i)||""!==r&&-1!==r.indexOf(i)))},E=function(e){
// Check for correct element on this event delegation
if(e.target.matches("input[list]")){var t=e.target,a=t.list;
// Check for whether the events target was an input and still check for an existing instance of the datalist
if("input"===t.tagName.toLowerCase()&&null!==a&&(
// Test for whether this input has already been enhanced by the polyfill
t.matches("."+r)||(
// We'd like to prevent autocomplete on the input datalist field
t.setAttribute("autocomplete","off"),
// WAI ARIA attributes
t.setAttribute("role","textbox"),t.setAttribute("aria-haspopup","true"),t.setAttribute("aria-autocomplete","list"),t.setAttribute("aria-owns",t.getAttribute("list")),
// Bind the keyup event on the related datalists input
"focusin"===e.type?(t.addEventListener("keyup",o),t.addEventListener("focusout",E,!0),s&&t.addEventListener("input",h)):"blur"===e.type&&(t.removeEventListener("keyup",o),t.removeEventListener("focusout",E,!0),s&&t.removeEventListener("input",h)),
// Add class for identifying that this input is even already being polyfilled
t.className+=" "+r),!s))
// Break here for IE11+ & EDGE
{var// Creating the select if there's no instance so far (e.g. because of that it hasn't been handled or it has been dynamically inserted)
i=a.getElementsByClassName(f)[0]||L(t,a),
// Either have the select set to the state to get displayed in case of that it would have been focused or because it's the target on the inputs blur - and check for general existance of any option as suggestions
n=i&&i.querySelector("option:not(:disabled)")&&("focusin"===e.type&&""!==t.value||e.relatedTarget&&e.relatedTarget===i);
// Toggle the visibility of the datalist select according to previous checks
T(n,i)}}};
// On keypress check all options for that as a substring, save the original value as a data-attribute and preset that inputs value (for sorting) for all option values (probably as well enhanced by a token)
// Break here for IE11+ & EDGE
if(
// Binding the focus event - matching the input[list]s happens in the function afterwards
u.addEventListener("focusin",E,!0),!s){
// Function for preparing and sorting the options/suggestions
var C=function(e,n){void 0!==m&&m.disconnect();var// Creating the select if there's no instance so far (e.g. because of that it hasn't been handled or it has been dynamically inserted)
t=e.getElementsByClassName(f)[0]||L(n,e),o=n.value,l=u.createDocumentFragment(),s=u.createDocumentFragment();
// In case of type=email and multiple attribute, we would need to grab the last piece
// Using .getAttribute here for IE9 purpose - elsewhere it wouldn't return the newer HTML5 values correctly
"email"===n.getAttribute("type")&&null!==n.getAttribute("multiple")&&(o=o.substring(o.lastIndexOf(",")+1)),
// Create an array out of the options list
Array.prototype.slice.call(e.querySelectorAll("option:not(:disabled)")).sort(function(e,t){var a=e.value,i=t.value;
// Using the knowledge that the values are URLs to allow the user to omit the scheme part and perform intelligent matching on the domain name
return"url"===n.getAttribute("type")&&(a=a.replace(/(^\w+:|^)\/\//,""),i=i.replace(/(^\w+:|^)\/\//,"")),a.localeCompare(i)}).forEach(function(e){var t=e.value,a=e.getAttribute("label"),i=e.text;
// Put this option into the fragment that is meant to get inserted into the select. Additionally according to the specs ...
// TODO: This might get slightly changed/optimized in a future release
if(w(e,o)){var n=i.substr(0,t.length+g.length),r;
// The innertext should be 'value seperator text' in case they are different
i&&!a&&i!==t&&n!==t+g?e.innerText=t+g+i:e.text||(
// Manipulating the option inner text, that would get displayed
e.innerText=a||t),l.appendChild(e)}else
// ... or put this option that isn't relevant to the users into the fragment that is supposed to get inserted outside of the select
s.appendChild(e)}),
// Input the options fragment into the datalists select
t.appendChild(l);var a=t.options.length;return t.size=10<a?10:a,t.multiple=!d&&a<2,
// Input the unused options as siblings next to the select - and differentiate in between the regular, and the IE9 fix syntax upfront
(e.getElementsByClassName("ie9_fix")[0]||e).appendChild(s),void 0!==m&&m.observe(e,{childList:!0}),t.options},L=function(e,t){
// Check for whether it's of one of the supported input types defined at the beginning
// Using .getAttribute here for IE9 purpose - elsewhere it wouldn't return the newer HTML5 values correctly
// and still check for an existing instance
if(!(e.getAttribute("type")&&-1===l.indexOf(e.getAttribute("type"))||null===t)){var a=e.getClientRects(),
// Measurements
i=window.getComputedStyle(e),n=u.createElement("select");
// Setting a class for easier identifying that select afterwards
// The select should get positioned underneath the input field ...
if(n.setAttribute("class",f),
// Set general styling related definitions
n.style.position="absolute",
// Initially hiding the datalist select
T(!1,n),
// The select itself shouldn't be a possible target for tabbing
n.setAttribute("tabindex","-1"),
// WAI ARIA attributes
n.setAttribute("aria-live","polite"),n.setAttribute("role","listbox"),d||n.setAttribute("aria-multiselectable","false"),"block"===i.getPropertyValue("display"))n.style.marginTop="-"+i.getPropertyValue("margin-bottom");else{var r="rtl"===i.getPropertyValue("direction")?"right":"left";n.style.setProperty("margin-"+r,"-"+(a[0].width+parseFloat(i.getPropertyValue("margin-"+r)))+"px"),n.style.marginTop=parseInt(a[0].height+(e.offsetTop-t.offsetTop),10)+"px"}
// Set the polyfilling selects border-radius equally to the one by the polyfilled input
if(n.style.borderRadius=i.getPropertyValue("border-radius"),n.style.minWidth=a[0].width+"px",d){var o=u.createElement("option");
// ... and it's first entry should contain the localized message to select an entry
o.innerText=t.title,
// ... and disable this option, as it shouldn't get selected by the user
o.disabled=!0,
// ... and assign a dividable class to it
o.setAttribute("class","message"),
// ... and finally insert it into the select
n.appendChild(o)}
// Add select to datalist element ...
return t.appendChild(n),
// ... and our upfollowing functions to the related event
d?n.addEventListener("change",k):n.addEventListener("click",k),n.addEventListener("blur",k),n.addEventListener("keydown",k),n.addEventListener("keypress",A),n}},A=function(e){var t=e.target,a=t.parentNode,i=u.querySelector('input[list="'+a.id+'"]');
// Check for whether the events target was a select or whether the input doesn't exist
"select"===t.tagName.toLowerCase()&&null!==i&&(
// Determine a relevant key - either printable characters (that would have a length of 1) or controlling like Backspace
!e.key||"Backspace"!==e.key&&1!==e.key.length||(i.focus(),"Backspace"===e.key?(i.value=i.value.substr(0,i.value.length-1),
// Dispatch the input event on the related input[list]
x(i)):i.value+=e.key,C(a,i)))},k=function(e){var t=e.currentTarget,a=t.parentNode,i=u.querySelector('input[list="'+a.id+'"]');
// Check for whether the events target was a select or whether the input doesn't exist
if("select"===t.tagName.toLowerCase()&&null!==i){var n=e.type,
// ENTER and ESC
r="keydown"===n&&e.keyCode!==p&&e.keyCode!==c,o;
// On change, click or after pressing ENTER or TAB key, input the selects value into the input on a change within the list
if(("change"===n||"click"===n||"keydown"===n&&(e.keyCode===p||"Tab"===e.key))&&0<t.value.length&&t.value!==a.title)
// In case of type=email and multiple attribute, we need to set up the resulting inputs value differently
i.value=
// Using .getAttribute here for IE9 purpose - elsewhere it wouldn't return the newer HTML5 values correctly
"email"===i.getAttribute("type")&&null!==i.getAttribute("multiple")&&-1<(o=i.value.lastIndexOf(","))?i.value.slice(0,o)+","+t.value:i.value=t.value,
// Dispatch the input event on the related input[list]
x(i),
// Finally focusing the input, as other browser do this as well
"Tab"!==e.key&&i.focus(),
// Set the visibility to false afterwards, as we're done here
r=!1;else"keydown"===n&&e.keyCode===c&&
// In case of the ESC key being pressed, we still want to focus the input[list]
i.focus();
// Toggle the visibility of the datalist select according to previous checks
T(r,t)}},x=function(e){var t;"function"==typeof Event?t=new Event("input",{bubbles:!0}):(t=u.createEvent("Event")).initEvent("input",!0,!1),e.dispatchEvent(t)},T=function(e,t){e?t.removeAttribute("hidden"):t.setAttributeNode(u.createAttribute("hidden")),t.setAttribute("aria-hidden",(!e).toString())},n,N;
// Define function for setting up the polyfilling select
(
// Emulate the two properties regarding the datalist and input elements
// list property / https://developer.mozilla.org/en/docs/Web/API/HTMLInputElement
n=window.HTMLInputElement)&&n.prototype&&void 0===n.prototype.list&&Object.defineProperty(n.prototype,"list",{get:function(){
/*
					According to the specs ...
					"The list IDL attribute must return the current suggestions source element, if any, or null otherwise."
					"If there is no list attribute, or if there is no element with that ID, or if the first element with that ID is not a datalist element, then there is no suggestions source element."
					*/
var e=u.getElementById(this.getAttribute("list"));return"object"==typeof this&&this instanceof n&&e&&e.matches("datalist")?e:null}}),(
// Options property / https://developer.mozilla.org/en/docs/Web/API/HTMLDataListElement
N=window.HTMLElement)&&N.prototype&&void 0===N.prototype.options&&Object.defineProperty(N.prototype,"options",{get:function(){return"object"==typeof this&&this instanceof N?this.getElementsByTagName("option"):null}})}}();
