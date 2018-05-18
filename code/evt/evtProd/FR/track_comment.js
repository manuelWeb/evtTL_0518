// google FONTS
WebFontConfig = {
  google: {
    families: ["Roboto: 900,700,400,300:latin"]
  }
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
  const evtFirst_lnk = document.getElementById("evtFirst_Link");
  try {
    if (evtFirst_lnk) {
      evtFirst_lnk.style.cursor = "pointer";

      const evFst_lnk_obj = evtFirst_lnk.children;

      console.log(typeof evFst_lnk_obj);
      for(var key in evFst_lnk_obj) {

        if (evFst_lnk_obj[key].className == "js-btn gradient-btn-evtfirst" ) {
          // console.log(evFst_lnk_obj[key]);
          const url_bt = evFst_lnk_obj[key].getAttribute("href"),
            track = evFst_lnk_obj[key].getAttribute("onclick");
          
          document.getElementById("globalLink").setAttribute("onclick", track);

          evtFirst_lnk.onclick = function() {
            if (url_bt) document.location = url_bt;
          };
        } 

      }

      // const evtFirst_Link_tab = evtFirst_lnk.children;
      // evtFirst_Link_tabLength = evtFirst_Link_tab.length;
      /*for (let i = 0; i < evtFirst_Link_tabLength; i++) {
        if (evtFirst_Link_tab[i].className == "js-btn gradient-btn-evtfirst") {
          // console.log(evtFirst_Link_tab[i])
          // console.log(evtFirst_lnk)
          const url_bt = evtFirst_Link_tab[i].getAttribute("href"),
            track = evtFirst_Link_tab[i].getAttribute("onclick");
          
          document.getElementById("globalLink").setAttribute("onclick", track);

          evtFirst_lnk.onclick = function() {
            if (url_bt) document.location = url_bt;
          };

        }
      };*/
    }
  } catch (e) {
    if (console) {
      console.log(e);
    }
  }
})();