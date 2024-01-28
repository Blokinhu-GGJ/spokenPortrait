const NUMBER_OF_IMAGES = 12;

let playerImages = ['', '', '', '', ''];


function initializeCanvas(playerColor = '#000000') {
    const canvasArea = document.getElementById('canvasArea');
    const canvasRect = canvasArea.getBoundingClientRect();

    let draggedImage = null;
    let offsetX, offsetY;

    let slots = [];

    for (let i = 0; i < 5; i++) {
        slots[i] = document.getElementById('slot' + (i + 1));
    }

    let possibleImages = [];

    for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
        possibleImages.push('img' + i);
    }



    fillSlots();

    function fillSlots() {
        for (let i = 0; i < 5; i++) {
            //if (slots[i].classList.contains('empty')) {
            while (slots[i].firstChild) {
                slots[i].removeChild(slots[i].firstChild);
            }
            slots[i].classList.add('empty');
            let newImage = false;
            while (newImage == false) {
                let rand = Math.random();
                let randIndex = Math.floor(rand * possibleImages.length);
                newImage = true;
                for (let j = 0; j < 5; j++) {
                    if (playerImages[j] == possibleImages[randIndex]) {
                        newImage = false;
                    }
                }
                if (newImage) {
                    playerImages[i] = (possibleImages[randIndex]);
                }
                else {
                    newImage = false;
                }
            }
            //}
        }
    }

    updateSlots(playerImages);

    function updateSlots(imageArray) {
        for (let i = 0; i < 5; i++) {
            if (slots[i].classList.contains('empty')) {
                createSlotElement(i, playerImages[i]);
                slots[i].classList.remove('empty');
            }
        }
    }

    function createSlotElement(i, newImage) {
        const newShape = document.createElement('img');
        const wrapper = document.createElement('div');
        const animationWrapper = document.createElement('div');

        newShape.src = `img/${newImage}.png`;
        console.log(playerColor);
        newShape.style.filter = `
        opacity(0.2)
        drop-shadow(0 0 0 ${playerColor})
        drop-shadow(0 0 0 ${playerColor})
        drop-shadow(0 0 0 ${playerColor})
        drop-shadow(0 0 0 ${playerColor})
        drop-shadow(0 0 0 ${playerColor})`;
        wrapper.className = 'draggable';
        wrapper.draggable = true;



        var randomRotation = Math.floor(Math.random() * 360);
        var randomScale = 0.8 + Math.random() * 0.4; // Adjust the range as needed

        newShape.style.transform = 'rotate(' + randomRotation + 'deg) scale(' + randomScale + ')';
        newShape.style.transformOrigin = 'center';

        wrapper.addEventListener('dragstart', e => {
            draggedImage = e.target;
        });

        wrapper.addEventListener('mousedown', dragAndDropMouseEventListener);
        wrapper.addEventListener('touchstart', dragAndDropMobileEventListener);

        newShape.style.animationDelay = Math.random();
        wrapper.classList.add('img-wrapper');


        animationWrapper.classList.add('animation-wrapper');
        animationWrapper.id = 'animation-wrapper';

        animationWrapper.appendChild(newShape);
        wrapper.appendChild(animationWrapper);
        slots[i].appendChild(wrapper);
    }

    function dragAndDropMobileEventListener(e) {
        e.preventDefault();

        draggedImage = e.currentTarget;

        currentTarget = e.currentTarget;

        const parent = draggedImage.parentElement;

        offsetX = e.target.offsetWidth / 2;
        offsetY = e.target.offsetHeight / 2;

        // Temporarily position the image absolutely to move it with the cursor
        draggedImage.style.position = 'absolute';
        moveAt(e.touches[0].pageX, e.touches[0].pageY);

        function moveAt(pageX, pageY) {
            draggedImage.style.left = pageX - offsetX + 'px';
            draggedImage.style.top = pageY - offsetY + 'px';
        }

        draggedImage.addEventListener('touchmove', onTouchMove);
        draggedImage.addEventListener('touchend', onTouchEnd);

        function onTouchMove(event) {
            console.log('moved');
            moveAt(event.changedTouches[0].pageX, event.changedTouches[0].pageY);
        }

        function onTouchEnd(e) {
            const imgRect = draggedImage.getBoundingClientRect();

            //.getBoundingClientRect();
            if (
                !(imgRect.top - offsetY >= canvasRect.top &&
                    imgRect.left - offsetX >= canvasRect.left &&
                    imgRect.right + offsetY <= canvasRect.right &&
                    imgRect.bottom + offsetY <= canvasRect.bottom)
            ) {
                // The image is NOT inside the canvas
                console.log('Image is not inside the canvas');
                draggedImage.style.position = 'relative';
                draggedImage.style.left = 0 + 'px';
                draggedImage.style.top = 0 + 'px';

                draggedImage.removeEventListener('touchend', onTouchEnd);
            }

            else {
                canvasArea.appendChild(draggedImage);
                draggedImage.removeEventListener('touchmove', onTouchMove);
                console.log('Image left inside canvas');
                currentTarget.removeEventListener('touchstart', dragAndDropMobileEventListener);
                draggedImage.removeEventListener('touchstart', dragAndDropMobileEventListener);
                draggedImage.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('touchmove', onTouchMove);


                draggedImage.draggable = false;
                draggedImage.classList.remove('draggable');


                parent.classList.add('empty');
                fillSlots();
                nextPlayer();
                //updateSlots(playerImages);
            }
        }
    }


    function dragAndDropMouseEventListener(e) {
        e.preventDefault();

        draggedImage = e.currentTarget;
        currentTarget = e.currentTarget;

        const parent = draggedImage.parentElement;

        offsetX = e.offsetX;
        offsetY = e.offsetY;

        // Temporarily position the image absolutely to move it with the cursor
        draggedImage.style.position = 'absolute';
        moveAt(e.pageX, e.pageY);

        function moveAt(pageX, pageY) {
            draggedImage.style.left = pageX - offsetX + 'px';
            draggedImage.style.top = pageY - offsetY + 'px';
        }

        function resetPosition() {
            console.log('Saved!!!!');
            document.removeEventListener('mouseup', resetPosition);
            draggedImage.style.position = 'relative';
            draggedImage.style.left = 0 + 'px';
            draggedImage.style.top = 0 + 'px';
            draggedImage.onmouseup = null;
            document.removeEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }


        // Move the image on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // Drop the image, remove mousemove event
        draggedImage.onmouseup = function (event) {

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
                document.removeEventListener('mouseup', resetPosition);
                draggedImage.style.position = 'relative';
                draggedImage.style.left = 0 + 'px';
                draggedImage.style.top = 0 + 'px';

                draggedImage.onmouseup = null;
            }

            else {
                canvasArea.appendChild(draggedImage);

                console.log('Image left inside canvas');
                currentTarget.removeEventListener('mousedown', dragAndDropMouseEventListener);
                draggedImage.removeEventListener('mousedown', dragAndDropMouseEventListener);
                document.removeEventListener('mouseup', resetPosition);
                document.removeEventListener('mousemove', onMouseMove);

                draggedImage.onmouseup = null; // Remove the event listener to prevent potential memory leaks

                draggedImage.draggable = false;
                draggedImage.classList.remove('draggable');


                parent.classList.add('empty');
                fillSlots();
                nextPlayer();

            }
        };
        document.addEventListener('mouseup', resetPosition);
    }
    
    function game_music() {
        myAudio.play();
        if (myAudio.paused == true) {
            myAudio.play();
        }
    }
    let myAudio = new Audio();
    
    myAudio.src = './sound/trilha_initial.mp3';
    
    window.onload = setInterval(game_music, 1000 / 10); //10fps

    // Prevent default drag behavior
    canvasArea.addEventListener('dragstart', e => {
        e.preventDefault();
    });

    canvasArea.addEventListener('dragover', e => {
        e.preventDefault();
    });
};

function closeDialog() {
    const dialog = document.getElementById('npcDialog');
    dialog.style.display = 'none';
}

function popDialog(text, figure, buttonFunction = closeDialog) {
    const dialogText = document.getElementById('dialogText')
    const dialog = document.getElementById('npcDialog');
    dialog.style.display = 'flex';
    dialogText.textContent = text;
    const image = document.getElementById('sadPudding');
    image.src = 'img/' + figure;
    const dialogButton = document.getElementById('dialogButton');
    dialogButton.onclick = buttonFunction;
}

function popFinalDialog() {
    console.log('popped final dialog');
    closeDialog();
    popDialog('HAHAHAHA! Vocês me fazem rir!', 'pudding2.png')
}


