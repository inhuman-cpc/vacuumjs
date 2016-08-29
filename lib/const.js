// 链接标签占比阈值，高于此值则表明当前节点可能不属于正文内容
export const LINK_TAG_RATIO_THERSHOLD = 1 / 2

// 链接文本长度占总长度比例，高于此值则表明当前节点可能不属于正文内容
export const LINK_TEXT_RATIO_THRESHOLD = 0.25

/**
 * 如下标签与网页正文内容关联很小
 * 对比节点差异时直接忽略
 */
export const EXCLUDE_TAGS = 'svg,style,link,meta,iframe,noscript,footer,header'.split(',')

/**
 * 如下内联元素可能作为网页正文的修饰标签出现
 */
export const INLINE_TAGS = 'b,big,i,small,tt,abbr,acronym,cite,code,dfn,em,kbd,strong,samp,time,var,a,bdo,br,img,map,object,q,span,sub,sup,button,input,label,select,textarea'.split(',')
