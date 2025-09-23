// Подключение функционала "Чертоги Фрилансера"
import { isMobile, bodyLock, bodyUnlock, bodyLockStatus, menuInit, getLockOwner, setLockOwner, setCloseSearchCallback, callCloseSearchIfNeeded, _slideDown, _slideUp, _slideToggle } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

// Высчитываем отступы, которые создает шапка
function updateHeaderOffset({ saveInitial = false } = {}) {
  const header = document.querySelector('.header');
  const topline = document.querySelector('.topline');
  if (!header || !topline) return;

  const rect = header.getBoundingClientRect();
  const totalDistance = rect.bottom;

  document.documentElement.style.setProperty('--header-offset', `${totalDistance}px`);

  if (saveInitial && !document.documentElement.style.getPropertyValue('--header-offset-initial')) {
    const initialOffset = topline.offsetHeight + header.offsetHeight;
    document.documentElement.style.setProperty('--header-offset-initial', `${initialOffset}px`);
  }
}
window.addEventListener('DOMContentLoaded', () => {
  updateHeaderOffset({ saveInitial: true });
  setTimeout(updateHeaderOffset({ saveInitial: true }), 100);
});
window.addEventListener('resize', updateHeaderOffset);
window.addEventListener('scroll', updateHeaderOffset);

// sticky sidebar
import "../libs/hc-sticky.fixed.js";
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth <= 574.98) return;

  const sidebar = document.querySelector('.single-product__info');
  const header = document.querySelector('header');
  if (!sidebar) return;

  const hh = header ? header.offsetHeight : 0;

  const sticky = new hcSticky(sidebar, {
    stickTo: '.single-product',
    top: hh
  });

  const spollerItems = document.querySelectorAll('.single-product .spollers__item');
  if (spollerItems.length > 0) {
    spollerItems.forEach(element => {
      element.addEventListener('click', function () {
        sticky.refresh()
      })
    });
  }
});

// Работа с выпадающим меню
const catalogItems = document.querySelectorAll('.header-catalog');
const html = document.documentElement;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

let activeItem = null;

function openCatalog(item) {
  // Если открыт поиск — закрываем
  if (html.classList.contains('_search-show')) {
    html.classList.remove('_search-show');

    if (!html.classList.contains('menu-open') && bodyLockStatus) {
      bodyUnlock();
    }
  }

  // Переключаем каталоги
  if (activeItem && activeItem !== item) {
    activeItem.classList.remove('_show');
  }

  item.classList.add('_show');
  html.classList.add('_catalog-show');
  updateHeaderOffset();

  activeItem = item;
}

function closeCatalog() {
  if (activeItem) {
    activeItem.classList.remove('_show');
    activeItem = null;
  }

  html.classList.remove('_catalog-show');
}

if (catalogItems && catalogItems.length > 0) {
  catalogItems.forEach(item => {
    const toggle = item.querySelector('.header-catalog__toggle');

    // Тач-устройства: клик
    if (isTouchDevice && toggle) {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();

        item.classList.contains('_show') ? closeCatalog() : openCatalog(item);
      });
    }

    // Десктоп: наведение
    if (!isTouchDevice) {
      item.addEventListener('mouseenter', () => {
        openCatalog(item);
      });
    }
  });
}

if (!isTouchDevice) {
  // Обработка наведения на любые пункты меню
  const menuItems = document.querySelectorAll('.header-menu__item');
  menuItems.forEach(menuItem => {
    menuItem.addEventListener('mouseenter', () => {
      // Если навели НЕ на .header-catalog, то закрываем каталог
      if (!menuItem.classList.contains('header-catalog')) {
        closeCatalog();
      } else {
        // Если навели на другой .header-catalog, откроем его
        if (activeItem !== menuItem) {
          openCatalog(menuItem);
        }
      }
    });
  });

  // Уже есть обработчик mouseleave на .header, он закрывает меню
  const header = document.querySelector('.header');
  if (header) {
    header.addEventListener('mouseleave', () => { closeCatalog(); });
  }
}

// Обработка табов в .header-catalog
const headerCatalogBlocks = document.querySelectorAll('.header-catalog');

