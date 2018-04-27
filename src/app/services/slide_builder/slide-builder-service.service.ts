import { Injectable } from '@angular/core';
import { Slide } from '../../pojo/slide/slide';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class SlideBuilderServiceService {

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


    } else if (slide.type === 'IMAGE_TITLE_PARAGRAPH_CARD' || slide.type === 'TITLE_IMAGE_PARAGRAPH_CARD' || slide.type === 'AUDIO_TITLE_IMAGE_PARAGRAPH_CARD') {

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    }
    //
    else if (slide.type === 'IMAGE_PARAGRAPH_CARD') {

      if (slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type === 'INTERACTIVE_2_CROSS_2') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
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

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
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

    } else if (slide.type === 'INTERACTIVE_CARDS_LIST') {

      if (slide.title != null && slide.title.text.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != '' && slide.interactivelist[0].text.trim() != '' && slide.interactivelist[0].description.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != '' && slide.interactivelist[1].text.trim() != '' && slide.interactivelist[1].description.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != '' && slide.interactivelist[2].text.trim() != '' && slide.interactivelist[2].description.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != '' && slide.interactivelist[3].text.trim() != '' && slide.interactivelist[3].description.trim() != ''
        && slide.interactivelist[4] != null && slide.interactivelist[4].image.url.trim() != '' && slide.interactivelist[4].text.trim() != '' && slide.interactivelist[4].description.trim() != ''
        && slide.interactivelist[5] != null && slide.interactivelist[5].image.url.trim() != '' && slide.interactivelist[5].text.trim() != '' && slide.interactivelist[5].description.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'NO_CONTENT') {

      if (slide.bgImage != null && slide.bgImage.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'INTERACTIVE_2_CROSS_1') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }


    } else if (slide.type === 'AUDIO_SPEECH_CARD') {
      if (slide.interactivelist[0] != null && slide.interactivelist[0].text.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].text.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].text.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].text.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'DRAGGABLE_CARD_2') {
      if (slide.title != null && slide.title.text.trim() != '' && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != ''
        && slide.interactivelist[4] != null && slide.interactivelist[4].image.url.trim() != ''
        && slide.interactivelist[5] != null && slide.interactivelist[5].image.url.trim() != ''
        && slide.interactivelist[6] != null && slide.interactivelist[6].image.url.trim() != ''
        && slide.interactivelist[7] != null && slide.interactivelist[7].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'DRAGGABLE_CARD_1') {
      if (slide.title != null && slide.title.text.trim() != '' && slide.interactivelist != null) {

        for (let interactive of slide.interactivelist) {
          if (interactive.image.url != null && interactive.image.url.trim() != '') {
            isValid = true;
          } else {
            isValid = false;
            break;
          }
        }
      } else {
        isValid = false;
      }

    } else if (slide.type === 'DRAGGABLE_CARD_3') {
      if (slide.image.url != null && slide.image.url.trim() != ''
        && slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != ''
        && slide.interactivelist[4] != null && slide.interactivelist[4].image.url.trim() != ''
        && slide.interactivelist[5] != null && slide.interactivelist[5].image.url.trim() != ''
        && slide.interactivelist[6] != null && slide.interactivelist[6].image.url.trim() != ''
        && slide.interactivelist[7] != null && slide.interactivelist[7].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }

    } else if (slide.type === 'DRAGGABLE_CARD_4') {
      if (slide.interactivelist[0] != null && slide.interactivelist[0].image.url.trim() != ''
        && slide.interactivelist[1] != null && slide.interactivelist[1].image.url.trim() != ''
        && slide.interactivelist[2] != null && slide.interactivelist[2].image.url.trim() != ''
        && slide.interactivelist[3] != null && slide.interactivelist[3].image.url.trim() != ''
        && slide.interactivelist[4] != null && slide.interactivelist[4].image.url.trim() != ''
        && slide.interactivelist[5] != null && slide.interactivelist[5].image.url.trim() != ''
        && slide.interactivelist[6] != null && slide.interactivelist[6].image.url.trim() != ''
        && slide.interactivelist[7] != null && slide.interactivelist[7].image.url.trim() != ''
      ) {
        isValid = true;
      } else {
        isValid = false;
      }

      // console.log(slide);
    } else if (slide.type === 'DRAGGABLE_CARD_5') {
      if (slide.image.url != null && slide.image.url.trim() != ''
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

    } else if (slide.type === 'ONLY_TITLE') {
      if (slide.title != null && slide.title.text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    }
    else if (slide.type === 'ONLY_2BOX') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.subTitle != null && slide.subTitle.text.trim() != ''
        && slide.list[0] != null && slide.list[0].text.trim() != ''
        && slide.list[1] != null && slide.list[1].text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    }
    else if (slide.type === 'ONLY_2TITLE') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.subTitle != null && slide.subTitle.text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }

    }
    else if (slide.type === 'ONLY_2TITLE_IMAGE') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.subTitle != null && slide.subTitle.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_LIST') {
      if (slide.list != null) {
        var counter = 0;
        for (let list of slide.list) {
          if (list.text.trim() != '') {
            slide.fragmentcount = counter;
            counter++;
          }
        }
        if (counter > 1) {
          isValid = true;
        }
      } else {
        isValid = false;
      }

    } else if (slide.type === 'ONLY_LIST_NUMBERED') {
      if (slide.list != null) {
        var counter = 0;
        for (let list of slide.list) {
          if (list.text.trim() != '') {
            slide.fragmentcount = counter;
            counter++;
          }
        }
        if (counter > 1) {
          isValid = true;
        }
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_TITLE_IMAGE') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_TITLE_PARAGRAPH_IMAGE') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_TITLE_PARAGRAPH') {
      if (slide.title != null && slide.title.text.trim() != ''
        && slide.paragraph != null && slide.paragraph.text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_PARAGRAPH') {
      if (slide.paragraph != null && slide.paragraph.text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ONLY_PARAGRAPH_IMAGE') {
      if (slide.paragraph != null && slide.paragraph.text.trim() != ''
        && slide.image.url != null && slide.image.url.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (slide.type === 'ASSESSMENT_TYPE_1') {
      if (slide.paragraph != null && slide.paragraph.text.trim() != '') {
        isValid = true;
      } else {
        isValid = false;
      }
    }

    //ASSESSMENT_TYPE_1
    //  console.log(slide);
    return isValid;

  }

}
