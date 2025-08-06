(() => {
    "use strict";
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
    function updateHeaderOffset({saveInitial = false} = {}) {
        const header = document.querySelector(".header");
        if (!header) return;
        const rect = header.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const headerBottomAbsolute = rect.bottom + scrollY;
        document.documentElement.style.setProperty("--header-offset", `${headerBottomAbsolute}px`);
        if (saveInitial && !document.documentElement.style.getPropertyValue("--header-offset-initial")) document.documentElement.style.setProperty("--header-offset-initial", `${headerBottomAbsolute}px`);
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
    function updateHeaderHeightVar() {
        const header = document.querySelector(".header");
        if (!header) return;
        const height = header.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${height}px`);
    }
    window.addEventListener("DOMContentLoaded", updateHeaderHeightVar);
    window.addEventListener("resize", updateHeaderHeightVar);
    const catalogItems = document.querySelectorAll(".header-catalog");
    const html = document.documentElement;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    let activeItem = null;
    let hoverLock = false;
    let hoverTimeout = null;
    function openCatalog(item) {
        if (hoverLock) return;
        hoverLock = true;
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout((() => {
            hoverLock = false;
        }), 500);
        if (html.classList.contains("_search-show")) {
            html.classList.remove("_search-show");
            if (!html.classList.contains("menu-open") && bodyLockStatus) bodyUnlock();
        }
        if (activeItem && activeItem !== item) activeItem.classList.remove("_show");
        item.classList.add("_show");
        html.classList.add("_catalog-show");
        updateHeaderOffset();
        if (bodyLockStatus) bodyLock();
        activeItem = item;
    }
    function closeCatalog() {
        if (hoverLock) return;
        if (activeItem) {
            activeItem.classList.remove("_show");
            activeItem = null;
        }
        html.classList.remove("_catalog-show");
        if (!html.classList.contains("_search-show") && !html.classList.contains("menu-open")) if (bodyLockStatus) bodyUnlock();
    }
    catalogItems.forEach((item => {
        const toggle = item.querySelector(".header-catalog__toggle");
        if (isTouchDevice && toggle) toggle.addEventListener("click", (e => {
            e.stopPropagation();
            const isOpen = item.classList.contains("_show");
            if (isOpen) closeCatalog(); else openCatalog(item);
        }));
        if (!isTouchDevice) item.addEventListener("mouseenter", (() => {
            openCatalog(item);
        }));
    }));
    let closeTimeout = null;
    if (!isTouchDevice) {
        const header = document.querySelector(".header");
        if (header) {
            header.addEventListener("mouseleave", (() => {
                closeTimeout = setTimeout((() => {
                    closeCatalog();
                }), 500);
            }));
            header.addEventListener("mouseenter", (() => {
                if (closeTimeout) {
                    clearTimeout(closeTimeout);
                    closeTimeout = null;
                }
            }));
        }
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
                    const current = slick.currentSlide;
                    const total = slick.slideCount;
                    const toShow = slick.options.slidesToShow;
                    const isBeginning = current === 0;
                    const isEnd = current >= total - toShow;
                    const shouldHideArrows = total <= toShow;
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
            slickSettings: {
                slidesToShow: 1,
                dots: true
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
            slickSettings: {
                slidesToShow: 3,
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
            slickSettings: {
                slidesToShow: 4,
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
    window.addEventListener("DOMContentLoaded", initSliders);
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
    }));
    function initProductDetailsToggle() {
        const buttons = document.querySelectorAll(".product-details__button");
        if (!buttons.length) return;
        const html = document.documentElement;
        let activeButton = null;
        let activeTarget = null;
        let isLocked = false;
        const closeActive = (fullClose = true) => {
            if (activeButton) activeButton.classList.remove("_active");
            if (activeTarget) activeTarget.classList.remove("_active");
            if (fullClose) {
                html.classList.remove("_details-open");
                if (bodyLockStatus) bodyUnlock();
            }
            activeButton = null;
            activeTarget = null;
        };
        buttons.forEach((button => {
            const targetId = button.dataset.link;
            const target = document.getElementById(targetId);
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
        const stickyBlock = document.querySelector(".product-details");
        const stickyOptions = document.querySelector(".single-product__options");
        const trigger = document.querySelector(".sticky-trigger");
        if (!stickyBlock || !trigger) return;
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
    }
    function initMobileOnlyProductWatchers() {
        const isMobile = window.matchMedia("(max-width: 574.98px)").matches;
        if (!isMobile) return;
        watchProductHeadingStickyState();
        watchStickyEnd();
    }
    window.addEventListener("DOMContentLoaded", initMobileOnlyProductWatchers);
    window.addEventListener("resize", initMobileOnlyProductWatchers);
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
    window["FLS"] = true;
    menuInit();
    spollers();
    showMore();
})();