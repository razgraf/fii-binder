/**
 * Created by razvan on 15/08/2017.
 */



/**
 *
 * ----------------------------------------------------------
 *
 * PROJECT CONFIGURATION
 *
 * ----------------------------------------------------------
 *
 */





console.log('%c@VanSoftware - Design & Development - https://www.vansoftware.ro','color:orange; font-weight:bold;');


/**
 *
 * ----------------------------------------------------------
 *
 * REQUEST & RESPONSE
 *
 * ----------------------------------------------------------
 *
 */



/**
 Classic responses
 */
const kResponseOk = 'response-ok';
const kResponseNegative = 'response-negative';
/**
 Variable is already in use
 */
const kResponseEmail = 'response-email';
const kResponseUsername = 'response-username';






const COL_SIZE_MAX_MD = 992;
const COL_SIZE_MAX_SM = 768;


/**
 *
 * ----------------------------------------------------------
 *
 * PATHS
 *
 * ----------------------------------------------------------
 *
 */

const PATH_DEFAULT_PICTURE_PERSON = 'image/icon_human.png';
const PATH_DATA = "data/";
const PATH_DEFAULT_PICTURE = "image/default_pattern.jpg";




/**
 *
 * ----------------------------------------------------------
 *
 * PAGES
 *
 * ----------------------------------------------------------
 *
 */


const PAGE_IDENTIFIER_INDEX = 'credentials';
const PAGE_IDENTIFIER_DASHBOARD = 'dashboard';
const PAGE_IDENTIFIER_HOME = 'home';

/**
 * PRIMARY_PAGES will appear in the left side menu
 */
const PRIMARY_PAGES = [
    {
        name : "Binder",
        identifier : PAGE_IDENTIFIER_HOME,
        icon : "dashboard",
        url : "index.html",
        dummy : true
    }
];



/**
 *
 * ----------------------------------------------------------
 *
 * OTHER UTILS
 *
 * ----------------------------------------------------------
 *
 */




function isMobileSize(){
    return ($(window).width() <= COL_SIZE_MAX_MD);
}