function initHeaderCatalogTabs() {
  headerCatalogBlocks.forEach(catalog => {
    const buttons = catalog.querySelectorAll('.header-catalog__title');
    const tabs = catalog.querySelectorAll('.header-catalog__body');

    // Обработка табов
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        tabs.forEach(tab => tab.classList.remove('_active'));
        buttons.forEach(btn => btn.classList.remove('_active'));

        tabs[index]?.classList.add('_active');
        button.classList.add('_active');
      });
    });
  });

  const allItems = document.querySelectorAll('.header-catalog__item');

  allItems.forEach(item => {
    const parent = item.closest('.header-catalog'); // ищем в рамках одного блока
    const siblings = parent?.querySelectorAll('.header-catalog__item');

    item.addEventListener('mouseenter', () => {
      siblings?.forEach(i => i.classList.remove('_hover'));
      item.classList.add('_hover');
    });
  });
}


function initBackButtons() {
  headerCatalogBlocks.forEach(catalog => {
    const buttons = catalog.querySelectorAll('.header-catalog__title');
    const tabs = catalog.querySelectorAll('.header-catalog__body');

    tabs.forEach((tab, index) => {
      const backButton = tab.querySelector('.header-catalog__body-back');

      if (backButton) {
        backButton.addEventListener('click', () => {
          if (window.innerWidth < 768) {
            tab.classList.remove('_active');
            buttons[index]?.classList.remove('_active');
          }
        });
      }
    });
  });
}

function resetHeaderCatalogTabsIfMobile() {
  if (window.innerWidth < 768) {
    headerCatalogBlocks.forEach(catalog => {
      const buttons = catalog.querySelectorAll('.header-catalog__title._active');
      const tabs = catalog.querySelectorAll('.header-catalog__body._active');

      buttons.forEach(btn => btn.classList.remove('_active'));
      tabs.forEach(tab => tab.classList.remove('_active'));
    });
  }
}

initHeaderCatalogTabs();
initBackButtons();
resetHeaderCatalogTabsIfMobile();
window.addEventListener('resize', resetHeaderCatalogTabsIfMobile);
window.addEventListener('DOMContentLoaded', resetHeaderCatalogTabsIfMobile);

// Обновляем координаты для меню в бургере
menuInit(() => {
  updateHeaderOffset();
  closeCatalog();
});

const catalogBack = document.querySelectorAll('.header-catalog__back');
catalogBack.forEach(element => {
  element.addEventListener('click', function () {
    closeCatalog();
  })
});

const searchToggle = document.querySelector('.search__up');
const searchClose = document.querySelector('.search__close');

function openSearch() {
  if (html.classList.contains('_catalog-show')) {
    const activeCatalog = document.querySelector('.header-catalog._show');
    if (activeCatalog) {
      activeCatalog.classList.remove('_show');
    }
    html.classList.remove('_catalog-show');
  }

  if (html.classList.contains('menu-open')) {
    html.classList.remove('menu-open');
  }

  html.classList.add('_search-show');
  if (bodyLockStatus) bodyLock(500, 'search'); // указываем владельца
  updateHeaderOffset();
}

function closeSearch() {
  html.classList.remove('_search-show');
  if (!html.classList.contains('menu-open')) {
    bodyUnlock(500, 'search'); // разлочим только если мы владелец
  }
}
setCloseSearchCallback(closeSearch);


if (searchToggle) {
  searchToggle.addEventListener('click', () => {
    if (!bodyLockStatus) return;

    if (html.classList.contains('_search-show')) {
      closeSearch();
    } else {
      openSearch();
    }
  });
}
if (searchClose) {
  searchClose.addEventListener('click', () => {
    if (!bodyLockStatus) return;
    closeSearch();
  });
}

// Клик вне области поиска
document.addEventListener('click', (e) => {
  if (
    html.classList.contains('_search-show') &&
    !e.target.closest('.search') &&
    !e.target.closest('.search__up')
  ) {
    closeSearch();
  }
});
// Закрываем поиск на Escape
document.addEventListener('keydown', (e) => {
  const html = document.documentElement;

  if (e.key === 'Escape' && html.classList.contains('_search-show')) {
    html.classList.remove('_search-show');

    // Если не открыто меню — разблокируем скролл
    if (!html.classList.contains('menu-open') && typeof bodyUnlock === 'function' && bodyLockStatus) {
      bodyUnlock();
    }
  }
});

