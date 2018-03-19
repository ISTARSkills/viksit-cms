import { Injectable } from '@angular/core';
import { Slide } from '../../pojo/slide/slide';

@Injectable()
export class SlideBuilderServiceService {

  slide: Slide;

  constructor() { }




  public isValidateSlide(slide) {

    var isValid = false;

    if (slide.type === 'TITLE_PARAGRAPH_CARD') {

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.bgImage != null && slide.bgImage.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type == 'LESSON_INTRODUCTION_CARD') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.bgImage != null && slide.bgImage.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != ''
        && slide.subTitle != null && slide.subTitle.text.trim() != ''
        && slide.list[0] != null && slide.list[0].text.trim() != '' && slide.list[0].description.trim() != ''
        && slide.list[1] != null && slide.list[1].text.trim() != '' && slide.list[1].description.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type === 'IMAGE_TITLE_PARAGRAPH_CARD') {

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type === 'INTERACTIVE_2_CROSS_2') {
      console.log(slide);
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.bgImage != null && slide.bgImage.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type === 'INTERACTIVE_3_CROSS_2') {

      console.log(slide);
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.bgImage != null && slide.bgImage.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != ''
        && slide.interactivelist[4] != null && slide.interactivelist[4].image.url.trim() != ''
        && slide.interactivelist[5] != null && slide.interactivelist[5].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'ONLY_VIDEO') {

      if (slide.videoUrl != null && slide.videoUrl.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'VIDEO_TITLE_PARA_CARD') {

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.videoUrl != null && slide.videoUrl.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    }
    return isValid;

  }

}
