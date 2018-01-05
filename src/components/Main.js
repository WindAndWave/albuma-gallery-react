require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


var imageData = require('../sources/imageData.json');

imageData = (function getImageUrl(imageDataArr){
  for (var i = 0 ; i< imageDataArr.length ; i++){
     var singleImageData = imageDataArr[i];
     singleImageData.imageUrl= require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
 return imageDataArr;
})(imageData);
 function getRangeRandom(low,high){
  return  Math.ceil(Math.random() * (high - low))+ low;

 }
class ImgFigure extends React.Component {
  render() {
    var styleObj = {};
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    return (
        <figure className="img-figure" style = {styleObj}>
          <img src={ this.props.data.imageUrl}
              alt={ this.props.data.title}
               style={{width:"240px",height:"240px"}}
          />
          <figcaption>
          <h2 className="img-title">
            {this.props.data.title}
          </h2>
          </figcaption>
        </figure>

    );
  }
}



class AppComponent extends React.Component {

  rearrange  (centerindex){
     var imgsArrangeArr = this.state.imgsArrangeArr,
       Constant = this.Constant,
       centerPos = Constant.centerPos,
       hPosRange = Constant.hposRange,
       vPosRange = Constant.vposRange,
       hPosRangeleftSecX = hPosRange.leftSecX,
       hPosRangeRightSecX  = hPosRange.rightSecX,
       hPosRangeY = hPosRange.y,
       vPosRangeTopY = vPosRange.topY,
       vPosRangeX = vPosRange.x,

       imgsArrangeTopArr = [] ,
       topImgNum = Math.ceil(Math.random() * 2),
       topImgSpliceIndex = 0,
       imgsArrangeCenterArr = imgsArrangeArr.slice(centerindex,1);


       imgsArrangeCenterArr[0].pos=centerPos;
       topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length - topImgNum))
       imgsArrangeTopArr = imgsArrangeArr.slice(topImgSpliceIndex,topImgNum);

       imgsArrangeTopArr.forEach(function(value,index){
         imgsArrangeTopArr[index].pos = {
           top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
           left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
         }

       });
       for(var i = 0 ,j = imgsArrangeArr.length , k = j / 2 ; i < j ; i++){
       var hPosRangeLORX = null ;
         if(i < k ){
            hPosRangeLORX = hPosRangeleftSecX;
         }else {
           hPosRangeLORX = hPosRangeRightSecX;
         }
         imgsArrangeArr[i].pos = {
           top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
           left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
         }
      }
      if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
         imgsArrangeArr.slice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.slice(centerindex,0,imgsArrangeCenterArr[0]);
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }

  constructor(props){
    super(props);
    this.Constant={
      centerPos:{
        left:0,
          right:0
      },
      hposRange:{
        leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
      },
      vposRange:{
        x:[0,0],
          topY:[0,0]

      }

    }
    this.state={
      imgsArrangeArr:[
        {
          pos:{
            left:'0',
            top:'0'
          }
        }

      ]
    }

  }

  componentDidMount (){
   var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
     stageW = stageDOM.scrollWidth,
     stageH = stageDOM.scrollHeight,
     halfStageW = Math.ceil(stageW / 2),
     halfStageH = Math.ceil(stageH / 2);
    var imgFigureDom = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfimgW = Math.ceil(stageW / 2),
      halfimgH = Math.ceil(stageH / 2);

    this.Constant.centerPos = {
      left : halfStageW - halfimgW,
      top: halfStageH - halfimgH
    }
    this.Constant.hposRange.leftSecX[0] = -halfimgW;
    this.Constant.hposRange.leftSecX[1] = halfStageW - halfimgW * 3;
    this.Constant.hposRange.rightSecX[0] = halfStageW - halfimgW;
    this.Constant.hposRange.rightSecX[1] = stageW - halfimgW;
    this.Constant.hposRange.y[0] = - halfimgH;
    this.Constant.hposRange.y[1] = stageH - halfimgH;

    this.Constant.vposRange.topY[0] = -halfimgH;
    this.Constant.vposRange.topY[1] = halfStageH -halfimgH * 3;
    this.Constant.vposRange.x[0] =halfimgW - imgW;
    this.Constant.vposRange.x[1] = halfimgW;
    this.rearrange(0);
  }
  render() {
    var controlerUnits = [],
      imgUnits = [];
    imageData.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          }
        }

      }
       imgUnits.push(<ImgFigure data = {value} ref = {'imgFigure'+index} key={'imgFigures'+index} arrange = {this.state.imgsArrangeArr[index]}/>);
    }.bind(this));

    return (

      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgUnits}

        </section>
        <nav className="controller-nav">
          {controlerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
