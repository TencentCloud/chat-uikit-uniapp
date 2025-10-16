import { isIOS } from '@tencentcloud/universal-api';
const ua = navigator.userAgent;

function getScrollTypeByPlatform() {
  if (isIOS) {
    if (/Safari\//.test(ua) || /IOS 11_[0-3]\D/.test(ua)) {
      // Safari IOS 11.0-11.3 exclude（`scrollTop`/`scrolIntoView` not working）
      return 0;
    }
    // IOS: use `scrollTop`
    return 1;
  }
  // Android: use `scrollIntoView`
  return 2;
}

function createKeyboardHeightObserver(callback: (height: number) => void) {
  const initialViewportHeight = window.innerHeight;
  let lastKeyboardHeight = 0;

  if (window.visualViewport) {
    const handleViewportChange = () => {
      const currentViewportHeight = window.visualViewport!.height;
      const keyboardHeight = initialViewportHeight - currentViewportHeight;

      if (Math.abs(keyboardHeight - lastKeyboardHeight) > 10) {
        lastKeyboardHeight = keyboardHeight;
        callback(keyboardHeight > 0 ? keyboardHeight : 0);
      }
    };

    window.visualViewport.addEventListener('resize', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
    };
  }

  const handleWindowResize = () => {
    const currentHeight = window.innerHeight;
    const keyboardHeight = initialViewportHeight - currentHeight;

    if (Math.abs(keyboardHeight - lastKeyboardHeight) > 10) {
      lastKeyboardHeight = keyboardHeight;
      callback(keyboardHeight > 0 ? keyboardHeight : 0);
    }
  };

  window.addEventListener('resize', handleWindowResize);

  return () => {
    window.removeEventListener('resize', handleWindowResize);
  };
}

function adjustPageHeight(keyboardHeight: number) {
  const possibleContainers = [
    document.getElementById('app'),
    document.querySelector('.app'),
    document.querySelector('[data-app]'),
    document.body,
  ];

  const container = possibleContainers.find(el => el !== null) as HTMLElement;
  if (!container) return;

  if (keyboardHeight > 0) {
    container.style.paddingBottom = '';
    container.style.transition = '';

    const timer = setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && activeElement.scrollIntoView) {
        const elementRect = activeElement.getBoundingClientRect();
        const currentViewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        if (elementRect.bottom > currentViewportHeight - 50) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
        }
      }
      clearTimeout(timer);
    }, 100);
  } else {
    container.style.paddingBottom = '';
    const timer = setTimeout(() => {
      container.style.transition = '';
      clearTimeout(timer);
    }, 250);
  }
}

export default function riseInput(input: HTMLElement, target?: HTMLElement) {
  const scrollType = getScrollTypeByPlatform();
  let scrollTimer: ReturnType<typeof setTimeout>;
  let keyboardObserver: (() => void) | null = null;

  if (!target) {
    // eslint-disable-next-line no-param-reassign
    target = input;
  }

  const scrollIntoView = () => {
    if (scrollType === 0) return;
    if (scrollType === 1) {
      document.body.scrollTop = document.body.scrollHeight;
    } else {
      target?.scrollIntoView(false);
    }
  };

  if (isIOS) {
    keyboardObserver = createKeyboardHeightObserver((keyboardHeight) => {
      adjustPageHeight(keyboardHeight);
      if (keyboardHeight > 0 && document.activeElement === input) {
        const timer = setTimeout(() => {
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
          });
          clearTimeout(timer);
        }, 200);
      }
    });
  }

  input.addEventListener('focus', () => {
    const timer = setTimeout(() => {
      scrollIntoView();
      clearTimeout(timer);
    }, 300);
    scrollTimer = setTimeout(scrollIntoView, 1000);
  });

  input.addEventListener('blur', () => {
    clearTimeout(scrollTimer);
    // Handle IOS issues about keyboard is hidden but page not refreshed
    if (scrollType && isIOS) {
      const timer = setTimeout(() => {
        if (!keyboardObserver) {
          document.body.scrollIntoView();
          adjustPageHeight(0);
        }
        clearTimeout(timer);
      }, 300);
    }
  });

  return () => {
    clearTimeout(scrollTimer);
    keyboardObserver?.();
  };
}
