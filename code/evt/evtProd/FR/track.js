// google FONTS
WebFontConfig = {
  google: {families: ["Roboto: 900,700,400,300,100:latin"] }
};
(function() {
  var wf = document.createElement("script");
  wf.src = ("https:" == document.location.protocol ? "https" : "http") +
    "://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";
  wf.type = "text/javascript";
  wf.async = "true";
  var t = document.getElementsByTagName("script")[0];
  t.parentNode.insertBefore(wf, t)
})();

// lien global sur evtFirst_Link
(function() {
  try {
    const evtFirst_lnk = document.getElementById("evtFirst_Link");
    if (evtFirst_lnk) {

      evtFirst_lnk.style.cursor = "pointer";
      const evFst_lnk_obj = evtFirst_lnk.children;

      for(let key in evFst_lnk_obj) {
        // console.log(evFst_lnk_obj.hasOwnProperty('globalLink'))
        if (evFst_lnk_obj[key].className === "js-btn gradient-btn-evtfirst" ) {
          // console.log(evFst_lnk_obj[key].href)
          const url_bt = evFst_lnk_obj[key].href,
                 track = evFst_lnk_obj[key].getAttribute("onclick");
          
          document.getElementById("globalLink").setAttribute("onclick", track);

          evtFirst_lnk.onclick = function() {
            if (url_bt) document.location = url_bt;
          }
        }

      }

    }
  } catch (e) {if (console) { console.log(e) };}
})();