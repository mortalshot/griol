(() => {
    "use strict";
    function addLoadedClass() {
        if (!document.documentElement.classList.contains("loading")) window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    function getScrollbarWidth() {
        const scrollDiv = document.createElement("div");
        scrollDiv.style.visibility = "hidden";
        scrollDiv.style.overflow = "scroll";
        scrollDiv.style.position = "absolute";
        scrollDiv.style.top = "-9999px";
        scrollDiv.style.width = "100px";
        scrollDiv.style.height = "100px";
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
    }
    let lockOwner = null;
    let bodyLockStatus = true;
    let bodyLock = (delay = 500, owner = null) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = getScrollbarWidth() + "px";
            lockPaddingElements.forEach((el => {
                el.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            lockOwner = owner || "manual";
            bodyLockStatus = false;
            setTimeout((() => {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyUnlock = (delay = 500, owner = null) => {
        if (bodyLockStatus && (!owner || owner === lockOwner)) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((el => el.style.paddingRight = ""));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            lockOwner = null;
            bodyLockStatus = false;
            setTimeout((() => {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    let closeSearchCallback = null;
    function setCloseSearchCallback(cb) {
        closeSearchCallback = cb;
    }
    function callCloseSearchIfNeeded() {
        if (typeof closeSearchCallback === "function") closeSearchCallback();
    }
    function menuInit(onToggle = () => {}) {
        if (document.querySelector(".icon-menu button")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu button")) {
                callCloseSearchIfNeeded();
                const isOpen = document.documentElement.classList.contains("menu-open");
                if (!isOpen) bodyLock(500, "menu"); else bodyUnlock(500, "menu");
                document.documentElement.classList.toggle("menu-open");
                onToggle();
            }
        }));
    }
    function showMore() {
        window.addEventListener("load", (function(e) {
            const showMoreBlocks = document.querySelectorAll("[data-showmore]");
            let showMoreBlocksRegular;
            let mdQueriesArray;
            if (showMoreBlocks.length) {
                showMoreBlocksRegular = Array.from(showMoreBlocks).filter((function(item, index, self) {
                    return !item.dataset.showmoreMedia;
                }));
                showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                document.addEventListener("click", showMoreActions);
                window.addEventListener("resize", showMoreActions);
                mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
                if (mdQueriesArray && mdQueriesArray.length) {
                    mdQueriesArray.forEach((mdQueriesItem => {
                        mdQueriesItem.matchMedia.addEventListener("change", (function() {
                            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                        }));
                    }));
                    initItemsMedia(mdQueriesArray);
                }
            }
            function initItemsMedia(mdQueriesArray) {
                mdQueriesArray.forEach((mdQueriesItem => {
                    initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
            }
            function initItems(showMoreBlocks, matchMedia) {
                showMoreBlocks.forEach((showMoreBlock => {
                    initItem(showMoreBlock, matchMedia);
                }));
            }
            function initItem(showMoreBlock, matchMedia = false) {
                showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
                let showMoreContent = showMoreBlock.querySelectorAll("[data-showmore-content]");
                let showMoreButton = showMoreBlock.querySelectorAll("[data-showmore-button]");
                showMoreContent = Array.from(showMoreContent).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                showMoreButton = Array.from(showMoreButton).filter((item => item.closest("[data-showmore]") === showMoreBlock))[0];
                const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                if (matchMedia.matches || !matchMedia) if (hiddenHeight < getOriginalHeight(showMoreContent)) {
                    _slideUp(showMoreContent, 0, showMoreBlock.classList.contains("_showmore-active") ? getOriginalHeight(showMoreContent) : hiddenHeight);
                    showMoreButton.hidden = false;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                } else {
                    _slideDown(showMoreContent, 0, hiddenHeight);
                    showMoreButton.hidden = true;
                }
            }
            function getHeight(showMoreBlock, showMoreContent) {
                let hiddenHeight = 0;
                const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : "size";
                const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
                if (showMoreType === "items") {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
                    const showMoreItems = showMoreContent.children;
                    for (let index = 1; index < showMoreItems.length; index++) {
                        const showMoreItem = showMoreItems[index - 1];
                        const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
                        const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
                        hiddenHeight += showMoreItem.offsetHeight + marginTop;
                        if (index == showMoreTypeValue) break;
                        hiddenHeight += marginBottom;
                    }
                    rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
                } else {
                    const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
                    hiddenHeight = showMoreTypeValue;
                }
                return hiddenHeight;
            }
            function getOriginalHeight(showMoreContent) {
                let parentHidden;
                let hiddenHeight = showMoreContent.offsetHeight;
                showMoreContent.style.removeProperty("height");
                if (showMoreContent.closest(`[hidden]`)) {
                    parentHidden = showMoreContent.closest(`[hidden]`);
                    parentHidden.hidden = false;
                }
                let originalHeight = showMoreContent.offsetHeight;
                parentHidden ? parentHidden.hidden = true : null;
                showMoreContent.style.height = `${hiddenHeight}px`;
                return originalHeight;
            }
            function showMoreActions(e) {
                const targetEvent = e.target;
                const targetType = e.type;
                if (targetType === "click") {
                    if (targetEvent.closest("[data-showmore-button]")) {
                        const showMoreButton = targetEvent.closest("[data-showmore-button]");
                        const showMoreBlock = showMoreButton.closest("[data-showmore]");
                        const showMoreContent = showMoreBlock.querySelector("[data-showmore-content]");
                        const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : "500";
                        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
                        if (!showMoreContent.classList.contains("_slide")) {
                            showMoreBlock.classList.contains("_showmore-active") ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
                            showMoreBlock.classList.toggle("_showmore-active");
                        }
                    }
                } else if (targetType === "resize") {
                    showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
                    mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
                }
            }
        }));
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    (function(global, factory) {
        if (typeof module === "object" && typeof module.exports === "object") if (global.document) module.exports = factory(global); else throw new Error("HC-Sticky requires a browser to run."); else if (typeof define === "function" && define.amd) define("hcSticky", [], factory(global)); else factory(global);
    })(typeof window !== "undefined" ? window : void 0, (window => {
        const document = window.document;
        const DEFAULT_OPTIONS = {
            top: 0,
            bottom: 0,
            bottomEnd: 0,
            innerTop: 0,
            innerSticker: null,
            stickyClass: "sticky",
            stickTo: null,
            followScroll: true,
            responsive: null,
            mobileFirst: false,
            onStart: null,
            onStop: null,
            onBeforeResize: null,
            onResize: null,
            resizeDebounce: 100,
            disable: false
        };
        const deprecated = (() => {
            const pluginName = "HC Sticky";
            return (what, instead, type) => {
                console.warn("%c" + pluginName + ":" + "%c " + type + "%c '" + what + "'" + "%c is now deprecated and will be removed. Use" + "%c '" + instead + "'" + "%c instead.", "color: #fa253b", "color: default", "color: #5595c6", "color: default", "color: #5595c6", "color: default");
            };
        })();
        const hcSticky = function(elem, userSettings) {
            userSettings = userSettings || {};
            if (typeof elem === "string") elem = document.querySelector(elem);
            if (!elem) return false;
            if (userSettings.queries) deprecated("queries", "responsive", "option");
            if (userSettings.queryFlow) deprecated("queryFlow", "mobileFirst", "option");
            let STICKY_OPTIONS = {};
            if (!hcSticky.Helpers) hcSticky.Helpers = {
                getStyle(el, prop) {
                    const cs = window.getComputedStyle ? window.getComputedStyle(el, null) : el.currentStyle || {};
                    return prop ? cs.getPropertyValue ? cs.getPropertyValue(prop) : cs[prop] : cs;
                },
                getCascadedStyle(el) {
                    const s = this.getStyle(el);
                    return {
                        left: s.left || el.style.left || "auto",
                        right: s.right || el.style.right || "auto",
                        top: s.top || el.style.top || "auto",
                        bottom: s.bottom || el.style.bottom || "auto",
                        width: s.width || el.style.width || "auto",
                        marginLeft: s.marginLeft || "0px",
                        marginRight: s.marginRight || "0px",
                        marginTop: s.marginTop || "0px",
                        marginBottom: s.marginBottom || "0px",
                        paddingLeft: s.paddingLeft || "0px",
                        paddingRight: s.paddingRight || "0px",
                        cssFloat: s.cssFloat || s.float || ""
                    };
                },
                hasClass(el, cn) {
                    return el.classList ? el.classList.contains(cn) : new RegExp("(^|\\b)" + cn.split(" ").join("|") + "(\\b|$)").test(el.className);
                },
                offset(el) {
                    const r = el.getBoundingClientRect();
                    const sl = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
                    const st = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                    return {
                        top: r.top + st,
                        left: r.left + sl
                    };
                },
                position(el) {
                    return {
                        top: el.offsetTop,
                        left: el.offsetLeft
                    };
                },
                getElement(sel) {
                    if (!sel) return null;
                    if (typeof sel === "string") return document.querySelector(sel);
                    if (sel && sel.nodeType) return sel;
                    return null;
                },
                isEmptyObject(obj) {
                    for (const k in obj) return false;
                    return true;
                },
                supportsPassive: false,
                debounce(fn, wait) {
                    let t;
                    return function() {
                        clearTimeout(t);
                        t = setTimeout((() => fn.apply(this, arguments)), wait);
                    };
                }
            };
            const Helpers = hcSticky.Helpers;
            const elemParent = elem.parentNode;
            if (Helpers.getStyle(elemParent, "position") === "static") elemParent.style.position = "relative";
            const setOptions = options => {
                options = options || {};
                if (Helpers.isEmptyObject(options) && !Helpers.isEmptyObject(STICKY_OPTIONS)) return;
                STICKY_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, STICKY_OPTIONS, options);
            };
            const resetOptions = options => {
                STICKY_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, options || {});
            };
            const getOptions = option => option ? STICKY_OPTIONS[option] : Object.assign({}, STICKY_OPTIONS);
            const isDisabled = () => STICKY_OPTIONS.disable;
            const applyQueries = () => {
                const mediaQueries = STICKY_OPTIONS.responsive || STICKY_OPTIONS.queries;
                if (mediaQueries) {
                    const window_width = window.innerWidth;
                    resetOptions(userSettings);
                    if (STICKY_OPTIONS.mobileFirst) {
                        for (const width in mediaQueries) if (window_width >= width && !Helpers.isEmptyObject(mediaQueries[width])) setOptions(mediaQueries[width]);
                    } else {
                        const queriesArr = [];
                        for (const b in mediaQueries) {
                            const q = {};
                            q[b] = mediaQueries[b];
                            queriesArr.push(q);
                        }
                        for (let i = queriesArr.length - 1; i >= 0; i--) {
                            const query = queriesArr[i];
                            const breakpoint = Object.keys(query)[0];
                            if (window_width <= breakpoint && !Helpers.isEmptyObject(query[breakpoint])) setOptions(query[breakpoint]);
                        }
                    }
                }
            };
            const getStickyCss = el => {
                const cascadedStyle = Helpers.getCascadedStyle(el);
                const computedStyle = Helpers.getStyle(el);
                const css = {
                    height: el.offsetHeight + "px",
                    left: cascadedStyle.left,
                    right: cascadedStyle.right,
                    top: cascadedStyle.top,
                    bottom: cascadedStyle.bottom,
                    position: computedStyle.position,
                    display: computedStyle.display,
                    verticalAlign: computedStyle.verticalAlign,
                    boxSizing: computedStyle.boxSizing,
                    marginLeft: cascadedStyle.marginLeft,
                    marginRight: cascadedStyle.marginRight,
                    marginTop: cascadedStyle.marginTop,
                    marginBottom: cascadedStyle.marginBottom,
                    paddingLeft: cascadedStyle.paddingLeft,
                    paddingRight: cascadedStyle.paddingRight
                };
                if (cascadedStyle["float"]) css["float"] = cascadedStyle["float"] || "none";
                if (cascadedStyle.cssFloat) css["cssFloat"] = cascadedStyle.cssFloat || "none";
                if (computedStyle.MozBoxSizing) css["MozBoxSizing"] = computedStyle.MozBoxSizing;
                css["width"] = cascadedStyle.width !== "auto" ? cascadedStyle.width : css.boxSizing === "border-box" || css.MozBoxSizing === "border-box" ? el.offsetWidth + "px" : computedStyle.width;
                return css;
            };
            const Sticky = {
                css: {},
                position: null,
                stick: args => {
                    args = args || {};
                    if (Helpers.hasClass(elem, STICKY_OPTIONS.stickyClass)) return;
                    if (Spacer.isAttached === false) Spacer.attach();
                    Sticky.position = "fixed";
                    elem.style.position = "fixed";
                    elem.style.left = Spacer.offsetLeft + "px";
                    elem.style.width = Spacer.width;
                    if (typeof args.bottom === "undefined") elem.style.bottom = "auto"; else elem.style.bottom = args.bottom + "px";
                    if (typeof args.top === "undefined") elem.style.top = "auto"; else elem.style.top = args.top + "px";
                    if (elem.classList) elem.classList.add(STICKY_OPTIONS.stickyClass); else elem.className += " " + STICKY_OPTIONS.stickyClass;
                    if (STICKY_OPTIONS.onStart) STICKY_OPTIONS.onStart.call(elem, Object.assign({}, STICKY_OPTIONS));
                },
                release: args => {
                    args = args || {};
                    args.stop = args.stop || false;
                    if (args.stop !== true && Sticky.position !== "fixed" && Sticky.position !== null && (typeof args.top === "undefined" && typeof args.bottom === "undefined" || typeof args.top !== "undefined" && (parseInt(Helpers.getStyle(elem, "top")) || 0) === args.top || typeof args.bottom !== "undefined" && (parseInt(Helpers.getStyle(elem, "bottom")) || 0) === args.bottom)) return;
                    if (args.stop === true) {
                        if (Spacer.isAttached === true) Spacer.detach();
                    } else if (Spacer.isAttached === false) Spacer.attach();
                    const position = args.position || Sticky.css.position;
                    Sticky.position = position;
                    elem.style.position = position;
                    elem.style.left = args.stop === true ? Sticky.css.left : Spacer.positionLeft + "px";
                    elem.style.width = position !== "absolute" ? Sticky.css.width : Spacer.width;
                    if (typeof args.bottom === "undefined") elem.style.bottom = args.stop === true ? "" : "auto"; else elem.style.bottom = args.bottom + "px";
                    if (typeof args.top === "undefined") elem.style.top = args.stop === true ? "" : "auto"; else elem.style.top = args.top + "px";
                    if (elem.classList) elem.classList.remove(STICKY_OPTIONS.stickyClass); else elem.className = elem.className.replace(new RegExp("(^|\\b)" + STICKY_OPTIONS.stickyClass.split(" ").join("|") + "(\\b|$)", "gi"), " ");
                    if (STICKY_OPTIONS.onStop) STICKY_OPTIONS.onStop.call(elem, Object.assign({}, STICKY_OPTIONS));
                }
            };
            const Spacer = {
                el: document.createElement("div"),
                offsetLeft: null,
                positionLeft: null,
                width: null,
                isAttached: false,
                init: () => {
                    Spacer.el.className = "sticky-spacer";
                    for (const prop in Sticky.css) Spacer.el.style[prop] = Sticky.css[prop];
                    Spacer.el.style["z-index"] = "-1";
                    const elemStyle = Helpers.getStyle(elem);
                    Spacer.offsetLeft = Helpers.offset(elem).left - (parseInt(elemStyle.marginLeft) || 0);
                    Spacer.positionLeft = Helpers.position(elem).left;
                    Spacer.width = Helpers.getStyle(elem, "width");
                },
                attach: () => {
                    elemParent.insertBefore(Spacer.el, elem);
                    Spacer.isAttached = true;
                },
                detach: () => {
                    Spacer.el = elemParent.removeChild(Spacer.el);
                    Spacer.isAttached = false;
                }
            };
            let stickTo_document;
            let container;
            let inner_sticker;
            let container_height;
            let container_offsetTop;
            let elemParent_offsetTop;
            let window_height;
            let options_top;
            let options_bottom;
            let stick_top;
            let stick_bottom;
            let top_limit;
            let bottom_limit;
            let largerSticky;
            let sticky_height;
            let sticky_offsetTop;
            let calcContainerHeight;
            let calcStickyHeight;
            const calcSticky = () => {
                Sticky.css = getStickyCss(elem);
                Spacer.init();
                stickTo_document = STICKY_OPTIONS.stickTo && (STICKY_OPTIONS.stickTo === "document" || STICKY_OPTIONS.stickTo.nodeType && STICKY_OPTIONS.stickTo.nodeType === 9 || typeof STICKY_OPTIONS.stickTo === "object" && STICKY_OPTIONS.stickTo instanceof (typeof HTMLDocument !== "undefined" ? HTMLDocument : Document)) ? true : false;
                container = STICKY_OPTIONS.stickTo ? stickTo_document ? document : Helpers.getElement(STICKY_OPTIONS.stickTo) : elemParent;
                calcStickyHeight = () => {
                    const height = elem.offsetHeight + (parseInt(Sticky.css.marginTop) || 0) + (parseInt(Sticky.css.marginBottom) || 0);
                    const h_diff = (sticky_height || 0) - height;
                    if (h_diff >= -1 && h_diff <= 1) return sticky_height; else return height;
                };
                sticky_height = calcStickyHeight();
                calcContainerHeight = () => !stickTo_document ? container.offsetHeight : Math.max(document.documentElement.clientHeight, document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight);
                container_height = calcContainerHeight();
                container_offsetTop = !stickTo_document ? Helpers.offset(container).top : 0;
                elemParent_offsetTop = !STICKY_OPTIONS.stickTo ? container_offsetTop : !stickTo_document ? Helpers.offset(elemParent).top : 0;
                window_height = window.innerHeight;
                sticky_offsetTop = elem.offsetTop - (parseInt(Sticky.css.marginTop) || 0);
                inner_sticker = Helpers.getElement(STICKY_OPTIONS.innerSticker);
                options_top = isNaN(STICKY_OPTIONS.top) && STICKY_OPTIONS.top.indexOf("%") > -1 ? parseFloat(STICKY_OPTIONS.top) / 100 * window_height : STICKY_OPTIONS.top;
                options_bottom = isNaN(STICKY_OPTIONS.bottom) && STICKY_OPTIONS.bottom.indexOf("%") > -1 ? parseFloat(STICKY_OPTIONS.bottom) / 100 * window_height : STICKY_OPTIONS.bottom;
                stick_top = inner_sticker ? inner_sticker.offsetTop : STICKY_OPTIONS.innerTop ? STICKY_OPTIONS.innerTop : 0;
                stick_bottom = isNaN(STICKY_OPTIONS.bottomEnd) && STICKY_OPTIONS.bottomEnd.indexOf("%") > -1 ? parseFloat(STICKY_OPTIONS.bottomEnd) / 100 * window_height : STICKY_OPTIONS.bottomEnd;
                top_limit = container_offsetTop - options_top + stick_top + sticky_offsetTop;
            };
            let last_pos = window.pageYOffset || document.documentElement.scrollTop;
            let diff_y = 0;
            let scroll_dir;
            const runSticky = () => {
                sticky_height = calcStickyHeight();
                container_height = calcContainerHeight();
                bottom_limit = container_offsetTop + container_height - options_top - stick_bottom;
                largerSticky = sticky_height > window_height;
                const specialRange = window_height >= sticky_height && window_height <= sticky_height + options_top;
                const largerOrSpecial = largerSticky || specialRange;
                const offset_top = window.pageYOffset || document.documentElement.scrollTop;
                const sticky_top = Helpers.offset(elem).top;
                const sticky_window_top = sticky_top - offset_top;
                let bottom_distance;
                scroll_dir = offset_top < last_pos ? "up" : "down";
                diff_y = offset_top - last_pos;
                last_pos = offset_top;
                if (offset_top > top_limit) if (bottom_limit + options_top + (largerOrSpecial ? options_bottom : 0) - (STICKY_OPTIONS.followScroll && largerOrSpecial ? 0 : options_top) <= offset_top + sticky_height - stick_top - (sticky_height - stick_top > window_height - (top_limit - stick_top) && STICKY_OPTIONS.followScroll ? (bottom_distance = sticky_height - window_height - stick_top) > 0 ? bottom_distance : 0 : 0)) Sticky.release({
                    position: "absolute",
                    bottom: elemParent_offsetTop + elemParent.offsetHeight - bottom_limit - options_top
                }); else if (largerOrSpecial && STICKY_OPTIONS.followScroll) if (scroll_dir === "down") {
                    if (sticky_window_top + sticky_height + options_bottom <= window_height + .9) Sticky.stick({
                        bottom: options_bottom
                    }); else if (Sticky.position === "fixed") Sticky.release({
                        position: "absolute",
                        top: sticky_top - options_top - top_limit - diff_y + stick_top
                    });
                } else {
                    if (Sticky.position === "fixed" && elem.style.bottom !== "auto") Sticky.release({
                        position: "absolute",
                        top: sticky_top - options_top - top_limit + stick_top - diff_y
                    });
                    if (Math.ceil(sticky_window_top + stick_top) < 0 && Sticky.position === "fixed") Sticky.release({
                        position: "absolute",
                        top: sticky_top - options_top - top_limit + stick_top - diff_y
                    }); else if (sticky_top >= offset_top + options_top - stick_top) Sticky.stick({
                        top: options_top - stick_top
                    });
                } else Sticky.stick({
                    top: options_top - stick_top
                }); else Sticky.release({
                    stop: true
                });
            };
            let scrollAttached = false;
            let resizeAttached = false;
            const disableSticky = () => {
                if (scrollAttached) {
                    window.removeEventListener("scroll", runSticky, Helpers.supportsPassive);
                    scrollAttached = false;
                }
            };
            const initSticky = () => {
                if (elem.offsetParent === null || Helpers.getStyle(elem, "display") === "none") {
                    disableSticky();
                    return;
                }
                calcSticky();
                if (sticky_height > container_height) {
                    disableSticky();
                    return;
                }
                runSticky();
                if (!scrollAttached) {
                    window.addEventListener("scroll", runSticky, Helpers.supportsPassive);
                    scrollAttached = true;
                }
            };
            const resetSticky = () => {
                elem.style.position = "";
                elem.style.left = "";
                elem.style.top = "";
                elem.style.bottom = "";
                elem.style.width = "";
                if (elem.classList) elem.classList.remove(STICKY_OPTIONS.stickyClass); else elem.className = elem.className.replace(new RegExp("(^|\\b)" + STICKY_OPTIONS.stickyClass.split(" ").join("|") + "(\\b|$)", "gi"), " ");
                Sticky.css = {};
                Sticky.position = null;
                if (Spacer.isAttached === true) Spacer.detach();
            };
            const reinitSticky = () => {
                resetSticky();
                applyQueries();
                if (isDisabled()) {
                    disableSticky();
                    return;
                }
                initSticky();
            };
            const resizeSticky = () => {
                if (STICKY_OPTIONS.onBeforeResize) STICKY_OPTIONS.onBeforeResize.call(elem, Object.assign({}, STICKY_OPTIONS));
                reinitSticky();
                if (STICKY_OPTIONS.onResize) STICKY_OPTIONS.onResize.call(elem, Object.assign({}, STICKY_OPTIONS));
            };
            const resize_cb = !STICKY_OPTIONS.resizeDebounce ? resizeSticky : Helpers.debounce(resizeSticky, STICKY_OPTIONS.resizeDebounce);
            const Update = options => {
                setOptions(options);
                userSettings = Object.assign({}, userSettings, options || {});
                reinitSticky();
            };
            const Detach = () => {
                if (resizeAttached) {
                    window.removeEventListener("resize", resize_cb, Helpers.supportsPassive);
                    resizeAttached = false;
                }
                disableSticky();
            };
            const Destroy = () => {
                Detach();
                resetSticky();
            };
            const Attach = () => {
                if (!resizeAttached) {
                    window.addEventListener("resize", resize_cb, Helpers.supportsPassive);
                    resizeAttached = true;
                }
                applyQueries();
                if (isDisabled()) {
                    disableSticky();
                    return;
                }
                initSticky();
            };
            this.options = getOptions;
            this.refresh = reinitSticky;
            this.update = Update;
            this.attach = Attach;
            this.detach = Detach;
            this.destroy = Destroy;
            this.triggerMethod = (method, options) => {
                if (typeof this[method] === "function") this[method](options);
            };
            this.reinit = () => {
                deprecated("reinit", "refresh", "method");
                reinitSticky();
            };
            setOptions(userSettings);
            Attach();
            window.addEventListener("load", reinitSticky);
        };
        if (typeof window.jQuery !== "undefined") {
            const $ = window.jQuery;
            const namespace = "hcSticky";
            $.fn.extend({
                hcSticky: function(args, update) {
                    if (!this.length) return this;
                    if (args === "options") return $.data(this.get(0), namespace).options();
                    return this.each((function() {
                        let instance = $.data(this, namespace);
                        if (instance) instance.triggerMethod(args, update); else {
                            instance = new hcSticky(this, args);
                            $.data(this, namespace, instance);
                        }
                    }));
                }
            });
        }
        window.hcSticky = window.hcSticky || hcSticky;
        return hcSticky;
    }));
    function updateHeaderOffset({saveInitial = false} = {}) {
        const header = document.querySelector(".header");
        const topline = document.querySelector(".topline");
        if (!header || !topline) return;
        const rect = header.getBoundingClientRect();
        const totalDistance = rect.bottom;
        document.documentElement.style.setProperty("--header-offset", `${totalDistance}px`);
        if (saveInitial && !document.documentElement.style.getPropertyValue("--header-offset-initial")) {
            const initialOffset = topline.offsetHeight + header.offsetHeight;
            document.documentElement.style.setProperty("--header-offset-initial", `${initialOffset}px`);
        }
    }
    window.addEventListener("DOMContentLoaded", (() => {
        updateHeaderOffset({
            saveInitial: true
        });
        setTimeout(updateHeaderOffset({
            saveInitial: true
        }), 100);
    }));
    window.addEventListener("resize", updateHeaderOffset);
    window.addEventListener("scroll", updateHeaderOffset);
    document.addEventListener("DOMContentLoaded", (() => {
        if (window.innerWidth <= 574.98) return;
        const sidebar = document.querySelector(".single-product__info");
        const header = document.querySelector("header");
        if (!sidebar) return;
        const hh = header ? header.offsetHeight : 0;
        const sticky = new hcSticky(sidebar, {
            stickTo: ".single-product",
            top: hh
        });
        const spollerItems = document.querySelectorAll(".single-product .spollers__item");
        if (spollerItems.length > 0) spollerItems.forEach((element => {
            element.addEventListener("click", (function() {
                sticky.refresh();
            }));
        }));
    }));
    const catalogItems = document.querySelectorAll(".header-catalog");
    const html = document.documentElement;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let activeItem = null;
    function openCatalog(item) {
        if (html.classList.contains("_search-show")) {
            html.classList.remove("_search-show");
            if (!html.classList.contains("menu-open") && bodyLockStatus) bodyUnlock();
        }
        if (activeItem && activeItem !== item) activeItem.classList.remove("_show");
        item.classList.add("_show");
        html.classList.add("_catalog-show");
        updateHeaderOffset();
        activeItem = item;
    }
    function closeCatalog() {
        if (activeItem) {
            activeItem.classList.remove("_show");
            activeItem = null;
        }
        html.classList.remove("_catalog-show");
    }
    if (catalogItems && catalogItems.length > 0) catalogItems.forEach((item => {
        const toggle = item.querySelector(".header-catalog__toggle");
        if (isTouchDevice && toggle) toggle.addEventListener("click", (e => {
            e.stopPropagation();
            item.classList.contains("_show") ? closeCatalog() : openCatalog(item);
        }));
        if (!isTouchDevice) item.addEventListener("mouseenter", (() => {
            openCatalog(item);
        }));
    }));
    if (!isTouchDevice) {
        const menuItems = document.querySelectorAll(".header-menu__item");
        menuItems.forEach((menuItem => {
            menuItem.addEventListener("mouseenter", (() => {
                if (!menuItem.classList.contains("header-catalog")) closeCatalog(); else if (activeItem !== menuItem) openCatalog(menuItem);
            }));
        }));
        const header = document.querySelector(".header");
        if (header) header.addEventListener("mouseleave", (() => {
            closeCatalog();
        }));
    }
    const headerCatalogBlocks = document.querySelectorAll(".header-catalog");
    function initHeaderCatalogTabs() {
        headerCatalogBlocks.forEach((catalog => {
            const buttons = catalog.querySelectorAll(".header-catalog__title");
            const tabs = catalog.querySelectorAll(".header-catalog__body");
            buttons.forEach(((button, index) => {
                button.addEventListener("click", (() => {
                    tabs.forEach((tab => tab.classList.remove("_active")));
                    buttons.forEach((btn => btn.classList.remove("_active")));
                    tabs[index]?.classList.add("_active");
                    button.classList.add("_active");
                }));
            }));
        }));
        const allItems = document.querySelectorAll(".header-catalog__item");
        allItems.forEach((item => {
            const parent = item.closest(".header-catalog");
            const siblings = parent?.querySelectorAll(".header-catalog__item");
            item.addEventListener("mouseenter", (() => {
                siblings?.forEach((i => i.classList.remove("_hover")));
                item.classList.add("_hover");
            }));
        }));
    }
    function initBackButtons() {
        headerCatalogBlocks.forEach((catalog => {
            const buttons = catalog.querySelectorAll(".header-catalog__title");
            const tabs = catalog.querySelectorAll(".header-catalog__body");
            tabs.forEach(((tab, index) => {
                const backButton = tab.querySelector(".header-catalog__body-back");
                if (backButton) backButton.addEventListener("click", (() => {
                    if (window.innerWidth < 768) {
                        tab.classList.remove("_active");
                        buttons[index]?.classList.remove("_active");
                    }
                }));
            }));
        }));
    }
    function resetHeaderCatalogTabsIfMobile() {
        if (window.innerWidth < 768) headerCatalogBlocks.forEach((catalog => {
            const buttons = catalog.querySelectorAll(".header-catalog__title._active");
            const tabs = catalog.querySelectorAll(".header-catalog__body._active");
            buttons.forEach((btn => btn.classList.remove("_active")));
            tabs.forEach((tab => tab.classList.remove("_active")));
        }));
    }
    initHeaderCatalogTabs();
    initBackButtons();
    resetHeaderCatalogTabsIfMobile();
    window.addEventListener("resize", resetHeaderCatalogTabsIfMobile);
    window.addEventListener("DOMContentLoaded", resetHeaderCatalogTabsIfMobile);
    menuInit((() => {
        updateHeaderOffset();
        closeCatalog();
    }));
    const catalogBack = document.querySelectorAll(".header-catalog__back");
    catalogBack.forEach((element => {
        element.addEventListener("click", (function() {
            closeCatalog();
        }));
    }));
    const searchToggle = document.querySelector(".search__up");
    const searchClose = document.querySelector(".search__close");
    function openSearch() {
        if (html.classList.contains("_catalog-show")) {
            const activeCatalog = document.querySelector(".header-catalog._show");
            if (activeCatalog) activeCatalog.classList.remove("_show");
            html.classList.remove("_catalog-show");
        }
        if (html.classList.contains("menu-open")) html.classList.remove("menu-open");
        html.classList.add("_search-show");
        if (bodyLockStatus) bodyLock(500, "search");
        updateHeaderOffset();
    }
    function closeSearch() {
        html.classList.remove("_search-show");
        if (!html.classList.contains("menu-open")) bodyUnlock(500, "search");
    }
    setCloseSearchCallback(closeSearch);
    if (searchToggle) searchToggle.addEventListener("click", (() => {
        if (!bodyLockStatus) return;
        if (html.classList.contains("_search-show")) closeSearch(); else openSearch();
    }));
    if (searchClose) searchClose.addEventListener("click", (() => {
        if (!bodyLockStatus) return;
        closeSearch();
    }));
    document.addEventListener("click", (e => {
        if (html.classList.contains("_search-show") && !e.target.closest(".search") && !e.target.closest(".search__up")) closeSearch();
    }));
    document.addEventListener("keydown", (e => {
        const html = document.documentElement;
        if (e.key === "Escape" && html.classList.contains("_search-show")) {
            html.classList.remove("_search-show");
            if (!html.classList.contains("menu-open") && typeof bodyUnlock === "function" && bodyLockStatus) bodyUnlock();
        }
    }));
    document.addEventListener("DOMContentLoaded", (() => {
        const videos = document.querySelectorAll("video._autoplay");
        if ("IntersectionObserver" in window && videos.length) {
            const options = {
                root: null,
                rootMargin: "0px",
                threshold: .3
            };
            const observer = new IntersectionObserver((entries => {
                entries.forEach((entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        if (video.paused) video.play().catch((() => {}));
                    } else if (!video.paused) video.pause();
                }));
            }), options);
            videos.forEach((video => {
                observer.observe(video);
            }));
        }
    }));
    function initSliders() {
        function initCustomSlickSlider(options) {
            const {rootSelector, sliderSelector, slickSettings, enableBelow, dotsContainerSelector} = options;
            const blocks = document.querySelectorAll(rootSelector);
            if (!blocks.length) return;
            blocks.forEach((block => {
                const slider = block.querySelector(sliderSelector);
                const prevBtn = block.querySelector(".slider-arrow_prev");
                const nextBtn = block.querySelector(".slider-arrow_next");
                const dotsContainer = dotsContainerSelector ? block.querySelector(dotsContainerSelector) : null;
                if (!slider) return;
                let isInitialized = false;
                const updateArrows = slick => {
                    if (!slick.$slider.is(slider)) return;
                    const current = slick.currentSlide;
                    const total = slick.slideCount;
                    const toShow = slick.options.slidesToShow;
                    const isBeginning = current === 0;
                    const isEnd = current >= total - toShow;
                    const shouldHideArrows = Math.ceil(total) <= Math.ceil(toShow);
                    prevBtn?.classList.toggle("_disabled", isBeginning);
                    nextBtn?.classList.toggle("_disabled", isEnd);
                    if (shouldHideArrows) {
                        prevBtn && (prevBtn.style.display = "none");
                        nextBtn && (nextBtn.style.display = "none");
                    } else {
                        prevBtn && (prevBtn.style.display = "");
                        nextBtn && (nextBtn.style.display = "");
                    }
                };
                const setupSlider = () => {
                    if (enableBelow && window.innerWidth >= enableBelow) {
                        if (isInitialized) {
                            $(slider).slick("unslick");
                            isInitialized = false;
                        }
                        return;
                    }
                    if (!isInitialized) {
                        $(slider).on("init reInit afterChange", (function(e, slick) {
                            updateArrows(slick);
                        }));
                        $(slider).slick({
                            arrows: false,
                            infinite: false,
                            dots: !!dotsContainer,
                            appendDots: dotsContainer || void 0,
                            customPaging: function() {
                                return '<button type="button" class="dot"></button>';
                            },
                            ...slickSettings
                        });
                        $(slider).on("init", (function(e, slick) {
                            setTimeout((() => updateArrows(slick)), 0);
                        }));
                        prevBtn?.addEventListener("click", (() => {
                            $(slider).slick("slickPrev");
                        }));
                        nextBtn?.addEventListener("click", (() => {
                            $(slider).slick("slickNext");
                        }));
                        isInitialized = true;
                    }
                };
                setupSlider();
                window.addEventListener("resize", setupSlider);
            }));
        }
        initCustomSlickSlider({
            rootSelector: ".hero",
            sliderSelector: ".hero__slider-wrapper",
            lazyLoad: "ondemand",
            slickSettings: {
                slidesToShow: 1,
                dots: true,
                autoplay: true,
                autoplaySpeed: 2e3
            }
        });
        initCustomSlickSlider({
            rootSelector: ".stylist",
            sliderSelector: ".stylist__slider",
            slickSettings: {
                slidesToShow: 8.5,
                responsive: [ {
                    breakpoint: 1600,
                    settings: {
                        slidesToShow: 8
                    }
                }, {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: 7
                    }
                }, {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 6
                    }
                }, {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 5
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 3.6
                    }
                } ]
            }
        });
        initCustomSlickSlider({
            rootSelector: ".widget-products",
            sliderSelector: ".widget-products__slider",
            lazyLoad: "ondemand",
            slickSettings: {
                slidesToShow: 3,
                useTransform: window.innerWidth > 767.98,
                responsive: [ {
                    breakpoint: 767.98,
                    settings: {
                        slidesToShow: 2.5
                    }
                }, {
                    breakpoint: 479.98,
                    settings: {
                        slidesToShow: 1.5
                    }
                } ]
            }
        });
        initCustomSlickSlider({
            rootSelector: ".widget-category",
            sliderSelector: ".widget-category__slider",
            lazyLoad: "ondemand",
            slickSettings: {
                slidesToShow: 4.7,
                responsive: [ {
                    breakpoint: 1280,
                    settings: {
                        slidesToShow: 4
                    }
                }, {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3.3
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.5
                    }
                }, {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 2.3
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2.05
                    }
                } ]
            }
        });
        initCustomSlickSlider({
            rootSelector: ".widget-featured",
            sliderSelector: ".widget-featured__slider",
            lazyLoad: "ondemand",
            slickSettings: {
                slidesToShow: 4,
                useTransform: window.innerWidth > 767.98,
                responsive: [ {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.7
                    }
                }, {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 2.5
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2.1
                    }
                } ]
            }
        });
        initCustomSlickSlider({
            rootSelector: ".single-product",
            sliderSelector: ".single-product__gallery",
            enableBelow: 574.98,
            dotsContainerSelector: ".single-product__dots",
            slickSettings: {
                slidesToShow: 1
            }
        });
        initCustomSlickSlider({
            rootSelector: ".widget-featured",
            sliderSelector: ".stories__slider",
            lazyLoad: "ondemand",
            slickSettings: {
                slidesToShow: 4,
                useTransform: window.innerWidth > 767.98,
                responsive: [ {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3
                    }
                }, {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.7
                    }
                }, {
                    breakpoint: 575,
                    settings: {
                        slidesToShow: 2.5
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.5
                    }
                } ]
            }
        });
        initCustomSlickSlider({
            rootSelector: ".shot-slider",
            sliderSelector: ".shot-slider__gallery",
            dotsContainerSelector: ".shot-slider__dots",
            slickSettings: {
                slidesToShow: 3
            }
        });
        function initGallerySwipeScroll() {
            if (window.innerWidth > 574.98) return;
            const gallery = document.querySelector(".single-product__gallery");
            if (!gallery) return;
            let startY = 0;
            let startX = 0;
            let lastY = 0;
            let isVerticalScroll = null;
            let velocity = 0;
            let lastMoveTime = 0;
            let inertiaFrame;
            gallery.addEventListener("touchstart", (e => {
                if (e.touches.length !== 1) return;
                startY = lastY = e.touches[0].clientY;
                startX = e.touches[0].clientX;
                isVerticalScroll = null;
                velocity = 0;
                cancelAnimationFrame(inertiaFrame);
                lastMoveTime = Date.now();
            }));
            gallery.addEventListener("touchmove", (e => {
                if (e.touches.length !== 1) return;
                const currentY = e.touches[0].clientY;
                const currentX = e.touches[0].clientX;
                const diffX = currentX - startX;
                const diffY = currentY - lastY;
                if (isVerticalScroll === null) isVerticalScroll = Math.abs(diffY) > Math.abs(diffX);
                if (isVerticalScroll) {
                    e.preventDefault();
                    const now = Date.now();
                    const dt = now - lastMoveTime || 16;
                    velocity = -diffY / dt * 20;
                    document.body.scrollTop += velocity;
                    lastY = currentY;
                    lastMoveTime = now;
                } else e.preventDefault();
            }), {
                passive: false
            });
            gallery.addEventListener("touchend", (() => {
                if (!isVerticalScroll || Math.abs(velocity) < .5) return;
                const friction = .95;
                function inertiaStep() {
                    if (Math.abs(velocity) < .1) return;
                    document.body.scrollBy(0, velocity);
                    velocity *= friction;
                    inertiaFrame = requestAnimationFrame(inertiaStep);
                }
                inertiaStep();
            }));
        }
        initGallerySwipeScroll();
        window.addEventListener("resize", initGallerySwipeScroll);
    }
    function refreshSlick(sliderEl) {
        if (!sliderEl) return;
        const $s = $(sliderEl);
        if (!$s.hasClass("slick-initialized")) return;
        requestAnimationFrame((() => {
            requestAnimationFrame((() => {
                $s.slick("setPosition");
                $s.slick("refresh");
            }));
        }));
    }
    function initInnerPreviewSliders() {
        const previewSliders = document.querySelectorAll(".preview-slider");
        previewSliders.forEach((slider => {
            if ($(slider).hasClass("slick-initialized")) return;
            $(slider).slick({
                slidesToShow: 1,
                infinite: false,
                arrows: false,
                dots: true,
                swipe: false,
                fade: true,
                speed: 100,
                lazyLoad: "ondemand"
            });
            const slickInstance = $(slider).slick("getSlick");
            const slideCount = slickInstance.slideCount;
            let lastIndex = null;
            slider.addEventListener("mousemove", (function(e) {
                const rect = slider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const width = rect.width;
                const segmentWidth = width / slideCount;
                let index = Math.floor(x / segmentWidth);
                index = Math.max(0, Math.min(index, slideCount - 1));
                if (index !== lastIndex) {
                    $(slider).slick("slickGoTo", index);
                    lastIndex = index;
                }
            }));
            slider.addEventListener("mouseleave", (function() {
                lastIndex = null;
            }));
            $(slider).on("mouseenter", ".slick-dots li", (function() {
                const dotIndex = $(this).index();
                $(slider).slick("slickGoTo", dotIndex);
            }));
        }));
    }
    window.addEventListener("DOMContentLoaded", (() => {
        initSliders();
        initInnerPreviewSliders();
    }));
    function initTagshotToggles() {
        const toggles = document.querySelectorAll(".tagshot__toggle");
        toggles.forEach((toggle => {
            let isLocked = false;
            toggle.addEventListener("click", (() => {
                if (isLocked) return;
                const parent = toggle.closest(".tagshot");
                if (!parent) return;
                const wrapper = parent.querySelector(".tagshot__wrapper");
                toggle.classList.toggle("_active");
                parent.classList.toggle("_active");
                _slideToggle(wrapper);
                isLocked = true;
                setTimeout((() => {
                    isLocked = false;
                }), 500);
            }));
        }));
        const tagshotSection = document.querySelector(".videolook__tagshot");
        if (window.innerWidth < 767.98 && tagshotSection) {
            tagshotSection.classList.remove("_active");
            const wrapper = tagshotSection.querySelector(".tagshot__wrapper");
            _slideUp(wrapper, 0);
        }
    }
    initTagshotToggles();
    let isCopyCoolDown = false;
    document.addEventListener("click", (function(e) {
        const targetElement = e.target;
        if (targetElement.classList.contains("copy-item__button") || targetElement.closest(".copy-item__button")) {
            if (isCopyCoolDown) return;
            const parent = targetElement.closest(".copy-item");
            const copyText = parent.querySelector(".copy-item__text");
            const textToCopy = copyText.textContent.trim();
            const button = targetElement.closest(".copy-item__button");
            const customText = button.dataset.text;
            const tooltip = document.createElement("div");
            tooltip.className = "copy-item__tooltip";
            tooltip.textContent = customText && customText.trim() !== "" ? customText : "Скопировано в буфер обмена";
            parent.appendChild(tooltip);
            const textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            _slideDown(tooltip, 300);
            isCopyCoolDown = true;
            setTimeout((() => {
                _slideUp(tooltip, 300);
                setTimeout((() => {
                    tooltip.remove();
                    isCopyCoolDown = false;
                }), 300);
            }), 2e3);
        }
        if (targetElement.classList.contains("location__button") || targetElement.closest(".location__button")) {
            targetElement.closest("body").classList.add("_location-active");
            bodyLock();
        }
        if (!targetElement.closest(".location-dropdown") && document.querySelectorAll("body._location-active").length > 0 && !targetElement.closest(".location__button")) {
            document.querySelector("body").classList.remove("_location-active");
            document.querySelector("body").classList.remove("_location-select");
            bodyUnlock();
        }
        if (targetElement.classList.contains("location-close") || targetElement.closest(".location-close")) {
            document.querySelector("body").classList.remove("_location-active");
            document.querySelector("body").classList.remove("_location-select");
            bodyUnlock();
        }
        if (targetElement.classList.contains("location-next") || targetElement.closest(".location-next")) document.querySelector("body").classList.add("_location-select");
    }));
    function initProductDetailsToggle() {
        const buttons = document.querySelectorAll(".product-details__button");
        if (!buttons.length) return;
        const html = document.documentElement;
        let activeButton = null;
        let activeTarget = null;
        let isLocked = false;
        const getScope = element => element.closest(".single-product") || element.closest(".shot-item__details") || document;
        const getTargetByButton = button => {
            const targetId = button.dataset.link;
            if (!targetId) return null;
            const scope = getScope(button);
            return scope.querySelector(`#${targetId}`) || document.getElementById(targetId);
        };
        const getButtonByTarget = target => {
            if (!target?.id) return null;
            const scope = getScope(target);
            return scope.querySelector(`.product-details__button[data-link="${target.id}"]`);
        };
        const getButtonBaseLabel = button => {
            if (!button) return "";
            if (!button.dataset.baseLabel) {
                const textNode = Array.from(button.childNodes).find((node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
                button.dataset.baseLabel = textNode ? textNode.textContent.trim() : "";
            }
            return button.dataset.baseLabel;
        };
        const closeActive = (fullClose = true) => {
            const activeScope = activeTarget?.closest(".shot-item__details");
            if (activeButton) activeButton.classList.remove("_active");
            if (activeTarget) activeTarget.classList.remove("_active");
            if (activeScope) activeScope.classList.remove("_option-open");
            if (fullClose) {
                html.classList.remove("_details-open");
                html.classList.remove("_shot-option-open");
                if (bodyLockStatus) bodyUnlock();
            }
            activeButton = null;
            activeTarget = null;
        };
        buttons.forEach((button => {
            const target = getTargetByButton(button);
            if (!target) return;
            button.addEventListener("click", (e => {
                e.stopPropagation();
                if (isLocked) return;
                isLocked = true;
                setTimeout((() => isLocked = false), 500);
                const isSame = activeButton === button;
                if (isSame) closeActive(); else {
                    closeActive(false);
                    button.classList.add("_active");
                    target.classList.add("_active");
                    html.classList.add("_details-open");
                    if (bodyLockStatus) bodyLock();
                    const targetScope = target.closest(".shot-item__details");
                    if (targetScope) {
                        targetScope.classList.add("_option-open");
                        html.classList.add("_shot-option-open");
                    }
                    activeButton = button;
                    activeTarget = target;
                }
            }));
        }));
        document.addEventListener("click", (e => {
            if (activeTarget && !activeTarget.contains(e.target) && !activeButton?.contains(e.target)) closeActive();
        }));
        document.addEventListener("click", (e => {
            const closeBtn = e.target.closest(".product-option__close");
            if (closeBtn) closeActive();
        }));
        document.addEventListener("click", (e => {
            const colorItem = e.target.closest(".colorSelector");
            if (!colorItem) return;
            const option = colorItem.closest(".product-option");
            const button = getButtonByTarget(option);
            const previewImg = colorItem.querySelector("img");
            const buttonImg = button?.querySelector("img");
            if (button && buttonImg && previewImg) {
                buttonImg.src = previewImg.getAttribute("src") || "";
                buttonImg.alt = previewImg.getAttribute("alt") || "";
            }
            const list = colorItem.closest("ul");
            if (list) list.querySelectorAll(".product-color.active").forEach((el => el.classList.remove("active")));
            const colorLi = colorItem.closest(".product-color");
            if (colorLi) colorLi.classList.add("active");
            closeActive();
        }));
        document.addEventListener("click", (e => {
            const sizeItem = e.target.closest(".sizeSelector");
            if (!sizeItem) return;
            const option = sizeItem.closest(".product-option");
            const sizeButton = getButtonByTarget(option);
            if (sizeButton) {
                const sizeValue = sizeItem.dataset.sizename || sizeItem.querySelector("span")?.textContent.trim() || sizeItem.textContent.trim();
                const sizeButtonIcon = sizeButton.querySelector("svg")?.outerHTML || "";
                const sizeButtonLabel = getButtonBaseLabel(sizeButton) || "������";
                sizeButton.classList.add("_active");
                sizeButton.innerHTML = `${sizeButtonLabel} <span>${sizeValue}</span>${sizeButtonIcon}`;
                sizeButton.dataset.value = sizeValue;
            }
            const list = sizeItem.closest("ul");
            if (list) list.querySelectorAll(".sizeSelector.active").forEach((el => el.classList.remove("active")));
            sizeItem.classList.add("active");
            closeActive();
        }));
    }
    initProductDetailsToggle();
    function watchProductHeadingStickyState() {
        const heading = document.querySelector(".product-heading");
        const actionsBlock = document.querySelector(".single-product__mobile-actions");
        const productName = document.querySelector(".single-product__about .single-product__name");
        if (!heading) return;
        const checkIntersection = () => {
            const headingRect = heading.getBoundingClientRect();
            if (actionsBlock) {
                const actionsRect = actionsBlock.getBoundingClientRect();
                if (headingRect.bottom >= actionsRect.top) heading.classList.add("product-heading_bg"); else heading.classList.remove("product-heading_bg");
            }
            if (productName) {
                const nameRect = productName.getBoundingClientRect();
                if (nameRect.top <= 0) heading.querySelector(".single-product__name").classList.add("_show"); else heading.querySelector(".single-product__name").classList.remove("_show");
            }
        };
        document.body.addEventListener("scroll", checkIntersection);
        window.addEventListener("resize", checkIntersection);
        window.addEventListener("load", checkIntersection);
    }
    function watchStickyEnd() {
        const triggers = document.querySelectorAll(".sticky-trigger");
        if (!triggers.length) return;
        triggers.forEach((trigger => {
            if (trigger.dataset.stickyObserved === "true") return;
            const scope = trigger.parentElement;
            const stickyBlock = scope?.querySelector(".product-details");
            const stickyOptions = scope?.querySelector(".single-product__options, .shot-item__options");
            if (!stickyBlock || !stickyOptions) return;
            const observer = new IntersectionObserver((([entry]) => {
                if (entry.isIntersecting) {
                    stickyBlock.classList.add("_is-not-stuck");
                    stickyOptions.classList.add("_is-not-stuck");
                } else {
                    stickyBlock.classList.remove("_is-not-stuck");
                    stickyOptions.classList.remove("_is-not-stuck");
                }
            }));
            observer.observe(trigger);
            trigger.dataset.stickyObserved = "true";
        }));
    }
    function initMobileOnlyProductWatchers() {
        const isMobile = window.matchMedia("(max-width: 574.98px)").matches;
        if (!isMobile) return;
        watchProductHeadingStickyState();
        watchStickyEnd();
    }
    window.addEventListener("DOMContentLoaded", initMobileOnlyProductWatchers);
    window.addEventListener("resize", initMobileOnlyProductWatchers);
    document.body.addEventListener("scroll", initMobileOnlyProductWatchers);
    window.addEventListener("DOMContentLoaded", (function() {
        $(document).ready((function() {
            const hash = window.location.hash;
            if (hash && $(hash).length) $.fancybox.open({
                src: hash,
                type: "inline",
                afterClose: function() {
                    if (history.replaceState) history.replaceState(null, null, window.location.pathname + window.location.search);
                }
            });
        }));
    }));
    function setAdaptiveHeights() {
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        const viewportH = document.documentElement.clientHeight;
        if (isDesktop) {
            const list = document.querySelector(".tagshot__list");
            if (!list) return;
            const rect = list.getBoundingClientRect();
            const docTop = rect.top + window.pageYOffset;
            let h = Math.floor(viewportH - docTop);
            h = Math.max(0, Math.min(h, viewportH));
            list.style.setProperty("--tagshot-list-h", `${h}px`);
        } else {
            const media = document.querySelector(".videolook__media");
            if (!media) return;
            const rect = media.getBoundingClientRect();
            const docTop = rect.top + window.pageYOffset;
            let h = Math.floor(viewportH - docTop);
            h = Math.max(0, Math.min(h, viewportH));
            media.style.setProperty("--videolook-media-h", `${h}px`);
        }
    }
    function initAdaptiveHeights() {
        setAdaptiveHeights();
        const rafUpdate = () => requestAnimationFrame(setAdaptiveHeights);
        window.addEventListener("resize", rafUpdate);
        window.addEventListener("orientationchange", rafUpdate);
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", rafUpdate);
            window.visualViewport.addEventListener("scroll", rafUpdate);
        }
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(rafUpdate);
    }
    document.addEventListener("DOMContentLoaded", initAdaptiveHeights);
    window.addEventListener("load", (() => {
        requestAnimationFrame(setAdaptiveHeights);
    }));
    function clampTime(t) {
        return Number.isFinite(t) && t > 0 ? t : 0;
    }
    function openVideoInFancybox(inlineWrap) {
        const grid = document.querySelector(".videolook__grid");
        if (!grid) return;
        const inlineVideo = grid.querySelector("video");
        if (!inlineVideo) return;
        const state = {
            time: clampTime(inlineVideo.currentTime),
            wasPlaying: !inlineVideo.paused && !inlineVideo.ended,
            muted: inlineVideo.muted,
            volume: inlineVideo.volume,
            playbackRate: inlineVideo.playbackRate
        };
        const placeholder = document.createComment("videolook__grid placeholder");
        const originalParent = grid.parentNode;
        const originalNextSibling = grid.nextSibling;
        inlineVideo.pause();
        const tpl = document.querySelector("#video-modal-template");
        if (!tpl) return;
        const node = tpl.content.firstElementChild.cloneNode(true);
        const mount = node.querySelector("[data-video-modal-mount]");
        if (!mount) return;
        originalParent.insertBefore(placeholder, originalNextSibling);
        mount.appendChild(grid);
        $.fancybox.open({
            type: "html",
            src: node,
            opts: {
                touch: false,
                smallBtn: true,
                toolbar: true,
                trapFocus: true,
                afterShow: async function() {
                    try {
                        inlineVideo.currentTime = state.time;
                    } catch (e) {}
                    inlineVideo.muted = state.muted;
                    inlineVideo.volume = state.volume;
                    inlineVideo.playbackRate = state.playbackRate;
                    if (state.wasPlaying) try {
                        await inlineVideo.play();
                    } catch (e) {}
                    requestAnimationFrame((() => {
                        requestAnimationFrame((() => {
                            $(".shot-slider__gallery.slick-initialized").slick("setPosition");
                        }));
                    }));
                },
                beforeClose: function() {
                    const t = clampTime(inlineVideo.currentTime);
                    if (placeholder.parentNode) {
                        placeholder.parentNode.insertBefore(grid, placeholder);
                        placeholder.remove();
                    } else if (originalParent) originalParent.appendChild(grid);
                    try {
                        inlineVideo.currentTime = t;
                    } catch (e) {}
                    if (state.wasPlaying) {
                        const p = inlineVideo.play();
                        if (p && typeof p.catch === "function") p.catch((() => {}));
                    }
                    requestAnimationFrame((() => {
                        requestAnimationFrame((() => {
                            $(".shot-slider__gallery.slick-initialized").slick("setPosition");
                        }));
                    }));
                }
            }
        });
    }
    function initVideoModal() {
        document.addEventListener("click", (e => {
            const btn = e.target.closest("[data-video-fullscreen]");
            if (!btn) return;
            const wrap = btn.closest("[data-video-modal]") || document;
            e.preventDefault();
            openVideoInFancybox(wrap);
        }));
    }
    document.addEventListener("DOMContentLoaded", initVideoModal);
    document.addEventListener("click", (e => {
        const front = e.target.closest(".shot-item__front");
        if (front) {
            const interactive = e.target.closest('button, a, input, select, textarea, label, [role="button"], [data-no-open]');
            if (interactive) return;
            const item = front.closest(".shot-item");
            if (item) {
                const itemParent = item.closest(".tagshot__list");
                itemParent.classList.add("scrollbar-off");
                item.classList.add("shot-item--active");
                const gallery = item.querySelector(".shot-slider__gallery");
                refreshSlick(gallery);
            }
            return;
        }
        const back = e.target.closest(".shot-item__back");
        if (back) {
            const item = back.closest(".shot-item");
            if (item) {
                const itemParent = item.closest(".tagshot__list");
                itemParent.classList.remove("scrollbar-off");
                item.classList.remove("shot-item--active");
            }
        }
    }));
    window["FLS"] = true;
    addLoadedClass();
    menuInit();
    spollers();
    showMore();
})();