// Показываем видео, только когда оно в поле зрения пользователя, если ушли, то останавливаем его
document.addEventListener("DOMContentLoaded", () => {
  const videos = document.querySelectorAll('video._autoplay');

  if ('IntersectionObserver' in window && videos.length) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
          if (video.paused) {
            video.play().catch(() => { });
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, options);

    videos.forEach(video => {
      observer.observe(video);
    });
  }
});

// Слайдеры
function initSliders() {
  function initCustomSlickSlider(options) {
    const {
      rootSelector,
      sliderSelector,
      slickSettings,
      enableBelow, // например: 992
      dotsContainerSelector // добавили для кастомных dots
    } = options;

    const blocks = document.querySelectorAll(rootSelector);
    if (!blocks.length) return;

    blocks.forEach(block => {
      const slider = block.querySelector(sliderSelector);
      const prevBtn = block.querySelector('.slider-arrow_prev');
      const nextBtn = block.querySelector('.slider-arrow_next');
      const dotsContainer = dotsContainerSelector ? block.querySelector(dotsContainerSelector) : null;

      if (!slider) return;

      let isInitialized = false;

      const updateArrows = (slick) => {
        // Проверка: обновлять только если slick-контейнер совпадает с текущим слайдером
        if (!slick.$slider.is(slider)) return;

        const current = slick.currentSlide;
        const total = slick.slideCount;
        const toShow = slick.options.slidesToShow;

        const isBeginning = current === 0;
        const isEnd = current >= total - toShow;
        const shouldHideArrows = Math.ceil(total) <= Math.ceil(toShow);

        prevBtn?.classList.toggle('_disabled', isBeginning);
        nextBtn?.classList.toggle('_disabled', isEnd);

        if (shouldHideArrows) {
          prevBtn && (prevBtn.style.display = 'none');
          nextBtn && (nextBtn.style.display = 'none');
        } else {
          prevBtn && (prevBtn.style.display = '');
          nextBtn && (nextBtn.style.display = '');
        }
      };

      const setupSlider = () => {
        if (enableBelow && window.innerWidth >= enableBelow) {
          if (isInitialized) {
            $(slider).slick('unslick');
            isInitialized = false;
          }
          return;
        }

        if (!isInitialized) {
          $(slider).on('init reInit afterChange', function (e, slick) {
            updateArrows(slick);
          });

          $(slider).slick({
            arrows: false,
            infinite: false,
            dots: !!dotsContainer,
            appendDots: dotsContainer || undefined,
            customPaging: function () {
              return '<button type="button" class="dot"></button>';
            },
            ...slickSettings
          });

          $(slider).on('init', function (e, slick) {
            setTimeout(() => updateArrows(slick), 0);
          });

          prevBtn?.addEventListener('click', () => {
            $(slider).slick('slickPrev');
          });

          nextBtn?.addEventListener('click', () => {
            $(slider).slick('slickNext');
          });

          isInitialized = true;
        }
      };

      setupSlider();
      window.addEventListener('resize', setupSlider);
    });
  }

  // hero
  initCustomSlickSlider({
    rootSelector: '.hero',
    sliderSelector: '.hero__slider-wrapper',
    lazyLoad: 'ondemand',
    slickSettings: {
      slidesToShow: 1,
      dots: true,
    }
  });

  // stylist
  initCustomSlickSlider({
    rootSelector: '.stylist',
    sliderSelector: '.stylist__slider',
    // lazyLoad: 'ondemand',
    slickSettings: {
      slidesToShow: 8.5,
      responsive: [
        { breakpoint: 1600, settings: { slidesToShow: 8 } },
        { breakpoint: 1440, settings: { slidesToShow: 7 } },
        { breakpoint: 1280, settings: { slidesToShow: 6 } },
        { breakpoint: 992, settings: { slidesToShow: 5 } },
        { breakpoint: 768, settings: { slidesToShow: 4 } },
        { breakpoint: 575, settings: { slidesToShow: 3.6 } },
      ]
    }
  });

  // widget-products
  initCustomSlickSlider({
    rootSelector: '.widget-products',
    sliderSelector: '.widget-products__slider',
    lazyLoad: 'ondemand',
    slickSettings: {
      slidesToShow: 3,
      useTransform: window.innerWidth > 767.98,
      responsive: [
        { breakpoint: 767.98, settings: { slidesToShow: 2.5 } },
        { breakpoint: 479.98, settings: { slidesToShow: 1.5 } },
      ]
    }
  });

  // widget-category
  initCustomSlickSlider({
    rootSelector: '.widget-category',
    sliderSelector: '.widget-category__slider',
    lazyLoad: 'ondemand',
    slickSettings: {
      slidesToShow: 4.7,
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: 4 } },
        { breakpoint: 992, settings: { slidesToShow: 3.3 } },
        { breakpoint: 768, settings: { slidesToShow: 2.5 } },
        { breakpoint: 575, settings: { slidesToShow: 2.3 } },
        { breakpoint: 480, settings: { slidesToShow: 2.05 } },
      ]
    }
  });

  // widget-featured
  initCustomSlickSlider({
    rootSelector: '.widget-featured',
    sliderSelector: '.widget-featured__slider',
    lazyLoad: 'ondemand',
    slickSettings: {
      slidesToShow: 4,
      useTransform: window.innerWidth > 767.98,
      responsive: [
        { breakpoint: 992, settings: { slidesToShow: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 2.7 } },
        { breakpoint: 575, settings: { slidesToShow: 2.5 } },
        { breakpoint: 480, settings: { slidesToShow: 2.1 } },
      ]
    }
  });

  // single-product
  initCustomSlickSlider({
    rootSelector: '.single-product',
    sliderSelector: '.single-product__gallery',
    enableBelow: 574.98,
    dotsContainerSelector: '.single-product__dots',
    slickSettings: {
      slidesToShow: 1,
    }
  });

  // Реализуем свайп по слайдеру, чтобы страница скроллилась
  function initGallerySwipeScroll() {
    if (window.innerWidth > 574.98) return;

    const gallery = document.querySelector('.single-product__gallery');
    if (!gallery) return;

    let startY = 0;
    let startX = 0;
    let lastY = 0;
    let isVerticalScroll = null;
    let velocity = 0;
    let lastMoveTime = 0;
    let inertiaFrame;

    gallery.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;

      startY = lastY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isVerticalScroll = null;
      velocity = 0;
      cancelAnimationFrame(inertiaFrame);
      lastMoveTime = Date.now();
    });

    gallery.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      const diffY = currentY - lastY;

      // Определим направление
      if (isVerticalScroll === null) {
        isVerticalScroll = Math.abs(diffY) > Math.abs(diffX);
      }

      if (isVerticalScroll) {
        e.preventDefault();

        const now = Date.now();
        const dt = now - lastMoveTime || 16;

        velocity = -diffY / dt * 20; // нормализуем на 60fps

        // document.body.scrollBy(0, -diffY);
        document.body.scrollTop += velocity;

        lastY = currentY;
        lastMoveTime = now;
      } else {
        e.preventDefault(); // блокируем горизонтальные свайпы
      }
    }, { passive: false });

    gallery.addEventListener('touchend', () => {
      if (!isVerticalScroll || Math.abs(velocity) < 0.5) return;

      const friction = 0.95;

      function inertiaStep() {
        if (Math.abs(velocity) < 0.1) return;

        document.body.scrollBy(0, velocity);
        velocity *= friction;

        inertiaFrame = requestAnimationFrame(inertiaStep);
      }

      inertiaStep();
    });
  }

  initGallerySwipeScroll();
  window.addEventListener('resize', initGallerySwipeScroll);
}

