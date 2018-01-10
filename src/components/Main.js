require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


//获取图片相关数据
var imageData = require('../sources/imageData.json');

//通过自执行函数，将图片转化成正确的url
imageData = (function getImageUrl(imageDataArr){
  for (var i = 0 ; i< imageDataArr.length ; i++){
     var singleImageData = imageDataArr[i];
     singleImageData.imageUrl= require('../images/'+singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
 return imageDataArr;
})(imageData);

/**
 * 获取区间内的一个随机数
 */
 function getRangeRandom(low,high){
  return  Math.ceil(Math.random() * (high - low)+ low);

 }


/**
 * 获取0-30°之间内的一个随机正负值
 */
function getRotateRandom(){

  return  ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));

}
class ImgFigure extends React.Component {
  render() {
    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用props指定的参数
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }
    //如果图片的旋转角度的值不为0，则添加角度
    if (this.props.arrange.rotate) {
      (['-moz-', '-ms-', '-wekit-', '']).forEach(function (value) {
        styleObj[value +'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
      }.bind(this))

    }
    return (
        <figure className="img-figure" ref ="figure" style = {styleObj}>
          <img src={ this.props.data.imageUrl}
              alt={ this.props.data.title}
               style={{width:'200px',height:'200px'}}
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
        /*{
          pos:{
            left:'0',
            top:'0'
          },
          rotate: 0
        }
        */

      ]
    };

  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布那个图片
   */
  rearrange  (centerIndex){
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
       topImgNum = Math.floor(Math.random() * 2), // 取一个或者不取
       topImgSpliceIndex = 0,

       imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);


       //首先居中 centerIndex 的图片
       imgsArrangeCenterArr[0].pos=centerPos;
       //居中的图片不需要旋转
       imgsArrangeCenterArr[0].rotate = 0;
       //取出要布局上侧的图片的状态信息
       topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
       imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

       imgsArrangeTopArr.forEach(function(value,index){
         imgsArrangeTopArr[index] = {
           pos :{
             top : getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
             left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
           },
           rotate: getRotateRandom()
         }

       });

       //布局左右两侧的图片
       for(var i = 0 ,j = imgsArrangeArr.length , k = j/ 2 ; i < j ; i++){
       var hPosRangeLORX = null ;

       //前半部布局左边，右半部份布局右边
         if(i < k ){
            hPosRangeLORX = hPosRangeleftSecX;
         }else {
           hPosRangeLORX = hPosRangeRightSecX;
         }
         imgsArrangeArr[i]={
           pos:{
               top : getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
               left : getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
           },
           rotate: getRotateRandom()

         };
      }
     if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
         imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }



  //组件加载后，为每张图片计算其位置的范围
  componentDidMount (){

    //首先取得舞台的大小
   var stageDOM = this.refs.stage,
     stageW = stageDOM.scrollWidth,
     stageH = stageDOM.scrollHeight,
     halfStageW = Math.ceil(stageW / 2),
     halfStageH = Math.ceil(stageH / 2);

   //拿到一个imageUnits 大小
    var imgFigureDom = this.refs.imgFigure0.refs.figure,
      imgW = imgFigureDom.scrollWidth,
      imgH = imgFigureDom.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片位置点
    this.Constant.centerPos = {
      left : halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    // 计算左侧，右侧区域图片排布位置的取值范围
    this.Constant.hposRange.leftSecX[0] = -halfImgW;
    this.Constant.hposRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hposRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hposRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hposRange.y[0] = - halfImgH;
    this.Constant.hposRange.y[1] = stageH - halfImgH;


    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vposRange.topY[0] = -halfImgH;
    this.Constant.vposRange.topY[1] = halfStageH -halfImgH * 3;
    this.Constant.vposRange.x[0] =halfStageW - imgW;
    this.Constant.vposRange.x[1] = halfStageW;

    this.rearrange(0);
  }
  render() {
    var controllerUnits = [],
      imgUnits = [];
    imageData.forEach(function(value,index){
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate: 0
        };

      }
       imgUnits.push(
         <ImgFigure data = {value} ref = {'imgFigure'+index} key={'imgFigures'+index} arrange = {this.state.imgsArrangeArr[index]}/>
       );
    }.bind(this));

    return (

      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgUnits}

        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
