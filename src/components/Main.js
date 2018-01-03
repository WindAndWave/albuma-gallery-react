require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


var imageData = require('../sources/imageData.json');

imageData = (function getImageUrl(imageDataArr){
  for (var i = 0 ; i< imageDataArr.length ; i++){
     var singleImageData = imageDataArr[i];
     singleImageData.imageUrl= require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
 return imageDataArr;
})(imageData);

class AppComponent extends React.Component {
  render() {
    return (

      <section className="stage">
        <section className="img-sec">
         <nav className="controller-nav">

         </nav>
        </section>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
