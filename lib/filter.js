import * as utils from './utils'
import {LINK_TEXT_RATIO_THRESHOLD, LINK_TAG_RATIO_THERSHOLD} from './const'

export function isContent(details) {
  return details.textCount > 0 &&
    details.linkTagCount / details.textNodeCount < LINK_TAG_RATIO_THERSHOLD &&
    details.linkTextCount / details.textCount < LINK_TEXT_RATIO_THRESHOLD
}
