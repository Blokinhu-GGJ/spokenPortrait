const NUMBER_OF_IMAGES = 23;

document.addEventListener('DOMContentLoaded', () => {
    const canvasArea = document.getElementById('canvasArea');
    const canvasRect = canvasArea.getBoundingClientRect();

    let draggedImage = null;
    let offsetX, offsetY;

    let slots = [];

    for (let i = 0; i < 5; i++) {
        slots[i] = document.getElementById('slot' + (i + 1));
    }

    console.log(slots);


    let possibleImages = [];

    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
        possibleImages.push('img' + i);
    }

    let playerImages = [];

    fillSlots();

    function fillSlots() {
        for (let i = 0; i < 5; i++) {
            if (slots[i].classList.contains('empty')) {
                let rand = Math.random();
                let randIndex = Math.floor(rand * possibleImages.length);
                playerImages[i] = (possibleImages[randIndex]);
            }
        }
    }

    updateSlots(playerImages);

    function updateSlots(imageArray) {
        for (let i = 0; i < 5; i++) {
            if (slots[i].classList.contains('empty')) {
                createSlotElement(i, imageArray[i]);
                slots[i].classList.remove('empty');
            }
        }
    }

    function createSlotElement(i, newImage) {
        const newShape = document.createElement('img');
        newShape.src = `img/${newImage}.png`;
        newShape.className = 'draggable';
        newShape.draggable = true;

        // Generate a random rotation between 0 and 360 degrees
        //var randomRotation = Math.floor(Math.random() * 360);

        // Generate a random scale factor between 0.5 (half size) and 1.5 (1.5 times the size), for example
        //var randomScale = 0.5 + Math.random() * 0.5; // Adjust the range as needed

        // Apply the transformation to the element
        //newShape.style.transform = 'rotate(' + randomRotation + 'deg) scale(' + randomScale + ')';

        // If you also want to ensure the element is centered after transformation, consider adding:
        //newShape.style.transformOrigin = 'center';

        newShape.addEventListener('dragstart', e => {
            draggedImage = e.target;
        });
        

        newShape.addEventListener('mousedown', dragAndDropEventListener);
        slots[i].appendChild(newShape);
    }


    function dragAndDropEventListener(e) {
            // Prevent default to avoid any native drag behavior
            e.preventDefault();

            draggedImage = e.target;
            currentTarget = e.currentTarget;

            const parent = draggedImage.parentElement;

            offsetX = e.offsetX;
            offsetY = e.offsetY;

            // Temporarily position the image absolutely to move it with the cursor
            draggedImage.style.position = 'absolute';
            moveAt(e.pageX, e.pageY);
            canvasArea.appendChild(draggedImage);

            function moveAt(pageX, pageY) {
                draggedImage.style.left = pageX - offsetX + 'px';
                draggedImage.style.top = pageY - offsetY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            // Move the image on mousemove
            document.addEventListener('mousemove', onMouseMove);

            // Drop the image, remove mousemove event
            draggedImage.onmouseup = function () {
                // Check if the image is inside the canvas
                const imgRect = draggedImage.getBoundingClientRect();
                if (
                    !(imgRect.top >= canvasRect.top &&
                        imgRect.left >= canvasRect.left &&
                        imgRect.right <= canvasRect.right &&
                        imgRect.bottom <= canvasRect.bottom)
                ) {
                    // The image is NOT inside the canvas
                    console.log('Image is not inside the canvas');
                    document.removeEventListener('mousemove', onMouseMove);
                    draggedImage.style.position = 'relative';
                    draggedImage.style.left = 0 + 'px';
                    draggedImage.style.top = 0 + 'px';
                    parent.appendChild(draggedImage);
                }

                else {
                    console.log('Image left inside canvas');
                    currentTarget.removeEventListener('mousedown', dragAndDropEventListener);
                    draggedImage.removeEventListener('mousedown', dragAndDropEventListener);
                    document.removeEventListener('mousemove', onMouseMove);

                    draggedImage.onmouseup = null; // Remove the event listener to prevent potential memory leaks

                    draggedImage.draggable = false;
                    draggedImage.classList.remove('draggable');


                    parent.classList.add('empty');
                    fillSlots();
                    updateSlots(playerImages);
                }
            };
    }

    function dragBackElement(element, parent, onMouseMove) {
        document.removeEventListener('mousemove', onMouseMove);
        element.style.position = 'relative';
        element.style.left = 0 + 'px';
        element.style.top = 0 + 'px';
        parent.appendChild(element);
    }

    // Prevent default drag behavior
    canvasArea.addEventListener('dragstart', e => {
        e.preventDefault();
    });

    canvasArea.addEventListener('dragover', e => {
        e.preventDefault();
    });
});
