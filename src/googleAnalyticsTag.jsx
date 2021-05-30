import React from "react";
import PropTypes from "prop-types";

function createMarkup(googleId) {
  return {
    __html: `
<script async src="https://www.googletagmanager.com/gtag/js?id=${googleId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleId}');
</script>
`,
  };
}

const GoogleTag = ({ googleId }) => (
  <div dangerouslySetInnerHTML={createMarkup(googleId)} />
);

GoogleTag.propTypes = {
  googleId: PropTypes.string.isRequired,
};
export default GoogleTag;