function initInnerPreviewSliders() {
  const previewSliders = document.querySelectorAll('.preview-slider');

  previewSliders.forEach(slider => {
    if ($(slider).hasClass('slick-initialized')) return;

    $(slider).slick({
      slidesToShow: 1,
      infinite: false,
      arrows: false,
      dots: true,
      swipe: false,
      fade: true,
      speed: 100,
      lazyLoad: 'ondemand',
    });

    const slickInstance = $(slider).slick('getSlick');
    const slideCount = slickInstance.slideCount;

    let lastIndex = null;

    slider.addEventListener('mousemove', function (e) {
      const rect = slider.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;

      const segmentWidth = width / slideCount;
      let index = Math.floor(x / segmentWidth);

      // ограничение по индексам
      index = Math.max(0, Math.min(index, slideCount - 1));

      if (index !== lastIndex) {
        $(slider).slick('slickGoTo', index);
        lastIndex = index;
      }
    });

    slider.addEventListener('mouseleave', function () {
      lastIndex = null;
    });

    $(slider).on('mouseenter', '.slick-dots li', function () {
      const dotIndex = $(this).index();
      $(slider).slick('slickGoTo', dotIndex);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initInnerPreviewSliders();
});

// lookspot 
function initTagshotToggles() {
  const toggles = document.querySelectorAll('.tagshot__toggle');

  toggles.forEach(toggle => {
    let isLocked = false;

    toggle.addEventListener('click', () => {
      if (isLocked) return;

      const parent = toggle.closest('.tagshot');
      if (!parent) return;

      const wrapper = parent.querySelector('.tagshot__wrapper');

      toggle.classList.toggle('_active');
      parent.classList.toggle('_active');
      _slideToggle(wrapper);

      isLocked = true;
      setTimeout(() => {
        isLocked = false;
      }, 500); // Блокируем повторный клик на 0.5 секунды
    });
  });
}
initTagshotToggles();

// Флаг для отслеживания состояния блокировки кнопки копирования
let isCopyCoolDown = false;
document.addEventListener('click', function (e) {
  const targetElement = e.target;

  // Копируем содержимое при клике на кнопку
  if (targetElement.classList.contains('copy-item__button') || targetElement.closest('.copy-item__button')) {
    if (isCopyCoolDown) {
      return;
    };

    const parent = targetElement.closest('.copy-item');
    const copyText = parent.querySelector('.copy-item__text');
    const textToCopy = copyText.textContent.trim();
    const button = targetElement.closest('.copy-item__button');
    const customText = button.dataset.text;

    // Создаем и добавляем тултип
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-item__tooltip';
    tooltip.textContent = customText && customText.trim() !== ''
      ? customText
      : 'Скопировано в буфер обмена';
    parent.appendChild(tooltip);

    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    // Показываем тултип
    _slideDown(tooltip, 300);
    isCopyCoolDown = true;

    // Через 1.5 секунды начинаем скрывать тултип
    setTimeout(() => {
      _slideUp(tooltip, 300);

      // После завершения анимации удаляем тултип и снимаем блокировку
      setTimeout(() => {
        tooltip.remove();
        isCopyCoolDown = false;
      }, 300);
    }, 2000);
  }

  // Показываем выбор города
  if (targetElement.classList.contains('location__button') || targetElement.closest('.location__button')) {
    targetElement.closest('body').classList.add('_location-active');
    bodyLock();
  }
  if (!targetElement.closest('.location-dropdown') && document.querySelectorAll('body._location-active').length > 0 && !targetElement.closest('.location__button')) {
    document.querySelector('body').classList.remove('_location-active');
    document.querySelector('body').classList.remove('_location-select');
    bodyUnlock();
  }
  if ((targetElement.classList.contains('location-close') || targetElement.closest('.location-close'))) {
    document.querySelector('body').classList.remove('_location-active');
    document.querySelector('body').classList.remove('_location-select');
    bodyUnlock();
  }
  if ((targetElement.classList.contains('location-next') || targetElement.closest('.location-next'))) {
    document.querySelector('body').classList.add('_location-select');
  }
})

// Показываем опции товара
function initProductDetailsToggle() {
  const buttons = document.querySelectorAll('.product-details__button');
  if (!buttons.length) return;

  const html = document.documentElement;
  let activeButton = null;
  let activeTarget = null;
  let isLocked = false;

  const closeActive = (fullClose = true) => {
    if (activeButton) activeButton.classList.remove('_active');
    if (activeTarget) activeTarget.classList.remove('_active');

    if (fullClose) {
      html.classList.remove('_details-open');
      if (bodyLockStatus) bodyUnlock();
    }

    activeButton = null;
    activeTarget = null;
  };

  buttons.forEach(button => {
    const targetId = button.dataset.link;
    const target = document.getElementById(targetId);
    if (!target) return;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLocked) return;
      isLocked = true;
      setTimeout(() => (isLocked = false), 500);

      const isSame = activeButton === button;

      if (isSame) {
        closeActive(); // закрываем с unlock
      } else {
        closeActive(false); // закрываем без unlock
        button.classList.add('_active');
        target.classList.add('_active');
        html.classList.add('_details-open');
        if (bodyLockStatus) bodyLock();

        activeButton = button;
        activeTarget = target;
      }
    });
  });

  // Клик вне области
  document.addEventListener('click', (e) => {
    if (
      activeTarget &&
      !activeTarget.contains(e.target) &&
      !activeButton?.contains(e.target)
    ) {
      closeActive();
    }
  });

  // Кнопка .product-option__close
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.product-option__close');
    if (closeBtn) {
      closeActive();
    }
  });
}
initProductDetailsToggle();

