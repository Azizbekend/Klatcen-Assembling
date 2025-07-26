// ShowMore Beta ========================
let moreBlocks = document.querySelectorAll('._more-block');
if (moreBlocks.length > 0) {
    let wrapper = document.querySelector('.wrapper');
    for (let index = 0; index < moreBlocks.length; index++) {
        const moreBlock = moreBlocks[index];
        let items = moreBlock.querySelectorAll('._more-item');
        if (items.length > 0) {
            let itemsMore = moreBlock.querySelector('._more-link');
            let itemsContent = moreBlock.querySelector('._more-content');
            let itemsView = itemsContent.getAttribute('data-view');
            if (getComputedStyle(itemsContent).getPropertyValue("transition-duration") === '0s') {
                itemsContent.style.cssText = "transition-duration: 1ms";
            }
            itemsMore.addEventListener("click", function (e) {
                if (itemsMore.classList.contains('_active')) {
                    setSize();
                } else {
                    setSize('start');
                }
                itemsMore.classList.toggle('_active');
                e.preventDefault();
            });

            let isScrollStart;
            function setSize(type) {
                let resultHeight;
                let itemsContentHeight = 0;
                let itemsContentStartHeight = 0;

                for (let index = 0; index < items.length; index++) {
                    if (index < itemsView) {
                        itemsContentHeight += items[index].offsetHeight;
                    }
                    itemsContentStartHeight += items[index].offsetHeight;
                }
                resultHeight = (type === 'start') ? itemsContentStartHeight : itemsContentHeight;
                isScrollStart = window.innerWidth - wrapper.offsetWidth;
                itemsContent.style.height = `${resultHeight}px`;
            }

            itemsContent.addEventListener("transitionend", updateSize, false);

            function updateSize() {
                let isScrollEnd = window.innerWidth - wrapper.offsetWidth;
                if (isScrollStart === 0 && isScrollEnd > 0 || isScrollStart > 0 && isScrollEnd === 0) {
                    if (itemsMore.classList.contains('_active')) {
                        setSize('start');
                    } else {
                        setSize();
                    }
                }
            }
            window.addEventListener("resize", function (e) {
                if (!itemsMore.classList.contains('_active')) {
                    setSize();
                } else {
                    setSize('start');
                }
            });
            setSize();
        }
    }
}