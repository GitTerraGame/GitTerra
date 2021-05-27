import React from "react";

const GoogleTag = (
< !--Global site tag(gtag.js) - Google Analytics-- >
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TTFNRWRVFB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TTFNRWRVFB');
</script>
);
export default GoogleTag;