// Показываем фон для шапки у продукта и название товара
function watchProductHeadingStickyState() {
  const heading = document.querySelector('.product-heading');
  const actionsBlock = document.querySelector('.single-product__mobile-actions');
  const productName = document.querySelector('.single-product__about .single-product__name');

  if (!heading) return;

  const checkIntersection = () => {
    const headingRect = heading.getBoundingClientRect();

    // Проверка столкновения со .single-product__mobile-actions
    if (actionsBlock) {
      const actionsRect = actionsBlock.getBoundingClientRect();
      if (headingRect.bottom >= actionsRect.top) {
        heading.classList.add('product-heading_bg');
      } else {
        heading.classList.remove('product-heading_bg');
      }
    }

    // Проверка, проскроллили ли .single-product__name
    if (productName) {
      const nameRect = productName.getBoundingClientRect();
      if (nameRect.top <= 0) {
        heading.querySelector('.single-product__name').classList.add('_show');
      } else {
        heading.querySelector('.single-product__name').classList.remove('_show');
      }
    }
  };

  document.body.addEventListener('scroll', checkIntersection);
  window.addEventListener('resize', checkIntersection);
  window.addEventListener('load', checkIntersection);
}

// Отслеживаем отлипание product-details
function watchStickyEnd() {
  const stickyBlock = document.querySelector('.product-details'); // Тот, кому добавим класс
  const stickyOptions = document.querySelector('.single-product__options'); // Тот, кому добавим класс
  const trigger = document.querySelector('.sticky-trigger');

  if (!stickyBlock || !trigger) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      stickyBlock.classList.add('_is-not-stuck');
      stickyOptions.classList.add('_is-not-stuck');
    } else {
      stickyBlock.classList.remove('_is-not-stuck');
      stickyOptions.classList.remove('_is-not-stuck');
    }
  });

  observer.observe(trigger);
}

function initMobileOnlyProductWatchers() {
  const isMobile = window.matchMedia('(max-width: 574.98px)').matches;
  if (!isMobile) return;

  // Показываем фон для шапки у продукта и название товара
  watchProductHeadingStickyState();

  // Отслеживаем отлипание product-details
  watchStickyEnd();
}

window.addEventListener('DOMContentLoaded', initMobileOnlyProductWatchers);
window.addEventListener('resize', initMobileOnlyProductWatchers);
document.body.addEventListener('scroll', initMobileOnlyProductWatchers);

// Показываем модалку
window.addEventListener('DOMContentLoaded', function () {
  $(document).ready(function () {
    const hash = window.location.hash;

    if (hash && $(hash).length) {
      $.fancybox.open({
        src: hash,
        type: 'inline',
        afterClose: function () {
          // Чистим hash после закрытия
          if (history.replaceState) {
            history.replaceState(null, null, window.location.pathname + window.location.search);
          }
        }
      });
    }
  });
});